cc.Class({
    extends: cc.Component,
    properties: {
        DayLabel: cc.Label,
        RewardSprite: cc.Sprite,
        RewardLabel: cc.Label,
        MaskSprite: cc.Sprite,
        ReWardAtlas: cc.SpriteAtlas
    },

    setParam: function (e, type, i) {
        this.DayLabel.string = "第" + e + "天";
        let itemName = "";
        if (type == GameRewardType.RT_GOLD) {
            this.RewardSprite.spriteFrame = this.ReWardAtlas.getSpriteFrame("jinbi")
            itemName = "金币"
        } else if (type == GameRewardType.RT_DIAMOND) {
            this.RewardSprite.spriteFrame = this.ReWardAtlas.getSpriteFrame("zuan")
            itemName = "钻石"
        } else if (type == GameRewardType.RT_FLOWER) {
            this.RewardSprite.spriteFrame = this.ReWardAtlas.getSpriteFrame("hua")
            itemName = "花"
        }

        this.RewardLabel.string = i + itemName
    },

    setMask: function (e) {
        this.MaskSprite && (this.MaskSprite.node.active = e)
    }
})