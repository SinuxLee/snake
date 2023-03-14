const UIZSAdItem = require('UIZSAdItem');
cc.Class({
    extends: cc.Component,
    properties: {
        AdItemArray: [UIZSAdItem],
        AdItemLeft: UIZSAdItem,
        AdItemRight: UIZSAdItem
    },

    onEnable: function () {
        for (var e = this, t = 0; t < this.AdItemArray.length; ++t) this.AdItemArray[t].node.active = false;
        this.AdItemLeft.node.stopAllActions(), this.AdItemRight.node.stopAllActions(), this.AdItemLeft.node.angle = -45, this.AdItemRight.node.angle = -45;
        var i = cc.rotateBy(.8, 90),
            n = cc.rotateBy(.8, -90),
            r = cc.sequence(i, n);
        this.AdItemLeft.node.runAction(r.repeatForever());
        i = cc.rotateBy(.8, 90), n = cc.rotateBy(.8, -90), r = cc.sequence(i, n);
        this.AdItemRight.node.runAction(r.repeatForever()), GameGlobal.Net.requestZSAd(function () {
            for (var t = 0; t < e.AdItemArray.length; ++t) e.AdItemArray[t].initAd(t);
            e.AdItemLeft.initBorderAd(0), e.AdItemRight.initBorderAd(1)
        })
    },

    onDisable: function () {
        this.AdItemLeft.node.stopAllActions()
        this.AdItemRight.node.stopAllActions()
    }
})