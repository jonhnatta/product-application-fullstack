from pydantic import BaseModel, EmailStr, Decimal, Field
from enum import Enum
from datetime import datetime
from typing import Optional


class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: Decimal = Field(ge=0, description="Preço não deve ser menor que zero")
    category: str
    supplier_email: Optional[EmailStr] = None


class ProductCreate(ProductBase):
    pass


class ProductResponse(ProductBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(max_length=100)
    description: Optional[str] = Field(max_length=500)
    price: Optional[Decimal] = Field(
        ge=0, description="Preço não deve ser menor que zero"
    )
    category: Optional[str] = Field(max_length=50)
    supplier_email: Optional[EmailStr]
