import { UIType } from './UIType';
import Snake from './Snake';
import Food from './Food';
import SoundType from './SoundType';
import GameJoystick from './GameJoystick';

var c = [
        cc.v2(-120, -120), cc.v2(600, 600), cc.v2(-500, -800), cc.v2(200, 800),
        cc.v2(-800, 1200), cc.v2(500, -800), cc.v2(-300, 500), cc.v2(500, -400),
        cc.v2(-200, 400)
    ],
    f = 2,
    h = 3,
    d = 4,

    u = cc.Class({
        IndexLabel: null,
        NameLabel: null,
        LenLabel: null
    }),

    UIGame = cc.Class({
        extends: cc.Component,
        properties: {
            NewerSprite: {
                default: null,
                type: cc.Sprite
            },
            AllObjNode: {
                default: null,
                type: cc.Node
            },
            NameBaseNode: {
                default: null,
                type: cc.Node
            },
            FoodBaseNode: {
                default: null,
                type: cc.Node
            },
            GameJoystick: {
                default: null,
                type: GameJoystick
            },
            Camera: {
                default: null,
                type: cc.Camera
            },
            BgSprite: {
                default: null,
                type: cc.Sprite
            },
            SpeedBtn: {
                default: null,
                type: cc.Button
            },
            TimerSprite: {
                default: null,
                type: cc.Node
            },
            TimerLabel: {
                default: null,
                type: cc.Label
            },
            KillLabel: {
                default: null,
                type: cc.Label
            },
            KillNameLabel: {
                default: null,
                type: cc.Label
            },
            BeKilledNameLabel: {
                default: null,
                type: cc.Label
            },
            KillCountLabel: {
                default: null,
                type: cc.Label
            },
            KillSprite: {
                default: null,
                type: cc.Sprite
            },
            LenLabel: {
                default: null,
                type: cc.Label
            },
            InfoPanel: {
                default: null,
                type: cc.Node
            },
            _SnakeList: [],
            _MapSizeWidth: 0,
            _MapSizeHeight: 0,
            _Game: null,
            _GameState: 0,
            _IsSpeedDown: false,
            _DataMgr: null,
            _CurTime: 120,
            _RankUpdateTimer: 0,
            _RankInfoList: [],
            _NameList: [],
            _BodyList: [],
            _HeadList: [],
            _KillShowTimer: 0,
            _SoundMgr: null,
            _IsFirstPause: false
        },

        onLoad: function () {
            this._Game = GameGlobal.Game, this._DataMgr = GameGlobal.DataManager, this._MapSizeWidth = this.BgSprite.node.width, this._MapSizeHeight = this.BgSprite.node.height;
            for (var e = 0; e < 10; ++e) {
                var t = new u,
                    i = this.InfoPanel.children[e];
                t.IndexLabel = i.getChildByName("indexLabel").getComponent(cc.Label), t.NameLabel = i.getChildByName("nameLabel").getComponent(cc.Label), t.LenLabel = i.getChildByName("lenLabel").getComponent(cc.Label), t.IndexLabel.string = "", t.NameLabel.string = "", t.LenLabel.string = "", this._RankInfoList.push(t)
            }
        },

        onEnable: function () {
            (this.NewerSprite.node.active = false, this._DataMgr._GameStartTime = (new Date).getTime(), this._DataMgr._CurShareReliveCount = 0, window.wx) && (console.log("uigame onEnable------------------"), wx.getStorageSync("isPlay") || (wx.setStorageSync("isPlay", true), this._IsFirstPause = true, this.NewerSprite.node.active = true));

            this._SoundMgr = GameGlobal.SoundManager
            this._SoundMgr.stopAll()
            this._SoundMgr.playSound(SoundType.SoundType_GameBg)
            this.KillSprite.node.active = false
            cc.director.getCollisionManager().enabled = true
            this._KillShowTimer = 0
            this._CurTime = 120
            0 == this._DataMgr._CurSelectMode ? (this.TimerLabel.node.active = true, this.TimerSprite.active = true) : (this.TimerLabel.node.active = false, this.TimerSprite.active = false), this._NameList = [], GameGlobal.getRandomNameList(9, this._NameList), this._BodyList = [], this._HeadList = [];

            for (var e = 0; e < 10; ++e)
                if (0 == e) {
                    var t = new Snake,
                        i = GameGlobal.DataManager._CurMySKinIndex + 1;
                    t.init(i, [i, i], this.AllObjNode, cc.Vec2(0, 0), this.Camera, true, this._MapSizeWidth, this._MapSizeHeight, e), t.initMoveDir(cc.v2(1, 0));
                    var r = this._DataMgr._MyNickName;
                    0 == r.length && (r = "Me"), t.setName(r, this.NameBaseNode), t.setMoveSpeed(300), this._SnakeList.push(t)
                } else {
                    t = new Snake;
                    var a = Math.floor(16 * Math.random()) + 1;
                    this._HeadList.push(a);
                    Math.floor(16 * Math.random());
                    var o = [a, a];
                    this._BodyList.push(o), t.init(a, o, this.AllObjNode, c[e - 1], this.Camera, false, this._MapSizeWidth, this._MapSizeHeight, e);
                    var h = cc.v2(1, 0);
                    h.rotateSelf(3.14 * Math.random()), t.initMoveDir(h), t.setName(this._NameList[e - 1], this.NameBaseNode), t.setMoveSpeed(300), this._SnakeList.push(t)
                } for (e = 0; e < 80; ++e) this.addFood();
            this.setGameState(f)
        },

        onDisable: function () {
            cc.director.getCollisionManager().enabled = false;
            for (var e = 0; e < 10; ++e) this._SnakeList[e].deadReset();
            this._SnakeList = [], this._Game.DelAllFood()
        },

        onDestroy: function () {
            for (var e = 0; e < 10; ++e) this._SnakeList[e].deadReset();
            this._SnakeList = [], this._Game.DelAllFood()
        },

        start: function () {
            this.FoodBaseNode.zIndex = -1e3, this.NameBaseNode.zIndex = 100, this.GameJoystick.setCallback(this, this.joyCallback), this.SpeedBtn.node.on(cc.Node.EventType.TOUCH_START, this.onSpeedBtnDown, this), this.SpeedBtn.node.on(cc.Node.EventType.TOUCH_END, this.onSpeedBtnUp, this), this.NewerSprite.node.on(cc.Node.EventType.TOUCH_END, this.onTouchNewer, this), this.node.on("meKill", this.onSelfBeKilled, this), this.node.on("otherKill", this.onOtherBeKilled, this), this.node.on("meBound", this.onMeBound, this)
        },

        addFood: function () {
            var e = (2 * Math.random() - 1) * (this._MapSizeWidth / 2 - 200),
                t = (2 * Math.random() - 1) * (this._MapSizeHeight / 2 - 200),
                i = this._Game.GetFreeFood();
            i.parent = this.FoodBaseNode, i.x = e, i.y = t, i.zIndex = -500, i.group = "food", i.getComponent(Food).setType(Math.floor(5 * Math.random()) + 1)
        },

        checkAddFood: function () {
            this.FoodBaseNode.childrenCount < 150 && this.addFood()
        },

        reliveResetGame: function () {
            var e = this._SnakeList[0];
            e && (e.resetPos(cc.Vec2(0, 0)), e.initMoveDir(cc.v2(1, 0)), e.setState(1), e.changeSnakeSize())
            this.setGameState(f)
        },

        getMySnakeLen: function () {
            var e = this._SnakeList[0];
            return e ? e.getSnakeLength() : 0
        },

        getMySnakeKill: function () {
            var e = this._SnakeList[0];
            return e ? e._KillCount : 0
        },

        resetGameEnd: function () {
            this._CurTime = 120;
            for (var e = 0; e < 10; ++e) this._SnakeList[e].deadReset();
            this._SnakeList = [], this._Game.DelAllFood();
            for (e = 0; e < 10; ++e)
                if (0 == e) {
                    var t = new Snake,
                        i = GameGlobal.DataManager._CurMySKinIndex + 1;
                    t.init(i, [i, i], this.AllObjNode, cc.Vec2(0, 0), this.Camera, true, this._MapSizeWidth, this._MapSizeHeight, e);
                    var r = this._DataMgr._MyNickName;
                    0 == r.length && (r = "Me"), t.initMoveDir(cc.v2(1, 0)), t.setName(r, this.NameBaseNode), t.setMoveSpeed(300), t.changeSnakeSize(), this._SnakeList.push(t)
                } else {
                    (t = new Snake).init(this._HeadList[e - 1], this._BodyList[e - 1], this.AllObjNode, c[e - 1], this.Camera, false, this._MapSizeWidth, this._MapSizeHeight, e);
                    var a = cc.v2(1, 0);
                    a.rotateSelf(3.14 * Math.random()), t.initMoveDir(a), t.setName(this._NameList[e - 1], this.NameBaseNode), t.setMoveSpeed(300), t.changeSnakeSize(), this._SnakeList.push(t)
                } for (e = 0; e < 80; ++e) this.addFood();
            this.setGameState(f)
        },

        resetGame1: function () {
            this._SnakeList[0].deadReset(), this._SnakeList[0] = null;
            var e = new Snake,
                t = GameGlobal.DataManager._CurMySKinIndex + 1;
            e.init(t, [t, t], this.AllObjNode, cc.Vec2(0, 0), this.Camera, true, this._MapSizeWidth, this._MapSizeHeight, 0);
            var i = this._DataMgr._MyNickName;
            0 == i.length && (i = "Me"), e.initMoveDir(cc.v2(1, 0)), e.setName(i, this.NameBaseNode), e.setMoveSpeed(300), e.changeSnakeSize(), this._SnakeList[0] = e, e.setState(1), this.setGameState(f)
        },

        joyCallback: function (x, y, dt, angle) {
            if (this._SnakeList.length <= 0) return

            this._SnakeList[0].setMoveDir(x, y, dt, angle)
        },

        onSpeedBtnDown: function (e) {
            e.stopPropagation()
            this._IsSpeedDown = true
        },

        onSpeedBtnUp: function (e) {
            e.stopPropagation()
            this._IsSpeedDown = false
        },

        onSelfBeKilled: function (e) {
            e.stopPropagation()
            this.setGameState(h)
        },

        onOtherBeKilled: function (e) {
            e.stopPropagation();
            var t = e.detail.killed,
                i = e.detail.beKilled;
            if (t.addKillCount(), t === this._SnakeList[0] && this.updateSelfSnakeInfo(), null != i) {
                this.KillSprite.node.active = true
                this.KillCountLabel.string = t._KillCount
                this.KillNameLabel.string = t._PlayerName
                this.BeKilledNameLabel.string = i._PlayerName
                this._KillShowTimer = 1.5
                i.deadFood(this.FoodBaseNode)
                i.deadReset();
                var n = this._SnakeList.indexOf(i);
                this._SnakeList.splice(n, 1)
                this.onOtherRelive(i._HeadType, i._BodyTypeList, i._PlayerName)
            } else cc.log("onOtherBeKilled beSnake = null")
        },

        onOtherRelive: function (e, t, i) {
            var r = new Snake,
                a = Math.floor(9 * Math.random());
            r.init(e, t, this.AllObjNode, c[a], this.Camera, false, this._MapSizeWidth, this._MapSizeHeight, this._SnakeList.length);
            var o = cc.v2(1, 0);
            o.rotateSelf(3.14 * Math.random())
            r.initMoveDir(o)
            r.setName(i, this.NameBaseNode)
            r.setMoveSpeed(300)
            this._SnakeList.push(r)
            r.setState(1)
        },

        onMeBound: function (e) {
            e.stopPropagation(), this.setGameState(h)
        },

        onSnakeHitFood: function (e) {
            e === this._SnakeList[0] && this.updateSelfSnakeInfo()
        },

        onTouchNewer: function (e) {
            e.stopPropagation()
            this.NewerSprite.node.active = false
            this._IsFirstPause = false
        },

        setGameState: function (e) {
            if (this._GameState != e)
                if (this._GameState = e, this._GameState == f) this.updateSelfSnakeInfo();
                else if (this._GameState == h) {
                    var t = this._SnakeList[0];
                    this._DataMgr.CurScore = t.getSnakeLength();
                    var i = this;
                    GameGlobal.WeiXinPlatform.postScoreToPlatform(this._DataMgr.getCurScore(), this._DataMgr._GameStartTime)
                    GameGlobal.Net.requestScore(t.getSnakeLength())
                    GameGlobal.UIManager.openUI(UIType.UIType_GameOver)
                } else if (this._GameState == d) {
                    t = this._SnakeList[0];
                    this._DataMgr.CurScore = t.getSnakeLength();
                    i = this;
                    GameGlobal.WeiXinPlatform.postScoreToPlatform(i._DataMgr.getCurScore(), this._DataMgr._GameStartTime)
                    GameGlobal.Net.requestScore(t.getSnakeLength())
                    GameGlobal.UIManager.openUI(UIType.UIType_GameEnd)
                    GameGlobal.Net.requestScoreGold(t.getSnakeLength())
                }
        },

        updateSelfSnakeInfo: function () {
            var e = this._SnakeList[0];
            e && (this.KillLabel.string = e._KillCount, this.LenLabel.string = e.getSnakeLength())
        },

        onHideKillSprite: function () {
            this.KillSprite.node.active = false
        },

        update: function (e) {
            if (!this._IsFirstPause && (this._KillShowTimer -= e, this._KillShowTimer < 0 && this.KillSprite.node.active && this.onHideKillSprite(), this._GameState != h && this._GameState != d)) {
                var t = this._SnakeList.length;
                if (!(t <= 0)) {
                    for (var i = 0; i < t; ++i) this._SnakeList[i].update(e);
                    this.Camera.node.position = this._SnakeList[0]._SnakeHead.position;
                    var n = this._SnakeList[0],
                        r = n._MoveSpeed;
                    if (cc.sys.platform == cc.sys.WECHAT_GAME ? this._IsSpeedDown ? ((r += 250 * e) > 500 && (r = 500), n.setMoveSpeed(r)) : ((r -= 400 * e) < 300 && (r = 300), n.setMoveSpeed(r)) : cc.sys.platform == cc.sys.QQ_PLAY ? this._IsSpeedDown ? ((r += 250 * e) > 400 && (r = 400), n.setMoveSpeed(r)) : ((r -= 350 * e) < 300 && (r = 300), n.setMoveSpeed(r)) : this._IsSpeedDown ? ((r += 250 * e) > 500 && (r = 500), n.setMoveSpeed(r)) : ((r -= 400 * e) < 300 && (r = 300), n.setMoveSpeed(r)), 0 == this._DataMgr._CurSelectMode) {
                        this._CurTime -= e, this._CurTime <= 0 && (this._CurTime = 0, this.setGameState(d));
                        var a = Math.floor(this._CurTime),
                            o = this.TimerLabel.string,
                            s = Math.floor(a / 60),
                            c = Math.floor(a % 60),
                            f = s + ":" + (c > 9 ? c : "0" + c);
                        f != o && (this.TimerLabel.string = f)
                    }
                    if (this._RankUpdateTimer -= e, this._RankUpdateTimer < 0) {
                        this._RankUpdateTimer = 1.2;
                        var u = [];
                        u.push(this._SnakeList[0], this._SnakeList[1], this._SnakeList[2], this._SnakeList[3], this._SnakeList[4]), u.push(this._SnakeList[5], this._SnakeList[6], this._SnakeList[7], this._SnakeList[8], this._SnakeList[9]), u.sort(function (e, t) {
                            return void 0 == e && void 0 == t ? 0 : void 0 == e ? -1 : void 0 == t ? 1 : t.getSnakeLength() - e.getSnakeLength()
                        });
                        for (i = 0; i < u.length; ++i) {
                            var l = u[i],
                                p = cc.Color.WHITE;
                            l == this._SnakeList[0] && (p = cc.Color.GREEN);
                            var b = this._RankInfoList[i];
                            b.IndexLabel.string = i + 1 + "", b.NameLabel.string = l._PlayerName, b.LenLabel.string = l.getSnakeLength(), b.IndexLabel.node.color = p, b.NameLabel.node.color = p, b.LenLabel.node.color = p
                        }
                    }
                }
            }
        }
    });

module.exports = {
    UIGame
}