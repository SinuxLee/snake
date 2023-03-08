var n = require('UIType');
cc.Class({
    extends: cc.Component,
    properties: {
        LoadingProgress: {
            default: null,
            type: cc.ProgressBar
        },
        GuangSprite: {
            default: null,
            type: cc.Sprite
        },
        _needUpdate: !0,
        _MatchAd: null
    },
    onEnable: function() {
        if (cc.log("UILoading onEnable enter--------------------------------------"), this.LoadingProgress.progress = 0, this.GuangSprite && (this.GuangSprite.node.x = this.LoadingProgress.barSprite.node.x), this._needUpdate = !0, cc.sys.platform === cc.sys.WECHAT_GAME) {
            if (void 0 != window.wx) {
                null != this._MatchAd && (this._MatchAd.destroy(), this._MatchAd = null), this._MatchAd = wx.createBannerAd({
                    adUnitId: GameGlobal.DataManager.BannerAdid1,
                    style: {
                        left: 0,
                        top: 0,
                        width: 300
                    }
                }), this._MatchAd.show();
                var e = this;
                this._MatchAd.onResize(function(t) {
                    console.log(t.width, t.height), console.log(e._MatchAd.style.realWidth, e._MatchAd.style.realHeight);
                    var i = wx.getSystemInfoSync();
                    e._MatchAd.style.left = i.screenWidth - e._MatchAd.style.realWidth, e._MatchAd.style.top = i.screenHeight - e._MatchAd.style.realHeight
                })
            }
        } else if (cc.sys.platform === cc.sys.QQ_PLAY) {
            e = this;
            this._MatchAd = null, this._MatchAd = BK.Advertisement.createBannerAd({
                viewId: 1001
            }), this._MatchAd.onError(function(e) {
                e.msg, e.code
            }), this._MatchAd.show()
        }
        cc.log("UILoading onEnable leave--------------------------------------")
    },
    onDisable: function() {
        this._needUpdate = !1, cc.sys.platform === cc.sys.WECHAT_GAME ? void 0 != window.wx && this._MatchAd && this._MatchAd.hide() : cc.sys.platform === cc.sys.QQ_PLAY && this._MatchAd && this._MatchAd.destory(), this._MatchAd = null
    },
    start: function() {},
    update: function(e) {
        if (0 != this._needUpdate) {
            var t = .25 * e;
            this.LoadingProgress.progress = this.LoadingProgress.progress + t, this.LoadingProgress.progress >= 1 && (this.LoadingProgress.progress = 1, this._needUpdate = !1, GameGlobal.UIManager.closeUI(n.UIType_GameLoading), GameGlobal.UIManager.openUI(n.UIType_Game)), this.GuangSprite && (this.GuangSprite.node.x = this.LoadingProgress.barSprite.node.x + this.LoadingProgress.progress * this.LoadingProgress.totalLength)
        }
    }
})