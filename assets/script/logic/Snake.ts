import SnakeBody from '../ui/SnakeBody';
import SnakeHead from '../ui/SnakeHead';
import Game from './Game';

export default class Snake {
    private _SnakeIndex: number = 0;
    private _HeadType: number = -1;
    private _BodyTypeList: number[] = [];
    private _SnakeHead: cc.Node = null;
    private _HeadBodyList: cc.Node[] = [];
    private _Game: Game = null;
    private _LastMoveVec: cc.Vec2 = cc.v2(1, 0);
    private _MoveVec: cc.Vec2 = cc.v2(1, 0);
    private _MoveSpeed: number = 0;
    private _BodyWidth: number = 0;
    private _GrowingWeight: number = 0;
    private _Camera: cc.Camera = null;
    public _PlayerSelf = false;
    private _PlayerName = "";
    private _MapWidth: number = 0;
    private _MapHeight: number = 0;
    private _KillCount: number = 0;
    private _PosUpdateTime: number = 0;
    private _HeadPrePositon: cc.Vec2 = cc.v2(1, 0);
    private _CurAIType: number = 1;
    private _CurAITimer: number = 2;
    private _CurAIMoveCount: number = 0;
    private _CurTargetDestDir: cc.Vec2 = cc.v2(1, 0);
    private _CurTargetChangeDir: cc.Vec2 = cc.v2(0, 0);
    private _CurAITurnSpeed: number = 3.14;
    public _State: number = 0;
    private _StateTimer: number = 3;
    private _AttachLabel: cc.Node = null;
    private _CurShowMoveDistance: number = 0;
    private _CurShowMoveStartPos: cc.Vec2 = cc.v2(0, 0);
    private _ShowMovePosList: cc.Vec2[] = [];
    private _CurMoveIndex: number = 0;
    private _MovePath: cc.Vec2[] = [];
    private _BodySpace: number = 30;
    private _GodSprite: cc.Node = null;

    init(headType: number, bodyType: number[], parent: cc.Node, pos: cc.Vec2,
        camera: cc.Camera, self: boolean, width: number, height: number, idx: number) {
        this._SnakeIndex = idx
        this._State = 0
        this._KillCount = 0
        this._Game = Game.inst;
        this._Camera = camera
        this._PlayerSelf = self
        this._MapWidth = width
        this._MapHeight = height
        this._HeadType = headType
        this._BodyTypeList = bodyType
        this._SnakeHead = this._Game.GetFreeHead()
        this._SnakeHead.parent = parent
        this._SnakeHead.setPosition(pos);
        this._SnakeHead.zIndex = 1;

        const head = this._SnakeHead.getComponent(SnakeHead);
        head.setSnake(this)
        head.setType(headType)

        camera && (this._SnakeHead.group = "head")
        this._CurTargetChangeDir = cc.v2(.996, .0871);

        for (let i = 0; i < 5; ++i) {
            const body = this._Game.GetFreeBody();
            if (!body) return

            this._HeadBodyList.push(body), body.parent = parent;
            const p = body.getComponent(SnakeBody);
            p.setSnake(this)
            p.setBodyIndex(i)
            body.zIndex = -i
            camera && (body.group = "body");

            const b = Math.floor(i / 3) % 2;
            p.setType(body[b])
            this._BodyWidth = body.width
        }

        if (idx >= 10) return

        this._GodSprite = Game.inst.GetFreeGodSprite()
        this._GodSprite.parent = parent
        this._GodSprite.active = false
        this._GodSprite.group = "food"
    }

    setName(name: string, node: cc.Node) {
        this._PlayerName = name
        this._AttachLabel = this._Game.GetFreeNameLabel()
        this._AttachLabel.getComponent(cc.Label).string = name
        this._AttachLabel.parent = node
        this._AttachLabel.position = this._SnakeHead.position
        this._Camera && (this._AttachLabel.group = "cameragr")
    }

    addKillCount() {
        this._KillCount += 1
    }

    getSnakeLength() {
        const len = this._HeadBodyList.length;
        return 5 * len + (len - 5) * (len - 5) * 5
    }

    deadFood(foodLayer: cc.Node) {
        this._HeadBodyList.forEach((node: cc.Node) => {
            const food = this._Game.GetFreeFood();
            food.parent = foodLayer
            food.setPosition(node.position)
            food.group = "food"
        })
    }

