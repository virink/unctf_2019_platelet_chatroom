<template lang="pug">
    div.chatbox(:id="chatBoxID" :style="{width: `${width}px`}")
      div.chatlist(id="chatlist" ref="chatlist" :style="{height: `${screenHeight-70}px`}")
        li( v-for="item in msgArray")
          span {{item.nickname}}: 
          span {{item.msg}}
      input.chatinput(id="msgInput" :style="{width:`${width-22}px`}" v-model="msg" @keyup.enter="onSubmit" @keyup.up="onUp" placeholder="Input Message then Enter")/
</template>

<script>
import uuid from "uuid";

export default {
  name: "chatbox",
  data: () => ({
    screenHeight: document.documentElement.clientHeight,
    msg: "",
    lastMsg:"",
    msgArray: []
  }),
  props: {
    chatBoxID: {
      type: String,
      default: uuid()
    },
    nickname: {
      type: String,
      default: "Anonymous"
    },
    width: {
      type: Number,
      default: 450
    }
  },
  mounted() {
    const that = this;
    window.onresize = () => {
      return (() => {
        window.screenHeight = document.documentElement.clientHeight;
        that.screenHeight = window.screenHeight;
        var cl = this.$refs.chatlist;
        cl.scrollTop = cl.scrollHeight;
      })();
    };
  },
  watch: {
    screenHeight(val) {
      if (!this.timer) {
        this.screenHeight = val;
        this.timer = true;
        let that = this;
        setTimeout(() => {
          that.timer = false;
        }, 400);
      }
    }
  },
  methods: {
    onSubmit() {
      this.$emit("pushMessage", this.msg);
      this.lastMsg = this.msg;
      this.msg = "";
    },
    onUp() {
      this.msg = this.lastMsg;
    },
    pushMessage(msg, user = "") {
      if (this.msgArray.length > 1024) this.msgArray.shift();
      this.msgArray.push({
        msg: msg,
        nickname: user.length > 0 ? user : this.nickname
      });
      setTimeout(() => {
        var cl = this.$refs.chatlist;
        cl.scrollTop = cl.scrollHeight;
      }, 0);
    },
    clearMessage() {
      this.msgArray = [];
    }
  }
};
</script>

<style lang="stylus" scoped>
html, body {
  height: 100%;
}

.chatbox {
  z-index: 1;
  position: fixed;
  left: 0;
  top: 0;
  background-color: #F5F5F5;
}

.chatlist {
  padding: 10px 5px;
  overflow: scroll;
  overflow-x: hidden;
  overflow-y: auto;
}

.chatlist li {
  list-style: none;
}

.chatbox input {
  position: fixed;
  bottom: 0;
  outline-style: none;
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 10px;
  font-size: 24px;
}
</style>


