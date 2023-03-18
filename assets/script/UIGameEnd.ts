import { UIType } from './UIManager';
import WeiXinPlatform from './WeiXinPlatform';
import UIManager from './UIManager';

const { ccclass, property } = cc._decorator;

@ccclass
export default class extends cc.Component {
    private _btnBack: cc.Button = null;
    private _btnAgain: cc.Button = null;
    private _btnShare: cc.Button = null;
    private _btnClose: cc.Button = null;
    private _labelLen: cc.Label = null;
    private _labelKill: cc.Label = null;
    private _labelRewardGold: cc.Label = null;

    onLoad() {
        this._btnBack = this.node.getChildByName('backBtn').getComponent(cc.Button);
        this._btnAgain = this.node.getChildByName('againButton').getComponent(cc.Button);
        this._btnShare = this.node.getChildByName('shareButton').getComponent(cc.Button);
        this._btnClose = this.node.getChildByName('closeButton').getComponent(cc.Button);

        this._labelLen = cc.find('benjujieshubaikuang/lenLabel', this.node).getComponent(cc.Label);
        this._labelKill = cc.find('benjujieshubaikuang/killLabel', this.node).getComponent(cc.Label);
        this._labelRewardGold = cc.find('benjujieshubaikuang/rewardFrame/rewardGoldLabel', this.node).getComponent(cc.Label);
    }

    start() {
        this._btnBack.node.on(cc.Node.EventType.TOUCH_END, this.onBack, this)
        this._btnAgain.node.on(cc.Node.EventType.TOUCH_END, this.onAgain, this)
        this._btnShare.node.on(cc.Node.EventType.TOUCH_END, this.onShareBtn, this)
        this._btnClose.node.on(cc.Node.EventType.TOUCH_END, this.onBack, this)
    }

    onEnable() {
        this._btnBack.node.active = false
        this._btnAgain.node.active = false;

        const gameUI = UIManager.inst.getUI(UIType.UIType_Game);
        this._labelRewardGold.string = ""
        this._labelLen.string = gameUI.getMySnakeLen().toString()
        this._labelKill.string = gameUI.getMySnakeKill().toString()
    }

    refreshRewardGold(gold: number) {
        this._labelRewardGold.string = gold.toString()
    }

    onBack() {
        const mgr = UIManager.inst;
        mgr.closeUI(UIType.UIType_GameEnd)
        mgr.closeUI(UIType.UIType_Game)
        mgr.openUI(UIType.UIType_Hall)
        window.wx && wx.triggerGC()
    }

    onAgain() {
        const mgr = UIManager.inst;
        mgr.closeUI(UIType.UIType_GameEnd)
        mgr.getUI(UIType.UIType_Game).resetGameEnd()
    }

    onShareBtn() {
        WeiXinPlatform.inst.showShare()
    }
}
