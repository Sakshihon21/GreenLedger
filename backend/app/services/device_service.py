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


def delete_device(db: Session, identifier: str, organization_id: int, is_admin: bool = False) -> IoTDevice:
    """
    Delete an IoT device by hardware device_id or database integer ID.
    Enforces organization ownership unless the user is an admin.
    """
    query = db.query(IoTDevice)
    if identifier.isdigit():
        device = query.filter((IoTDevice.id == int(identifier)) | (IoTDevice.device_id == identifier)).first()
    else:
        device = query.filter(IoTDevice.device_id == identifier).first()

    if not device:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"IoT Device with identifier '{identifier}' not found."
        )

    if not is_admin and device.organization_id != organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete this device."
        )

    db.delete(device)
    db.commit()
    return device

