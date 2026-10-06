import logging
from datetime import datetime
from app.db.session import SessionLocal
from app.services.auth_service import register_new_user, get_user_by_email
from app.schemas.user import UserRegister
from app.models.enums import UserRole
from app.models.credit import CarbonCredit
from app.models.marketplace import MarketplaceListing

logger = logging.getLogger(__name__)

ACCOUNTS = [
    {
        "name": "Green Enterprise Org",
        "email": "org@greenledger.org",
        "password": "GreenLedger123!",
        "role": UserRole.ORGANIZATION
    },
    {
        "name": "Global Carbon Buyer",
        "email": "buyer@greenledger.org",
        "password": "GreenLedger123!",
        "role": UserRole.BUYER
    },
    {
        "name": "Eco Credit Seller",
        "email": "seller@greenledger.org",
        "password": "GreenLedger123!",
        "role": UserRole.SELLER
    },
    {
        "name": "Environmental Auditor",
        "email": "authority@greenledger.org",
        "password": "GreenLedger123!",
        "role": UserRole.MONITORING_AUTHORITY
    }
]


def seed_test_users():
    db = SessionLocal()
    try:
        seller_user = None
        for acc in ACCOUNTS:
            user = get_user_by_email(db, acc["email"])
            if not user:
                user = register_new_user(db, UserRegister(**acc))
                logger.info(f"Seeded test user: {acc['email']}")
            if acc["role"] == UserRole.SELLER:
                seller_user = user

        # Seed Marketplace Listings if empty
        existing_listings = db.query(MarketplaceListing).count()
        if existing_listings == 0 and seller_user:
            credit1 = CarbonCredit(
                organization_id=seller_user.organization_id or 1,
                amount=500.0,
                status="LISTED",
                source_emission_reduction="50 MW Rooftop Solar Array",
                issued_at=datetime.utcnow(),
                created_at=datetime.utcnow()
            )
            credit2 = CarbonCredit(
                organization_id=seller_user.organization_id or 1,
                amount=250.0,
                status="LISTED",
                source_emission_reduction="HVAC Facility Energy Efficiency Retrofit",
                issued_at=datetime.utcnow(),
                created_at=datetime.utcnow()
            )
            db.add(credit1)
            db.add(credit2)
            db.flush()

            listing1 = MarketplaceListing(
                credit_id=credit1.id,
                seller_id=seller_user.id,
                organization_id=seller_user.organization_id or 1,
                project_name="Solar Canopy Emission Offset",
                project_type="Solar Energy",
                credit_amount=500.0,
                price_per_credit=15.00,
                status="ACTIVE",
                created_at=datetime.utcnow()
            )
            listing2 = MarketplaceListing(
                credit_id=credit2.id,
                seller_id=seller_user.id,
                organization_id=seller_user.organization_id or 1,
                project_name="Reforestation Carbon Sink",
                project_type="Reforestation",
                credit_amount=250.0,
                price_per_credit=18.50,
                status="ACTIVE",
                created_at=datetime.utcnow()
            )
            db.add(listing1)
            db.add(listing2)

            # Seed a pending credit request
            pending_credit = CarbonCredit(
                organization_id=seller_user.organization_id or 1,
                amount=1000.0,
                status="PENDING",
                source_emission_reduction="Wind Power Turbines Facility Reduction",
                created_at=datetime.utcnow()
            )
            db.add(pending_credit)
            db.commit()
            logger.info("Seeded initial marketplace listings and pending credit requests.")
    except Exception as e:
        logger.error(f"Error seeding test data: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    seed_test_users()
