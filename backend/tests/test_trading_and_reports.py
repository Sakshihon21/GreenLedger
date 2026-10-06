import pytest
from app.core.security import create_access_token
from app.models.enums import UserRole
from app.services.auth_service import register_new_user, get_user_by_email
from app.schemas.user import UserRegister


@pytest.fixture
def seller_headers(db):
    if not get_user_by_email(db, "seller@greenledger.org"):
        register_new_user(db, UserRegister(
            name="Eco Credit Seller",
            email="seller@greenledger.org",
            password="GreenLedger123!",
            role=UserRole.SELLER
        ))
    token = create_access_token(subject="seller@greenledger.org", role=UserRole.SELLER.value)
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def buyer_headers(db):
    if not get_user_by_email(db, "buyer@greenledger.org"):
        register_new_user(db, UserRegister(
            name="Global Carbon Buyer",
            email="buyer@greenledger.org",
            password="GreenLedger123!",
            role=UserRole.BUYER
        ))
    token = create_access_token(subject="buyer@greenledger.org", role=UserRole.BUYER.value)
    return {"Authorization": f"Bearer {token}"}


def test_credit_request_submission(client, seller_headers):
    """Test requesting carbon credit issuance."""
    payload = {"amount": 100.0, "source_emission_reduction": "Solar Roof Canopy"}
    res = client.post("/api/v1/credits/request", json=payload, headers=seller_headers)
    assert res.status_code == 201
    assert res.json()["success"] is True
    assert res.json()["data"]["amount"] == 100.0


def test_marketplace_listing_and_buying(client, seller_headers, buyer_headers):
    """Test listing credits as seller and buying credits as buyer."""
    # 1. Seller lists credits
    list_payload = {
        "project_name": "Wind Turbine Alpha",
        "project_type": "Wind Energy",
        "credit_amount": 50.0,
        "price_per_credit": 12.0
    }
    list_res = client.post("/api/v1/marketplace/list", json=list_payload, headers=seller_headers)
    assert list_res.status_code == 201
    listing_id = list_res.json()["data"]["id"]

    # 2. Fetch active listings
    get_res = client.get("/api/v1/marketplace/listings")
    assert get_res.status_code == 200
    assert len(get_res.json()["data"]) >= 1

    # 3. Buyer purchases listing
    buy_res = client.post(f"/api/v1/marketplace/buy/{listing_id}", headers=buyer_headers)
    assert buy_res.status_code == 200
    assert buy_res.json()["success"] is True
    assert buy_res.json()["data"]["total_price"] == 600.0


def test_carbon_reduction_and_reports_summary(client, seller_headers):
    """Test reduction and reports summary endpoints."""
    red_res = client.get("/api/v1/reduction/summary", headers=seller_headers)
    assert red_res.status_code == 200
    assert red_res.json()["data"]["achieved_reduction_percent"] == 36.0

    rep_res = client.get("/api/v1/reports/summary", headers=seller_headers)
    assert rep_res.status_code == 200
    assert "report_period" in rep_res.json()["data"]
