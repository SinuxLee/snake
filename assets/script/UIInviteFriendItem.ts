import DataManager from "./DataManager";
import Net from "./Net";
import WeiXinPlatform from "./WeiXinPlatform";
import UIManager from "./UIManager";
const { ccclass, property } = cc._decorator;

@ccclass
export default class extends cc.Component {
    private HeadSprite: cc.Sprite = null;
    private GoldSprite: cc.Sprite = null;
    private IndexLabel: cc.Label = null;
    private TakeBtn: cc.Button = null;
    private _Index =  0;

    onLoad () {
        this.HeadSprite = cc.find('headMask/headSprite', this.node).getComponent(cc.Sprite);
        this.GoldSprite = this.node.getChildByName('goldSprite').getComponent(cc.Sprite);
        this.IndexLabel = this.node.getChildByName('IndexLabel').getComponent(cc.Label);
        this.TakeBtn = this.node.getChildByName('takeBtn').getComponent(cc.Button);

        this.TakeBtn.node.on(cc.Node.EventType.TOUCH_END, this.onFriendTake, this)
    }

    initIndex (idx: number) {
        this.IndexLabel.string = ""
        this._Index = idx
    }

    resetShow () {
        this.TakeBtn.interactable = false
        this.GoldSprite.node.active = true
        this.HeadSprite.node.active = false;
        const mgr = DataManager.inst;
        this.IndexLabel.string = (mgr._ShareReward * Math.pow(2, this._Index)).toString();
    }

    refreshUI () {
        const mgr = DataManager.inst;
        this.IndexLabel.string = (mgr._ShareReward * Math.pow(2, this._Index)).toString();
        if (this._Index >= mgr._FriendDataList.length) return

        const item = mgr._FriendDataList[this._Index];
        this.TakeBtn.interactable = item.IsCanTake
        this.IndexLabel.string = item.Reward;

        if (item.HeadUrl == null && 0 == item.HeadUrl.length) return
        cc.loader.load({ url: item.HeadUrl, type: "png" }, (e, t) => {
            if (t instanceof cc.Texture2D) {
                this.GoldSprite.node.active = false;
                this.HeadSprite.node.active = true;
                this.HeadSprite.spriteFrame = new cc.SpriteFrame(t)
            }
        })
    }

    onFriendTake (event: cc.Event.EventTouch) {
        event.stopPropagation();
        const btn = event.target.getComponent(cc.Button);
        if (btn == null || btn.interactable == false) return

        const wx = WeiXinPlatform.inst;
        const net = Net.inst;
        const mgr = DataManager.inst;
        if (this._Index >= mgr._FriendDataList.length) return

        const item = mgr._FriendDataList[this._Index];
        const data = {
            session3rd: wx._SessionID,
            srcOpenID: item.OpenID,
            reward: item.Reward
        }
        net.request("entry/wxapp/InviteReward", {m: net.COMMON_M}, data, (e, t) => {
            e.diamond && DataManager.inst.setDiamond(e.diamond)
            UIManager.inst.showMessage("领取成功")
            UIManager.inst.RefreshCoin()
            Net.inst.requestFriendList()
        })
    }
}
