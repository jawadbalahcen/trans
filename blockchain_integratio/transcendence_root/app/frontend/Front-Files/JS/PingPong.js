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

function showWinMessage(winner, score1, score2, isLocal = false) {
    const overlay = document.getElementById('gameEndOverlay');
    const winnerMessage = document.getElementById('winnerMessage');
    const playAgainButton = document.getElementById('playAgainButton');

    winnerMessage.textContent = `${winner} wins! Score: ${score1} - ${score2}`;
    overlay.style.display = 'flex';

    if (isLocal) {
        playAgainButton.style.display = 'block';
        playAgainButton.onclick = () => {
            overlay.style.display = 'none';
            // Reset scores and ball position
            player1.score = 0;
            player2.score = 0;
            resetBall();
            // Restart game interval
            if (gameInterval) clearInterval(gameInterval);
            gameInterval = setInterval(updateGame, 1000 / 60);
        };
    } else {
        // For online game
        playAgainButton.style.display = 'none';
        setTimeout(() => {
            overlay.style.display = 'none';
            menu.style.display = 'block';
            onlineCanvas.style.display = 'none';
           }, 6000); // Show message for 3 seconds before returning to menu
    }
}

// ********** Local Game Logic **********
function startLocalGame() {
    menu.style.display = 'none';
    nicknameInput.style.display = 'none';
    localCanvas.style.display = 'block';

    const ctx = localCanvas.getContext('2d');
    let player1 = { x: 10, y: 225, width: 10, height: 150, score: 0 };
    let player2 = { x: 780, y: 225, width: 10, height: 150, score: 0 };
    let ball = { x: 300, y: 200, radius: 10, dx: 3, dy: 3 };
    let keysPressed = {};
    let gameInterval;  // Store interval ID to clear it when game ends

    

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
            if (player1.score >= 3) {
                clearInterval(gameInterval);
                showWinMessage(player1Name, player1.score, player2.score, true);
            } else {
                resetBall();
            }
        }

        if (ball.x - ball.radius < 0) {
            player2.score++;
            if (player2.score >= 3) {
                clearInterval(gameInterval);
                showWinMessage(player2Name, player1.score, player2.score, true);
            } else {
                resetBall();
            }
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
    gameInterval = setInterval(updateGame, 1000 / 60);
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
            'Content-Type': 'application/json',
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
            document.getElementById('roomInfo').style.display = 'block';
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
    else {
        existingRoomUrl = "ws://127.0.0.1:8000/api/ws/game/" + existingRoomUrlInput.value + "/";
        document.getElementById('joinExistingRoomSection').style.display = 'none';
        document.getElementById('onlineGameMenu').style.display = 'none';
        onlineCanvas.style.display = 'block';
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
            //alert(`Game Over! ${winner} wins! Final score: Player 1: ${score.player1} - Player 2: ${score.player2}`);
            showWinMessage(winner,score.player1,score.player2);
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

// Draw center line (neon effect)
ctx.shadowBlur = 10;
ctx.shadowColor = '#00ffff';  // Neon cyan glow for the line
ctx.strokeStyle = '#ffffff';  // White for the line itself
ctx.lineWidth = 2;
ctx.beginPath();
ctx.moveTo(onlineCanvas.width / 2, 0);
ctx.lineTo(onlineCanvas.width / 2, onlineCanvas.height);
ctx.stroke();


// Draw ball with neon effect
ctx.shadowBlur = 20;
ctx.shadowColor = '#ff0000';  // Neon red glow for the ball
ctx.beginPath();
ctx.arc(gameState.ball.x, gameState.ball.y, gameState.ball.radius, 0, Math.PI * 2);
ctx.fillStyle = '#ff0000';
ctx.fill();
ctx.closePath();



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


playOnlineButton.addEventListener('click', () => {
    menu.style.display = 'none';
    onlineCanvas.style.display = 'none';
    document.getElementById('onlineGameMenu').style.display = 'block';
    document.getElementById('joinExistingRoomSection').style.display = 'block';
    nicknameInput.style.display = 'none';
});

joinRoomButton.addEventListener('click', () => {
    // Get the room code from the displayed text
    const roomCode = roomUrlElement.textContent.split('Room CODE: ')[1];
    if (!roomCode) {
        alert("Room code not found. Please try creating the room again.");
        return;
    }

    // Construct the WebSocket URL
    const wsUrl = `ws://127.0.0.1:8000/api/ws/game/${roomCode}/`;

    // Hide menus
    document.getElementById('joinExistingRoomSection').style.display = 'none';
    document.getElementById('roomInfo').style.display = 'none';
    document.getElementById('onlineGameMenu').style.display = 'none';
    
    // Show game canvas
    onlineCanvas.style.display = 'block';
    
    // Start the game with constructed WebSocket URL
    startOnlineGame(wsUrl);
});


//tournament mode 

        //const menu = document.getElementById('menu');
        //const nicknameInput = document.getElementById('nicknameInput');
        const tournamentInput = document.getElementById('tournamentInput');
        const playTournament = document.getElementById('playTournament');
        //const startLocalGame = document.getElementById('startLocalGame');
        //const localCanvas = document.getElementById('localGameCanvas');
        //const tournamentCanvas = document.getElementById('tournamentCanvas');
        const bracketDetails = document.getElementById('bracketDetails');

        let players = [];
        let currentRound = 1;

        playTournament.addEventListener('click', () => {
            menu.style.display = 'none';
            tournamentInput.style.display = 'block';
        });

        startTournament.addEventListener('click', () => {
            players = [
                document.getElementById('tournament-player1').value,
                document.getElementById('tournament-player2').value,
                document.getElementById('tournament-player3').value,
                document.getElementById('tournament-player4').value
            ];

            if (players.some(player => !player)) {
                alert("Please fill all player names");
                return;
            }

            tournamentInput.style.display = 'none';
            displayTournamentBracket();
        });

        function displayTournamentBracket() {
            bracketDetails.innerHTML = `
                <div class="matchup">
                    <h3>${players[0]} vs ${players[1]}</h3>
                    <button class="btn btn-secondary" onclick="startMatch(0, 1)">Start Match</button>
                </div>
                <div class="matchup">
                    <h3>${players[2]} vs ${players[3]}</h3>
                    <button class="btn btn-secondary" onclick="startMatch(2, 3)">Start Match</button>
                </div>
            `;
            document.getElementById('tournamentBracket').style.display = 'block';
        }

        function startMatch(player1Index, player2Index) {
            alert(`Starting match between ${players[player1Index]} and ${players[player2Index]}`);
            // Simulate the outcome (for now, randomly pick a winner)
            const winnerIndex = Math.random() > 0.5 ? player1Index : player2Index;
            alert(`${players[winnerIndex]} wins!`);
            
            // Display the next round, which is the final match
            if (currentRound === 1) {
                currentRound = 2;
                displayFinalMatch(winnerIndex);
            }
        }

        function displayFinalMatch(winnerIndex) {
            bracketDetails.innerHTML = `
                <div class="matchup">
                    <h3>${players[0]} vs ${players[1]}</h3>
                    <h3>Final: ${players[winnerIndex]} vs ${players[3 - winnerIndex]}</h3>
                    <button class="btn btn-secondary" onclick="startFinalMatch(0, 3)">Start Final Match</button>
                </div>
            `;
        }


        // Tournament state management
let tournamentState = {
    players: [],
    currentMatch: null,
    semifinalWinners: [],
    currentRound: 'semifinal', // 'semifinal' or 'final'
    matchInProgress: false
};

function startTournamentMatch(player1Index, player2Index) {
    tournamentState.currentMatch = {
        player1: tournamentState.players[player1Index],
        player2: tournamentState.players[player2Index],
        player1Index: player1Index,
        player2Index: player2Index,
        score1: 0,
        score2: 0
    };
    
    // Hide bracket and show game canvas
    document.getElementById('tournamentBracket').style.display = 'none';
    localCanvas.style.display = 'block';
    
    // Start the actual game
    startTournamentGame();
}

function startTournamentGame() 
{
    const ctx = localCanvas.getContext('2d');
    let ballX = localCanvas.width / 2;
    let ballY = localCanvas.height / 2;
    let ballSpeedX = 5;
    let ballSpeedY = 5;
    let ballradius = 10;
    let paddleWidth = 10;
    let paddleHeight = 100;
    let player1Y = localCanvas.height / 2 - paddleHeight / 2;
    let player2Y = localCanvas.height / 2 - paddleHeight / 2;
    
    function draw() {
        if (!tournamentState.matchInProgress) return;
        
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
        ctx.fillRect(0, player1Y, paddleWidth, paddleHeight);
        ctx.fillRect(localCanvas.width - paddleWidth, player2Y, paddleWidth, paddleHeight);

        // Draw ball with neon effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ff0000';  // Neon red glow for the ball
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballradius, 0, Math.PI * 2);
        ctx.fillStyle = '#ff0000';
        ctx.fill();
        ctx.closePath();
        
         // Draw center line (neon effect)
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00ffff';  // Neon cyan glow for the line
        ctx.strokeStyle = '#ffffff';  // White for the line itself
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(localCanvas.width / 2, 0);
        ctx.lineTo(localCanvas.width / 2, localCanvas.height);
        ctx.stroke();

        // Draw scores
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '24px Arial';
        ctx.fillText(`${tournamentState.currentMatch.player1}: ${tournamentState.currentMatch.score1}`, 50, 30);
        ctx.fillText(`${tournamentState.currentMatch.player2}: ${tournamentState.currentMatch.score2}`, localCanvas.width - 200, 30);
        
        // Ball movement
        ballX += ballSpeedX;
        ballY += ballSpeedY;
        
        // Ball collision with top/bottom
        if (ballY <= 0 || ballY >= localCanvas.height) {
            ballSpeedY = -ballSpeedY;
        }
        
        // Ball collision with paddles
        if (ballX <= paddleWidth && ballY >= player1Y && ballY <= player1Y + paddleHeight) {
            ballSpeedX = -ballSpeedX * 1.1; // Increase speed slightly
        }
        if (ballX >= localCanvas.width - paddleWidth && ballY >= player2Y && ballY <= player2Y + paddleHeight) {
            ballSpeedX = -ballSpeedX * 1.1; // Increase speed slightly
        }
        
        // Scoring
        if (ballX <= 0) {
            tournamentState.currentMatch.score2++;
            resetBall();
        }
        if (ballX >= localCanvas.width) {
            tournamentState.currentMatch.score1++;
            resetBall();
        }
        
        // Check for match winner (first to 11 points)
        if (tournamentState.currentMatch.score1 >= 11 || tournamentState.currentMatch.score2 >= 11) {
            handleMatchEnd();
            return;
        }
        
        requestAnimationFrame(draw);
    }
    
    function resetBall() {
        ballX = localCanvas.width / 2;
        ballY = localCanvas.height / 2;
        ballSpeedX = (Math.random() > 0.5 ? 5 : -5);
        ballSpeedY = (Math.random() * 6) - 3;
    }
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (e.key === 'w' && player1Y > 0) player1Y -= 20;
        if (e.key === 's' && player1Y < localCanvas.height - paddleHeight) player1Y += 20;
        if (e.key === 'ArrowUp' && player2Y > 0) player2Y -= 20;
        if (e.key === 'ArrowDown' && player2Y < localCanvas.height - paddleHeight) player2Y += 20;
    });
    
    tournamentState.matchInProgress = true;
    resetBall();
    draw();
}

