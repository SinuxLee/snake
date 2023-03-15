import { UIType } from './UIType';

cc.Class({
    extends: cc.Component,
    properties: {
        InviteBtn: {
            default: null,
            type: cc.Button
        },
        VideoBtn: {
            default: null,
            type: cc.Button
        },
        CloseBtn: {
            default: null,
            type: cc.Button
        },
        _MatchAd: null,
        _CurVideoAd: null
    },

    start: function () {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onPanelClick, this), this.InviteBtn.node.on(cc.Node.EventType.TOUCH_END, this.onInviteBtn, this), this.CloseBtn.node.on(cc.Node.EventType.TOUCH_END, this.onCloseBtn, this), this.VideoBtn.node.on(cc.Node.EventType.TOUCH_END, this.onVideoBtn, this)
    },

    onDisable: function () {
        this._needUpdate = false, void 0 != window.wx && this._MatchAd && this._MatchAd.hide()
    },

    onPanelClick: function (e) {
        e.stopPropagation()
    },

    onInviteBtn: function (e) {
        e.stopPropagation();
        if (window.wx == null) return

        const mgr = GameGlobal.DataManager;
        wx.shareAppMessage({
            title: mgr.getShareTitle(),
            imageUrl: mgr.getShareImage(),
            success: function (e) {
                console.log("shareAppMessage success"), wx.showToast({
                    title: "分享成功",
                    icon: "success",
                    duration: 1500
                })
            },
            fail: function (e) {
                console.log("shareAppMessage fail")
            }
        })
    },

    onVideoBtn: function () {
        if (this._CurVideoAd == null) return
        
        this._CurVideoAd.onLoad(() =>{
            console.log("激励视频 广告加载成功")
        })
        
        this._CurVideoAd.show().catch((t) =>{
            this._CurVideoAd.load().then(() =>{
                return this._CurVideoAd.show()
            })
        })
        
        this._CurVideoAd.onClose((e) =>{
            (e && e.isEnded || void 0 === e) && wx.showToast({
                title: "+ 10",
                icon: "success",
                duration: 1500
            })
        })
    },

    onCloseBtn: function (e) {
        e.stopPropagation()
        GameGlobal.UIManager.closeUI(UIType.UIType_HallInvite)
    }
})