from sqlalchemy import Column, Date, DateTime, Integer, String, func

from app.database import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    cpf = Column(String, unique=True, nullable=False)
    birth_date = Column(Date, nullable=False)
    phone = Column(String, nullable=False)
    city = Column(String, nullable=False)
    health_card_number = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
