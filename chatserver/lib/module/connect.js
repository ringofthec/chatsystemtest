/*
    玩家链接，对应一个玩家/一个socket，管理一个链接上的协议处理，和维护玩家在服务器的状态
*/
var events   = require('events');
var util     = require("../util/util");
var chatroommgr = require("./chatroommgr");

var loginmodule = require("../handler/login");
var roommodule = require("../handler/room");
var chatmodule = require("../handler/chat");
var commandmodule = require("../handler/command");

function CConntect(socket, data) {
    this._socket   = socket;
    this._username = data.username;
    this._room_id = 0;
    this._status = "wait_login";
    this._event = new events.EventEmitter();
    this._login_time = Math.floor(Date.now() / 1000);
    this.bind_protocol();
}

/*
    所有协议处理绑定
 */
CConntect.prototype.bind_protocol = function() {
    var event_hands = [loginmodule, roommodule, chatmodule, commandmodule];
    for (var h in event_hands) {
        event_hands[h].setup_event(this);
    }
    this._socket.on("process_msg", this.process_msg)
}
CConntect.prototype.set_callback = function(proid, cb) {
    this._event.on(proid, cb);
}

/*
    协议主分发函数
    另外这里实现了链接状态机的判断，更安全
*/
CConntect.prototype.process_msg = function(conn, msg) {
    var proid = msg.proid;
    if (!conn.test_pro_enable(proid)) {
        return ;
    }

    conn._event.emit(proid, conn, msg);  
}

/*
    按 xxd yyh oom ffs 格式返回玩家的在线时长
*/
CConntect.prototype.get_online_time = function() {
    var curtime = Math.floor(Date.now() / 1000);
    var longtime = curtime - this._login_time;
    var dd = Math.floor( longtime / (24 * 3600) );
    var hh = Math.floor( longtime % (24 * 3600) / (3600) );
    var mm = Math.floor( longtime % (3600) / 60 );
    var ss = Math.floor( longtime % (60) );
    if (dd < 10) {
        dd = "0" + dd;
    }
    if (hh < 10) {
        hh = "0" + hh;
    }
    if (mm < 10) {
        mm = "0" + mm;
    }
    if (ss < 10) {
        ss = "0" + ss;
    }

    return dd + "d " + hh + "h " + mm + "m " + ss + "s";
}

CConntect.prototype.get_user_name = function() {
    return this._username;
}
CConntect.prototype.get_room_id = function() {
    return this._room_id;
}
CConntect.prototype.get_sock_id = function() {
    return this._socket.socket_id;
}

CConntect.prototype.send_msg = function(msgobj) {
    if (typeof(obj) != "string") {
        this._socket.send(util.serialize(msgobj));
    } else {
        this._socket.send(msgobj);
    }
}

/*
    玩家离线处理
*/
CConntect.prototype.offline = function() {
    this._event.emit("room.leave", this); 
}


/*
    链接状态机，判定X状态下可以接受的协议
*/
CConntect.prototype.pro_enable = {};
CConntect.prototype.pro_enable["wait_login"] = ["login"];
CConntect.prototype.pro_enable["logined"] = ["room.join"];
CConntect.prototype.pro_enable["chating"] = ["room.leave", "chat.toroom", "chat.toplayer", "command"];

CConntect.prototype.change_to_logined = function() {
    this._room_id = 0;
    this._status = "logined";
}
CConntect.prototype.change_to_chating = function(room_id) {
    this._room_id = room_id;
    this._status = "chating";
}
CConntect.prototype.change_to_wait_login = function() {
    this._status = "wait_login";
}
CConntect.prototype.test_pro_enable = function(proid) {
    var enable_pros = CConntect.prototype.pro_enable[this._status];
    if (enable_pros == null) {
        console.warn("[CConntect] %s status not support any porotocl, pro %s will process", this._status, proid);
        return false;
    }

    for (var idx in enable_pros) {
        if (enable_pros[idx] === proid) {
            return true;
        }
    }

    console.warn("[CConntect] %s status not support porotocl %s", this._status, proid);
    return false;
}

module.exports.CConntect = CConntect;

