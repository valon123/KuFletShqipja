const crosswordData = {
    grid: [
        ['1', ' ', ' ', ' ', '2', ' ', ' ', ' ', ' ', '*', '3', '*', '*', '4',],
        [' ', '*', '*', '*', ' ', '*', '*', '*', '*', '*', ' ', '*', '*', ' ',],
        [' ', '*', '5', ' ', ' ', ' ', ' ', '*', '*', '*', ' ', '*', '*', ' ',],
        [' ', '*', ' ', '*', ' ', '*', '*', '*', '*', '6', ' ', ' ', ' ', ' ',],
        [' ', '*', ' ', '*', '7', ' ', ' ', ' ', ' ', '*', ' ', '*', '*', ' ',],
        [' ', '*', ' ', '*', '*', '*', '*', '*', '*', '*', '*', '8', '*', ' ',],
        [' ', '*', ' ', '*', '*', '*', '9', '*', '*', '10', ' ', ' ', ' ', ' ',],
        [' ', '*', ' ', '*', '*', '*', ' ', '*', '11', '*', '*', ' ', '*', '*',],
        ['*', '*', '12', ' ', ' ', ' ', ' ', ' ', ' ', '*', '*', ' ', '*', '*',],
        ['*', '*', ' ', '*', '*', '*', ' ', '*', '13', ' ', '14', ' ', ' ', '*',],
        ['*', '*', '*', '*', '*', '*', ' ', '*', ' ', '*', ' ', '*', '*', '*',],
        ['*', '*', '*', '*', '*', '*', ' ', '*', ' ', '*', ' ', '*', '*', '*',],
        ['15', ' ', ' ', ' ', ' ', ' ', ' ', '*', ' ', '*', '16', ' ', ' ', ' ',],
        ['*', '*', '*', '*', '*', '*', '*', '*', ' ', '*', ' ', '*', '*', '*',]
    ],
    answers: [
        // Përgjigjet horizontale
        { word: 'SFUNGJERI', direction: 'horizontal', row: 0, col: 0 },  // 1
        { word: 'LIBRI', direction: 'horizontal', row: 2, col: 2 },      // 5
        { word: 'PIANO', direction: 'horizontal', row: 3, col: 9 },      // 6
        { word: 'MUZEU', direction: 'horizontal', row: 4, col: 4 },      // 7
        { word: 'HARTA', direction: 'horizontal', row: 6, col: 9 },      // 10
        { word: 'TELASHE', direction: 'horizontal', row: 8, col: 2 },    // 12
        { word: 'KAPAK', direction: 'horizontal', row: 9, col: 8 },      // 13
        { word: 'SHISHJA', direction: 'horizontal', row: 12, col: 0 },   // 15
        { word: 'TYMI', direction: 'horizontal', row: 12, col: 10 },     // 16

        // Përgjigjet vertikale
        { word: 'SEMAFORI', direction: 'vertical', row: 0, col: 0 },     // 1
        { word: 'GABIM', direction: 'vertical', row: 0, col: 4 },        // 2
        { word: 'QIRIU', direction: 'vertical', row: 0, col: 10 },       // 3
        { word: 'SHKOLLA', direction: 'vertical', row: 0, col: 13 },     // 4
        { word: 'LUMENJTE', direction: 'vertical', row: 2, col: 2 },     // 5 - fixed starting row to 2
        { word: 'DRITA', direction: 'vertical', row: 5, col: 11 },       // 8
        { word: 'HESHTJA', direction: 'vertical', row: 6, col: 6 },      // 9
        { word: 'SEKRETI', direction: 'vertical', row: 7, col: 8 },      // 11
        { word: 'PJATA', direction: 'vertical', row: 9, col: 10 }        // 14
    ]
};



