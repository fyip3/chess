// Define chess board and pieces
const board = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];
const pieces = {
  'p': 'pawn',
  'r': 'rook',
  'n': 'knight',
  'b': 'bishop',
  'q': 'queen',
  'k': 'king'
};

// Initialize chess board
const boardElement = document.querySelector('#board');
for (let rank = 0; rank < 8; rank++) {
  for (let file = 0; file < 8; file++) {
    const squareElement = document.createElement('div');
    squareElement.classList.add('square');
    squareElement.classList.add((rank + file) % 2 === 0 ? 'white' : 'black');
    squareElement.dataset.rank = rank;
    squareElement.dataset.file = file;
    squareElement.addEventListener('click', handleSquareClick);
    boardElement.appendChild(squareElement);
    const piece = board[rank][file];
    if (piece !== '') {
      const pieceElement = document.createElement('div');
      pieceElement.classList.add('piece');
      const color = piece === piece.toUpperCase() ? 'white' : 'black';
      pieceElement.innerHTML = `<img src="images/${color}-${pieces[piece.toLowerCase()]}.svg">`;
      squareElement.appendChild(pieceElement);
    }
  }
}

// Handle square click events
let selectedPiece = null;
let timerIntervalId = null;
let timerSeconds = 0;
const timerElement = document.querySelector('#timer');
const resetButtonElement = document.querySelector('#reset-button');
resetButtonElement.addEventListener('click', resetBoard);

function handleSquareClick(event) {
  const squareElement = event.target;
  const rank = parseInt(squareElement.dataset.rank);
  const file = parseInt(squareElement.dataset.file);
  const piece = board[rank][file];
  if (selectedPiece === null && piece !== '') {
    selectedPiece = { rank, file, piece };
    squareElement.classList.add('selected');
  } else if (selectedPiece !== null) {
    const legalMoves = getLegalMoves(selectedPiece.rank, selectedPiece.file, selectedPiece.piece);
    if (legalMoves.some(move => move.rank === rank && move.file === file)) {
      movePiece(selectedPiece.rank, selectedPiece.file, rank, file);
      selectedPiece = null;
      const squares = document.querySelectorAll('.square');
      squares.forEach(square => square.classList.remove('selected'));
      if (timerIntervalId === null) {
        startTimer();
      }
    } else {
      selectedPiece = null;
      const squares = document.querySelectorAll('.square');
      squares.forEach(square => square.classList.remove('selected'));
    }
  }
}

