cc.Class({
    extends: cc.Component,
    properties: {
        showBg: {
            default: null,
            type: cc.Sprite
        },
        showLabel: {
            default: null,
            type: cc.Label
        }
    },

    showMessage: function (e) {
        if (this.node.active = true, this.showLabel) {
            this.showLabel.node.active = true
            this.showLabel.string = e
            this.showLabel.node.stopAllActions();
            
            const delay = cc.delayTime(1.5);
            const func = cc.callFunc(this.actionFinish, this, this.showLabel);
            this.showLabel.node.runAction(cc.sequence(delay, func))
        }

        if (this.showBg) {
            this.showBg.node.active = true
            this.showBg.node.width = this.showLabel.node.width + 50
            this.showBg.node.height = this.showLabel.node.height + 20
            this.showBg.node.stopAllActions();

            const delay = cc.delayTime(1.5);
            const func = cc.callFunc(this.actionFinish, this, this.showBg);
            this.showBg.node.runAction(cc.sequence(delay, func))
        }
    },

    actionFinish: function (e) {
        this.node.active = false, e.active = false
    }
})