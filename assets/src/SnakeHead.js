var n = require('SnakeBody'),
    r = require('Food'),
    a = require('UIType');
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
    start: function() {
        this._Game = GameGlobal.Game
    },
    setType: function(e) {
        (e < 1 || e > 16) && (e = 1), this.headType1 = e;
        var t = this.node.getComponent(cc.Sprite),
            i = "biaoqing_" + e,
            n = this.Atlas.getSpriteFrame(i);
        n && (t.spriteFrame = n)
    },
    setSnake: function(e) {
        this._Snake = e
    },
    onCollisionEnter: function(e, t) {
        var i = t.tag;
        if (null != this._Game)
            if (0 == i) {
                if ("body" == (h = e.node.group)) {
                    var o = e.node.getComponent(n);
                    if (this._Snake === o._Snake) return;
                    if (1 == this._Snake._State || 1 == o._Snake._State) return;
                    if (this._Snake._PlayerSelf) {
                        if (0 == this._Snake._State) {
                            var s = new cc.Event.EventCustom("meKill", !0);
                            this.node.dispatchEvent(s)
                        }
                    } else(s = new cc.Event.EventCustom("otherKill", !0)).detail = {
                        killed: o._Snake,
                        beKilled: this._Snake
                    }, this.node.dispatchEvent(s)
                } else if ("food" == h) {
                    if (this._Game.DelUseFood(e.node)) {
                        var c = e.node.getComponent(r).getAddWeight();
                        this._Snake.addWeight(c)
                    }
                    var f = GameGlobal.UIManager.getUI(a.UIType_Game);
                    f && (f.onSnakeHitFood(this._Snake), f.checkAddFood())
                }
            } else if (1e3 == i) {
            var h;
            if ("body" == (h = e.node.group)) {
                o = e.node.getComponent(n);
                if (this._Snake === o._Snake) return;
                if (0 == this._Snake._PlayerSelf) {
                    if (100 * Math.random() > 85) return;
                    this._Snake.changeAI(6)
                }
            } else "food" == h && 0 == this._Snake._PlayerSelf && this._Snake.changeAI(7, e.node.position)
        }
    }
})