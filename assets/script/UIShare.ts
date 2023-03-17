import { UIType } from './UIType';

const { ccclass, property } = cc._decorator;

@ccclass
export default class extends cc.Component {
    private _MatchAd = null;
    private _CurVideoAd = null;

    private InviteBtn: cc.Button = null;
    private VideoBtn: cc.Button = null;
    private CloseBtn: cc.Button = null;

    onLoad(){
        this.InviteBtn = this.node.getChildByName('btnInvite').getComponent(cc.Button);
        this.VideoBtn = this.node.getChildByName('btnVideo').getComponent(cc.Button);
        this.CloseBtn = this.node.getChildByName('btnClose').getComponent(cc.Button);
    }

    start () {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onPanelClick, this)
        this.InviteBtn.node.on(cc.Node.EventType.TOUCH_END, this.onInviteBtn, this)
        this.CloseBtn.node.on(cc.Node.EventType.TOUCH_END, this.onCloseBtn, this)
        this.VideoBtn.node.on(cc.Node.EventType.TOUCH_END, this.onVideoBtn, this)
    }

    onDisable () {
        window.wx && this._MatchAd && this._MatchAd.hide()
    }

    onPanelClick (event: cc.Event.EventTouch) {
        event.stopPropagation()
    }

    onInviteBtn (event: cc.Event.EventTouch) {
        event.stopPropagation();
        if (window.wx == null) return

        const mgr = GameGlobal.DataManager;
        wx.shareAppMessage({
            title: mgr.getShareTitle(),
            imageUrl: mgr.getShareImage(),
            success: function (e) { 
                wx.showToast({
                    title: "分享成功",
                    icon: "success",
                    duration: 1500
                })
            },
            fail: function (e) {
            }
        })
    }

    onVideoBtn () {
        if (this._CurVideoAd == null) return
        
        this._CurVideoAd.onLoad(() =>{
            console.log("激励视频 广告加载成功")
        })
        
        this._CurVideoAd.show().catch((t) =>{
            this._CurVideoAd.load().then(() =>{
                return this._CurVideoAd.show()
            })
        })
        
        this._CurVideoAd.onClose((e) =>{
            (e && e.isEnded || void 0 === e) && wx.showToast({
                title: "+ 10",
                icon: "success",
                duration: 1500
            })
        })
    }

    onCloseBtn (event: cc.Event.EventTouch) {
        event.stopPropagation()
        GameGlobal.UIManager.closeUI(UIType.UIType_HallInvite)
    }
}