var connectmgr = require("../module/connectmgr");

function setup_event(con) {
    con.set_callback("logout",  on_logout);
}

function on_login(sock, data) {
    var con = connectmgr.add_conntion(sock, data);
    if (con == null) {
        return ;
    }

    con.change_to_logined();
    con.send_msg({proid:"login", code:0});
    console.log("[login] %s login success", data.username);
}

function on_logout(con) {
    connectmgr.del_conntion(con.get_user_name());
    console.log("[login] %s logout success", username);
}

module.exports.setup_event = setup_event;
module.exports.on_login = on_login;
