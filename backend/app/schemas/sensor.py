from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class SensorReadingCreate(BaseModel):
    device_id: str = Field(..., description="Hardware device identifier (e.g. ESP32-001)")
    co2_ppm: float = Field(..., ge=0, le=10000, description="CO2 concentration in parts per million")
    temperature: Optional[float] = Field(None, ge=-50, le=100, description="Ambient temperature in °C")
    humidity: Optional[float] = Field(None, ge=0, le=100, description="Relative humidity %")
    pressure: Optional[float] = Field(None, ge=500, le=1500, description="Atmospheric pressure in hPa")
    timestamp: Optional[datetime] = None


class SensorReadingResponse(BaseModel):
    id: int
    device_id: int
    organization_id: int
    co2_ppm: float
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    pressure: Optional[float] = None
    timestamp: datetime
    received_at: datetime

    model_config = ConfigDict(from_attributes=True)
