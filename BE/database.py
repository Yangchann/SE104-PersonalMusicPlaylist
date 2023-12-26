from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

SQLALCHEMY_DATABASE_URL = "sqlite:///./listen.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={'check_same_thread': False}) # connect with database through URL


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) # UI to interact with Database

Base = declarative_base() # class stand for table