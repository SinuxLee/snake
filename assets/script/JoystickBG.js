import JoystickCommon from './JoystickCommon';
const radian = Math.PI / 180;

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

    onLoad: function () {
        this._joyCom = this.node.parent.getComponent("GameJoystick")
        this._playerNode = this._joyCom.sprite
        this._joyCom.touchType == JoystickCommon.TouchType.DEFAULT && this._initTouchEvent()
    },

    _initTouchEvent: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, this._touchStartEvent, this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._touchMoveEvent, this)
        this.node.on(cc.Node.EventType.TOUCH_END, this._touchEndEvent, this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._touchEndEvent, this)
    },

    update: function (dt) {
        switch (this._joyCom.directionType) {
            case JoystickCommon.DirectionType.ALL:
                this._allDirectionsMove(dt)
        }
    },

    _allDirectionsMove: function (dt) {
        if (!this.callBackObj) return
        
        const x = Math.cos(this._angle * radian);
        const y = Math.sin(this._angle * radian);
        this.callBackObj.joyCallback(x, y, dt, this._angle)
    },

    _getDistance: function (e, t) {
        return Math.sqrt(Math.pow(e.x - t.x, 2) + Math.pow(e.y - t.y, 2))
    },

    _getRadian: function (e) {
        return this._radian = Math.PI / 180 * this._getAngle(e), this._radian
    },

    _getAngle: function (e) {
        const pos = this.node.getPosition();
        this._angle = Math.atan2(e.y - pos.y, e.x - pos.x) * (180 / Math.PI);
        return this._angle
    },

    _setSpeed: function (e) {
        this._getDistance(e, this.node.getPosition()) < this._radius ? this._speed = this._speed1 : this._speed = this._speed2
    },

    _touchStartEvent: function (e) {
        const pos = this.node.convertToNodeSpaceAR(e.getLocation());
        const distance = this._getDistance(pos, cc.Vec2(0, 0));
        const halfWidth = this.node.width / 2;
        this._stickPos = pos;

        const newPos = cc.Vec2(this.node.getPosition().x + pos.x, this.node.getPosition().y + pos.y)
        return halfWidth > distance && (this.dot.setPosition(newPos), true)
    },

    _touchMoveEvent: function (e) {
        const nodePos = this.node.getPosition()
        const pos = this.node.convertToNodeSpaceAR(e.getLocation());
        const distance = this._getDistance(pos, cc.Vec2(0, 0));
        const halfWidth = this.node.width / 2;
        const newPos = cc.Vec2(nodePos.x + pos.x, nodePos.y + pos.y);

        if (halfWidth > distance) this.dot.setPosition(newPos);
        else {
            const radian = this._getRadian(newPos)
            const x = nodePos.x + Math.cos(radian) * halfWidth;
            const y = nodePos.y + Math.sin(radian) * halfWidth;
            this.dot.setPosition(cc.Vec2(x, y))
        }
        this._getAngle(newPos)
        this._setSpeed(newPos)
    },

    _touchEndEvent: function () {
        this.dot.setPosition(this.node.getPosition()), this._speed = 0
    }
})