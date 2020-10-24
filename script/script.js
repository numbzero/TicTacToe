
const	canvas 		= document.querySelector('canvas');
const	ctx			= canvas.getContext('2d');
const 	blockSize	= 100;
var		matrix		= [[0, 0, 0],
					   [0, 0, 0],
					   [0, 0, 0]];
var		whichTurn	= 'X';
var		gameFinished = false;

ctx.font = '48px roboto';
ctx.fillStyle 	= `rgb(0, 0, 0)`;
ctx.fillRect(0, 0, canvas.width /* width */, canvas.height /* height */);
ctx.strokeStyle = `rgb(255, 0, 0)`;
ctx.lineWidth 	= 10;
ctx.strokeRect(0, 0, canvas.width /* width */, canvas.height /* height */);

/* Draw # */
ctx.lineWidth 	= 5;
ctx.beginPath();
ctx.moveTo(blockSize, 0);
ctx.lineTo(blockSize, blockSize * 3);
ctx.moveTo(blockSize * 2, 0);
ctx.lineTo(blockSize * 2, blockSize * 3);
ctx.moveTo(0, blockSize);
ctx.lineTo(blockSize * 3, blockSize);
ctx.moveTo(0, blockSize * 2);
ctx.lineTo(blockSize * 3, blockSize * 2);
ctx.stroke();

canvas.addEventListener('click', function(event) {
	let obj = {
		x: event.offsetX,
		y: event.offsetY,
		cellX: event.offsetX / blockSize >> 0,
		cellY: event.offsetY / blockSize >> 0
	}


	if (!gameFinished) {
		if ((matrix[obj.cellY][obj.cellX] === 0)) {
			// This part is my turn
			drawElement(whichTurn, obj.cellX, obj.cellY);
			if (check()) {
				console.log('Game finished!');
				gameFinished = true;
				return ;
			}
			whichTurn = 'O';	
			// This part is "AI" turn	
			let mm_matrix = [...matrix];
			let pos = getBestMove(mm_matrix);
			drawElement(whichTurn, pos.j, pos.i);
			if (check()) {
				console.log('Game finished!');
				gameFinished = true;
				// resetGame();
			}			
			whichTurn = 'X';
		}
	} else {
		resetGame();
	}
});

function	drawElement(element, x, y) {
	if (element === 'X') {
		drawX(x, y);
	}
	if (element === 'O') {
		drawO(x, y);
	}
}

function	drawX(x, y) {
	matrix[y][x] = 'X';
	ctx.beginPath();
	ctx.moveTo(x * blockSize, y * blockSize);
	ctx.lineTo(x * blockSize + blockSize,  y * blockSize + blockSize);
	ctx.moveTo(x * blockSize + blockSize,  y * blockSize);
	ctx.lineTo(x * blockSize, y * blockSize + blockSize);
	ctx.stroke();

}

function	drawO(x, y) {
	let 	circle;

	matrix[y][x] = 'O';
	circle = new Path2D();
    circle.arc(x * blockSize + blockSize / 2, y * blockSize + blockSize / 2, blockSize / 3, 0, 2 * Math.PI);
    ctx.stroke(circle);
}

function	check() {
	if (checkLine()) {
		showEndGame(whichTurn + ' wins!');
		return true;
	}
	else if (checkCol()) {
		showEndGame(whichTurn + ' wins!');
		return true;
	}
	else if (checkDiag()) {
		showEndGame(whichTurn + ' wins!');
		return true;
	}
	else if (checkDraw()) {
		showEndGame('Draw!');
		return true;
	}
	return false;
}

function	checkLine() {
	
	for (let i = 0; i < 3; i++) {
		if (matrix[i][0] === matrix[i][1] && matrix[i][1] === matrix[i][2] && matrix[i][0] != 0) {
			console.log('Check line true');
			return true;
		}
	}
	return false;
}

function	checkCol() {
	
	for (let i = 0; i < 3; i++) {
		if (matrix[0][i] === matrix[1][i] &&  matrix[1][i] ===  matrix[2][i] && matrix[0][i] != 0) {
			console.log('Check column true');
			return true;
		}
	}
	return false;
	
}

function	checkDiag() {
	
	if (matrix[1][1] != 0 && ((matrix[0][0] === matrix[1][1] && matrix[1][1] === matrix[2][2]) || (matrix[0][2] === matrix[1][1] && matrix[1][1] === matrix[2][0]))) {
		console.log('Check diagonal true');
		return true;
	}
	return false;
}


function	checkDraw() {
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			if (matrix[i][j] === 0) {
				return false;
			}
		}
	}
	return true;
}


