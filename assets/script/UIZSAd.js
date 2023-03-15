const UIZSAdItem = require('UIZSAdItem');
cc.Class({
    extends: cc.Component,
    properties: {
        AdItemArray: [UIZSAdItem],
        AdItemLeft: UIZSAdItem,
        AdItemRight: UIZSAdItem
    },

    onEnable: function () {
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

        GameGlobal.Net.requestZSAd(function () {
            for (let t = 0; t < e.AdItemArray.length; ++t) e.AdItemArray[t].initAd(t);
            e.AdItemLeft.initBorderAd(0)
            e.AdItemRight.initBorderAd(1)
        })
    },

    onDisable: function () {
        this.AdItemLeft.node.stopAllActions()
        this.AdItemRight.node.stopAllActions()
    }
})