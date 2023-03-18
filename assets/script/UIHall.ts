import { UIType } from './UIManager';
import {default as SoundManager,SoundType} from './SoundManager';
import DataManager from './DataManager';
import Net from './Net';
import WeiXinPlatform from './WeiXinPlatform';
import App from './App';
import UIManager from './UIManager';

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
        this.VersionLabel.string = App.inst.GameVersion
        this.SubContentSprite.node.active = false
        this._SoundMgr = SoundManager.inst;
        this._SoundMgr.stopAll()
        this._SoundMgr.playSound(SoundType.Bg)
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

        const mgr = DataManager.inst;
        Net.inst.request("entry/wxapp/SysInfo", { m: Net.inst.COMMON_M }, null, (i, n) => {
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
        if (DataManager.inst._MyAvatarURL.length <= 0) return

        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            cc.loader.load({ url: DataManager.inst._MyAvatarURL, type: "png" }, (t, asset) => {
                if (asset instanceof cc.Texture2D) {
                    this.MyPhotoSprite.spriteFrame = new cc.SpriteFrame(asset)
                }
            })
        } else if (cc.sys.platform === cc.sys.QQ_PLAY) {
            const image = new Image();
            image.src = DataManager.inst._MyAvatarURL
            image.onload = () => {
                const texture = new cc.Texture2D();
                texture.initWithElement(image)
                texture.handleLoadedTexture()
                this.MyPhotoSprite.spriteFrame = new cc.SpriteFrame(texture)
            }
        }

        this.MyNickLabel.string = DataManager.inst._MyNickName
    }

    updateGoldNum() {
        let gold = App.inst.localStorage.getItem("tcs_gold");
        if (gold == null) {
            gold = 0
            App.inst.localStorage.setItem("tcs_gold", 0)
        }

        this.GoldLabel.string = gold
    }

    adddemo() {
        DataManager.inst.CurDiamond += 50
        App.inst.localStorage.setItem("tcs_diamond", DataManager.inst.CurDiamond)
        this.updateDiamondNum()
    }

    updateDiamondNum() {
        this.DiamLabel.string = DataManager.inst.CurDiamond.toString();
    }

    updateLinkBtn() {
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) return

        if (DataManager.inst._LinkIconURL == null ||
            DataManager.inst._LinkIconURL.length > 0) return

        cc.loader.load({ url: DataManager.inst._LinkIconURL, type: "png" }, (t, asset) => {
            if (asset instanceof cc.Texture2D) {
                this.LinkBtn.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(asset)
            }
        })
    }

    onTimeModeBtn(e) {
        e.stopPropagation()
        DataManager.inst._CurSelectMode = 0
        UIManager.inst.closeUI(UIType.UIType_Hall)
        UIManager.inst.openUI(UIType.UIType_GameLoading)
    }

    onWuXianModeBtn(e) {
        e.stopPropagation()
        DataManager.inst._CurSelectMode = 1
        UIManager.inst.closeUI(UIType.UIType_Hall)
        UIManager.inst.openUI(UIType.UIType_GameLoading)
    }

    onTuanZhanBtn(e) {
        e.stopPropagation()
        UIManager.inst.showMessage("攻城狮玩命赶工中......")
    }

    onDuiZhanModeBtn(e) {
        e.stopPropagation()
        UIManager.inst.showMessage("攻城狮玩命赶工中......")
    }

    onLinkBtn(e) {
        e.stopPropagation()
        window.wx && wx.navigateToMiniProgram({
            appId: DataManager.inst._LinkAppID,
            path: DataManager.inst._LinkPath,
            extraData: DataManager.inst._LinkExtra
        })
    }

    onRankBtn(e) {
        e.stopPropagation()
        UIManager.inst.openUI(UIType.UIType_RankQQ)
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
        WeiXinPlatform.inst.showShare()
    }

    onHuoDongBtn(e) {
        e.stopPropagation()
        UIManager.inst.openUI(UIType.UIType_Skin)
    }

    onSettingBtn(e) {
        e.stopPropagation()
        UIManager.inst.openUI(UIType.UIType_Setting)
    }

    onBaoXiangBtn(e) {
        e.stopPropagation()
        UIManager.inst.showMessage("功能暂未开放")
    }

    onChengJiuBtn(e) {
        e.stopPropagation()
        UIManager.inst.showMessage("功能暂未开放")
    }

    onKeFuBtn(e) {
        e.stopPropagation()
        UIManager.inst.openUI(UIType.UIType_InviteFriend)
    }

    onQianDaoBtn(e) {
        e && e.stopPropagation()
        UIManager.inst.openUI(UIType.UIType_QianDao)
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
