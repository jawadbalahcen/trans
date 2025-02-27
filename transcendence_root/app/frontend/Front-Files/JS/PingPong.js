
const menu = document.getElementById('menu');
const nicknameInput = document.getElementById('nicknameInput');
const playLocalButton = document.getElementById('playLocal');
const startLocalGameButton = document.getElementById('startLocalGame');
const localCanvas = document.getElementById('localGameCanvas');
const onlineCanvas = document.getElementById('onlineGameCanvas');
const playOnlineButton = document.getElementById('playOnline');
const player1NameInput = document.getElementById('player1Name');
const player2NameInput = document.getElementById('player2Name');

let player1Name = 'Player 1';
let player2Name = 'Player 2';
let playerRole = '';  // For online game

// ********** Local Game Logic **********
function startLocalGame() {
    menu.style.display = 'none';
    nicknameInput.style.display = 'none';
    localCanvas.style.display = 'block';

    const ctx = localCanvas.getContext('2d');
    let player1 = { x: 10, y: 150, width: 10, height: 100, score: 0 };
    let player2 = { x: 580, y: 150, width: 10, height: 100, score: 0 };
    let ball = { x: 300, y: 200, radius: 10, dx: 3, dy: 3 };
    let keysPressed = {};

function renderGame() {
ctx.clearRect(0, 0, localCanvas.width, localCanvas.height);

// Background (Space Theme)
const gradient = ctx.createRadialGradient(localCanvas.width / 2, localCanvas.height / 2, 0, localCanvas.width / 2, localCanvas.height / 2, localCanvas.width); // back
gradient.addColorStop(0, '#000000');  // Dark center (space)
gradient.addColorStop(1, '#2a1a7e');  // Lighter edges (space theme)
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, localCanvas.width, localCanvas.height);

// Draw players with neon effect
ctx.shadowBlur = 20;
ctx.shadowColor = '#00ff00';  // Neon green glow for player 1
ctx.fillStyle = '#00ff00';
ctx.fillRect(player1.x, player1.y, player1.width, player1.height);

ctx.shadowBlur = 20;
ctx.shadowColor = '#ff00ff';  // Neon pink glow for player 2
ctx.fillStyle = '#ff00ff';
ctx.fillRect(player2.x, player2.y, player2.width, player2.height);

// Draw center line (neon effect)
ctx.shadowBlur = 10;
ctx.shadowColor = '#00ffff';  // Neon cyan glow for the line
ctx.strokeStyle = '#ffffff';  // White for the line itself
ctx.lineWidth = 2;
ctx.beginPath();
ctx.moveTo(localCanvas.width / 2, 0);
ctx.lineTo(localCanvas.width / 2, localCanvas.height);
ctx.stroke();

// Draw ball with neon effect
ctx.shadowBlur = 20;
ctx.shadowColor = '#ff0000';  // Neon red glow for the ball
ctx.beginPath();
ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
ctx.fillStyle = '#ff0000';
ctx.fill();
ctx.closePath();



// Draw scores with player nicknames
ctx.shadowBlur = 0;  // Remove shadow for text
ctx.fillStyle = '#ffffff';
ctx.font = '20px Arial';
ctx.fillText(`${player1Name}: ${player1.score}`, 20, 30);
ctx.fillText(`${player2Name}: ${player2.score}`, localCanvas.width - 160, 30);
}

    function updateGame() {
        ball.x += ball.dx;
        ball.y += ball.dy;

        if (ball.y + ball.radius > localCanvas.height || ball.y - ball.radius < 0) {
            ball.dy *= -1;
        }

        if (
            ball.x - ball.radius < player1.x + player1.width &&
            ball.y > player1.y &&
            ball.y < player1.y + player1.height
        ) {
            ball.dx *= -1;
        }

        if (
            ball.x + ball.radius > player2.x &&
            ball.y > player2.y &&
            ball.y < player2.y + player2.height
        ) {
            ball.dx *= -1;
        }

        if (ball.x + ball.radius > localCanvas.width) {
            player1.score++;
            resetBall();
        }

        if (ball.x - ball.radius < 0) {
            player2.score++;
            resetBall();
        }

        if (keysPressed['w']) player1.y = Math.max(0, player1.y - 5);
        if (keysPressed['s']) player1.y = Math.min(localCanvas.height - player1.height, player1.y + 5);
        if (keysPressed['ArrowUp']) player2.y = Math.max(0, player2.y - 5);
        if (keysPressed['ArrowDown']) player2.y = Math.min(localCanvas.height - player2.height, player2.y + 5);

        renderGame();
    }

    function resetBall() {
        ball.x = localCanvas.width / 2;
        ball.y = localCanvas.height / 2;
        ball.dx = -ball.dx;
        ball.dy = 3 * (Math.random() > 0.5 ? 1 : -1);
    }

    document.addEventListener('keydown', (e) => (keysPressed[e.key] = true));
    document.addEventListener('keyup', (e) => (keysPressed[e.key] = false));

    renderGame();
    setInterval(updateGame, 1000 / 60);
}


//********** Invite Friend Logic **********
const inviteFriendButton = document.getElementById('inviteFriend');
const roomInfoDiv = document.getElementById('roomInfo');
const roomUrlElement = document.getElementById('roomUrl');
const joinRoomButton = document.getElementById('joinRoom');
const existingRoomUrlInput = document.getElementById('existingRoomUrl');
const joinExistingRoomButton = document.getElementById('joinExistingRoomButton');

