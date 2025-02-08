//load and remove .css files
let index = 0;
let login = 0;
let csrfToken = '';


function removeCssFiles(){
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    console.log(stylesheets);
    stylesheets.forEach(link => {
        link.parentNode.removeChild(link);
    });
}

function loadCssFile(cssFile, additionalCssFile = null, additionalCssFile2 = null){
    removeCssFiles();
    let existLink = document.querySelector(`link[href="${cssFile}"]`);
    if (!existLink) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssFile;
        document.head.appendChild(link);
    }
    if (additionalCssFile) {
        let existAdditionalLink = document.querySelector(`link[href="${additionalCssFile}"]`);
        if (!existAdditionalLink) {
            const additionalLink = document.createElement('link');
            additionalLink.rel = 'stylesheet';
            additionalLink.href = additionalCssFile;
            document.head.appendChild(additionalLink);
        }
    }
    if (additionalCssFile2) {
        let existAdditionalLink = document.querySelector(`link[href="${additionalCssFile2}"]`);
        if (!existAdditionalLink) {
            const additionalLink = document.createElement('link');
            additionalLink.rel = 'stylesheet';
            additionalLink.href = additionalCssFile2;
            document.head.appendChild(additionalLink);
        }
    }
}

function navigateTo(content, cssFile, path) {
    history.pushState({ content, cssFile }, '', path);
    
    if(cssFile === '../Css/Chat.css')
        loadCssFile('../Css/Chat.css', '../Css/bootstrap.css', "https://fonts.googleapis.com/icon?family=Material+Icons");
    else if(cssFile === '../Css/ChooseGame.css')
        loadCssFile('../Css/ChooseGame.css', 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css')
    else
        loadCssFile(cssFile);
    LoadContent(content);
}

function HomeContent(){
    var typed = new Typed(".dynamic-h1", {
        strings : ["A New Place <br> For Professional<br> <span class='pingpong'>Ping Pong</span> <br> Gamers ."],
        typeSpeed : 50,
        showCursor: false
    })
    
    var typed = new Typed(".dynamic-h2", {
        strings : ["Experience the thrill of table tennis with our fast-paced Ping Pong Game! Master your skills, <br>compete with friends, and climb the leaderboards in this exciting arcade-style sports game."],
        typeSpeed : 20,
        startDelay: 4200,
        showCursor: false
    })
    document.getElementById('start').addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('gameContent', '../Css/Game.css',  '/Game');
    });
}

function GameContent(){
    document.getElementById('to_tournoi').addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('tournoiContent', '../Css/Tournoi.css',  '/Tournoi');

    });
    document.getElementById('start').addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('ChooseGame', '../Css/ChooseGame.css',  '/ChooseGame');

    });
}

function SettingContent(){
    fetch('http://127.0.0.1:8001/api/user/', {
        method: 'GET',
        credentials: 'include',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {

        console.log(data.image_link);
        const profileImg = document.getElementById('profile');
        profileImg.src = data.image_link || "../assets/images/fouaouri.jpeg";
        document.getElementById("fullName").textContent = data.fullname || "Nset/A";
        document.getElementById("userName").textContent = data.username || "N/A";
        document.getElementById("Mail").textContent = data.email || "N/A";
        document.getElementById("Avatar").textContent = data.avatar || "N/A";
        document.getElementById("City").textContent = data.City || "N/A";
    })
    .catch(error => {
        console.error("There was a problem fetching the data:", error);
    });
    document.getElementById('Edit').addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('EditContent', '../Css/Edit.css',  '/Edit');
    });
    // ADDED
    document.getElementById('Logout').addEventListener('click', (e) => {
        e.preventDefault();
        fetch('http://127.0.0.1:8001/api/logout/', {
            method: 'POST',
            credentials: 'include',  // Ensures cookies (and session) are sent
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                // Include CSRF token if your view is CSRF-protected.
                // Make sure `csrfToken` is defined properly (see previous examples).
                'X-CSRFToken': csrfToken,
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Logout failed');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message);  // e.g., "Logout successful"
            // Once logout is successful, navigate to the home content.
            navigateTo('homeContent', '../Css/Home.css', '/Home');
        })
        .catch(error => {
            console.error('Logout error:', error);
            // Optionally handle the error (e.g., show a message to the user)
        });
    });///
}

