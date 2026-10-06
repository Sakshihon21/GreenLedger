from datetime import datetime
from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base


class CarbonCredit(Base):
    __tablename__ = "carbon_credits"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(String(50), default="PENDING", nullable=False)  # PENDING, VERIFIED, AVAILABLE, LISTED, RETIRED
    source_emission_reduction = Column(String(255), nullable=True)
    issued_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    organization = relationship("Organization", backref="carbon_credits")