    setState(state: number) {
        this._State = state
        if (state != 1) return this._GodSprite.active = false

        this._StateTimer = 3
        this.updateGodSpritePos()
    }

    deadReset() {
        this._Game.DelUseHead(this._SnakeHead);
        this._Game.DelGodSprite(this._GodSprite);
        this._Game.DelUseNameLabel(this._AttachLabel)

        this._HeadBodyList.forEach(node => this._Game.DelUseBody(node))
        this._HeadBodyList.splice(0)
        this._SnakeHead = null
    }

    resetPos(pos: cc.Vec2) {
        this._SnakeHead.setPosition(pos);
    }

    initMoveDir(pos: cc.Vec2) {
        pos.normalizeSelf();
        const len = this._HeadBodyList.length;

        for (let n = 0; n < len; ++n) {
            const body = this._HeadBodyList[n];
            body.getComponent(SnakeBody).setInitMoveDir(pos)
        }

        this._LastMoveVec = this._MoveVec = pos;
        const angle = Math.atan2(pos.y, pos.x) * (180 / Math.PI);
        this._SnakeHead.angle = -angle - 90;

        this._MovePath.splice(0)
        const headPos = this._SnakeHead.getPosition();
        for (var s = 0; s < len * this._BodySpace; ++s) this._MovePath.push(headPos.add(pos.mul(15 - (s + 1))))
    }

    initMoveDest(destList: cc.Vec2[]) {
        this._CurMoveIndex = 0
        this._CurShowMoveStartPos = this._SnakeHead.getPosition();

        const pos = destList[0].sub(this._CurShowMoveStartPos);
        this._CurShowMoveDistance = pos.mag()
        this.initMoveDir(pos)

        this._ShowMovePosList = destList
        this._CurMoveIndex += 1
    }

    setMoveSpeed(speed: number) {
        speed = Math.floor(speed);
        if (speed == this._MoveSpeed) return
        this._PosUpdateTime = 0
        this._MoveSpeed = speed;
        this._HeadBodyList.forEach(node => node.getComponent(SnakeBody).setMoveSpeed(speed))
    }

    setMoveDir(x: number, y: number, angle: number) {
        if (x == 0 && y == 0) return
        this._MoveVec.x = x
        this._MoveVec.y = y
        this._SnakeHead.angle = -angle - 90
    }

    setOtherMoveDir(x: number, y: number) {
        if (x == 0 && y == 0) x = 1;

        this._MoveVec.x = x
        this._MoveVec.y = y
        this._MoveVec.normalizeSelf();

        const angle = Math.atan2(y, x) * (180 / Math.PI);
        this._SnakeHead.angle = -angle - 90
    }

    addWeight(weight: number) {
        this._GrowingWeight += weight;
        var t = this._GrowingWeight / 20;
        if (t <= 1) return

        t = Math.floor(t)
        this._GrowingWeight = this._GrowingWeight % 20;
        for (var i = 0; i < t; ++i) {
            const freeBody = this._Game.GetFreeBody();
            if (!freeBody) continue

            const len = this._HeadBodyList.length;
            freeBody.parent = this._SnakeHead.parent;
            freeBody.zIndex = -len;
            freeBody.group = "body";

            const newType = Math.floor(len / 3) % 2;
            const body = freeBody.getComponent(SnakeBody);
            body.reset()
            body.setSnake(this)
            body.setBodyIndex(len)
            body.setMoveSpeed(this._MoveSpeed)
            body.setType(this._BodyTypeList[newType]);

            const lastBody = this._HeadBodyList[len - 1];
            const secondLastBody = this._HeadBodyList[len - 2];
            const deltaPos = lastBody.position.sub(secondLastBody.position);

            freeBody.position = lastBody.position.add(deltaPos);
            this._HeadBodyList.push(freeBody);

            for (var d = 0; d < this._BodySpace; ++d) {
                const movePath = lastBody.getPosition().add(deltaPos.normalize().mul(d + 1))
                this._MovePath.push(movePath)
            }
        }
    }

