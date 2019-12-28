var process = require('process');
var ws = require("ws");

var sock = new ws("ws://127.0.0.1:9091");
var client_stat = "no_login";


sock.on("open", function() {
    process.stdout.write("请输入用户名:");
    process.stdin.on('data',(input)=>{
        var nametext = input.toString().trim();
        
        if (client_stat == "no_login") {
            console.log("正在登陆.....");
            sock.send(JSON.stringify({proid:"login", username:nametext}));
        } else if (client_stat == "logined") {
            console.log("正在进入房间.....");
            sock.send(JSON.stringify({proid:"room.join", room_id:nametext}));
        } else if (client_stat == "gameing") {
            if (nametext == "/help") {
                process.stdout.write("/popular 查看5秒热词\n/stats username 查看username在线时长\n/exit 退出聊天程序\n");
                process.stdout.write("-->");
            } else if (nametext == "/exit") {
                process.exit();
            } else if (nametext.charAt(0) == '/') {
                sock.send(JSON.stringify({proid:"command", command:nametext}));
            } else {
                sock.send(JSON.stringify({proid:"chat.toroom", chatmsg:nametext}));
            }
        }
    });
});

sock.on("close", function() {
    client_stat = "no_login";
    process.stdout.write("断开链接了");
    process.exit();
});

sock.on("error", function() {
    client_stat = "no_login";
    process.stdout.write("断开链接了");
    process.exit();
});


sock.on("message", function (str) {
    //console.log(str);
    var jsonobj = JSON.parse(str);
    if (jsonobj.proid == "login") {
        if (jsonobj.code == 0) {
            client_stat = "logined";
            process.stdout.write("请输入房间ID:");
        } else {
            process.stdout.write(jsonobj.msg);
            process.stdout.write("\n请输入用户名:");
        }
    } else if (jsonobj.proid == "room.join") {
        client_stat = "gameing";
        process.stdout.write("可以开始聊天了\n");
        process.stdout.write("-->");
    } else if (jsonobj.proid == "chat.toroom") {
        process.stdout.write(jsonobj.srcplayer + " : " + jsonobj.chatmsg);
        process.stdout.write("\n-->");
    } else if (jsonobj.proid == "room.otherjoin") {
        process.stdout.write(jsonobj.player + " join room");
        process.stdout.write("\n-->");
    } else if (jsonobj.proid == "room.otherleave") {
        process.stdout.write(jsonobj.player + " leave room");
        process.stdout.write("\n-->");
    }
});

