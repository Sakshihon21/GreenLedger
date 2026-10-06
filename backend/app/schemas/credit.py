from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class CreditRequestCreate(BaseModel):
    amount: float = Field(..., gt=0, description="Requested carbon credit volume in metric tonnes (tCO2e)")
    source_emission_reduction: Optional[str] = Field(None, description="Details of baseline emission reduction")


class CreditResponse(BaseModel):
    id: int
    organization_id: int
    amount: float
    status: str
    source_emission_reduction: Optional[str] = None
    issued_at: Optional[datetime] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
