from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_user, require_roles
from app.models.user import User
from app.models.enums import UserRole
from app.schemas.device import DeviceCreate, DeviceResponse
from app.services.device_service import register_device, get_devices_by_org

router = APIRouter()


@router.post("", status_code=status.HTTP_201_CREATED, summary="Register a new IoT device")
def create_device(
    device_in: DeviceCreate,
    current_user: User = Depends(require_roles([UserRole.ORGANIZATION, UserRole.SELLER, UserRole.ADMIN])),
    db: Session = Depends(get_db)
):
    """
    Register a new ESP32 environmental sensor device under the user's organization.
    Restricted to ORGANIZATION, SELLER, and ADMIN roles.
    """
    org_id = current_user.organization_id or 1
    device = register_device(db, device_in, org_id)
    return {
        "success": True,
        "message": f"IoT Device '{device.device_id}' registered successfully.",
        "data": DeviceResponse.model_validate(device)
    }


@router.get("", summary="List all IoT devices for current organization")
def list_devices(
    current_user: User = Depends(require_roles([UserRole.ORGANIZATION, UserRole.SELLER, UserRole.ADMIN, UserRole.MONITORING_AUTHORITY])),
    db: Session = Depends(get_db)
):
    """
    Fetch all IoT sensor devices belonging to the user's organization.
    Restricted to ORGANIZATION, SELLER, MONITORING_AUTHORITY, and ADMIN roles.
    """
    org_id = current_user.organization_id or 1
    devices = get_devices_by_org(db, org_id)
    return {
        "success": True,
        "message": "IoT devices retrieved successfully.",
        "data": [DeviceResponse.model_validate(d) for d in devices]
    }
