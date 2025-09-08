import pytest
from fastapi import status


class TestProductsAPI:
    """Testes dos endpoints da rota produtos"""

    def test_create_product(self, client, sample_product_data):
        """Criar Produto"""
        response = client.post("/products", json=sample_product_data)

        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["name"] == sample_product_data["name"]
        assert data["description"] == sample_product_data["description"]
        assert float(data["price"]) == sample_product_data["price"]
        assert data["category"] == sample_product_data["category"]
        assert data["supplier_email"] == sample_product_data["supplier_email"]
        assert "id" in data

    def test_get_products_with_data(self, client, sample_product_data):
        """Listar produto"""

        client.post("/products", json=sample_product_data)

        response = client.get("/products")

        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 1
        assert data[0]["name"] == sample_product_data["name"]

    def test_get_product_by_id(self, client, sample_product_data):
        """Buscar produto por ID"""

        create_response = client.post("/products", json=sample_product_data)
        product_id = create_response.json()["id"]

        response = client.get(f"/products/{product_id}")

        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == product_id
        assert data["name"] == sample_product_data["name"]

    def test_get_product_not_found(self, client):
        """Busca produto que não existe"""
        response = client.get("/products/1000")

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_update_product(
        self, client, sample_product_data, sample_product_update_data
    ):
        """Atualizar produto"""

        create_response = client.post("/products", json=sample_product_data)
        product_id = create_response.json()["id"]

        response = client.put(
            f"/products/{product_id}", json=sample_product_update_data
        )

        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == product_id
        assert data["name"] == sample_product_update_data["name"]
        assert data["description"] == sample_product_update_data["description"]
        assert float(data["price"]) == sample_product_update_data["price"]

    def test_update_product_not_found(self, client, sample_product_update_data):
        """Atualizar produto inexistente"""
        response = client.put("/products/1000", json=sample_product_update_data)

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_delete_product(self, client, sample_product_data):
        """Excluir produto"""

        create_response = client.post("/products", json=sample_product_data)
        product_id = create_response.json()["id"]

        response = client.delete(f"/products/{product_id}")

        assert response.status_code == status.HTTP_204_NO_CONTENT

        # Verificar se foi excluído
        get_response = client.get(f"/products/{product_id}")
        assert get_response.status_code == status.HTTP_404_NOT_FOUND

    def test_delete_product_not_found(self, client):
        """Excluir produto inexistente"""
        response = client.delete("/products/999")

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_create_product_missing_required_fields(self, client):
        """Criar produto sem campo obrigatório"""
        incomplete_data = {"name": "Produto Incompleto"}

        response = client.post("/products", json=incomplete_data)

        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
