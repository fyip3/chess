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
    } else {
      selectedPiece = null;
      const squares
