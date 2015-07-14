
$.ajaxPrefilter(function (settings, _, jqXHR) {
  jqXHR.setRequestHeader("X-Parse-Application-Id", "voLazbq9nXuZuos9hsmprUz7JwM2N0asnPnUcI7r");
  jqXHR.setRequestHeader("X-Parse-REST-API-Key", "QC2F43aSAghM97XidJw8Qiy1NXlpL5LR45rhAVAf");
});

var lastMessage = {};

var takedown = function() {
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    contentType: 'application/JSON',
    success: function (data) {
        handle(data.results);
    },
    error: function (data) {
      //console.error(data);
    }
  });
};

var handle = function(messages) {
  for(var i=0; i<messages.length; i++) {
    if((messages[i].text === lastMessage.text) && (messages[i].username === lastMessage.username) || messages[i].username === 'Traitor on floor 6') {
    //if(messages[i].text === lastMessage.text) {
      $.ajax({
        url: 'https://api.parse.com/1/classes/chatterbox/' + messages[i].objectId,
        type: 'DELETE',
        contentType: 'application/JSON',
        success: function (data) {
          console.log("spammer taken down");
        },
        error: function (data) {
          //console.error(data);
        }
      });
    }
    lastMessage.text = messages[i].text;
    lastMessage.username = messages[i].username;
  }
  takedown();
  //setTimeout(takedown, 100);
};

takedown();
//setInterval(takedown, 1000);