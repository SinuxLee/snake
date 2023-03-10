cc.Class({
    extends: cc.Component,
    properties: {
        Atlas: {
            default: null,
            type: cc.SpriteAtlas
        },
        _Snake: null,
        _lastMoveVec: cc.v2(1, 0),
        _moveVec: cc.v2(1, 0),
        _moveSpeed: 0,
        _IsFirstUpdate: true,
        _CurStartPos: cc.v2(0, 0),
        _CurMoveDistance: 0,
        _CurBodyIndex: -1,
        _MoveStartPos: cc.v2(0, 0),
        _lastPos: cc.v2(0, 0)
    },

    start: function () {
        this._IsFirstUpdate = true
    },

    setType: function (type) {
        if (type < 1 || type > 16) (type = 1);

        const sprite = this.node.getComponent(cc.Sprite);
        const name = "body_" + type;
        const frame = this.Atlas.getSpriteFrame(name);
        frame && (sprite.spriteFrame = frame)
    },

    setSnake: function (e) {
        this._Snake = e
    },

    setInitMoveDir: function (e) {
        this._lastMoveVec = e, this._moveVec = e
    },

    setMoveDir: function (e) { },
    getMoveDir: function () {
        return this._moveVec
    },

    getLastMoveDir: function () {
        return this._lastMoveVec
    },

    setMoveSpeed: function (e) {
        this._moveSpeed = e
    },

    setBodyIndex: function (e) {
        this._CurBodyIndex = e
    },

    reset: function () {
        this._IsFirstUpdate = true, this.node.width = 30, this.node.height = 30
    },

    getBodyPrePos: function (e, t, i, n, r, a) {
        if (0 == this._CurBodyIndex) {
            var o = this.node.width / 3;
            return a.add(n.mul(o))
        }
        var s = i[this._CurBodyIndex - 1];
        void 0 == s && cc.log("lastBody == undefined");
        o = -this.node.width / 2;
        var c = s.getComponent("SnakeBody");
        return c._lastPos.add(c._lastMoveVec.mul(o))
    },

    updateBody: function (e, t, i, n, r, a) {
        this._lastMoveVec = this._moveVec, this._lastPos = this.node.position;
        var o = this.getBodyPrePos(e, t, i, n, this._IsFirstUpdate, r);
        this._IsFirstUpdate = false;
        var s = o.sub(this.node.position),
            c = s.mag();
        c < 1 && (s = this._moveVec, c = this.node.width / 2), this._CurMoveDistance = c, this._MoveStartPos = this._lastPos, this._moveVec = s.normalize(), cc.pDistance(this.node.position, this._MoveStartPos) > this._CurMoveDistance && console.log("invalid distance------------------"), this.node.position = this.node.position.add(this._moveVec.mul(this._moveSpeed * e))
    }
})