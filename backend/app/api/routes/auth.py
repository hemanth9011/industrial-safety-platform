from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
import uuid

from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.user import User, UserRole
from app.schemas.auth import LoginRequest, TokenResponse, UserResponse

router = APIRouter()

# Demo users
DEMO_USERS = {
    "admin": {"password": "admin123", "role": UserRole.ADMIN, "email": "admin@isip.local"},
    "supervisor": {"password": "super123", "role": UserRole.SUPERVISOR, "email": "supervisor@isip.local"},
    "operator": {"password": "operator123", "role": UserRole.OPERATOR, "email": "operator@isip.local"},
    "auditor": {"password": "auditor123", "role": UserRole.AUDITOR, "email": "auditor@isip.local"},
}

@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """User login endpoint"""
    # Check demo users first
    if request.username in DEMO_USERS:
        demo_user = DEMO_USERS[request.username]
        if demo_user["password"] == request.password:
            token = create_access_token({"sub": request.username, "role": demo_user["role"]})
            return {
                "access_token": token,
                "token_type": "bearer",
                "user": {
                    "username": request.username,
                    "email": demo_user["email"],
                    "role": demo_user["role"],
                }
            }
    
    # Check database users
    user = db.query(User).filter(User.username == request.username).first()
    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = create_access_token({"sub": user.username, "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "username": user.username,
            "email": user.email,
            "role": user.role,
        }
    }

@router.post("/register", response_model=UserResponse)
async def register(request: LoginRequest, db: Session = Depends(get_db)):
    """User registration endpoint"""
    # Check if user exists
    existing_user = db.query(User).filter(User.username == request.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    # Create new user
    user = User(
        id=str(uuid.uuid4()),
        username=request.username,
        email=f"{request.username}@isip.local",
        hashed_password=get_password_hash(request.password),
        role=UserRole.OPERATOR,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return {
        "username": user.username,
        "email": user.email,
        "role": user.role,
    }

@router.get("/me", response_model=UserResponse)
async def get_current_user(token: str = None):
    """Get current user info"""
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return {"username": "demo_user", "email": "demo@isip.local", "role": "operator"}
