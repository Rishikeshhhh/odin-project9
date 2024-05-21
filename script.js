const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const makeMove = (index, marker) => {
        if (board[index] === "") {
            board[index] = marker;
            return true;
        }
        return false;
    };

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    return { getBoard, makeMove, resetBoard };
})();

const Player = (name, marker) => {
    return { name, marker };
};

const GameController = (() => {
    const player1 = Player("Player 1", "X");
    const player2 = Player("Player 2", "O");
    let currentPlayer = player1;

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const getCurrentPlayer = () => currentPlayer;

    const isWin = (board) => {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        return winningCombinations.some(combination => 
            board[combination[0]] === currentPlayer.marker &&
            board[combination[0]] === board[combination[1]] &&
            board[combination[0]] === board[combination[2]]
        );
    };

    const isTie = (board) => {
        return board.every(cell => cell !== "");
    };

    const playRound = (index) => {
        if (Gameboard.makeMove(index, currentPlayer.marker)) {
            if (isWin(Gameboard.getBoard())) {
                return { gameEnd: true, message: `${currentPlayer.name} wins!` };
            } else if (isTie(Gameboard.getBoard())) {
                return { gameEnd: true, message: "It's a tie!" };
            } else {
                switchPlayer();
                return { gameEnd: false };
            }
        }
        return { gameEnd: false };
    };

    const resetGame = () => {
        Gameboard.resetBoard();
        currentPlayer = player1;
    };

    return { playRound, resetGame, getCurrentPlayer };
})();

const DisplayController = (() => {
    const gameBoardElement = document.getElementById("gameBoard");
    const gameMessageElement = document.getElementById("gameMessage");
    const restartButton = document.getElementById("restartButton");

    const updateBoard = () => {
        gameBoardElement.innerHTML = "";
        Gameboard.getBoard().forEach((cell, index) => {
            const cellElement = document.createElement("div");
            cellElement.textContent = cell;
            cellElement.addEventListener("click", () => handleCellClick(index));
            gameBoardElement.appendChild(cellElement);
        });
    };

    const displayMessage = (message) => {
        gameMessageElement.textContent = message;
    };

    const handleCellClick = (index) => {
        const { gameEnd, message } = GameController.playRound(index);
        updateBoard();
        if (gameEnd) {
            displayMessage(message);
        } else {
            displayMessage(`${GameController.getCurrentPlayer().name}'s turn`);
        }
    };

    const init = () => {
        restartButton.addEventListener("click", () => {
            GameController.resetGame();
            updateBoard();
            displayMessage(`${GameController.getCurrentPlayer().name}'s turn`);
        });
        updateBoard();
        displayMessage(`${GameController.getCurrentPlayer().name}'s turn`);
    };

    return { init };
})();

DisplayController.init();
