import { UIType } from './UIType';

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
        _needUpdate: true,
        _MatchAd: null
    },

    onEnable: function () {
        this.LoadingProgress.progress = 0
        if (this.GuangSprite && (this.GuangSprite.node.x = this.LoadingProgress.barSprite.node.x), this._needUpdate = true, cc.sys.platform === cc.sys.WECHAT_GAME) {
            if (void 0 != window.wx) {
                null != this._MatchAd && (this._MatchAd.destroy(), this._MatchAd = null), this._MatchAd = wx.createBannerAd({
                    adUnitId: GameGlobal.DataManager.BannerAdid1,
                    style: {
                        left: 0,
                        top: 0,
                        width: 300
                    }
                }), this._MatchAd.show();

                this._MatchAd.onResize((t) => {
                    const info = wx.getSystemInfoSync();
                    this._MatchAd.style.left = info.screenWidth - this._MatchAd.style.realWidth
                    this._MatchAd.style.top = info.screenHeight - this._MatchAd.style.realHeight
                })
            }
        } else if (cc.sys.platform === cc.sys.QQ_PLAY) {
            this._MatchAd = BK.Advertisement.createBannerAd({
                viewId: 1001
            })
            
            this._MatchAd.onError(function (e) {
                e.msg, e.code
            })
            
            this._MatchAd.show()
        }
    },
    onDisable: function () {
        this._needUpdate = false
        cc.sys.platform === cc.sys.WECHAT_GAME ? void 0 != window.wx && this._MatchAd && this._MatchAd.hide() : cc.sys.platform === cc.sys.QQ_PLAY && this._MatchAd && this._MatchAd.destory(), this._MatchAd = null
    },

    update: function (dt) {
        if(this._needUpdate == false) return
        const delta = .25 * dt;
        this.LoadingProgress.progress += delta
        
        if(this.LoadingProgress.progress >= 1) {
            this.LoadingProgress.progress = 1
            this._needUpdate = false
            GameGlobal.UIManager.closeUI(UIType.UIType_GameLoading)
            GameGlobal.UIManager.openUI(UIType.UIType_Game)
        }

        if(this.GuangSprite) {
            const length = this.LoadingProgress.progress * this.LoadingProgress.totalLength
            this.GuangSprite.node.x = this.LoadingProgress.barSprite.node.x + length
        }
    }
})