function EditContent(){
    const info = document.querySelector('.Infos');

    info.addEventListener("submit", event =>{
        event.preventDefault();
        
        const dataForm = new FormData(info);
        for (let [key, value] of dataForm.entries()) {
                console.log(`${key}: ${value}`);
            }
        const imageInput = document.getElementById('profile-update');
        const file = imageInput.files[0]; // Get the selected file
            
            // Add the file to FormData
        if (file)
            dataForm.append('image_link', file);
        console.log(10000);
        console.log(dataForm.get('City'));
        console.log( "image ::::" + dataForm.get('image_link'));
        const data = new URLSearchParams(dataForm);
        fetch('http://127.0.0.1:8001/api/update_user/', {
            method : 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': csrfToken, // Include CSRF token
            },
            body : data
        }).then(res => res.json())
          .then(data => console.log(data))
          .catch(error => console.log(error));
    });

    // const editElement = document.getElementById('Avatar')
    // if (editElement) {
    //     editElement.addEventListener('click', (e) => {
    //     e.preventDefault();
    //     LoadContent('Avatar1');
    //     navigateTo('Avatar1', '../Css/avatar1.css',  '/Avatar1');

    //     });
    // } else {
    // console.error("Element with id 'someId' was not found.");
    // }
    
}


function ProfileContent(){
    fetch('http://127.0.0.1:8001/api/user/', {
        method: 'GET',
        credentials: 'include',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {
        console.log('Fullname|',data.fullname, '|');
        const profileImg = document.getElementById('profile');
        profileImg.src = data.image_link || "../assets/images/fouaouri.jpeg";
        document.getElementById("fullName").textContent = data.fullname || "NssssssssssssssA";
        document.getElementById("userName").textContent = data.username || "N/A";
        document.getElementById("Mail").textContent = data.email || "N/A";
        document.getElementById("Avatar").textContent = data.avatar || "N/A";
        document.getElementById("City").textContent = data.City || "N/A";
    })
    .catch(error => {
        console.error("There was a problem fetching the data:", error);
    });

    // startScrooling();
}


function LoadContent(templateId){
    const template = document.getElementById(templateId);
    if (!template) {
        console.error(`Template with id "${templateId}" not found`);
        return;
    }
    const templateContent = template.content.cloneNode(true);
    const dynamicContent = document.getElementById('templates-area');
    dynamicContent.innerHTML = '';

    dynamicContent.appendChild(templateContent);

    //because eventlistner is lost in first when load the profile page directly via the URL bar reattach navigation listeners after loading new content
    // document.getElementById('profile').addEventListener('click', (e) => {
    //     console.log("profiiiiiile");
    //     e.preventDefault();
    //     navigateTo('ProfileContent', '../Css/Profile.css',  '/Profile');
    // });
    ////

    if(templateId === 'openningContent'){
        document.getElementById('clickme').addEventListener('click', (e) => {
            checkUserLoginFromBackend();
            navigateTo('firstContent', '../Css/first_page.css',  '/LoginPage')
        });
    }
    if(templateId === 'homeContent')
        HomeContent();
    if(templateId === 'ProfileContent')
        ProfileContent();
    if(templateId === 'gameContent')
        GameContent();
    if(templateId === 'settingContent')
        SettingContent();
    if(templateId === 'EditContent')
        EditContent();
    if(templateId === 'Regester'){
        const info = document.querySelector('.Info');

        info.addEventListener("submit", event =>{
            console.log(10000);
            event.preventDefault();

            const dataForm = new FormData(info);
            console.log('City:', dataForm.get('City'));
            console.log(dataForm.get('fullname'));
            const data = new URLSearchParams(dataForm);
            //URL should be replaced by the correct URL 
            fetch('http://127.0.0.1:8001/api/register/', {
                method : 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': csrfToken,
                },
                body : data
            })//ADDED
            .then(data => {
                console.log('Registration successful:',data);
                // Force a refresh of auth state
                checkUserLoginFromBackend();
                // Redirect to home
                navigateTo('homeContent', '../Css/Home.css', '/Home');
            })
            .catch(error => {
                console.error('Registration error:', error);
                alert('Registration failed: ' + error.message);
            });////
        });
        document.getElementById('showLogin').addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo('firstContent', '../Css/first_page.css',  '/LoginPage')
        });
        document.getElementById('intra42-login-btn').addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo('homeContent', '../Css/Home.css',  '/Home');
            // const intra42LoginUrl = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-9d2d8fa97dc6b65bd84be86acda526487543730f59841291ee8187f3970bac15&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Faccounts%2F42intra%2Flogin%2Fcallback%2F&response_type=code";
            // window.location.href = intra42LoginUrl;
            // templateId = 'dataContent';
        });
    }
    if(templateId === 'firstContent'){
        console.log('first');
        const info = document.querySelector('.Info');

        info.addEventListener("submit", event =>{
            console.log(10000);
            event.preventDefault();

            const dataForm = new FormData(info);
            console.log(dataForm.get('username'));
            console.log(dataForm.get('password'));
            const data = new URLSearchParams(dataForm);
            //URL should be replaced by the correct URL 
            fetch('http://127.0.0.1:8001/api/login/', {
                method : 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': csrfToken,
                },
                body : data
            })///ADDED
            .then(res => {
                if (!res.ok) throw new Error('Login failed');
                return res.json();
            })
            .then(data => {
                console.log('Login successful:', data);
                checkUserLoginFromBackend();
            })
            .catch(error => {
                console.error('Login error:', error);
                alert('Login failed: ' + error.message);
            });///////
        });
        document.getElementById('showRegister').addEventListener('click', (e) => {
            console.log('dkhel');
            e.preventDefault();
            navigateTo('Regester', '../Css/Regester.css',  '/Regester');
        });
    }
    if(templateId === 'tournoiContent')
        if(templateId === 'mobile'){
            document.getElementById('back-home').addEventListener('click', (e) => {
                e.preventDefault();
                navigateTo('homeContent', '../Css/Home.css',  '/Home');

        });
    }
    if(templateId === 'Avatar1' || templateId === 'Avatar2' ||templateId === 'Avatar3' || templateId === 'Avatar4'
     || templateId === 'Avatar5' || templateId === 'Avatar6' || templateId === 'Avatar7' || templateId === 'Avatar8'){
        const pages =[
            'Avatar1', 'Avatar2', 'Avatar3', 'Avatar4',
            'Avatar5', 'Avatar6', 'Avatar7', 'Avatar8'
        ];
        const csspages =[
            '../Css/avatar1.css', '../Css/avatar2.css', '../Css/avatar3.css', '../Css/avatar4.css',
            '../Css/avatar5.css', '../Css/avatar6.css', '../Css/avatar7.css', '../Css/avatar8.css'
        ];
        function rswapPage(){
            document.getElementById('r_click').addEventListener('click', (e) => {
                index = (index + 1) % pages.length;
                e.preventDefault();
                navigateTo(pages[index], csspages[index],  `/${pages[index]}`);
        });
        };
        function lswapPage(){
            document.getElementById('l_click').addEventListener('click', (e) => {
                index = (index - 1 + pages.length) % pages.length;
                e.preventDefault();
                navigateTo(pages[index], csspages[index],  `/${pages[index]}`);

            });
        };
        rswapPage();
        lswapPage();
    }
};

