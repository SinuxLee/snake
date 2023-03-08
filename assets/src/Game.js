cc.Class({
    extends: cc.Component,
    properties: {
        SnakeHeadPrefab: {
            default: null,
            type: cc.Prefab
        },
        SnakeBodyPrefab: {
            default: null,
            type: cc.Prefab
        },
        SnakeFoodPrefab: {
            default: null,
            type: cc.Prefab
        },
        SnakeNamePrefab: {
            default: null,
            type: cc.Prefab
        },
        GodSpritePrefab: {
            default: null,
            type: cc.Prefab
        },
        _SnakeHeadUseList: {
            default: []
        },
        _SnakeHeadFreeList: {
            default: []
        },
        _SnakeBodyUseList: {
            default: []
        },
        _SnakeBodyFreeList: {
            default: []
        },
        _SnakeFoodUseList: {
            default: []
        },
        _SnakeFoodFreeList: {
            default: []
        },
        _SnakeNameFreeList: [],
        _SnakeNameUseList: [],
        _SnakeGodSpriteList: [],
        _SnakeGoldUseList: []
    },
    onLoad: function() {
        cc.log("Game onLoad start ------------------------------------");
        for (var e = 0; e < 11; ++e) this._SnakeHeadFreeList.push(cc.instantiate(this.SnakeHeadPrefab));
        for (e = 0; e < 10; ++e) this._SnakeNameFreeList.push(cc.instantiate(this.SnakeNamePrefab));
        for (e = 0; e < 300; ++e) this._SnakeBodyFreeList.push(cc.instantiate(this.SnakeBodyPrefab));
        for (e = 0; e < 300; ++e) this._SnakeFoodFreeList.push(cc.instantiate(this.SnakeFoodPrefab));
        for (e = 0; e < 10; ++e) this._SnakeGodSpriteList.push(cc.instantiate(this.GodSpritePrefab));
        cc.log("Game onLoad end ------------------------------------")
        cc.game.setFrameRate(60)
    },
    start: function() {
        if (void 0 != window.wx) {
            var e = wx.getOpenDataContext().canvas;
            e && (e.width = 2 * cc.game.canvas.width, e.height = 2 * cc.game.canvas.height)
        }
    },
    GetFreeHead: function() {
        return this.GetFree(this._SnakeHeadFreeList, this._SnakeHeadUseList, this.SnakeHeadPrefab)
    },
    DelUseHead: function(e) {
        this.DelUse(this._SnakeHeadFreeList, this._SnakeHeadUseList, e)
    },
    GetFreeNameLabel: function() {
        return this.GetFree(this._SnakeNameFreeList, this._SnakeNameUseList, this.SnakeNamePrefab)
    },
    DelUseNameLabel: function(e) {
        this.DelUse(this._SnakeNameFreeList, this._SnakeNameUseList, e)
    },
    GetFreeBody: function() {
        return this.GetFree(this._SnakeBodyFreeList, this._SnakeBodyUseList, this.SnakeBodyPrefab)
    },
    DelUseBody: function(e) {
        this.DelUse(this._SnakeBodyFreeList, this._SnakeBodyUseList, e)
    },
    GetFreeFood: function() {
        return this.GetFree(this._SnakeFoodFreeList, this._SnakeFoodUseList, this.SnakeFoodPrefab)
    },
    DelUseFood: function(e) {
        return this.DelUse(this._SnakeFoodFreeList, this._SnakeFoodUseList, e)
    },
    GetFreeGodSprite: function() {
        return this.GetFree(this._SnakeGodSpriteList, this._SnakeGoldUseList, this.GodSpritePrefab)
    },
    DelGodSprite: function(e) {
        return this.DelUse(this._SnakeGodSpriteList, this._SnakeGoldUseList, e)
    },
    DelAllFood: function() {
        for (var e = 0; e < this._SnakeFoodUseList.length; ++e) this._SnakeFoodFreeList.push(this._SnakeFoodUseList[e]), this._SnakeFoodUseList[e].parent = null;
        this._SnakeFoodUseList.splice(0, this._SnakeFoodUseList.length)
    },
    GetFree: function(e, t, i) {
        if (0 == e.length) {
            cc.log("GetFree new ");
            var n = cc.instantiate(i);
            return e.push(n), this.GetFree(e, t, i)
        }
        var r = e.pop();
        return t.push(r), r
    },
    DelUse: function(e, t, i) {
        i.parent = null;
        var n = t.indexOf(i);
        return !(n < 0 || n >= t.length) && (t.splice(n, 1), e.push(i), !0)
    }
})