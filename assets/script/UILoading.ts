import { UIType } from './UIManager';
import DataManager from './DataManager';
import UIManager from './UIManager';

const { ccclass, property } = cc._decorator;

@ccclass
export default class extends cc.Component {
    private LoadingProgress: cc.ProgressBar = null;
    private GuangSprite: cc.Sprite = null;
    private _needUpdate = true;
    private _MatchAd =  null;

    onLoad(){
        this.LoadingProgress = this.node.getChildByName('loadProgress').getComponent(cc.ProgressBar);
    }

    onEnable () {
        this.LoadingProgress.progress = 0
        if(this.GuangSprite)this.GuangSprite.node.x = this.LoadingProgress.barSprite.node.x;
        this._needUpdate = true;
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            if (void 0 != window.wx) {
                if(this._MatchAd) {
                    this._MatchAd.destroy()
                    this._MatchAd = null
                }

                this._MatchAd = wx.createBannerAd({
                    adUnitId: DataManager.inst.BannerAdid1,
                    style: {
                        left: 0,
                        top: 0,
                        width: 300
                    }
                })
                
                this._MatchAd.show();
                this._MatchAd.onResize(() => {
                    const info = wx.getSystemInfoSync();
                    this._MatchAd.style.left = info.screenWidth - this._MatchAd.style.realWidth
                    this._MatchAd.style.top = info.screenHeight - this._MatchAd.style.realHeight
                })
            }
        } else if (cc.sys.platform === cc.sys.QQ_PLAY) {
            this._MatchAd = BK.Advertisement.createBannerAd({viewId: 1001})
            this._MatchAd.onError(function (e) {e.msg, e.code})
            this._MatchAd.show()
        }
    }

    onDisable () {
        this._needUpdate = false
        if(cc.sys.platform === cc.sys.WECHAT_GAME) {
            if(window.wx && this._MatchAd) this._MatchAd.hide() 
        }
        else if(cc.sys.platform === cc.sys.QQ_PLAY && this._MatchAd){
            this._MatchAd.destory() 
            this._MatchAd = null
        }
    }

    update (dt: number) {
        if(this._needUpdate == false) return
        const delta = .25 * dt;
        this.LoadingProgress.progress += delta
        
        if(this.LoadingProgress.progress >= 1) {
            this.LoadingProgress.progress = 1
            this._needUpdate = false
            UIManager.inst.closeUI(UIType.UIType_GameLoading)
            UIManager.inst.openUI(UIType.UIType_Game)
        }

        if(this.GuangSprite) {
            const length = this.LoadingProgress.progress * this.LoadingProgress.totalLength
            this.GuangSprite.node.x = this.LoadingProgress.barSprite.node.x + length
        }
    }
}
