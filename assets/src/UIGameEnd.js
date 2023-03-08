var n = require('UIType');
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
    onEnable: function() {
        this.BackBtn.node.active = !1, this.AgainBtn.node.active = !1;
        var e = GameGlobal.UIManager.getUI(n.UIType_Game);
        this.RewardGoldLabel.string = "", this.LenLabel.string = "" + e.getMySnakeLen(), this.KillLabel.string = "" + e.getMySnakeKill()
    },
    onDisable: function() {},
    start: function() {
        this.BackBtn.node.on(cc.Node.EventType.TOUCH_END, this.onBack, this), this.AgainBtn.node.on(cc.Node.EventType.TOUCH_END, this.onAgain, this), this.ShareBtn.node.on(cc.Node.EventType.TOUCH_END, this.onShareBtn, this), this.CloseBtn.node.on(cc.Node.EventType.TOUCH_END, this.onBack, this)
    },
    refreshRewardGold: function(e) {
        this.RewardGoldLabel && (this.RewardGoldLabel.string = e)
    },
    onBack: function(e) {
        e && e.stopPropagation();
        var t = GameGlobal.UIManager;
        t.closeUI(n.UIType_GameEnd), t.closeUI(n.UIType_Game), t.openUI(n.UIType_Hall), void 0 != window.wx && wx.triggerGC()
    },
    onAgain: function(e) {
        e && e.stopPropagation();
        var t = GameGlobal.UIManager;
        t.closeUI(n.UIType_GameEnd), t.getUI(n.UIType_Game).resetGameEnd(), window.wx
    },
    onShareBtn: function(e) {
        GameGlobal.DataManager;
        GameGlobal.WeiXinPlatform.showShare()
    }
})