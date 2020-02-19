<template>
  <div class='Message' :class='modifiers'>
    <div class='Message__Author'>
      {{ message.author }}
    </div>
    <div class='Message__Text'>
      {{ message.text }}
    </div>
    <div class='Message__Timestamp'>
      {{ message.timestamp }}
    </div>
  </div>
</template>

<script>
export default {
  props: ['message'],
  data () {
    return {
      modifiers: {
        'Message--Mine': this.message.author === 'me',
        'Message--Error': this.message.author === 'error'
      }
    }
  }
}
</script>

<style scoped>
.Message {
  display: flex;
  flex-direction: column;
  align-self: flex-start;
}

.Message--Mine {
  align-self: flex-end;
}

.Message--Mine .Message__Author {
  align-self: flex-end;
}

.Message--Mine .Message__Timestamp {
  align-self: flex-start;
}

.Message--Mine .Message__Text {
  background-color: #7518a0;
}

.Message--Error .Message__Text {
  background-color: #b7263c;
}

.Message__Author {
  font-weight: 700;
  padding: 5px;
  color: #FFFFFF;
}

.Message__Text {
  color: #FFFFFF;
  background-color: #306696;
  border-radius: 10px;
  padding: 10px 15px;
}

.Message__Timestamp {
  color: grey;
  font-size: 0.5em;
  padding: 4px;
  align-self: flex-end;
}
</style>
