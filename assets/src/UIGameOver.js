var n = require('UIType');
cc.Class({
    extends: cc.Component,
    properties: {
        TimerLabel: {
            default: null,
            type: cc.Label
        },
        ReliveBtn: {
            default: null,
            type: cc.Button
        },
        BackBtn: {
            default: null,
            type: cc.Button
        },
        AgainBtn: {
            default: null,
            type: cc.Button
        },
        VideoReliveBtn: {
            default: null,
            type: cc.Button
        },
        CloseBtn: {
            default: null,
            type: cc.Button
        },
        _CurTimeCount: 10,
        _CurVideoAd: null,
        _IsPause: false,
        _ShareCount: 0,
        _QQAd: null
    },

    start: function() {
        this.ReliveBtn.node.on(cc.Node.EventType.TOUCH_END, this.onShareRelieve, this)
        this.VideoReliveBtn.node.on(cc.Node.EventType.TOUCH_END, this.onVideoRelive, this)
        this.BackBtn.node.on(cc.Node.EventType.TOUCH_END, this.onBack, this)
        this.AgainBtn.node.on(cc.Node.EventType.TOUCH_END, this.onAgain, this)
        this.CloseBtn.node.on(cc.Node.EventType.TOUCH_END, this.onBack, this)
    },

    onEnable: function() {
        cc.log("UIGameOver onEnable enter-----------------------------"), this._CurTimeCount = 10, this.TimerLabel.string = this._CurTimeCount + "", this.schedule(this.onTimer, 1), null == this._CurVideoAd && void 0 != window.wx && (this._CurVideoAd = wx.createRewardedVideoAd({
            adUnitId: GameGlobal.DataManager.VideoAdid
        })), this.AgainBtn.node.active = false, this.BackBtn.node.active = false;
        var e = GameGlobal.DataManager;
        e._CurShareReliveCount >= e._ShareReliveCount ? (this.VideoReliveBtn.node.active = true, this.ReliveBtn.node.active = false) : (this.VideoReliveBtn.node.active = false, this.ReliveBtn.node.active = true), this._IsPause = false, this.refreshAd(), cc.log("UIGameOver onEnable leave-----------------------------")
    },

    onDisable: function() {
        cc.sys.platform === cc.sys.QQ_PLAY && (this._QQAd && this._QQAd.destory(), this._QQAd = null, this._CurVideoAd && (this._CurVideoAd.offPlayFinish(), this._CurVideoAd.offClose())), this.unscheduleAllCallbacks()
    },

    onRelive: function(e) {
        e.stopPropagation();
        var t = GameGlobal.DataManager.getCurGold(),
            i = GameGlobal.DataManager.getFuHuoGold();
        if (Number(t) < Number(i)) GameGlobal.UIManager.showMessage("金币不足，无法复活");
        else {
            var r = GameGlobal.WeiXinPlatform;
            if (r._SessionID && !(r._SessionID.length <= 0)) {
                var a = GameGlobal.Net;
                a.request("entry/wxapp/Revive", {
                    m: a.COMMON_M
                }, {
                    session3rd: r._SessionID
                }, function(e, t) {
                    var i = GameGlobal.UIManager;
                    i.closeUI(n.UIType_GameOver), i.getUI(n.UIType_Game).reliveResetGame(), window.wx, a.requestUserInfo()
                })
            }
        }
    },

    onShareRelieve: function(e) {
        this._IsPause = true;
        var t = this;
        GameGlobal.WeiXinPlatform.showShare(function(e) {
            t._ShareCount++, t._IsPause = false;
            var i = GameGlobal.UIManager;
            i.closeUI(n.UIType_GameOver), i.getUI(n.UIType_Game).reliveResetGame(), void 0 != window.wx && wx.triggerGC()
        }, function() {
            t._IsPause = false
        })
    },

    onVideoRelive: function(e) {
        e && e.stopPropagation(), this._IsPause = true;
        var t = this;
        cc.sys.platform === cc.sys.WECHAT_GAME ? null != this._CurVideoAd && (this._CurVideoAd.onLoad(function() {
            console.log("激励视频 广告加载成功")
        }), this._CurVideoAd.show().catch(function(e) {
            t._CurVideoAd.load().then(function() {
                return t._CurVideoAd.show()
            })
        }), this._CurVideoAd.onClose(function(e) {
            if (e && e.isEnded || void 0 === e) {
                var i = GameGlobal.UIManager;
                i.closeUI(n.UIType_GameOver), i.getUI(n.UIType_Game).reliveResetGame(), window.wx
            }
            t._IsPause = false
        })) : cc.sys.platform === cc.sys.QQ_PLAY && (this._CurVideoAd = BK.Advertisement.createVideoAd(), this._CurVideoAd.onLoad(function() {
            BK.Script.log(1, 1, "onLoad")
        }), this._CurVideoAd.onPlayStart(function() {
            BK.Script.log(1, 1, "onPlayStart")
        }), this._CurVideoAd.onPlayFinish(function() {
            BK.Script.log(1, 1, "onPlayFinish"), t._IsPause = false;
            var e = GameGlobal.UIManager;
            e.closeUI(n.UIType_GameOver), e.getUI(n.UIType_Game).reliveResetGame()
        }), this._CurVideoAd.onError(function(e) {
            BK.Script.log(1, 1, "onError code:" + e.code + " msg:" + e.msg), t._IsPause = false
        }), this._CurVideoAd.onClose(function() {
            t._IsPause = false
        }), this._CurVideoAd.show())
    },

    onShareRelive: function() {},

    onBack: function(e) {
        e.stopPropagation();
        var t = GameGlobal.UIManager;
        t.closeUI(n.UIType_GameOver), t.getUI(n.UIType_Game).setGameState(4)
    },

    onAgain: function(e) {
        e && e.stopPropagation()
    },

    onTimer: function() {
        if (1 != this._IsPause && (this._CurTimeCount -= 1, this.TimerLabel.string = this._CurTimeCount + "", 0 == this._CurTimeCount)) {
            this.unscheduleAllCallbacks();
            var e = GameGlobal.UIManager;
            e.closeUI(n.UIType_GameOver), e.getUI(n.UIType_Game).setGameState(4)
        }
    },

    refreshAd: function() {
        cc.log("UIGameOver refreshAd enter ----------------------------------------")
        if (cc.sys.platform === cc.sys.QQ_PLAY) {
            this._QQAd && this._QQAd.destory();
            this._QQAd = null, this._QQAd = BK.Advertisement.createBannerAd({
                viewId: 1002
            }), this._QQAd.onLoad(function() {}), this._QQAd.onError(function(e) {
                e.msg, e.code
            }), this._QQAd.show()
        }
        cc.log("UIGameOver refreshAd leave ----------------------------------------")
    }
})