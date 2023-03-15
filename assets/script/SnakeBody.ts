const { ccclass, property } = cc._decorator;

@ccclass
export default class Food extends cc.Component {
    @property(cc.SpriteAtlas)
    public Atlas: cc.SpriteAtlas = null;

    public _Snake = null;

    private _lastMoveVec = cc.v2(1, 0);
    private _moveVec = cc.v2(1, 0);
    private _moveSpeed = 0;
    private _IsFirstUpdate = true;
    private _CurStartPos = cc.v2(0, 0);
    private _CurMoveDistance = 0;
    private _CurBodyIndex = -1;
    private _MoveStartPos = cc.v2(0, 0);
    private _lastPos = cc.v3(0, 0);

    start() {
        this._IsFirstUpdate = true
    }

    setType(type: number) {
        if (type < 1 || type > 16) type = 1;

        const sprite = this.node.getComponent(cc.Sprite);
        const frame = this.Atlas.getSpriteFrame(`body_${type}`);
        frame && (sprite.spriteFrame = frame)
    }

    setSnake(e) {
        this._Snake = e
    }

    setInitMoveDir(e: cc.Vec2) {
        this._lastMoveVec = e
        this._moveVec = e
    }

    setMoveDir() { }
    getMoveDir() {
        return this._moveVec
    }

    getLastMoveDir() {
        return this._lastMoveVec
    }

    setMoveSpeed(e: number) {
        this._moveSpeed = e
    }

    setBodyIndex(e: number) {
        this._CurBodyIndex = e
    }

    reset() {
        this._IsFirstUpdate = true
        this.node.width = 30
        this.node.height = 30
    }

    getBodyPrePos(e, t, i, n, r, a) {
        if (0 == this._CurBodyIndex) {
            var o = this.node.width / 3;
            return a.add(n.mul(o))
        }
        var s = i[this._CurBodyIndex - 1];
        void 0 == s && cc.log("lastBody == undefined");
        o = -this.node.width / 2;
        var c = s.getComponent("SnakeBody");
        return c._lastPos.add(c._lastMoveVec.mul(o))
    }

    updateBody(e, t, i, n, r, a) {
        this._lastMoveVec = this._moveVec;
        this._lastPos = this.node.position;
        var o = this.getBodyPrePos(e, t, i, n, this._IsFirstUpdate, r);
        this._IsFirstUpdate = false;
        var s = o.sub(this.node.position),
            c = s.mag();
        c < 1 && (s = this._moveVec, c = this.node.width / 2)
        this._CurMoveDistance = c
        this._MoveStartPos = this._lastPos
        this._moveVec = s.normalize()
        cc.pDistance(this.node.position, this._MoveStartPos) > this._CurMoveDistance && console.log("invalid distance------------------")
        this.node.position = this.node.position.add(this._moveVec.mul(this._moveSpeed * e))
    }
}
