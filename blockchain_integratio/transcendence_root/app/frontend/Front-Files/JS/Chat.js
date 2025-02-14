function sendMessage(selectedUser, currentUser) {
    const chatInput = document.getElementById('chat-input');
    const chatBox = document.getElementById('chat-box');
    const message = chatInput.value.trim();

    if (!message) return;

    const data = JSON.stringify({ message: message , roomName: `${currentUser}-${selectedUser}`});
    console.log('dataaaa : ', data);

    fetch('http://localhost:8000/messageinput/', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: data
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
    })
    .then(data => console.log(data))
    .catch(error => console.error("Fetch error:", error));

    // Append the new message
    chatBox.innerHTML += `<div class="message sent">${message}</div>`;
    chatInput.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    console.log(`Message sent: ${message}`);
}

function handleEnterKey(event, selectedUser, currentUser) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage(selectedUser, currentUser);
    }
}
function showMessages(selectedUser, currentUser) {
    console.log('helllo db hena f chat');

    // Show the chat-container and hide the profile-container
    const chatContainer = document.getElementById('chat-container');
    const profileContainer = document.getElementById('profile-container');
    chatContainer.classList.remove('d-none');
    profileContainer.classList.add('d-none');

    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML = `<div class="message-header">Chat with ${selectedUser}</div>`;

    chatBox.innerHTML += `
        <div class="message received">Hi, how are you?</div>
        <div class="message sent">I'm good! How about you?</div>
        <div class="message received">I'm good, thank you for asking.</div>
        <div class="message sent">Well!!!!!!!!!!!!!!!!!!!!!!!</div>
        <div class="message received">If you want to practice CSS 3D animations, here are some of the best platforms that offer interactive learning experiences and challenges:</div>
    `;

    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');

    chatInput.removeEventListener("keydown", chatInput._handleEnterKey);

    chatInput._handleEnterKey = (event) => handleEnterKey(event, selectedUser, currentUser);

    chatInput.addEventListener("keydown", chatInput._handleEnterKey);

    sendButton.onclick = () => sendMessage(selectedUser, currentUser);

}

function userList(users, currentUser) {
    const userList = document.getElementById('user-list');

    users.forEach(user => {
        if (currentUser === user) return;

        const allUsers = document.createElement('li');
        allUsers.classList.add('all-users', 'list-group-item', 'fadeIn');
        allUsers.textContent = user;
        allUsers.id = `user-${user}`;
        userList.appendChild(allUsers);
        
        allUsers.addEventListener('click', () => {
            console.log(`Clicked on user: ${user}`);
            showMessages(user, currentUser);
        });
    });
}

function ChatContent() {
    const searchBox = document.querySelector(".search-box1");
    searchBox.style.display = "block";
    const currentUser = 'user1';
    const users = ['user1', 'user2', 'user3', 'user4', 'user5'];
    userList(users, currentUser);
}

ChatContent();
