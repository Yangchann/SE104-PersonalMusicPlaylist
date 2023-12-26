from fastapi import FastAPI
import models
from routers import auth, playlist
from database import engine
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],  # Update with your frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


models.Base.metadata.create_all(bind=engine) # create all table
# turn on the cmd: sqlite3 todos.db

app.include_router(auth.router)
app.include_router(playlist.router)
# API rule
## endpoint foramt: /{object}/{method}
## /users/add_playlist  /users/take_all_playlists /users/delete_playlists
## /playlists/take_all_playlists , playlists/add_playlist
