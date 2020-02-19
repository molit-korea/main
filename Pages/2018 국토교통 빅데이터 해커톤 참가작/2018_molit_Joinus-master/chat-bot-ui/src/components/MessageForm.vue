<template>
  <form class='MessageForm' v-on:submit.prevent='onSubmit2'>
    <input v-model='text'  class='MessageForm__Text' placeholder='Type a message...'>
    <button class='MessageForm__Send'>&#10003;</button>
  </form>
</template>

<script>
import axios from 'axios'
import apiai from 'apiai'

export default {
  data () {
    return {
      text: '',
      client: '',
      app: '',
    }
  },
  methods: {
    getRes: function(query) {
      var request = this.app.textRequest(query, {
        sessionId: '18'
      });
      const responseFromAPI = new Promise(
        function (resolve, reject) {
          request.on('error', function(error) {
            reject(error);
          });
          request.on('response', function(response) {
            console.dir(response);
            // for(var i=0; response.result.fulfillment[message].length ; i++) {
            //     console.log(response.result.fulfillment[message][i]);
            // }
            response.result.fulfillment.messages.forEach(function(v, i) {
              console.log("Message : ");
              console.dir(v);
            })

            response.header("Access-Control-Allow-Origin", "*");
            response.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
            response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            resolve(response.result.fulfillment.speech);
          });
        });
      request.end();
      return responseFromAPI;
    },
    initClient() {
      // this.client = new ApiAiClient({accessToken: 'a31af13aa824484c81bdbaacfda763e5'});
    },
    onSubmit2() {
      var self = this;
      if (this.text.length === 0) {
        return
      }

      this.$emit('messageSent', {
        author: 'me',
        text: this.text,
        timestamp: new Date().toLocaleString()
      })

      this.$http
        .get("http://localhost:3000/pb", {
          params: {
            txt: this.text
          }
        })
        .then(function(res) {
          console.log(res);
          self.$emit('messageSent', {
            author: 'bot',
            text: res.data,
            timestamp: new Date().toLocaleString()
          });

          this.text = '';
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    onSubmit () {
      if (this.text.length === 0) {
        return
      }

      this.$emit('messageSent', {
        author: 'me',
        text: this.text,
        timestamp: new Date().toLocaleString()
      })

      axios.post(process.env.API_URL + '/dialogflowFirebaseFulfillment', { question: this.text }).then((resp) => {
        this.$emit('messageSent', {
          author: 'bot',
          text: resp.data.answer,
          timestamp: new Date().toLocaleString()
        })
      }).catch(err => {
        const message = err.response ? `${err.response.status} ${err.response.data}` : err.message
        this.$emit('messageSent', {
          author: 'error',
          text: message,
          timestamp: new Date().toLocaleString()
        })
      })

      this.text = ''
    }
  },
  created () {
    this.app = apiai('a31af13aa824484c81bdbaacfda763e5');
  },
};
</script>

<style scoped>
.MessageForm {
  align-self: flex-end;
  padding: 10px;
}

.MessageForm__Text {
  border-radius: 10px;
  height: 1.5em;
  border: 1px solid black;
  padding: 5px 10px;
  font-size: 1em;
}

.MessageForm__Text:focus {
  outline: none;
}

.MessageForm__Text::-webkit-input-placeholder {
  font-weight: 100;
}

.MessageForm__Send {
  outline: none;
  border: 0px;
  color: #FFFFFF;
  background-color: #7518a0;
  font-size: 1.5em;
  border-radius: 10px;
  padding: 5px 10px;
}

.MessageForm__Send:active {
  background-color: #306696;
}
</style>
