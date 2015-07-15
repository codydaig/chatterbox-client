// MODELS ---------------------------------------------------------------------------------------------------

var Message = Backbone.Model.extend({
  url: 'https://api.parse.com/1/classes/chatterbox/',
  defaults: {
    username: '',
    text: ''
  }
});

// COLLECTIONS ----------------------------------------------------------------------------------------------

var Messages = Backbone.Collection.extend({
  model: Message,
  url: 'https://api.parse.com/1/classes/chatterbox/',

  loadMsgs: function(){
    this.fetch({data: { order: '-createdAt' }});
  },

  parse: function(response, options){
    var results = [];
    for( var i = response.results.length-1; i >= 0; i-- ){
      results.push(response.results[i]);
    }
    return results;
  }
});

// VIEWS ----------------------------------------------------------------------------------------------------

var FormView = Backbone.View.extend({

  initialize: function(){
    this.collection.on('sync', this.stopSpinner, this);
  },

  events: {
    'submit #send': 'handleSubmit',
    'change #roomSelect': 'handleRoomSelect'
  },

  handleSubmit: function(e){
    e.preventDefault();

    this.startSpinner();

    var $text = this.$el.find('#text');
    this.collection.create({
      username: window.location.search.substr(10),
      text: $text.val()
    });

    $text.val('');
  },

  handleRoomSelect: function(e){
    console.log('change rooms');
    var $room = this.$el.find('#roomSelect').val();
    console.log($room);

    if ($room === "newRoom") {
      var roomName = prompt("Provide a room name.");
      $room = roomName;
      // app.addRoom(roomName);
      // app.showRoom(roomName);
      this.$el.find('#roomSelect').val(roomName);
    } else if($room === "lobby"){
      // app.fetch(app.displayMessages);
    } else {
      // app.showRoom($room);
    }

  },

  startSpinner: function(){
    this.$('.spinner img').show();
    this.$('form input[type=submit]').attr('disabled', "true");
  },

  stopSpinner: function(){
    this.$('.spinner img').fadeOut('fast');
    this.$('form input[type=submit]').attr('disabled', null);
  }

});

var MessageView = Backbone.View.extend({

  template: _.template('<div class="chat" data-id="<%- objectId %>"> \
                       <div class="user"><%- username %></div> \
                       <div class="text"><%- text %></div> \
                       </div>'),

  render: function(){
    //console.log(this.model.attributes);
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }

});

var MessagesView = Backbone.View.extend({

  initialize: function(){
    this.collection.on('sync', this.render, this);
    this.onscreenMessages = {};
  },

  render: function(){
    this.collection.forEach(this.renderMessage, this);
  },

  renderMessage: function(message){
    if( !this.onscreenMessages[message.get('objectId')] ){
      var messageView = new MessageView({model: message});
      this.$el.prepend(messageView.render());
      this.onscreenMessages[message.get('objectId')] = true;
    }
  }

});

