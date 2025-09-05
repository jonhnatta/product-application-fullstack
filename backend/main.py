from fastapi import FastAPI
from routers.products import router as products_router
from database import Base, engine
from models.product import Product

# Criar as tabelas no banco de dados
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Incluir as rotas
app.include_router(products_router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
