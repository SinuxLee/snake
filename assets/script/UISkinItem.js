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

    onLoad(){
        // this.SkinSprite = this.node.getChildByName('UIZSAdItem').getComponent(cc.Sprite);
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

    setCostType: function (type) {
        let frame = ""
        if (type == GameRewardType.RT_GOLD) {
            frame = "jinbi";
        } else if (type == GameRewardType.RT_DIAMOND) {
            frame = "zuan";
        } else if (type == GameRewardType.RT_FLOWER) {
            frame = "hua";
        }

        this.CostIcon.spriteFrame = this.ResAtlas.getSpriteFrame(frame)
    },

    setPrice: function (e) {
        this.GoldLabel.string = e
    },

    setIsOwn: function (isOwn) {
        this.LockSprite.node.active = !isOwn
        this.GoldBgSprite.node.active = !isOwn
    },

    setIsUse: function (e) {
        this.UseSprite.node.active = e
    },

    onSkinClick: function (e) {
        e.stopPropagation();
        const tag = e.target.taggame;

        const skin = GameGlobal.UIManager.getUI(UIType.UIType_Skin);
        if (skin) skin.setCurSelectSkin(tag)
    }
})