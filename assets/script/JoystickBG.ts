import JoystickCommon from './JoystickCommon';
import GameJoystick from './GameJoystick';

const radian = Math.PI / 180;
const { ccclass, property } = cc._decorator;

@ccclass
export default class extends cc.Component {
    @property({ type: cc.Node, displayName: "摇杆节点" })
    public dot: cc.Node = null;

    @property({ displayName: "当前触摸的角度" })
    public _angle = null;

    @property({ displayName: "弧度" })
    public _radian = null;

    public callBackObj: object = null;
    public _playerNode: cc.Node = null;
    public _speed = 0;

    private _joyCom: GameJoystick = null;
    private _speed1 = 1;
    private _speed2 = 1;
    private _opacity = 0;
    private _stickPos: cc.Vec3 = null;

    onLoad() {
        this._joyCom = this.node.parent.getComponent(GameJoystick)
        this._playerNode = this._joyCom.sprite
        this._joyCom.touchType == JoystickCommon.TouchType.DEFAULT && this.initTouchEvent()
    }

    private initTouchEvent() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStartEvent, this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMoveEvent, this)
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEndEvent, this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEndEvent, this)
    }

    update(dt: number) {
        switch (this._joyCom.directionType) {
            case JoystickCommon.DirectionType.ALL:
                this.allDirectionsMove(dt)
        }
    }

    allDirectionsMove(dt: number) {
        if (!this.callBackObj) return

        const x = Math.cos(this._angle * radian);
        const y = Math.sin(this._angle * radian);
        this.callBackObj.joyCallback(x, y, dt, this._angle)
    }

    getDistance(from: cc.Vec3, to: cc.Vec3) {
        return Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2))
    }

    getRadian(pos: cc.Vec3) {
        this._radian = Math.PI / 180 * this.getAngle(pos)
        return this._radian
    }

    getAngle(e: cc.Vec3) {
        const pos = this.node.getPosition();
        this._angle = Math.atan2(e.y - pos.y, e.x - pos.x) * (180 / Math.PI);
        return this._angle
    }

    setSpeed(e: cc.Vec3) {
        this.getDistance(e, this.node.getPosition()) < this._radius ? this._speed = this._speed1 : this._speed = this._speed2
    }

    private touchStartEvent(event: cc.Event.EventTouch) {
        const pos = this.node.convertToNodeSpaceAR(event.getLocation());
        const distance = pos.mag();
        const halfWidth = this.node.width / 2;
        if (distance >= halfWidth) return;

        this._stickPos = pos;
        const newPos = this.node.getPosition().add(pos);
        this.dot.setPosition(newPos)
    }

    touchMoveEvent(event: cc.Event.EventTouch) {
        const nodePos = this.node.getPosition()
        const pos = this.node.convertToNodeSpaceAR(event.getLocation());
        const distance = pos.mag();
        const halfWidth = this.node.width / 2;
        const newPos = nodePos.add(pos);

        if (halfWidth > distance) this.dot.setPosition(newPos);
        else {
            const radian = this.getRadian(newPos)
            const x = nodePos.x + Math.cos(radian) * halfWidth;
            const y = nodePos.y + Math.sin(radian) * halfWidth;
            this.dot.setPosition(x, y);
        }
        this.getAngle(newPos)
        this.setSpeed(newPos)
    }

    touchEndEvent() {
        this.dot.setPosition(this.node.getPosition())
        this._speed = 0
    }
}
