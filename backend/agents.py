import os
import json
import asyncio
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

# Initialize Gemini Client
# Using gemini-2.0-flash for high-speed agentic reasoning
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

class FinifyAgents:
    def __init__(self):
        self.model_id = "gemini-2.5-flash"
        
        # 🎭 Persona 1: The Strategist
        self.strategist_sys_msg = """
        You are the 'Finify Strategist'. Your goal is to build a high-performance 
        investment portfolio using ONLY the stock context provided.
        
        Rules:
        1. Only use tickers present in the context.
        2. Assign specific weights (%) totaling 100%.
        3. Format your response strictly with these headers:
           # SUMMARY
           # HOLDINGS (List Ticker: Weight% - Brief Reason)
           # RATIONALE
        """

        # ⚖️ Persona 2: The Risk Critic
        self.critic_sys_msg = """
        You are the 'Finify Risk Critic'. Your goal is to audit the Strategist's proposal.
        
        Audit Criteria:
        1. Sector Concentration: Is more than 40% in one sector?
        2. Ticker Validation: Did the strategist hallucinate a ticker not in context?
        3. Risk Alignment: Does this match the user's risk profile?
        
        Provide a RISK_SCORE (0-100) and a brief AUDIT_REPORT.
        """

    async def generate_with_risk_review(self, context_text: str, user_query: str, mode: str = "portfolio"):
        """
        Executes the Agentic Handshake: Strategist Draft -> Critic Audit.
        """
        try:
            # --- PASS 1: STRATEGIST GENERATION ---
            strategist_input = f"CONTEXT:\n{context_text}\n\nUSER_GOAL: {user_query}"
            
            draft_response = client.models.generate_content(
                model=self.model_id,
                contents=strategist_input,
                config=types.GenerateContentConfig(system_instruction=self.strategist_sys_msg)
            )
            
            draft_text = draft_response.text

            # --- PASS 2: CRITIC AUDIT ---
            critic_input = f"PROPOSED_STRATEGY:\n{draft_text}\n\nORIGINAL_CONTEXT:\n{context_text}"
            
            audit_response = client.models.generate_content(
                model=self.model_id,
                contents=critic_input,
                config=types.GenerateContentConfig(system_instruction=self.critic_sys_msg)
            )
            
            audit_text = audit_response.text

            # --- SYNTHESIS ---
            # We return both the portfolio and the audit findings
            return {
                "portfolio_text": draft_text,
                "risk_audit": audit_text,
                "risk_score": self._extract_risk_score(audit_text),
                "full_output": f"{draft_text}\n\n# RISK_AUDIT_REPORT\n{audit_text}"
            }

        except Exception as e:
            print(f"❌ AGENT_FAILURE: {e}")
            return {"error": str(e)}

    def _extract_risk_score(self, text: str) -> int:
        """Helper to find the numeric risk score in the critic's text."""
        import re
        match = re.search(r"RISK_SCORE:\s*(\d+)", text)
        return int(match.group(1)) if match else 50

# Global Instance for portfolio.py to import
agent_engine = FinifyAgents()

async def generate_with_risk_review(context_text: str, user_query: str, mode: str = "portfolio"):
    """Wrapper function to maintain the flat import structure."""
    return await agent_engine.generate_with_risk_review(context_text, user_query, mode)