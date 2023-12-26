from sqlalchemy import Column, Integer, String, JSON, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


Playlists = {"Suy": ["Em của ngày hôm qua", "Chúng ta không thuộc về nhau"], "Yêu đời": ["Hãy để tôi ôm em", "Mình đi đâu thế bố ơi"]}


class Playlist(Base):
    __tablename__ = "playlists"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    songs_list = Column(JSON, default=[])

class Users(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    first_name = Column(String)
    last_name = Column(String)
    hashed_password = Column(String)
    playlists = Column(JSON, default=[])
    favorites_songs = Column(String, default="")
    avatar_path = Column(String, default="")
    recently_songs = Column(JSON, default=[])
    
