import { UIType } from './UIManager';
import DataManager from './DataManager';
import Net from './Net';
import WeiXinPlatform from './WeiXinPlatform';
import UIManager from './UIManager';

const { ccclass, property } = cc._decorator;

@ccclass
export default class extends cc.Component {
    private TimerLabel: cc.Label = null;
    private ReliveBtn: cc.Button = null;
    private BackBtn: cc.Button = null;
    private AgainBtn: cc.Button = null;
    private VideoReliveBtn: cc.Button = null;
    private CloseBtn: cc.Button = null;
    private _CurTimeCount = 10;
    private _CurVideoAd = null;
    private _IsPause = false;
    private _ShareCount = 0;
    private _QQAd = null;

    onLoad() {
        this.TimerLabel = this.node.getChildByName('timerLabel').getComponent(cc.Label);
        this.ReliveBtn = this.node.getChildByName('reliveBtn').getComponent(cc.Button);
        this.BackBtn = this.node.getChildByName('backBtn').getComponent(cc.Button);
        this.AgainBtn = this.node.getChildByName('againButton').getComponent(cc.Button);
        this.VideoReliveBtn = this.node.getChildByName('videoReliveBtn').getComponent(cc.Button);
        this.CloseBtn = this.node.getChildByName('closeButton').getComponent(cc.Button);
    }

    start() {
        this.ReliveBtn.node.on(cc.Node.EventType.TOUCH_END, this.onShareRelieve, this)
        this.VideoReliveBtn.node.on(cc.Node.EventType.TOUCH_END, this.onVideoRelive, this)
        this.BackBtn.node.on(cc.Node.EventType.TOUCH_END, this.onBack, this)
        this.AgainBtn.node.on(cc.Node.EventType.TOUCH_END, this.onAgain, this)
        this.CloseBtn.node.on(cc.Node.EventType.TOUCH_END, this.onBack, this)
    }

    onEnable() {
        this._CurTimeCount = 10;
        this.TimerLabel.string = this._CurTimeCount.toString();
        this.schedule(this.onTimer, 1)
        if (this._CurVideoAd == null && window.wx) {
            this._CurVideoAd = wx.createRewardedVideoAd({
                adUnitId: DataManager.inst.VideoAdid
            })
        }
        this.AgainBtn.node.active = false
        this.BackBtn.node.active = false;
        const mgr = DataManager.inst;
        if (mgr._CurShareReliveCount >= mgr._ShareReliveCount) {
            this.VideoReliveBtn.node.active = true
            this.ReliveBtn.node.active = false
        } else {
            this.VideoReliveBtn.node.active = false
            this.ReliveBtn.node.active = true
        }
        this._IsPause = false
        this.refreshAd()
    }

    onDisable() {
        if (cc.sys.platform === cc.sys.QQ_PLAY) {
            this._QQAd && this._QQAd.destory()
            this._QQAd = null
            if (this._CurVideoAd) {
                this._CurVideoAd.offPlayFinish()
                this._CurVideoAd.offClose()
            }
        }
        this.unscheduleAllCallbacks()
    }

    onRelive(e) {
        e.stopPropagation();
        var t = DataManager.inst.getCurGold(),
            i = DataManager.inst.getFuHuoGold();
        if (Number(t) < Number(i)) UIManager.inst.showMessage("金币不足，无法复活");
        else {
            if (WeiXinPlatform.inst._SessionID && !(WeiXinPlatform.inst._SessionID.length <= 0)) {
                Net.inst.request("entry/wxapp/Revive", {m: Net.inst.COMMON_M}, {
                    session3rd: WeiXinPlatform.inst._SessionID}, (e, t) =>{
                    UIManager.inst.closeUI(UIType.UIType_GameOver)
                    UIManager.inst.getUI(UIType.UIType_Game).reliveResetGame()
                    Net.inst.requestUserInfo()
                })
            }
        }
    }

    onShareRelieve() {
        this._IsPause = true;
        WeiXinPlatform.inst.showShare(() => {
            this._ShareCount++;
            this._IsPause = false;
            const mgr = UIManager.inst;
            mgr.closeUI(UIType.UIType_GameOver)
            mgr.getUI(UIType.UIType_Game).reliveResetGame()
            window.wx && wx.triggerGC()
        }, () => {
            this._IsPause = false
        })
    }

    onVideoRelive(event: cc.Event.EventTouch) {
        event && event.stopPropagation();
        this._IsPause = true;

        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            if (this._CurVideoAd) {
                this._CurVideoAd.onLoad(() => {
                    console.log("激励视频 广告加载成功")
                })

                this._CurVideoAd.show().catch((e) => {
                    this._CurVideoAd.load().then(() => this._CurVideoAd.show())
                })

                this._CurVideoAd.onClose((e) => {
                    if (e && e.isEnded || void 0 === e) {
                        UIManager.inst.closeUI(UIType.UIType_GameOver)
                        UIManager.inst.getUI(UIType.UIType_Game).reliveResetGame()
                    }
                    this._IsPause = false
                })
            }
        } else if (cc.sys.platform === cc.sys.QQ_PLAY) {
            this._CurVideoAd = BK.Advertisement.createVideoAd()
            this._CurVideoAd.onLoad(() => {
                BK.Script.log(1, 1, "onLoad")
            })

            this._CurVideoAd.onPlayStart(() => {
                BK.Script.log(1, 1, "onPlayStart")
            })

            this._CurVideoAd.onPlayFinish(() => {
                BK.Script.log(1, 1, "onPlayFinish")
                this._IsPause = false;
                UIManager.inst.closeUI(UIType.UIType_GameOver)
                UIManager.inst.getUI(UIType.UIType_Game).reliveResetGame()
            })

            this._CurVideoAd.onError((e) => {
                BK.Script.log(1, 1, "onError code:" + e.code + " msg:" + e.msg)
                this._IsPause = false
            })

            this._CurVideoAd.onClose(() => this._IsPause = false)
            this._CurVideoAd.show()
        }
    }

    onShareRelive() { }

    onBack(event: cc.Event.EventTouch) {
        event.stopPropagation();
        UIManager.inst.closeUI(UIType.UIType_GameOver)
        UIManager.inst.getUI(UIType.UIType_Game).setGameState(4)
    }

    onAgain(event: cc.Event.EventTouch) {
        event && event.stopPropagation()
    }

    onTimer() {
        if(this._IsPause) return;
        this._CurTimeCount -= 1
        this.TimerLabel.string = this._CurTimeCount.toString();

        if (this._CurTimeCount <= 0) {
            this.unscheduleAllCallbacks();
            UIManager.inst.closeUI(UIType.UIType_GameOver)
            UIManager.inst.getUI(UIType.UIType_Game).setGameState(4)
        }
    }

    refreshAd() {
        if (cc.sys.platform === cc.sys.QQ_PLAY) {
            this._QQAd && this._QQAd.destory();
            this._QQAd = null;
            this._QQAd = BK.Advertisement.createBannerAd({ viewId: 1002 })
            this._QQAd.onLoad(() => { })
            this._QQAd.onError((e) => { e.msg, e.code })
            this._QQAd.show()
        }
    }
}