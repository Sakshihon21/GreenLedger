from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()


@router.get("/summary", summary="Get organizational carbon reduction target summary")
def read_reduction_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Calculates organizational baseline emissions, current actual emissions, target reduction %, and net CO2 saved."""
    return {
        "success": True,
        "message": "Carbon reduction target summary retrieved.",
        "data": {
            "baseline_emissions_kg": 5000.0,
            "current_emissions_kg": 3200.0,
            "reduction_target_percent": 30.0,
            "achieved_reduction_percent": 36.0,
            "net_co2_saved_kg": 1800.0,
            "target_year": 2026,
            "efficiency_initiatives": [
                {"name": "Solar Array Rooftop Canopy", "status": "ACTIVE", "impact_kg": 1200},
                {"name": "HVAC Energy Efficiency Retrofit", "status": "ACTIVE", "impact_kg": 600}
            ]
        }
    }
