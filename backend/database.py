from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from dotenv import load_dotenv
import os

load_dotenv()

POSTGRES_DATABASE_URL = os.getenv("POSTGRES_DATABASE_URL")

engine = create_engine(POSTGRES_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
  """
  Gerenciador de sessão do banco de dados.
  Cria, fornece e fecha automaticamente uma sessão.
  yield: fornece a sessão
  """
  db = SessionLocal()
  try:
    yield db
  finally:
    db.close