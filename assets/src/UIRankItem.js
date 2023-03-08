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

    createImage: function (e) {
        var t = this;
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            if (void 0 == window.wx) return void console.log("createImage wx undefined");
            try {
                var i = wx.createImage();
                i.onload = function () {
                    try {
                        var e = new cc.Texture2D;
                        e.initWithElement(i), e.handleLoadedTexture(), t.HeadImageSprite.spriteFrame = new cc.SpriteFrame(e)
                    } catch (e) {
                        console.log(e), t.HeadImageSprite.node.active = false
                    }
                }, i.src = e
            } catch (e) {
                console.log(e), this.HeadImageSprite.node.active = false
            }
        } else if (cc.sys.platform === cc.sys.QQ_PLAY) try {
            var n = new Image;
            n.onload = function () {
                try {
                    var e = new cc.Texture2D;
                    e.initWithElement(n), e.handleLoadedTexture(), t.HeadImageSprite.spriteFrame = new cc.SpriteFrame(e)
                } catch (e) {
                    console.log(e), t.HeadImageSprite.node.active = false
                }
            }, n.src = e
        } catch (e) {
            console.log(e), this.HeadImageSprite.node.active = false
        }
    }
})