const UIType = require('UIType');

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
        var e = this;
        if (cc.sys.platform === cc.sys.QQ_PLAY) {
            e.ScrollviewContent.removeAllChildren();
            BK.QQ.getRankListWithoutRoom("score", 1, 0, function (t, i, n) {
                if (BK.Script.log(1, 1, "getRankListWithoutRoom callback  cmd" + i + " errCode:" + t + "  data:" + JSON.stringify(n)), 0 === t) {
                    if (n)
                        for (var r = 0; r < n.data.ranking_list.length; ++r) {
                            var a = n.data.ranking_list[r],
                                o = cc.instantiate(e.RankPrefab);
                            o.getComponent("UIRankItem").init(r, a), e.ScrollviewContent.addChild(o)
                        }
                } else BK.Script.log(1, 1, "获取排行榜数据失败!错误码：" + t)
            })
        }
    },

    start: function () {
        this.CloseBtn.node.on(cc.Node.EventType.TOUCH_END, this.onClose, this)
    },

    onClose: function (e) {
        e.stopPropagation(), GameGlobal.UIManager.closeUI(UIType.UIType_RankQQ)
    }
})