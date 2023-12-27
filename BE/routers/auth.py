# import APIRouter
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from models import Users
# from passlib.context import CryptContext
from sqlalchemy.orm import Session
from database import SessionLocal
from typing import Annotated
# from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta, datetime
import bcrypt


router = APIRouter()



salt = bcrypt.gensalt() # for hashing algorithm

# validation User request
class CreateUserRequest(BaseModel):
    username: str
    first_name: str
    last_name: str
    password: str    

class SignUpUser(BaseModel):
    username: str
    password: str

class UpdateUserInfor(BaseModel):
    username: str
    first_name: str
    last_name: str
    favorites_songs: str
    avatar_path: str    


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def add_database(db, request):
    try:
        db.add(request)
        db.commit()
    except Exception as e:
        db.rollback()
        raise e
    
# param means: db will be define in a "get_db" function        
db_dependency = Annotated[Session, Depends(get_db)]    

# Check auth sucessfully
def authenticate_user(username: str, password: str, db):
    # find the user information if it exists
    user = db.query(Users).filter(Users.username == username).first()

    if not user:
        return False

    # compare the hashed password from the database with the input password
    if not bcrypt.checkpw(password.encode('utf-8'), user.hashed_password):
        return False

    return user



@router.post("/auth/signup")
async def create_user(db: db_dependency,
                      create_user_request: CreateUserRequest):
    # this following line will not work cause Users table doesnt have "passwork" atribute
    # create_user_model = Users(**create_user_request.model_dump()) # create Users instance database
    
    create_user_model = Users(
                                username=create_user_request.username,
                                first_name=create_user_request.first_name,
                                last_name=create_user_request.last_name,
                                hashed_password= bcrypt.hashpw(create_user_request.password.encode('utf-8'), salt),
                                playlists=[])
    
    
    db.add(create_user_model) # insert
    db.commit() # commit insert process
    
    
    return {"Status": True, "details": "Successfully created", "username": create_user_request.username}
    
    
@router.post("/auth/signin")   
async def signin(db: db_dependency,
                 userquest: SignUpUser):
    
    user = authenticate_user(userquest.username, userquest.password, db)
    if not user:
        raise HTTPException(statuscode=401, detail="Username not found")
    return {"Status": True, "details": "Successfully Login", "username": userquest.username}




@router.get("/take_all_user")
async def take_all_user(db: db_dependency):
    return db.query(Users).all()

@router.get("/take_user_infor/{username}")
async def take_user_infor(db: db_dependency,
                          username: str):
    user = db.query(Users).filter(username == Users.username).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"first_name": user.first_name,
            "last_name": user.last_name,
            "playlists": user.playlists,
            "favourites_songs": user.favorites_songs,
            "avatar_path": user.avatar_path
            }

@router.post("/update_user_infor")
async def update_user_infor(username: str,
                            UserRequest: UpdateUserInfor,
                            db: db_dependency):
    user = db.query(Users).filter(username == Users.username).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    
    create_user_model = UpdateUserInfor(**UserRequest.model_dump()) # create Users instance database
    
    user.first_name = create_user_model.first_name
    user.last_name = create_user_model.last_name
    user.favorites_songs = create_user_model.favorites_songs
    user.avatar_path = create_user_model.avatar_path
    
    db.add(user)
    
    db.commit()

    
    

