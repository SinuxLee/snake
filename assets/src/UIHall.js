var n = require('UIType'),
    r = require('SoundType');
require('Snake');
cc.Class({
    extends: cc.Component,
    properties: {
        MyPhotoSprite: {
            default: null,
            type: cc.Sprite
        },
        SnakeShowNode: {
            default: null,
            type: cc.Node
        },
        MyNickLabel: {
            default: null,
            type: cc.Label
        },
        TimeModeBtn: {
            default: null,
            type: cc.Button
        },
        WuXianModeBtn: {
            default: null,
            type: cc.Button
        },
        TuanZhanModeBtn: {
            default: null,
            type: cc.Button
        },
        DuiZhanModeBtn: {
            default: null,
            type: cc.Button
        },
        LinkBtn: {
            default: null,
            type: cc.Button
        },
        ShareBtn: {
            default: null,
            type: cc.Button
        },
        HuoDongBtn: {
            default: null,
            type: cc.Button
        },
        RankBtn: {
            default: null,
            type: cc.Button
        },
        SettingBtn: {
            default: null,
            type: cc.Button
        },
        QianDaoBtn: {
            default: null,
            type: cc.Button
        },
        BaoXiangBtn: {
            default: null,
            type: cc.Button
        },
        ChengJiuBtn: {
            default: null,
            type: cc.Button
        },
        KeFuBtn: {
            default: null,
            type: cc.Button
        },
        SubMaskSprite: {
            default: null,
            type: cc.Sprite
        },
        SubContentSprite: {
            default: null,
            type: cc.Sprite
        },
        ShowNodeList: {
            default: [],
            type: [cc.Node]
        },
        RankCloseBtn: {
            default: null,
            type: cc.Button
        },
        GoldLabel: {
            default: null,
            type: cc.Label
        },
        DiamLabel: {
            default: null,
            type: cc.Label
        },
        VersionLabel: {
            default: null,
            type: cc.Label
        },
        _GameClubBtn: null,
        // _Texture: cc.Texture2D,
        _Texture: {
            type: cc.Texture2D, // use 'type:' to define Texture2D object directly
            default: null,     // object's default value is null
          },
        _SoundMgr: null,
        _ShowSnake: null,
        _CurShowLinkIndex: 0,
        _QQAd: null,
        _IsAdPause: !1
    },
    onLoad: function() {
        cc.log("UIHall onLoad----------------------------"), window.mainhall = this, this._Texture = new cc.Texture2D, this._GameClubBtn = null
    },
    onEnable: function() {
        cc.log("UIHall onEnable  enter------------------------"), void 0 != window.wx && wx.postMessage({
            msgType: 4
        }), this.VersionLabel && (this.VersionLabel.string = GameGlobal.GameVersion), this.SubContentSprite.node.active = !1, this._SoundMgr = GameGlobal.SoundManager, this._SoundMgr.stopAll(), this._SoundMgr.playSound(r.SoundType_Bg), this.SubMaskSprite.node.active = !1, this.RankCloseBtn.node.active = !1, void 0 != window.wx && wx.postMessage({
            msgType: 2
        }), window.wx, this.updateMyInfo(), cc.sys.platform === cc.sys.QQ_PLAY && (this._IsAdPause = !1, this.refreshAd(), this.schedule(this.refreshAd, 20)), cc.log("UIHall onEnable  leave------------------------")
    },
    onDisable: function() {
        cc.log("UIHall onDisable enter ----------------------------"), void 0 != window.wx && null != this._GameClubBtn && this._GameClubBtn.hide(), cc.sys.platform === cc.sys.QQ_PLAY && (this._QQAd && this._QQAd.destory(), this._QQAd = null, this.unscheduleAllCallbacks()), cc.log("UIHall onDisable leave ----------------------------")
    },
    refreshAd: function() {
        if (1 != this._IsAdPause && cc.sys.platform === cc.sys.QQ_PLAY) {
            cc.log("UIHall refreshAd --------------------------");
            this._QQAd && this._QQAd.destory();
            this._QQAd = null, this._QQAd = BK.Advertisement.createBannerAd({
                viewId: 1001
            }), this._QQAd.onError(function(e) {
                e.msg, e.code
            }), this._QQAd.show(), cc.log("UIHall refreshAd finish--------------------------")
        }
    },
    pauseAdShow: function() {
        cc.sys.platform === cc.sys.QQ_PLAY && (cc.log("UIHall pauseAdShow enter --------------------------------"), this._QQAd && this._QQAd.destory(), this._QQAd = null, this._IsAdPause = !0, cc.log("UIHall pauseAdShow leave --------------------------------"))
    },
    resumeAdShow: function() {
        this._IsAdPause = !1
    },
    start: function() {
        cc.log("UIHall   start enter ------------------------"), this.TimeModeBtn.node.on(cc.Node.EventType.TOUCH_END, this.onTimeModeBtn, this), this.WuXianModeBtn.node.on(cc.Node.EventType.TOUCH_END, this.onWuXianModeBtn, this), this.TuanZhanModeBtn.node.on(cc.Node.EventType.TOUCH_END, this.onTuanZhanBtn, this), this.DuiZhanModeBtn.node.on(cc.Node.EventType.TOUCH_END, this.onDuiZhanModeBtn, this), this.LinkBtn.node.on(cc.Node.EventType.TOUCH_END, this.onLinkBtn, this), this.SubMaskSprite.node.on(cc.Node.EventType.TOUCH_END, this.onRankMask, this), this.RankBtn.node.on(cc.Node.EventType.TOUCH_END, this.onRankBtn, this), this.RankCloseBtn.node.on(cc.Node.EventType.TOUCH_END, this.onRankCloseBtn, this), this.ShareBtn.node.on(cc.Node.EventType.TOUCH_END, this.onShareBtn, this), this.HuoDongBtn.node.on(cc.Node.EventType.TOUCH_END, this.onHuoDongBtn, this), this.SettingBtn.node.on(cc.Node.EventType.TOUCH_END, this.onSettingBtn, this), this.BaoXiangBtn.node.on(cc.Node.EventType.TOUCH_END, this.onBaoXiangBtn, this), this.ChengJiuBtn.node.on(cc.Node.EventType.TOUCH_END, this.onChengJiuBtn, this), this.KeFuBtn.node.on(cc.Node.EventType.TOUCH_END, this.onKeFuBtn, this), this.QianDaoBtn.node.on(cc.Node.EventType.TOUCH_END, this.onQianDaoBtn, this);
        var e = this,
            t = GameGlobal.DataManager;
        GameGlobal.Net.request("entry/wxapp/SysInfo", {
            m: GameGlobal.Net.COMMON_M
        }, null, function(i, n) {
            console.log("SysInfo ------------"), i.sysInfo && (i = i.sysInfo, t._FuHuoCostGold = i.revive, t._LinkIconURL = i.jump_img, t._LinkAppID = i.appid, t._LinkPath = i.path, t._LinkExtra = i.extra, t._ShareReward = i.reward, t._ShareReliveCount = i.revive_type), e.updateLinkBtn()
        }), cc.sys.platform === cc.sys.WECHAT_GAME && void 0 != window.wx && (console.log("showShareMenu call "), wx.showShareMenu({
            withShareTicket: !0,
            success: function() {},
            fail: function() {}
        }), wx.postMessage({
            msgType: 2
        })), this.updateMyInfo(), cc.log("UIHall   start leave ------------------------")
    },
    updateMyInfo: function() {
        var e = this;
        if (cc.sys.platform === cc.sys.WECHAT_GAME) GameGlobal.DataManager._MyAvatarURL.length > 0 && cc.loader.load({
            url: GameGlobal.DataManager._MyAvatarURL,
            type: "png"
        }, function(t, i) {
            if (cc.log("load url", t), i instanceof cc.Texture2D) {
                var n = new cc.SpriteFrame(i);
                e.MyPhotoSprite.spriteFrame = n
            }
        });
        else if (cc.sys.platform === cc.sys.QQ_PLAY && GameGlobal.DataManager._MyAvatarURL.length > 0) {
            var t = new Image;
            t.onload = function() {
                var i = new cc.Texture2D;
                i.initWithElement(t), i.handleLoadedTexture(), e.MyPhotoSprite.spriteFrame = new cc.SpriteFrame(i)
            }, t.src = GameGlobal.DataManager._MyAvatarURL
        }
        GameGlobal.DataManager._MyNickName.length > 0 && (e.MyNickLabel.string = GameGlobal.DataManager._MyNickName)
    },
    updateGoldNum: function() {
        GameGlobal.DataManager.CurGold;
        var e = GameGlobal.localStorage.getItem("tcs_gold");
        "" != e && null != e && void 0 != e || (e = 0, GameGlobal.localStorage.setItem("tcs_gold", 0)), this.GoldLabel.string = e
    },
    adddemo: function() {
        GameGlobal.DataManager.CurDiamond += 50, GameGlobal.localStorage.setItem("tcs_diamond", GameGlobal.DataManager.CurDiamond), this.updateDiamondNum()
    },
    updateDiamondNum: function() {
        var e = GameGlobal.DataManager.CurDiamond;
        this.DiamLabel.string = e
    },
    updateLinkBtn: function() {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            var e = this;
            GameGlobal.DataManager._LinkIconURL && GameGlobal.DataManager._LinkIconURL.length > 0 && cc.loader.load({
                url: GameGlobal.DataManager._LinkIconURL,
                type: "png"
            }, function(t, i) {
                if (cc.log("load url", t), i instanceof cc.Texture2D) {
                    var n = new cc.SpriteFrame(i);
                    e.LinkBtn.getComponent(cc.Sprite).spriteFrame = n
                }
            })
        }
    },
    onTimeModeBtn: function(e) {
        e.stopPropagation(), GameGlobal.DataManager._CurSelectMode = 0, GameGlobal.UIManager.closeUI(n.UIType_Hall), GameGlobal.UIManager.openUI(n.UIType_GameLoading)
    },
    onWuXianModeBtn: function(e) {
        e.stopPropagation(), GameGlobal.DataManager._CurSelectMode = 1, GameGlobal.UIManager.closeUI(n.UIType_Hall), GameGlobal.UIManager.openUI(n.UIType_GameLoading)
    },
    onTuanZhanBtn: function(e) {
        e.stopPropagation(), GameGlobal.UIManager.showMessage("攻城狮玩命赶工中......")
    },
    onDuiZhanModeBtn: function(e) {
        e.stopPropagation(), GameGlobal.UIManager.showMessage("攻城狮玩命赶工中......")
    },
    onLinkBtn: function(e) {
        e.stopPropagation(), window.wx && wx.navigateToMiniProgram({
            appId: GameGlobal.DataManager._LinkAppID,
            path: GameGlobal.DataManager._LinkPath,
            extraData: GameGlobal.DataManager._LinkExtra
        })
    },
    onRankBtn: function(e) {
        e.stopPropagation(), GameGlobal.UIManager.openUI(n.UIType_RankQQ), cc.sys.platform === cc.sys.WECHAT_GAME ? (this.SubContentSprite.node.active = !0, this.SubMaskSprite.node.active = !0, this.RankCloseBtn.node.active = !0) : cc.sys.platform === cc.sys.QQ_PLAY && GameGlobal.UIManager.openUI(n.UIType_RankQQ)
    },
    onRankCloseBtn: function(e) {
        e.stopPropagation(), this.SubContentSprite.node.active = !1, this.SubMaskSprite.node.active = !1, this.RankCloseBtn.node.active = !1, void 0 != window.wx && wx.postMessage({
            msgType: 7,
            isShow: !1
        })
    },
    onRankMask: function(e) {
        e.stopPropagation(), window.wx
    },
    onShareBtn: function(e) {
        e.stopPropagation(), GameGlobal.WeiXinPlatform.showShare()
    },
    onHuoDongBtn: function(e) {
        e.stopPropagation(), GameGlobal.UIManager.openUI(n.UIType_Skin)
    },
    onSettingBtn: function(e) {
        e.stopPropagation(), GameGlobal.UIManager.openUI(n.UIType_Setting)
    },
    onBaoXiangBtn: function(e) {
        e.stopPropagation(), GameGlobal.UIManager.showMessage("功能暂未开放")
    },
    onChengJiuBtn: function(e) {
        e.stopPropagation(), GameGlobal.UIManager.showMessage("功能暂未开放")
    },
    onKeFuBtn: function(e) {
        e.stopPropagation(), GameGlobal.UIManager.openUI(n.UIType_InviteFriend)
    },
    onQianDaoBtn: function(e) {
        e && e.stopPropagation(), GameGlobal.UIManager.openUI(n.UIType_QianDao)
    },
    _updateSubDomainCanvas: function() {
        this._Texture && window.sharedCanvas && 0 != this.SubContentSprite.node.active && (this._Texture.initWithElement(window.sharedCanvas), this._Texture.handleLoadedTexture(), this.SubContentSprite.spriteFrame = new cc.SpriteFrame(this._Texture))
    },
    update: function(e) {
        cc.sys.platform, cc.sys.WECHAT_GAME, this._ShowSnake && this._ShowSnake.updateShow(e)
    }
})