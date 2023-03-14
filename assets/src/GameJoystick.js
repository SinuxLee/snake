const JoystickCommon = require('JoystickCommon');
const JoystickBG = require('JoystickBG');

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
            type: JoystickBG,
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
            default: JoystickCommon.TouchType.DEFAULT,
            type: JoystickCommon.TouchType,
            displayName: "触摸类型"
        },
        directionType: {
            default: JoystickCommon.DirectionType.ALL,
            type: JoystickCommon.DirectionType,
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

    onLoad: function () {
        this._createStickSprite()
        this.touchType == JoystickCommon.TouchType.FOLLOW && this._initTouchEvent()
    },

    _createStickSprite: function () {
        this.ring.node.setPosition(this.stickX, this.stickY)
        this.dot.setPosition(this.stickX, this.stickY)
    },

    _initTouchEvent: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, this._touchStartEvent, this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._touchMoveEvent, this)
        this.node.on(cc.Node.EventType.TOUCH_END, this._touchEndEvent, this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._touchEndEvent, this)
    },

    setOPTarget: function (e) {
        this.sprite = e
        this.ring._playerNode = e
    },

    setCallback: function (e, t) {
        this.ring.callBackObj = e
    },

    _touchStartEvent: function (e) {
        this._touchLocation = e.getLocation();
        const pos = this.node.convertToNodeSpaceAR(e.getLocation());
        this.ring.node.setPosition(pos)
        this.dot.setPosition(pos)
        this._stickPos = pos
    },

    _touchMoveEvent: function (e) {
        const eventPos = e.getLocation();
        if (this._touchLocation.x == eventPos.x && this._touchLocation.y == eventPos.y) return false;
        
        const pos = this.ring.node.convertToNodeSpaceAR(e.getLocation());
        const distance = this.ring._getDistance(pos, cc.Vec2(0, 0));
        const halfWidth = this.ring.node.width / 2;
        const newPos = cc.Vec2(this._stickPos.x + pos.x, this._stickPos.y + pos.y);

        if (halfWidth > distance) this.dot.setPosition(newPos);
        else {
            const radian = this.ring._getRadian(newPos);
            const x = this._stickPos.x + Math.cos(radian) * halfWidth;
            const y = this._stickPos.y + Math.sin(radian) * halfWidth;
            this.dot.setPosition(cc.Vec2(x, y))
        }

        this.ring._getAngle(newPos)
        this.ring._setSpeed(newPos)
    },

    _touchEndEvent: function () {
        this.dot.setPosition(this.ring.node.getPosition())
        this.ring._speed = 0
    }
})