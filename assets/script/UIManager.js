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

    getUIScriptName: function (idx) {
        return ["UIHall", "UIGame", "UIGameOver", "UILoading", "UIGameEnd",
            "UIShare", "UIMessageTip", "UIKeFu", "UIInviteFriend",
            "UIQianDao", "UISkin", "UISetting", "UIZSAd"][idx]
    },

    isPopUI: function (type) {
        return type == UIType.UIType_HallInvite ||
            type == UIType.UIType_KeFu ||
            type == UIType.UIType_InviteFriend ||
            type == UIType.UIType_QianDao ||
            type == UIType.UIType_Setting ||
            type == UIType.UIType_RankQQ ||
            type == UIType.UIType_GameOver ||
            type == UIType.UIType_GameEnd
    },

    showMask: function (e) {
        this.BgMaskSprite.node.active = e
    },

    openUI: function (idx) {
        if(idx == UIType.UIType_Hall) this.camera.node.x = this.camera.node.y = 0;
        if (idx >= this.UIList.length || this.UIList[idx] == null) return
        
        const node = this.UIList[idx];
        node.active = true
        if (this.isPopUI(idx)) {
            this.BgMaskSprite.node.active = true;
            node.scale = 0
            node.runAction(
                cc.scaleTo(.1, 1).
                    easing(cc.easeSineIn())
            )
        }

        if (this.isPopUI(idx) || idx == UIType.UIType_Skin) {
            const hallUI = this.getUI(UIType.UIType_Hall);
            hallUI && hallUI.node.active && hallUI.pauseAdShow()
        }
    },

    closeUI: function (idx) {
        if (idx >= this.UIList.length) return cc.error("closeUI invalid uiType, please check UIList");

        if(this.isPopUI(idx)) {
            this.BgMaskSprite.node.active = false
            this.UIList[idx].active = false
         } else this.UIList[idx].active = false;

        if (this.isPopUI(idx) || idx == UIType.UIType_Skin) {
            const hallUI = this.getUI(UIType.UIType_Hall);
            hallUI && hallUI.node.active && hallUI.resumeAdShow()
        }
    },

    onCloseUI: function (e, t) {
        this.UIList[t].active = false
    },

    getUI: function (idx) {
        if (idx >= 0 && idx < this.UIList.length) return this.UIList[idx].getComponent(this.getUIScriptName(idx));
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