cc.Class({
    extends: cc.Component,
    properties: {
        Atlas: {
            default: null,
            type: cc.SpriteAtlas
        },
        _Type: 1
    },
    start: function() {},
    setType: function(e) {
        (e < 1 || e > 5) && (e = 1), this._Type = e;
        var t = this.node.getComponent(cc.Sprite),
            i = "food_" + e,
            n = this.Atlas.getSpriteFrame(i);
        n && (t.spriteFrame = n)
    },
    getAddWeight: function() {
        return 2
    }
})