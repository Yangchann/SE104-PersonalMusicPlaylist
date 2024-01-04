# Project SE104 - Personal Music Plalist Web Application

## I. Introduction

This project, SE104, focuses on developing a personal music streaming web application.

![demo](img/demo.jpg)


## II. Technologies

![tech](img/tech.png)

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- FastAPI (Python)

### Database
- SQLite3 (Managed using SQLachemy)


## III. Features
### 1. Authentic
- Signup/Login : 

  - User providing information; 

    ![Login_signup](img/login_signup.png)

  - FastAPI backend handles logic and receive feedback

    ![Signup](img/fail_success.png)

### 2. Add/Delete Users'Playlists
- From All playlists field, users can add Playlists in difference topics to their own playlists

  ![Add_Playlists](img/add.png)

- Similar with Delte Playlists, users can pop the playlists fromn their own playlists:

  ![Delete_Playlists](img/delete.png)

### 3. Play Playlists
- Click play button in playlist avatar to play this playlists
  <div style="text-align: center;">

  ![Playbtn](img/playbtn.png)

  </div>

- Then the interface will display the audio controler with following features:

  ![Play](img/play_playlist.png)

- The system will turn into the next playlist if there aren't any songs in playlists.

### 3. Audio Control
- Button to Ajust the volumn, songtimes, an play/pause

  ![btn](img/btn.png)

- Turn to the next or previous songs in the playlists, and warning if there aren't any songs next or previous

  ![warning](img/controler.png)

### 4. Edit profile
- User can edit FirstName, LastName and Avatar

- Click the mini ava in right corner, the edit form will appear

  ![form](img/profile.png)

- You can edit every field by clicking Change/Upload button, or edit all field by clicking Done after editing.

## Getting Started

### Setting up Audio Files

First, organize your audio files in the following structure within the "audio" folder:

### Running the Backend

Navigate to the BE folder and set up a virtual environment:

# Running Instructions

## Hosting Backend

First, organize your audio files in the following structure within the "audio" folder:
```
- Playlistname_1
  - Song_name1.mp3
  - Song_name2.mp3
  - ...
- Playlistname_2
  - Song_name3.mp3
  - Song_name4.mp3
  - ...
```
Navigate to the BE folder and set up a virtual environment:


```bash
cd BE
python -m venv fastapi
```

Activate virtual envi:

```bash
fastapi\Script\activate
```

Install the required packages:

```bash
pip install -r requirements.txt
```

Run the FastAPI server:

```
uvicorn main:app --port 8001 --reload

```

## Hosting Frontend

Using Golive server:
```
golive -p 5500

```
Or using Python HTTP server:

```
python -m http.server 5500
```
Now, you can access the web application at http://localhost:5500.


