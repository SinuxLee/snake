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
    
    showMessage: function(e) {
        if (this.node.active = true, this.showLabel) {
            this.showLabel.node.active = true, this.showLabel.string = e, this.showLabel.node.stopAllActions();
            var t = cc.delayTime(1.5),
                i = cc.callFunc(this.actionFinish, this, this.showLabel);
            this.showLabel.node.runAction(cc.sequence(t, i))
        }
        if (this.showBg) {
            this.showBg.node.active = true, this.showBg.node.width = this.showLabel.node.width + 50, this.showBg.node.height = this.showLabel.node.height + 20, this.showBg.node.stopAllActions();
            t = cc.delayTime(1.5), i = cc.callFunc(this.actionFinish, this, this.showBg);
            this.showBg.node.runAction(cc.sequence(t, i))
        }
    },
    actionFinish: function(e) {
        this.node.active = false, e.active = false
    }
})