import { UIType } from './UIType';

cc.Class({
    extends: cc.Component,
    properties: {
        RankPrefab: {
            default: null,
            type: cc.Prefab
        },
        ScrollviewContent: {
            default: null,
            type: cc.Node
        },
        CloseBtn: {
            default: null,
            type: cc.Button
        }
    },

    onEnable: function () {
        if (cc.sys.platform !== cc.sys.QQ_PLAY) return

        this.ScrollviewContent.removeAllChildren();
        BK.QQ.getRankListWithoutRoom("score", 1, 0, (code, cmd, rankInfo) => {
            BK.Script.log(1, 1, "getRankListWithoutRoom callback  cmd" + cmd + " errCode:" + code + "  data:" + JSON.stringify(rankInfo))
            if (0 !== code || !rankInfo) return BK.Script.log(1, 1, "获取排行榜数据失败!错误码：" + code)

            for (let idx = 0; idx < rankInfo.data.ranking_list.length; ++idx) {
                const item = rankInfo.data.ranking_list[idx];
                const node = cc.instantiate(this.RankPrefab);
                
                node.getComponent("UIRankItem").init(idx, item);
                this.ScrollviewContent.addChild(node)
            }
        })
    },

    start: function () {
        this.CloseBtn.node.on(cc.Node.EventType.TOUCH_END, this.onClose, this)
    },

    onClose: function (e) {
        e.stopPropagation()
        GameGlobal.UIManager.closeUI(UIType.UIType_RankQQ)
    }
})