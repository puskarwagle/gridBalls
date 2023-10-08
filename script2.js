const gridContainer = document.querySelector('.grid-container');
const createButton = document.getElementById('createBabyBlue');
const gridSize = 30;
const babyblues = [];
let babyblueCounter = 0;



// Create the dynamic grid
for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.dataset.row = i;
        cell.dataset.col = j;
        cell.dataset.decimal = "0";
        cell.id = `${i}X${j}`;
        cell.textContent = "0";
        gridContainer.appendChild(cell);
    }
}





// Function to create a new baby blue element and make it draggable
function createBabyBlue() {
    const babyblue = document.createElement('div');
    babyblue.className = 'babyblue';

    const babyblueId = `b${babyblueCounter}`;
    babyblue.id = babyblueId;
    babyblue.textContent = babyblue.id;
    babyblueCounter++;

    document.body.appendChild(babyblue);
    dragBabyBlue(babyblue);

    const babyblueObj = {
        cells: coveredCells,
        id: babyblueId,
    };
    babyblues.push(babyblueObj);
    
    const babybluesJson = JSON.stringify(babyblues, null, 2);
    const dataLog = document.getElementById('dataLog');
    dataLog.textContent = babybluesJson;
}
createButton.addEventListener('click', () => {
    createBabyBlue();
});




// Function to handle dragging a baby blue element
function dragBabyBlue(babyblue) {
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