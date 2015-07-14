// YOUR CODE HERE:
var app = {};

app.server = 'https://api.parse.com/1/classes/chatterbox';
app.friends = [];

app.init = function(){
  //$('#send .submit').on('submit', app.handleSubmit);
  $('#send').on('submit', app.handleSubmit);


  setInterval(app.fetch(app.displayMessages), 1000);
  app.fetch(app.displayMessages);
};

app.send = function(message) {
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/JSON',
    success: function (data) {
      app.fetch(app.displayMessages);
      $( "input[name='message']" )[0].value = '';
    },
    error: function (data) {
      console.error(data);
    }
  });
};

app.fetch = function (callback) {
  var response = $.ajax({
    url: app.server,
    type: 'GET',
    contentType: 'application/JSON',
    success: function (data) {
      if(callback){
        callback(data.results);
      }
    },
    error: function (data) {
      console.error(data);
    }
  });
};

app.clearMessages = function(){
  $('#chats').empty();
};

app.addMessage = function(message){
  if ($('.' + message.objectId).length === 0) {
    var $messageElement = $('#chats');
    var $userName = $('<span></span>').text(message.username + ": ").addClass('username');
    $userName.on('click', function(){
      app.addFriend(message.username);
    });
    var $messageText = $('<span></span>').text(message.text);
    var $element = $('<div></div>').append($userName).append($messageText).addClass(message.objectId).addClass('chat');

    $messageElement.prepend($element);
  }
};

app.addRoom = function(roomName){
  var $newRoom = $('<option></option>').val(roomName).text(roomName);
  $('#roomSelect').append($newRoom);
};

app.addFriend = function(username){
  if(!_.contains(app.friends, username)){
    app.friends.push(username);
  }
  console.log(app.friends);
};

app.handleSubmit = function(event){
  event.preventDefault();

  var username = window.location.search;
  console.log(username.indexOf('username='));
  username = username.substr(username.indexOf('username=') + 9);
  if(username.indexOf('&') > -1){
    username = username.substr(0, username.indexOf('&'));
  }
  if(!username) {
    username = 'anonynmous';
  }

  var $form = $(this);
  var messagetext = $form.find( "input[name='message']" ).val(); // colon in front of input????

  var message = {
    username: username,
    text: messagetext,
    roomname: ''
  };

  app.send(message);
  return false;
};

app.displayMessages = function(messages){
  for(var i=0; i<messages.length; i++){
    app.addMessage(messages[i]);
  }
};

// var displayMessages = function(messages) {
//   var $messageElement = $('#messages');

//   for (var i = 0; i < messages.length; i++) {
//     if ($('.' + messages[i].objectId).length === 0) {

//       var $userName = $('<span></span>').text(messages[i].username + ": ").addClass('username');
//       var $messageText = $('<span></span>').text(messages[i].text);
//       var $element = $('<div></div>').append($userName).append($messageText).addClass(messages[i].objectId).addClass('chat');

//       $messageElement.prepend($element);
//     }
//   }
// };

// //setInterval(loadMessages, 5000);
// //loadMessages();

