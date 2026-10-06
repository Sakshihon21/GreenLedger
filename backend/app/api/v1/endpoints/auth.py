from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.user import UserRegister, UserLogin, UserResponse
from app.services.auth_service import register_new_user, authenticate_user
from app.core.security import create_access_token
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()


@router.post("/register", status_code=status.HTTP_201_CREATED, summary="Register a new user")
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    """
    Register a new GreenLedger user account (Organization, Buyer, Seller, or Monitoring Authority).
    """
    user = register_new_user(db, user_in)
    return {
        "success": True,
        "message": "User registered successfully.",
        "data": UserResponse.model_validate(user)
    }


@router.post("/login", summary="Authenticate user and return JWT access token")
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate user with email and password, returning JWT access token.
    """
    user = authenticate_user(db, credentials)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email address or password.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    access_token = create_access_token(subject=user.email, role=user.role.value)
    user_data = UserResponse.model_validate(user)

    return {
        "success": True,
        "message": "Login successful.",
        "data": {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user_data
        }
    }


@router.get("/me", summary="Get current authenticated user profile")
def read_current_user(current_user: User = Depends(get_current_user)):
    """
    Get profile information of the currently authenticated user.
    """
    return {
        "success": True,
        "message": "User profile retrieved successfully.",
        "data": UserResponse.model_validate(current_user)
    }
