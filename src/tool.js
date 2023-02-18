/**
 * 用于与微信通信通信定义的一系列常量
 */
const HEART_BEAT = 5005;
const RECV_TXT_MSG = 1;
const RECV_PIC_MSG = 3;
const USER_LIST = 5000;
const GET_USER_LIST_SUCCSESS = 5001;
const GET_USER_LIST_FAIL = 5002;
const TXT_MSG = 555;
const PIC_MSG = 500;
const AT_MSG = 550;
const CHATROOM_MEMBER = 5010;
const CHATROOM_MEMBER_NICK = 5020;
const PERSONAL_INFO = 6500;
const DEBUG_SWITCH = 6000;
const PERSONAL_DETAIL = 6550;
const DESTROY_ALL = 9999;
const NEW_FRIEND_REQUEST = 37; //微信好友请求消息
const AGREE_TO_FRIEND_REQUEST = 10000; //同意微信好友请求消息
const ATTATCH_FILE = 5003;
const GH_MESSAGE = 49; // 公众号消息
function getid() {
  const id = Date.now();
  return id.toString();
}

function get_personal_info() {
  const j = {
    id: getid(),
    type: PERSONAL_INFO,
    wxid: 'null',
    roomid: 'null',
    content: 'null',
    nickname: "null",
    ext: 'null'
  };
  return JSON.stringify(j);
}

function get_personal_detail(wxid) {
  const j = {
    id: getid(),
    type: PERSONAL_DETAIL,
    content: 'op:personal detail',
    wxid: wxid
  };
  return JSON.stringify(j);
}

function get_contact_list() {
  const j = {
    id: getid(),
    type: USER_LIST,
    roomid: 'null', //null
    wxid: 'null', //not null
    content: 'null', //not null
    nickname: 'null',
    ext: 'null'
  };
  return JSON.stringify(j);
}

/**
 * 发送文本消息
 * @param wxid 微信id或者群id
 * @param content 发送的内容
 * @returns {string}
 */
function send_txt_msg(wxid, content) {
  //必须按照该json格式，否则服务端会出异常
  const j = {
    id: getid(),
    type: TXT_MSG,
    wxid: wxid, //roomid或wxid,必填
    roomid: 'null', //此处为空
    content: content,
    nickname: "null", //此处为空
    ext: 'null' //此处为空
  };
  return JSON.stringify(j);
}

/**
 * 发送图片消息
 * @param wxid 微信id或者群id
 * @param content 发送的内容
 * @returns {string}
 */
function send_pic_msg(wxid, content) {
  //必须按照该json格式，否则服务端会出异常
  const j = {
    id: getid(),
    type: PIC_MSG,
    wxid: wxid, //roomid或wxid,必填
    roomid: 'null', //此处为空
    content: content,
    nickname: "null", //此处为空
    ext: 'null' //此处为空
  };
  return JSON.stringify(j);
}

/**
 * 发送@的文本消息
 * @param wxid 自己的微信id
 * @param roomid 群聊id
 * @param content 发送的内容
 * @param nickname 要@人的昵称
 * @returns {string}
 */
function send_at_msg(wxid, roomid, content, nickname) {
  const j = {
    id: getid(),
    type: AT_MSG,
    roomid, //not null
    wxid, //not null
    content, //not null
    nickname,
    ext: 'null'
  };
  return JSON.stringify(j);
}

/**
 * 获得群成员的昵称
 * @param s_wxid
 * @param s_roomid
 * @returns {string}
 */
function get_chat_nick_p(s_wxid, s_roomid) {
  const j = {
    id: getid(),
    type: CHATROOM_MEMBER_NICK,
    wxid: s_wxid,
    roomid: s_roomid,
    content: 'null',
    nickname: "null",
    ext: 'null'
  };
  return JSON.stringify(j);
}

function get_chatroom_memberlist() {
  const j = {
    id: getid(),
    type: CHATROOM_MEMBER,
    roomid: 'null', //null
    wxid: 'null', //not null
    content: 'null', //not null
    nickname: 'null',
    ext: 'null'
  };
  return JSON.stringify(j);
}

module.exports = {
  HEART_BEAT,
  RECV_TXT_MSG,
  RECV_PIC_MSG,
  USER_LIST,
  GET_USER_LIST_SUCCSESS,
  GET_USER_LIST_FAIL,
  TXT_MSG,
  PIC_MSG,
  AT_MSG,
  CHATROOM_MEMBER,
  CHATROOM_MEMBER_NICK,
  PERSONAL_INFO,
  DEBUG_SWITCH,
  PERSONAL_DETAIL,
  DESTROY_ALL,
  NEW_FRIEND_REQUEST,
  AGREE_TO_FRIEND_REQUEST,
  ATTATCH_FILE,
  GH_MESSAGE,
  get_personal_info,
  get_personal_detail,
  get_contact_list,
  send_txt_msg,
  send_pic_msg,
  send_at_msg,
  get_chat_nick_p,
  get_chatroom_memberlist,
};