    aiUpdate(dt: number) {
        if (this._CurAITimer -= dt, 0 == this._CurAIType) {
            if (this._CurAITimer < 0) {
                this.changeAI(Math.floor(3 * Math.random()))
            }
        } else if (1 == this._CurAIType) {
            this._MoveVec.rotateSelf(this._CurAITurnSpeed * dt)
            this.setOtherMoveDir(this._MoveVec.x, this._MoveVec.y)
            if (this._CurAITimer < 0) {
                this.changeAI(Math.floor(3 * Math.random()))
            }
        } else if (2 == this._CurAIType) {
            this._MoveVec.rotateSelf(this._CurAITurnSpeed * dt)
            this.setOtherMoveDir(this._MoveVec.x, this._MoveVec.y)
            if (this._CurAITimer < 0) {
                this.changeAI(Math.floor(3 * Math.random()))
            }
        } else if (6 == this._CurAIType) {
            const pos = this._CurTargetChangeDir.mul(50 * dt).add(this._MoveVec);
            this.setOtherMoveDir(pos.x, pos.y)
            if (this._CurAITimer < 0) {
                this.changeAI(Math.floor(3 * Math.random()))
            }
        } else if (7 == this._CurAIType) {
            if (this._CurAITimer < 0) {
                this.changeAI(Math.floor(3 * Math.random()))
            }
        } else if (10 == this._CurAIType) {
            const pos = this._CurTargetChangeDir.mul(300 * dt).add(this._MoveVec);
            this.setOtherMoveDir(pos.x, pos.y)
            if (this._CurAITimer < 0) {
                this.changeAI(Math.floor(3 * Math.random()))
            }
        }
    }

    changeAI(aiType: number, destPos: cc.Vec2 = cc.Vec2.ZERO) {
        if (this._CurAIType == aiType && (6 == aiType || 7 == aiType)) return

        this._CurAIType = aiType;
        if (0 == this._CurAIType) {
            this._CurAITimer = 2.5 + 2 * Math.random();
        } else if (1 == this._CurAIType) {
            this._CurAITimer = 3 + 2 * Math.random()
            this._CurAITurnSpeed = 1 + 1.14 * Math.random();
        } else if (2 == this._CurAIType) {
            this._CurAITimer = .5 + 1 * Math.random()
            this._CurAITurnSpeed = 2 + 1.14 * Math.random();
        } else if (6 == this._CurAIType) {
            this._CurAITimer = 2.5 + 1 * Math.random()
            if (Math.abs(this._MoveVec.y) >= Math.abs(this._MoveVec.x)) this._CurTargetDestDir = cc.v2(-this._MoveVec.x, this._MoveVec.y)
            else this._CurTargetDestDir = cc.v2(this._MoveVec.x, -this._MoveVec.y)
            this._CurTargetChangeDir = this.FixDir(this._CurTargetDestDir.sub(this._MoveVec)).normalize();
        } else if (7 == this._CurAIType) {
            this._CurAITimer = 3 + 2 * Math.random();
            const pos = destPos.sub(this._SnakeHead.getPosition());
            this.setOtherMoveDir(pos.x, pos.y)
        } else if (10 == this._CurAIType) {
            this._CurAITimer = 3 + 2 * Math.random()
            this._CurTargetDestDir = destPos
            this._CurTargetChangeDir = this.FixDir(this._CurTargetDestDir.sub(this._MoveVec)).normalize()
            this._CurAITimer = 3 + 2 * Math.random()
        }
    }

    FixDir(pos: cc.Vec2) {
        return 0 == pos.x && 0 == pos.y && (pos.x = .001), pos
    }

    updateGodSpritePos() {
        const { x, y } = this._SnakeHead;
        let minX = x, maxX = x;
        let minY = y, maxY = y;
        const len = this._HeadBodyList.length
        for (let a = 0; a < len; ++a) {
            const node = this._HeadBodyList[a];
            if (node.x < minX) minX = node.x;
            if (node.x > maxX) maxX = node.x;
            if (node.y < minY) minY = node.y;
            if (node.y > maxY) maxY = node.y;
        }

        const deltaX = maxX - minX;
        const deltaY = maxY - minY;
        this._GodSprite.x = deltaX / 2 + minX;
        this._GodSprite.y = deltaY / 2 + minY;

        const size = Math.max(Math.abs(deltaX), Math.abs(deltaY)) + 100;
        this._GodSprite.width = this._GodSprite.height = size;
    }

