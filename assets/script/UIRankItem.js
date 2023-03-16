cc.Class({
    extends: cc.Component,
    properties: {
        IndexLabel: {
            default: null,
            type: cc.Label
        },
        HeadImageSprite: {
            default: null,
            type: cc.Sprite
        },
        NickNameLabel: {
            default: null,
            type: cc.Label
        },
        ScoreLabel: {
            default: null,
            type: cc.Label
        },
        IndexSprite: {
            default: null,
            type: cc.Sprite
        }
    },

    init: function (e, t) {
        this.IndexLabel.string = (e + 1).toString()
        this.createImage(t.url)
        this.NickNameLabel.string = t.nick
        this.ScoreLabel.string = "" + t.score
        this.IndexSprite.node.active = e <= 2
    },

    createImage: function (url) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            if (window.wx == null) return
            try {
                const image = wx.createImage();
                image.src = url
                image.onload = () =>{
                    try {
                        const texture = new cc.Texture2D();
                        texture.initWithElement(image)
                        texture.handleLoadedTexture()
                        this.HeadImageSprite.spriteFrame = new cc.SpriteFrame(texture)
                    } catch (e) {
                        this.HeadImageSprite.node.active = false
                    }
                }
            } catch (e) {
                this.HeadImageSprite.node.active = false
            }
        } else if (cc.sys.platform === cc.sys.QQ_PLAY){
            try {
                const image = new Image();
                image.src = url;
                image.onload = () =>{
                    try {
                        const texture = new cc.Texture2D;
                        texture.initWithElement(image)
                        texture.handleLoadedTexture()
                        this.HeadImageSprite.spriteFrame = new cc.SpriteFrame(texture)
                    } catch (e) {
                        this.HeadImageSprite.node.active = false
                    }
                }
            } catch (e) {
                this.HeadImageSprite.node.active = false
            }
        }
    }
})