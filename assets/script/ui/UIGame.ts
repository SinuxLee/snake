import { UIType, } from './UIManager';
import Snake from '../logic/Snake';
import Food from './Food';
import { SoundType } from '../audio/SoundManager';
import GameJoystick from './GameJoystick';
import DataManager from '../logic/DataManager';
import Net from '../logic/Net';
import WeiXinPlatform from '../logic/WeiXinPlatform';
import SoundManager from '../audio/SoundManager';
import Game from '../logic/Game';
import UIManager from './UIManager';
import App from '../logic/App';

const birthplace: cc.Vec2[] = [
    cc.v2(-120, -120), cc.v2(600, 600), cc.v2(-500, -800), cc.v2(200, 800),
    cc.v2(-800, 1200), cc.v2(500, -800), cc.v2(-300, 500), cc.v2(500, -400),
    cc.v2(-200, 400)
];
const gameState = 2;
const gameState3 = 3;
const gameState4 = 4;
class RankItem {
    IndexLabel = null;
    NameLabel = null;
    LenLabel = null;
}

const { ccclass, property } = cc._decorator;

@ccclass
export default class extends cc.Component {
    @property(cc.Camera)
    public Camera: cc.Camera = null;

    private NewerSprite: cc.Sprite = null;
    private AllObjNode: cc.Node = null;
    private NameBaseNode: cc.Node = null;
    private FoodBaseNode: cc.Node = null;
    private GameJoystick: GameJoystick = null;
    private BgSprite: cc.Sprite = null;
    private SpeedBtn: cc.Button = null;
    private TimerSprite: cc.Node = null;
    private TimerLabel: cc.Label = null;
    private KillLabel: cc.Label = null;
    private KillNameLabel: cc.Label = null;
    private BeKilledNameLabel: cc.Label = null;
    private KillCountLabel: cc.Label = null;
    private KillSprite: cc.Sprite = null;
    private LenLabel: cc.Label = null;
    private InfoPanel: cc.Node = null;

    private _SnakeList: Snake[] = [];
    private _MapSizeWidth = 0;
    private _MapSizeHeight = 0;
    private _Game = null;
    private _GameState = 0;
    private _IsSpeedDown = false;
    private _DataMgr = null;
    private _CurTime = 120;
    private _RankUpdateTimer = 0;
    private _RankInfoList = [];
    private _NameList = [];
    private _BodyList = [];
    private _HeadList = [];
    private _KillShowTimer = 0;
    private _SoundMgr = null;
    private _IsFirstPause = false;

    onLoad() {
        this.NewerSprite = this.node.getChildByName('gonglve').getComponent(cc.Sprite);
        this.AllObjNode = this.node.getChildByName('AllObj');
        this.NameBaseNode = cc.find('AllObj/NameBaseNode', this.node);
        this.FoodBaseNode = cc.find('AllObj/FoodBase', this.node);
        this.GameJoystick = this.node.getChildByName('Joy').getComponent(GameJoystick);
        this.BgSprite = this.node.getChildByName('bg').getComponent(cc.Sprite);
        this.SpeedBtn = this.node.getChildByName('SpeedBtn').getComponent(cc.Button);
        this.TimerSprite = this.node.getChildByName('timeBg');
        this.TimerLabel = cc.find('timeBg/TimeLabel', this.node).getComponent(cc.Label);
        this.KillLabel = cc.find('TopInfoNode/killLabel', this.node).getComponent(cc.Label);
        this.KillNameLabel = cc.find('KillSprite/killNameLabel', this.node).getComponent(cc.Label);
        this.BeKilledNameLabel = cc.find('KillSprite/beKilledNameLabel', this.node).getComponent(cc.Label);
        this.KillCountLabel = cc.find('KillSprite/killCountLabel', this.node).getComponent(cc.Label);
        this.KillSprite = this.node.getChildByName('KillSprite').getComponent(cc.Sprite);
        this.LenLabel = cc.find('TopInfoNode/lenLabel', this.node).getComponent(cc.Label);
        this.InfoPanel = this.node.getChildByName('infoBg')

        this._Game = Game.inst;
        this._DataMgr = DataManager.inst;
        this._MapSizeWidth = this.BgSprite.node.width
        this._MapSizeHeight = this.BgSprite.node.height;
        for (let e = 0; e < 10; ++e) {
            const rankItem = new RankItem();
            const node = this.InfoPanel.children[e];
            rankItem.IndexLabel = node.getChildByName("indexLabel").getComponent(cc.Label)
            rankItem.NameLabel = node.getChildByName("nameLabel").getComponent(cc.Label)
            rankItem.LenLabel = node.getChildByName("lenLabel").getComponent(cc.Label)
            rankItem.IndexLabel.string = ""
            rankItem.NameLabel.string = ""
            rankItem.LenLabel.string = ""
            this._RankInfoList.push(rankItem)
        }
    }

