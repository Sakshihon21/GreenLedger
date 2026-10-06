from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class ListingCreate(BaseModel):
    project_name: str = Field(..., description="Project name (e.g., 50 MW Solar Canopy Offset)")
    project_type: str = Field("Solar Energy", description="Project type (e.g., Solar, Wind, Reforestation)")
    credit_amount: float = Field(..., gt=0, description="Volume of credits to list in tCO2e")
    price_per_credit: float = Field(..., gt=0, description="Price per tCO2e credit in USD")


class ListingResponse(BaseModel):
    id: int
    seller_id: int
    organization_id: int
    project_name: str
    project_type: str
    credit_amount: float
    price_per_credit: float
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TransactionResponse(BaseModel):
    id: int
    listing_id: int
    buyer_id: int
    seller_id: int
    credit_amount: float
    total_price: float
    certificate_id: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
