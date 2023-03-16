import { UIType } from './UIType';
const UIInviteFriendItem = require('UIInviteFriendItem');
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
        FriendCtrlArray: [UIInviteFriendItem]
    },

    onLoad: function () {
        for (let e = 0; e < 5; ++e) this.FriendCtrlArray[e].initIndex(e)
    },

    onEnable: function () {
        for (let e = 0; e < 5; ++e) this.FriendCtrlArray[e].resetShow();
        GameGlobal.Net.requestFriendList()
    },

    start: function () {
        this.InviteBtn.node.on(cc.Node.EventType.TOUCH_END, this.onFriendInvite, this)
        this.CloseBtn.node.on(cc.Node.EventType.TOUCH_END, this.onClose, this)
        this.node.on(cc.Node.EventType.TOUCH_END, this.onBlock, this)
    },

    refreshList: function () {
        for (let e = 0; e < 5; ++e) this.FriendCtrlArray[e].refreshUI()
    },

    onFriendInvite: function (e) {
        e.stopPropagation();
        const wx = GameGlobal.WeiXinPlatform;
        
        if (void 0 != wx._WXOpenID && 0 != wx._WXOpenID.length) {
            wx._WXOpenID, GameGlobal.DataManager;
            GameGlobal.WeiXinPlatform.showShare(function () { }, function () { })
        }
    },

    onClose: function (e) {
        e.stopPropagation()
        GameGlobal.UIManager.closeUI(UIType.UIType_InviteFriend)
    },

    onBlock: function (e) {
        e.stopPropagation()
    }
})