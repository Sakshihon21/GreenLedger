import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings
from app.db.database import check_db_connection
from app.db.session import get_db

client = TestClient(app)


def test_settings_loading():
    """Test that core configuration settings load properly from .env or defaults."""
    assert settings.PROJECT_NAME == "GreenLedger Backend API"
    assert settings.VERSION == "1.0.0"
    assert settings.API_V1_STR == "/api/v1"
    assert isinstance(settings.DATABASE_URL, str)
    assert isinstance(settings.SECRET_KEY, str)


def test_root_health_check():
    """Test the root /health endpoint returns 200 and expected payload."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["name"] == settings.PROJECT_NAME
    assert data["data"]["version"] == settings.VERSION


def test_api_v1_health_check():
    """Test the /api/v1/health endpoint returns health summary and DB connectivity status."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "database" in data["data"]
    assert "connected" in data["data"]["database"]
    assert "details" in data["data"]["database"]


def test_check_db_connection_function():
    """Test that check_db_connection returns a tuple of (bool, str)."""
    is_connected, msg = check_db_connection()
    assert isinstance(is_connected, bool)
    assert isinstance(msg, str)


def test_get_db_session_lifecycle():
    """Test that get_db yields a database session and closes it properly."""
    db_gen = get_db()
    session = next(db_gen)
    assert session is not None
    # Close the generator
    with pytest.raises(StopIteration):
        next(db_gen)
