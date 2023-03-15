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
        this._Index = e;
        this._IsBorderAd = false;
        const adData = GameGlobal.DataManager._CurZSAdData
        if (this._Index >= adData.app_link_list.length) return

        this.node.active = true
        this.AdSprite.node.active = false
        const link = adData.app_link_list[this._Index]
        if (link.app_icon == null) return

        cc.loader.load({ url: adData.app_icon, type: "png" }, (e, asset) => {
            if (asset instanceof cc.Texture2D) {
                this.AdSprite.node.active = true;
                this.AdSprite.spriteFrame = new cc.SpriteFrame(asset);
            }
        })
    },

    initBorderAd: function (e) {
        this._IsBorderAd = true;
        this._Index = e;
        const adData = GameGlobal.DataManager._CurZSAdData;
        if (this._Index >= adData.app_cb_list.length) return

        this.node.active = true
        this.AdSprite.node.active = false
        const link = adData.app_cb_list[this._Index]
        if (link.app_icon == null) return

        cc.loader.load({ url: link.app_icon, type: "png" }, (e, asset) => {
            if (asset instanceof cc.Texture2D) {
                this.AdSprite.node.active = true;
                this.AdSprite.spriteFrame = new cc.SpriteFrame(asset)
            }
        })
    },

    onAdItemClick: function (e) {
        e.stopPropagation()
        if (window.wx == null) return;

        const adData = GameGlobal.DataManager._CurZSAdData;
        if (0 == this._IsBorderAd) {
            if (this._Index < adData.app_link_list.length) (adData = adData.app_link_list[this._Index]).appid && adData.link_path && (wx.navigateToMiniProgram({
                appId: adData.appid,
                path: adData.link_path
            }), GameGlobal.Net.requestZSAdCollect(adData.app_id))
        } else if (this._Index < adData.app_cb_list.length) (adData = adData.app_cb_list[this._Index]).appid && adData.link_path && (wx.navigateToMiniProgram({
            appId: adData.appid,
            path: adData.link_path
        }), GameGlobal.Net.requestZSAdCollect(adData.app_id))
    }
})