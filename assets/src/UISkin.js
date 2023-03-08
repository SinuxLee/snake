var n = require('UIType');
cc.Class({
    extends: cc.Component,
    properties: {
        SkinPrefab: cc.Prefab,
        ViewContent: cc.Node,
        CloseBtn: cc.Button,
        UseBtn: cc.Button,
        BuyBtn: cc.Button,
        PreviewHead: cc.Sprite,
        PreviewBodyList: [cc.Sprite],
        HeadAtlas: cc.SpriteAtlas,
        BodyAtlas: cc.SpriteAtlas,
        _SkinSpritePrefabCache: [],
        _CurSlectSkinIndex: 0
    },
    onLoad: function() {
        for (var e = 0; e < 16; ++e) this._SkinSpritePrefabCache[e] = cc.instantiate(this.SkinPrefab), this._SkinSpritePrefabCache[e].parent = this.ViewContent
    },
    onEnable: function() {
        this.updateSkin()
    },
    onDisable: function() {},
    start: function() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onBlock, this), this.CloseBtn.node.on(cc.Node.EventType.TOUCH_END, this.onCloseBtn, this), this.UseBtn.node.on(cc.Node.EventType.TOUCH_END, this.onUseBtn, this), this.BuyBtn.node.on(cc.Node.EventType.TOUCH_END, this.onBuyBtn, this);
        for (var e = 0; e < 16; ++e) {
            this._SkinSpritePrefabCache[e].taggame = e, this._SkinSpritePrefabCache[e].getComponent("UISkinItem").initSkin()
        }
        this.updateSkin()
    },
    updateSkin: function() {
        if (0 != this._SkinSpritePrefabCache.length) {
            for (var e = GameGlobal.DataManager, t = 0; t < 16; ++t) {
                var i = e._SKinDataArray[t],
                    n = this._SkinSpritePrefabCache[t].getComponent("UISkinItem");
                i && (n.setIsOwn(i.IsOwn), n.setIsUse(i.IsUse), n.setPrice(i.Price), n.setCostType(i.Type))
            }
            this.updatePreview(this._CurSlectSkinIndex)
        }
    },
    onUseBtn: function(e) {
        e.stopPropagation();
        var t, i = GameGlobal.DataManager;
        if (!(this._CurSlectSkinIndex >= i._SKinDataArray.length) && (t = i._SKinDataArray[this._CurSlectSkinIndex]).IsOwn) return GameGlobal.localStorage.setItem("tcs_skinIndex", t.ID - 1), GameGlobal.Net.requestUserInfo(), GameGlobal.DataManager._CurSelectMode = 0, GameGlobal.UIManager.closeUI(n.UIType_Skin), void GameGlobal.UIManager.openUI(n.UIType_GameLoading)
    },
    onBuyBtn: function(e) {
        e.stopPropagation();
        var t = GameGlobal.DataManager;
        if (!(this._CurSlectSkinIndex >= t._SKinDataArray.length)) {
            if ((a = t._SKinDataArray[this._CurSlectSkinIndex]).Type == GameRewardType.RT_GOLD) {
                if (a.Price > t.CurGold) return void GameGlobal.UIManager.showMessage("金币不足，无法购买");
                GameGlobal.localStorage.setItem("tcs_gold", t.CurGold - a.Price)
            } else if (a.Type == GameRewardType.RT_DIAMOND) {
                if (a.Price > t.CurDiamond) return void GameGlobal.UIManager.showMessage("钻石不足，无法购买");
                GameGlobal.localStorage.setItem("tcs_diamond", t.CurDiamond - a.Price)
            }
            for (var i = [], n = t._SKinDataArray.length, r = 0; r < n; ++r) {
                (a = t._SKinDataArray[r]).IsOwn && i.push(r + 1)
            }
            i.push(this._CurSlectSkinIndex + 1);
            var a, o = JSON.stringify({
                skin_list: i
            });
            return GameGlobal.localStorage.setItem("tcs_skinlist", o), void GameGlobal.Net.requestUserInfo()
        }
    },
    setCurSelectSkin: function(e) {
        this._CurSlectSkinIndex = e, this.updatePreview(e)
    },
    updatePreview: function(e) {
        var t = "biaoqing_" + (e + 1),
            i = this.HeadAtlas.getSpriteFrame(t);
        if (i && (this.PreviewHead.spriteFrame = i), t = "body_" + (e + 1), i = this.BodyAtlas.getSpriteFrame(t))
            for (var n = 0; n < this.PreviewBodyList.length; ++n) this.PreviewBodyList[n].spriteFrame = i;
        var r = GameGlobal.DataManager;
        if (!(e >= r._SKinDataArray.length)) {
            var a = r._SKinDataArray[e];
            a && (a.IsOwn ? (this.BuyBtn.node.active = false, this.UseBtn.node.active = !a.IsUse) : (this.BuyBtn.node.active = true, this.UseBtn.node.active = false))
        }
    },
    onBlock: function(e) {
        e.stopPropagation()
    },
    onCloseBtn: function(e) {
        e.stopPropagation(), GameGlobal.UIManager.closeUI(n.UIType_Skin)
    }
})