inviteFriendButton.addEventListener('click', () => {
// Make a POST request to generate a room
const player1 = prompt("Enter your name (Player 1):", player1Name);
const player2 = prompt("Enter your friend's name (Player 2):", player2Name);

if (!player1 || !player2) {
alert("Both player names are required.");
return;
}
document.getElementById('joinExistingRoomSection').style.display = 'none';
// Send POST request to server to create a new room
fetch('http://127.0.0.1:8000/api/create-room/', {
method: 'POST',
headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
},
body: JSON.stringify({
    player1: player1,
    player2: player2
})
})
.then(response => response.json())
.then(data => {
if (data.ws_url) {
    // Display WebSocket URL for both players
    const lastElement = data.ws_url.split('/').filter(Boolean).pop();
    roomUrlElement.textContent = `Room CODE: ${lastElement}`;
    roomInfoDiv.style.display = 'block';

    // Add a listener for the "Join Room" button
    joinRoomButton.onclick = () => {
        document.getElementById('joinExistingRoomSection').style.display = 'none';
        let v = true
        startOnlineGame(data.ws_url , v);
    };
}
})
.catch(error => {
console.error('Error creating room:', error);
alert("An error occurred while creating the room.");
});
});

//********** Join Existing Room Logic **********
joinExistingRoomButton.addEventListener('click', () => {
let existingRoomUrl = existingRoomUrlInput.value;
if (!existingRoomUrl) {
alert("Please enter a valid room URL.");
return;
}
else
{
existingRoomUrl = "ws://127.0.0.1:8000/api/ws/game/" + existingRoomUrlInput.value + "/"
startOnlineGame(existingRoomUrl);
}
});

//    ********** Online Game Logic **********
function startOnlineGame(URLws) {
   
    console.log( "this shit is not working" , URLws);
    menu.style.display = 'none';
    onlineCanvas.style.display = 'block'; 
    document.getElementById('joinExistingRoomSection').style.display = 'block';
    const socket = new WebSocket(URLws);
    const ctx = onlineCanvas.getContext('2d');

    socket.onopen = () => console.log('Connected to the game!');

    socket.onmessage = (event) => 
    {
       
        const data = JSON.parse(event.data);
        if (data.role) playerRole = data.role;
        if (data.gameState) renderOnlineGame(data.gameState);
        if (data.matchEnded) {
            const winner = data.winner;  // Get the winner
            const score = data.score;    // Get the score

            // Display the winner and score in an alert
            alert(`Game Over! ${winner} wins! Final score: Player 1: ${score.player1} - Player 2: ${score.player2}`);
            
            // Optionally, you can redirect the user or reset the game state after the alert
            // For example:
            // window.location.href = '/new-game';  // Redirect to a new game page
            }
    };

    function renderOnlineGame(gameState) {
// Clear the canvas
ctx.clearRect(0, 0, onlineCanvas.width, onlineCanvas.height);

// Background (Space Theme)
const gradient = ctx.createRadialGradient(onlineCanvas.width / 2, onlineCanvas.height / 2, 0, onlineCanvas.width / 2, onlineCanvas.height / 2, onlineCanvas.width);
gradient.addColorStop(0, '#000000');  // Dark center (space)
gradient.addColorStop(1, '#2a1a7e');  // Lighter edges (space theme)
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, onlineCanvas.width, onlineCanvas.height);

// Draw players with neon effect
ctx.shadowBlur = 20;
ctx.shadowColor = '#00ff00';  // Neon green glow for player 1
ctx.fillStyle = '#00ff00';
ctx.fillRect(gameState.player1.x, gameState.player1.y, gameState.player1.width, gameState.player1.height);

ctx.shadowBlur = 20;
ctx.shadowColor = '#ff00ff';  // Neon pink glow for player 2
ctx.fillStyle = '#ff00ff';
ctx.fillRect(gameState.player2.x, gameState.player2.y, gameState.player2.width, gameState.player2.height);

// Draw ball with neon effect
ctx.shadowBlur = 20;
ctx.shadowColor = '#ff0000';  // Neon red glow for the ball
ctx.beginPath();
ctx.arc(gameState.ball.x, gameState.ball.y, gameState.ball.radius, 0, Math.PI * 2);
ctx.fillStyle = '#ff0000';
ctx.fill();
ctx.closePath();

// Draw center line (neon effect)
ctx.shadowBlur = 10;
ctx.shadowColor = '#00ffff';  // Neon cyan glow for the line
ctx.strokeStyle = '#ffffff';  // White for the line itself
ctx.lineWidth = 2;
ctx.beginPath();
ctx.moveTo(onlineCanvas.width / 2, 0);
ctx.lineTo(onlineCanvas.width / 2, onlineCanvas.height);
ctx.stroke();

// Draw scores with player nicknames
ctx.shadowBlur = 0;  // Remove shadow for text
ctx.fillStyle = '#ffffff';
ctx.font = '20px Arial';
ctx.fillText(`Player 1: ${gameState.score.player1}`, 20, 30);
ctx.fillText(`Player 2: ${gameState.score.player2}`, onlineCanvas.width - 120, 30);
}


    document.addEventListener('keydown', (event) => {
        if (playerRole === 'player1' && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
            socket.send(JSON.stringify({ action: event.key === 'ArrowUp' ? 'move_up' : 'move_down', role: 'player1' }));
        }
        if (playerRole === 'player2' && (event.key === 'w' || event.key === 's')) {
            socket.send(JSON.stringify({ action: event.key === 'w' ? 'move_up' : 'move_down', role: 'player2' }));
        }
    });
}

// ********** Event Listeners **********
playLocalButton.addEventListener('click', () => {
    menu.style.display = 'none';
    nicknameInput.style.display = 'flex';
});

startLocalGameButton.addEventListener('click', () => {
player1Name = player1NameInput.value || 'Player 1';
player2Name = player2NameInput.value || 'Player 2';

startLocalGame();
});


playOnlineButton.addEventListener('click', startOnlineGame);