const { ccclass, property } = cc._decorator;

export enum UIType {
    UIType_Hall = 0,
    UIType_Game = 1,
    UIType_GameOver = 2,
    UIType_GameLoading = 3,
    UIType_GameEnd = 4,
    UIType_HallInvite = 5,
    UIType_ShowMessage = 6,
    UIType_KeFu = 7,
    UIType_InviteFriend = 8,
    UIType_QianDao = 9,      // 签到
    UIType_Skin = 10,
    UIType_Setting = 11,
    UIType_ZSAd = 12,
    UIType_RankQQ = 13
}

@ccclass
export default class UIManager extends cc.Component {
    @property(cc.Camera)
    public camera: cc.Camera = null;

    private static _inst: UIManager = null;
    public static get inst(){
        return this._inst;
    }

    private UIList: cc.Node[] = [];
    private BgMaskSprite: cc.Sprite = null;

    onLoad() {
        UIManager._inst = this;
        
        this.BgMaskSprite = this.node.getChildByName('bgMask').getComponent(cc.Sprite);

        const hall = this.node.getChildByName('UIHall');
        const game = this.node.getChildByName('UIGame');
        const gameOver = this.node.getChildByName('UIGameOver');
        const loading = this.node.getChildByName('UILoading');
        const gameEnd = this.node.getChildByName('UIGameEnd');
        const share = this.node.getChildByName('UIShare');
        const msgTip = this.node.getChildByName('UIMessageTip');
        const kefu = this.node.getChildByName('UIKeFu');
        const invite = this.node.getChildByName('UIInviteFriend');
        const sign = this.node.getChildByName('UIQianDao');
        const skin = this.node.getChildByName('UISkin');
        const setting = this.node.getChildByName('UISetting');
        const ad = this.node.getChildByName('UIZSAd');
        this.UIList = [hall, game, gameOver, loading, gameEnd, share,
            msgTip, kefu, invite, sign, skin, setting, ad];
    }

    onEnable() {
        this.BgMaskSprite.node.active = false
    }

    getUIScriptName(idx: number) {
        return ["UIHall", "UIGame", "UIGameOver", "UILoading", "UIGameEnd",
            "UIShare", "UIMessageTip", "UIKeFu", "UIInviteFriend",
            "UIQianDao", "UISkin", "UISetting", "UIZSAd"][idx]
    }

    isPopUI(type: number) {
        return type == UIType.UIType_HallInvite ||
            type == UIType.UIType_KeFu ||
            type == UIType.UIType_InviteFriend ||
            type == UIType.UIType_QianDao ||
            type == UIType.UIType_Setting ||
            type == UIType.UIType_RankQQ ||
            type == UIType.UIType_GameOver ||
            type == UIType.UIType_GameEnd
    }

    showMask(show: boolean) {
        this.BgMaskSprite.node.active = show
    }

    openUI(idx: number) {
        if (idx == UIType.UIType_Hall) this.camera.node.x = this.camera.node.y = 0;
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
    }

    closeUI(idx: number) {
        if (idx >= this.UIList.length) return cc.error("closeUI invalid uiType, please check UIList");

        if (this.isPopUI(idx)) {
            this.BgMaskSprite.node.active = false
            this.UIList[idx].active = false
        } else this.UIList[idx].active = false;

        if (this.isPopUI(idx) || idx == UIType.UIType_Skin) {
            const hallUI = this.getUI(UIType.UIType_Hall);
            hallUI && hallUI.node.active && hallUI.resumeAdShow()
        }
    }

    onCloseUI(e, t) {
        this.UIList[t].active = false
    }

    getUI(idx: number) {
        if (idx >= 0 && idx < this.UIList.length) return this.UIList[idx].getComponent(this.getUIScriptName(idx));
        cc.log("closeUI invalid uiType, please check UIList")
    }

    showMessage(txt: string) {
        const msgBox = this.getUI(UIType.UIType_ShowMessage);
        msgBox && msgBox.showMessage(txt)
    }

    RefreshCoin() {
        const hallUI = this.getUI(UIType.UIType_Hall);
        hallUI.updateGoldNum()
        hallUI.updateDiamondNum()
    }
}
