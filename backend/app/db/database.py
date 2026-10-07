import logging
from typing import Tuple
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.core.config import settings

logger = logging.getLogger(__name__)

# Configure SQLAlchemy engine with pre-ping and connection pooling
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    echo=settings.DEBUG and settings.ENVIRONMENT == "development"
)

# Centralized Session Local factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Base class for SQLAlchemy models
class Base(DeclarativeBase):
    pass


def check_db_connection() -> Tuple[bool, str]:
    """
    Utility function to test database connectivity.
    Returns (True, success_msg) if connected, or (False, error_msg) if connection fails.
    """
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            result.scalar()
        return True, "Database connection successful."
    except Exception as e:
        error_msg = f"Database connection error: {str(e)}"
        logger.warning(error_msg)
        return False, error_msg
