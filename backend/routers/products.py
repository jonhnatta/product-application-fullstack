from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from schemas import ProductCreate, ProductUpdate, ProductResponse
from services import product_service

router = APIRouter(
    prefix="/products",
    tags=["products"]
)


@router.get("/", response_model=List[ProductResponse])
def get_products(
    skip: int = 0,
    limit: int = 25,
    db: Session = Depends(get_db)
):
    """Lista todos os produtos com paginação"""
    products = product_service.get_products(db, skip=skip, limit=limit)
    return products


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """Busca um produto por ID"""
    product = product_service.get_product_by_id(db, product_id=product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produto não encontrado"
        )
    return product


@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    """Cria um novo produto"""
    return product_service.create_product(db=db, product=product)


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product: ProductUpdate,
    db: Session = Depends(get_db)
):
    """Atualiza um produto existente"""
    updated_product = product_service.update_product(
        db=db, product_id=product_id, product=product
    )
    if not updated_product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produto não encontrado"
        )
    return updated_product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    """Deleta um produto"""
    success = product_service.delete_product(db=db, product_id=product_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produto não encontrado"
        )