var ws = require("ws");
var sendutil = require("./lib/util/util");
var loginmodule = require("./lib/handler/login");
var connectmgr = require("./lib/module/connectmgr");

var socket_id_gen = 1;
var server = new ws.Server({host:"127.0.0.1", port:9091});
server.on("connection", function(conn) {
    conn.socket_id = socket_id_gen++;
    console.log("new sock %d connect", conn.socket_id);
    
    conn.on("message", function (str) {
        console.log("收到的协议为: %s", str);
        var jsonobj = sendutil.unserialize(str);
        if (jsonobj.proid == "login") {
            loginmodule.on_login(conn, jsonobj)
        } else {
            var cn = connectmgr.get_connection_by_id(conn.socket_id);
            if (cn != null) {
                conn.emit("process_msg", cn, jsonobj);
            }
        }
    });

    conn.on("close", function (code, reason) {
        console.log("sock close " + conn.socket_id)
        connectmgr.offline(conn.socket_id);
    });

    conn.on("error", function (code, reason) {
        console.log("sock error " + conn.socket_id)
    });
});