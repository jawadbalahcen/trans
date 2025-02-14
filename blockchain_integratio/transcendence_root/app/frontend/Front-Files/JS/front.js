//load and remove .css files
let index = 0;
let login = 0;


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
    let cssFiles = [cssFile];

    if (cssFile === '../Css/Chat.css') {
        loadCssFile('../Css/Chat.css', '../Css/bootstrap.css', "https://fonts.googleapis.com/icon?family=Material+Icons");
        cssFiles.push('../Css/bootstrap.css', "https://fonts.googleapis.com/icon?family=Material+Icons");
    } else {
        loadCssFile(cssFiles);
    }

    history.pushState({ content, cssFiles }, '', path);

    LoadContent(content);
}

function HomeContent(){
    const searchBox = document.querySelector(".search-box1");
    searchBox.style.display = "block";
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
    const searchBox = document.querySelector(".search-box1");
    searchBox.style.display = "block";
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
    const searchBox = document.querySelector(".search-box1");
    searchBox.style.display = "block";
    fetch('http://localhost:8000/api/auth/me/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        const profileImg = document.getElementById('profile');
        profileImg.src = data.image_link || '';
        document.getElementById("fullName").textContent = data.full_name || "N/A";
        document.getElementById("userName").textContent = data.username || "N/A";
        document.getElementById("Mail").textContent = data.email || "N/A";
        document.getElementById("City").textContent = data.city || "N/A";
    })
    .catch(error => {
        console.error("There was a problem fetching the data:", error);
    });
    document.getElementById('Edit').addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('EditContent', '../Css/Edit.css',  '/Edit');
    });
}

function EditContent() {
    const searchBox = document.querySelector(".search-box1");
    searchBox.style.display = "block";
    const info = document.querySelector('.Infos');
    const imageInput = document.getElementById('profile-update');
    const fileNameDisplay = document.getElementById("file-name");

    // File input change listener
    imageInput.addEventListener("change", function () {
        let fileName = this.files.length > 0 ? this.files[0].name : "No file chosen";
        fileNameDisplay.textContent = fileName;
        console.log('File selected:', fileName);
    });

    info.addEventListener("submit", async (event) => {
        event.preventDefault();
        // while(true){}
        const formData = new FormData(info);
        const file = imageInput.files[0];

        let imageUrl = null;
        
        // 1️⃣ Upload image first
        if (file) {
            const fileFormData = new FormData();
            fileFormData.append('image', file);

            try {
                // const fileUploadRes = await fetch('http://localhost:8000/upload/', {
                //     method: 'POST',
                //     credentials: 'include',
                //     body: fileFormData
                // });

                const fileUploadData = await fileUploadRes.json();
                imageUrl = fileUploadData.imageUrl;
            } catch (error) {
                console.error('File upload failed:', error);
                // return;
            }
        }
        console.log('File selected submit');

        // 2️⃣ Prepare JSON data
        const jsonData = {
            fullname: formData.get('fullname'),
            username: formData.get('username'),
            city: formData.get('City'),
            email: formData.get('email'),
            image_link: imageUrl || null
        };

        console.log("JSON Data to send:", jsonData);

        // 3️⃣ Send JSON data
        fetch('http://localhost:8000/api/auth/me/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify(jsonData)
        })
        .then(res => res.json())
        .then(data => console.log('Server response:', data))
        .catch(error => console.log('Error:', error));

        navigateTo('settingContent', '../Css/Setting.css', '/Settings');
    });
}



// function ProfileContent(){
//     fetch('http://localhost:8000/api/user/', {
//         method: 'GET',
//         credentials: 'include',
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error("Network response was not ok");
//         }
//         return response.json();
//     })
//     .then(data => {
//         console.log(data.image_link);
//         const profileImg = document.getElementById('profile');
//         profileImg.src = data.image_link;
//         document.getElementById("fullName").textContent = data.full_name || "N/A";
//         document.getElementById("userName").textContent = data.username || "N/A";
//         document.getElementById("Mail").textContent = data.email || "N/A";
//         document.getElementById("Avatar").textContent = data.avatar || "N/A";
//         document.getElementById("City").textContent = data.city || "N/A";
//     })
//     .catch(error => {
//         console.error("There was a problem fetching the data:", error);
//     });