function 	showEndGame(message) {
	// ctx.fillStyle 	= `rgb(0, 0, 0)`;
	// ctx.fillRect(0, 0, canvas.width /* width */, canvas.height /* height */);
	// ctx.strokeStyle = `rgb(255, 0, 0)`;
	ctx.lineWidth 	= 10;
	// ctx.strokeRect(0, 0, canvas.width /* width */, canvas.height /* height */);	

	/* Draw text */
	ctx.fillStyle 	= `rgb(0, 255, 0)`;
	ctx.fillText(message, blockSize, blockSize * 3 / 2);
}

function 	resetGame() {
	/* Reset values */
	whichTurn	 = 'X';
	gameFinished = false;

	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			matrix[i][j] = 0;
		}
	}

	/* Redraw # */
	drawBoard();
}

function	drawBoard() {
	ctx.fillStyle 	= `rgb(0, 0, 0)`;
	ctx.fillRect(0, 0, canvas.width /* width */, canvas.height /* height */);
	ctx.strokeStyle = `rgb(255, 0, 0)`;
	ctx.lineWidth 	= 5;
	ctx.strokeRect(0, 0, canvas.width /* width */, canvas.height /* height */);
	ctx.beginPath();
	ctx.moveTo(blockSize, 0);
	ctx.lineTo(blockSize, blockSize * 3);
	ctx.moveTo(blockSize * 2, 0);
	ctx.lineTo(blockSize * 2, blockSize * 3);
	ctx.moveTo(0, blockSize);
	ctx.lineTo(blockSize * 3, blockSize);
	ctx.moveTo(0, blockSize * 2);
	ctx.lineTo(blockSize * 3, blockSize * 2);
	ctx.stroke();	
}


// I know, I know ... fuck off
function	mm_checkWinner(mm_matrix) {
	// Check line
	for (let i = 0; i < 3; i++) {
		if (mm_matrix[i][0] === mm_matrix[i][1] && mm_matrix[i][1] === mm_matrix[i][2] && mm_matrix[i][0] != 0) {
			if (mm_matrix[i][0] === 'X') {
				return -1;
			} else if (mm_matrix[i][0] === 'O') {
				return 1;
			}
		}
	}

	// Check column
	for (let i = 0; i < 3; i++) {
		if (mm_matrix[0][i] === mm_matrix[1][i] &&  mm_matrix[1][i] ===  mm_matrix[2][i] && mm_matrix[0][i] != 0) {
			if (mm_matrix[0][i] === 'X') {
				return -1;
			} else if (mm_matrix[0][i] === 'O') {
				return 1;
			}
		}
	}

	// Check diagonal
	if (mm_matrix[1][1] != 0 && ((mm_matrix[0][0] === mm_matrix[1][1] && mm_matrix[1][1] === mm_matrix[2][2]) || (mm_matrix[0][2] === mm_matrix[1][1] && mm_matrix[1][1] === mm_matrix[2][0]))) {
		if (mm_matrix[1][1] === 'X') {
			return -1;
		} else if (mm_matrix[1][1] === 'O') {
			return 1;
		}
	}

	// Check tie
	let tie = true;
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			if (mm_matrix[i][j] === 0) {
				tie = false;
			}
		}
	}
	if (tie) {
		return 0;
	}

	// If nothing, keep working mothefucker
	return null;
}

function 	minimax(mm_matrix, depth, maximazingPlayer) {
	let 	result = mm_checkWinner(mm_matrix);

	if (result !== null) {
		return result;
	}

	// Max
	if (maximazingPlayer) {
		let bestScore = -Infinity;
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (mm_matrix[i][j] === 0) {
					mm_matrix[i][j] = 'O';
					let score = minimax(mm_matrix, depth + 1, false);
					mm_matrix[i][j] = 0; // Make it empty
					bestScore = Math.max(score, bestScore);
				}
			}
		}
		return bestScore;
	// Min
	} else {
		let bestScore = Infinity;
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (mm_matrix[i][j] === 0) {
					mm_matrix[i][j] = 'X';
					let score = minimax(mm_matrix, depth + 1, true);
					mm_matrix[i][j] = 0; // Make it empty
					bestScore = Math.min(score, bestScore);
				}
			}
		}
		return bestScore;
	}
}

function 	getBestMove(mm_matrix) {
	let 	bestScore = -Infinity;
	let 	pos;

	console.log('[start] getBestMove');
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			if (mm_matrix[i][j] === 0) {
				mm_matrix[i][j] = 'O';
				let score = minimax(mm_matrix, 0, false);
				mm_matrix[i][j] = 0;
				if (score > bestScore) {
					bestScore = score;
					pos = {i, j};
					console.log(bestScore);
					console.log(pos);
				}
			}
		}
	}
	console.log('[end] getBestMove');
	return pos;
}