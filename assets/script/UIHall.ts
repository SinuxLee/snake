import { UIType } from './UIType';
import SoundType from './SoundType';
import SoundManager from './SoundManager';

const { ccclass, property } = cc._decorator;

@ccclass
export default class extends cc.Component {
    private MyPhotoSprite: cc.Sprite = null;
    private SnakeShowNode: cc.Node = null;
    private MyNickLabel: cc.Label = null;
    private TimeModeBtn: cc.Button = null;
    private WuXianModeBtn: cc.Button = null;
    private TuanZhanModeBtn: cc.Button = null;
    private DuiZhanModeBtn: cc.Button = null;
    private LinkBtn: cc.Button = null;
    private ShareBtn: cc.Button = null;
    private HuoDongBtn: cc.Button = null;
    private RankBtn: cc.Button = null;
    private SettingBtn: cc.Button = null;
    private QianDaoBtn: cc.Button = null;
    private BaoXiangBtn: cc.Button = null;
    private ChengJiuBtn: cc.Button = null;
    private KeFuBtn: cc.Button = null;
    private SubMaskSprite: cc.Sprite = null;
    private SubContentSprite: cc.Sprite = null;
    private ShowNodeList: cc.Node[] = [];
    private RankCloseBtn: cc.Button = null;
    private GoldLabel: cc.Label = null;
    private DiamLabel: cc.Label = null;
    private VersionLabel: cc.Label = null;
    private _Texture: cc.Texture2D = null;
    private _SoundMgr:SoundManager = null;
    private _ShowSnake = null;
    private _CurShowLinkIndex = 0;
    private _QQAd = null;
    private _IsAdPause = false;

    onLoad() {
        this.MyPhotoSprite = cc.find('MyInfo/headMask/MyPicture', this.node).getComponent(cc.Sprite);
        this.MyNickLabel = cc.find('MyInfo/headMask/MyNickName', this.node).getComponent(cc.Label);
        this.TimeModeBtn = this.node.getChildByName('TimeModeBtn').getComponent(cc.Button);
        this.WuXianModeBtn = this.node.getChildByName('WuXianModeBtn').getComponent(cc.Button);
        this.TuanZhanModeBtn = this.node.getChildByName('tuanZhanBtn').getComponent(cc.Button);
        this.DuiZhanModeBtn = this.node.getChildByName('duizhanButton').getComponent(cc.Button);
        this.LinkBtn = cc.find('leftbottomNode/BtnLink', this.node).getComponent(cc.Button);
        this.ShareBtn = cc.find('rightNode/shareButton', this.node).getComponent(cc.Button);
        this.HuoDongBtn = cc.find('rightNode/huodongButton', this.node).getComponent(cc.Button);
        this.RankBtn = cc.find('rightNode/rankButton', this.node).getComponent(cc.Button);
        this.SettingBtn = cc.find('rightNode/setttingButton', this.node).getComponent(cc.Button);
        this.QianDaoBtn = cc.find('bottomSprite/qiandaoButton', this.node).getComponent(cc.Button);
        this.BaoXiangBtn = cc.find('bottomSprite/baoxiangButton', this.node).getComponent(cc.Button);
        this.ChengJiuBtn = cc.find('bottomSprite/chengJiuButton', this.node).getComponent(cc.Button);
        this.KeFuBtn = cc.find('bottomSprite/kefuButton', this.node).getComponent(cc.Button);
        this.SubMaskSprite = this.node.getChildByName('subMaskSprite').getComponent(cc.Sprite);
        this.SubContentSprite = this.node.getChildByName('SubSprite').getComponent(cc.Sprite);
        this.GoldLabel = cc.find('TopNode/goldBg/goldNumLabel', this.node).getComponent(cc.Label);
        this.DiamLabel = cc.find('TopNode/diamondBg/diadNumLabel', this.node).getComponent(cc.Label);
        this.VersionLabel = this.node.getChildByName('versionLabel').getComponent(cc.Label);

        window.mainhall = this
        this._Texture = new cc.Texture2D();
    }

    onEnable() {
        window.wx && wx.postMessage({ msgType: 4 })
        this.VersionLabel && (this.VersionLabel.string = GameGlobal.GameVersion)
        this.SubContentSprite.node.active = false
        this._SoundMgr = GameGlobal.SoundManager
        this._SoundMgr.stopAll()
        this._SoundMgr.playSound(SoundType.SoundType_Bg)
        this.SubMaskSprite.node.active = false
        // this.RankCloseBtn.node.active = false;
        window.wx && wx.postMessage({ msgType: 2 })
        this.updateMyInfo()
        if (cc.sys.platform === cc.sys.QQ_PLAY) {
            this._IsAdPause = false, this.refreshAd()
            this.schedule(this.refreshAd, 20)
        }
    }

    onDisable() {
        if (cc.sys.platform === cc.sys.QQ_PLAY) {
            this._QQAd && this._QQAd.destory()
            this._QQAd = null
            this.unscheduleAllCallbacks()
        }
    }

    refreshAd() {
        if (!this._IsAdPause && cc.sys.platform === cc.sys.QQ_PLAY) {
            this._QQAd && this._QQAd.destory();
            this._QQAd = null
            this._QQAd = BK.Advertisement.createBannerAd({ viewId: 1001 })
            this._QQAd.onError((e) => { e.msg, e.code })
            this._QQAd.show()
        }
    }

    pauseAdShow() {
        if (cc.sys.platform === cc.sys.QQ_PLAY) {
            this._QQAd && this._QQAd.destory()
            this._QQAd = null
            this._IsAdPause = true
        }
    }

