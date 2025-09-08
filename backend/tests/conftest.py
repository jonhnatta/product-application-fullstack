import os
import sys
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

os.environ["TESTING"] = "1"

backend_path = os.path.dirname(os.path.dirname(__file__))
sys.path.insert(0, backend_path)
os.chdir(backend_path)

from main import app
from database.database import get_db, Base
os.chdir(backend_path) 

# Configuração do banco de teste
TEST_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    """Substituir get_db para usar o banco de teste"""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


@pytest.fixture(scope="function")
def db_session():
    """Cria e limpa o banco a cada teste"""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client():
    """Fixture do cliente de teste FastAPI"""
    # dependência do banco
    app.dependency_overrides[get_db] = override_get_db

    # Criar tabelas
    Base.metadata.create_all(bind=engine)

    with TestClient(app) as test_client:
        yield test_client

    # Limpar banco
    Base.metadata.drop_all(bind=engine)
    app.dependency_overrides.clear()


@pytest.fixture
def sample_product_data():
    """Dados de exemplo para testes"""
    return {
        "name": "Produto Teste",
        "description": "Descrição do produto teste",
        "price": 10.50,
        "category": "Categoria Teste",
        "supplier_email": "fornecedor@teste.com",
    }


@pytest.fixture
def sample_product_update_data():
    """Dados de exemplo para atualização"""
    return {
        "name": "Produto Atualizado",
        "description": "Descrição atualizada",
        "price": 87.52,
        "category": "Nova Categoria",
        "supplier_email": "novo@fornecedor.com",
    }
