import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.main import app
from app.db.database import Base
from app.db.session import get_db
from app.core.security import create_access_token
from app.models.enums import UserRole
from app.services.auth_service import register_new_user, get_user_by_email
from app.schemas.user import UserRegister

# In-memory SQLite database for phase 5 & 6 testing
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


@pytest.fixture
def auth_headers():
    # Seed user in test database if not present
    db = TestingSessionLocal()
    if not get_user_by_email(db, "org@greenledger.org"):
        register_new_user(db, UserRegister(
            name="Green Enterprise Org",
            email="org@greenledger.org",
            password="GreenLedger123!",
            role=UserRole.ORGANIZATION
        ))
    db.close()

    token = create_access_token(subject="org@greenledger.org", role=UserRole.ORGANIZATION.value)
    return {"Authorization": f"Bearer {token}"}


def test_device_registration(auth_headers):
    """Test registering a new IoT device."""
    payload = {
        "device_id": "ESP32-TEST-001",
        "device_name": "Main Factory CO2 Sensor",
        "location": "Building A, Floor 2",
        "mqtt_topic": "greenledger/sensors/ESP32-TEST-001"
    }
    response = client.post("/api/v1/devices", json=payload, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["data"]["device_id"] == "ESP32-TEST-001"


def test_list_devices(auth_headers):
    """Test fetching all registered IoT devices."""
    response = client.get("/api/v1/devices", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)


def test_sensor_reading_ingestion(auth_headers):
    """Test ingesting a valid environmental sensor payload."""
    payload = {
        "device_id": "ESP32-TEST-001",
        "co2_ppm": 450.5,
        "temperature": 25.4,
        "humidity": 55.2,
        "pressure": 1013.25
    }
    response = client.post("/api/v1/sensors/readings", json=payload, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["data"]["co2_ppm"] == 450.5


def test_invalid_sensor_reading_rejected(auth_headers):
    """Test out-of-bounds CO2 ppm payload is rejected with 422 Unprocessable Entity."""
    payload = {
        "device_id": "ESP32-TEST-001",
        "co2_ppm": 99999.0  # max allowed is 10000
    }
    response = client.post("/api/v1/sensors/readings", json=payload, headers=auth_headers)
    assert response.status_code == 422


def test_dashboard_summary(auth_headers):
    """Test dashboard summary metrics calculation."""
    response = client.get("/api/v1/dashboard/summary", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "active_devices" in data["data"]
    assert "avg_co2_ppm" in data["data"]
    assert "tracked_emissions_kg" in data["data"]
