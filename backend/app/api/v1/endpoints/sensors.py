from typing import List, Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_user, require_roles
from app.models.user import User
from app.models.enums import UserRole
from app.schemas.sensor import SensorReadingCreate, SensorReadingResponse
from app.services.sensor_service import ingest_sensor_reading, get_sensor_readings

router = APIRouter()


@router.post("/readings", status_code=status.HTTP_201_CREATED, summary="Ingest IoT sensor reading")
def post_sensor_reading(
    reading_in: SensorReadingCreate,
    current_user: User = Depends(require_roles([UserRole.ORGANIZATION, UserRole.SELLER, UserRole.ADMIN])),
    db: Session = Depends(get_db)
):
    """
    Ingests environmental sensor readings (CO2 ppm, temperature, humidity, pressure).
    Restricted to ORGANIZATION, SELLER, and ADMIN roles.
    """
    org_id = current_user.organization_id if current_user else None
    reading = ingest_sensor_reading(db, reading_in, organization_id=org_id)
    return {
        "success": True,
        "message": "Sensor reading recorded successfully.",
        "data": SensorReadingResponse.model_validate(reading)
    }


@router.get("/readings", summary="Get recent sensor readings")
def list_sensor_readings(
    limit: int = 50,
    current_user: User = Depends(require_roles([UserRole.ORGANIZATION, UserRole.SELLER, UserRole.ADMIN, UserRole.MONITORING_AUTHORITY])),
    db: Session = Depends(get_db)
):
    """
    Fetch recent time-series environmental sensor readings for the organization.
    Restricted to ORGANIZATION, SELLER, MONITORING_AUTHORITY, and ADMIN roles.
    """
    org_id = current_user.organization_id or 1
    readings = get_sensor_readings(db, org_id, limit=limit)
    return {
        "success": True,
        "message": "Sensor readings retrieved successfully.",
        "data": [SensorReadingResponse.model_validate(r) for r in readings]
    }
