import { UIType } from './UIType';

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

    start: function () {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onSkinClick, this)
    },

    initSkin: function () {
        let tag = this.node.taggame + 1;
        let frame = this.ResAtlas.getSpriteFrame(`xingxiang_${tag}`);
        if (frame) this.SkinSprite.spriteFrame = frame;

        frame = this.ResAtlas.getSpriteFrame(`xingxiangwenzi_${tag}`)
        if (frame) this.SkinText.spriteFrame = frame

        this.LockSprite.node.active = false
        this.UseSprite.node.active = false
    },

    setCostType: function (e) {
        e == GameRewardType.RT_GOLD ? this.CostIcon.spriteFrame = this.ResAtlas.getSpriteFrame("jinbi") : e == GameRewardType.RT_DIAMOND ? this.CostIcon.spriteFrame = this.ResAtlas.getSpriteFrame("zuan") : e == GameRewardType.RT_FLOWER && (this.CostIcon.spriteFrame = this.ResAtlas.getSpriteFrame("hua"))
    },

    setPrice: function (e) {
        this.GoldLabel.string = e
    },

    setIsOwn: function (e) {
        this.LockSprite.node.active = !e
        this.GoldBgSprite.node.active = !e
    },

    setIsUse: function (e) {
        this.UseSprite.node.active = e
    },

    onSkinClick: function (e) {
        e.stopPropagation();
        const tag = e.target.taggame;

        const skin = GameGlobal.UIManager.getUI(UIType.UIType_Skin);
        if(skin) skin.setCurSelectSkin(tag)
    }
})