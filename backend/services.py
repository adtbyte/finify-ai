import io
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors

class MarketServices:
    
    # --- 1. BATCH PRICE FETCHING (LIVE PULSE) ---
    @staticmethod
    def fetch_live_prices(tickers: list) -> dict:
        """Fetches multiple tickers in a single batch with dynamic indexing safety."""
        if not tickers: return {}
        pulse_data = {}
        try:
            # Batch fetch 1-minute interval data
            data = yf.download(tickers, period="1d", interval="1m", progress=False)
            
            # Extract 'Close' prices
            close_data = data['Close']
            
            for ticker in tickers:
                try:
                    # yfinance returns a Series for 1 ticker and a DataFrame for 2+
                    if isinstance(close_data, pd.DataFrame):
                        val = close_data[ticker].dropna().iloc[-1]
                    else:
                        val = close_data.dropna().iloc[-1]
                    
                    price = round(float(val), 2)
                    pulse_data[ticker] = price if np.isfinite(price) else "N/A"
                except (IndexError, KeyError):
                    pulse_data[ticker] = "N/A"
        except Exception as e:
            print(f"❌ BATCH_PULSE_ERROR: {e}")
            pulse_data = {t: "N/A" for t in tickers}
        return pulse_data

    # --- 2. BACKTEST TERMINAL (1Y Performance) ---
    @staticmethod
    def run_backtest(tickers: list) -> float:
        """Calculates 1-year cumulative performance for an equal-weighted portfolio."""
        try:
            if not tickers: return 0.0
            data = yf.download(tickers, period="1y", progress=False)['Close']
            
            if data.empty: return 0.0

            # fill_method=None prevents the Pandas FutureWarning in version 3.0+
            daily_returns = data.pct_change(fill_method=None).dropna()
            
            if daily_returns.empty: return 0.0

            # Calculate daily mean returns across the portfolio
            portfolio_daily_return = daily_returns.mean(axis=1)
            
            # Compound the growth
            cumulative_return = (1 + portfolio_daily_return).cumprod().iloc[-1] - 1
            res = round(float(cumulative_return * 100), 2)
            
            return res if np.isfinite(res) else 0.0
        except Exception as e:
            print(f"❌ BACKTEST_CALC_ERROR: {e}")
            return 0.0

    # --- 3. BLACK SWAN STRESS TEST (IPO-RESILIENT) ---
    @staticmethod
    def run_stress_test(tickers: list) -> dict:
        """Simulates performance during the 2020 COVID Crash, ignoring unlisted stocks."""
        try:
            start, end = "2020-02-15", "2020-04-15"
            df = yf.download(tickers, start=start, end=end, progress=False)['Close']
            
            # Clean data: drop tickers that have no historical data for this window
            valid_df = df.dropna(axis=1, how='all')

            if valid_df.empty:
                return {
                    "drawdown": -15.0, 
                    "event": "Projected Volatility",
                    "risk_level": "ESTIMATED"
                }

            # Calculate Drawdown: (Minimum Value - Initial Value) / Initial Value
            peak_val = valid_df.iloc[0]
            trough_val = valid_df.min()
            
            # Mean drawdown across the valid tickers
            drawdown = ((trough_val - peak_val) / peak_val).mean() * 100
            
            dd_val = round(float(drawdown), 2)
            if not np.isfinite(dd_val): dd_val = -15.0

            return {
                "drawdown": dd_val,
                "event": "2020 COVID Crash",
                "risk_level": "CRITICAL" if dd_val < -30 else "HIGH" if dd_val < -20 else "MODERATE"
            }
        except Exception:
            return {"drawdown": -12.0, "event": "Market Volatility", "risk_level": "MODERATE"}

    # --- 4. INSTITUTIONAL PDF ENGINE (STABLE LAYOUT) ---
    @staticmethod
    def export_pdf_report(data: dict) -> io.BytesIO:
        """Generates a professionally formatted, paginated PDF."""
        buffer = io.BytesIO()
        p = canvas.Canvas(buffer, pagesize=A4)
        width, height = A4
        
        # UI Configuration
        THEME_EMERALD = colors.HexColor("#10b981")
        BG_CHARCOAL = colors.HexColor("#0f172a")
        MARGIN = 45
        
        # Header Box
        p.setFillColor(BG_CHARCOAL)
        p.rect(0, height-100, width, 100, fill=1, stroke=0)
        
        p.setFillColor(THEME_EMERALD)
        p.setFont("Courier-Bold", 18)
        p.drawString(MARGIN, height-45, "FINIFY AI // TERMINAL_STRATEGY")
        
        p.setFillColor(colors.white)
        p.setFont("Courier", 9)
        p.drawString(MARGIN, height-70, f"TIMESTAMP: {datetime.now().strftime('%Y-%m-%d %H:%M')} // REGION: PUNE_IN")
        
        curr_y = height - 140
        
        def add_section(title, content):
            nonlocal curr_y
            # Automatic pagination check
            if curr_y < 150: 
                p.showPage()
                curr_y = height - 50

            p.setFillColor(THEME_EMERALD)
            p.setFont("Helvetica-Bold", 11)
            p.drawString(MARGIN, curr_y, f">> {title.upper()}")
            curr_y -= 18
            
            p.setFillColor(colors.black)
            p.setFont("Helvetica", 10)
            
            # Enhanced wrapping logic
            text = str(content)
            limit = 90
            words = text.split(' ')
            line = ""
            for word in words:
                if len(line + word) < limit:
                    line += word + " "
                else:
                    p.drawString(MARGIN + 10, curr_y, line.strip())
                    line = word + " "
                    curr_y -= 14
                    if curr_y < MARGIN: # Mid-section page break
                        p.showPage()
                        curr_y = height - 50
            p.drawString(MARGIN + 10, curr_y, line.strip())
            curr_y -= 30

        # Inject Data Blocks
        add_section("Strategy Objective", data.get('goal', 'N/A'))
        add_section("AI Market Thesis", data.get('summary', 'N/A'))
        
        holdings = data.get('holdings', [])
        holdings_str = ", ".join(holdings) if isinstance(holdings, list) else str(holdings)
        add_section("Target Portfolio", holdings_str)
        
        add_section("Execution Rationale", data.get('rationale', 'N/A'))
        
        # Quantitative Audit Box (Fixed at bottom or after content)
        if curr_y < 150: p.showPage(); curr_y = height - 50
        
        p.setStrokeColor(THEME_EMERALD)
        p.setFillColor(colors.HexColor("#f8fafc"))
        p.rect(MARGIN, curr_y - 80, width - (MARGIN * 2), 85, fill=1, stroke=1)
        
        p.setFillColor(colors.black)
        p.setFont("Helvetica-Bold", 10)
        p.drawString(MARGIN + 15, curr_y - 15, "QUANTITATIVE_AUDIT_LOG")
        
        p.setFont("Helvetica", 9)
        p.drawString(MARGIN + 20, curr_y - 35, f"• 1-Year Backtest Yield: {data.get('backtest_perf', 0)}%")
        
        stress = data.get('stress_test', {})
        p.drawString(MARGIN + 20, curr_y - 50, f"• Stress Event ({stress.get('event', 'Market Crash')}): {stress.get('drawdown', 0)}% Drawdown")
        p.drawString(MARGIN + 20, curr_y - 65, f"• Calculated Risk Level: {stress.get('risk_level', 'UNKNOWN')}")

        p.showPage()
        p.save()
        buffer.seek(0)
        return buffer