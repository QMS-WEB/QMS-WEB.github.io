
// Firebase Configuration
var firebaseConfig = {
  apiKey: "AIzaSyBI4qzXVQFUhR8TNcWKw1qw8Un0EMC9_Sg",
  authDomain: "qms-forum.firebaseapp.com",
  databaseURL: "https://qms-forum-default-rtdb.firebaseio.com",
  projectId: "qms-forum",
  storageBucket: "qms-forum.appspot.com",
  messagingSenderId: "738142685059",
  appId: "1:738142685059:web:6b5f38016c4633c26518b6",
  measurementId: "G-0PMDLSEEEX"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Realtime Database
var db = firebase.database();

// Initialize Firebase Storage
var storage = firebase.storage();
var storageRef = storage.ref();



// If you fork this, please change this database link to your own.
var fb = new Firebase("https://qms-forum-default-rtdb.firebaseio.com/");
var messages = fb.child("messages");
var btn = $('button');
var wrap = $('.wrapper');
var input = $('input.message');
var usernameInput = $('input.username');
var content = $('.content');
var gradientBg = $('.gradient-bg');

var user = [];

(function($) {
  $.sanitize = function(input) {
    var output = input.replace(/<script[^>]*?>.*?<\/script>/gi, '').
                  replace(/<[\/\!]*?[^<>]*?>/gi, '').
                  replace(/<style[^>]*?>.*?<\/style>/gi, '').
                  replace(/<![\s\S]*?--[ \t\n\r]*>/gi, '');
    return output;
  };
})(jQuery);

usernameInput.on('keyup', function(e) {
  if (e.keyCode === 13 && usernameInput.val().length > 0) {
    var getTxt = usernameInput.val().trim();
    if (getTxt.toLowerCase() === "qms") {
      // Create a span element to display the error message
      var errorMessage = $('<span>').addClass('error-message').text('This 

name is not allowed').css('color', 'red');
      usernameInput.after(errorMessage); // Display the error message below 

the input field
      setTimeout(function() {
        errorMessage.remove(); // Remove the error message after 3 seconds
        usernameInput.val(''); // Clear the input field
      }, 3000);
    } else {
      user.push(getTxt);
      usernameInput.val('');
      content.css('display', 'none'); // Hide the content div
      gradientBg.css('display', 'block'); // Show the gradient background
      wrap.css('display', 'block'); // Show the wrapper
      input.css('display', 'block').removeAttr('disabled'); // Display and 

enable the input field
      input.focus(); // Focus on the input field
      console.log(user);
    }
  }
});

input.on('keyup', function(e) {
  var curUsername = user.join();
  if (e.keyCode === 13 && input.val().length > 0) {
    var getTxt = input.val();
    console.log("New message:", getTxt);
    var timestamp = new Date().toLocaleTimeString();
    messages.push({
      user: curUsername,
      message: getTxt,
      timestamp: timestamp
    }, function(error) {
      if (error) {
        console.log("Error sending message:", error);
      } else {
        console.log("Message sent successfully!");
      }
    });
    input.val('');
  }
});

// Add an image upload button
var uploadBtn = $('<button>').text('Upload Image').appendTo(wrap);

// Add a file input element
var fileInput = $('<input>').attr('type', 'file').hide().appendTo(wrap);

// Add an image icon to the upload button
var imgIcon = $('<i>').addClass('fa fa-image').appendTo(uploadBtn);

// Event listener for the upload button
uploadBtn.on('click', function() {
  fileInput.trigger('click');
});

// Event listener for the file input element
fileInput.on('change', function(e) {
  var file = e.target.files[0];
  var storageRef = firebase.storage().ref();
  var uploadTask = storageRef.child('images/' + file.name).put(file);

  uploadTask.on('state_changed', function(snapshot) {
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
  }, function(error) {
    console.error('Error uploading image:', error);
  }, function() {
    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
      var curUsername = user.join();
      var timestamp = new Date().toLocaleTimeString();
      messages.push({
        user: curUsername,
        message: '',
        imageUrl: downloadURL,
        timestamp: timestamp
      });
      input.val('');
    });
  });
});

messages.limitToLast(100).on("child_added", function(snap) {
  var message = $.sanitize(snap.val().message);
  var imageUrl = snap.val().imageUrl;
  var timestamp = snap.val().timestamp;
  var username = $.sanitize(snap.val().user);

  var messageHtml = '<p style="margin-bottom: 10px;">';
  messageHtml += '<span style="color: yellow;">' + username + ':</span> ';
  messageHtml += '<span style="color: grey;">[' + timestamp + ']</span> ';

  if (imageUrl) {
    messageHtml += '<img src="' + imageUrl + '" />';
  } else {
    messageHtml += message;
  }

  messageHtml += '</p>';

  wrap.append(messageHtml);

  window.scrollTo(0, document.body.scrollHeight);
});
