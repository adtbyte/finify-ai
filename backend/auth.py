import os
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv

# Local import from your database setup
from database import get_db_connection

load_dotenv()

# --- 1. SECURITY CONFIGURATION ---
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "finify_lavender_secure_node_8822")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440 # 24 Hours for a professional terminal session

# Password Hashing Engine
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
# This tells FastAPI where to look for the token during "Depends" calls
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

router = APIRouter(prefix="/auth", tags=["Identity Node"])

# --- 2. MODELS ---
class UserRegister(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# --- 3. SECURITY HELPERS ---
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# --- 4. IDENTITY GUARD (Dependency) ---
async def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Decodes the JWT and verifies the user exists in the PostgreSQL vault.
    This function is used as a 'Gatekeeper' for protected routes.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="TERMINAL_ACCESS_DENIED: Invalid or expired credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=503, detail="DATABASE_OFFLINE")
    
    try:
        with conn.cursor() as cur:
            # We fetch ID and Email to use in portfolio tracking
            cur.execute("SELECT id, email FROM users WHERE email = %s", (email,))
            user = cur.fetchone()
            if not user:
                raise credentials_exception
            return dict(user) # Returns a dictionary thanks to RealDictCursor
    finally:
        conn.close()

# --- 5. ROUTES ---

@router.post("/register")
async def register_node(user_in: UserRegister):
    """Initializes a new Identity Node in the database."""
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=503, detail="DATABASE_OFFLINE")
    try:
        with conn.cursor() as cur:
            # Check if identity exists
            cur.execute("SELECT id FROM users WHERE email = %s", (user_in.email,))
            if cur.fetchone():
                raise HTTPException(status_code=400, detail="IDENTITY_EXISTS")
            
            hashed_pw = get_password_hash(user_in.password)
            cur.execute(
                "INSERT INTO users (email, hashed_password) VALUES (%s, %s)",
                (user_in.email, hashed_pw)
            )
            conn.commit()
            return {"status": "success", "message": "IDENTITY_STORED"}
    except Exception as e:
        print(f"Auth Error: {e}")
        raise HTTPException(status_code=500, detail="INTERNAL_AUTH_FAILURE")
    finally:
        conn.close()

@router.post("/login", response_model=Token)
async def login_node(form_data: OAuth2PasswordRequestForm = Depends()):
    """Verifies credentials and issues a Terminal Access Token."""
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=503, detail="DATABASE_OFFLINE")
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT email, hashed_password FROM users WHERE email = %s", (form_data.username,))
            user = cur.fetchone()
            
            if not user or not verify_password(form_data.password, user['hashed_password']):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="INVALID_CREDENTIALS"
                )
            
            access_token = create_access_token(data={"sub": user['email']})
            return {"access_token": access_token, "token_type": "bearer"}
    finally:
        conn.close()

@router.get("/me")
async def get_identity_profile(current_user: dict = Depends(get_current_user)):
    """Returns the current active operator's profile."""
    return current_user