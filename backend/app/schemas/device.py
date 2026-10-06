from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class DeviceCreate(BaseModel):
    device_id: str
    device_name: str
    location: Optional[str] = None
    mqtt_topic: Optional[str] = None


class DeviceResponse(BaseModel):
    id: int
    device_id: str
    organization_id: int
    device_name: str
    status: str
    location: Optional[str] = None
    mqtt_topic: Optional[str] = None
    last_seen: Optional[datetime] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
