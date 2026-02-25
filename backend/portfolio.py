import os
import json
import pickle
import re
import asyncio
import numpy as np
from typing import List, Dict, Any
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv

# Local import from your agents.py
from agents import generate_with_risk_review

load_dotenv()

# --- 1. SINGLETON VECTOR ENGINE ---
try:
    # Singleton pattern ensures the model stays in memory for fast RAG lookups
    embedder = SentenceTransformer('all-MiniLM-L6-v2')
except Exception as e:
    print(f"⚠️ MODEL_LOAD_ERROR: {e}")
    embedder = None

class RAGEngine:
    def __init__(self):
        self.stocks_json = "stocks.json"
        self.cache_file = "embeddings_cache.pkl"
        self.stocks = self._load_stocks()
        self.embeddings = self._load_embeddings()

    def _load_stocks(self) -> List[Dict]:
        if not os.path.exists(self.stocks_json):
            print("❌ DATABASE_NOT_FOUND: stocks.json is missing.")
            return []
        with open(self.stocks_json, 'r') as f:
            return json.load(f)

    def _load_embeddings(self):
        if os.path.exists(self.cache_file):
            with open(self.cache_file, "rb") as f:
                return pickle.load(f)
        
        if not self.stocks or embedder is None:
            return None
            
        print("🧠 VECTORIZING_TERMINAL_CORPUS: Creating semantic map...")
        texts = [
            f"{s['ticker']} {s.get('sector', '')}: {s.get('description', '')}" 
            for s in self.stocks
        ]
        embs = embedder.encode(texts, normalize_embeddings=True)
        
        with open(self.cache_file, "wb") as f:
            pickle.dump(embs, f)
        return embs

    def get_context(self, query: str, top_k: int = 12) -> str:
        if self.embeddings is None or embedder is None:
            return "Local market context unavailable."
        
        q_vec = embedder.encode([query], normalize_embeddings=True)
        sims = cosine_similarity(q_vec, self.embeddings)[0]
        top_idx = np.argsort(sims)[-top_k:][::-1]
        
        context_parts = []
        for i in top_idx:
            s = self.stocks[i]
            context_parts.append(
                f"TICKER: {s['ticker']} | SECTOR: {s.get('sector', 'N/A')} | INFO: {s.get('description', 'N/A')}"
            )
        
        return "\n\n".join(context_parts)

engine = RAGEngine()

# --- 2. CORE STRATEGY GENERATOR ---

async def generate_portfolio(query: str):
    context = engine.get_context(query)
    
    # 📝 INJECTED PROMPT HARDENING: We pass a hidden instruction to the agent
    prompt_enhancement = (
        "\n\nCRITICAL_INSTRUCTION: You must use the following headers exactly: "
        "[SUMMARY], [HOLDINGS], and [RATIONALE]. "
        "Under [HOLDINGS], list tickers only in 'TICKER.NS' format. "
        "Do not bold the tickers."
    )
    
    result = await generate_with_risk_review(
        context_text=context,
        user_query=query + prompt_enhancement,
        mode="terminal"
    )
    
    return result

# --- 3. ROBUST OUTPUT PARSER (HARDENED) ---

def parse_portfolio_response(text: str) -> Dict[str, Any]:
    """
    Bulletproof parser that separates narrative from technical tickers.
    """
    # 1. Standardize text to prevent case-mismatch issues
    upper_text = text.upper()
    
    # 2. Extract Narrative Blocks using broader markers
    def extract_block(markers, default_msg):
        for m in markers:
            if m in upper_text:
                parts = re.split(re.escape(m), text, flags=re.IGNORECASE)
                if len(parts) > 1:
                    # Capture everything until the next block marker or end of string
                    return re.split(r'\[', parts[1])[0].strip()
        return default_msg

    summary = extract_block(["[SUMMARY]", "SUMMARY:", "## SUMMARY"], "Analysis complete.")
    rationale = extract_block(["[RATIONALE]", "RATIONALE:", "## RATIONALE"], text)

    # 3. STRICT TICKER EXTRACTION
    # Only matches 2-10 uppercase letters + .NS or .BO
    # This ignores words like 'GROWTH', '25%', or 'STRATEGY'
    ticker_pattern = r'\b[A-Z0-9\-]{2,10}\.(?:NS|BO)\b'
    
    found_tickers = re.findall(ticker_pattern, upper_text)
    
    # Clean up results
    clean_tickers = list(dict.fromkeys([t.strip() for t in found_tickers]))

    return {
        "summary": summary,
        "holdings": clean_tickers,
        "rationale": rationale
    }