
// fetch('http://127.0.0.1:8001/api/user/', {
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
//         document.getElementById("fullName").textContent = data.fullname || "N/A";
//         document.getElementById("userName").textContent = data.username || "N/A";
//         document.getElementById("Mail").textContent = data.email || "N/A";
//         document.getElementById("Avatar").textContent = data.avatar || "N/A";
//         document.getElementById("City").textContent = data.City || "N/A";
//     })
//     .catch(error => {
//         console.error("There was a problem fetching the data:", error);
//     });
function ScrollforEachContainer(containerContainer, ContainerList){

    const container = document.getElementById(containerContainer);
    const list = document.getElementById(ContainerList);
    let isScrolling = false;
    let startY = 0;
    let scrollTop = 0;
    const scrollSpeed = 1;
    const originalItems = container.innerHTML;
    container.innerHTML = originalItems + originalItems;


    function autoScroll(){
        if(!isScrolling) return;

        scrollTop += scrollSpeed;
        const halfHeight = container.scrollHeight / 2;
        
        // Reset position when we've scrolled through first set
        if (scrollTop >= halfHeight) {
            scrollTop = 0;
        }

        container.style.transform = `translateY(-${scrollTop}px)`;
        requestAnimationFrame(autoScroll); //ensures the animation is smooth and syncs with the browser's refresh rate
    }

    function stopScrolling() {
        isScrolling = false;
    }
    function startScrolling(){
        if(!isScrolling){
            isScrolling = true;
            autoScroll();
        }
    }
    list.addEventListener('mouseenter', stopScrolling);
    list.addEventListener('mouseleave', startScrolling);
    
    list.addEventListener('touchstart', (e) => {
        stopScrolling();
        startY = e.touches[0].pageY;
    });
    list.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const diff = startY - touch.pageY;
        scrollTop += diff;
        startY = touch.pageY;
        
        if (scrollTop < 0) scrollTop = 0;
        const maxScroll = container.scrollHeight / 2;
        if (scrollTop > maxScroll) scrollTop = 0;
        
        container.style.transform = `translateY(-${scrollTop}px)`;
    });
    
    list.addEventListener('touchend', startScrolling);
    startScrolling();
}

ScrollforEachContainer('friendsContainer', 'friendsList');
ScrollforEachContainer('HistoryContainer', 'HistoryList');

// chage the button after following a profile
    document.querySelectorAll('.follow').forEach(button => {
        console.log('follow dkhel');
        button.addEventListener('click', (e) => {
            console.log('follow');
            e.preventDefault();
            const wasFollowing = button.classList.contains('following');
            
            if (wasFollowing) {
                button.textContent = '+ Follow';
                button.classList.remove('following');
            } else {
                button.textContent = 'Following';
                button.classList.add('following');
            }
        });
    });


    // Achienvement games Progress 
    const playerScore = 26;

    const levels = [
        { name:"Bronze", min: 5, max: 9, levelprocess: "100process.png"},
        { name:"Silver", min:10, max: 19,  levelprocess: "halfprocess.png"},
        { name:"Silver", min: 20, max: 24, levelprocess: "100process.png"},
        { name:"Gold", min:25, max: 34 , levelprocess: "halfprocess.png"},
        { name:"Gold", min:35, max: 44 , levelprocess: "100process.png"},
        { name:"Platinium", min: 45, max: 59 , levelprocess: "halfprocess.png"},
        { name:"Platinium",  min:60, max: 74 , levelprocess: "100process.png"},
        { name:"Diamond", min: 75, max: 89 , levelprocess: "halfprocess.png"},
        { name:"Diamond",  min: 90, max: 9000 , levelprocess: "100process.png"}
    ]
    const AchievementContainer = document.querySelector('.Achievement');

    function updateAchievements(playerScore) {

        const currentLevelIndex = levels.findIndex(level => playerScore >= level.min && playerScore <= level.max);

        
        if (currentLevelIndex !== -1) {
            levels.forEach((level, index) => {

                const matchElement = AchievementContainer.querySelector(`.match img[alt="${level.name}"]`);
    
                if (matchElement) {
                    const processImg = matchElement.closest('.match').querySelector('.process img');
    
                    if (index < currentLevelIndex)
                        processImg.src = "../assets/images/100process.png";
                    else if (index === currentLevelIndex)
                        processImg.src = `../assets/images/${level.levelprocess}`;
                }
            });
        } else {
            console.log("No current level found for the player's score.");
        }
    }
    updateAchievements(playerScore);
    


