import Snake from "./logic/Snake";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SnakeBody extends cc.Component {
    @property(cc.SpriteAtlas)
    public Atlas: cc.SpriteAtlas = null;

    public static _atlasLen = -1;
    public _Snake: Snake = null;

    private _lastMoveVec = cc.v2(1, 0);
    private _moveVec = cc.v2(1, 0);
    private _moveSpeed = 0;
    private _IsFirstUpdate = true;
    private _CurStartPos = cc.v2(0, 0);
    private _CurMoveDistance = 0;
    private _CurBodyIndex = -1;
    private _MoveStartPos = cc.v2(0, 0);
    private _lastPos = cc.v2(0, 0);

    start() {
        // if (SnakeBody._atlasLen < 0) SnakeBody._atlasLen = this.Atlas.getSpriteFrames().length;
        this._IsFirstUpdate = true
    }

    setType(type: number) {
        if (SnakeBody._atlasLen < 0) SnakeBody._atlasLen = this.Atlas.getSpriteFrames().length;
        if (type <= 0 || type > SnakeBody._atlasLen) type = 1;

        const sprite = this.node.getComponent(cc.Sprite);
        const frame = this.Atlas.getSpriteFrame(`body_${type}`);
        frame && (sprite.spriteFrame = frame)
    }

    setSnake(snake: Snake) {
        this._Snake = snake
    }

    setInitMoveDir(pos: cc.Vec2) {
        this._lastMoveVec = pos
        this._moveVec = pos
    }

    setMoveDir() { }

    getMoveDir() {
        return this._moveVec
    }

    getLastMoveDir() {
        return this._lastMoveVec
    }

    setMoveSpeed(speed: number) {
        this._moveSpeed = speed
    }

    setBodyIndex(idx: number) {
        this._CurBodyIndex = idx
    }

    reset() {
        this._IsFirstUpdate = true
        this.node.width = 30
        this.node.height = 30
    }

    getBodyPrePos(bodyList: cc.Node[], moveVec: cc.Vec2, pos: cc.Vec2): cc.Vec2 {
        if (this._CurBodyIndex == 0) return pos.add(moveVec.mul(this.node.width / 3));

        const node = bodyList[this._CurBodyIndex - 1];
        const body = node.getComponent(SnakeBody);
        return body._lastPos.add(body._lastMoveVec.mul(-this.node.width / 2))
    }

    updateBody(dt: number, bodyList: cc.Node[], moveVec: cc.Vec2, headPos: cc.Vec2) {
        this._lastMoveVec = this._moveVec;
        this._lastPos = this.node.position;
        const bodyPos = this.getBodyPrePos(bodyList, moveVec, headPos);
        this._IsFirstUpdate = false;

        let newPos = bodyPos.sub(this.node.position);
        let vecLen = newPos.mag();
        if (vecLen < 1) {
            newPos = this._moveVec
            vecLen = this.node.width / 2
        }

        this._CurMoveDistance = vecLen
        this._MoveStartPos = this._lastPos
        this._moveVec = newPos.normalize()
        this.node.position = this.node.position.add(this._moveVec.mul(this._moveSpeed * dt))
    }
}
