/*
    链接管理器
    所有玩家的链接都在这里有一个CConntect对象管理
*/

var ccon = require("./connect");
var util = require("../util/util");

var all_connects = {}

/*
    新的链接加入
 */
function add_conntion(sock, data) {
    var username = data.username;
    if (util.string_is_null_or_empty(username)) {
        console.warn("[ConnectMgr] connect must has username");
        return null;
    }

    if (all_connects[username] != null) {
        sock.send(JSON.stringify({proid:"login", code:1, msg:"该用户已经在聊天了，请切换别的用户名登陆"}));
        return null;
    }

    all_connects[data.username] = new ccon.CConntect(sock, data);
    return all_connects[data.username];
}

/*
    链接删除
 */
function del_conntion(username) {
    var con = all_connects[username];
    if (con == null) {
        console.warn("[ConnectMgr] delconntion error, username : %s", username);
        return ;
    }

    con.offline();
    delete all_connects[username];
}

function get_connection_by_id(sid) {
    for (var name in all_connects) {
        if (all_connects[name].get_sock_id() == sid) {
            return all_connects[name];
        }
    }
    return null;
}

function get_connection_by_name(name) {
    return all_connects[name];
}

/*
    链接离线
 */
function offline(sid) {
    var con = this.get_connection_by_id(sid);
    if (con != null) {
        this.del_conntion(con.get_user_name());
    }
}

function send_to_player(username, msgobj) {
    var con = all_connects[username];
    if (con == null) {
        console.warn("[ConnectMgr] send_to_player error, username : %s", username);
        return ;
    }

    con.send_msg(msgobj);
}

module.exports.offline = offline;
module.exports.add_conntion = add_conntion;
module.exports.del_conntion = del_conntion;
module.exports.send_to_player = send_to_player;
module.exports.get_connection_by_id = get_connection_by_id;
module.exports.get_connection_by_name = get_connection_by_name;
