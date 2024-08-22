// Get the element with the class 'image-upload'
var imageUpload = $('.image-upload');

// Add an event listener to the element
imageUpload.on('click', function() {
  // Create a file input element
  var fileInput = $('<input type="file" accept="image/*">');

  // Add an event listener to the file input element
  fileInput.on('change', function() {
    // Get the selected file
    var file = fileInput[0].files[0];

    // Check if a file is selected
    if (file) {
      // Create a progress dialog using SweetAlert2
      var progressDialog = Swal.fire({
        title: 'Uploading...',
        html: '<div class="progress"><div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div></div>',
        showConfirmButton: false,
        allowOutsideClick: false,
      });

      // Upload the file to Firebase Storage
      var storageRef = firebase.storage().ref('talks/' + file.name);
      var uploadTask = storageRef.put(file);

      // Update the progress dialog
      uploadTask.on('state_changed', function(snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progressDialog.setContent('<div class="progress"><div class="progress-bar" role="progressbar" aria-valuenow="' + progress + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + progress + '%;"></div></div>');
      }, function(error) {
        // Handle errors
        console.error(error);
      }, function() {
        // Get the download URL
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          // Add the image to the chat
          var image = $('<div class="chat__conversation-board__message__context"><div class="chat__conversation-board__message__bubble"><img src="' + downloadURL + '" alt="Uploaded Image"></div></div>');
          $('.chat__conversation-board').append(image);

          // Close the progress dialog
          progressDialog.close();
        });
      });
    }
  });

  // Trigger the file input element
  fileInput.trigger('click');
});