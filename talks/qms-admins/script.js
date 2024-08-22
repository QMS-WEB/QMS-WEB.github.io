// Initialize Firebase Realtime Database
const fb = new Firebase("https://qms-forum-default-rtdb.firebaseio.com/");
const messages = fb.child("talks");

// setup user account 
let username;
let profileImage;

Swal.fire({
  title: 'Setup Profile Image',
  html: `
    <div class="setup" style="display:block;">
      <input type="text" id="user-name" placeholder="Enter your name">
      <select id="profile-image" class="round-imag">
        <option value="https://randomuser.me/api/portraits/women/44.jpg">Profile Image 1</option>
        <option value="https://randomuser.me/api/portraits/men/32.jpg">Profile Image 2</option>
        <option value="https://randomuser.me/api/portraits/women/22.jpg">Profile Image 3</option>
        <option value="https://randomuser.me/api/portraits/men/11.jpg">Profile Image 4</option>
        <option value="https://randomuser.me/api/portraits/women/33.jpg">Profile Image 5</option>
      </select>
      <button id="start-button">Start Chatting</button>
    </div>
  `,
  icon: '',
  allowOutsideClick: false,
  allowEscapeKey: false,
  showCancelButton: false,
});

// Get the input field, send button, and conversation board elements
const inputField = $('.chat__conversation-panel__input');
const sendButton = $('.send-message-button');
const conversationBoard = $('.chat__conversation-board');
const chatDiv = document.getElementById('chat');

const userNameInput = document.getElementById('user-name');
const profileImageSelect = document.getElementById('profile-image');
const startButton = document.getElementById('start-button');

startButton.addEventListener('click', () => {
  username = userNameInput.value.trim();
  profileImage = profileImageSelect.value.trim();
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

$('#loading-dialog').hide();
$(document).ready(function() {
  $('#loading-dialog').show();
});
