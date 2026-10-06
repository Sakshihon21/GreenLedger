from datetime import datetime
from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base


class MarketplaceListing(Base):
    __tablename__ = "marketplace_listings"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    credit_id = Column(Integer, ForeignKey("carbon_credits.id", ondelete="CASCADE"), nullable=True)
    seller_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    project_name = Column(String(255), nullable=False)
    project_type = Column(String(100), default="Solar Power", nullable=False)
    credit_amount = Column(Float, nullable=False)
    price_per_credit = Column(Float, nullable=False)
    status = Column(String(50), default="ACTIVE", nullable=False)  # ACTIVE, SOLD, CANCELLED
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    seller = relationship("User", foreign_keys=[seller_id])
    organization = relationship("Organization")


class MarketplaceTransaction(Base):
    __tablename__ = "marketplace_transactions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    listing_id = Column(Integer, ForeignKey("marketplace_listings.id", ondelete="CASCADE"), nullable=False)
    buyer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    seller_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    credit_amount = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    certificate_id = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    listing = relationship("MarketplaceListing")
    buyer = relationship("User", foreign_keys=[buyer_id])
    seller = relationship("User", foreign_keys=[seller_id])
