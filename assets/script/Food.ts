const { ccclass, property } = cc._decorator;

@ccclass
export default class Food extends cc.Component {
    @property(cc.SpriteAtlas)
    public Atlas: cc.SpriteAtlas = null;

    private _type = 1;

    setType(type: number) {
        if (type < 1 || type > 5) type = 1;
        this._type = type;

        const sprite = this.node.getComponent(cc.Sprite)
        const frame = this.Atlas.getSpriteFrame(`food_${type}`);
        if (frame) sprite.spriteFrame = frame
    }

    getAddWeight() {
        return 2
    }
}
