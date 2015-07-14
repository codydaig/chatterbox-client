// YOUR CODE HERE:
var app = {};

app.server = 'https://api.parse.com/1/classes/chatterbox';
app.friends = [];
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
  //console.log(app.friends);
};

app.handleSubmit = function(event){
  event.preventDefault();

  var username = window.location.search;
  //console.log(username.indexOf('username='));
  username = username.substr(username.indexOf('username=') + 9);
  if(username.indexOf('&') > -1){
    username = username.substr(0, username.indexOf('&'));
  }
  if(!username) {
    username = 'anonynmous';
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
    //console.log(messages[i].roomname + " : " + app.currentRoom);
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










