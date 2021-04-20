var table;

function generateTable() {
  firebase.firestore().collection("students").orderBy("ticketNumber", "desc").orderBy("timestamp", "asc")
  .get()
  .then(function(querySnapshot) {
    table = document.getElementById("mastertable");
    querySnapshot.forEach(function(doc){
      eachDoc(doc);
    });
  })
  .catch(function(error) {
    console.error("Error retrieving table: ", error);
    firebase.firestore().collection("students").orderBy("ticketNumber", "desc")
    .get()
    .then(function(querySnapshot) {
      table = document.getElementById("mastertable");
      querySnapshot.forEach(function(doc){
        eachDoc(doc);
      });
    })
    .catch(function(error) {
      console.log("Error: " + error);
      alert("Error: " + error);
    });
  });
}

function eachDoc(doc) {
  console.log(doc.id, "=>", doc.data());
  var row = table.insertRow(1);
  var data = doc.data();

  var ticketCell = row.insertCell(0);
  var nameCell = row.insertCell(1);
  var photoCell;
  var shirtCell = row.insertCell(2);
  var hereCell = row.insertCell(3);
  var collectedCell = row.insertCell(4);
  var timestampCell = row.insertCell(5);

  ticketCell.innerHTML = leadingZeros(data.ticketNumber);
  nameCell.innerHTML = data.firstName + ' ' + data.lastName;
  shirtCell.innerHTML = data.shirtSize;
  hereCell.innerHTML = checkedIn(data);
  hereCell.style.backgroundColor = colorCode(checkedIn(data));
  collectedCell.innerHTML = data.shirtCollected;
  collectedCell.style.backgroundColor = colorCode(data.shirtCollected);
  timestampCell.innerHTML = getDateString(data.timestamp);
}

function listenTable() {
  firebase.firestore().collection("students")
  .onSnapshot(function(snapshot) {
    snapshot.docChanges().forEach(function(change) {
      if (change.type === "added") {
          console.log("New document: ", change.doc.data());
          alert("A document has been added.")
      }
      if (change.type === "modified") {
          console.log("Modified document: ", change.doc.data());

      }
      if (change.type === "removed") {
          console.log("Removed document: ", change.doc.data());
          alert("A document has been removed.");
      }
    });
  });
}

// This function converts the integer photoID to a boolean variable.
function checkedIn(data) {
  if (data.photoID == 1) {
    return true;
  } else if (data.photoID == 0) {
    return false;
  } else {
    return data.photoID;
  }
}

// This function returns a string for an integer representing the number of seonds since 1970.
function getDateString(timestamp) {
  var myDate = new Date(timestamp);
  return myDate.toLocaleString();
}

function colorCode(value) {
  if (value == true) {
    return "green";
  } else if (value == false) {
    return "red";
  }
}

function confirmLoad() {
  if (confirm("This table can only be loaded a limited number of times (~50 times per day). Are you sure you want to load the table now?")) {
    generateTable();
  }
}


confirmLoad();

// listenTable();
