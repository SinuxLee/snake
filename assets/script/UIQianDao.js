import { UIType } from './UIType';
const UIQianDaoItem = require('UIQianDaoItem');

// 签到
cc.Class({
    extends: cc.Component,
    properties: {
        CloseBtn: {
            default: null,
            type: cc.Button
        },
        TakeBtn: {
            default: null,
            type: cc.Button
        },
        QianDaoItem: [UIQianDaoItem],
        _InitData: []
    },

    onEnable: function () {
        const mgr = GameGlobal.DataManager
        for (let t = 0; t < this.QianDaoItem.length; ++t) {
            if (t < mgr._SignInitList.length) {
                const item = mgr._SignInitList[t];
                this.QianDaoItem[t].setParam(item.signDay, item.signReward, item.signRewardNum)
                this.QianDaoItem[t].setMask(false)
            }
        }

        this.refreshUI()
    },

    start: function () {
        this.CloseBtn.node.on(cc.Node.EventType.TOUCH_END, this.onClose, this)
        this.node.on(cc.Node.EventType.TOUCH_END, this.onBlock, this)
        this.TakeBtn.node.on(cc.Node.EventType.TOUCH_END, this.onTake, this)
    },

    refreshUI: function () {
        const mgr = GameGlobal.DataManager;
        cc.log("DataManager._SignInitList ", mgr._SignInitList.length);
        for (let t = 0; t < this.QianDaoItem.length - 1; ++t) {
            if (t + 1 < mgr._SignInitList.length) {
                const item = mgr._SignInitList[t];
                1 == item.signStatus ? this.QianDaoItem[t].setMask(true) : (this.QianDaoItem[t].setMask(false), 2 == item.signStatus && (mgr._MyQianDaoCount = item.signDay))
            }
        }
        this.TakeBtn.interactable = !mgr._MyQianDaoTake
    },

    onClose: function (e) {
        e.stopPropagation()
        GameGlobal.UIManager.closeUI(UIType.UIType_QianDao)
    },

    onBlock: function (e) {
        e.stopPropagation()
    },

    onTake: function (e) {
        e.stopPropagation();
        const btn = e.target.getComponent(cc.Button);
        btn && 0 == btn.interactable || GameGlobal.Net.requestSignReward(GameGlobal.DataManager._MyQianDaoCount)
    }
})