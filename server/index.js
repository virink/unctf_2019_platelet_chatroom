const Koa = require('koa');
const route = require('koa-route');
const Static = require('koa-static');
const websockify = require('koa-websocket')

const app = websockify(new Koa());

app.ws.use(route.all('/secret', (ctx) => {

    ctx.websocket.on('message', (message) => {
        let ret;
        try {
            ret = JSON.parse(message);
        } catch (e) {
            ctx.websocket.send(JSON.stringify({
                "cmd": "error",
                "msg": e
            }));
            return;
        }
        if (ret.cmd == undefined || ret.cmd.length == 0 || ret.msg == undefined || ret.msg.length == 0) {
            ctx.websocket.send(JSON.stringify({
                "cmd": "error",
                "msg": "Data error"
            }));
            return;
        }

        var ip = ctx.request.get("X-Real-IP") || ctx.request.get("X-Forwarded-For") || "unknow";
        console.log(`[*] -> [${ip} - ${ctx.websocket.nickname || "Anonymous"}] : [${ret.cmd}] ${ret.msg.substr(0,100)}`);

        if (ret.cmd != "name" && (!ctx.websocket.nickname || ctx.websocket.nickname.length == 0 || ctx.websocket.nickname == "")) {
            ctx.websocket.send(JSON.stringify({
                "cmd": "error",
                "msg": "Plz set nickname. [/name nickname]"
            }));
        } else if (ret.cmd == "name") {
            var name = ret.msg.substr(0, 12);
            var b = 1;
            app.ws.server.clients.forEach((client) => {
                if (client.nickname == name) {
                    ctx.websocket.send(JSON.stringify({
                        "cmd": "error",
                        "msg": `Nickname [${name}] is exists!`
                    }));
                    b = 0;
                }
            });
            if (b) {
                var t = "";
                if (ctx.websocket.nickname == "") {
                    t = `User ${name} joined`;
                } else {
                    t = `User ${ctx.websocket.nickname} change to ${name}`;
                }
                ctx.websocket.nickname = name;
                ctx.websocket.send(JSON.stringify({
                    "cmd": "name",
                    "msg": name
                }));
                app.ws.server.clients.forEach((client) => {
                    if (client != ctx.websocket && client.readyState === 1) {
                        client.send(JSON.stringify({
                            "cmd": "join",
                            "msg": t
                        }));
                    }
                });
            }
        } else {
            app.ws.server.clients.forEach((client) => {
                if (client.readyState === 1) {
                    client.send(JSON.stringify({
                        "cmd": "chat",
                        "msg": ret.msg,
                        "name": ctx.websocket.nickname
                    }));
                }
            });
        }
    })
}));


app.use(Static(__dirname + '/public', {
    'maxage': 3600000
}));

app.listen(3000);