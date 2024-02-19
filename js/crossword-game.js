document.addEventListener('DOMContentLoaded', function () {
  // Fetch JSON file with grid and clues
  fetch('crosswords/pl/animals-24.json')
    .then(response => response.json())
    .then(data => createCrossword(data))
    .catch(error => console.error(error));

  function createCrossword(data) {
    // Generate a crossword board
    const crosswordTable = document.createElement('table');
    crosswordTable.setAttribute('class', 'crossword-grid');
    const crossword = document.getElementById('crossword');
    crossword.appendChild(crosswordTable);

    // Get dimensions of crossword board
    const numRows = data.grid.length;
    const numCols = data.grid[0].length;

    // Generate crossword cells
    let cellCounter = 0;
    for (let i = 0; i < numRows; i++) {
      cellCounter++
      const row = document.createElement('tr');
      crosswordTable.appendChild(row);
      for (let j = 0; j < numCols; j++) {
        cellCounter++
        const cell = document.createElement('td');
        const input = document.createElement('input');
        cell.dataset.row = i;
        cell.dataset.col = j;
        input.setAttribute('type', 'text');
        input.dataset.row = i;
        input.dataset.col = j;
        input.setAttribute('maxlength', data.grid[i][j]);

        // Set CSS class for black cells
        if (data.grid[i][j] === 0) {
          cell.className = 'black-cell';
        } else {
          cell.dataset.index = cellCounter - i - 1;
          cell.appendChild(input);
        }

        row.appendChild(cell);
      }
    }

    // Generate crossword clues
    const cluesContainer = document.createElement('div');
    cluesContainer.setAttribute('class', 'clues-container');
    crossword.appendChild(cluesContainer);

    const cluesAcrossContainer = document.createElement('div');
    cluesAcrossContainer.setAttribute('class', 'clues-across');
    const clueAcrossTitle = document.createElement('strong');
    clueAcrossTitle.textContent = 'Across:';
    cluesAcrossContainer.appendChild(clueAcrossTitle);
    cluesContainer.appendChild(cluesAcrossContainer);

    data.clues.across.forEach(clue => {
      const clueElement = document.createElement('div');
      clueElement.dataset.direction = 'across';
      clueElement.dataset.hint = `${clue.designation}`;
      clueElement.textContent = `${clue.designation}. ${clue.clue}`;
      cluesAcrossContainer.appendChild(clueElement);
    });

    const cluesDownContainer = document.createElement('div');
    cluesDownContainer.setAttribute('class', 'clues-down');
    const clueDownTitle = document.createElement('strong');
    clueDownTitle.textContent = 'Down:';
    cluesDownContainer.appendChild(clueDownTitle);
    cluesContainer.appendChild(cluesDownContainer);

    data.clues.down.forEach(clue => {
      const clueElement = document.createElement('div');
      clueElement.dataset.direction = 'down';
      clueElement.dataset.hint = `${clue.designation}`;
      clueElement.textContent = `${clue.designation}. ${clue.clue}`;
      cluesDownContainer.appendChild(clueElement);
    });
  }
})