function checkWindowSize() {
    if (window.innerWidth <= 800)
        navigateTo('mobile', '../Css/Mobile.css',  'mobile');
}

window.addEventListener('resize', checkWindowSize);


function checkUserLoginFromBackend() {
    fetch('http://127.0.0.1:8001/auth-check/', {
        method: 'GET',
        credentials: 'include',
    })
    .then(response => response.json())
    .then(data => {

        if (data.isLoggedIn) {
            console.log("User is authenticated!");
            const path = window.location.pathname;
            if(path)
                handleRouting(path);
            else
                navigateTo('homeContent', '../Css/Home.css',  '/Home');
            document.getElementById('home').addEventListener('click', (e) => {
                e.preventDefault();
                navigateTo('homeContent', '../Css/Home.css',  '/Home');
            });
            document.getElementById('profile').addEventListener('click', (e) => {
                console.log("profiiiiiile");
                e.preventDefault();
                navigateTo('ProfileContent', '../Css/Profile.css',  '/Profile');
            });
            document.getElementById('game').addEventListener('click', (e) => {
                e.preventDefault();
                navigateTo('gameContent', '../Css/Game.css',  '/Game');
    
            });
            document.getElementById('tournoi').addEventListener('click', (e) => {
                e.preventDefault();
                navigateTo('tournoiContent', '../Css/Tournoi.css',  '/Tournoi');
    
            });
            document.getElementById('settings').addEventListener('click', (e) => {
                e.preventDefault();
                navigateTo('settingContent', '../Css/Setting.css',  '/Settings');
            });
            document.getElementById('Chat').addEventListener('click', (e) => {
                e.preventDefault();
                navigateTo('ChatContent', '../Css/Chat.css', '/Chat');
            });
        } 
        else {
            console.log(data.isLoggedIn);
            console.log("User is not authenticated");
            // navigateTo('openningContent', '../Css/openning.css',  '/OpeningPage');
            // ADDED
            navigateTo('firstContent', '../Css/first_page.css',  '/LoginPage');
            ///
        }
    })
    .catch(error => {
        console.error('Error checking login status:', error);
        navigateTo('openningContent', '../Css/openning.css',  '/OpeningPage');
    });
}

