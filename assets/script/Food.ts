const { ccclass, property } = cc._decorator;

@ccclass
export default class Food extends cc.Component {
    @property(cc.SpriteAtlas)
    public Atlas: cc.SpriteAtlas = null;

    private static _atlasLen = -1;

    private _weight = 2;
    private _type = 1;

    onLoad() {
        if (Food._atlasLen < 0) Food._atlasLen = this.Atlas.getSpriteFrames().length
    }

    setType(type: number) {
        if (type <= 0 || type > Food._atlasLen) type = 1;

        this._type = type;
        const sprite = this.node.getComponent(cc.Sprite)
        const frame = this.Atlas.getSpriteFrame(`food_${this._type}`);
        if (frame) sprite.spriteFrame = frame
    }

    getAddWeight() {
        return this._weight;
    }
}
