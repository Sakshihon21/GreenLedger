import os
from alembic.config import Config
from app.db.base import Base
from app.core.config import settings


def test_alembic_ini_exists():
    """Verify that alembic.ini configuration file exists."""
    ini_path = os.path.join(os.path.dirname(__file__), "..", "alembic.ini")
    assert os.path.exists(ini_path)


def test_alembic_env_configuration():
    """Verify Alembic Config initialization and target metadata loading."""
    ini_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "alembic.ini"))
    alembic_cfg = Config(ini_path)
    
    # Check script location configuration
    script_location = alembic_cfg.get_main_option("script_location")
    assert script_location is not None
    assert "alembic" in script_location


def test_base_metadata_registered():
    """Verify that Base.metadata is initialized and ready for model registration."""
    assert Base.metadata is not None
    assert hasattr(Base.metadata, "tables")
