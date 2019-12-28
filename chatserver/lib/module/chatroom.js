/*
    聊天室
    每个聊天室一个聊天室对象
    一个玩家同一时间只能加入一个聊天室
*/

var connectmgr = require("./connectmgr");

var ChatRoom = function(rid) {
    this.room_id = rid;
    this.members = {};
    this.history_chat = [];
    this.popular = [];
    
    this.can_join = function(username) {
        if (this.members[username] != null) {
            delete this.members[username];
        }
        
        return true;
    }

    // 玩家加入聊天室
    this.add_member = function(con) {
        con.change_to_chating(this.room_id);
        this.members[ con.get_user_name() ] = 1;
    }

    // 玩家离开聊天室
    this.del_member = function(con) {
        con.change_to_logined();
        delete this.members[ con.get_user_name() ];
    }

    // 聊天室广播
    this.broadcast = function(msg_obj) {
        for (var uname in this.members) {
            connectmgr.send_to_player(uname, msg_obj);
        }
    }

    // 聊天室广播（指定除外）
    this.broadcast_except = function(except, msg_obj) {
        for (var uname in this.members) {
            if (uname != except) {
                connectmgr.send_to_player(uname, msg_obj);
            }
        }
    }

    this.send_player = function(player_name, msg_obj) {
        if (this.members[ player_name ] == null) {
            console.warn("room send player %s not in room", player_name);
            return ;
        }

        connectmgr.send_to_player(player_name, msg_obj);
    }

    this.send_cache_msg = function(con) {
        for (var i in this.history_chat) {
            con.send_msg(this.history_chat[i]);
        }
    }

    // 记录聊天历史，统计高频词汇
    this.add_chat_record = function(msg) {
        if (this.history_chat.length >= 50) {
            this.history_chat.shift();
        }
        this.history_chat.push(msg);

        var cur_second = Math.floor(Date.now() / 1000);
        var cur_word_map = this.popular[cur_second]
        if (cur_word_map == null) {
            this.popular[cur_second] = {};
            cur_word_map = this.popular[cur_second];
        }
        
        var allword = msg.chatmsg.split(/ |,|"|'|\n|\t/);
        for (var idx in allword) {
            var w = allword[idx];
            if (w.length > 0) {
                if (cur_word_map[w] == null) {
                    cur_word_map[w] = 0;
                }
                cur_word_map[w] = cur_word_map[w] + 1;
            } 
        }

        console.log(this.popular);
    }

    // 计算高频词汇
    this.get_popular_word = function() {
        var temp_map = {};
        var max_w = "";
        var max_c = 0;

        var cur_second = Math.floor(Date.now() / 1000);
        for (var i = 0; i < 5; ++i) {
            var cur_word_map = this.popular[cur_second - i];
            if (cur_word_map != null) {
                for (var k in cur_word_map) {
                    var word_c = temp_map[k];
                    if (word_c == null) {
                        word_c = 0;
                    }

                    temp_map[k] = word_c + cur_word_map[k];
                    if (temp_map[k] > max_c) {
                        max_c = temp_map[k];
                        max_w = k;
                    }
                }
            }
        }

        return max_w;
    }
}

module.exports.ChatRoom = ChatRoom;