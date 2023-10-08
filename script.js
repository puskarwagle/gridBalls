const gridContainer = document.querySelector('.grid-container');
const gridSize = 50;
const babyblues = [];
const coveredCells = [];
let babyblueCounter = 0;
const createButton = document.getElementById('createBabyBlue');
const dataLog = document.getElementById('dataLog');
const babybluesJson = JSON.stringify(babyblues, null, 2);
dataLog.textContent = babybluesJson;

// Create the dynamic grid
for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.dataset.row = i;
        cell.dataset.col = j;
        cell.id = i + 'X' + j;
        cell.dataset.decimal = "0";
        cell.textContent = "0";
        gridContainer.appendChild(cell);
    }
}

// Function to create a new baby blue element and make it draggable
function createBabyBlue() {
    const babyblue = document.createElement('div');
    babyblue.className = 'babyblue';

    const babyblueId = `bb-${babyblueCounter}`;
    babyblue.id = babyblueId;
    babyblue.textContent = babyblue.id;
    babyblueCounter++;

    const babyblueObj = {
        cells: [],
        id: babyblueId,
    };    
    babyblues.push(babyblueObj);
    
    document.body.appendChild(babyblue);
    dragBabyBlue(babyblue, babyblueObj);

    const babybluesJson = JSON.stringify(babyblues, null, 2);
    dataLog.textContent = babybluesJson;
}


createButton.addEventListener('click', () => {
    createBabyBlue();
});


// Function to handle dragging a baby blue element
function dragBabyBlue(babyblue, babyblueObj) {
    let isDragging = false;

    const startDrag = (e) => {
        isDragging = true;
        e.preventDefault();
    };

    const performDrag = (e) => {
        if (!isDragging) return;
        const x = (e.clientX || e.touches[0].clientX) + window.scrollX;
        const y = (e.clientY || e.touches[0].clientY) + window.scrollY;
        babyblue.style.left = x - babyblue.clientWidth / 2 + 'px';
        babyblue.style.top = y - babyblue.clientHeight / 2 + 'px';
    };    

    const stopDrag = () => {
        isDragging = false;
        updateGridCells(babyblue, babyblueObj.cells, babyblueObj);
    };
    
    // updateAndLogRect();
    const updateAndLogRect = () => {
        const rect = babyblue.getBoundingClientRect();
        // console.log(`Id: ${babyblue.id}, Top: ${rect.top}px, Right: ${rect.right}px, Bottom: ${rect.bottom}px, Left: ${rect.left}px`);
        return rect;
    };

    babyblue.addEventListener('touchstart', startDrag);
    document.addEventListener('touchmove', performDrag);
    document.addEventListener('touchend', stopDrag);
    babyblue.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', performDrag);
    document.addEventListener('mouseup', stopDrag);
    window.addEventListener('scroll', updateAndLogRect);
    window.addEventListener('resize', updateAndLogRect);
}





// Function to update grid cells when a baby blue element is dragged over them
function updateGridCells(babyblue, coveredCells, babyblueObj) {
    const gridCells = document.querySelectorAll('.grid-cell');
    const newCoveredCells = [];

    gridCells.forEach((cell) => {
        const cellRect = cell.getBoundingClientRect();
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;
    
        if (
            babyblue.style.left &&
            babyblue.style.top &&
            parseInt(babyblue.style.left) + babyblue.clientWidth > cellRect.left + scrollX &&
            parseInt(babyblue.style.left) < cellRect.right + scrollX &&
            parseInt(babyblue.style.top) + babyblue.clientHeight > cellRect.top + scrollY &&
            parseInt(babyblue.style.top) < cellRect.bottom + scrollY
        ) {
            newCoveredCells.push(cell.id);
        }
    });
    
    
    const cellsToRemove = coveredCells.filter((cellId) => !newCoveredCells.includes(cellId));
    cellsToRemove.forEach((cellId) => {
        const index = coveredCells.indexOf(cellId);
        if (index !== -1) {
            const cell = document.getElementById(cellId);
            console.log(cell);
            if (cell) {
                cell.dataset.decimal = "0";
                cell.textContent = "0";
                cell.style.backgroundColor = "grey";
            }
            coveredCells.splice(index, 1);
        }
    });
    

    newCoveredCells.forEach((cellId) => {
        if (!coveredCells.includes(cellId)) {
            coveredCells.push(cellId);
            // const cell = document.querySelector(`[data-cell-id="${cellId}"]`);
            const cell = document.getElementById(cellId);
            if (cell) {
                cell.dataset.decimal = "1";
                cell.textContent = "1";
                cell.style.backgroundColor = "pink";
            }
        }
    });
    

    const babybluesJson = JSON.stringify(babyblues, null, 2);
    dataLog.textContent = babybluesJson;
}

