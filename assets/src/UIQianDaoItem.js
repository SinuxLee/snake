new Array("一", "二", "三", "四", "五", "六", "七");
cc.Class({
    extends: cc.Component,
    properties: {
        DayLabel: cc.Label,
        RewardSprite: cc.Sprite,
        RewardLabel: cc.Label,
        MaskSprite: cc.Sprite,
        ReWardAtlas: cc.SpriteAtlas
    },
    start: function() {},
    setParam: function(e, t, i) {
        this.DayLabel.string = "第" + e + "天";
        var n = "";
        t == GameRewardType.RT_GOLD ? (this.RewardSprite.spriteFrame = this.ReWardAtlas.getSpriteFrame("jinbi"), n = "金币") : t == GameRewardType.RT_DIAMOND ? (this.RewardSprite.spriteFrame = this.ReWardAtlas.getSpriteFrame("zuan"), n = "钻石") : t == GameRewardType.RT_FLOWER && (this.RewardSprite.spriteFrame = this.ReWardAtlas.getSpriteFrame("hua"), n = "花"), this.RewardLabel.string = i + n
    },
    setMask: function(e) {
        this.MaskSprite && (this.MaskSprite.node.active = e)
    }
})