// YOUR CODE HERE:
var app = {};

app.server = 'https://api.parse.com/1/classes/chatterbox';
app.friends = [];
app.rooms = ['newRoom', 'lobby'];
app.currentRoom = 'lobby';

app.init = function(){
  $('#send').on('submit', app.handleSubmit);
  $('#roomSelect').on('change', app.handleRoomSelect);

  setInterval(function(){
    app.fetch(app.displayMessages)
  }, 5000);

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
  //console.log('fetching...');
  $.ajax({
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
  //console.log("I should be cleaning");
};

app.addMessage = function(message){
  if ($('.' + message.objectId).length === 0) {
    var $messageElement = $('#chats');
    var $userName = $('<span></span>').text(message.username + ": ").addClass('username');

    // Initialize event handler for friend requests
    $userName.on('click', function(){
      app.addFriend(message.username);
    });

    // Add room name to dropdown menu if it doesn't already exist, or is undefined/empty
    var roomName = message.roomname;
    if (app.rooms.indexOf(roomName) === -1 && (roomName !== undefined) && roomName !== '') {
      app.addRoom(roomName);
    }

    // Bold text if username is a 'friend'
    if(app.friends.indexOf(message.username) > -1) {
      var $text = $('<strong></strong>').text(message.text);
      var $messageText = $('<span></span>').append($text);
    } else {
      var $messageText = $('<span></span>').text(message.text);
    }
    var $element = $('<div></div>').append($userName).append($messageText).addClass(message.objectId).addClass('chat');
    
    $messageElement.prepend($element);
  }
};

app.addRoom = function(roomName){
  var $newRoom = $('<option></option>').val(roomName).text(roomName);
  $('#roomSelect').append($newRoom);
  app.rooms.push(roomName);
};

app.addFriend = function(username){
  if(!_.contains(app.friends, username)){
    app.friends.push(username);
  }
};

app.handleSubmit = function(event){
  event.preventDefault();

  var username = window.location.search;
  username = username.substr(username.indexOf('username=') + 9);
  if(username.indexOf('&') > -1){
    username = username.substr(0, username.indexOf('&'));
  }
  if(!username) {
    username = 'anonymous';
  }

  var $form = $(this);
  var messagetext = $form.find( "input[name='message']" ).val(); // colon in front of input????

  if($('#roomSelect').val() === "lobby") {
    roomname = '';
  } else {
    roomname = $('#roomSelect').val();
  }

  var message = {
    username: username,
    text: messagetext,
    roomname: roomname
  };

  app.send(message);
  return false;
};

app.displayMessages = function(messages, roomName){
  for(var i=messages.length-1; i>0; i--){
    if (messages[i].roomname === app.currentRoom || app.currentRoom === "lobby") {
      app.addMessage(messages[i]);
    }
  }
};

app.handleRoomSelect = function(){
  var $room = $('#roomSelect').val();

  if ($room === "newRoom") {
    var roomName = prompt("Provide a room name.");
    $room = roomName;
    app.addRoom(roomName);
    app.showRoom(roomName);
    $('#roomSelect').val(roomName);
  } else if($room === "lobby"){
    app.fetch(app.displayMessages);
  }else {
    app.showRoom($room);
  }
  app.currentRoom = $room;
};

app.showRoom = function(roomName) {
  app.clearMessages();
  app.fetch(function(messages){
    app.displayMessages(messages, roomName);
  });
};










