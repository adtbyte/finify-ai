import asyncio
from sqlalchemy.ext.asyncio import create_async_engine

DATABASE_URL = "postgresql+asyncpg://postgres:KAditi@24@localhost:5432/finify"

async def test():
    engine = create_async_engine(DATABASE_URL)
    async with engine.connect() as conn:
        result = await conn.execute("SELECT 1")
        print("Connection OK:", result.scalar())

asyncio.run(test())