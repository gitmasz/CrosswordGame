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
          input.addEventListener('focus', cellClickHandler);
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

  function cellClickHandler(event) {
    const clickedCell = event.target;
    const row = clickedCell.dataset.row;
    const col = clickedCell.dataset.col;

    if (row && col) {
      console.log(`Clicked cell: row=${row}, col=${col}`);
      resetHighlight();
      highlightAcross(clickedCell);
      highlightDown(clickedCell);
    }
  }

  function resetHighlight() {
    const crosswordTable = document.getElementsByClassName('crossword-grid');
    const crosswordCells = crosswordTable[0].getElementsByTagName('td');
    Array.from(crosswordCells).forEach(cell => {
      if(!cell.classList.contains('black-cell')) {
        cell.removeAttribute('class')
      }
    })
  }

  function highlightAcross(elem) {
    let prevCell = elem.parentNode.previousSibling;
    let nextCell = elem.parentNode.nextSibling;
    elem.parentNode.classList.add('cell-active');
    let startHighlightNumber = elem.parentNode.dataset.index;
    let endHighlightNumber = elem.parentNode.dataset.index;
    while (prevCell) {
      prevCell.classList.add('cell-highlighted');
      if (prevCell.classList.contains('black-cell')) {
        break
      } else {
        startHighlightNumber = prevCell.dataset.index;
        prevCell = prevCell.previousSibling;
      }
    }
    while (nextCell) {
      nextCell.classList.add('cell-highlighted');
      if (nextCell.classList.contains('black-cell')) {
        break
      } else {
        endHighlightNumber = nextCell.dataset.index;
        nextCell = nextCell.nextSibling;
      }
    }
    console.log(`Clue: ${startHighlightNumber}-${endHighlightNumber}`);
  }

  function highlightDown(elem) {
    const currentRow = elem.dataset.col;
    let prevRow = elem.parentNode.parentNode.previousSibling;
    let nextRow = elem.parentNode.parentNode.nextSibling;
    elem.parentNode.classList.add('cell-active');
    let startHighlightNumber = elem.parentNode.dataset.index;
    let endHighlightNumber = elem.parentNode.dataset.index;
    while (prevRow) {
      let prevCell = prevRow.querySelectorAll("td[data-col='" + currentRow + "']")[0];
      prevCell.classList.add('cell-highlighted');
      if (prevCell.classList.contains('black-cell')) {
        break
      } else {
        startHighlightNumber = prevCell.dataset.index;
        prevRow = prevRow.previousSibling;
      }
    }
    while (nextRow) {
      let prevCell = nextRow.querySelectorAll("td[data-col='" + currentRow + "']")[0];
      prevCell.classList.add('cell-highlighted');
      if (prevCell.classList.contains('black-cell')) {
        break
      } else {
        endHighlightNumber = prevCell.dataset.index;
        nextRow = nextRow.nextSibling;
      }
    }
    console.log(`Clue: ${startHighlightNumber}-${endHighlightNumber}`);
  }
})