import pytest
from models.product import Product
from services.product_services import ProductServices
from schemas.product import ProductCreate, ProductUpdate


class TestProductServices:
    """Testes do serviços"""

    def test_create_product(self, db_session, sample_product_data):
        """Teste de criação de produto"""
        product_create = ProductCreate(**sample_product_data)
        service = ProductServices()

        created_product = service.create_product(db_session, product_create)

        assert created_product.name == sample_product_data["name"]
        assert created_product.description == sample_product_data["description"]
        assert float(created_product.price) == sample_product_data["price"]
        assert created_product.category == sample_product_data["category"]
        assert created_product.supplier_email == sample_product_data["supplier_email"]
        assert created_product.id is not None

    def test_get_products_with_data(self, db_session, sample_product_data):
        """Listar todos os produtos"""

        product_create = ProductCreate(**sample_product_data)
        service = ProductServices()
        service.create_product(db_session, product_create)

        products = service.get_products(db_session)

        assert len(products) == 1
        assert products[0].name == sample_product_data["name"]

    def test_get_product_by_id(self, db_session, sample_product_data):
        """Buscar produto por ID"""

        product_create = ProductCreate(**sample_product_data)
        service = ProductServices()
        created_product = service.create_product(db_session, product_create)

        found_product = service.get_product_by_id(db_session, created_product.id)

        assert found_product is not None
        assert found_product.id == created_product.id
        assert found_product.name == sample_product_data["name"]

    def test_get_product_by_id_not_found(self, db_session):
        """Buscar produto que não existe"""
        service = ProductServices()

        found_product = service.get_product_by_id(db_session, 1000)

        assert found_product is None

    def test_update_product(
        self, db_session, sample_product_data, sample_product_update_data
    ):
        """Atualizar produto"""

        product_create = ProductCreate(**sample_product_data)
        service = ProductServices()
        created_product = service.create_product(db_session, product_create)

        product_update = ProductUpdate(**sample_product_update_data)
        updated_product = service.update_product(
            db_session, created_product.id, product_update
        )

        assert updated_product is not None
        assert updated_product.id == created_product.id
        assert updated_product.name == sample_product_update_data["name"]
        assert updated_product.description == sample_product_update_data["description"]
        assert float(updated_product.price) == sample_product_update_data["price"]

    def test_update_product_not_found(self, db_session, sample_product_update_data):
        """Atualizar produto que não existe"""
        service = ProductServices()
        product_update = ProductUpdate(**sample_product_update_data)

        updated_product = service.update_product(db_session, 1000, product_update)

        assert updated_product is None

    def test_delete_product(self, db_session, sample_product_data):
        """Excluir produto"""

        product_create = ProductCreate(**sample_product_data)
        service = ProductServices()
        created_product = service.create_product(db_session, product_create)

        result = service.delete_product(db_session, created_product.id)

        assert result is True

        # Verificar se foi excluído
        found_product = service.get_product_by_id(db_session, created_product.id)
        assert found_product is None

    def test_delete_product_not_found(self, db_session):
        """Excluir produto que não existe"""
        service = ProductServices()

        result = service.delete_product(db_session, 999)

        assert result is False
