from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status
from app.models.device import IoTDevice
from app.models.sensor_reading import SensorReading
from app.schemas.sensor import SensorReadingCreate


def ingest_sensor_reading(
    db: Session,
    reading_in: SensorReadingCreate,
    organization_id: Optional[int] = None
) -> SensorReading:
    """
    Ingests and validates a sensor reading from an IoT device (HTTP API or MQTT subscriber).
    Updates device status and last_seen timestamp.
    """
    device = db.query(IoTDevice).filter(IoTDevice.device_id == reading_in.device_id).first()
    
    if not device:
        # Auto-create device if unknown device_id sends data, or raise error
        if not organization_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"IoT device with ID '{reading_in.device_id}' is not registered."
            )
        device = IoTDevice(
            device_id=reading_in.device_id,
            organization_id=organization_id,
            device_name=f"Sensor {reading_in.device_id}",
            status="ACTIVE",
            created_at=datetime.utcnow()
        )
        db.add(device)
        db.flush()

    org_id = organization_id or device.organization_id

    # Update last_seen and status
    device.last_seen = datetime.utcnow()
    device.status = "ACTIVE"

    reading_time = reading_in.timestamp or datetime.utcnow()

    reading = SensorReading(
        device_id=device.id,
        organization_id=org_id,
        co2_ppm=reading_in.co2_ppm,
        temperature=reading_in.temperature,
        humidity=reading_in.humidity,
        pressure=reading_in.pressure,
        timestamp=reading_time,
        received_at=datetime.utcnow()
    )

    db.add(reading)
    db.commit()
    db.refresh(reading)
    return reading


def get_sensor_readings(
    db: Session,
    organization_id: int,
    limit: int = 50
) -> List[SensorReading]:
    """Retrieve recent sensor readings for an organization."""
    return (
        db.query(SensorReading)
        .filter(SensorReading.organization_id == organization_id)
        .order_by(SensorReading.timestamp.desc())
        .limit(limit)
        .all()
    )


def get_dashboard_summary(db: Session, organization_id: int) -> dict:
    """Calculate summary metrics for an organization dashboard."""
    active_devices_count = (
        db.query(func.count(IoTDevice.id))
        .filter(IoTDevice.organization_id == organization_id, IoTDevice.status == "ACTIVE")
        .scalar() or 0
    )

    total_devices_count = (
        db.query(func.count(IoTDevice.id))
        .filter(IoTDevice.organization_id == organization_id)
        .scalar() or 0
    )

    total_readings = (
        db.query(func.count(SensorReading.id))
        .filter(SensorReading.organization_id == organization_id)
        .scalar() or 0
    )

    avg_co2 = (
        db.query(func.avg(SensorReading.co2_ppm))
        .filter(SensorReading.organization_id == organization_id)
        .scalar() or 400.0  # default baseline ambient CO2
    )

    latest_reading = (
        db.query(SensorReading)
        .filter(SensorReading.organization_id == organization_id)
        .order_by(SensorReading.timestamp.desc())
        .first()
    )

    # Estimate calculated CO2 emissions tracked (kg CO2e)
    # Approx: (avg_co2_ppm - baseline_400) * volume_factor
    tracked_emissions_kg = max(0.0, (avg_co2 - 400.0) * 1.5 * total_readings)

    return {
        "active_devices": active_devices_count,
        "total_devices": total_devices_count,
        "total_readings": total_readings,
        "avg_co2_ppm": round(avg_co2, 2),
        "tracked_emissions_kg": round(tracked_emissions_kg, 2),
        "verified_credits": int(max(0, tracked_emissions_kg // 1000)),
        "latest_reading": {
            "co2_ppm": latest_reading.co2_ppm if latest_reading else 420.0,
            "temperature": latest_reading.temperature if latest_reading else 24.5,
            "humidity": latest_reading.humidity if latest_reading else 55.0,
            "timestamp": latest_reading.timestamp.isoformat() if latest_reading else datetime.utcnow().isoformat()
        } if latest_reading else None
    }
