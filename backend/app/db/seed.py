import logging
from app.db.session import SessionLocal
from app.services.auth_service import register_new_user, get_user_by_email
from app.schemas.user import UserRegister
from app.models.enums import UserRole

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
        for acc in ACCOUNTS:
            if not get_user_by_email(db, acc["email"]):
                register_new_user(db, UserRegister(**acc))
                logger.info(f"Seeded test user: {acc['email']}")
    except Exception as e:
        logger.error(f"Error seeding test users: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    seed_test_users()
