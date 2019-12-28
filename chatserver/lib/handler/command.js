var chatroommgr = require("../module/chatroommgr");
var connectmgr = require("../module/connectmgr");

function setup_event(con) {
    con.set_callback("command", on_command);
}

var command_list = {}
command_list["/popular"] = function(con) {
    console.log("command popular");
    var room = chatroommgr.get_room(con.get_room_id());
    if (room == null) {
        return ;
    }

    var maxw = room.get_popular_word();
    con.send_msg( {proid:"chat.toroom", chatmsg:maxw, srcplayer:"System"} );
}
command_list["/stats"] = function(con, data) {
    var funcpart = data.split(" ");
    if (funcpart[1] == null) {
        con.send_msg( {proid:"chat.toroom", chatmsg:"stats command need args playername", srcplayer:"System"} );
        return ;
    }

    var descon = connectmgr.get_connection_by_name(funcpart[1]);
    if (descon != null) {
        var onlinetime = descon.get_user_name() + " online time : " + descon.get_online_time();
        con.send_msg( {proid:"chat.toroom", chatmsg:onlinetime, srcplayer:"System"} );
    } else {
        con.send_msg( {proid:"chat.toroom", chatmsg:funcpart[1] + " not exist", srcplayer:"System"} );
    }
}

function on_command(con, data) {
    var funcpart = data.command.split(" ");
    var funcname = funcpart[0];

    var func = command_list[funcname];
    if (func == null) {
        console.warn("not supprot commmand %s", funcname);
        con.send_msg( {proid:"chat.toroom", chatmsg:funcname + " command not support", srcplayer:"System"} );
        return ;
    }

    func(con, data.command);
}

module.exports.setup_event = setup_event;