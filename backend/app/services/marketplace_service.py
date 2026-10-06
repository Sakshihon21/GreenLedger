import uuid
from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.marketplace import MarketplaceListing, MarketplaceTransaction
from app.models.credit import CarbonCredit
from app.models.user import User
from app.schemas.marketplace import ListingCreate


def create_listing(db: Session, listing_in: ListingCreate, seller: User) -> MarketplaceListing:
    """Create a new carbon credit marketplace listing."""
    org_id = seller.organization_id or 1

    # Create associated available credit entry
    credit = CarbonCredit(
        organization_id=org_id,
        amount=listing_in.credit_amount,
        status="LISTED",
        source_emission_reduction=f"Listed: {listing_in.project_name}",
        issued_at=datetime.utcnow(),
        created_at=datetime.utcnow()
    )
    db.add(credit)
    db.flush()

    listing = MarketplaceListing(
        credit_id=credit.id,
        seller_id=seller.id,
        organization_id=org_id,
        project_name=listing_in.project_name,
        project_type=listing_in.project_type,
        credit_amount=listing_in.credit_amount,
        price_per_credit=listing_in.price_per_credit,
        status="ACTIVE",
        created_at=datetime.utcnow()
    )
    db.add(listing)
    db.commit()
    db.refresh(listing)
    return listing


def get_active_listings(db: Session) -> List[MarketplaceListing]:
    """Fetch all active marketplace listings."""
    return db.query(MarketplaceListing).filter(MarketplaceListing.status == "ACTIVE").order_by(MarketplaceListing.created_at.desc()).all()


def purchase_listing(db: Session, listing_id: int, buyer: User) -> MarketplaceTransaction:
    """Execute carbon credit purchase from marketplace listing."""
    listing = db.query(MarketplaceListing).filter(MarketplaceListing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Marketplace listing not found.")

    if listing.status != "ACTIVE":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Listing is no longer active.")

    if listing.seller_id == buyer.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Sellers cannot purchase their own listings.")

    total_price = listing.credit_amount * listing.price_per_credit
    cert_id = f"CERT-BUY-{uuid.uuid4().hex[:8].upper()}"

    # Mark listing as SOLD
    listing.status = "SOLD"

    # Update credit status to AVAILABLE for buyer
    if listing.credit_id:
        credit = db.query(CarbonCredit).filter(CarbonCredit.id == listing.credit_id).first()
        if credit:
            credit.status = "PURCHASED"

    # Record Marketplace Transaction
    transaction = MarketplaceTransaction(
        listing_id=listing.id,
        buyer_id=buyer.id,
        seller_id=listing.seller_id,
        credit_amount=listing.credit_amount,
        total_price=total_price,
        certificate_id=cert_id,
        created_at=datetime.utcnow()
    )

    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction
