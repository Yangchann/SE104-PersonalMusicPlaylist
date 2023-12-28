// your-script.js

document.addEventListener("DOMContentLoaded", function () {
    var username = localStorage.getItem("username");
    fetchownPlaylists(username);
    fetchRecentlyPlaylists(username);
    fetchUserInfo(username);


});

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
        console.log(data);
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
                playPauseBtn.classList.add("bi-pause-circle-fill");
                playPauseBtn.classList.remove("bi-play-circle-fill");
                fetchSongsfromPlaylist(playlist_name_clicked)
                    .then(song_list => {
                        localStorage.setItem('current_playlist', playlist_name_clicked);

                        console.log(song_list);
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
var audioPlayer = new Audio()


function playPlaylistSongs(playlist_name_clicked, playlistData) {

    const baseAudioPath = `audio/${playlist_name_clicked}`.replace(/\/$/, "");
    const songs = playlistData.map(song => `${baseAudioPath}/${song}.mp3`);
    console.log(songs);

    let currentIndex = 0;

    console.log(songs[currentIndex]);

    audioPlayer.playbackRate = 2.0 || 1.0;

    audioPlayer.src = songs[currentIndex]
    audioPlayer.play();

    audioPlayer.addEventListener('ended', function(){
        currentIndex ++;

        if (currentIndex < songs.length) {
            console.log(songs[currentIndex]);

            audioPlayer.src = songs[currentIndex];
            audioPlayer.play();
        }
        else {
            console.log('Playlist ended');
        }
    });
}


function pause() {
    const playPauseBtn = document.getElementById('playPauseBtn');

    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseBtn.classList.add("bi-play-circle-fill");
        playPauseBtn.classList.remove("bi-pause-circle-fill");
    }
    else {
        audioPlayer.pause();
        playPauseBtn.classList.add("bi-pause-circle-fill");
        playPauseBtn.classList.remove("bi-play-circle-fill");
    }
}


// function controlSeekBar() {
//     const seekBar = document.getElementById('seekBar');

//     // Update the seek bar value when the audio is playing
//     audioPlayer.addEventListener('timeupdate', function () {
//         const currentTime = audioPlayer.currentTime;
//         const duration = audioPlayer.duration;

//         // Calculate the percentage of the track played
//         const progress = (currentTime / duration) * 100;

//         // Update the seek bar value
//         seekBar.value = progress;
//     });

//     // Change the audio playback position when the user interacts with the seek bar
//     seekBar.addEventListener('input', function () {
//         const seekPosition = (seekBar.value / 100) * audioPlayer.duration;
//         audioPlayer.currentTime = seekPosition;
//     });
// }