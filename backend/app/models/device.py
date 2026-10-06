from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base


class IoTDevice(Base):
    __tablename__ = "iot_devices"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    device_id = Column(String(100), unique=True, index=True, nullable=False)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    device_name = Column(String(255), nullable=False)
    status = Column(String(50), default="ACTIVE", nullable=False)
    location = Column(String(255), nullable=True)
    mqtt_topic = Column(String(255), nullable=True)
    last_seen = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    organization = relationship("Organization", backref="devices")
    sensor_readings = relationship("SensorReading", back_populates="device", cascade="all, delete-orphan")
