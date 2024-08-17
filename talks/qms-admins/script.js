
// Initialize Firebase Realtime Database
const fb = new Firebase("https://qms-forum-default-rtdb.firebaseio.com/");
const messages = fb.child("talks");

// Get the input field, send button, and conversation board elements
const inputField = $('.chat__conversation-panel__input');
const sendButton = $('.send-message-button');
const conversationBoard = $('.chat__conversation-board');


const userNameInput = document.getElementById('user-name');
const profileImageSelect = document.getElementById('profile-image');
const startButton = document.getElementById('start-button');
const chatDiv = document.getElementById('chat');

startButton.addEventListener('click', () => {
  const username = userNameInput.value;
  const profileImage = profileImageSelect.value;

  // Use the username and profile image URL here
  console.log(username, profileImage);
});


// Add an event listener to the send button
sendButton.click(function() {
  // Get the user's input from the input field
  const userInput = inputField.val().trim();

  // Check if the input is not empty
  if (userInput) {
    // Send the message to Firebase Realtime Database
    messages.push({
      username: username,
      profileUrl: profileImage,
      text: userInput
    });

    // Clear the input field
    inputField.val('');
  }
});

// Listen for new messages from Firebase Realtime Database
messages.on('child_added', function(data) {
  const message = data.val();
  const messageContainer = $('<div>').addClass('chat__conversation-board__message-container');

  const person = $('<div>').addClass('chat__conversation-board__message__person');

  const avatar = $('<div>').addClass('chat__conversation-board__message__person__avatar');
  const img = $('<img>').attr('src', message.profileUrl).attr('alt', message.username);
  avatar.append(img);

  const nickname = $('<span>').addClass('chat__conversation-board__message__person__nickname').text(message.username);

  person.append(avatar);
  person.append(nickname);

  const context = $('<div>').addClass('chat__conversation-board__message__context');

  const bubble = $('<div>').addClass('chat__conversation-board__message__bubble');
  const messageText = $('<span>').text(message.text);
  bubble.append(messageText);

  context.append(bubble);

  messageContainer.append(person);
  messageContainer.append(context);

  conversationBoard.append(messageContainer);
  chatDiv.scrollTop = chatDiv.scrollHeight;
});
