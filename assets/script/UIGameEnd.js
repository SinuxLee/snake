import { UIType } from './UIType';

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

        const gameUI = GameGlobal.UIManager.getUI(UIType.UIType_Game);
        this.RewardGoldLabel.string = ""
        this.LenLabel.string = "" + gameUI.getMySnakeLen()
        this.KillLabel.string = "" + gameUI.getMySnakeKill()
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
        const mgr = GameGlobal.UIManager;
        mgr.closeUI(UIType.UIType_GameEnd)
        mgr.closeUI(UIType.UIType_Game)
        mgr.openUI(UIType.UIType_Hall)
        window.wx && wx.triggerGC()
    },

    onAgain: function (e) {
        e && e.stopPropagation();
        const mgr = GameGlobal.UIManager;
        mgr.closeUI(UIType.UIType_GameEnd)
        mgr.getUI(UIType.UIType_Game).resetGameEnd()
    },

    onShareBtn: function () {
        GameGlobal.WeiXinPlatform.showShare()
    }
})