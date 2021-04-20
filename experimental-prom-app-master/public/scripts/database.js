var currentStudent;
duplicateArray = [];

function getStudentByTicket(ticketNumber) {
	firebase.firestore().collection("students").where("ticketNumber", "==", ticketNumber)
    .get()
    .then(function(querySnapshot) {
				console.log(querySnapshot.docs.length);
				if (querySnapshot.docs.length == 1) {
					querySnapshot.forEach(function(doc) {
	            // doc.data() is never undefined for query doc snapshots
	            currentStudent = doc;
							affectedStudent = firebase.firestore().collection("students").doc(currentStudent.id)
	            console.log(doc.id, " => ", doc.data());
							document.getElementById("ticketNumber").innerHTML = leadingZeros(doc.data().ticketNumber);
							document.getElementById("firstName").innerHTML = doc.data().firstName;
							document.getElementById("lastName").innerHTML = doc.data().lastName;
							document.getElementById("shirtSize").innerHTML = doc.data().shirtSize;
							if (doc.data().shirtCollected == true) {
								document.getElementById("yesButton").style.backgroundColor = "blue";
								document.getElementById("noButton").style.backgroundColor = "white";
							} else {
								document.getElementById("noButton").style.backgroundColor = "blue";
								document.getElementById("yesButton").style.backgroundColor = "white";
							}
							if (doc.data().photoID == 1) {
								document.getElementById("yesButtonTwo").style.backgroundColor = "blue";
								document.getElementById("noButtonTwo").style.backgroundColor = "white";
							} else {
								document.getElementById("noButtonTwo").style.backgroundColor = "blue";
								document.getElementById("yesButtonTwo").style.backgroundColor = "white";
							}
	        });
					loadImage();
				} else if (querySnapshot.docs.length == 0) {
					console.log("That ticket number does not exist!");
					alert("That ticket number does not exist!");
				} else {
					duplicateArray = [];
					querySnapshot.forEach(function(doc) {
						duplicateArray.push(doc);
					});
					// console.log(duplicateArray);
					var readableArray = [];
					for (i = 0; i < duplicateArray.length; i++) {
						readableArray[i] = duplicateArray[i].data();
					}
					console.log(readableArray);
					duplicateArray.sort(function(a, b) {return b.data().timestamp - a.data().timestamp});
					// console.log(duplicateArray);
					var readableArray = [];
					for (i = 0; i < duplicateArray.length; i++) {
						readableArray[i] = duplicateArray[i].data();
					}
					console.log(readableArray);
					var displayedStudent = duplicateArray[0];

					affectedStudent = firebase.firestore().collection("students").doc(displayedStudent.id)
					console.log(displayedStudent.id, " => ", displayedStudent.data());
					document.getElementById("ticketNumber").innerHTML = leadingZeros(displayedStudent.data().ticketNumber);
					document.getElementById("firstName").innerHTML = displayedStudent.data().firstName;
					document.getElementById("lastName").innerHTML = displayedStudent.data().lastName;
					document.getElementById("shirtSize").innerHTML = displayedStudent.data().shirtSize;
					if (displayedStudent.data().shirtCollected == true) {
						document.getElementById("yesButton").style.backgroundColor = "blue";
						document.getElementById("noButton").style.backgroundColor = "white";
					} else {
						document.getElementById("noButton").style.backgroundColor = "blue";
						document.getElementById("yesButton").style.backgroundColor = "white";
					}
					if (displayedStudent.data().photoID == 1) {
						document.getElementById("yesButtonTwo").style.backgroundColor = "blue";
						document.getElementById("noButtonTwo").style.backgroundColor = "white";
					} else {
						document.getElementById("noButtonTwo").style.backgroundColor = "blue";
						document.getElementById("yesButtonTwo").style.backgroundColor = "white";
					}

					loadImage();
				}

    })
    .catch(function(error) {
			if (error.code == "permission-denied") {
				alert("Permission denied!\nYou must have authorization to use this app. If you believe this is a mistake, please contact Mrs. Patel.");
			} else {
				alert("Error getting documents: " + error);
			}
        console.log("Error getting documents: ", error);
    });
}

function yesShirt() {
  return affectedStudent.update({
    shirtCollected: true
  })
  .then(function() {
    document.getElementById("yesButton").style.backgroundColor = "blue";
    document.getElementById("noButton").style.backgroundColor = "white";
    console.log("Document successfully updated!")
  })
  .catch(function(error) {
    console.error("Error updating document: ", error);
  });
}