    resumeAdShow() {
        this._IsAdPause = false
    }

    start() {
        this.TimeModeBtn.node.on(cc.Node.EventType.TOUCH_END, this.onTimeModeBtn, this)
        this.WuXianModeBtn.node.on(cc.Node.EventType.TOUCH_END, this.onWuXianModeBtn, this)
        this.TuanZhanModeBtn.node.on(cc.Node.EventType.TOUCH_END, this.onTuanZhanBtn, this)
        this.DuiZhanModeBtn.node.on(cc.Node.EventType.TOUCH_END, this.onDuiZhanModeBtn, this)
        this.LinkBtn.node.on(cc.Node.EventType.TOUCH_END, this.onLinkBtn, this)
        this.SubMaskSprite.node.on(cc.Node.EventType.TOUCH_END, this.onRankMask, this)
        this.RankBtn.node.on(cc.Node.EventType.TOUCH_END, this.onRankBtn, this)
        // this.RankCloseBtn.node.on(cc.Node.EventType.TOUCH_END, this.onRankCloseBtn, this)
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
                success: () => { },
                fail: () => { }
            })
            wx.postMessage({ msgType: 2 })
        }

        this.updateMyInfo()
    }

    updateMyInfo() {
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
    }

    updateGoldNum() {
        let gold = GameGlobal.localStorage.getItem("tcs_gold");
        if (gold == null) {
            gold = 0
            GameGlobal.localStorage.setItem("tcs_gold", 0)
        }

        this.GoldLabel.string = gold
    }

    adddemo() {
        GameGlobal.DataManager.CurDiamond += 50
        GameGlobal.localStorage.setItem("tcs_diamond", GameGlobal.DataManager.CurDiamond)
        this.updateDiamondNum()
    }

    updateDiamondNum() {
        this.DiamLabel.string = GameGlobal.DataManager.CurDiamond
    }

    updateLinkBtn() {
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) return

        if (GameGlobal.DataManager._LinkIconURL == null ||
            GameGlobal.DataManager._LinkIconURL.length > 0) return

        cc.loader.load({ url: GameGlobal.DataManager._LinkIconURL, type: "png" }, (t, asset) => {
            if (asset instanceof cc.Texture2D) {
                this.LinkBtn.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(asset)
            }
        })
    }

    onTimeModeBtn(e) {
        e.stopPropagation()
        GameGlobal.DataManager._CurSelectMode = 0
        GameGlobal.UIManager.closeUI(UIType.UIType_Hall)
        GameGlobal.UIManager.openUI(UIType.UIType_GameLoading)
    }

    onWuXianModeBtn(e) {
        e.stopPropagation()
        GameGlobal.DataManager._CurSelectMode = 1
        GameGlobal.UIManager.closeUI(UIType.UIType_Hall)
        GameGlobal.UIManager.openUI(UIType.UIType_GameLoading)
    }

    onTuanZhanBtn(e) {
        e.stopPropagation()
        GameGlobal.UIManager.showMessage("攻城狮玩命赶工中......")
    }

    onDuiZhanModeBtn(e) {
        e.stopPropagation()
        GameGlobal.UIManager.showMessage("攻城狮玩命赶工中......")
    }

    onLinkBtn(e) {
        e.stopPropagation()
        window.wx && wx.navigateToMiniProgram({
            appId: GameGlobal.DataManager._LinkAppID,
            path: GameGlobal.DataManager._LinkPath,
            extraData: GameGlobal.DataManager._LinkExtra
        })
    }

    onRankBtn(e) {
        e.stopPropagation()
        GameGlobal.UIManager.openUI(UIType.UIType_RankQQ)
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            this.SubContentSprite.node.active = true
            this.SubMaskSprite.node.active = true
            // this.RankCloseBtn.node.active = true
        }
    }

    onRankCloseBtn(e) {
        e.stopPropagation()
        this.SubContentSprite.node.active = false
        this.SubMaskSprite.node.active = false
        // this.RankCloseBtn.node.active = false
        window.wx && wx.postMessage({
            msgType: 7,
            isShow: false
        })
    }

    onRankMask(e) {
        e.stopPropagation()
    }

    onShareBtn(e) {
        e.stopPropagation()
        GameGlobal.WeiXinPlatform.showShare()
    }

    onHuoDongBtn(e) {
        e.stopPropagation()
        GameGlobal.UIManager.openUI(UIType.UIType_Skin)
    }

    onSettingBtn(e) {
        e.stopPropagation()
        GameGlobal.UIManager.openUI(UIType.UIType_Setting)
    }

    onBaoXiangBtn(e) {
        e.stopPropagation()
        GameGlobal.UIManager.showMessage("功能暂未开放")
    }

    onChengJiuBtn(e) {
        e.stopPropagation()
        GameGlobal.UIManager.showMessage("功能暂未开放")
    }

    onKeFuBtn(e) {
        e.stopPropagation()
        GameGlobal.UIManager.openUI(UIType.UIType_InviteFriend)
    }

    onQianDaoBtn(e) {
        e && e.stopPropagation()
        GameGlobal.UIManager.openUI(UIType.UIType_QianDao)
    }

    _updateSubDomainCanvas() {
        if (this._Texture && window.sharedCanvas && this.SubContentSprite.node.active) {
            this._Texture.initWithElement(window.sharedCanvas)
            this._Texture.handleLoadedTexture()
            this.SubContentSprite.spriteFrame = new cc.SpriteFrame(this._Texture)
        }
    }

    update(dt) {
        if (this._ShowSnake) this._ShowSnake.updateShow(dt);
    }
}
