from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    devices,
    sensors,
    dashboard,
    credits,
    marketplace,
    reduction,
    reports
)

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(devices.router, prefix="/devices", tags=["IoT Devices"])
api_router.include_router(sensors.router, prefix="/sensors", tags=["Sensor Readings"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard Summary"])
api_router.include_router(credits.router, prefix="/credits", tags=["Carbon Credits"])
api_router.include_router(marketplace.router, prefix="/marketplace", tags=["Marketplace Trading"])
api_router.include_router(reduction.router, prefix="/reduction", tags=["Carbon Reduction"])
api_router.include_router(reports.router, prefix="/reports", tags=["ESG Audit Reports"])
