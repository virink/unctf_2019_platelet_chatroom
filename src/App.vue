<template lang='pug'>
  div#app
    div.live2d-panel(v-bind:style="{left:`${boxWidth}px`}")
      dialogue(:customDialogue="customDialogue" ref='dialogue')
      live2d(:modelPath="modelPath" ref='l2dMange')
    chatbox(:width="boxWidth" :nickname="nickname" v-on:pushMessage="pushMessage($event)" ref='chatbox')
</template>

<script>
import custom from "./custom";
const wsuri = `ws://${window.location.host}/secret`;

export default {
  name: "app",
  data: () => ({
    modelPath: "/model/kesshouban_v2/model.json",
    customDialogue: custom,
    websock: false,
    boxWidth: 550,
    nickname: "Anonymous"
  }),
  created() {
    this.startWebsocket();
  },
  destroyed() {
    this.websock.close();
  },
  mounted() {
    this.$refs.l2dMange.initL2dMange(this.modelPath);
  },
  methods: {
    startWebsocket() {
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = this.websocketOnMessage;
      this.websock.onopen = this.websocketOnOpen;
      this.websock.onerror = this.websocketOnError;
      this.websock.onclose = this.websocketOnClose;
    },
    // eslint-disable-next-line
    websocketOnClose(e) {
      this.kesshoubanMsg("Seeyou na la~");
    },
    websocketOnError() {
      this.kesshoubanMsg("🙁あのね、あのね、トラブルで、工事が遅れてるの～");
    },
    websocketOnOpen() {
      this.kesshoubanMsg("😃UNCTFへようこそ");
    },
    websocketSend(msg, cmd = "chat") {
      this.websock.send(JSON.stringify({ msg: msg, cmd: cmd }));
    },
    kesshoubanMsg(msg) {
      this.$refs.chatbox.pushMessage(msg, "血小板");
      this.$refs.dialogue.showMessage(msg);
    },
    websocketOnMessage(e) {
      var ret;
      try {
        ret = JSON.parse(e.data);
      } catch (e) {
        this.kesshoubanMsg(`🙁JSON Parse Error`);
        return;
      }
      switch (ret.cmd) {
        case "name":
          this.nickname = ret.msg;
          this.kesshoubanMsg(`Change nickname ${this.nickname} success!`);
          break;
        case "error":
          this.kesshoubanMsg(`🙁${ret.msg}`);
          break;
        case "join":
          if (ret.name != this.nickname) this.kesshoubanMsg(`🙁${ret.msg}`);
          break;
        case "chat":
        default:
          this.$refs.chatbox.pushMessage(ret.msg, ret.name);
          break;
      }
    },
    pushMessage(e) {
      if (e.length == 0 || e == undefined) {
        this.kesshoubanMsg("Please input message");
        return;
      }
      e = e.substr(0, 140);
      let cmds = e.split(" ");
      switch (cmds[0]) {
        case "/name":
          if (cmds.length == 1) {
            this.kesshoubanMsg(`Your nickname is ${this.nickname}`);
          } else if (cmds[1] == this.nickname) {
            this.kesshoubanMsg(`You are already ${this.nickname}`);
            return;
          }
          this.websocketSend(cmds[1], "name");
          break;
        case "help":
        case "/help":
          this.kesshoubanMsg(
            `/help - show this message | /name nickname - change your nickname | /clear - clean messages | /more - show more help`
          );
          break;
        case "more":
        case "/more":
          this.kesshoubanMsg(
            "/flag - 小伙子，你骨骼清奇，小旗子给你了！(老司机走开)"
          );
          break;
        case "/calc":
          if (cmds.length > 1) this.websocketSend(cmds[1], "calc");
          break;
        case "/flag":
          this.websocketSend("flag", "flag");
          break;
        case "/leave":
        case "/bye":
          this.websock.close();
          break;
        case "/clear":
        case "/clean":
          this.$refs.chatbox.clearMessage();
          return 0;
        default:
          if (this.nickname.length == 0 || this.nickname === "Anonymous") {
            this.kesshoubanMsg("Please change your nickname; [/name nickname]");
            return;
          }
          this.websocketSend(e);
          break;
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
html, body, #app {
  height: 100%;
  width: 100%;
}

.live2d-panel {
  float: left;
  position: fixed;
  left: 50px;
  bottom: 50px;
  z-index: 9999;
}
</style>
