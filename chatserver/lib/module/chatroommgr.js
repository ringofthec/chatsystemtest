/*
    聊天室管理器
    管理全部聊天室
*/
var chatroom = require("./chatroom");

var all_chat_room = {};

// 玩家加入指定id的聊天室，如果没有就先创建再加入
function join_room(room_id, con) {
    var room = all_chat_room[room_id];
    if (room == null) {
        room = new chatroom.ChatRoom(room_id);
        all_chat_room[room_id] = room;
    }

    if (!room.can_join(con.get_user_name())) {
        return null;
    }

    room.add_member(con);
    return room;
}

// 玩家离开指定聊天室
function leave_room(con) {
    var room = all_chat_room[con.get_room_id()];
    if (room == null) {
        return null;
    }

    room.del_member(con);
    return room;
}

function get_room(room_id) {
    var room = all_chat_room[room_id];
    if (room == null) {
        console.warn("get_room is null");
        return null;
    }

    return room;
}

module.exports.join_room = join_room;
module.exports.leave_room = leave_room;
module.exports.get_room = get_room;