// Function to initialize the crossword grid
function initializeGrid() {
    const grid = document.getElementById('crossword-grid');
    window.activeDirection = 'horizontal'; // Default direction

    for (let row = 0; row < crosswordData.grid.length; row++) {
        const tr = document.createElement('tr');
        for (let col = 0; col < crosswordData.grid[row].length; col++) {
            const td = document.createElement('td');
            const cellContent = crosswordData.grid[row][col];

            td.dataset.row = row;
            td.dataset.col = col;

            if (cellContent === '*') {
                td.setAttribute('data-content', '*');
            } else {
                if (!isNaN(cellContent)) {
                    td.setAttribute('data-content', 'number');
                    td.setAttribute('data-number', cellContent);
                }
                td.setAttribute('contenteditable', 'true');

                // Update click handler to determine direction
                td.addEventListener('click', function(e) {
                    const cell = this;
                    // Try to determine the direction based on surrounding cells
                    let direction = 'horizontal';
                    
                    // Check if part of vertical word
                    const aboveCell = document.querySelector(`td[data-row="${row-1}"][data-col="${col}"]`);
                    const belowCell = document.querySelector(`td[data-row="${row+1}"][data-col="${col}"]`);
                    const leftCell = document.querySelector(`td[data-row="${row}"][data-col="${col-1}"]`);
                    const rightCell = document.querySelector(`td[data-row="${row}"][data-col="${col+1}"]`);
                    
                    // If has vertical neighbors and they're not black cells
                    if ((aboveCell && aboveCell.getAttribute('data-content') !== '*') || 
                        (belowCell && belowCell.getAttribute('data-content') !== '*')) {
                        direction = 'vertical';
                    }
                    // If has horizontal neighbors and they're not black cells
                    if ((leftCell && leftCell.getAttribute('data-content') !== '*') || 
                        (rightCell && rightCell.getAttribute('data-content') !== '*')) {
                        // If already determined as vertical, keep vertical if no horizontal word exists
                        if (direction !== 'vertical' || 
                            (leftCell && leftCell.getAttribute('data-content') !== '*' && 
                             rightCell && rightCell.getAttribute('data-content') !== '*')) {
                            direction = 'horizontal';
                        }
                    }
                    
                    window.activeDirection = direction;
                    highlightWord(cell, direction);
                });

                td.addEventListener('keydown', function(e) {
                    switch(e.key) {
                        case 'Backspace':
                            e.preventDefault();
                            handleBackspace(this, window.activeDirection);
                            break;
                        case 'ArrowRight':
                            e.preventDefault();
                            moveToNextCell(this, 'horizontal');
                            break;
                        case 'ArrowLeft':
                            e.preventDefault();
                            moveToPrevCell(this, 'horizontal');
                            break;
                        case 'ArrowUp':
                            e.preventDefault();
                            moveToPrevCell(this, 'vertical');
                            break;
                        case 'ArrowDown':
                            e.preventDefault();
                            moveToNextCell(this, 'vertical');
                            break;
                    }
                });

                td.addEventListener('input', function(e) {
                    handleInput(this, window.activeDirection);
                });
            }

            tr.appendChild(td);
        }
        grid.appendChild(tr);
    }
}

function highlightWord(cell, direction) {
    // Clear previous highlights
    document.querySelectorAll('#crossword-grid td').forEach(td => {
        td.classList.remove('active', 'highlight');
    });

    // Set active cell
    cell.classList.add('active');

    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    // Force direction based on the parameter
    if (direction === 'vertical') {
        // Go up
        for (let r = row - 1; r >= 0; r--) {
            const currentCell = document.querySelector(`td[data-row="${r}"][data-col="${col}"]`);
            if (!currentCell || currentCell.getAttribute('data-content') === '*') break;
            currentCell.classList.add('highlight');
        }
        // Go down
        for (let r = row + 1; r < crosswordData.grid.length; r++) {
            const currentCell = document.querySelector(`td[data-row="${r}"][data-col="${col}"]`);
            if (!currentCell || currentCell.getAttribute('data-content') === '*') break;
            currentCell.classList.add('highlight');
        }
    } else {
        // Go left
        for (let c = col - 1; c >= 0; c--) {
            const currentCell = document.querySelector(`td[data-row="${row}"][data-col="${c}"]`);
            if (!currentCell || currentCell.getAttribute('data-content') === '*') break;
            currentCell.classList.add('highlight');
        }
        // Go right
        for (let c = col + 1; c < crosswordData.grid[row].length; c++) {
            const currentCell = document.querySelector(`td[data-row="${row}"][data-col="${c}"]`);
            if (!currentCell || currentCell.getAttribute('data-content') === '*') break;
            currentCell.classList.add('highlight');
        }
    }

    return direction;
}


function handleInput(cell, direction) {
    let text = cell.textContent.toUpperCase();
    if (text.length > 0) {
        // Keep only the last character entered
        cell.textContent = text.charAt(text.length - 1);
        
        // Find and focus the next cell in the correct direction
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        let nextCell;
        
        if (direction === 'vertical') {
            nextCell = document.querySelector(`td[data-row="${row + 1}"][data-col="${col}"]`);
        } else {
            nextCell = document.querySelector(`td[data-row="${row}"][data-col="${col + 1}"]`);
        }
        
        // If next cell exists and is not a black cell, focus it
        if (nextCell && nextCell.getAttribute('data-content') !== '*') {
            nextCell.focus();
            highlightWord(nextCell, direction);
        }
    }
}

