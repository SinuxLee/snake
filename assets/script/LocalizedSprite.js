const SpriteFrameSet = require('SpriteFrameSet');

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
            type: SpriteFrameSet
        }
    },

    onLoad: function () {
        this.fetchRender()
    },

    fetchRender: function () {
        const sprite = this.getComponent(cc.Sprite);
        if (sprite == null) return 
        this.sprite = sprite
        this.updateSprite(window.i18n.curLang)
    },

    getSpriteFrameByLang: function (e) {
        for (let t = 0; t < this.spriteFrameSet.length; ++t)
            if (this.spriteFrameSet[t].language === e) return this.spriteFrameSet[t].spriteFrame
    },

    updateSprite: function (e) {
        if (!this.sprite) return cc.error("Failed to update localized sprite, sprite component is invalid!")

        let frame = this.getSpriteFrameByLang(e);
        if(!frame && this.spriteFrameSet[0]) {
            frame = this.spriteFrameSet[0].spriteFrame
        }

        this.sprite.spriteFrame = frame
    }
})