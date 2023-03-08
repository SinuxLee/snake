var n = require('UIType'),
    r = require('UIInviteFriendItem');
require('DataManager').FriendInviteData;
cc.Class({
    extends: cc.Component,
    properties: {
        CloseBtn: {
            default: null,
            type: cc.Button
        },
        InviteBtn: {
            default: null,
            type: cc.Button
        },
        FriendCtrlArray: [r]
    },
    onLoad: function() {
        for (var e = 0; e < 5; ++e) this.FriendCtrlArray[e].initIndex(e)
    },
    onEnable: function() {
        for (var e = 0; e < 5; ++e) this.FriendCtrlArray[e].resetShow();
        GameGlobal.Net.requestFriendList()
    },
    onDisable: function() {},
    start: function() {
        this.InviteBtn.node.on(cc.Node.EventType.TOUCH_END, this.onFriendInvite, this), this.CloseBtn.node.on(cc.Node.EventType.TOUCH_END, this.onClose, this), this.node.on(cc.Node.EventType.TOUCH_END, this.onBlock, this)
    },
    refreshList: function() {
        for (var e = 0; e < 5; ++e) this.FriendCtrlArray[e].refreshUI()
    },
    onFriendInvite: function(e) {
        e.stopPropagation();
        var t = GameGlobal.WeiXinPlatform;
        if (void 0 != t._WXOpenID && 0 != t._WXOpenID.length) {
            t._WXOpenID, GameGlobal.DataManager;
            GameGlobal.WeiXinPlatform.showShare(function() {}, function() {})
        } else console.log("onFriendInvite invalid openID")
    },
    onClose: function(e) {
        e.stopPropagation(), GameGlobal.UIManager.closeUI(n.UIType_InviteFriend)
    },
    onBlock: function(e) {
        e.stopPropagation()
    }
})