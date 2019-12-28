var chatroommgr = require("../module/chatroommgr");

var setup_event = function(con) {
    con.set_callback("room.join",  on_room_join);
    con.set_callback("room.leave", on_room_leave);
}

function on_room_join(con, data) {
    var room = chatroommgr.join_room(data.room_id, con)
    if (room == null) {
        return ;
    }

    con.send_msg({proid:"room.join", room_id:data.room_id});
    room.broadcast_except(con.get_user_name(), {proid:"room.otherjoin", player:con.get_user_name()});
    room.send_cache_msg(con);
};

function on_room_leave(con) {
    var room = chatroommgr.leave_room(con);
    if (room == null) {
        return ;
    }
    
    con.send_msg({proid:"room.leave"});
    room.broadcast_except(con.get_user_name(), {proid:"room.otherleave", player:con.get_user_name()});
}

module.exports.setup_event = setup_event;
