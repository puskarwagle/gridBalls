const dbName = 'gridBalls';
const gridMatrix = 'gridMatrix';
let db;

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(dbName, 3);

    request.onerror = (event) => {
      reject(new Error("Why didn't you allow my web app to use IndexedDB?!"));
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.onerror = (event) => {
        reject(new Error(`Database error: ${event.target.errorCode}`));
      };
      if (!db.objectStoreNames.contains(gridMatrix)) {
        db.createObjectStore(gridMatrix, { keyPath: 'id' });
      }
    };
  });
}

// Call openDatabase to open the database
openDatabase()
  .then(() => {
    populateMatrix();
    displayMatrixInDiv();
  })
  .catch((error) => {
    console.error(error);
  });


// Populate matrix in the objectStore gridMatrix
const matrix = Array.from({ length: 20 }, () => Array(20).fill(0));
function populateMatrix() {
  const transaction = db.transaction([gridMatrix], 'readwrite');
  const store = transaction.objectStore(gridMatrix);

  matrix.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      const data = { id: `${rowIndex}-${columnIndex}`, value };
      store.add(data);
    });
  });

  transaction.oncomplete = () => {
    console.log('Matrix stored successfully.');
  };

  transaction.onerror = (event) => {
    console.error('Error storing matrix: ', event.target.error);
  };
}

// Retrive matrix from db and update the dom
function displayMatrixInDiv() {
  if (!db) {
    console.error('Database is not initialized.');
    return;
  }

  const transaction = db.transaction([gridMatrix], 'readonly');
  const store = transaction.objectStore(gridMatrix);
  console.log(store);
  const gridSize = 20;
  const gridContainer = document.querySelector('.grid-container');
  gridContainer.innerHTML = '';

  store.openCursor().onsuccess = (event) => {
    const cursor = event.target.result;

    if (cursor) {
      const data = cursor.value;
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const cell = document.createElement('div');
          cell.className = 'grid-cell';
          cell.dataset.row = i;
          cell.dataset.col = j;
          cell.id = `${i}X${j}`;
          gridContainer.appendChild(cell);
        }
      }
      cursor.continue();
    }
  };
}
