var chatroommgr = require("../module/chatroommgr");
var wordfilter = require("../util/filterword");

function setup_event(con) {
    con.set_callback("chat.toplayer", on_chat_player);
    con.set_callback("chat.toroom",   on_chat_room  );
}

function on_chat_room(con, data) {
    var room = chatroommgr.get_room(con.get_room_id());
    if (room == null) {
        return ;
    }

    var process_msg = wordfilter.scan.replace(data.chatmsg);
    var send_msg = {proid:"chat.toroom", chatmsg:process_msg, srcplayer:con.get_user_name()};
    room.add_chat_record(send_msg);
    room.broadcast(send_msg);
}

function on_chat_player(con, data) {
    var room = chatroommgr.get_room(con.get_room_id());
    if (room == null) {
        return ;
    }

    var process_msg = wordfilter.scan.replace(data.chatmsg);
    room.send_player(con.get_user_name(), 
        {proid:"chat.toplayer", chatmsg:process_msg, srcplayer:con.get_user_name()});
}


module.exports.setup_event = setup_event;