function handleMatchEnd() {
    tournamentState.matchInProgress = false;
    localCanvas.style.display = 'none';
    
    const winner = tournamentState.currentMatch.score1 > tournamentState.currentMatch.score2 
        ? tournamentState.currentMatch.player1 
        : tournamentState.currentMatch.player2;
    
    if (tournamentState.currentRound === 'semifinal') {
        tournamentState.semifinalWinners.push(winner);
        
        if (tournamentState.semifinalWinners.length === 2) {
            // Both semifinals complete, show final match
            tournamentState.currentRound = 'final';
            displayFinalMatch();
        } else {
            // Show remaining semifinal
            displayTournamentBracket();
        }
    } else {
        // Tournament complete
        displayTournamentWinner(winner);
    }
}

function displayTournamentBracket() {
    const remainingMatchIndex = tournamentState.semifinalWinners.length === 0 ? 0 : 1;
    const player1Index = remainingMatchIndex * 2;
    const player2Index = remainingMatchIndex * 2 + 1;
    
    bracketDetails.innerHTML = `
        <div class="semifinals">
            <h3>Semifinals</h3>
            ${tournamentState.semifinalWinners.length > 0 ? 
                `<p>Winner of Semifinal 1: ${tournamentState.semifinalWinners[0]}</p>` : ''}
            <div class="matchup">
                <h4>${tournamentState.players[player1Index]} vs ${tournamentState.players[player2Index]}</h4>
                <button class="btn btn-secondary" onclick="startTournamentMatch(${player1Index}, ${player2Index})">
                    Start Match
                </button>
            </div>
        </div>
    `;
    document.getElementById('tournamentBracket').style.display = 'block';
}

