cc.Class({
    extends: cc.Component,
    properties: {
        Atlas: {
            default: null,
            type: cc.SpriteAtlas
        },
        _Type: 1
    },
 
    setType: function(type) {
        if(type < 1 || type > 5) (type = 1);
        this._Type = type;

        const sprite = this.node.getComponent(cc.Sprite)
        const name = "food_" + type
        const frame = this.Atlas.getSpriteFrame(name);
        
        frame && (sprite.spriteFrame = frame)
    },

    getAddWeight: function() {
        return 2
    }
})