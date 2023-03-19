import SnakeBody from './SnakeBody'
import Food from './Food'
import Game from '../logic/Game'
import Snake from '../logic/Snake'
import { UIType, default as UIManager } from '../ui/UIManager'

const { ccclass, property } = cc._decorator;

@ccclass
export default class SnakeHead extends cc.Component {
    @property(cc.SpriteAtlas)
    public Atlas: cc.SpriteAtlas = null;

    private static _atlasLen = -1;

    private _Snake: Snake = null;
    private _Game: Game = null;

    onLoad() {
        if(SnakeHead._atlasLen < 0) SnakeHead._atlasLen = this.Atlas.getSpriteFrames.length;
        this._Game = Game.inst
    }

    setType(type: number) {
        if (type <= 0 || type > SnakeHead._atlasLen) (type = 1);

        const sprite = this.node.getComponent(cc.Sprite);
        const frame = this.Atlas.getSpriteFrame(`biaoqing_${type}`);
        frame && (sprite.spriteFrame = frame)
    }

    setSnake(snake: Snake) {
        this._Snake = snake
    }

    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (this._Game == null) return

        const tag = self.tag;
        const otherGroup = other.node.group;
        if (1e3 == tag) { // snake head
            if ("body" == otherGroup) {
                const body = other.node.getComponent(SnakeBody);
                if (this._Snake === body._Snake) return;
                if (false == this._Snake._PlayerSelf) {
                    if (100 * Math.random() > 85) return;
                    this._Snake.changeAI(6)
                }
            } else if ("food" == otherGroup && false == this._Snake._PlayerSelf) {
                // 机器人吃到食物转向
                this._Snake.changeAI(7, other.node.getPosition())
            }
            return;
        }

        if ("body" == otherGroup) {
            const body = other.node.getComponent(SnakeBody);
            if (this._Snake === body._Snake) return;
            if (1 == this._Snake._State || 1 == body._Snake._State) return;

            if (this._Snake._PlayerSelf) {
                if (0 == this._Snake._State) {
                    const event = new cc.Event.EventCustom("meKill", true);
                    this.node.dispatchEvent(event)
                }
            } else {
                const event = new cc.Event.EventCustom("otherKill", true)
                event.detail = {
                    killed: body._Snake,
                    beKilled: this._Snake
                }
                this.node.dispatchEvent(event)
            }
        } else if ("food" == otherGroup) {
            if (this._Game.DelUseFood(other.node)) {
                const weight = other.node.getComponent(Food).getAddWeight();
                this._Snake.addWeight(weight)
            }
            const gameUI = UIManager.inst.getUI(UIType.UIType_Game);
            gameUI.onSnakeHitFood(this._Snake);
            gameUI.checkAddFood();
        }
    }
}
