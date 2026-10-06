from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_user, require_roles
from app.models.user import User
from app.models.enums import UserRole
from app.schemas.credit import CreditRequestCreate, CreditResponse
from app.services.credit_service import (
    request_credit_issuance,
    get_credits_by_org,
    verify_credit_issuance,
    retire_credit
)

router = APIRouter()


@router.post("/request", status_code=status.HTTP_201_CREATED, summary="Submit credit issuance request")
def request_credits(
    request_in: CreditRequestCreate,
    current_user: User = Depends(require_roles([UserRole.ORGANIZATION, UserRole.SELLER, UserRole.ADMIN])),
    db: Session = Depends(get_db)
):
    """Request carbon credit issuance based on verified facility CO2 reductions."""
    org_id = current_user.organization_id or 1
    credit = request_credit_issuance(db, request_in, org_id)
    return {
        "success": True,
        "message": "Credit issuance request submitted for auditor verification.",
        "data": CreditResponse.model_validate(credit)
    }


@router.get("", summary="List organization carbon credits")
def list_credits(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all carbon credits belonging to current organization."""
    org_id = current_user.organization_id or 1
    credits = get_credits_by_org(db, org_id)
    return {
        "success": True,
        "message": "Carbon credit ledger retrieved successfully.",
        "data": [CreditResponse.model_validate(c) for c in credits]
    }


@router.post("/{credit_id}/verify", summary="Verify carbon credit claim")
def verify_credit(
    credit_id: int,
    current_user: User = Depends(require_roles([UserRole.MONITORING_AUTHORITY, UserRole.ADMIN])),
    db: Session = Depends(get_db)
):
    """Verify and approve pending credit request (Monitoring Authority only)."""
    credit = verify_credit_issuance(db, credit_id)
    return {
        "success": True,
        "message": "Carbon credit claim verified and issued successfully.",
        "data": CreditResponse.model_validate(credit)
    }


@router.post("/{credit_id}/retire", summary="Retire carbon credits")
def retire_user_credit(
    credit_id: int,
    current_user: User = Depends(require_roles([UserRole.BUYER, UserRole.ORGANIZATION, UserRole.ADMIN])),
    db: Session = Depends(get_db)
):
    """Retire carbon credits permanently for climate offset certificate."""
    result = retire_credit(db, credit_id, current_user.id)
    return {
        "success": True,
        "message": "Carbon credits retired successfully. Certificate issued.",
        "data": result
    }
