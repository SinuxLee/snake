cc.Class({
    extends: cc.Component,
    properties: {
        HeadSprite: cc.Sprite,
        GoldSprite: cc.Sprite,
        IndexLabel: cc.Label,
        TakeBtn: cc.Button,
        _Index: 0
    },
    start: function() {
        this.TakeBtn.node.on(cc.Node.EventType.TOUCH_END, this.onFriendTake, this)
    },
    initIndex: function(e) {
        this.IndexLabel.string = "", this._Index = e
    },
    resetShow: function() {
        this.TakeBtn.interactable = !1, this.GoldSprite.node.active = true, this.HeadSprite.node.active = !1;
        var e = GameGlobal.DataManager;
        this.IndexLabel.string = e._ShareReward * Math.pow(2, this._Index)
    },
    refreshUI: function() {
        var e = GameGlobal.DataManager;
        if (this.IndexLabel.string = e._ShareReward * Math.pow(2, this._Index), !(this._Index >= e._FriendDataList.length)) {
            var t = e._FriendDataList[this._Index];
            this.TakeBtn.interactable = t.IsCanTake, this.IndexLabel.string = t.Reward;
            var i = this;
            t.HeadUrl && 0 != t.HeadUrl.length && cc.loader.load({
                url: t.HeadUrl,
                type: "png"
            }, function(e, t) {
                if (t instanceof cc.Texture2D) {
                    i.GoldSprite.node.active = !1, i.HeadSprite.node.active = true;
                    var n = new cc.SpriteFrame(t);
                    i.HeadSprite.spriteFrame = n
                }
            })
        }
    },
    onFriendTake: function(e) {
        e.stopPropagation();
        e.target;
        cc.log("onFriendTake", this._Index);
        var t = e.target.getComponent(cc.Button);
        if (!t || 0 != t.interactable) {
            var i = GameGlobal.WeiXinPlatform,
                n = GameGlobal.Net,
                r = GameGlobal.DataManager;
            if (!(this._Index >= r._FriendDataList.length)) {
                var a = r._FriendDataList[this._Index];
                n.request("entry/wxapp/InviteReward", {
                    m: n.COMMON_M
                }, {
                    session3rd: i._SessionID,
                    srcOpenID: a.OpenID,
                    reward: a.Reward
                }, function(e, t) {
                    console.log("response InviteReward"), e.diamond && GameGlobal.DataManager.setDiamond(e.diamond), GameGlobal.UIManager.showMessage("领取成功"), GameGlobal.UIManager.RefreshCoin(), GameGlobal.Net.requestFriendList()
                })
            }
        }
    }
})