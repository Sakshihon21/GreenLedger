from fastapi import APIRouter
from app.api.v1.endpoints import auth, devices, sensors, dashboard

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(devices.router, prefix="/devices", tags=["IoT Devices"])
api_router.include_router(sensors.router, prefix="/sensors", tags=["Sensor Readings"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard Summary"])