    onEnable() {
        this.NewerSprite.node.active = false
        this._DataMgr._GameStartTime = Date.now()
        this._DataMgr._CurShareReliveCount = 0
        if (window.wx && wx.getStorageSync("isPlay") == null) {
            wx.setStorageSync("isPlay", true)
            this._IsFirstPause = true;
            this.NewerSprite.node.active = true
        }

        this._SoundMgr = SoundManager.inst;
        this._SoundMgr.stopAll()
        this._SoundMgr.playSound(SoundType.GameBg)
        this.KillSprite.node.active = false
        cc.director.getCollisionManager().enabled = true
        this._KillShowTimer = 0
        this._CurTime = 120
        if (this._DataMgr._CurSelectMode == 0) {
            this.TimerLabel.node.active = true
            this.TimerSprite.active = true
        } else {
            this.TimerLabel.node.active = false
            this.TimerSprite.active = false
        }
        this._NameList = []
        App.inst.getRandomNameList(9, this._NameList)
        this._BodyList = [];
        this._HeadList = [];

        for (let e = 0; e < 10; ++e) {
            if (0 == e) {
                const selfSnake = new Snake()
                const i = DataManager.inst._CurMySKinIndex + 1;
                selfSnake.init(i, [i, i], this.AllObjNode, cc.v2(0, 0), this.Camera,
                    true, this._MapSizeWidth, this._MapSizeHeight, e)
                selfSnake.initMoveDir(cc.v2(1, 0));

                let nick = this._DataMgr._MyNickName;
                if (nick == '') nick = "Me";

                selfSnake.setName(nick, this.NameBaseNode)
                selfSnake.setMoveSpeed(300)
                this._SnakeList.push(selfSnake)
            } else {
                const snake = new Snake();
                const headType = Math.floor(16 * Math.random()) + 1;
                this._HeadList.push(headType);

                const bodyType = [headType, headType];
                this._BodyList.push(bodyType)
                snake.init(headType, bodyType, this.AllObjNode, birthplace[e - 1], this.Camera,
                    false, this._MapSizeWidth, this._MapSizeHeight, e);

                snake.initMoveDir(cc.v2(1, 0).rotateSelf(3.14 * Math.random()));
                snake.setName(this._NameList[e - 1], this.NameBaseNode)
                snake.setMoveSpeed(300);
                this._SnakeList.push(snake)
            }
        }
        for (let e = 0; e < 80; ++e) this.addFood();
        this.setGameState(gameState)
    }

    onDisable() {
        cc.director.getCollisionManager().enabled = false;
        for (let e = 0; e < 10; ++e) this._SnakeList[e].deadReset();
        this._SnakeList = []
        this._Game.DelAllFood()
    }

    onDestroy() {
        for (let e = 0; e < 10; ++e) this._SnakeList[e].deadReset();
        this._SnakeList = []
        this._Game.DelAllFood()
    }

    start() {
        this.FoodBaseNode.zIndex = -1e3
        this.NameBaseNode.zIndex = 100
        this.GameJoystick.setCallback(this, this.joyCallback)
        this.SpeedBtn.node.on(cc.Node.EventType.TOUCH_START, this.onSpeedBtnDown, this)
        this.SpeedBtn.node.on(cc.Node.EventType.TOUCH_END, this.onSpeedBtnUp, this)
        this.NewerSprite.node.on(cc.Node.EventType.TOUCH_END, this.onTouchNewer, this)
        this.node.on("meKill", this.onSelfBeKilled, this)
        this.node.on("otherKill", this.onOtherBeKilled, this)
        this.node.on("meBound", this.onMeBound, this)
    }

