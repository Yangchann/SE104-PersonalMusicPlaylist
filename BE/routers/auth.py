# import APIRouter
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from pydantic import BaseModel
from models import Users
from sqlalchemy.orm import Session
from database import SessionLocal
from typing import Annotated
from datetime import timedelta, datetime
import bcrypt
from PIL import Image
import io
import os
router = APIRouter()



salt = bcrypt.gensalt()

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

class UpdateUserFirstName(BaseModel):
    username: str
    first_name: str
class UpdateUserLastName(BaseModel):
    username: str
    last_name: str




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
    
db_dependency = Annotated[Session, Depends(get_db)]    

def authenticate_user(username: str, password: str, db):
    user = db.query(Users).filter(Users.username == username).first()

    if not user:
        return False

    if not bcrypt.checkpw(password.encode('utf-8'), user.hashed_password):
        return False

    return user



@router.post("/auth/signup")
async def create_user(db: db_dependency,
                      create_user_request: CreateUserRequest):
    
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


    
    

class UserManager:
    def __init__(self, db: Session):
        self.db = db

    def get_user(self, username: str):
        return self.db.query(Users).filter(Users.username == username).first()

    def update_user_attribute(self, username: str, attribute_name: str, attribute_value: str):
        user = self.get_user(username)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        setattr(user, attribute_name, attribute_value)
        self.db.add(user)
        self.db.commit()
    def update_user_avatar(self, username: str, avatar: UploadFile):
        user = self.get_user(username)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        user_avatar_directory = r"D:\SE\FrontEnd\userimg"

        user_avatar_path = os.path.join(user_avatar_directory,username + ".jpg")
        with open(user_avatar_path, "wb") as avatar_file:
            avatar_file.write(avatar.file.read())

        # Update the user's avatar path in the database
        user.avatar_path = user_avatar_path
        self.db.add(user)
        self.db.commit()

user_manager = UserManager(db_dependency)


class UserRequestFirstName(BaseModel):
    username: str
    first_name: str
class UserRequestLastName(BaseModel):
    username: str
    last_name: str


@router.post("/user/update_first_name")
async def update_first_name(db:db_dependency, user_request: UserRequestFirstName):
    username = user_request.username
    user = db.query(Users).filter(Users.username == username).first()
    user.first_name = user_request.first_name
    db.add(user)
    db.commit()
    return {"Status": True, "details": "First name updated successfully", "username": username}

@router.post("/user/update_last_name")
async def update_first_name(db:db_dependency, user_request: UserRequestLastName):
    username = user_request.username
    user = db.query(Users).filter(Users.username == username).first()
    user.last_name = user_request.last_name
    db.add(user)
    db.commit()
    return {"Status": True, "details": "Last name updated successfully", "username": username}


@router.post("/user/update_avatar/{username}")
async def update_avatar(username: str, avatar: UploadFile = File(...), db: Session = Depends(get_db)):
    user_manager = UserManager(db)
    user_manager.update_user_avatar(username, avatar)
    return {"Status": True, "details": "Avatar updated successfully", "username": username}