function handleBackspace(cell, direction) {
    if (cell.textContent.trim() === '') {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        let prevCell;
        
        if (direction === 'vertical') {
            prevCell = document.querySelector(`td[data-row="${row - 1}"][data-col="${col}"]`);
        } else {
            prevCell = document.querySelector(`td[data-row="${row}"][data-col="${col - 1}"]`);
        }
        
        if (prevCell && prevCell.getAttribute('data-content') !== '*') {
            prevCell.textContent = '';
            prevCell.focus();
            highlightWord(prevCell, direction);
        }
    } else {
        cell.textContent = '';
    }
}

function findAdjacentCell(cell, direction, delta) {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    let nextCell;

    if (direction === 'horizontal') {
        nextCell = document.querySelector(`td[data-row="${row}"][data-col="${col + delta}"]`);
    } else {
        nextCell = document.querySelector(`td[data-row="${row + delta}"][data-col="${col}"]`);
    }

    if (nextCell && nextCell.getAttribute('data-content') !== '*') {
        return nextCell;
    }
    return null;
}

function moveToNextCell(cell, direction) {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    let nextCell;
    
    if (direction === 'vertical') {
        nextCell = document.querySelector(`td[data-row="${row + 1}"][data-col="${col}"]`);
    } else {
        nextCell = document.querySelector(`td[data-row="${row}"][data-col="${col + 1}"]`);
    }
    
    if (nextCell && nextCell.getAttribute('data-content') !== '*') {
        nextCell.focus();
        highlightWord(nextCell, direction);
    }
}

function moveToPrevCell(cell, direction) {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    let prevCell;
    
    if (direction === 'vertical') {
        prevCell = document.querySelector(`td[data-row="${row - 1}"][data-col="${col}"]`);
    } else {
        prevCell = document.querySelector(`td[data-row="${row}"][data-col="${col - 1}"]`);
    }
    
    if (prevCell && prevCell.getAttribute('data-content') !== '*') {
        prevCell.focus();
        highlightWord(prevCell, direction);
    }
}

function focusCell(row, col, forcedDirection) {
    const cell = document.querySelector(`td[data-row="${row}"][data-col="${col}"]`);
    if (cell) {
        cell.focus();
        
        // Clear previous highlights
        document.querySelectorAll('#crossword-grid td').forEach(td => {
            td.classList.remove('active', 'highlight');
        });
        
        // Add active class to clicked cell
        cell.classList.add('active');
        
        // Set the active direction
        window.activeDirection = forcedDirection;
        
        // Use the forced direction for highlighting
        highlightWord(cell, forcedDirection);
        
        // Ensure the cell is focused
        cell.focus();
    }
}




// Function to check answers
function checkAnswers() {
    // Clear any existing highlights and colors
    document.querySelectorAll('#crossword-grid td').forEach(td => {
        td.classList.remove('active', 'highlight');
        td.style.backgroundColor = '';
    });

    // Create a map to handle overlapping cells
    const cellColors = new Map();

    // Check each answer
    crosswordData.answers.forEach(answer => {
        const { word, row, col, direction } = answer;
        
        // Check each letter of the word
        for (let i = 0; i < word.length; i++) {
            const currentRow = direction === 'horizontal' ? row : row + i;
            const currentCol = direction === 'horizontal' ? col + i : col;
            const cell = document.querySelector(`td[data-row="${currentRow}"][data-col="${currentCol}"]`);
            
            if (cell && cell.getAttribute('data-content') !== '*') {
                const userInput = cell.textContent.toUpperCase().trim();
                const correctLetter = word[i].toUpperCase();
                const cellKey = `${currentRow},${currentCol}`;

                // Store the result for this cell
                if (userInput === correctLetter) {
                    cellColors.set(cellKey, '#28A745'); // green for correct
                } else {
                    cellColors.set(cellKey, '#DC3545'); // red for incorrect or empty
                }
            }
        }
    });

    // Apply colors after checking all words
    cellColors.forEach((color, cellKey) => {
        const [row, col] = cellKey.split(',');
        const cell = document.querySelector(`td[data-row="${row}"][data-col="${col}"]`);
        if (cell) {
            cell.style.backgroundColor = color;
        }
    });

    // Remove focus from any active cell
    if (document.activeElement.tagName === 'TD') {
        document.activeElement.blur();
    }
}

// Attach the checkAnswers function to the button click event
document.addEventListener('DOMContentLoaded', () => {
    initializeGrid();  // Initialize the grid when the page loads
    document.getElementById('check-answer').addEventListener('click', checkAnswers);  // Attach event to button
});
