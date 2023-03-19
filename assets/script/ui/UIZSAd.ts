import UIZSAdItem from './UIZSAdItem';
const { ccclass, property } = cc._decorator;

@ccclass
export default class extends cc.Component {
    @property([UIZSAdItem])
    AdItemArray: UIZSAdItem[] = []

    @property(UIZSAdItem)
    AdItemLeft: UIZSAdItem = null;
    @property(UIZSAdItem)
    AdItemRight: UIZSAdItem = null;

    onEnable () {
        for (let e = this, t = 0; t < this.AdItemArray.length; ++t) this.AdItemArray[t].node.active = false;

        this.AdItemLeft.node.stopAllActions()
        this.AdItemRight.node.stopAllActions()
        this.AdItemLeft.node.angle = this.AdItemRight.node.angle = -45;

        let rotate1 = cc.rotateBy(.8, 90);
        let rotate2 = cc.rotateBy(.8, -90);
        let actSeq = cc.sequence(rotate1, rotate2);
        this.AdItemLeft.node.runAction(actSeq.repeatForever());

        rotate1 = cc.rotateBy(.8, 90), 
        rotate2 = cc.rotateBy(.8, -90)
        actSeq = cc.sequence(rotate1, rotate2);
        this.AdItemRight.node.runAction(actSeq.repeatForever())
    }

    onDisable () {
        this.AdItemLeft.node.stopAllActions()
        this.AdItemRight.node.stopAllActions()
    }
}
