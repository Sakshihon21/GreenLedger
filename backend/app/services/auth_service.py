from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.models.organization import Organization
from app.models.enums import UserRole
from app.schemas.user import UserRegister, UserLogin
from app.core.security import get_password_hash, verify_password


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Fetch user record by email."""
    return db.query(User).filter(User.email == email.lower()).first()


def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    """Fetch user record by ID."""
    return db.query(User).filter(User.id == user_id).first()


def register_new_user(db: Session, user_in: UserRegister) -> User:
    """
    Registers a new user in PostgreSQL database.
    Prevents public registration of ADMIN role.
    Creates an associated Organization if applicable.
    """
    # Restrict public ADMIN registration
    if user_in.role == UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Public registration for ADMIN role is not allowed."
        )

    # Check duplicate email
    existing_user = get_user_by_email(db, user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email address already exists."
        )

    # Handle Organization linkage
    org_id = None
    if user_in.role == UserRole.ORGANIZATION or user_in.organization_name:
        org_name = user_in.organization_name or f"{user_in.name}'s Organization"
        org = db.query(Organization).filter(Organization.name == org_name).first()
        if not org:
            org = Organization(name=org_name, email=user_in.email)
            db.add(org)
            db.flush()  # obtain org.id
        org_id = org.id

    # Create new User
    db_user = User(
        name=user_in.name,
        email=user_in.email.lower(),
        password_hash=get_password_hash(user_in.password),
        role=user_in.role,
        organization_id=org_id,
        is_active=True
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, credentials: UserLogin) -> Optional[User]:
    """
    Verifies user credentials against stored bcrypt password hash.
    """
    user = get_user_by_email(db, credentials.email)
    if not user:
        return None
    if not verify_password(credentials.password, user.password_hash):
        return None
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User account is deactivated."
        )
    return user
