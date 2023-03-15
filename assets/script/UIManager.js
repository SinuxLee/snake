import { UIType } from './UIType';

cc.Class({
    extends: cc.Component,
    properties: {
        UIList: {
            default: [],
            type: [cc.Node]
        },
        BgMaskSprite: {
            default: null,
            type: cc.Sprite
        },
        camera: cc.Camera
    },

    onEnable: function () {
        this.BgMaskSprite.node.active = false
    },

    getUIScriptName: function (e) {
        return ["UIHall", "UIGame", "UIGameOver", "UILoading", "UIGameEnd", "UIShare", "UIMessageTip", "UIKeFu", "UIInviteFriend", "UIQianDao", "UISkin", "UISetting", "UIZSAd"][e]
    },

    isPopUI: function (e) {
        return e == UIType.UIType_HallInvite ||
            e == UIType.UIType_KeFu ||
            e == UIType.UIType_InviteFriend ||
            e == UIType.UIType_QianDao ||
            e == UIType.UIType_Setting ||
            e == UIType.UIType_RankQQ ||
            e == UIType.UIType_GameOver ||
            e == UIType.UIType_GameEnd
    },

    showMask: function (e) {
        this.BgMaskSprite.node.active = e
    },

    openUI: function (e) {
        if (e == UIType.UIType_Hall && (this.camera.node.x = 0, this.camera.node.y = 0, console.log("back --------------")), e >= this.UIList.length) cc.log("openUI invalid uiType, please check UIList");
        else if (null != this.UIList[e] && void 0 != this.UIList[e]) {
            if (this.UIList[e].active = true, this.isPopUI(e)) {
                this.BgMaskSprite.node.active = true;
                var t = this.UIList[e];
                t.scale = 0, t.runAction(cc.scaleTo(.1, 1).easing(cc.easeSineIn()))
            }
            if (this.isPopUI(e) || e == UIType.UIType_Skin) {
                var i = this.getUI(UIType.UIType_Hall);
                null != i && i.node.active && i.pauseAdShow()
            }
        } else cc.log("openUI invalid uiType, object null")
    },

    closeUI: function (e) {
        if (e >= this.UIList.length) cc.log("closeUI invalid uiType, please check UIList");
        else if (this.isPopUI(e) ? (this.BgMaskSprite.node.active = false, this.UIList[e].active = false) : this.UIList[e].active = false, this.isPopUI(e) || e == UIType.UIType_Skin) {
            var t = this.getUI(UIType.UIType_Hall);
            null != t && t.node.active && t.resumeAdShow()
        }
    },

    onCloseUI: function (e, t) {
        this.UIList[t].active = false
    },

    getUI: function (e) {
        if (!(e >= this.UIList.length)) return this.UIList[e].getComponent(this.getUIScriptName(e));
        cc.log("closeUI invalid uiType, please check UIList")
    },

    showMessage: function (e) {
        var t = this.getUI(UIType.UIType_ShowMessage);
        t && t.showMessage(e)
    },

    RefreshCoin: function () {
        var e = this.getUI(UIType.UIType_Hall);
        e.updateGoldNum(), e.updateDiamondNum()
    }
})