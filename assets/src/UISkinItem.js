var n = require('UIType');
cc.Class({
    extends: cc.Component,
    properties: {
        SkinSprite: cc.Sprite,
        GoldBgSprite: cc.Sprite,
        GoldLabel: cc.Label,
        SkinText: cc.Sprite,
        LockSprite: cc.Sprite,
        UseSprite: cc.Sprite,
        ResAtlas: cc.SpriteAtlas,
        CostIcon: cc.Sprite
    },
    start: function() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onSkinClick, this)
    },
    initSkin: function() {
        var e = this.node.taggame,
            t = "xingxiang_" + (e + 1),
            i = this.ResAtlas.getSpriteFrame(t);
        i && (this.SkinSprite.spriteFrame = i), t = "xingxiangwenzi_" + (e + 1), (i = this.ResAtlas.getSpriteFrame(t)) && (this.SkinText.spriteFrame = i), this.LockSprite.node.active = !1, this.UseSprite.node.active = !1
    },
    setCostType: function(e) {
        e == GameRewardType.RT_GOLD ? this.CostIcon.spriteFrame = this.ResAtlas.getSpriteFrame("jinbi") : e == GameRewardType.RT_DIAMOND ? this.CostIcon.spriteFrame = this.ResAtlas.getSpriteFrame("zuan") : e == GameRewardType.RT_FLOWER && (this.CostIcon.spriteFrame = this.ResAtlas.getSpriteFrame("hua"))
    },
    setPrice: function(e) {
        this.GoldLabel.string = e
    },
    setIsOwn: function(e) {
        this.LockSprite.node.active = !e, this.GoldBgSprite.node.active = !e
    },
    setIsUse: function(e) {
        this.UseSprite.node.active = e
    },
    onSkinClick: function(e) {
        e.stopPropagation();
        var t = e.target.taggame;
        cc.log("onSkinClick", t);
        var i = GameGlobal.UIManager.getUI(n.UIType_Skin);
        i && i.setCurSelectSkin(t)
    }
})