    update(dt: number) {
        if (0 == dt && (dt = .017), null == this._SnakeHead) return false;
        if (this._PlayerSelf) {
            if (Math.abs(this._SnakeHead.x) > this._MapWidth / 2 || Math.abs(this._SnakeHead.y) > this._MapHeight / 2) {
                var t = new cc.Event.EventCustom("meBound", true);
                return this._SnakeHead.dispatchEvent(t), false
            }
        } else if (Math.abs(this._SnakeHead.x) > this._MapWidth / 2 - 200 || Math.abs(this._SnakeHead.y) > this._MapHeight / 2 - 200) {
            if (this._SnakeHead.x > this._MapWidth / 2 - 200) this._SnakeHead.x = this._MapWidth / 2 - 200 - 10;
            else if (this._SnakeHead.x < -(this._MapWidth / 2 - 200)) this._SnakeHead.x = 10 - (this._MapWidth / 2 - 200);

            if (this._SnakeHead.y > this._MapHeight / 2 - 200) this._SnakeHead.y = this._MapHeight / 2 - 200 - 10;
            else if (this._SnakeHead.y < -(this._MapHeight / 2 - 200)) this._SnakeHead.y = 10 - (this._MapHeight / 2 - 200);

            this.changeAI(10, cc.v2(-this._MoveVec.x, -this._MoveVec.y))
        }

        this.aiUpdate(dt);
        this._PosUpdateTime -= dt;
        this._LastMoveVec = this._MoveVec
        this._HeadPrePositon = this._SnakeHead.getPosition();

        var i, n = this._MoveSpeed * dt,
            r = this._SnakeHead.position,
            o = this._MoveVec.mul(n);
        this._SnakeHead.position = this._SnakeHead.position.addSelf(o)
        this._AttachLabel.x = this._SnakeHead.x
        this._AttachLabel.y = this._SnakeHead.y + 80;

        for (var s = 0; s < n; ++s) i = r.add(this._MoveVec.mul(s)), this._MovePath.unshift(i);
        for (var c = this._HeadBodyList.length, f = 0; f < c; ++f) {
            var h = this._HeadBodyList[f].getComponent(SnakeBody);
            (f + 1) * this._BodySpace < this._MovePath.length && (h.node.position = this._MovePath[(f + 1) * this._BodySpace]), this._MovePath.length > c * (1 + this._BodySpace) && this._MovePath.pop()
        }

        this._StateTimer -= dt
        if (this._State == 1) {
            this.updateGodSpritePos()
            this._GodSprite.active = true;
            if (this._StateTimer < 0) {
                this._StateTimer = 0
                this.setState(0)
            }
        }
    }

    updateShow(dt: number) {
        if (this._SnakeHead == null) return false;
        if (this._State == 1 && this._StateTimer < 0) this._StateTimer = this._State = 0
        this._StateTimer -= dt;
        this._PosUpdateTime -= dt;

        if (this._PosUpdateTime <= 0) {
            this._LastMoveVec = this._MoveVec
            this._HeadPrePositon = this._SnakeHead.position
        }

        if (this._SnakeHead.position.sub(this._CurShowMoveStartPos).magSqr() > this._CurShowMoveDistance * this._CurShowMoveDistance) {
            this._CurMoveIndex >= this._ShowMovePosList.length && (this._CurMoveIndex = 0)
            const movePos = this._ShowMovePosList[this._CurMoveIndex]
            this._CurMoveIndex++
            this._CurShowMoveStartPos = this._SnakeHead.position;
            var n = movePos.sub(this._CurShowMoveStartPos);
            this._CurShowMoveDistance = n.mag()
            this.setOtherMoveDir(n.x, n.y)
        }

        const dtPos = this._MoveVec.mul(this._MoveSpeed * dt);
        this._SnakeHead.position = this._SnakeHead.position.addSelf(dtPos)
        this._AttachLabel.x = this._SnakeHead.x
        this._AttachLabel.y = this._SnakeHead.y + 80;
        const listLen = this._HeadBodyList.length
        for (let s = 0; s < listLen; ++s) {
            const snakeBody = this._HeadBodyList[s].getComponent(SnakeBody)
            snakeBody.updateBody(dt, this._HeadBodyList, this._LastMoveVec, this._HeadPrePositon)
        }
    }
}