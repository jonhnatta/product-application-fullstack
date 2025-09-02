from sqlalchemy.orm import Session
from typing import List, Optional
from backend.models.product import Product
from backend.schemas.product import ProductCreate, ProductUpdate


class ProductServices:

    def get_products(
        self, db: Session, skip: int = 0, limit: int = 25
    ) -> List[Product]:
        return db.query(Product).offset(skip).limit(limit).all()