    addFood() {
        const food = this._Game.GetFreeFood();
        food.parent = this.FoodBaseNode
        food.x = (2 * Math.random() - 1) * (this._MapSizeWidth / 2 - 200)
        food.y = (2 * Math.random() - 1) * (this._MapSizeHeight / 2 - 200)
        food.zIndex = -500
        food.group = "food"
        food.getComponent(Food).setType(Math.floor(5 * Math.random()) + 1)
    }

    checkAddFood() {
        if (this.FoodBaseNode.childrenCount >= 150) return
        this.addFood()
    }

    reliveResetGame() {
        const selfSnake = this._SnakeList[0];
        if (selfSnake == null) return;
        selfSnake.resetPos(cc.v2(0, 0))
        selfSnake.initMoveDir(cc.v2(1, 0))
        selfSnake.setState(1)
        this.setGameState(gameState)
    }

    getMySnakeLen() {
        const snake = this._SnakeList[0];
        return snake ? snake.getSnakeLength() : 0
    }

    getMySnakeKill() {
        const snake = this._SnakeList[0];
        return snake ? snake._KillCount : 0
    }

    resetGameEnd() {
        this._CurTime = 120;
        for (let e = 0; e < 10; ++e) this._SnakeList[e].deadReset();
        this._SnakeList = [];
        this._Game.DelAllFood();

        for (let e = 0; e < 10; ++e) {
            if (0 == e) {
                const self = new Snake()
                const skinType = DataManager.inst._CurMySKinIndex + 1;
                self.init(skinType, [skinType, skinType], this.AllObjNode, cc.v2(0, 0), this.Camera,
                    true, this._MapSizeWidth, this._MapSizeHeight, e);
                let nick = this._DataMgr._MyNickName;
                if (nick == '') nick = "Me";

                self.initMoveDir(cc.v2(1, 0))
                self.setName(nick, this.NameBaseNode)
                self.setMoveSpeed(300)
                this._SnakeList.push(self)
            } else {
                const snake = new Snake()
                snake.init(this._HeadList[e - 1], this._BodyList[e - 1], this.AllObjNode, birthplace[e - 1],
                    this.Camera, false, this._MapSizeWidth, this._MapSizeHeight, e);
                snake.initMoveDir(cc.v2(1, 0).rotateSelf(3.14 * Math.random()))
                snake.setName(this._NameList[e - 1], this.NameBaseNode)
                snake.setMoveSpeed(300)
                this._SnakeList.push(snake)
            }
        }

        for (let e = 0; e < 80; ++e) this.addFood();
        this.setGameState(gameState)
    }

    joyCallback(x: number, y: number, angle: number) {
        if (this._SnakeList.length <= 0) return
        this._SnakeList[0].setMoveDir(x, y, angle)
    }

    onSpeedBtnDown(e) {
        e.stopPropagation()
        this._IsSpeedDown = true
    }

    onSpeedBtnUp(e) {
        e.stopPropagation()
        this._IsSpeedDown = false
    }

    onSelfBeKilled(e) {
        e.stopPropagation()
        this.setGameState(gameState3)
    }

    onOtherBeKilled(e) {
        e.stopPropagation();
        const snake = e.detail.killed
        const deadSnake = e.detail.beKilled;
        snake.addKillCount()
        if (snake === this._SnakeList[0]) this.updateSelfSnakeInfo()
        if (deadSnake == null) return

        this.KillSprite.node.active = true
        this.KillCountLabel.string = snake._KillCount
        this.KillNameLabel.string = snake._PlayerName
        this.BeKilledNameLabel.string = deadSnake._PlayerName
        this._KillShowTimer = 1.5
        deadSnake.deadFood(this.FoodBaseNode)
        deadSnake.deadReset();

        const idx = this._SnakeList.indexOf(deadSnake);
        this._SnakeList.splice(idx, 1)
        this.onOtherRelive(deadSnake._HeadType, deadSnake._BodyTypeList, deadSnake._PlayerName)
    }

    onOtherRelive(headType, bodyList, name) {
        const snake = new Snake();
        const idx = Math.floor(birthplace.length * Math.random());
        snake.init(headType, bodyList, this.AllObjNode, birthplace[idx], this.Camera, false,
            this._MapSizeWidth, this._MapSizeHeight, this._SnakeList.length);
        snake.initMoveDir(cc.v2(1, 0).rotateSelf(3.14 * Math.random()))
        snake.setName(name, this.NameBaseNode)
        snake.setMoveSpeed(300)
        this._SnakeList.push(snake)
        snake.setState(1)
    }

