from fastapi import APIRouter, Depends, HTTPException, status, Path
from pydantic import BaseModel, Field
from database import SessionLocal
from typing import Annotated
from models import Users
import json
# from models import Playlist
from sqlalchemy.orm import Session
# from models import Playlist
import os

router = APIRouter()

with open("playlists.json", "r", encoding="utf-8") as json_file:
    Playlists = json.load(json_file)

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


class AddPlaylistRequest(BaseModel):
    username: str
    playlist_name: str


@router.post("/playlists/add_to_own_playlists")
async def add_to_list(db: db_dependency, userrequest: AddPlaylistRequest ):
    username = userrequest.username
    user = db.query(Users).filter(Users.username == username).first()
    
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.playlists is None:
        user.playlists = []
    
    playlist = list(user.playlists)
    playlist.append(userrequest.playlist_name)    
    user.playlists = playlist
    
    db.add(user)
    
    # Commit the changes to the database
    db.commit()
    
class DeleteRequest(BaseModel):
    username: str
    playlist_name: str
@router.delete("/playlists/delete_from_own_playlists")
async def delte_from_list(db: db_dependency, user_request: DeleteRequest):
    username = user_request.username
    user = db.query(Users).filter(Users.username == username).first()
    
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.playlists is None:
        raise HTTPException(status_code=404, detail="Your playlists is empty")

    
    playlist = list(user.playlists)
    playlist.remove(user_request.playlist_name)    
    user.playlists = playlist
    
    db.add(user)
    
    # Commit the changes to the database
    db.commit()
    
    
@router.post("/playlists/add_to_recently_playlists")
async def add_to_recently_list(username: str, value: str, db: db_dependency):
    user = db.query(Users).filter(Users.username == username).first()
    
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.recently_songs is None:
        user.recently_songs = []
    
    playlist = list(user.recently_songs)
    playlist.append(value)
          
    user.recently_songs = playlist
    
    db.add(user)
    
    # Commit the changes to the database
    db.commit()


@router.get("/playlists/take_owned_playlists/{username}")
async def take_owned_playlists(username: str, db: db_dependency):
    user = db.query(Users).filter(Users.username == username).first()
    
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    playlist_names = user.playlists
    
    owned_playlists = {name: Playlists[name] for name in playlist_names}
    print(owned_playlists)
    return owned_playlists


@router.get("/playlists/take_recently_playlists/{username}")
async def take_recently_playlists(username: str, db: db_dependency):
    user = db.query(Users).filter(Users.username == username).first()
    
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    playlist_names = user.recently_songs
    
    recently_playlists = {name: Playlists[name] for name in playlist_names}
    
    return recently_playlists

    
@router.get("/playlists/take_songs_list/{playlist_name}")
async def take_songs_list_from_playlist_name(playlist_name: str, db: db_dependency):
    
    # replace by database
    return Playlists[playlist_name]["songslist"]    
    