import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
from contextlib import contextmanager

# 1. LOAD CONFIGURATION
load_dotenv()

def get_db_connection():
    """
    Establishes a connection to the PostgreSQL cluster.
    Supports both DATABASE_URL (Cloud) and individual params (Local).
    """
    try:
        db_url = os.getenv("DATABASE_URL")
        
        if db_url:
            # Handle 'postgres://' vs 'postgresql://' for SQLAlchemy/Psycopg2 compatibility
            if db_url.startswith("postgres://"):
                db_url = db_url.replace("postgres://", "postgresql://", 1)
            return psycopg2.connect(db_url, cursor_factory=RealDictCursor)
        
        return psycopg2.connect(
            dbname=os.getenv("DB_NAME", "postgres"),
            user=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASSWORD"),
            host=os.getenv("DB_HOST", "localhost"),
            port=os.getenv("DB_PORT", "5432"),
            cursor_factory=RealDictCursor,
            connect_timeout=10
        )
    except Exception as e:
        print(f"❌ DATABASE_CONNECTION_FAILED: {e}")
        return None

@contextmanager
def get_db():
    """Context manager for safe database operations within routes."""
    conn = get_db_connection()
    if conn is None:
        raise RuntimeError("CRITICAL: Database node is offline.")
    try:
        yield conn
    finally:
        conn.close()

def create_tables():
    """
    Initializes the schema and performs 'Self-Healing' migrations.
    This ensures that if a column is missing in an existing table, it gets added.
    """
    conn = get_db_connection()
    if not conn:
        print("⚠️ SCHEMA_SYNC_SKIPPED: Connection unavailable.")
        return
        
    try:
        with conn.cursor() as cur:
            # 🆔 Table 1: Identity Nodes
            cur.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    hashed_password TEXT NOT NULL,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            """)

            # 🛡️ Table 2: Vault Nodes (Stored AI Strategies)
            # We use JSONB for 'holdings' to handle lists natively.
            cur.execute("""
                CREATE TABLE IF NOT EXISTS portfolios (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                    goal TEXT NOT NULL,
                    summary TEXT,
                    holdings JSONB, 
                    rationale TEXT,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            """)

            # 🛠️ SELF-HEALING MIGRATIONS
            # This block checks for missing columns and adds them if they don't exist.
            
            # Add 'risk_score' if missing
            cur.execute("""
                DO $$ 
                BEGIN 
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                                   WHERE table_name='portfolios' AND column_name='risk_score') THEN
                        ALTER TABLE portfolios ADD COLUMN risk_score FLOAT DEFAULT 50.0;
                        RAISE NOTICE 'Added missing column: risk_score';
                    END IF;
                END $$;
            """)

            # Add 'analytics' if missing (for storing stress tests/backtests)
            cur.execute("""
                DO $$ 
                BEGIN 
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                                   WHERE table_name='portfolios' AND column_name='analytics') THEN
                        ALTER TABLE portfolios ADD COLUMN analytics JSONB DEFAULT '{}'::jsonb;
                        RAISE NOTICE 'Added missing column: analytics';
                    END IF;
                END $$;
            """)
        
        conn.commit()
        print("✅ DATABASE_NODES_SYNCED: Terminal schema is operational and up-to-date.")
        
    except Exception as e:
        if conn:
            conn.rollback()
        print(f"❌ SCHEMA_SYNC_ERROR: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    # Allows manual schema initialization via 'python database.py'
    create_tables()