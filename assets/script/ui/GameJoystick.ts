import JoystickBG from './JoystickBG';

const { ccclass, property } = cc._decorator;

export enum TouchType {
    DEFAULT = 0,
    FOLLOW = 1,
}

export enum DirectionType{
    ALL = 0,
    FOUR = 4,
    EIGHT = 8
}

@ccclass
export default class extends cc.Component {
    @property({ type: cc.Node, displayName: "摇杆节点" })
    public dot: cc.Node = null;

    @property({ type: JoystickBG, displayName: "摇杆背景节点" })
    public ring: JoystickBG = null

    @property({ type: cc.Integer, displayName: "摇杆X位置" })
    public stickX: number = 0;

    @property({ type: cc.Integer, displayName: "摇杆Y位置" })
    public stickY: number = 0;

    @property({ type: cc.Enum(TouchType), displayName: "触摸类型" })
    public touchType: TouchType = TouchType.DEFAULT

    @property({ type: cc.Enum(DirectionType), displayName: "方向类型" })
    public directionType: DirectionType = DirectionType.ALL

    @property({ type: cc.Node, displayName: "操控的目标" })
    public sprite: cc.Node = null;

    private _stickPos: cc.Vec2 = null; // 摇杆当前位置
    private _touchLocation: cc.Vec2 = null; // 摇杆当前位置

    onLoad() {
        this.createStickSprite()
        if (this.touchType == TouchType.FOLLOW) this.initTouchEvent();
    }

    private createStickSprite() {
        this.ring.node.setPosition(this.stickX, this.stickY)
        this.dot.setPosition(this.stickX, this.stickY)
    }

    private initTouchEvent() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStartEvent, this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMoveEvent, this)
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEndEvent, this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEndEvent, this)
    }

    setOPTarget(target: cc.Node) {
        this.sprite = target
        this.ring._playerNode = target
    }

    setCallback(e: object) {
        this.ring.callBackObj = e
    }

    private touchStartEvent(event: cc.Event.EventTouch) {
        this._touchLocation = event.getLocation();
        const pos = this.node.convertToNodeSpaceAR(event.getLocation());
        this.ring.node.setPosition(pos)
        this.dot.setPosition(pos)
        this._stickPos = pos
    }

    private touchMoveEvent(event: cc.Event.EventTouch) {
        const eventPos = event.getLocation();
        if (eventPos.equals(this._touchLocation)) return false;

        const pos = this.ring.node.convertToNodeSpaceAR(eventPos);
        const distance = pos.mag();
        const halfWidth = this.ring.node.width / 2;
        const newPos = this._stickPos.add(pos);

        if (halfWidth > distance) this.dot.setPosition(newPos);
        else {
            const radian = this.ring.getRadian(newPos);
            const x = this._stickPos.x + Math.cos(radian) * halfWidth;
            const y = this._stickPos.y + Math.sin(radian) * halfWidth;
            this.dot.setPosition(x, y);
        }

        this.ring.getAngle(newPos)
        this.ring.setSpeed(newPos)
    }

    private touchEndEvent(event: cc.Event.EventTouch) {
        this.dot.setPosition(this.ring.node.getPosition())
        this.ring._speed = 0
    }
}