    onMeBound(e) {
        e.stopPropagation()
        this.setGameState(gameState3)
    }

    onSnakeHitFood(snake) {
        if (snake === this._SnakeList[0]) this.updateSelfSnakeInfo()
    }

    onTouchNewer(e) {
        e.stopPropagation()
        this.NewerSprite.node.active = false
        this._IsFirstPause = false
    }

    setGameState(state) {
        if (this._GameState != state) this._GameState = state;

        if (this._GameState == gameState) this.updateSelfSnakeInfo();
        else if (this._GameState == gameState3) {
            const self = this._SnakeList[0];
            this._DataMgr.CurScore = self.getSnakeLength();
            WeiXinPlatform.inst.postScoreToPlatform(this._DataMgr.getCurScore(), this._DataMgr._GameStartTime)
            Net.inst.requestScore(self.getSnakeLength())
            UIManager.inst.openUI(UIType.UIType_GameOver)
        } else if (this._GameState == gameState4) {
            const self = this._SnakeList[0];
            this._DataMgr.CurScore = self.getSnakeLength();
            WeiXinPlatform.inst.postScoreToPlatform(this._DataMgr.getCurScore(), this._DataMgr._GameStartTime)
            Net.inst.requestScore(self.getSnakeLength())
            UIManager.inst.openUI(UIType.UIType_GameEnd)
            Net.inst.requestScoreGold(self.getSnakeLength())
        }
    }

    updateSelfSnakeInfo() {
        const snake = this._SnakeList[0];
        if (snake == null) return;

        this.KillLabel.string = snake._KillCount
        this.LenLabel.string = snake.getSnakeLength()
    }

    onHideKillSprite() {
        this.KillSprite.node.active = false
    }

    update(dt) {
        if (this._IsFirstPause) return;
        this._KillShowTimer -= dt
        this._KillShowTimer < 0 && this.KillSprite.node.active && this.onHideKillSprite();

        if (this._GameState == gameState3 || this._GameState == gameState4) return

        const len = this._SnakeList.length;
        if (len <= 0) return
        for (var i = 0; i < len; ++i) this._SnakeList[i].update(dt);

        // 相机跟随，每一帧都跟会不会有性能问题？
        this.Camera.node.position = this._SnakeList[0]._SnakeHead.position;
        const self = this._SnakeList[0];
        let speed = self._MoveSpeed;
        switch (cc.sys.platform) {
            case cc.sys.WECHAT_GAME:
            default:
                if (this._IsSpeedDown) (speed += 250 * dt) > 500 && (speed = 500);
                else (speed -= 400 * dt) < 300 && (speed = 300);
                break;
            case cc.sys.QQ_PLAY:
                if (this._IsSpeedDown) (speed += 250 * dt) > 400 && (speed = 400);
                else (speed -= 350 * dt) < 300 && (speed = 300);
                break;
        }

        self.setMoveSpeed(speed)
        if (this._DataMgr._CurSelectMode == 0) {
            this._CurTime -= dt
            if (this._CurTime <= 0) {
                this._CurTime = 0
                this.setGameState(gameState4)
            }

            const curTime = Math.floor(this._CurTime);
            const txt = this.TimerLabel.string;
            const minute = Math.floor(curTime / 60);
            const second = Math.floor(curTime % 60);
            const newTxt = minute + ":" + (second > 9 ? second : "0" + second);
            if (newTxt != txt) this.TimerLabel.string = newTxt;
        }

        this._RankUpdateTimer -= dt
        if (this._RankUpdateTimer >= 0) return

        this._RankUpdateTimer = 1.2;
        this._SnakeList.slice(0, 10).sort((e, t) => {
            if (e == null && t == null) return 0;
            if (e == null) return -1;
            if (t == null) return 1;
            return t.getSnakeLength() - e.getSnakeLength()
        }).forEach((snake, idx) => {
            let color = cc.Color.WHITE;
            if (snake == this._SnakeList[0]) color = cc.Color.GREEN;

            const rankItem = this._RankInfoList[idx];
            rankItem.IndexLabel.string = (idx + 1).toString()
            rankItem.NameLabel.string = snake._PlayerName
            rankItem.LenLabel.string = snake.getSnakeLength()
            rankItem.IndexLabel.node.color = rankItem.NameLabel.node.color = rankItem.LenLabel.node.color = color
        });
    }
}