const gridContainer = document.querySelector('.grid-container');
const gridSize = 20;
const babyblues = [];
const coveredCells = [];
let babyblueCounter = 0;



// Create the dynamic grid
for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.dataset.row = i;
        cell.dataset.col = j;
        cell.id = i + 'X' + j;
        gridContainer.appendChild(cell);
    }
}




// Function to create a new baby blue element and make it draggable
function createBabyBlue() {
    const babyblue = document.createElement('div');
    babyblue.className = 'babyblue';

    const babyblueId = `babyblue-${babyblueCounter}`;
    babyblue.id = babyblueId;
    babyblueCounter++;

    const babyblueObj = {
        element: babyblue,
        cells: coveredCells,
        id: babyblueId,
    };
    babyblues.push(babyblueObj);
    
    document.body.appendChild(babyblue);
    dragBabyBlue(babyblue, coveredCells);
}
console.log(babyblues);




// Function to handle dragging a baby blue element
function dragBabyBlue(babyblue, coveredCells) {
    let isDragging = false;

    const startDrag = (e) => {
        isDragging = true;
        e.preventDefault();
    };

    const performDrag = (e) => {
        if (!isDragging) return;
        const x = e.clientX || e.touches[0].clientX;
        const y = e.clientY || e.touches[0].clientY;
        babyblue.style.left = x - babyblue.clientWidth / 2 + 'px';
        babyblue.style.top = y - babyblue.clientHeight / 2 + 'px';
        updateGridCells(babyblue, coveredCells);
    };

    const stopDrag = () => {
        isDragging = false;
    };

    // Add touch events
    babyblue.addEventListener('touchstart', startDrag);
    document.addEventListener('touchmove', performDrag);
    document.addEventListener('touchend', stopDrag);

    // Add mouse events
    babyblue.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', performDrag);
    document.addEventListener('mouseup', stopDrag);
}





// Function to update grid cells when a baby blue element is dragged over them
function updateGridCells(babyblue, coveredCells) {
    const gridCells = document.querySelectorAll('.grid-cell');

    // Create a copy of the coveredCells array for this babyblue element
    const newCoveredCells = [];

    gridCells.forEach((cell) => {
        const cellRect = cell.getBoundingClientRect();
        if (
            babyblue.style.left &&
            babyblue.style.top &&
            parseInt(babyblue.style.left) + babyblue.clientWidth > cellRect.left &&
            parseInt(babyblue.style.left) < cellRect.right &&
            parseInt(babyblue.style.top) + babyblue.clientHeight > cellRect.top &&
            parseInt(babyblue.style.top) < cellRect.bottom
        ) {
            cell.style.backgroundColor = 'pink';
            newCoveredCells.push(cell.id);
        } else {
            cell.style.backgroundColor = '#808080';
        }
    });

    // Remove cells that are no longer covered by this babyblue element
    const cellsToRemove = coveredCells.filter((cellId) => !newCoveredCells.includes(cellId));
    cellsToRemove.forEach((cellId) => {
        const index = coveredCells.indexOf(cellId);
        if (index !== -1) {
            coveredCells.splice(index, 1);
        }
    });

    // Add newly covered cells to the coveredCells array
    newCoveredCells.forEach((cellId) => {
        if (!coveredCells.includes(cellId)) {
            coveredCells.push(cellId);
        }
    });
}





// Create a new baby blue element when the button is clicked
const createButton = document.getElementById('createBabyBlue');
createButton.addEventListener('click', () => {
    createBabyBlue();
});
