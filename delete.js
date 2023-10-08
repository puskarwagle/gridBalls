const dbName = 'gridBalls';

function deleteDatabase() {
  const request = indexedDB.deleteDatabase(dbName);

  request.onsuccess = (event) => {
    console.log(`Database '${dbName}' deleted successfully.`);
  };

  request.onerror = (event) => {
    console.error(`Error deleting database '${dbName}':`, event.target.error);
  };

  request.onblocked = (event) => {
    console.warn(`Couldn't delete database '${dbName}' due to an open connection.`);
  };
}

// Call the function to delete the database
deleteDatabase();
