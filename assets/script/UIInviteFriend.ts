import { UIType } from './UIType';
import UIInviteFriendItem from './UIInviteFriendItem';

const { ccclass, property } = cc._decorator;

@ccclass
export default class extends cc.Component {
    @property([UIInviteFriendItem])
    public FriendCtrlArray: UIInviteFriendItem[] = [];

    private CloseBtn: cc.Button = null;
    private InviteBtn: cc.Button = null;

    onLoad() {
        this.CloseBtn = this.node.getChildByName('closeButton').getComponent(cc.Button);
        this.InviteBtn = this.node.getChildByName('InviteBtn').getComponent(cc.Button);

        this.FriendCtrlArray.forEach((item,idx) => item.initIndex(idx));
    }

    onEnable() {
        this.FriendCtrlArray.forEach(item => item.resetShow());
        GameGlobal.Net.requestFriendList()
    }

    start() {
        this.InviteBtn.node.on(cc.Node.EventType.TOUCH_END, this.onFriendInvite, this)
        this.CloseBtn.node.on(cc.Node.EventType.TOUCH_END, this.onClose, this)
        this.node.on(cc.Node.EventType.TOUCH_END, this.onBlock, this)
    }

    refreshList() {
        this.FriendCtrlArray.forEach(item => item.refreshUI());
    }

    onFriendInvite(event: cc.Event.EventTouch) {
        event.stopPropagation();
        const wx = GameGlobal.WeiXinPlatform;

        if (wx._WXOpenID && wx._WXOpenID.length > 0) {
            GameGlobal.WeiXinPlatform.showShare(() => { }, () => { })
        }
    }

    onClose(event: cc.Event.EventTouch) {
        event.stopPropagation()
        GameGlobal.UIManager.closeUI(UIType.UIType_InviteFriend)
    }

    onBlock(event: cc.Event.EventTouch) {
        event.stopPropagation()
    }
}
