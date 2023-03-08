const SnakeBody = require('SnakeBody');
const Food = require('Food');
const UIType = require('UIType');

cc.Class({
    extends: cc.Component,
    properties: {
        Atlas: {
            default: null,
            type: cc.SpriteAtlas
        },

        _Snake: null,
        _Game: null
    },

    start: function () {
        this._Game = GameGlobal.Game
    },

    setType: function (type) {
        if (type < 1 || type > 16) (type = 1);
        this.headType1 = type;

        const sprite = this.node.getComponent(cc.Sprite);
        const name = "biaoqing_" + type;
        const frame = this.Atlas.getSpriteFrame(name);

        frame && (sprite.spriteFrame = frame)
    },

    setSnake: function (snake) {
        this._Snake = snake
    },

    onCollisionEnter: function (other, self) {
        if (this._Game == null) return
        
        const tag = self.tag;
        if (0 == tag) {
            if ("body" == (h = other.node.group)) {
                var o = other.node.getComponent(SnakeBody);
                if (this._Snake === o._Snake) return;
                if (1 == this._Snake._State || 1 == o._Snake._State) return;
                if (this._Snake._PlayerSelf) {
                    if (0 == this._Snake._State) {
                        var s = new cc.Event.EventCustom("meKill", true);
                        this.node.dispatchEvent(s)
                    }
                } else (s = new cc.Event.EventCustom("otherKill", true)).detail = {
                    killed: o._Snake,
                    beKilled: this._Snake
                }, this.node.dispatchEvent(s)
            } else if ("food" == h) {
                if (this._Game.DelUseFood(other.node)) {
                    var c = other.node.getComponent(Food).getAddWeight();
                    this._Snake.addWeight(c)
                }
                var f = GameGlobal.UIManager.getUI(UIType.UIType_Game);
                f && (f.onSnakeHitFood(this._Snake), f.checkAddFood())
            }
        } else if (1e3 == tag) {
            var h;
            if ("body" == (h = other.node.group)) {
                o = other.node.getComponent(SnakeBody);
                if (this._Snake === o._Snake) return;
                if (0 == this._Snake._PlayerSelf) {
                    if (100 * Math.random() > 85) return;
                    this._Snake.changeAI(6)
                }
            } else "food" == h && 0 == this._Snake._PlayerSelf && this._Snake.changeAI(7, other.node.position)
        }
    }
})