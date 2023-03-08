var n = require('JoystickCommon'),
    r = require('JoystickBG');
cc.Class({
    extends: cc.Component,
    properties: {
        dot: {
            default: null,
            type: cc.Node,
            displayName: "摇杆节点"
        },
        ring: {
            default: null,
            type: r,
            displayName: "摇杆背景节点"
        },
        stickX: {
            default: 0,
            displayName: "摇杆X位置"
        },
        stickY: {
            default: 0,
            displayName: "摇杆Y位置"
        },
        touchType: {
            default: n.TouchType.DEFAULT,
            type: n.TouchType,
            displayName: "触摸类型"
        },
        directionType: {
            default: n.DirectionType.ALL,
            type: n.DirectionType,
            displayName: "方向类型"
        },
        sprite: {
            default: null,
            type: cc.Node,
            displayName: "操控的目标"
        },
        _stickPos: {
            default: null,
            type: cc.Node,
            displayName: "摇杆当前位置"
        },
        _touchLocation: {
            default: null,
            type: cc.Node,
            displayName: "摇杆当前位置"
        }
    },
    onLoad: function() {
        this._createStickSprite(), this.touchType == n.TouchType.FOLLOW && this._initTouchEvent()
    },
    _createStickSprite: function() {
        this.ring.node.setPosition(this.stickX, this.stickY), this.dot.setPosition(this.stickX, this.stickY)
    },
    _initTouchEvent: function() {
        this.node.on(cc.Node.EventType.TOUCH_START, this._touchStartEvent, this), this.node.on(cc.Node.EventType.TOUCH_MOVE, this._touchMoveEvent, this), this.node.on(cc.Node.EventType.TOUCH_END, this._touchEndEvent, this), this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._touchEndEvent, this)
    },
    setOPTarget: function(e) {
        this.sprite = e, this.ring._playerNode = e
    },
    setCallback: function(e, t) {
        this.ring.callBackObj = e
    },
    _touchStartEvent: function(e) {
        this._touchLocation = e.getLocation();
        var t = this.node.convertToNodeSpaceAR(e.getLocation());
        this.ring.node.setPosition(t), this.dot.setPosition(t), this._stickPos = t
    },
    _touchMoveEvent: function(e) {
        if (this._touchLocation.x == e.getLocation().x && this._touchLocation.y == e.getLocation().y) return !1;
        var t = this.ring.node.convertToNodeSpaceAR(e.getLocation()),
            i = this.ring._getDistance(t, cc.Vec2(0, 0)),
            n = this.ring.node.width / 2,
            r = this._stickPos.x + t.x,
            a = this._stickPos.y + t.y;
        if (n > i) this.dot.setPosition(cc.Vec2(r, a));
        else {
            var o = this._stickPos.x + Math.cos(this.ring._getRadian(cc.Vec2(r, a))) * n,
                s = this._stickPos.y + Math.sin(this.ring._getRadian(cc.Vec2(r, a))) * n;
            this.dot.setPosition(cc.Vec2(o, s))
        }
        this.ring._getAngle(cc.Vec2(r, a)), this.ring._setSpeed(cc.Vec2(r, a))
    },
    _touchEndEvent: function() {
        this.dot.setPosition(this.ring.node.getPosition()), this.ring._speed = 0
    }
})