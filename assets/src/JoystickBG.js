var n = require('JoystickCommon'),
    r = Math.PI / 180;
cc.Class({
    extends: cc.Component,
    properties: {
        dot: {
            default: null,
            type: cc.Node,
            displayName: "摇杆节点"
        },
        callBackObj: {
            default: null
        },
        _joyCom: {
            default: null,
            displayName: "joy Node"
        },
        _playerNode: {
            default: null,
            displayName: "被操作的目标Node"
        },
        _angle: {
            default: null,
            displayName: "当前触摸的角度"
        },
        _radian: {
            default: null,
            displayName: "弧度"
        },
        _speed: 0,
        _speed1: 1,
        _speed2: 1,
        _opacity: 0
    },
    onLoad: function() {
        this._joyCom = this.node.parent.getComponent("GameJoystick"), this._playerNode = this._joyCom.sprite, this._joyCom.touchType == n.TouchType.DEFAULT && this._initTouchEvent()
    },
    _initTouchEvent: function() {
        this.node.on(cc.Node.EventType.TOUCH_START, this._touchStartEvent, this), this.node.on(cc.Node.EventType.TOUCH_MOVE, this._touchMoveEvent, this), this.node.on(cc.Node.EventType.TOUCH_END, this._touchEndEvent, this), this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._touchEndEvent, this)
    },
    update: function(e) {
        switch (this._joyCom.directionType) {
            case n.DirectionType.ALL:
                this._allDirectionsMove(e)
        }
    },
    _allDirectionsMove: function(e) {
        if (this.callBackObj) {
            var t = Math.cos(this._angle * r),
                i = Math.sin(this._angle * r);
            this.callBackObj.joyCallback(t, i, e, this._angle)
        }
    },
    _getDistance: function(e, t) {
        return Math.sqrt(Math.pow(e.x - t.x, 2) + Math.pow(e.y - t.y, 2))
    },
    _getRadian: function(e) {
        return this._radian = Math.PI / 180 * this._getAngle(e), this._radian
    },
    _getAngle: function(e) {
        var t = this.node.getPosition();
        return this._angle = Math.atan2(e.y - t.y, e.x - t.x) * (180 / Math.PI), this._angle
    },
    _setSpeed: function(e) {
        this._getDistance(e, this.node.getPosition()) < this._radius ? this._speed = this._speed1 : this._speed = this._speed2
    },
    _touchStartEvent: function(e) {
        var t = this.node.convertToNodeSpaceAR(e.getLocation()),
            i = this._getDistance(t, cc.Vec2(0, 0)),
            n = this.node.width / 2;
        this._stickPos = t;
        var r = this.node.getPosition().x + t.x,
            a = this.node.getPosition().y + t.y;
        return n > i && (this.dot.setPosition(cc.Vec2(r, a)), true)
    },
    _touchMoveEvent: function(e) {
        var t = this.node.convertToNodeSpaceAR(e.getLocation()),
            i = this._getDistance(t, cc.Vec2(0, 0)),
            n = this.node.width / 2,
            r = this.node.getPosition().x + t.x,
            a = this.node.getPosition().y + t.y;
        if (n > i) this.dot.setPosition(cc.Vec2(r, a));
        else {
            var o = this.node.getPosition().x + Math.cos(this._getRadian(cc.Vec2(r, a))) * n,
                s = this.node.getPosition().y + Math.sin(this._getRadian(cc.Vec2(r, a))) * n;
            this.dot.setPosition(cc.Vec2(o, s))
        }
        this._getAngle(cc.Vec2(r, a)), this._setSpeed(cc.Vec2(r, a))
    },
    _touchEndEvent: function() {
        this.dot.setPosition(this.node.getPosition()), this._speed = 0
    }
})