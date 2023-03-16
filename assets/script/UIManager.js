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
        if (e == UIType.UIType_Hall && (this.camera.node.x = 0, this.camera.node.y = 0), e >= this.UIList.length) return
        else if (null != this.UIList[e] && void 0 != this.UIList[e]) {
            const node = this.UIList[e];
            node.active = true
            if (this.isPopUI(e)) {
                this.BgMaskSprite.node.active = true;
                node.scale = 0
                node.runAction(
                    cc.scaleTo(.1, 1).
                        easing(cc.easeSineIn())
                )
            }

            if (this.isPopUI(e) || e == UIType.UIType_Skin) {
                const hallUI = this.getUI(UIType.UIType_Hall);
                hallUI && hallUI.node.active && hallUI.pauseAdShow()
            }
        }
    },

    closeUI: function (e) {
        if (e >= this.UIList.length) return cc.error("closeUI invalid uiType, please check UIList");

        if (this.isPopUI(e) ? (this.BgMaskSprite.node.active = false, this.UIList[e].active = false) : this.UIList[e].active = false, this.isPopUI(e) || e == UIType.UIType_Skin) {
            const hallUI = this.getUI(UIType.UIType_Hall);
            hallUI && hallUI.node.active && hallUI.resumeAdShow()
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
        const msgBox = this.getUI(UIType.UIType_ShowMessage);
        msgBox && msgBox.showMessage(e)
    },

    RefreshCoin: function () {
        const hallUI = this.getUI(UIType.UIType_Hall);
        hallUI.updateGoldNum()
        hallUI.updateDiamondNum()
    }
})