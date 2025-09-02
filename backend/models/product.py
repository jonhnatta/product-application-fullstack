from sqlalchemy import Column, Integer, String, Numeric, DateTime
from sqlalchemy_utils import EmailType
from sqlalchemy.sql import func
from backend.database.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(String(500))
    price = Column(Numeric(10, 2), nullable=False)
    category = Column(String(50), nullable=False)
    supplier_email = Column(EmailType)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
