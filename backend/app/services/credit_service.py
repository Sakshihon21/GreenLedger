import uuid
from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.credit import CarbonCredit
from app.schemas.credit import CreditRequestCreate


def request_credit_issuance(
    db: Session,
    request_in: CreditRequestCreate,
    organization_id: int
) -> CarbonCredit:
    """Submit a new carbon credit issuance request based on emission reductions."""
    credit = CarbonCredit(
        organization_id=organization_id,
        amount=request_in.amount,
        status="PENDING",
        source_emission_reduction=request_in.source_emission_reduction or "Facility Telemetry CO2 Baseline Reduction",
        created_at=datetime.utcnow()
    )
    db.add(credit)
    db.commit()
    db.refresh(credit)
    return credit


def get_credits_by_org(db: Session, organization_id: int) -> List[CarbonCredit]:
    """Fetch all carbon credits belonging to an organization."""
    return db.query(CarbonCredit).filter(CarbonCredit.organization_id == organization_id).order_by(CarbonCredit.created_at.desc()).all()


def verify_credit_issuance(db: Session, credit_id: int) -> CarbonCredit:
    """Approve and verify a pending credit request (Monitoring Authority action)."""
    credit = db.query(CarbonCredit).filter(CarbonCredit.id == credit_id).first()
    if not credit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Credit record not found.")

    credit.status = "VERIFIED"
    credit.issued_at = datetime.utcnow()
    db.commit()
    db.refresh(credit)
    return credit


def retire_credit(db: Session, credit_id: int, user_id: int) -> dict:
    """Retire carbon credits permanently for climate offset certificate."""
    credit = db.query(CarbonCredit).filter(CarbonCredit.id == credit_id).first()
    if not credit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Credit record not found.")

    credit.status = "RETIRED"
    db.commit()
    
    cert_id = f"CERT-RET-{uuid.uuid4().hex[:8].upper()}"
    return {
        "credit_id": credit.id,
        "amount": credit.amount,
        "status": "RETIRED",
        "certificate_id": cert_id,
        "retired_at": datetime.utcnow().isoformat()
    }