// function checkUserLoginFromBackend() {
//     fetch('http://127.0.0.1:8001/auth-check/', {
//         method: 'GET',
//         credentials: 'include',
//     })
//     .then(response => response.json())
//     .then(data => {
//             navigateTo('openningContent', '../Css/openning.css',  '/OpeningPage');
//         if (data.isLoggedIn) {
//             console.log("User is authenticated!");
//             const path = window.location.pathname;
//             if(path)
//                 handleRouting(path);
//             else
//                 navigateTo('openningContent', '../Css/openning.css',  '/OpeningPage');
//             document.getElementById('home').addEventListener('click', (e) => {
//                 e.preventDefault();
//                 navigateTo('homeContent', '../Css/Home.css',  '/Home');
//             });
//             document.getElementById('profile').addEventListener('click', (e) => {
//                 console.log("profiiiiiile");
//                 e.preventDefault();
//                 navigateTo('ProfileContent', '../Css/Profile.css',  '/Profile');
//             });
//             document.getElementById('game').addEventListener('click', (e) => {
//                 e.preventDefault();
//                 navigateTo('gameContent', '../Css/Game.css',  '/Game');
    
//             });
//             document.getElementById('tournoi').addEventListener('click', (e) => {
//                 e.preventDefault();
//                 navigateTo('tournoiContent', '../Css/Tournoi.css',  '/Tournoi');
    
//             });
//             document.getElementById('settings').addEventListener('click', (e) => {
//                 e.preventDefault();
//                 navigateTo('settingContent', '../Css/Setting.css',  '/Settings');
//             });
//             document.getElementById('Chat').addEventListener('click', (e) => {
//                 e.preventDefault();
//                 navigateTo('ChatContent', '../Css/Chat.css', '/Chat');
//             });
//         } 
//         else {
//             console.log(data.isLoggedIn);
//             console.log("User is not authenticated");
//             navigateTo('openningContent', '../Css/openning.css',  '/OpeningPage');
//         }
//     })
//     .catch(error => {
//         console.error('Error checking login status:', error);
//         navigateTo('openningContent', '../Css/openning.css',  '/OpeningPage');
//     });
// }
document.addEventListener('DOMContentLoaded', function() {
    // csrfToken
    fetch('http://127.0.0.1:8001/get-csrf-token/', {
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        csrfToken = data.csrfToken;
        
    })
    .catch(error => console.error('Error fetching CSRF token:', error));

    const path = window.location.pathname;
    console.log("Initial routing for path:", path);
    handleRouting(path);
    //////
    window.addEventListener('popstate', function(event) {
        if (event.state) {
            LoadContent(event.state.content);
            loadCssFile(event.state.cssFile);
        }
    });

    checkWindowSize();
    checkUserLoginFromBackend();
});

function handleRouting(path){
    console.log("path : " + path);
    switch (path) {
        case '/LoginPage':
            navigateTo('homeContent', '../Css/Home.css', '/Home');
            break;
        case '/Regester':
            navigateTo('homeContent', '../Css/Home.css', '/Home');
            break;
        case '/Home':
            navigateTo('homeContent', '../Css/Home.css', '/Home');
            break;
        case '/Profile':
            navigateTo('ProfileContent', '../Css/Profile.css',  '/Profile');
            break;
        case '/Game':
            navigateTo('gameContent', '../Css/Game.css', '/Game');
            break;
        case '/ChooseGame':
            navigateTo('ChooseGame', '../Css/ChooseGame.css', '/ChooseGame');
            break;
        case '/Settings':
            navigateTo('settingContent', '../Css/Setting.css', '/Settings');
            break;
        case '/Tournoi':
            navigateTo('tournoiContent', '../Css/Tournoi.css', '/Tournoi');
            break;
        case '/Chat':
            navigateTo('ChatContent', '../Css/Chat.css', '/Chat');
            break;
        case '/Edit':
            navigateTo('EditContent', '../Css/Edit.css',  '/Edit');
            break;
        case '/AiorPlayer':
            navigateTo('ChooseAi', '../Css/Ai.css',  '/AiorPlayer'); 
            break;
        case '/StarWars':
            navigateTo('StarWars', '../Css/StarWars.css',  '/StarWars');
            break;
        case '/AIgame':
            navigateTo('AIgame', '../Css/3d.css',  '/AIgame'); 
            break;
        default:
            navigateTo('openningContent', '../Css/openning.css',  '/OpeningPage');
            break;
    }
}