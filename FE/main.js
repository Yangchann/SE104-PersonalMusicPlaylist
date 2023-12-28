// your-script.js

document.addEventListener("DOMContentLoaded", function () {
    var username = localStorage.getItem("username");
    fetchownPlaylists(username);
    fetchRecentlyPlaylists(username);
    fetchUserInfo(username);
    controlSeekBar();
    controlVolume()

});

current_playlists = []
all_playlists = []
current_index = 0
var audioPlayer = new Audio()

function fetchownPlaylists(username) {
    // Gửi yêu cầu GET tới endpoint của server
    // var username = document.getElementById("userImage").getAttribute("title")
    fetch(`http://127.0.0.1:8001/playlists/take_owned_playlists/${username}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Lấy container của playlists
        all_playlists = data;
        console.log(all_playlists);

        const playlistContainer = document.getElementById('myPlaylistContainer');

        // Loop through the data and create playlist items
        for (const key in data) {
            // console.log(key, data[key]);
            // Create the content for each playlist item

            const imageUrl = data[key]["imageUrl"]
            const title = data[key]["title"]
            console.log(imageUrl)
            console.log(title)

            const playlistItem = document.createElement('li');
            playlistItem.className = 'Item';
            playlistItem.innerHTML = `
                <div class="img_play">
                    <img src="${imageUrl}" alt="alan">
                    <i id="playbtn" class="bi playListPlay bi-play-circle-fill"></i>
                </div>
                <h5>${title}</h5>
            `;

            // Append the playlist item to the container
            playlistContainer.appendChild(playlistItem);
        }

        const playButtons = document.querySelectorAll('#myPlaylistContainer .bi.playListPlay');
        playButtons.forEach(button => {
            button.addEventListener('click', function () {
                const playlist_name_clicked = button.closest('li').querySelector('h5').textContent;
                const playPauseBtn = document.getElementById('playPauseBtn');
                playPauseBtn.classList.remove("bi-play-circle-fill");
                playPauseBtn.classList.add("bi-pause-circle-fill");

                fetchSongsfromPlaylist(playlist_name_clicked)
                    .then(song_list => {
                        console.log(song_list);
                        current_index = 0;
                        playPlaylistSongs(playlist_name_clicked,song_list);
                    })
                    .catch(error => {
                        console.error('Error fetching songs:', error);
                    });
            });
        });
    });
}



function fetchRecentlyPlaylists(username) {
    // Gửi yêu cầu GET tới endpoint của server
    // var username = document.getElementById("userImage").getAttribute("title")
    fetch(`http://127.0.0.1:8001/playlists/take_recently_playlists/${username}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
        // Lấy container của playlists
        const playlistContainer = document.getElementById('myRecentlyPlaylistContainter');

        // Loop through the data and create playlist items
        for (const key in data) {
            // console.log(key, data[key]);
            // Create the content for each playlist item

            const imageUrl = data[key]["imageUrl"]
            const title = data[key]["title"]
            console.log(imageUrl)
            console.log(title)

            const playlistItem = document.createElement('li', className='Item');
            playlistItem.innerHTML = `
                <div class="img_play">
                    <img src="${imageUrl}" alt="alan">
                    <i id="playbtn" class="bi playListPlay bi-play-circle-fill"></i>
                </div>
                <h5>${title}
                    <br>
                    <div class="subtitle">Subtitle</div>

                </h5>
            `;

            // Append the playlist item to the container
            playlistContainer.appendChild(playlistItem);

            }
        }
    )}



function fetchSongsfromPlaylist(playlist_name) {
    return fetch(`http://127.0.0.1:8001/playlists/take_songs_list/${playlist_name}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            return data; // Return the data from the fetch
        });
}




function fetchUserInfo(username){
    // Request

    fetch(`http://127.0.0.1:8001/take_user_infor/${username}`)
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();

    })
    .then(data => {

        console.log(data);

        // take data from fetch
        var avatarPath = data["avatar_path"];
        var firstName = data["first_name"];
        var lastName = data["last_name"];

        var userImage = document.getElementById('userImage');
        var userImage_1 = document.getElementById('userImage_1');
        var usernameElemet = document.getElementById('username');

        userImage.src = avatarPath
        userImage_1.src = avatarPath
        usernameElemet.textContent = firstName + " " + lastName


    })

}


