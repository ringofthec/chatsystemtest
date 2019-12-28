
function string_is_null_or_empty(obj){
    if (typeof(obj) != "string") {
        return false;
    }

    if (typeof obj == "undefined" || 
        obj == null || 
        obj == "") {
        return true;
    } else {
        return false;
    }
}


function serialize(msg_obj) {
    return JSON.stringify(msg_obj);
}

function unserialize(org_msg) {
    try {
        return JSON.parse(org_msg);
    } catch (err) {
        console.error("unserialize error : %s, org msg : %s", error, org_msg);
    }
    return null;
}

module.exports.string_is_null_or_empty = string_is_null_or_empty;
module.exports.serialize = serialize;
module.exports.unserialize = unserialize;

