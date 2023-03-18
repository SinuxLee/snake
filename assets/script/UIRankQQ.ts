import { UIType } from './UIType';
import UIRankItem from './UIRankItem';

const { ccclass, property } = cc._decorator;

@ccclass
export default class extends cc.Component {
    @property(cc.Prefab)
    public RankPrefab: cc.Prefab = null;

    private ScrollviewContent: cc.Node = null;
    private CloseBtn: cc.Button = null;

    onLoad(){
        this.ScrollviewContent = cc.find('RankBg/RankView/view/content', this.node);
        this.CloseBtn = this.node.getChildByName('hideButton').getComponent(cc.Button);
        this.CloseBtn.node.on(cc.Node.EventType.TOUCH_END, this.onClose, this);
    }

    onEnable () {
        if (cc.sys.platform !== cc.sys.QQ_PLAY) return

        this.ScrollviewContent.removeAllChildren();
        BK.QQ.getRankListWithoutRoom("score", 1, 0, (code, cmd, rankInfo) => {
            BK.Script.log(1, 1, "getRankListWithoutRoom callback  cmd" + cmd + " errCode:" + code + "  data:" + JSON.stringify(rankInfo))
            if (0 !== code || !rankInfo) return BK.Script.log(1, 1, "获取排行榜数据失败!错误码：" + code)

            for (let idx = 0; idx < rankInfo.data.ranking_list.length; ++idx) {
                const item = rankInfo.data.ranking_list[idx];
                const node = cc.instantiate(this.RankPrefab);
                
                node.getComponent(UIRankItem).init(idx, item);
                this.ScrollviewContent.addChild(node)
            }
        })
    }

    onClose (event: cc.Event.EventTouch) {
        event.stopPropagation()
        GameGlobal.UIManager.closeUI(UIType.UIType_RankQQ)
    }
}