function displayFinalMatch() {
    bracketDetails.innerHTML = `
        <div class="final-match">
            <h3>Championship Match</h3>
            <div class="matchup">
                <h4>${tournamentState.semifinalWinners[0]} vs ${tournamentState.semifinalWinners[1]}</h4>
                <button class="btn btn-secondary" onclick="startTournamentMatch(0, 1)">
                    Start Final Match
                </button>
            </div>
        </div>
    `;
    document.getElementById('tournamentBracket').style.display = 'block';
}

function displayTournamentWinner(winner) {
    bracketDetails.innerHTML = `
        <div class="tournament-winner">
            <h3>🏆 Tournament Champion 🏆</h3>
            <h2>${winner}</h2>
            <button class="btn btn-primary" onclick="location.reload()">New Tournament</button>
        </div>
    `;
    document.getElementById('tournamentBracket').style.display = 'block';
}

// Modify the start tournament button listener
startTournament.addEventListener('click', () => {
    tournamentState.players = [
        document.getElementById('tournament-player1').value || 'Player 1',
        document.getElementById('tournament-player2').value || 'Player 2',
        document.getElementById('tournament-player3').value || 'Player 3',
        document.getElementById('tournament-player4').value || 'Player 4'
    ];

    if (tournamentState.players.some(player => !player)) {
        alert("Please fill all player names");
        return;
    }

    tournamentInput.style.display = 'none';
    tournamentState.currentRound = 'semifinal';
    tournamentState.semifinalWinners = [];
    displayTournamentBracket();
});
