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
      var errorMessage = $('<span>').addClass('error-message').text('This name is not allowed').css('color', 'red');
      usernameInput.after(errorMessage); // Display the error message below the input field
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
      input.css('display', 'block').removeAttr('disabled'); // Display and enable the input field
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
    messages.push({
      user: curUsername,
      message: getTxt
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

messages.limitToLast(100).on("child_added", function(snap) {
  wrap.append('<p style="margin-bottom: 10px;"><span style="color:yellow;">' + $.sanitize(snap.val().user) + ':</span> ' + $.sanitize(snap.val().message) + '</p>');
  window.scrollTo(0,document.body.scrollHeight);
});
