cc.Class({
    extends: cc.Component,
    properties: {
        HeadSprite: cc.Sprite,
        GoldSprite: cc.Sprite,
        IndexLabel: cc.Label,
        TakeBtn: cc.Button,
        _Index: 0
    },

    start: function () {
        this.TakeBtn.node.on(cc.Node.EventType.TOUCH_END, this.onFriendTake, this)
    },

    initIndex: function (e) {
        this.IndexLabel.string = "", this._Index = e
    },

    resetShow: function () {
        this.TakeBtn.interactable = false
        this.GoldSprite.node.active = true
        this.HeadSprite.node.active = false;
        const mgr = GameGlobal.DataManager;
        this.IndexLabel.string = mgr._ShareReward * Math.pow(2, this._Index)
    },

    refreshUI: function () {
        const mgr = GameGlobal.DataManager;
        this.IndexLabel.string = mgr._ShareReward * Math.pow(2, this._Index)
        if (this._Index >= mgr._FriendDataList.length) return

        const item = mgr._FriendDataList[this._Index];
        this.TakeBtn.interactable = item.IsCanTake
        this.IndexLabel.string = item.Reward;

        if (item.HeadUrl == null && 0 == item.HeadUrl.length) return
        cc.loader.load({ url: item.HeadUrl, type: "png" }, (e, t) => {
            if (t instanceof cc.Texture2D) {
                this.GoldSprite.node.active = false;
                this.HeadSprite.node.active = true;
                this.HeadSprite.spriteFrame = new cc.SpriteFrame(t)
            }
        })
    },

    onFriendTake: function (e) {
        e.stopPropagation();
        const btn = e.target.getComponent(cc.Button);
        if (btn == null || btn.interactable == false) return

        const wx = GameGlobal.WeiXinPlatform;
        const net = GameGlobal.Net;
        const mgr = GameGlobal.DataManager;
        if (this._Index >= mgr._FriendDataList.length) return

        const item = mgr._FriendDataList[this._Index];
        net.request("entry/wxapp/InviteReward", {m: net.COMMON_M}, {
            session3rd: wx._SessionID,
            srcOpenID: item.OpenID,
            reward: item.Reward
        }, (e, t) => {
            e.diamond && GameGlobal.DataManager.setDiamond(e.diamond)
            GameGlobal.UIManager.showMessage("领取成功")
            GameGlobal.UIManager.RefreshCoin()
            GameGlobal.Net.requestFriendList()
        })
    }
})