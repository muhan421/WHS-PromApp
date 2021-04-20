var currentStudentId = "";
var currentStudentTicketNumber = 0;
var reader = new FileReader();

// This adds a new student to the database.
function createStudent(studentID, firstName, lastName, idPhoto, typedShirtSize, ticketNumber) {
	return firebase.firestore().collection('students').add({
		name: firstName + " " + lastName,
		firstName: firstName,
		lastName: lastName,
		ticketNumber: ticketNumber,
		photoID: idPhoto,
		shirtSize: typedShirtSize,
		shirtCollected: false,
		timestamp: Date.now()
	}).then(function() {
		currentStudentTicketNumber = document.getElementById("ticketInput").value;
		saveImage();
	}).catch(function(error) {
		if (error.code == "permission-denied") {
			alert("Permission denied!\nYou must have authorization to use this app. If you believe this is a mistake, please contact Mrs. Patel.")
		} else {
			alert('Error when adding student: ' + error)
		}
		console.error('Error when adding student', error)
	});
}

function submit() {
	var firstInput = document.getElementById("firstInput").value;
	var lastInput = document.getElementById("lastInput").value;
	var shirtInput = document.getElementById("shirtInput").value;
	var ticketInput = document.getElementById("ticketInput").value;
	if (firstInput == "" || lastInput == "" || shirtInput == "" || ticketInput == "") {
		alert("Some fields are blank!");
	} else {
		createStudent(000000, firstInput, lastInput, 0, shirtInput, parseInt(ticketInput, 10));
	}
}

function doSomethingWithFiles(file) {
  console.log(file);
}

function saveImage() {
	firebase.firestore().collection("students").where("ticketNumber", "==", currentStudentTicketNumber)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
						currentStudentId = doc.id;
        });
				console.log(currentStudentId);
				console.log(currentStudentTicketNumber);
				var studentRef = storageRef.child(leadingZeros(parseInt(currentStudentTicketNumber, 10)) + ".jpg");
				var file = document.getElementById('photo').src;
				console.log(file);
				if (photoExists) {
					var uploadTask = studentRef.putString(file, 'data_url').then(function(snapshot) {
						console.log('Uploaded a data_url string!');
						clearphoto();
						photoExists = false;
						document.getElementById("firstInput").value = "";
						document.getElementById("lastInput").value = "";
						document.getElementById("shirtInput").value = "";
						document.getElementById("ticketInput").value = "";
						document.getElementById("file-input").value = "";
					});
				} else {
					alert("The photo is missing!");
				}
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}

function manualImageChange() {
	reader.readAsDataURL(document.getElementById('file-input').files[0])
}

// from https://github.com/philnash/mediadevices-camera-selection/blob/master/app.js
// see MIT Licence at for licence
function gotDevices(mediaDevices) {
	const select = document.getElementById("cameraSelection");

  select.innerHTML = '';
  select.appendChild(document.createElement('option'));
  let count = 1;
  mediaDevices.forEach(mediaDevice => {
    if (mediaDevice.kind === 'videoinput') {
      const option = document.createElement('option');
      option.value = mediaDevice.deviceId;
      const label = mediaDevice.label || `Camera ${count++}`;
      const textNode = document.createTextNode(label);
      option.appendChild(textNode);
      select.appendChild(option);
    }
  });
}

function changeDevice() {
	const video = document.getElementById('video');
	console.log(document.getElementById('cameraSelection').value);
	navigator.mediaDevices.getUserMedia({video:{ deviceId: {exact: document.getElementById('cameraSelection').value}}, audio:false})
	.then(function(stream) {
		video.srcObject = stream;
		video.play();
	})
	.catch(function(err) {
		console.log("An error occurred: " + err);
	});
}

window.onload = function() {
  document.getElementById('ticketInput').onkeydown = function(event) {
      if (event.keyCode == 13) {
          submit();
      }
  }

	reader.addEventListener("load", function () {
		console.log(reader.result);
		document.getElementById('photo').setAttribute('src', reader.result);
		photoExists = true;
	}, false);

	navigator.mediaDevices.enumerateDevices().then(gotDevices);
}
