import logging
from typing import Tuple
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.core.config import settings

logger = logging.getLogger(__name__)

# Base class for SQLAlchemy models
class Base(DeclarativeBase):
    pass


def _create_db_engine():
    db_url = settings.DATABASE_URL
    if db_url.startswith("postgresql"):
        try:
            test_engine = create_engine(
                db_url,
                connect_args={"connect_timeout": 3},
                pool_pre_ping=True
            )
            with test_engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            logger.info("[DB] Successfully connected to PostgreSQL.")
            return test_engine
        except Exception as e:
            logger.warning(
                f"[DB WARNING] PostgreSQL is not reachable at {db_url} ({e}). "
                "Automatically using local SQLite database (sqlite:///./greenledger.db) so you can register and log in."
            )
            return create_engine(
                "sqlite:///./greenledger.db",
                connect_args={"check_same_thread": False}
            )
    elif db_url.startswith("sqlite"):
        return create_engine(
            db_url,
            connect_args={"check_same_thread": False}
        )
    else:
        return create_engine(db_url, pool_pre_ping=True)


engine = _create_db_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


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
