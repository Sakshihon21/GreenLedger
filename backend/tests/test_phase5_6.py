import pytest
from app.core.security import create_access_token
from app.models.enums import UserRole
from app.services.auth_service import register_new_user, get_user_by_email
from app.schemas.user import UserRegister


@pytest.fixture
def auth_headers(db):
    if not get_user_by_email(db, "org@greenledger.org"):
        register_new_user(db, UserRegister(
            name="Green Enterprise Org",
            email="org@greenledger.org",
            password="GreenLedger123!",
            role=UserRole.ORGANIZATION
        ))

    token = create_access_token(subject="org@greenledger.org", role=UserRole.ORGANIZATION.value)
    return {"Authorization": f"Bearer {token}"}


def test_device_registration(client, auth_headers):
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


def test_list_devices(client, auth_headers):
    """Test fetching all registered IoT devices."""
    response = client.get("/api/v1/devices", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)


def test_sensor_reading_ingestion(client, auth_headers):
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


def test_invalid_sensor_reading_rejected(client, auth_headers):
    """Test out-of-bounds CO2 ppm payload is rejected with 422 Unprocessable Entity."""
    payload = {
        "device_id": "ESP32-TEST-001",
        "co2_ppm": 99999.0  # max allowed is 10000
    }
    response = client.post("/api/v1/sensors/readings", json=payload, headers=auth_headers)
    assert response.status_code == 422


def test_dashboard_summary(client, auth_headers):
    """Test dashboard summary metrics calculation."""
    response = client.get("/api/v1/dashboard/summary", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "active_devices" in data["data"]
    assert "avg_co2_ppm" in data["data"]
    assert "tracked_emissions_kg" in data["data"]
