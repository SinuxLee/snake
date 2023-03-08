var n = require('SpriteFrameSet');
cc.Class({
    extends: cc.Component,
    editor: {
        executeInEditMode: true,
        inspector: "packages://i18n/inspector/localized-sprite.js",
        menu: "i18n/LocalizedSprite"
    },
    properties: {
        spriteFrameSet: {
            default: [],
            type: n
        }
    },
    onLoad: function() {
        this.fetchRender()
    },
    fetchRender: function() {
        var e = this.getComponent(cc.Sprite);
        if (e) return this.sprite = e, void this.updateSprite(window.i18n.curLang)
    },
    getSpriteFrameByLang: function(e) {
        for (var t = 0; t < this.spriteFrameSet.length; ++t)
            if (this.spriteFrameSet[t].language === e) return this.spriteFrameSet[t].spriteFrame
    },
    updateSprite: function(e) {
        if (this.sprite) {
            var t = this.getSpriteFrameByLang(e);
            !t && this.spriteFrameSet[0] && (t = this.spriteFrameSet[0].spriteFrame), this.sprite.spriteFrame = t
        } else cc.error("Failed to update localized sprite, sprite component is invalid!")
    }
})