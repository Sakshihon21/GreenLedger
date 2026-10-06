import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.main import app
from app.db.database import Base
from app.db.session import get_db
from app.core.security import get_password_hash, verify_password, create_access_token, decode_access_token

# In-memory SQLite database with StaticPool for test persistence
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


def test_password_hashing():
    """Verify password hashing and verification."""
    password = "GreenLedgerSecurePass123!"
    hashed = get_password_hash(password)
    assert hashed != password
    assert verify_password(password, hashed) is True
    assert verify_password("WrongPassword", hashed) is False


def test_jwt_token_operations():
    """Verify JWT token encoding and decoding."""
    token = create_access_token(subject="test@greenledger.org", role="ORGANIZATION")
    assert token is not None
    payload = decode_access_token(token)
    assert payload is not None
    assert payload["sub"] == "test@greenledger.org"
    assert payload["role"] == "ORGANIZATION"


def test_user_registration_api():
    """Test user registration endpoint POST /api/v1/auth/register."""
    payload = {
        "name": "Eco Solutions Inc",
        "email": "contact@ecosolutions.org",
        "password": "Password123!",
        "role": "ORGANIZATION",
        "organization_name": "Eco Solutions Enterprise"
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["data"]["email"] == "contact@ecosolutions.org"
    assert data["data"]["role"] == "ORGANIZATION"


def test_duplicate_email_registration_fails():
    """Test registering an existing email returns 409 Conflict."""
    payload = {
        "name": "Duplicate User",
        "email": "contact@ecosolutions.org",
        "password": "Password123!",
        "role": "BUYER"
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 409
    data = response.json()
    assert "already exists" in data["detail"].lower()


def test_user_login_api():
    """Test user login endpoint POST /api/v1/auth/login."""
    payload = {
        "email": "contact@ecosolutions.org",
        "password": "Password123!"
    }
    response = client.post("/api/v1/auth/login", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "access_token" in data["data"]
    assert data["data"]["token_type"] == "bearer"
    assert data["data"]["user"]["email"] == "contact@ecosolutions.org"


def test_get_current_user_me_endpoint():
    """Test authenticated profile endpoint GET /api/v1/auth/me."""
    login_res = client.post("/api/v1/auth/login", json={
        "email": "contact@ecosolutions.org",
        "password": "Password123!"
    })
    token = login_res.json()["data"]["access_token"]

    me_res = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    me_data = me_res.json()
    assert me_data["success"] is True
    assert me_data["data"]["email"] == "contact@ecosolutions.org"