//     startScrooling();
// }


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

    if(templateId === 'openningContent'){
        const searchBox = document.querySelector(".search-box1");
        searchBox.style.display = "none";
        document.getElementById('clickme').addEventListener('click', (e) => {
            navigateTo('firstContent', '../Css/first_page.css',  '/LoginPage')
        });
    }
    if(templateId === 'homeContent')
        HomeContent();
    if(templateId === 'gameContent')
        GameContent();
    if(templateId === 'settingContent')
        SettingContent();
    if(templateId === 'EditContent')
        EditContent();
    if(templateId === 'Regester'){
        const searchBox = document.querySelector(".search-box1");
        searchBox.style.display = "none";
        console.log("dkhel register");
        const form = document.querySelector('.Info');
        const info = document.getElementById('Register');
        console.log(info);
        info.addEventListener("click", (event) => {
            console.log('registeeeer');
            event.preventDefault();

            const dataForm = new FormData(form);

            const formObject = {};
        // dataForm.forEach((value, key) => {
        //     formObject[key] = value;
        // });
        const password = dataForm.get("password");
        dataForm.append("password2", password);
        const data = new URLSearchParams(dataForm);
        
            //URL should be replaced by the correct URL 
            fetch('http://localhost:8000/api/auth/register/', {
                method : 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body : data
            })
            .then(res => {
                console.log(res);
                return res.json()})
            .then(data => console.log(data))
            .catch(error => console.log(error));
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
        const form = document.querySelector('.Info');
        const info = document.getElementById('Login');
        const searchBox = document.querySelector(".search-box1");
        // searchBox.style.display = "block";
        searchBox.style.display = "none";
        info.addEventListener("click", (event) =>{
            console.log('logiiiiiin');
            
            event.preventDefault();

            const dataForm = new FormData(form);
            console.log(dataForm.get('email'));
            console.log(dataForm.get('password'));
            const data = new URLSearchParams(dataForm);
            //URL should be replaced by the correct URL 
            fetch('http://localhost:8000/register/', {
                method : 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body : data
            }).then(res => res.json())
            .then(data => console.log(data))
            .catch(error => console.log(error));
        });
        document.getElementById('showRegister').addEventListener('click', (e) => {
            console.log('dkhel');
            e.preventDefault();
            navigateTo('Regester', '../Css/Regester.css',  '/Regester');
        });
    }
    if(templateId === 'tournoiContent'){
        const searchBox = document.querySelector(".search-box1");
        searchBox.style.display = "block";
    }
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

// function checkWindowSize() {
//     if (window.innerWidth <= 800)
//         navigateTo('mobile', '../Css/Mobile.css',  'mobile');
// }

// window.addEventListener('resize', checkWindowSize);


// function checkUserLoginFromBackend() {
//     fetch('http://localhost:8000/api/check-authentication/', {
//         method: 'GET',
//         credentials: 'include',
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.isLoggedIn) {
//             console.log("User is authenticated!");
//             const path = window.location.pathname;
//             if(path)
//                 handleRouting(path);
//             else
//                 navigateTo('homeContent', '../Css/Home.css',  '/Home');
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
function searchForUsers() {
    // Sample list of users (Replace this with actual user data from your backend)
    const users = [
        { username: "User1", profilePic: "../assets/images/fouaouri.jpeg" },
        { username: "User2", profilePic: "../assets/images/fouaouri.jpeg" },
        { username: "User3", profilePic: "../assets/images/fouaouri.jpeg" },
        { username: "User4", profilePic: "../assets/images/fouaouri.jpeg" }
    ];

    const searchInput = document.getElementById("search-input1");
    const searchResults = document.createElement("div"); // Create a div for results
    searchResults.classList.add("search-results");
    document.body.appendChild(searchResults); // Append it somewhere in the body

    searchInput.addEventListener("input", function () {
        const searchTerm = this.value.toLowerCase();
        searchResults.innerHTML = ""; // Clear previous results

        if (searchTerm === "") {
            searchResults.style.display = "none";
            return;
        }

        const filteredUsers = users.filter(user => 
            user.username.toLowerCase().includes(searchTerm)
        );

        if (filteredUsers.length === 0) {
            searchResults.innerHTML = "<p>No results found</p>";
        } else {
            filteredUsers.forEach(user => {
                const userElement = document.createElement("div");
                userElement.classList.add("search-item");
                userElement.innerHTML = `
                    <img src="${user.profilePic}" alt="${user.username}">
                    <span>${user.username}</span>
                `;
                userElement.addEventListener("click", () => {
                    searchInput.value = user.username; // Set input value on selection
                    searchResults.style.display = "none"; // Hide results
                });
                searchResults.appendChild(userElement);
            });
        }

        searchResults.style.display = "block";
});

}
function checkUserLoginFromBackend() {
    // const token = localStorage.getItem('access_token');
    // if (!token) {
    //     navigateTo('openningContent', '../Css/openning.css', '/OpeningPage');
    //     return;
    // }

    // fetch('http://localhost:8000/api/auth/me/', {
    //     method: 'GET',
    //     headers: {
    //         'Authorization': `Bearer ${token}`
    //     }
    // })
    // .then(response => {
    //     if (!response.ok) {
    //         throw new Error('Token invalid');
    //     }
    //     return response.json();
    // })
    // .then(data => {
        console.log("User is authenticated!");
        const path = window.location.pathname;
        
        if(path)
            handleRouting(path);
        else
            navigateTo('homeContent', '../Css/Home.css', '/Home');
        document.getElementById('home').addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo('homeContent', '../Css/Home.css',  '/Home');
        });
        document.getElementById('profile').addEventListener('click', (e) => {
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
        document.getElementById('search-input1').addEventListener('click', (e) =>{
            searchForUsers();
        })
    // })
    // .catch(async error => {
    //     const refreshed = await refreshToken();
    //     if (!refreshed) {
    //         navigateTo('openningContent', '../Css/openning.css', '/OpeningPage');
    //     }
    // });
}

document.addEventListener('DOMContentLoaded', function() {
    
    window.addEventListener('popstate', function(event) {
        if (event.state && event.state.cssFiles) {
            loadCssFile(...event.state.cssFiles);
            LoadContent(event.state.content);
        }
    });

    // checkWindowSize();
    checkUserLoginFromBackend();
});

function handleRouting(path){
    switch (path) {
        case '/LoginPage':
            navigateTo('homeContent', '../Css/Home.css', '/Home');
            break;
        case '/Regester':
            navigateTo('Regester', '../Css/Regester.css',  '/Regester');
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

async function refreshToken() {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) return false;

    try {
        const response = await fetch('http://localhost:8000/api/auth/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                refresh: refresh
            })
        });
        const data = await response.json();
        if (data.access) {
            localStorage.setItem('access_token', data.access);
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}