cc.Class({
    extends: cc.Component,
    properties: {
        DayLabel: cc.Label,
        RewardSprite: cc.Sprite,
        RewardLabel: cc.Label,
        MaskSprite: cc.Sprite,
        ReWardAtlas: cc.SpriteAtlas
    },

    setParam: function (day, type, count) {
        let itemName = "";
        let frame = "";
        if (type == GameRewardType.RT_GOLD) {
            frame = "jinbi";
            itemName = "金币"
        } else if (type == GameRewardType.RT_DIAMOND) {
            frame = "zuan";
            itemName = "钻石"
        } else if (type == GameRewardType.RT_FLOWER) {
            frame = "hua";
            itemName = "花"
        }

        this.DayLabel.string = `第${day}天`;
        this.RewardSprite.spriteFrame = this.ReWardAtlas.getSpriteFrame(frame);
        this.RewardLabel.string = count + itemName;
    },

    setMask: function (e) {
        this.MaskSprite && (this.MaskSprite.node.active = e)
    }
})