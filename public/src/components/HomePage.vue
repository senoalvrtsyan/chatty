<template>
  <div>
    <div class="col-md-2 userlist">
      <div class="panel-heading">
        <span class="glyphicon glyphicon-user"></span> Online ({{connectedUsers.length}})
      </div>
      <ul>
        <li v-for="user in connectedUsers">
          {{user}}
        </li>
      </ul>
    </div>

    <div class="col-md-10">
      <div id="livechat-container">
        <div class="panel panel-primary">
          <div class="panel-heading">
            <span class="glyphicon glyphicon-comment"></span>
            &nbsp;
            Lets Chat
          </div>
          <div class="panel-body">
            <ul class="chat" id="messages">
              <li class="left clearfix">
                <div class="info">
                  User1 has joined
                </div>
                <div>
                   <span class="chat-img pull-left">
                     <img src="http://placehold.it/50/55C1E7/fff&text=U" alt="User Avatar" class="img-circle" />
                   </span>
                  <div class="chat-body clearfix">
                    <div class="header">
                      <strong class="primary-font">user1</strong>
                      <small class="pull-right text-muted">
                        <span class="glyphicon glyphicon-time"></span>
                        &nbsp;{{ message.timestamp }}
                      </small>
                    </div>
                    <p>
                      hello there
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="panel-footer">
            <form>
              <input type="text" class="form-control input-lg" placeholder="Type message here">
            </form>
          </div>
        </div>
      </div>

    </div>
  </div>

</template>

<script>
export default {
  name: 'HomePage',
  created () {

  },
  data () {
    return {
      connectedUsers: ['User a', 'User b'],
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

    },
    userIsTyping (username) {

    },
    usersAreTyping() {

    },
    stoppedTyping () {

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
