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
        _IsFirstUpdate: !0,
        _CurStartPos: cc.v2(0, 0),
        _CurMoveDistance: 0,
        _CurBodyIndex: -1,
        _MoveStartPos: cc.v2(0, 0),
        _lastPos: cc.v2(0, 0)
    },
    start: function() {
        this._IsFirstUpdate = !0
    },
    setType: function(e) {
        (e < 1 || e > 16) && (e = 1);
        var t = this.node.getComponent(cc.Sprite),
            i = "body_" + e,
            n = this.Atlas.getSpriteFrame(i);
        n && (t.spriteFrame = n)
    },
    setSnake: function(e) {
        this._Snake = e
    },
    setInitMoveDir: function(e) {
        this._lastMoveVec = e, this._moveVec = e
    },
    setMoveDir: function(e) {},
    getMoveDir: function() {
        return this._moveVec
    },
    getLastMoveDir: function() {
        return this._lastMoveVec
    },
    setMoveSpeed: function(e) {
        this._moveSpeed = e
    },
    setBodyIndex: function(e) {
        this._CurBodyIndex = e
    },
    reset: function() {
        this._IsFirstUpdate = !0, this.node.width = 30, this.node.height = 30
    },
    getBodyPrePos1: function(e, t, i, n, r, a) {
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
    getBodyPrePos: function(e, t, i, n, r, a) {
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
    getBodyPreDir: function(e, t, i, n, r) {
        if (0 == this._CurBodyIndex) return i;
        var a = t[this._CurBodyIndex - 1];
        void 0 == a && cc.log("lastBody == undefined");
        this.node.width;
        return a.getComponent("SnakeBody")._lastMoveVec
    },
    updateBody: function(e, t, i, n, r, a) {
        this._lastMoveVec = this._moveVec, this._lastPos = this.node.position;
        var o = this.getBodyPrePos(e, t, i, n, this._IsFirstUpdate, r);
        this._IsFirstUpdate = !1;
        var s = o.sub(this.node.position),
            c = s.mag();
        c < 1 && (s = this._moveVec, c = this.node.width / 2), this._CurMoveDistance = c, this._MoveStartPos = this._lastPos, this._moveVec = s.normalize(), cc.pDistance(this.node.position, this._MoveStartPos) > this._CurMoveDistance && console.log("invalid distance------------------"), this.node.position = this.node.position.add(this._moveVec.mul(this._moveSpeed * e))
    }
})