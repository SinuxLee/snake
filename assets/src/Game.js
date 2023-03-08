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
        
        _SnakeHeadUseList: [],
        _SnakeHeadFreeList: [],
        _SnakeBodyUseList: [],
        _SnakeBodyFreeList: [],
        _SnakeFoodUseList: [],
        _SnakeFoodFreeList: [],
        _SnakeNameFreeList: [],
        _SnakeNameUseList: [],
        _SnakeGodSpriteList: [],
        _SnakeGoldUseList: []
    },

    onLoad: function() {
        cc.game.setFrameRate(60)

        for (let i = 0; i < 10; i++) {
            this._SnakeHeadFreeList.push(cc.instantiate(this.SnakeHeadPrefab));
            this._SnakeNameFreeList.push(cc.instantiate(this.SnakeNamePrefab));
            this._SnakeGodSpriteList.push(cc.instantiate(this.GodSpritePrefab));
        }

        for (let i = 0; i < 300; i++) {
            this._SnakeBodyFreeList.push(cc.instantiate(this.SnakeBodyPrefab));
            this._SnakeFoodFreeList.push(cc.instantiate(this.SnakeFoodPrefab));
        }
    },

    start: function() {
        if (!window.wx) return
        const cvs = wx.getOpenDataContext().canvas;
        cvs && (cvs.width = 2 * cc.game.canvas.width, cvs.height = 2 * cc.game.canvas.height)
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
        for (var e = 0; e < this._SnakeFoodUseList.length; ++e) {
            this._SnakeFoodFreeList.push(this._SnakeFoodUseList[e])
            this._SnakeFoodUseList[e].parent = null;
        }
        this._SnakeFoodUseList.splice(0, this._SnakeFoodUseList.length)
    },

    GetFree: function(freeList, usedList, prefab) {
        let item = freeList.pop();
        if (item == null) item = cc.instantiate(prefab);
        return usedList.push(item), item
    },

    DelUse: function(freeList, usedList, node) {
        node.parent = null;
        const idx = usedList.indexOf(node);
        if(idx < 0 || idx >= usedList.length) return false;

        usedList.splice(idx, 1)
        freeList.push(node)
        return true
    }
})