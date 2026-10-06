from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_user, require_roles
from app.models.user import User
from app.models.enums import UserRole
from app.schemas.marketplace import ListingCreate, ListingResponse, TransactionResponse
from app.services.marketplace_service import create_listing, get_active_listings, purchase_listing

router = APIRouter()


@router.post("/list", status_code=status.HTTP_201_CREATED, summary="List verified credits for sale")
def post_listing(
    listing_in: ListingCreate,
    current_user: User = Depends(require_roles([UserRole.SELLER, UserRole.ORGANIZATION, UserRole.ADMIN])),
    db: Session = Depends(get_db)
):
    """List verified carbon credits on the GreenLedger marketplace."""
    listing = create_listing(db, listing_in, current_user)
    return {
        "success": True,
        "message": "Carbon credit listing created successfully.",
        "data": ListingResponse.model_validate(listing)
    }


@router.get("/listings", summary="Get active carbon credit marketplace listings")
def list_active_listings(
    db: Session = Depends(get_db)
):
    """Fetch all active marketplace credit listings."""
    listings = get_active_listings(db)
    return {
        "success": True,
        "message": "Active marketplace listings retrieved successfully.",
        "data": [ListingResponse.model_validate(l) for l in listings]
    }


@router.post("/buy/{listing_id}", summary="Purchase carbon credits from marketplace")
def buy_credits(
    listing_id: int,
    current_user: User = Depends(require_roles([UserRole.BUYER, UserRole.ADMIN])),
    db: Session = Depends(get_db)
):
    """Execute carbon credit purchase from marketplace listing (Buyer only)."""
    transaction = purchase_listing(db, listing_id, current_user)
    return {
        "success": True,
        "message": "Carbon credit purchase executed successfully.",
        "data": TransactionResponse.model_validate(transaction)
    }
