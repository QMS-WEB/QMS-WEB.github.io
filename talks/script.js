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
      // Display transparent dialog
      var dialog = $('<div>').addClass('transparent-dialog').text('You are not allowed to use this name');
      $('body').append(dialog);
      setTimeout(function() {
        dialog.remove();
        usernameInput.val(''); // Clear the input field
      }, 3000); // Remove dialog after 3 seconds
    } else {
      user.push(getTxt);
      usernameInput.val('');
      content.css('display', 'none'); // Hide the content div
      gradientBg.css('display', 'block'); // Show the gradient background
      wrap.css('display', 'block'); // Show the wrapper
      input.css('display', 'block'); // Show the message input field
      console.log(user);
    }
  }
});

input.on('keyup', function(e) {
  var curUsername = user.join();
  if (e.keyCode === 13 && input.val().length > 0) {
    var getTxt = input.val();
    messages.push({
      user: curUsername,
      message: getTxt
    });
    input.val('');
  }
});

messages.limitToLast(100).on("child_added", function(snap) {
  wrap.append('<li><span>' + $.sanitize(snap.val().user) + ':</span> ' + $.sanitize(snap.val().message) + '</li>');
  window.scrollTo(0,document.body.scrollHeight);
});
