from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.device import IoTDevice
from app.schemas.device import DeviceCreate


def get_device_by_hardware_id(db: Session, device_id: str) -> Optional[IoTDevice]:
    """Fetch device by unique hardware device_id string."""
    return db.query(IoTDevice).filter(IoTDevice.device_id == device_id).first()


def get_devices_by_org(db: Session, organization_id: int) -> List[IoTDevice]:
    """Retrieve all IoT devices registered to an organization."""
    return db.query(IoTDevice).filter(IoTDevice.organization_id == organization_id).all()


def register_device(db: Session, device_in: DeviceCreate, organization_id: int) -> IoTDevice:
    """
    Registers a new IoT device under an organization.
    Checks for duplicate device_id.
    """
    existing = get_device_by_hardware_id(db, device_in.device_id)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Device with ID '{device_in.device_id}' is already registered."
        )

    topic = device_in.mqtt_topic or f"greenledger/{organization_id}/{device_in.device_id}/sensor"

    device = IoTDevice(
        device_id=device_in.device_id,
        organization_id=organization_id,
        device_name=device_in.device_name,
        location=device_in.location,
        mqtt_topic=topic,
        status="ACTIVE",
        created_at=datetime.utcnow()
    )

    db.add(device)
    db.commit()
    db.refresh(device)
    return device
