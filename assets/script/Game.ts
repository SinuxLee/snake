const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {
    @property(cc.Prefab)
    public SnakeHeadPrefab = null;

    @property(cc.Prefab)
    public SnakeBodyPrefab = null;

    @property(cc.Prefab)
    public SnakeFoodPrefab = null;

    @property(cc.Prefab)
    public SnakeNamePrefab = null;

    @property(cc.Prefab)
    public GodSpritePrefab = null;

    private _SnakeHeadUseList: cc.Node[] = [];
    private _SnakeHeadFreeList: cc.Node[] = [];
    private _SnakeBodyUseList: cc.Node[] = [];
    private _SnakeBodyFreeList: cc.Node[] = [];
    private _SnakeFoodUseList: cc.Node[] = [];
    private _SnakeFoodFreeList: cc.Node[] = [];
    private _SnakeNameFreeList: cc.Node[] = [];
    private _SnakeNameUseList: cc.Node[] = [];
    private _SnakeGodSpriteList: cc.Node[] = [];
    private _SnakeGoldUseList: cc.Node[] = [];

    onLoad() {
        cc.game.setFrameRate(60)

        for (let i = 0; i < 10; i++) {
            this._SnakeHeadFreeList.push(cc.instantiate(this.SnakeHeadPrefab));
            this._SnakeNameFreeList.push(cc.instantiate(this.SnakeNamePrefab));
            this._SnakeGodSpriteList.push(cc.instantiate(this.GodSpritePrefab));
        }

        for (let i = 0; i < 300; i++) {
            this._SnakeBodyFreeList.push(cc.instantiate(this.SnakeBodyPrefab));
            this._SnakeFoodFreeList.push(cc.instantiate(this.SnakeFoodPrefab));
        }
    }

    start() {
        if (!window.wx) return
        const cvs = wx.getOpenDataContext().canvas;
        cvs && (cvs.width = 2 * cc.game.canvas.width, cvs.height = 2 * cc.game.canvas.height)
    }

    GetFreeHead() {
        return this.GetFree(this._SnakeHeadFreeList, this._SnakeHeadUseList, this.SnakeHeadPrefab)
    }

    DelUseHead(head: cc.Node) {
        this.DelUse(this._SnakeHeadFreeList, this._SnakeHeadUseList, head)
    }

    GetFreeNameLabel() {
        return this.GetFree(this._SnakeNameFreeList, this._SnakeNameUseList, this.SnakeNamePrefab)
    }

    DelUseNameLabel(label: cc.Node) {
        this.DelUse(this._SnakeNameFreeList, this._SnakeNameUseList, label)
    }

    GetFreeBody() {
        return this.GetFree(this._SnakeBodyFreeList, this._SnakeBodyUseList, this.SnakeBodyPrefab)
    }

    DelUseBody(body: cc.Node) {
        this.DelUse(this._SnakeBodyFreeList, this._SnakeBodyUseList, body)
    }

    GetFreeFood() {
        return this.GetFree(this._SnakeFoodFreeList, this._SnakeFoodUseList, this.SnakeFoodPrefab)
    }

    DelUseFood(food: cc.Node) {
        return this.DelUse(this._SnakeFoodFreeList, this._SnakeFoodUseList, food)
    }

    GetFreeGodSprite() {
        return this.GetFree(this._SnakeGodSpriteList, this._SnakeGoldUseList, this.GodSpritePrefab)
    }

    DelGodSprite(sprite: cc.Node) {
        return this.DelUse(this._SnakeGodSpriteList, this._SnakeGoldUseList, sprite)
    }

    DelAllFood() {
        const len = this._SnakeFoodUseList.length
        for (let idx = 0; idx < len; ++idx) {
            this._SnakeFoodFreeList.push(this._SnakeFoodUseList[idx])
            this._SnakeFoodUseList[idx].parent = null;
        }
        this._SnakeFoodUseList.splice(0, len)
    }

    GetFree(freeList: cc.Node[], usedList: cc.Node[], prefab: cc.Prefab) {
        let item = freeList.pop();
        if (item == null) item = cc.instantiate(prefab);
        return usedList.push(item), item
    }

    DelUse(freeList: cc.Node[], usedList: cc.Node[], node: cc.Node) {
        node.parent = null;
        const idx = usedList.indexOf(node);
        if (idx < 0 || idx >= usedList.length) return false;

        usedList.splice(idx, 1)
        freeList.push(node)
        return true
    }
}