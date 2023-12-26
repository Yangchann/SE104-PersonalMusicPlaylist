from fastapi import APIRouter, Depends, HTTPException, status, Path
from pydantic import BaseModel, Field
from database import SessionLocal
from typing import Annotated
# from models import Playlist
from sqlalchemy.orm import Session
# from models import Playlist
import os

router = APIRouter()
Playlists = {
    "Suy": {
        "title": "Suy", 
         "imageUrl": "img/1.jpg",
        "songslist": ["Chúng ta không thuộc về nhau", "Em của ngày hôm qua"]
        },
    "Yêu đời": {
        "title": "Yêu đời", 
         "imageUrl": "img/2.jpg",
         "songslist": ["Chúng ta không thuộc về nhau", "Em của ngày hôm qua"]
        },
    
    "Cờ bạc": {
        "title": "Cờ bạc", 
        "imageUrl": "img/3.jpg",
        "songslist": ["Chúng ta không thuộc về nhau", "Em của ngày hôm qua"]
        },
    "Bolero": {
        "title": "Bolero", 
        "imageUrl": "img/4.jpg",
        "songslist": ["Chúng ta không thuộc về nhau", "Em của ngày hôm qua"]
        },
    "Yêu đời": {
        "title": "Yêu đời", 
         "imageUrl": "img/2.jpg",
         "songslist": ["Chúng ta không thuộc về nhau", "Em của ngày hôm qua"]
        },
    "Yêu đời": {
        "title": "Yêu đời", 
         "imageUrl": "img/2.jpg",
         "songslist": ["Chúng ta không thuộc về nhau", "Em của ngày hôm qua"]
        },  
    }

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
db_dependency = Annotated[Session, Depends(get_db)]    


@router.get("/playlists/take_all_playlists")
async def take_all_playlists():
    return Playlists

# @router.post("/playlists/add_songs")
    