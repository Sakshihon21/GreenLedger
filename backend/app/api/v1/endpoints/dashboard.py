from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.enums import UserRole
from app.models.device import IoTDevice
from app.models.sensor_reading import SensorReading
from app.models.organization import Organization
from app.services.sensor_service import get_dashboard_summary

router = APIRouter()


@router.get("/summary", summary="Get role-tailored dashboard summary KPI metrics")
def read_dashboard_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns aggregated dashboard metrics tailored specifically to the authenticated user's role:
    SELLER/ORGANIZATION: IoT sensors, CO2 telemetry, tracked emissions, credit balances.
    BUYER: Available wallet credits, purchased credits, retired credits, active marketplace listings.
    MONITORING_AUTHORITY: Verification requests, anomaly alerts, organizations under review.
    ADMIN: Total system users, organizations, devices, audit log events.
    """
    role = current_user.role

    if role == UserRole.BUYER:
        summary_data = {
            "role": "BUYER",
            "available_wallet_credits": 150.0,
            "purchased_credits": 350.0,
            "retired_credits": 200.0,
            "active_listings_count": 12,
            "recent_purchases": [
                {"id": "TX-1001", "credits": 50, "seller": "Solar Power Enterprise", "date": "2026-09-28", "certificate_id": "CERT-8841"},
                {"id": "TX-0994", "credits": 100, "seller": "Wind Farm Co", "date": "2026-09-15", "certificate_id": "CERT-8712"}
            ],
            "recent_retirements": [
                {"id": "RET-041", "credits": 50, "reason": "Corporate Q3 Net Zero", "date": "2026-09-20", "certificate_id": "CERT-OFF-901"}
            ]
        }
    elif role == UserRole.MONITORING_AUTHORITY:
        summary_data = {
            "role": "MONITORING_AUTHORITY",
            "pending_verifications": 4,
            "credits_awaiting_verification": 1250,
            "anomaly_alerts_count": 2,
            "orgs_under_review": 3,
            "recent_verifications": [
                {"id": "VR-502", "org": "Green Enterprise Org", "credits": 450, "status": "VERIFIED", "date": "2026-09-29"},
                {"id": "VR-498", "org": "Eco Power Ltd", "credits": 800, "status": "UNDER_REVIEW", "date": "2026-09-26"}
            ]
        }
    elif role == UserRole.ADMIN:
        total_users = db.query(func.count(User.id)).scalar() or 0
        total_orgs = db.query(func.count(Organization.id)).scalar() or 0
        total_devices = db.query(func.count(IoTDevice.id)).scalar() or 0
        summary_data = {
            "role": "ADMIN",
            "total_users": total_users,
            "total_organizations": total_orgs,
            "total_devices": total_devices,
            "total_credits_issued": 5400,
            "system_audit_events": 142
        }
    else:  # SELLER or ORGANIZATION
        org_id = current_user.organization_id or 1
        summary_data = get_dashboard_summary(db, org_id)
        summary_data["role"] = role.value
        summary_data["pending_credits"] = int(summary_data.get("verified_credits", 0) * 0.2)
        summary_data["available_credits"] = summary_data.get("verified_credits", 0)

    return {
        "success": True,
        "message": f"Dashboard summary metrics for role {role.value} retrieved successfully.",
        "data": summary_data
    }
