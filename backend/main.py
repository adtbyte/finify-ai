import os
import json
import asyncio
import numpy as np
from datetime import datetime
from fastapi import FastAPI, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from contextlib import asynccontextmanager
from jose import jwt, JWTError
from psycopg2.extras import RealDictCursor

# Internal Imports
from database import create_tables, get_db_connection
from auth import router as auth_router, get_current_user, SECRET_KEY, ALGORITHM
from portfolio import generate_portfolio, parse_portfolio_response
from services import MarketServices

# --- 1. LIFECYCLE MANAGEMENT ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Synchronizes database nodes on system boot."""
    print("📡 TERMINAL_STARTUP: Synchronizing database nodes...")
    try:
        # Ensures 'users' and 'portfolios' tables (with risk_score/analytics) exist
        create_tables()
    except Exception as e:
        print(f"❌ STARTUP_ERROR: Database sync failure: {e}")
    yield
    print("🛑 TERMINAL_SHUTDOWN: Cleaning up resources...")

app = FastAPI(title="Finify AI Terminal", lifespan=lifespan)

# --- 2. CORS SECURITY ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

# --- 3. LIVE PULSE WEBSOCKET (HEARTBEAT) ---
@app.websocket("/ws/pulse")
async def websocket_pulse(websocket: WebSocket):
    await websocket.accept()
    token = websocket.query_params.get("token")
    
    if not token:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    try:
        # Verify Identity before starting data stream
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_email = payload.get("sub")
        print(f"📡 WS_CONNECTED: Node {user_email} verified.")
        
        while True:
            pulse_data = {
                "status": "SYSTEM_HEALTHY",
                "node": "PUNE_MAH_IN_01",
                "timestamp": datetime.now().isoformat()
            }
            await websocket.send_json(pulse_data)
            await asyncio.sleep(5) 
    except (JWTError, WebSocketDisconnect):
        print("🛑 WS_DISCONNECTED: Connection closed.")
    except Exception as e:
        print(f"❌ WS_ERROR: {e}")
        await websocket.close(code=status.WS_1011_INTERNAL_ERROR)

# --- 4. CORE ENGINE: GENERATION & PERSISTENCE ---
@app.post("/portfolio/generate")
async def create_strategy(payload: dict, current_user: dict = Depends(get_current_user)):
    query = payload.get('query')
    if not query:
        raise HTTPException(status_code=400, detail="MISSING_PAYLOAD_QUERY")

    try:
        # 🤖 Stage 1: Agentic AI Synthesis
        raw_result = await generate_portfolio(query)
        parsed = parse_portfolio_response(raw_result.get('portfolio_text', ""))
        tickers = parsed.get('holdings', [])

        # 📊 Stage 2: Quantitative Analytics
        backtest_val = MarketServices.run_backtest(tickers)
        stress_data = MarketServices.run_stress_test(tickers)
        
        # 🛡️ Stage 3: Numeric Sanitization (PostgreSQL safety)
        def sanitize(val): 
            return float(val) if np.isfinite(val) else 0.0

        clean_backtest = sanitize(backtest_val)
        clean_risk = sanitize(raw_result.get('risk_score', 50.0))

        # 🏛️ Stage 4: Vault Write (Database Persistence)
        conn = get_db_connection()
        if not conn:
            raise HTTPException(status_code=503, detail="DATABASE_OFFLINE")
            
        try:
            with conn.cursor() as cur:
                # holdings_json ensures the list is stored as a valid JSON string
                holdings_json = json.dumps(tickers)
                cur.execute("""
                    INSERT INTO portfolios (user_id, goal, summary, holdings, rationale, risk_score)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING id
                """, (
                    current_user['id'], 
                    query, 
                    parsed.get('summary', ""), 
                    holdings_json,
                    parsed.get('rationale', ""), 
                    clean_risk
                ))
                conn.commit()
                
                return {
                    "status": "success", 
                    "data": {
                        **parsed,
                        "analytics": {
                            "backtest_1y": clean_backtest,
                            "stress_test": stress_data,
                            "risk_score": clean_risk
                        }
                    }
                }
        except Exception as db_err:
            if conn: conn.rollback()
            print(f"❌ VAULT_WRITE_ERROR: {db_err}")
            raise HTTPException(status_code=500, detail="VAULT_WRITE_FAILURE")
        finally:
            if conn: conn.close()
            
    except Exception as ai_err:
        print(f"❌ AI_CORE_FAILURE: {ai_err}")
        raise HTTPException(status_code=500, detail="STRATEGY_SYNTHESIS_FAILED")

# --- 5. VAULT MANAGEMENT: HISTORY, DELETE, EXPORT ---

@app.get("/portfolio/history")
async def get_history(current_user: dict = Depends(get_current_user)):
    """Retrieves all past strategies for the verified user using RealDictCursor."""
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=503, detail="DATABASE_OFFLINE")
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT id, goal, summary, holdings, rationale, risk_score, created_at 
                FROM portfolios WHERE user_id = %s 
                ORDER BY created_at DESC
            """, (current_user['id'],))
            return cur.fetchall()
    finally:
        conn.close()

@app.delete("/portfolio/{portfolio_id}")
async def delete_portfolio(portfolio_id: int, current_user: dict = Depends(get_current_user)):
    """Deletes a strategy from the vault after verifying user ownership."""
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=503, detail="DATABASE_OFFLINE")
    try:
        with conn.cursor() as cur:
            cur.execute(
                "DELETE FROM portfolios WHERE id = %s AND user_id = %s",
                (portfolio_id, current_user['id'])
            )
            if cur.rowcount == 0:
                raise HTTPException(status_code=404, detail="STRATEGY_NOT_FOUND")
            conn.commit()
            return {"status": "success", "message": "STRATEGY_DELETED"}
    except Exception as e:
        print(f"❌ VAULT_DELETE_ERROR: {e}")
        raise HTTPException(status_code=500, detail="DELETE_OPERATION_FAILED")
    finally:
        conn.close()

@app.post("/portfolio/export")
async def export_strategy(payload: dict):
    """Streams an institutional-grade PDF report to the frontend."""
    try:
        # Re-mapping payload for PDF engine compatibility
        pdf_data = {
            "goal": payload.get("goal"),
            "summary": payload.get("summary"),
            "holdings": payload.get("holdings"),
            "rationale": payload.get("rationale"),
            "backtest_perf": payload.get("analytics", {}).get("backtest_1y", 0),
            "stress_test": payload.get("analytics", {}).get("stress_test", {})
        }
        
        pdf_buffer = MarketServices.export_pdf_report(pdf_data)
        
        filename = f"Finify_Report_{datetime.now().strftime('%Y%m%d')}.pdf"
        return StreamingResponse(
            pdf_buffer, 
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={filename}",
                "Access-Control-Expose-Headers": "Content-Disposition"
            }
        )
    except Exception as e:
        print(f"❌ PDF_EXPORT_ERROR: {e}")
        raise HTTPException(status_code=500, detail="PDF_GENERATION_FAILED")

if __name__ == "__main__":
    import uvicorn
    # Launched via uvicorn for hot-reloading in development
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)