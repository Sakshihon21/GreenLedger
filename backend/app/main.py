import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.db.database import check_db_connection, engine
from app.db.base import Base
from app.api.v1.router import api_router

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("greenledger")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application startup and shutdown events handler.
    Auto-creates database tables on startup if database is accessible.
    """
    logger.info("Initializing GreenLedger Backend Service...")
    logger.info(f"Environment: {settings.ENVIRONMENT} | Debug: {settings.DEBUG}")
    
    # Test DB connection on startup
    connected, msg = check_db_connection()
    if connected:
        logger.info(f"[DB HEALTH] {msg}")
        try:
            # Create database tables automatically
            Base.metadata.create_all(bind=engine)
            logger.info("[DB INIT] Database tables verified / created successfully.")
            
            # Seed initial test users
            from app.db.seed import seed_test_users
            seed_test_users()
            logger.info("[DB SEED] Initial test users verified / seeded successfully.")
        except Exception as e:
            logger.error(f"[DB INIT ERROR] Failed to create tables or seed users: {str(e)}")
    else:
        logger.warning(f"[DB HEALTH WARNING] {msg}. Please check your PostgreSQL credentials in .env")
        
    yield
    
    logger.info("Shutting down GreenLedger Backend Service...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="IoT + AI based carbon emission monitoring and carbon-credit management platform backend.",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for React frontend dashboard
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include v1 API router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/health", tags=["Health"])
async def root_health_check():
    """
    Basic service liveness check.
    """
    return {
        "success": True,
        "message": "GreenLedger API Service is running.",
        "data": {
            "name": settings.PROJECT_NAME,
            "version": settings.VERSION,
            "environment": settings.ENVIRONMENT
        }
    }


@app.get(f"{settings.API_V1_STR}/health", tags=["Health"])
async def api_health_check():
    """
    Detailed system health check including database connectivity verification.
    """
    db_connected, db_status = check_db_connection()
    return {
        "success": True,
        "message": "System health summary.",
        "data": {
            "status": "online",
            "database": {
                "connected": db_connected,
                "details": db_status
            },
            "version": settings.VERSION,
            "environment": settings.ENVIRONMENT
        }
    }


# Standardized error handling middleware
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Exception on {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": "An internal server error occurred.",
            "error_code": "INTERNAL_SERVER_ERROR"
        }
    )