function playPlaylistSongs(playlist_name_clicked, playlistData) {

    const baseAudioPath = `audio/${playlist_name_clicked}`.replace(/\/$/, "");
    const songs = playlistData.map(song => `${baseAudioPath}/${song}.mp3`);
    current_playlists = songs;

    console.log(songs);

    // let currentIndex = 0;


    audioPlayer.playbackRate = 4.0 || 1.0;

    audioPlayer.src = songs[current_index]
    audioPlayer.play();

    audioPlayer.addEventListener('ended', function(){
        current_index ++;

        if (current_index < songs.length) {
            console.log(songs[current_index]);

            audioPlayer.src = songs[current_index];
            audioPlayer.play();
        }
        else {
            console.log('Playlist ended');
            const playlistNames = Object.keys(all_playlists);
            const currentIndexInNames = playlistNames.indexOf(playlist_name_clicked);

            if (currentIndexInNames < playlistNames.length - 1) {
                // Move to the next playlist
                const nextPlaylistName = playlistNames[currentIndexInNames + 1];
                console.log(nextPlaylistName);
                current_index = 0;
                fetchSongsfromPlaylist(nextPlaylistName)
                    .then(song_list => {
                        console.log(song_list);
                        playPlaylistSongs(nextPlaylistName,song_list);
                    })
                    .catch(error => {
                        console.error('Error fetching songs:', error);
                    });
            }
            else {
                console.log('All playlists ended');

            }
        }
    });
}

// ----------------------------------------------------------------
// Controler bar

function pause() {
    const playPauseBtn = document.getElementById('playPauseBtn');

    if (audioPlayer.paused) {
        audioPlayer.play();
        console.log('Paused');
        playPauseBtn.classList.remove("bi-play-circle-fill");
        playPauseBtn.classList.add("bi-pause-circle-fill");
    }
    else {
        audioPlayer.pause();
        console.log("Play")
        playPauseBtn.classList.remove("bi-pause-circle-fill");
        playPauseBtn.classList.add("bi-play-circle-fill");
    }
}


function nextsong() {
    current_index++;
    console.log(current_playlists[current_index]);
    audioPlayer.pause();

    if (current_index < current_playlists.length) {
        audioPlayer.src = current_playlists[current_index];
        audioPlayer.play();
    } else {
        console.log('Playlist ended');
    }
}


function previoussong() {
    current_index--;

    if (current_index >= 0 && current_index < current_playlists.length) {
        console.log(current_playlists[current_index]);
        audioPlayer.pause();
        audioPlayer.src = current_playlists[current_index];
        audioPlayer.play();
    } else {
        console.log('No previous song available');
        current_index = 0; // Reset to the beginning if there is no previous song
    }
}



function controlSeekBar() {
    const seekBar = document.getElementById('seekBar');
    const playedColor = '#3bdcd2';
    const remainingColor = '#ccc';

    audioPlayer.addEventListener('timeupdate', function () {
        const currentTime = audioPlayer.currentTime;
        const duration = audioPlayer.duration;

        const progress = (currentTime / duration) * 100;

        seekBar.value = progress;

        seekBar.style.background = `linear-gradient(90deg, ${playedColor} ${progress}%, ${remainingColor} ${progress}%, ${remainingColor} ${100 - progress}%)`;
    });

    seekBar.addEventListener('input', function () {
        const seekPosition = (seekBar.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = seekPosition;
    });

    seekBar.addEventListener('mousedown', function () {
        audioPlayer.pause();
    });

    seekBar.addEventListener('mouseup', function () {
        audioPlayer.play();
    });
}



function controlVolume() {
    const volumeBar = document.getElementById('volumeBar');
    const volumeIcon = document.getElementById('volumeIcon');
    const mutedColor = '#3bdcd2';

    // Set the initial background color
    volumeBar.style.background = `linear-gradient(90deg, ${mutedColor} ${volumeBar.value}%, transparent ${volumeBar.value}%)`;

    audioPlayer.addEventListener('volumechange', function () {
        const volume = audioPlayer.volume * 100;
        volumeBar.value = volume;

        if (audioPlayer.muted) {
            volumeIcon.style.color = mutedColor;
        } else {
            volumeIcon.style.color = '';
        }
    });

    volumeBar.addEventListener('input', function () {
        const volumeLevel = volumeBar.value / 100;
        audioPlayer.volume = volumeLevel;
        audioPlayer.muted = false;
        volumeBar.style.background = `linear-gradient(90deg, ${mutedColor} ${volumeBar.value}%, transparent ${volumeBar.value}%)`;
    });

    volumeIcon.addEventListener('click', function () {
        audioPlayer.muted = !audioPlayer.muted;

        if (audioPlayer.muted) {
            volumeIcon.style.color = mutedColor;
        } else {
            volumeIcon.style.color = '';
        }
    });
}
// ----------------------------------------------------------------
// Form Edit Profile
function showEditForm() {
    document.getElementById('editForm').style.display = 'block';
}

function changeInfo(fieldName) {
    var inputValue = document.getElementById(fieldName).value;
    // Add logic to handle changing information
    // This function can be modified according to your requirements
    console.log(fieldName + ' changed to: ' + inputValue);
}

function doneEditing() {
    document.getElementById('editForm').style.display = 'none';
}



