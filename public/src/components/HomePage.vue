<template>
  <div>
    <div class="col-md-2 userlist">
      <div class="panel-heading">
        <span class="glyphicon glyphicon-user"></span> Online ({{connectedUsers.length}})
      </div>
      <ul>
        <li v-for="user in connectedUsers">
          {{user}}&nbsp; <span class="glyphicon glyphicon-pencil" v-if="userIsTyping(user)"></span>
        </li>
      </ul>
    </div>

    <div class="col-md-10">
      <div id="livechat-container">
        <div class="panel panel-primary">
          <div class="panel-heading">
            <span class="glyphicon glyphicon-comment"></span>&nbsp;Lets Chat
          </div>
          <div class="panel-body">
            <ul class="chat" id="messages">
              <li class="left clearfix" v-for="message in messages">
                <div v-if="message.type === 'info'" class="info">
                  {{ message.msg }}
                </div>
                <div v-if="message.type === 'chat'">
                   <span class="chat-img pull-left">
                     <img src="http://placehold.it/50/55C1E7/fff&text=U" alt="User Avatar" class="img-circle" />
                   </span>
                  <div class="chat-body clearfix">
                    <div class="header">
                      <strong class="primary-font">{{ message.user }}</strong>
                      <small class="pull-right text-muted">
                        <span class="glyphicon glyphicon-time"></span>
                        &nbsp;{{ message.timestamp }}
                      </small>
                    </div>
                    <p>
                      {{ message.text }}
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="panel-footer">
            <form @submit.prevent="send">
              <input
                type="text"
                class="form-control input-lg"
                placeholder="Type message here"
                v-model="message.text"
                @keyup="usersAreTyping"
                @keyup.13="stoppedTyping('13')"
                @keyup.8="stoppedTyping('8')">
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  const socket = io('http://localhost:8080');
  const axios = require('axios');
  const moment = require('moment');
  const { socketEvents } = require('../../../constants');

export default {
  name: 'HomePage',
  created () {
    // When server emits 'user joined', we need to update connectedUsers array
    socket.on(socketEvents.userJoined, function (socketId) {
      // get already connected users first
      axios.get('/onlineusers')
      .then(function (response) {
        for(const key in response.data) {
          if(this.connectedUsers.indexOf(key) === -1) {
            this.connectedUsers.push(key);
          }
        }
      }.bind(this));

      const infoMsg = {
        "type": "info",
        "msg": `User ${socketId} has joined`
      };
      this.messages.push(infoMsg);
    }.bind(this));

    // If server emits 'chat.message' event, we should update messages array.
    socket.on(socketEvents.chatMessage, function(message){
      this.messages.push(message);
    }.bind(this));

    // server emits 'user typing'
    socket.on(socketEvents.userTyping, function(username){
      this.areTyping.push(username);
    }.bind(this));

    // server emits 'stopped typing'
    socket.on(socketEvents.userStoppedTyping, function(username){
      const index = this.areTyping.indexOf(username);
      if(index !== -1) {
        this.areTyping.splice(index,1);
      }
    }.bind(this));

    // when server broadcasts 'user left', we should remove that user from connectedList
    socket.on(socketEvents.userLeft, function (socketId) {
      const index = this.connectedUsers.indexOf(socketId);
      if(index !== -1) {
        this.connectedUsers.splice(index,1);
      }
      const infoMsg = {
        "type": "info",
        "msg": `User ${socketId} has left`
      };
      this.messages.push(infoMsg);
    }.bind(this));
  },
  data () {
    return {
      connectedUsers: [],
      messages: [],
      message: {
        type: "",
        action: "",
        user: "",
        text: "",
        timestamp: ""
      },
      areTyping: []
    }
  },
  methods: {
    send () {
      this.message.type = 'chat';
      this.message.user = socket.id;
      this.message.timestamp = moment().calendar();

      socket.emit(socketEvents.chatMessage, this.message);
      this.resetMessageProperties();

    },
    resetMessageProperties() {
      this.message.type = '';
      this.message.user = '';
      this.message.text = '';
      this.message.timestamp = '';
    },
    userIsTyping (username) {
      return this.areTyping.indexOf(username) !== -1;
    },
    usersAreTyping() {
      if(this.areTyping.indexOf(socket.id) === -1) {
        this.areTyping.push(socket.id);
        socket.emit(socketEvents.userTyping, socket.id);
      }
    },
    stoppedTyping (keycode) {
      if(keycode === '13' || (keycode === '8' && this.message.text === '')) {
        const index = this.areTyping.indexOf(socket.id);
        if (index !== -1) {
          this.areTyping.splice(index, 1);
          socket.emit(socketEvents.userStoppedTyping, socket.id);
        }
      }
    }
  }
}
</script>

<style scoped>
  #livechat-container {
    width: 100%;
  }
  .userlist {
    overflow-y: scroll;
    height: 500px;
    border: 1px solid dimgray;
  }
  .info {
    font-size: 12px;
    font-style: italic;
    margin: 10px;
  }

  #chat-input {
    width: 100%;
  }
  .chat {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .chat li {
    margin-bottom: 10px;
    padding-bottom: 5px;
    border-bottom: 1px dotted #B3A9A9;
  }
  .chat li.left .chat-body {
    margin-left: 60px;
  }
  .chat li.right .chat-body {
    margin-right: 60px;
  }
  .chat li .chat-body p {
    margin: 0;
    color: #777777;
  }
  .panel-body {
    overflow-y: scroll;
    height: 389px;
  }
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: #F5F5F5;
  }
  ::-webkit-scrollbar {
    width: 10px;
    background-color: #F5F5F5;
  }
  ::-webkit-scrollbar-thumb {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: dimgray;
  }
</style>
