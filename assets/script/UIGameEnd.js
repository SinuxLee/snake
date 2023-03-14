const UIType = require('UIType');

cc.Class({
    extends: cc.Component,
    properties: {
        BackBtn: {
            default: null,
            type: cc.Button
        },
        AgainBtn: {
            default: null,
            type: cc.Button
        },
        ShareBtn: {
            default: null,
            type: cc.Button
        },
        CloseBtn: {
            default: null,
            type: cc.Button
        },
        LenLabel: {
            default: null,
            type: cc.Label
        },
        KillLabel: {
            default: null,
            type: cc.Label
        },
        RewardGoldLabel: {
            default: null,
            type: cc.Label
        }
    },

    onEnable: function () {
        this.BackBtn.node.active = false
        this.AgainBtn.node.active = false;

        var e = GameGlobal.UIManager.getUI(UIType.UIType_Game);
        this.RewardGoldLabel.string = ""
        this.LenLabel.string = "" + e.getMySnakeLen()
        this.KillLabel.string = "" + e.getMySnakeKill()
    },

    start: function () {
        this.BackBtn.node.on(cc.Node.EventType.TOUCH_END, this.onBack, this)
        this.AgainBtn.node.on(cc.Node.EventType.TOUCH_END, this.onAgain, this)
        this.ShareBtn.node.on(cc.Node.EventType.TOUCH_END, this.onShareBtn, this)
        this.CloseBtn.node.on(cc.Node.EventType.TOUCH_END, this.onBack, this)
    },

    refreshRewardGold: function (e) {
        this.RewardGoldLabel && (this.RewardGoldLabel.string = e)
    },

    onBack: function (e) {
        e && e.stopPropagation();
        var t = GameGlobal.UIManager;
        t.closeUI(UIType.UIType_GameEnd)
        t.closeUI(UIType.UIType_Game)
        t.openUI(UIType.UIType_Hall)
        window.wx && wx.triggerGC()
    },

    onAgain: function (e) {
        e && e.stopPropagation();
        var t = GameGlobal.UIManager;
        t.closeUI(UIType.UIType_GameEnd)
        t.getUI(UIType.UIType_Game).resetGameEnd()
    },

    onShareBtn: function (e) {
        GameGlobal.DataManager;
        GameGlobal.WeiXinPlatform.showShare()
    }
})