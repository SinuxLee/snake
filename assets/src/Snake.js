var n;

function r(obj, key, val) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: val,
        enumerable: true,
        configurable: true,
        writable: true
    }) : obj[key] = val, obj
}
const SnakeBody = require('SnakeBody');
const SnakeHead = require('SnakeHead');

cc.Class({
    properties: (
        n = {
            _SnakeIndex: 0,
            _HeadType: -1,
            _BodyTypeList: [],
            _SnakeHead: cc.Node,
            _HeadBodyList: [cc.Node],
            _Game: null,
            _LastMoveVec: cc.v2(1, 0),
            _MoveVec: cc.v2(1, 0),
            _MoveSpeed: 0,
            _BodyWidth: 0,
            _GrowingWeight: 0,
            _Camera: null,
            _PlayerSelf: false,
            _PlayerName: "",
            _MapWidth: 0,
            _MapHeight: 0
        },

        r(n, "_BodyTypeList", []),
        r(n, "_KillCount", 0),
        r(n, "_PosUpdateTime", 0),
        r(n, "_HeadPrePositon", cc.v2(1, 0)),
        r(n, "_CurAIType", 1),
        r(n, "_CurAITimer", 2),
        r(n, "_CurAIMoveCount", 0),
        r(n, "_CurTargetDestDir", cc.v2(1, 0)),
        r(n, "_CurTargetChangeDir", cc.v2(0, 0)),
        r(n, "_CurAITurnSpeed", 3.14),
        r(n, "_State", 0),
        r(n, "_StateTimer", 3),
        r(n, "_AttachLabel", null),
        r(n, "_CurShowMoveDistance", 0),
        r(n, "_CurShowMoveStartPos", cc.v2(0, 0)),
        r(n, "_ShowMovePosList", []),
        r(n, "_CurMoveIndex", 0),
        r(n, "_MovePath", []),
        r(n, "_BodySpace", 30),
        r(n, "_GodSprite", null),
        n
    ),

    init: function (e, t, i, n, r, s, c, f, h) {
        this._SnakeIndex = h, this._State = 0, this._KillCount = 0, this._Game = GameGlobal.Game, this._Camera = r, this._PlayerSelf = s, this._MapWidth = c, this._MapHeight = f, this._HeadType = e, this._BodyTypeList = t, this._SnakeHead = this._Game.GetFreeHead(), this._SnakeHead.parent = i, this._SnakeHead.position = n, this._SnakeHead.zIndex = 1;
        var d = this._SnakeHead.getComponent(SnakeHead);
        d.setSnake(this), d.setType(e), r && (this._SnakeHead.group = "head"), this._CurTargetChangeDir = cc.v2(.996, .0871);
        for (var u = 0; u < 5; ++u) {
            var l = this._Game.GetFreeBody();
            if (l) {
                this._HeadBodyList.push(l), l.parent = i;
                var p = l.getComponent(SnakeBody);
                p.setSnake(this), p.setBodyIndex(u), l.zIndex = -u, r && (l.group = "body");
                var b = Math.floor(u / 3) % 2;
                p.setType(t[b]), this._BodyWidth = l.width
            }
        }
        h < 10 && (this._GodSprite = GameGlobal.Game.GetFreeGodSprite(), this._GodSprite.parent = i, this._GodSprite.active = false, this._GodSprite.group = "food")
    },

    setName: function (e, t) {
        this._PlayerName = e, this._AttachLabel = this._Game.GetFreeNameLabel(), this._AttachLabel.getComponent(cc.Label).string = e, this._AttachLabel.parent = t, this._AttachLabel.position = this._SnakeHead.position, this._Camera && (this._AttachLabel.group = "cameragr")
    },

    addKillCount: function () {
        this._KillCount += 1
    },

    getSnakeLength: function () {
        const len = this._HeadBodyList.length;
        return 5 * len + (len - 5) * (len - 5) * 5
    },

    deadFood: function (e) {
        for (var t = this._HeadBodyList.length, i = 0; i < t; ++i) {
            var n = this._Game.GetFreeFood();
            n.parent = e, n.x = this._HeadBodyList[i].position.x, n.y = this._HeadBodyList[i].position.y, n.group = "food"
        }
    },

    setState: function (e) {
        this._State = e, 1 == e ? (this._StateTimer = 3, this.updateGodSpritePos()) : this._GodSprite.active = false
    },

    deadReset: function () {
        this._Game.DelUseHead(this._SnakeHead), this._Game.DelGodSprite(this._GodSprite);
        for (var e = this._HeadBodyList.length, t = 0; t < e; ++t) this._Game.DelUseBody(this._HeadBodyList[t]);
        this._HeadBodyList.splice(0, e), this._SnakeHead = null, this._Game.DelUseNameLabel(this._AttachLabel)
    },

    resetPos: function (e) {
        this._SnakeHead.position = e
    },

    initMoveDir: function (e) {
        e.normalizeSelf();
        for (var t, i = this._HeadBodyList.length, n = 0; n < i; ++n) {
            (t = this._HeadBodyList[n]).getContentSize().width;
            if (t.getComponent(SnakeBody).setInitMoveDir(e), 0 == n);
            else;
        }
        this._LastMoveVec = e, this._MoveVec = e;
        var r = Math.atan2(e.y, e.x) * (180 / Math.PI);
        this._SnakeHead.angle = -r - 90;
        var o = this._SnakeHead.position;
        this._MovePath = [];
        for (var s = 0; s < i * this._BodySpace; ++s) this._MovePath.push(o.add(e.mul(15 - (s + 1))))
    },

    initMoveDest: function (e) {
        this._CurMoveIndex = 0, this._CurShowMoveStartPos = this._SnakeHead.position;
        var t = e[0].sub(this._CurShowMoveStartPos);
        this._CurShowMoveDistance = t.mag(), this.initMoveDir(t), this._ShowMovePosList = e, this._CurMoveIndex += 1
    },

    setMoveSpeed: function (e) {
        var t = Math.floor(e);
        if (t != this._MoveSpeed) {
            this._PosUpdateTime = 0, this._MoveSpeed = t;
            for (var i = this._HeadBodyList.length, n = 0; n < i; ++n) this._HeadBodyList[n].getComponent(SnakeBody).setMoveSpeed(t)
        }
    },

    setMoveDir: function (e, t, i, n) {
        0 == e && 0 == t || (this._MoveVec.x = e, this._MoveVec.y = t, this._SnakeHead.angle = -n - 90)
    },

    setOtherMoveDir: function (e, t) {
        0 == e && 0 == t && (e = 1), this._MoveVec.x = e, this._MoveVec.y = t, this._MoveVec.normalizeSelf();
        var i = Math.atan2(t, e) * (180 / Math.PI);
        this._SnakeHead.angle = -i - 90
    },

    addWeight: function (e) {
        this._GrowingWeight += e;
        var t = this._GrowingWeight / 20;
        if (t > 1) {
            t = Math.floor(t), this._GrowingWeight = this._GrowingWeight % 20;
            for (var i = 0; i < t; ++i) {
                var n = this._Game.GetFreeBody();
                if (n) {
                    var r = this._HeadBodyList.length;
                    n.parent = this._SnakeHead.parent;
                    var o = n.getComponent(SnakeBody);
                    o.reset(), o.setSnake(this), o.setBodyIndex(r), o.setMoveSpeed(this._MoveSpeed), n.zIndex = -r, n.group = "body";
                    var s = Math.floor(r / 3) % 2;
                    o.setType(this._BodyTypeList[s]);
                    var c = this._HeadBodyList[r - 1],
                        f = this._HeadBodyList[r - 2],
                        h = c.position.sub(f.position);
                    c && f && (n.position = c.position.add(h)), this._HeadBodyList.push(n);
                    for (var d = 0; d < this._BodySpace; ++d) this._MovePath.push(c.position.add(h.normalize().mul(d + 1)))
                }
            }
            this.changeSnakeSize()
        }
    },

    changeSnakeSize: function () { },

    aiUpdate: function (e) {
        if (this._CurAITimer -= e, 0 == this._CurAIType) {
            if (this._CurAITimer < 0) {
                var t = Math.floor(3 * Math.random());
                this.changeAI(t)
            }
        } else if (1 == this._CurAIType) {
            if (this._MoveVec.rotateSelf(this._CurAITurnSpeed * e), this.setOtherMoveDir(this._MoveVec.x, this._MoveVec.y), this._CurAITimer < 0) {
                t = Math.floor(3 * Math.random());
                this.changeAI(t)
            }
        } else if (2 == this._CurAIType) {
            if (this._MoveVec.rotateSelf(this._CurAITurnSpeed * e), this.setOtherMoveDir(this._MoveVec.x, this._MoveVec.y), this._CurAITimer < 0) {
                t = Math.floor(3 * Math.random());
                this.changeAI(t)
            }
        } else if (6 == this._CurAIType) {
            var i = this._CurTargetChangeDir.mul(50 * e).add(this._MoveVec);
            if (this.setOtherMoveDir(i.x, i.y), this._CurAITimer < 0) {
                t = Math.floor(3 * Math.random());
                this.changeAI(t)
            }
        } else if (7 == this._CurAIType) {
            if (this._CurAITimer < 0) {
                t = Math.floor(3 * Math.random());
                this.changeAI(t)
            }
        } else if (10 == this._CurAIType) {
            i = this._CurTargetChangeDir.mul(300 * e).add(this._MoveVec);
            if (this.setOtherMoveDir(i.x, i.y), this._CurAITimer < 0) {
                t = Math.floor(3 * Math.random());
                this.changeAI(t)
            }
        }
    },

    changeAI: function (e, t) {
        if (this._CurAIType !== e || 6 != e && 7 != e)
            if (this._CurAIType = e, 0 == this._CurAIType) this._CurAITimer = 2.5 + 2 * Math.random();
            else if (1 == this._CurAIType) this._CurAITimer = 3 + 2 * Math.random(), this._CurAITurnSpeed = 1 + 1.14 * Math.random();
            else if (2 == this._CurAIType) this._CurAITimer = .5 + 1 * Math.random(), this._CurAITurnSpeed = 2 + 1.14 * Math.random();
            else if (6 == this._CurAIType) this._CurAITimer = 2.5 + 1 * Math.random(), Math.abs(this._MoveVec.y) >= Math.abs(this._MoveVec.x) ? this._CurTargetDestDir = cc.v2(-this._MoveVec.x, this._MoveVec.y) : this._CurTargetDestDir = cc.v2(this._MoveVec.x, -this._MoveVec.y), this._CurTargetChangeDir = this.FixDir(this._CurTargetDestDir.sub(this._MoveVec)).normalize();
            else if (7 == this._CurAIType) {
                this._CurAITimer = 3 + 2 * Math.random();
                var i = t.sub(this._SnakeHead.position);
                this.setOtherMoveDir(i.x, i.y)
            } else 10 == this._CurAIType && (this._CurAITimer = 3 + 2 * Math.random(), this._CurTargetDestDir = t, this._CurTargetChangeDir = this.FixDir(this._CurTargetDestDir.sub(this._MoveVec)).normalize(), this._CurAITimer = 3 + 2 * Math.random())
    },

    FixDir: function (e) {
        return 0 == e.x && 0 == e.y && (e.x = .001), e
    },

    update1: function (e) {
        if (0 == e && (e = .017), null == this._SnakeHead) return false;
        if (this._StateTimer -= e, 1 == this._State && this._StateTimer < 0 && (this._StateTimer = 0, this._State = 0), this._PlayerSelf) {
            if (Math.abs(this._SnakeHead.x) > this._MapWidth / 2 || Math.abs(this._SnakeHead.y) > this._MapHeight / 2) {
                var t = new cc.Event.EventCustom("meBound", true);
                return this._SnakeHead.dispatchEvent(t), false
            }
        } else Math.abs(this._SnakeHead.x) > this._MapWidth / 2 - 200 ? Math.abs(this._SnakeHead.y) > this._MapHeight / 2 - 200 ? this.changeAI(10, cc.v2(-this._MoveVec.x, -this._MoveVec.y)) : this.changeAI(10, cc.v2(-this._MoveVec.x, this._MoveVec.y)) : Math.abs(this._SnakeHead.y) > this._MapHeight / 2 - 200 && this.changeAI(10, cc.v2(this._MoveVec.x, -this._MoveVec.y)), this.aiUpdate(e);
        this._PosUpdateTime -= e;
        var i = false;
        this._PosUpdateTime <= 0 && (this._LastMoveVec = this._MoveVec, this._HeadPrePositon = this._SnakeHead.position, i = true);
        var n = this._MoveVec.mul(this._MoveSpeed * e);
        this._SnakeHead.position = this._SnakeHead.position.addSelf(n), this._AttachLabel.x = this._SnakeHead.x, this._AttachLabel.y = this._SnakeHead.y + 80;
        for (var r = this._HeadBodyList.length, o = 0; o < r; ++o) {
            this._HeadBodyList[o].getComponent(SnakeBody).updateBody(e, this._SnakeHead, this._HeadBodyList, this._LastMoveVec, this._SnakeHead.position, i)
        }
        return true
    },

    updateGodSpritePos: function () {
        for (var e = this._SnakeHead.x, t = this._SnakeHead.y, i = this._SnakeHead.x, n = this._SnakeHead.y, r = this._HeadBodyList.length, a = 0; a < r; ++a) {
            var o = this._HeadBodyList[a];
            o.x < e && (e = o.x), o.y < t && (t = o.y), o.x > i && (i = o.x), o.y > n && (n = o.y)
        }
        this._GodSprite.x = (i - e) / 2 + e, this._GodSprite.y = (n - t) / 2 + t;
        var s = Math.abs(i - e),
            c = Math.abs(n - t),
            f = Math.max(s, c) + 100;
        this._GodSprite.width = f, this._GodSprite.height = f
    },

    update: function (e) {
        if (0 == e && (e = .017), null == this._SnakeHead) return false;
        if (this._PlayerSelf) {
            if (Math.abs(this._SnakeHead.x) > this._MapWidth / 2 || Math.abs(this._SnakeHead.y) > this._MapHeight / 2) {
                var t = new cc.Event.EventCustom("meBound", true);
                return this._SnakeHead.dispatchEvent(t), false
            }
        } else (Math.abs(this._SnakeHead.x) > this._MapWidth / 2 - 200 || Math.abs(this._SnakeHead.y) > this._MapHeight / 2 - 200) && (this._SnakeHead.x > this._MapWidth / 2 - 200 ? this._SnakeHead.x = this._MapWidth / 2 - 200 - 10 : this._SnakeHead.x < -(this._MapWidth / 2 - 200) && (this._SnakeHead.x = 10 - (this._MapWidth / 2 - 200)), this._SnakeHead.y > this._MapHeight / 2 - 200 ? this._SnakeHead.y = this._MapHeight / 2 - 200 - 10 : this._SnakeHead.y < -(this._MapHeight / 2 - 200) && (this._SnakeHead.y = 10 - (this._MapHeight / 2 - 200)), this.changeAI(10, cc.v2(-this._MoveVec.x, -this._MoveVec.y))), this.aiUpdate(e);
        this._PosUpdateTime -= e;
        this._LastMoveVec = this._MoveVec, this._HeadPrePositon = this._SnakeHead.position;
        var i, n = this._MoveSpeed * e,
            r = this._SnakeHead.position,
            o = this._MoveVec.mul(n);
        this._SnakeHead.position = this._SnakeHead.position.addSelf(o), this._AttachLabel.x = this._SnakeHead.x, this._AttachLabel.y = this._SnakeHead.y + 80;
        for (var s = 0; s < n; ++s) i = r.add(this._MoveVec.mul(s)), this._MovePath.unshift(i);
        for (var c = this._HeadBodyList.length, f = 0; f < c; ++f) {
            var h = this._HeadBodyList[f].getComponent(SnakeBody);
            (f + 1) * this._BodySpace < this._MovePath.length && (h.node.position = this._MovePath[(f + 1) * this._BodySpace]), this._MovePath.length > c * (1 + this._BodySpace) && this._MovePath.pop()
        }
        return this._StateTimer -= e, 1 == this._State && (this.updateGodSpritePos(), 0 == this._GodSprite.active && (this._GodSprite.active = true), this._StateTimer < 0 && (this._StateTimer = 0, this.setState(0))), true
    },

    updateShow: function (e) {
        if (0 == e && (e = .017), null == this._SnakeHead) return false;
        this._StateTimer -= e, 1 == this._State && this._StateTimer < 0 && (this._StateTimer = 0, this._State = 0), this._PosUpdateTime -= e;
        var t = false;
        if (this._PosUpdateTime <= 0 && (this._LastMoveVec = this._MoveVec, this._HeadPrePositon = this._SnakeHead.position, t = true), this._SnakeHead.position.sub(this._CurShowMoveStartPos).magSqr() > this._CurShowMoveDistance * this._CurShowMoveDistance) {
            var i;
            this._CurMoveIndex >= this._ShowMovePosList.length && (this._CurMoveIndex = 0), i = this._ShowMovePosList[this._CurMoveIndex], this._CurMoveIndex++, this._CurShowMoveStartPos = this._SnakeHead.position;
            var n = i.sub(this._CurShowMoveStartPos);
            this._CurShowMoveDistance = n.mag(), this.setOtherMoveDir(n.x, n.y)
        }
        var r = this._MoveVec.mul(this._MoveSpeed * e);
        this._SnakeHead.position = this._SnakeHead.position.addSelf(r), this._AttachLabel.x = this._SnakeHead.x, this._AttachLabel.y = this._SnakeHead.y + 80;
        for (var o = this._HeadBodyList.length, s = 0; s < o; ++s) {
            this._HeadBodyList[s].getComponent(SnakeBody).updateBody(e, this._SnakeHead, this._HeadBodyList, this._LastMoveVec, this._HeadPrePositon, t)
        }
        return true
    }
})