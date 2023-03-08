cc.Class({
    extends: cc.Component,
    properties: {
        AdSprite: cc.Sprite,
        _Index: 0,
        _IsBorderAd: false
    },

    start: function () {
        this.AdSprite.node.on(cc.Node.EventType.TOUCH_END, this.onAdItemClick, this)
    },

    initAd: function (e) {
        this._Index = e, this._IsBorderAd = false;
        var t = GameGlobal.DataManager._CurZSAdData,
            i = this;
        this._Index < t.app_link_list.length && (this.node.active = true, this.AdSprite.node.active = false, (t = t.app_link_list[this._Index]).app_icon && cc.loader.load({
            url: t.app_icon,
            type: "png"
        }, function (e, t) {
            if (t instanceof cc.Texture2D) {
                i.AdSprite.node.active = true;
                var n = new cc.SpriteFrame(t);
                i.AdSprite.spriteFrame = n
            }
        }))
    },

    initBorderAd: function (e) {
        this._IsBorderAd = true, this._Index = e;
        var t = GameGlobal.DataManager._CurZSAdData,
            i = this;
        this._Index < t.app_cb_list.length && (this.node.active = true, this.AdSprite.node.active = false, (t = t.app_cb_list[this._Index]).app_icon && cc.loader.load({
            url: t.app_icon,
            type: "png"
        }, function (e, t) {
            if (t instanceof cc.Texture2D) {
                i.AdSprite.node.active = true;
                var n = new cc.SpriteFrame(t);
                i.AdSprite.spriteFrame = n
            }
        }))
    },

    onAdItemClick: function (e) {
        if (e.stopPropagation(), window.wx) {
            var t = GameGlobal.DataManager._CurZSAdData;
            if (0 == this._IsBorderAd) {
                if (this._Index < t.app_link_list.length) (t = t.app_link_list[this._Index]).appid && t.link_path && (wx.navigateToMiniProgram({
                    appId: t.appid,
                    path: t.link_path
                }), GameGlobal.Net.requestZSAdCollect(t.app_id))
            } else if (this._Index < t.app_cb_list.length) (t = t.app_cb_list[this._Index]).appid && t.link_path && (wx.navigateToMiniProgram({
                appId: t.appid,
                path: t.link_path
            }), GameGlobal.Net.requestZSAdCollect(t.app_id))
        }
    }
})