// Get legal moves for a piece on the board
function getLegalMoves(rank, file, piece) {
  const legalMoves = [];
  switch (piece.toLowerCase()) {
    case 'pawn':
      const direction = piece === 'p' ? 1 : -1;
      if (board[rank + direction][file] === '') {
        legalMoves.push({ rank: rank + direction, file });
        if ((rank === 1 && direction === 1) || (rank === 6 && direction === -1)) {
          if (board[rank + 2 * direction][file] === '') {
            legalMoves.push({ rank: rank + 2 * direction, file });
          }
        }
      }
      if (file > 0 && board[rank + direction][file - 1] !== '' && board[rank + direction][file - 1] !== piece) {
        legalMoves.push({ rank: rank + direction, file: file - 1 });
      }
      if (file < 7 && board[rank + direction][file + 1] !== '' && board[rank + direction][file + 1] !== piece) {
        legalMoves.push({ rank: rank + direction, file: file + 1 });
      }
      break;
    case 'rook':
      for (let i = rank - 1; i >= 0; i--) {
        if (board[i][file] === '') {
          legalMoves.push({ rank: i, file });
        }
        else {
          if (board[i][file] !== piece) {
            legalMoves.push({ rank: i, file });
          }
          break;
        }
      }
      for (let i = rank + 1; i < 8; i++) {
        if (board[i][file] === '') {
          legalMoves.push({ rank: i, file });
        } else {
          if (board[i][file] !== piece) {
            legalMoves.push({ rank: i, file });
          }
          break;
        }
      }
      for (let j = file - 1; j >= 0; j--) {
        if (board[rank][j] === '') {
          legalMoves.push({ rank, file: j });
        } else {
          if (board[rank][j] !== piece) {
            legalMoves.push({ rank, file: j });
          }
          break;
        }
      }
      for (let j = file + 1; j < 8; j++) {
        if (board[rank][j] === '') {
          legalMoves.push({ rank, file: j });
        } else {
          if (board[rank][j] !== piece) {
            legalMoves.push({ rank, file: j });
          }
          break;
        }
      }
      break;
    case 'knight':
      const knightMoves = [
        { rank: rank - 2, file: file - 1 },
        { rank: rank - 2, file: file + 1 },
        { rank: rank - 1, file: file - 2 },
        { rank: rank - 1, file: file + 2 },
        { rank: rank + 1, file: file - 2 },
        { rank: rank + 1, file: file + 2 },
        { rank: rank + 2, file: file - 1 },
        { rank: rank + 2, file: file + 1 }
      ];
      knightMoves.forEach(move => {
        if (move.rank >= 0 && move.rank < 8 && move.file >= 0 && move.file < 8) {
          if (board[move.rank][move.file] === '' || board[move.rank][move.file] !== piece) {
            legalMoves.push(move);
          }
        }
      });
      break;
    case 'bishop':
      for (let i = rank - 1, j = file - 1; i >= 0 && j >= 0; i--, j--) {
        if (board[i][j] === '') {
          legalMoves.push({ rank: i, file: j });
        } else {
          if (board[i][j] !== piece) {
            legalMoves.push({ rank: i, file: j });
          }
          break;
        }
      }
      for (let i = rank - 1, j = file + 1; i >= 0 && j < 8; i--, j++) {
        if (board[i][j] === '') {
          legalMoves.push({ rank: i, file: j });
        } else {
          if (board[i][j] !== piece) {
            legalMoves.push({ rank: i, file: j });
          }
          break;
        }
      }
      for (let i = rank + 1, j = file - 1; i < 8 && j >= 0; i++, j--) {
        if (board[i][j] === '') {
          legalMoves.push({ rank: i, file: j });
        } else {
          if (board[i][j] !== piece) {
            legalMoves.push({ rank: i, file: j });
          }
          break;
        }
      }
      for (let i = rank + 1, j = file + 1; i < 8 && j < 8; i++, j++) {
        if (board[i][j] === '') {
          legalMoves.push({ rank: i, file: j });
        } else {
          if (board[i][j] !== piece) {
            legalMoves.push({ rank: i, file: j });
          }
          break;
        }
      }
      break;
    case 'queen':
      legalMoves.push(...getLegalMoves(rank, file, 'rook'));
      legalMoves.push(...getLegalMoves(rank, file, 'bishop'));
      break;
    case 'king':
      const kingMoves = [
        { rank: rank - 1, file: file - 1 },
        { rank: rank - 1, file },
        { rank: rank - 1, file: file + 1 },
        { rank, file: file - 1 },
                { rank, file: file + 1 },
        { rank: rank + 1, file: file - 1 },
        { rank: rank + 1, file },
        { rank: rank + 1, file: file + 1 }
      ];
      kingMoves.forEach(move => {
        if (move.rank >= 0 && move.rank < 8 && move.file >= 0 && move.file < 8) {
          if (board[move.rank][move.file] === '' || board[move.rank][move.file] !== piece) {
            legalMoves.push(move);
          }
        }
      });
      break;
  }
  return legalMoves;
}

// Move a piece on the board
function movePiece(fromRank, fromFile, toRank, toFile) {
  const fromPiece = board[fromRank][fromFile];
  board[fromRank][fromFile] = '';
  board[toRank][toFile] = fromPiece;
  const fromSquareElement = document.querySelector(`.square[data-rank="${fromRank}"][data-file="${fromFile}"]`);
  const toSquareElement = document.querySelector(`.square[data-rank="${toRank}"][data-file="${toFile}"]`);
  const pieceElement = fromSquareElement.querySelector('.piece');
  toSquareElement.appendChild(pieceElement);
}

// Handle a click on a square
function handleSquareClick(event) {
  const squareElement = event.target.closest('.square');
  const { rank, file } = squareElement.dataset;
  if (selectedPiece) {
    const legalMoves = getLegalMoves(selectedPiece.rank, selectedPiece.file);
    const isLegalMove = legalMoves.some(move => move.rank === Number(rank) && move.file === Number(file));
    if (isLegalMove) {
      movePiece(selectedPiece.rank, selectedPiece.file, Number(rank), Number(file));
      selectedPiece = null;
    } else {
      selectedPiece = null;
      handleSquareClick(event);
    }
  } else {
    const piece = board[rank][file];
    if (piece !== '') {
      const color = piece.charAt(0);
      if (color === turn) {
        selectedPiece = { rank: Number(rank), file: Number(file) };
      }
    }
  }
}

// Initialize the board
function initBoard() {
  const boardElement = document.querySelector('.board');
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const squareElement = document.createElement('div');
      squareElement.classList.add('square');
      squareElement.dataset.rank = i;
      squareElement.dataset.file = j;
      const isWhiteSquare = (i + j) % 2 === 0;
      if (isWhiteSquare) {
        squareElement.classList.add('white');
      } else {
        squareElement.classList.add('black');
      }
      const piece = board[i][j];
      if (piece !== '') {
        const pieceElement = document.createElement('div');
        pieceElement.classList.add('piece');
        pieceElement.classList.add(piece);
        squareElement.appendChild(pieceElement);
      }
      boardElement.appendChild(squareElement);
    }
  }
  boardElement.addEventListener('click', handleSquareClick);
}

initBoard();
