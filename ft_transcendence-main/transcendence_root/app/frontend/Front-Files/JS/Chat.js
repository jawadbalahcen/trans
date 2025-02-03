const currentUser = 'user1';
function showMessages(selectedUser) {
    console.log('dkheeel l chat');

    // Show the chat-container and hide the profile-container
    const chatContainer = document.getElementById('chat-container');
    const profileContainer = document.getElementById('profile-container');
    chatContainer.classList.remove('d-none');
    profileContainer.classList.add('d-none');

    // Update the chat header or any relevant UI for the selected user
    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML = `<div class="message-header">Chat with ${selectedUser}</div>`; // Example header

    // Clear previous messages and load new ones (dummy data for now)
    chatBox.innerHTML += `
        <div class="message received">Hi, how are you?</div>
        <div class="message sent">I'm good! How about you?</div>
    `;

    // Add functionality to send messages
    const sendButton = document.getElementById('send-button');
    const chatInput = document.getElementById('chat-input');

    sendButton.onclick = function () {
        const message = chatInput.value.trim();
        if (message) {
            // Append the new message
            chatBox.innerHTML += `<div class="message sent">${message}</div>`;
            chatInput.value = ''; // Clear the input field
            chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the latest message

            // Simulate sending the message to the backend (you can integrate your API call here)
            console.log(`Message sent to ${selectedUser}: ${message}`);
        }
    };
}


function startChating(user){
    
    const socket = new WebSocket('ws://localhost:8000');

    socket.addEventListener('open', () => {
        console.log('Connected to the WebSocket server');
      });
      socket.addEventListener('message', (event) => {
        console.log('Message from server:', event.data);
      });

      const input = document.getElementById('chat-input');
      input.addEventListener('submit', (event) => {
            event.defaultPrevented();
            const messageinput = new FormData(input);
            console.log('message : ', messageinput.get('sended-message'));
      })
      socket.addEventListener('open', () => {
        socket.send(JSON.stringify({ user: user , message: messageinput.get('sended-message') }));
      });
}

function userList(users) {
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
            // event.stopPropagation();
            showMessages(user);
            startChating(user);
        });
        // console.log("User list after append:", userList);
    });


}
// function ChatContent() {
    const users = ['user1', 'user2', 'user3', 'user4', 'user5'];
    userList(users);
    
// send and display messages
    const chatMessages = [];


// }
