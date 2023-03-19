const { ccclass, property } = cc._decorator;

@ccclass
export default class extends cc.Component {
    private showBg:cc.Sprite = null;
    private showLabel: cc.Label = null;

    onLoad(){
        this.showBg = this.node.getChildByName('tipBg').getComponent(cc.Sprite);
        this.showLabel = this.node.getChildByName('msgLabel').getComponent(cc.Label);
    }

    showMessage (txt: string) {
        if (this.node.active = true, this.showLabel) {
            this.showLabel.node.active = true
            this.showLabel.string = txt
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
    }

    actionFinish (node: cc.Node) {
        this.node.active = false
        node.active = false
    }
}
