import { UIType } from './UIType';
const UIQianDaoItem = require('UIQianDaoItem');

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
        for (var e = GameGlobal.DataManager, t = 0; t < this.QianDaoItem.length; ++t)
            if (t < e._SignInitList.length) {
                var i = e._SignInitList[t];
                this.QianDaoItem[t].setParam(i.signDay, i.signReward, i.signRewardNum), this.QianDaoItem[t].setMask(false)
            } this.refreshUI()
    },

    start: function () {
        this.CloseBtn.node.on(cc.Node.EventType.TOUCH_END, this.onClose, this)
        this.node.on(cc.Node.EventType.TOUCH_END, this.onBlock, this)
        this.TakeBtn.node.on(cc.Node.EventType.TOUCH_END, this.onTake, this)
    },

    refreshUI: function () {
        var e = GameGlobal.DataManager;
        cc.log("DataManager._SignInitList ", e._SignInitList.length);
        for (var t = 0; t < this.QianDaoItem.length - 1; ++t)
            if (t + 1 < e._SignInitList.length) {
                var i = e._SignInitList[t];
                1 == i.signStatus ? this.QianDaoItem[t].setMask(true) : (this.QianDaoItem[t].setMask(false), 2 == i.signStatus && (e._MyQianDaoCount = i.signDay))
            } this.TakeBtn.interactable = !e._MyQianDaoTake
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
        var t = e.target.getComponent(cc.Button);
        t && 0 == t.interactable || GameGlobal.Net.requestSignReward(GameGlobal.DataManager._MyQianDaoCount)
    }
})