import { UIType } from './UIType';

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

    onLoad: function () {
        for (let e = 0; e < 16; ++e) {
            this._SkinSpritePrefabCache[e] = cc.instantiate(this.SkinPrefab)
            this._SkinSpritePrefabCache[e].parent = this.ViewContent
        }
    },

    onEnable: function () {
        this.updateSkin()
    },

    start: function () {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onBlock, this)
        this.CloseBtn.node.on(cc.Node.EventType.TOUCH_END, this.onCloseBtn, this)
        this.UseBtn.node.on(cc.Node.EventType.TOUCH_END, this.onUseBtn, this)
        this.BuyBtn.node.on(cc.Node.EventType.TOUCH_END, this.onBuyBtn, this);

        for (let e = 0; e < 16; ++e) {
            this._SkinSpritePrefabCache[e].taggame = e
            this._SkinSpritePrefabCache[e].getComponent("UISkinItem").initSkin()
        }
        this.updateSkin()
    },

    updateSkin: function () {
        if (0 != this._SkinSpritePrefabCache.length) {
            const mgr = GameGlobal.DataManager;
            for (let t = 0; t < 16; ++t) {
                const skin = mgr._SKinDataArray[t]
                if (skin == null) continue;
                const item = this._SkinSpritePrefabCache[t].getComponent("UISkinItem");
                item.setIsOwn(skin.IsOwn)
                item.setIsUse(skin.IsUse)
                item.setPrice(skin.Price)
                item.setCostType(skin.Type)
            }
            this.updatePreview(this._CurSlectSkinIndex)
        }
    },

    onUseBtn: function (e) {
        e.stopPropagation();
        const mgr = GameGlobal.DataManager;
        if (this._CurSlectSkinIndex >= mgr._SKinDataArray.length) return

        const skin = mgr._SKinDataArray[this._CurSlectSkinIndex]
        if (!skin.IsOwn) return

        GameGlobal.localStorage.setItem("tcs_skinIndex", skin.ID - 1)
        GameGlobal.Net.requestUserInfo()
        GameGlobal.DataManager._CurSelectMode = 0
        GameGlobal.UIManager.closeUI(UIType.UIType_Skin)
        GameGlobal.UIManager.openUI(UIType.UIType_GameLoading)
    },

    onBuyBtn: function (e) {
        e.stopPropagation();
        const mgr = GameGlobal.DataManager;
        if (this._CurSlectSkinIndex >= mgr._SKinDataArray.length) return

        let item = mgr._SKinDataArray[this._CurSlectSkinIndex]
        if (item.Type == GameRewardType.RT_GOLD) {
            if (item.Price > mgr.CurGold) return GameGlobal.UIManager.showMessage("金币不足，无法购买");
            GameGlobal.localStorage.setItem("tcs_gold", mgr.CurGold - item.Price)
        } else if (item.Type == GameRewardType.RT_DIAMOND) {
            if (item.Price > mgr.CurDiamond) return GameGlobal.UIManager.showMessage("钻石不足，无法购买");
            GameGlobal.localStorage.setItem("tcs_diamond", mgr.CurDiamond - item.Price)
        }

        const skinList = []
        const len = mgr._SKinDataArray.length; 
        for (let r = 0; r < len; ++r) {
            item = mgr._SKinDataArray[r]
            item.IsOwn && skinList.push(r + 1)
        }
        skinList.push(this._CurSlectSkinIndex + 1);

        const data = JSON.stringify({skin_list: skinList});
        GameGlobal.localStorage.setItem("tcs_skinlist", data);
        GameGlobal.Net.requestUserInfo();
    },

    setCurSelectSkin: function (e) {
        this._CurSlectSkinIndex = e
        this.updatePreview(e)
    },

    updatePreview: function (idx) {
        let name = "biaoqing_" + (idx + 1)
        let frame = this.HeadAtlas.getSpriteFrame(name);
        if (frame == null) return;
        this.PreviewHead.spriteFrame = frame

        name = "body_" + (idx + 1)
        frame = this.BodyAtlas.getSpriteFrame(name)
        for (let n = 0; n < this.PreviewBodyList.length; ++n) this.PreviewBodyList[n].spriteFrame = frame;

        const mgr = GameGlobal.DataManager;
        if (idx >= mgr._SKinDataArray.length) return

        const skin = mgr._SKinDataArray[idx];
        if (skin == null) return
        if (skin.IsOwn) {
            this.BuyBtn.node.active = false
            this.UseBtn.node.active = !skin.IsUse
        } else {
            this.BuyBtn.node.active = true
            this.UseBtn.node.active = false
        }
    },

    onBlock: function (e) {
        e.stopPropagation()
    },

    onCloseBtn: function (e) {
        e.stopPropagation()
        GameGlobal.UIManager.closeUI(UIType.UIType_Skin)
    }
})