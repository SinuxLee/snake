import DataManager from "../logic/DataManager";
import Net from "../logic/Net";

const { ccclass, property } = cc._decorator;

@ccclass
export default class extends cc.Component {
    private _AdSprite: cc.Sprite = null;
    private _Index = 0;
    private _IsBorderAd = false;

    start() {
        this._AdSprite = this.node.getChildByName('UIZSAdItem').getComponent(cc.Sprite);
        this._AdSprite.node.on(cc.Node.EventType.TOUCH_END, this.onAdItemClick, this)
    }

    initAd(idx: number) {
        this._Index = idx;
        this._IsBorderAd = false;
        const adData = DataManager.inst._CurZSAdData
        if (this._Index >= adData.app_link_list.length) return

        this.node.active = true
        this._AdSprite.node.active = false
        const link = adData.app_link_list[this._Index]
        if (link.app_icon == null) return

        cc.loader.load({ url: adData.app_icon, type: "png" }, (e, asset) => {
            if (asset instanceof cc.Texture2D) {
                this._AdSprite.node.active = true;
                this._AdSprite.spriteFrame = new cc.SpriteFrame(asset);
            }
        })
    }

    initBorderAd(e) {
        this._IsBorderAd = true;
        this._Index = e;
        const adData = DataManager.inst._CurZSAdData;
        if (this._Index >= adData.app_cb_list.length) return

        this.node.active = true
        this._AdSprite.node.active = false
        const link = adData.app_cb_list[this._Index]
        if (link.app_icon == null) return

        cc.loader.load({ url: link.app_icon, type: "png" }, (e, asset) => {
            if (asset instanceof cc.Texture2D) {
                this._AdSprite.node.active = true;
                this._AdSprite.spriteFrame = new cc.SpriteFrame(asset)
            }
        })
    }

    onAdItemClick(event: cc.Event.EventTouch) {
        event.stopPropagation()
        if (window.wx == null) return;

        const adData = DataManager.inst._CurZSAdData;
        if (false == this._IsBorderAd) {
            if (this._Index < adData.app_link_list.length) {
                const item = adData.app_link_list[this._Index]
                if (item.appid && item.link_path) {
                    wx.navigateToMiniProgram({ appId: adData.appid, path: adData.link_path })
                    Net.inst.requestZSAdCollect(adData.app_id)
                }
            }
        } else if (this._Index < adData.app_cb_list.length) {
            const item = adData.app_cb_list[this._Index]
            if (item.appid && item.link_path) {
                wx.navigateToMiniProgram({ appId: adData.appid, path: adData.link_path })
                Net.inst.requestZSAdCollect(adData.app_id)
            }
        }
    }
}