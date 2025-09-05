from sqlalchemy.orm import Session
from typing import List, Optional
from models.product import Product
from schemas.product import ProductCreate, ProductUpdate


class ProductServices:

    def get_products(
        self, db: Session, skip: int = 0, limit: int = 25
    ) -> List[Product]:
        """
        Retorna todos os produtos
        """
        return db.query(Product).offset(skip).limit(limit).all()

    def get_product_by_id(self, db: Session, product_id: int) -> Optional[Product]:
        """
        Retorna um produto específico
        """
        return db.query(Product).filter(Product.id == product_id).first()

    def create_product(self, db: Session, product: ProductCreate) -> Product:

        product_db = Product(**product.model_dump())

        db.add(product_db)
        db.commit()
        db.refresh(product_db)

        return product_db

    def delete_product(self, db: Session, product_id: int) -> bool:

        product_db = db.query(Product).filter(Product.id == product_id).first()

        if not product_db:
            return False

        db.delete(product_db)
        db.commit()

        return True

    def update_product(
        self, db: Session, product_id: int, product: ProductUpdate
    ) -> Optional[Product]:

        product_db = db.query(Product).filter(Product.id == product_id).first()

        if not product_db:
            return None

        update_data = product.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(product_db, field, value)

        db.commit()
        db.refresh(product_db)

        return product_db


product_service = ProductServices()
