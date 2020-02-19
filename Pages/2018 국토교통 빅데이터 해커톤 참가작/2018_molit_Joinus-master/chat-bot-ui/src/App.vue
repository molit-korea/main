<template>
  <div id='app'>
    <div class='MessageList'>
      <Message v-for='message in messages' :message='message'/>
      <MessageForm @messageSent='onMessageSent'/>
    </div>
  </div>
</template>

<script>
import Message from './components/Message'
import MessageForm from './components/MessageForm'

export default {
  components: { Message, MessageForm },
  data () {
    return {
      messages: [{
        author: 'bot',
        text: 'Hello, I\'m Medyc! Please type the something to make your data.',
        timestamp: new Date().toLocaleString()
      }]
    }
  },
  methods: {
    onMessageSent (message) {
      this.messages.push(message)
    }
  },
  updated () {
    this.$el.querySelector('form').scrollIntoView()
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Lato:100,300,700');

* {
  margin: 0px;
  padding: 0px;
}

#app {
  font-family: 'Lato', sans-serif;
  font-weight: 300;
  background-color: #1E1E1E;
  min-height: 100vh;
  height: 600px;
}

.MessageList {
  width: 450px;
  display: flex;
  overflow: scroll;
  flex-direction: column;
  background-color: #252526;
  padding: 10px;
  margin: 0px auto;
  min-height: 100vh;
}
</style>
