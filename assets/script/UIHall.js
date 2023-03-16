import { UIType } from './UIType';
import SoundType from './SoundType';
import Snake from './Snake';

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
        _IsAdPause: false
    },

    onLoad: function () {
        window.mainhall = this
        this._Texture = new cc.Texture2D
        this._GameClubBtn = null
    },

    onEnable: function () {
        window.wx && wx.postMessage({ msgType: 4 })
        this.VersionLabel && (this.VersionLabel.string = GameGlobal.GameVersion)
        this.SubContentSprite.node.active = false
        this._SoundMgr = GameGlobal.SoundManager
        this._SoundMgr.stopAll()
        this._SoundMgr.playSound(SoundType.SoundType_Bg)
        this.SubMaskSprite.node.active = false
        this.RankCloseBtn.node.active = false;
        window.wx && wx.postMessage({ msgType: 2 })
        this.updateMyInfo()
        cc.sys.platform === cc.sys.QQ_PLAY && (this._IsAdPause = false, this.refreshAd(), this.schedule(this.refreshAd, 20))
    },

    onDisable: function () {
        void 0 != window.wx && null != this._GameClubBtn && this._GameClubBtn.hide()
        cc.sys.platform === cc.sys.QQ_PLAY && (this._QQAd && this._QQAd.destory(), this._QQAd = null, this.unscheduleAllCallbacks())
    },

    refreshAd: function () {
        if (1 != this._IsAdPause && cc.sys.platform === cc.sys.QQ_PLAY) {
            this._QQAd && this._QQAd.destory();
            this._QQAd = null
            this._QQAd = BK.Advertisement.createBannerAd({ viewId: 1001 })
            this._QQAd.onError(function (e) {
                e.msg, e.code
            })
            this._QQAd.show()
        }
    },

    pauseAdShow: function () {
        if (cc.sys.platform === cc.sys.QQ_PLAY) {
            this._QQAd && this._QQAd.destory()
            this._QQAd = null
            this._IsAdPause = true
        }
    },

    resumeAdShow: function () {
        this._IsAdPause = false
    },

    start: function () {
        this.TimeModeBtn.node.on(cc.Node.EventType.TOUCH_END, this.onTimeModeBtn, this)
        this.WuXianModeBtn.node.on(cc.Node.EventType.TOUCH_END, this.onWuXianModeBtn, this)
        this.TuanZhanModeBtn.node.on(cc.Node.EventType.TOUCH_END, this.onTuanZhanBtn, this)
        this.DuiZhanModeBtn.node.on(cc.Node.EventType.TOUCH_END, this.onDuiZhanModeBtn, this)
        this.LinkBtn.node.on(cc.Node.EventType.TOUCH_END, this.onLinkBtn, this)
        this.SubMaskSprite.node.on(cc.Node.EventType.TOUCH_END, this.onRankMask, this)
        this.RankBtn.node.on(cc.Node.EventType.TOUCH_END, this.onRankBtn, this)
        this.RankCloseBtn.node.on(cc.Node.EventType.TOUCH_END, this.onRankCloseBtn, this)
        this.ShareBtn.node.on(cc.Node.EventType.TOUCH_END, this.onShareBtn, this)
        this.HuoDongBtn.node.on(cc.Node.EventType.TOUCH_END, this.onHuoDongBtn, this)
        this.SettingBtn.node.on(cc.Node.EventType.TOUCH_END, this.onSettingBtn, this)
        this.BaoXiangBtn.node.on(cc.Node.EventType.TOUCH_END, this.onBaoXiangBtn, this)
        this.ChengJiuBtn.node.on(cc.Node.EventType.TOUCH_END, this.onChengJiuBtn, this)
        this.KeFuBtn.node.on(cc.Node.EventType.TOUCH_END, this.onKeFuBtn, this)
        this.QianDaoBtn.node.on(cc.Node.EventType.TOUCH_END, this.onQianDaoBtn, this);

        const mgr = GameGlobal.DataManager;
        GameGlobal.Net.request("entry/wxapp/SysInfo", { m: GameGlobal.Net.COMMON_M }, null, (i, n) => {
            const info = i.sysInfo
            if (info == null) return

            mgr._FuHuoCostGold = iinfo.revive
            mgr._LinkIconURL = info.jump_img
            mgr._LinkAppID = info.appid
            mgr._LinkPath = info.path
            mgr._LinkExtra = info.extra
            mgr._ShareReward = info.reward
            mgr._ShareReliveCount = info.revive_type
            this.updateLinkBtn()
        })

        if (cc.sys.platform === cc.sys.WECHAT_GAME && window.wx) {
            wx.showShareMenu({
                withShareTicket: true,
                success: function () { },
                fail: function () { }
            })
            wx.postMessage({
                msgType: 2
            })
        }

        this.updateMyInfo()
    },

    updateMyInfo: function () {
        if (GameGlobal.DataManager._MyAvatarURL.length <= 0) return

        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            cc.loader.load({ url: GameGlobal.DataManager._MyAvatarURL, type: "png" }, (t, asset) => {
                if (asset instanceof cc.Texture2D) {
                    this.MyPhotoSprite.spriteFrame = new cc.SpriteFrame(asset)
                }
            })
        } else if (cc.sys.platform === cc.sys.QQ_PLAY) {
            const image = new Image();
            image.src = GameGlobal.DataManager._MyAvatarURL
            image.onload = () => {
                const texture = new cc.Texture2D();
                texture.initWithElement(image)
                texture.handleLoadedTexture()
                this.MyPhotoSprite.spriteFrame = new cc.SpriteFrame(texture)
            }
        }

        this.MyNickLabel.string = GameGlobal.DataManager._MyNickName
    },

    updateGoldNum: function () {
        let gold = GameGlobal.localStorage.getItem("tcs_gold");
        if (gold == null) {
            gold = 0
            GameGlobal.localStorage.setItem("tcs_gold", 0)
        }

        this.GoldLabel.string = gold
    },

    adddemo: function () {
        GameGlobal.DataManager.CurDiamond += 50
        GameGlobal.localStorage.setItem("tcs_diamond", GameGlobal.DataManager.CurDiamond)
        this.updateDiamondNum()
    },

    updateDiamondNum: function () {
        this.DiamLabel.string = GameGlobal.DataManager.CurDiamond
    },

    updateLinkBtn: function () {
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) return

        if (GameGlobal.DataManager._LinkIconURL == null ||
            GameGlobal.DataManager._LinkIconURL.length > 0) return

        cc.loader.load({ url: GameGlobal.DataManager._LinkIconURL, type: "png" }, (t, asset) => {
            if (asset instanceof cc.Texture2D) {
                this.LinkBtn.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(asset)
            }
        })
    },

    onTimeModeBtn: function (e) {
        e.stopPropagation()
        GameGlobal.DataManager._CurSelectMode = 0
        GameGlobal.UIManager.closeUI(UIType.UIType_Hall)
        GameGlobal.UIManager.openUI(UIType.UIType_GameLoading)
    },

    onWuXianModeBtn: function (e) {
        e.stopPropagation()
        GameGlobal.DataManager._CurSelectMode = 1
        GameGlobal.UIManager.closeUI(UIType.UIType_Hall)
        GameGlobal.UIManager.openUI(UIType.UIType_GameLoading)
    },

    onTuanZhanBtn: function (e) {
        e.stopPropagation()
        GameGlobal.UIManager.showMessage("攻城狮玩命赶工中......")
    },

    onDuiZhanModeBtn: function (e) {
        e.stopPropagation()
        GameGlobal.UIManager.showMessage("攻城狮玩命赶工中......")
    },

    onLinkBtn: function (e) {
        e.stopPropagation()
        window.wx && wx.navigateToMiniProgram({
            appId: GameGlobal.DataManager._LinkAppID,
            path: GameGlobal.DataManager._LinkPath,
            extraData: GameGlobal.DataManager._LinkExtra
        })
    },

    onRankBtn: function (e) {
        e.stopPropagation()
        GameGlobal.UIManager.openUI(UIType.UIType_RankQQ)
        cc.sys.platform === cc.sys.WECHAT_GAME ? (this.SubContentSprite.node.active = true, this.SubMaskSprite.node.active = true, this.RankCloseBtn.node.active = true) : cc.sys.platform === cc.sys.QQ_PLAY && GameGlobal.UIManager.openUI(UIType.UIType_RankQQ)
    },

    onRankCloseBtn: function (e) {
        e.stopPropagation()
        this.SubContentSprite.node.active = false
        this.SubMaskSprite.node.active = false
        this.RankCloseBtn.node.active = false
        window.wx && wx.postMessage({
            msgType: 7,
            isShow: false
        })
    },

    onRankMask: function (e) {
        e.stopPropagation()
    },

    onShareBtn: function (e) {
        e.stopPropagation()
        GameGlobal.WeiXinPlatform.showShare()
    },

    onHuoDongBtn: function (e) {
        e.stopPropagation()
        GameGlobal.UIManager.openUI(UIType.UIType_Skin)
    },

    onSettingBtn: function (e) {
        e.stopPropagation()
        GameGlobal.UIManager.openUI(UIType.UIType_Setting)
    },

    onBaoXiangBtn: function (e) {
        e.stopPropagation()
        GameGlobal.UIManager.showMessage("功能暂未开放")
    },

    onChengJiuBtn: function (e) {
        e.stopPropagation()
        GameGlobal.UIManager.showMessage("功能暂未开放")
    },

    onKeFuBtn: function (e) {
        e.stopPropagation()
        GameGlobal.UIManager.openUI(UIType.UIType_InviteFriend)
    },

    onQianDaoBtn: function (e) {
        e && e.stopPropagation()
        GameGlobal.UIManager.openUI(UIType.UIType_QianDao)
    },

    _updateSubDomainCanvas: function () {
        this._Texture && window.sharedCanvas && 0 != this.SubContentSprite.node.active && (this._Texture.initWithElement(window.sharedCanvas), this._Texture.handleLoadedTexture(), this.SubContentSprite.spriteFrame = new cc.SpriteFrame(this._Texture))
    },

    update: function (dt) {
        if(this._ShowSnake) this._ShowSnake.updateShow(dt);
    }
})