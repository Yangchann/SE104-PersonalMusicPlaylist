// function take_all_database(event) {
//     event.preventDefault();

//     // call api
//     fetch('http://127.0.0.1:8001/auth', {
//             method: 'GET',
//             headers: {
//                 'Accept': 'application/json',
//             }
//         })
//         .then(response => response.json())
//         .then(data => {
//             console.log('API Response:', data);
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });
// }


// Sign up
function signup(event) {
    event.preventDefault();
    localStorage.clear();

    // Get input value
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var first_name = document.getElementById("first_name").value;
    var last_name = document.getElementById("last_name").value;

    var Data_request = {
        username: username,
        first_name: first_name,
        last_name: last_name,
        password: password
    };

    // Send request to the signup API
    fetch('http://127.0.0.1:8001/auth/signup', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(Data_request)
    })
    .then(response => response.json())
    .then(data => {
        console.log('API Response:', data);
        // Bootstrap raises popups
        $('#successModal').modal('show');

        // Delay before redirecting to login page
        setTimeout(function () {
            window.location.href = 'login.html';
        }, 2000); // Adjust the delay as needed
    })
    .catch(error => {
        // Bootstrap raises popups
        console.error('Error:', error.message);
        $('#errorModal').modal('show');
    });
}

document.getElementById('signup').addEventListener('click', function(event) {
    event.preventDefault();
    signup(event);  // Pass the event object to the signup function
    setTimeout(function() {
        window.location.href = 'login.html';
    }, 2000); // Adjust the delay as needed
});
// Login
function login(event) {
    event.preventDefault();
    localStorage.clear();
    var formData = {};
    formData["username"] = document.getElementById("username").value;
    formData["password"] = document.getElementById("password").value;

    console.log(formData);

    fetch('http://127.0.0.1:8001/auth/signin', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Invalid credentials');
            }
            return response.json();
        })
        .then(data => {
            console.log('API Response:', data);
            localStorage.setItem('username', data.username)
            // Boostrap rasise popups
            $('#successModal').modal('show');

            setTimeout(function () {
                window.location.href = 'index.html'; 
            }, 2000);
        })
        .catch(error => {
            // Boostrap rasise popups
            console.error('Error:', error.message);
            $('#errorModal').modal('show');
        });
}

// function take_all_file_test(event){
//     event.preventDefault();
//     const audio_Files = ['Audio/test.mp3', 'audio2.mp3', 'audio3.mp3']
//     for (var i = 0; i < 3; i++) {
//         let element = document.createElement('audio');
//         element.src = audio_Files[i]
//         element.controls = true;
//         document.body.appendChild(element);
//     }
// }