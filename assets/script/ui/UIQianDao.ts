import { UIType } from './UIManager';
import UIQianDaoItem from './UIQianDaoItem';
import DataManager from '../logic/DataManager';
import Net from '../logic/Net';
import UIManager from './UIManager';

const { ccclass, property } = cc._decorator;

@ccclass
export default class extends cc.Component {
    // 签到
    @property([UIQianDaoItem])
    QianDaoItem: UIQianDaoItem[] = [];

    private CloseBtn: cc.Button = null;
    private TakeBtn: cc.Button = null;
    private _InitData = [];

    onLoad() {
        this.CloseBtn = cc.find('bgSprite/closeBtn', this.node).getComponent(cc.Button);
        this.TakeBtn = this.node.getChildByName('takeBtn').getComponent(cc.Button);

        this.CloseBtn.node.on(cc.Node.EventType.TOUCH_END, this.onClose, this)
        this.node.on(cc.Node.EventType.TOUCH_END, this.onBlock, this)
        this.TakeBtn.node.on(cc.Node.EventType.TOUCH_END, this.onTake, this)
    }

    onEnable() {
        const mgr = DataManager.inst
        for (let t = 0; t < this.QianDaoItem.length; ++t) {
            if (t < mgr._SignInitList.length) {
                const item = mgr._SignInitList[t];
                this.QianDaoItem[t].setParam(item.signDay, item.signReward, item.signRewardNum)
                this.QianDaoItem[t].setMask(false)
            }
        }

        this.refreshUI()
    }

    refreshUI() {
        const mgr = DataManager.inst;
        for (let t = 0; t < this.QianDaoItem.length - 1; ++t) {
            if (t + 1 < mgr._SignInitList.length) {
                const item = mgr._SignInitList[t];
                if (item.signStatus == 1) this.QianDaoItem[t].setMask(true)
                else {
                    this.QianDaoItem[t].setMask(false)
                    if (item.signStatus == 2) mgr._MyQianDaoCount = item.signDay;
                }
            }
        }
        this.TakeBtn.interactable = !mgr._MyQianDaoTake
    }

    onClose(event: cc.Event.EventTouch) {
        event.stopPropagation()
        UIManager.inst.closeUI(UIType.UIType_QianDao)
    }

    onBlock(event: cc.Event.EventTouch) {
        event.stopPropagation()
    }

    onTake(event: cc.Event.EventTouch) {
        event.stopPropagation();
        const btn = event.target.getComponent(cc.Button);
        if (btn && 0 == btn.interactable) return;
        Net.inst.requestSignReward(DataManager.inst._MyQianDaoCount)
    }
}
