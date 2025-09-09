from pydantic import BaseModel, EmailStr, Field
from decimal import Decimal
from enum import Enum
from datetime import datetime
from typing import Optional


class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: Decimal = Field(ge=0, description="Preço não deve ser menor que zero")
    category: str
    supplier_email: EmailStr


class ProductCreate(ProductBase):
    pass


class ProductResponse(ProductBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = Field(None, ge=0, description="Preço não deve ser menor que zero")
    category: Optional[str] = None
    supplier_email: Optional[EmailStr] = None