function noShirt() {
  return affectedStudent.update({
    shirtCollected: false
  })
  .then(function() {
    document.getElementById("noButton").style.backgroundColor = "blue";
    document.getElementById("yesButton").style.backgroundColor = "white";
    console.log("Document successfully updated!")
  })
  .catch(function(error) {
    console.error("Error updating document: ", error);
  });
}

function yesHere() {
  return affectedStudent.update({
    photoID: 1
  })
  .then(function() {
    document.getElementById("yesButtonTwo").style.backgroundColor = "blue";
    document.getElementById("noButtonTwo").style.backgroundColor = "white";
    console.log("Document successfully updated!")
  })
  .catch(function(error) {
    console.error("Error updating document: ", error);
  });
}

function noHere() {
  return affectedStudent.update({
    photoID: 0
  })
  .then(function() {
    document.getElementById("noButtonTwo").style.backgroundColor = "blue";
    document.getElementById("yesButtonTwo").style.backgroundColor = "white";
    console.log("Document successfully updated!")
  })
  .catch(function(error) {
    console.error("Error updating document: ", error);
  });
}

function retrieveStudent() {
	document.getElementById("ticketNumber").innerHTML = "";
	document.getElementById("firstName").innerHTML = "";
	document.getElementById("lastName").innerHTML = "";
	document.getElementById("shirtSize").innerHTML = "";
	document.getElementById("noButton").style.backgroundColor = "white";
	document.getElementById("yesButton").style.backgroundColor = "white";
	document.getElementById("noButtonTwo").style.backgroundColor = "white";
	document.getElementById("yesButtonTwo").style.backgroundColor = "white";
	document.getElementById('imageSpace').setAttribute('src', "");
	var input = document.getElementById("ticketInput").value;
	getStudentByTicket(parseInt(input));
}

function loadImage() {
	storageRef.child(leadingZeros(parseInt(document.getElementById("ticketInput").value, 10)) + ".jpg").getDownloadURL().then(function(url) {
	  // `url` is the download URL for 'images/stars.jpg'

	  // Or inserted into an <img> element:
		console.log(url);
	  var img = document.getElementById('imageSpace');
	  img.src = url;
		document.getElementById("ticketInput").value = "";
	}).catch(function(error) {
		photoWithoutZero();
	});
}

function photoWithoutZero() {
	// Handle any errors
	storageRef.child(parseInt(document.getElementById("ticketInput").value, 10) + ".jpg").getDownloadURL().then(function(url) {
		// `url` is the download URL for 'images/stars.jpg'

		// Or inserted into an <img> element:
		console.log(url);
		var img = document.getElementById('imageSpace');
		img.src = url;
		document.getElementById("ticketInput").value = "";
	}).catch(function(error) {
		// Handle any errors
		alert("Error getting photo: " + error);
	});
}

function getStudentByLastName(lastName) {
	firebase.firestore().collection("students").where("lastName", "==", lastName)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            currentStudent = doc;
						affectedStudent = firebase.firestore().collection("students").doc(currentStudent.id)
            console.log(doc.id, " => ", doc.data());
						document.getElementById("ticketNumber").innerHTML = leadingZeros(doc.data().ticketNumber);
						document.getElementById("firstName").innerHTML = doc.data().firstName;
						document.getElementById("lastName").innerHTML = doc.data().lastName;
						document.getElementById("shirtSize").innerHTML = doc.data().shirtSize;
						if (doc.data().shirtCollected == true) {
							document.getElementById("yesButton").style.backgroundColor = "blue";
							document.getElementById("noButton").style.backgroundColor = "white";
						} else {
							document.getElementById("noButton").style.backgroundColor = "blue";
							document.getElementById("yesButton").style.backgroundColor = "white";
						}
						if (doc.data().photoID == 1) {
							document.getElementById("yesButtonTwo").style.backgroundColor = "blue";
							document.getElementById("noButtonTwo").style.backgroundColor = "white";
						} else {
							document.getElementById("noButtonTwo").style.backgroundColor = "blue";
							document.getElementById("yesButtonTwo").style.backgroundColor = "white";
						}
        });
				loadImage();
    })
    .catch(function(error) {
			if (error.code == "permission-denied") {
				alert("Permission denied!\nYou must have authorization to use this app. If you believe this is a mistake, please contact Mrs. Patel.");
			} else {
				alert("Error getting documents: " + error);
			}
        console.log("Error getting documents: ", error);
    });
}

window.onload = function() {
  document.getElementById('ticketInput').onkeydown = function(event) {
      var keyPressed = event.keyCode;
      //console.log(keyPressed);
      if (keyPressed == 13) {
          retrieveStudent();
      }
  }
}
