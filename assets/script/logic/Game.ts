export default class Game {
    private SnakeHeadPrefab = null;
    private SnakeBodyPrefab = null;
    private SnakeFoodPrefab = null;
    private SnakeNamePrefab = null;
    private GodSpritePrefab = null;

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

    private static _inst: Game = null;
    public static get inst() {
        if (this._inst == null) this._inst = new Game();
        return this._inst;
    }

    private constructor() {
        this.loadPrefab();

        if (!window.wx) return
        const cvs = wx.getOpenDataContext().canvas;

        if (!cvs) return
        cvs.width = 2 * cc.game.canvas.width
        cvs.height = 2 * cc.game.canvas.height
    }

    async loadPrefab() {
        Promise.all([
            this.loadRes('prefab/Food'),
            this.loadRes('prefab/GodSprite'),
            this.loadRes('prefab/NameNode'),
            this.loadRes('prefab/SnakeBody'),
            this.loadRes('prefab/SnakeHead')
        ]).then((prefabs: cc.Prefab[]) => {
            this.SnakeFoodPrefab = prefabs[0];
            this.GodSpritePrefab = prefabs[1];
            this.SnakeNamePrefab = prefabs[2];
            this.SnakeBodyPrefab = prefabs[3];
            this.SnakeHeadPrefab = prefabs[4];
            
            for (let i = 0; i < 10; i++) {
                this._SnakeHeadFreeList.push(cc.instantiate(this.SnakeHeadPrefab));
                this._SnakeNameFreeList.push(cc.instantiate(this.SnakeNamePrefab));
                this._SnakeGodSpriteList.push(cc.instantiate(this.GodSpritePrefab));
            }
    
            for (let i = 0; i < 300; i++) {
                this._SnakeBodyFreeList.push(cc.instantiate(this.SnakeBodyPrefab));
                this._SnakeFoodFreeList.push(cc.instantiate(this.SnakeFoodPrefab));
            }
        }).catch(cc.error)

    }

    async loadRes(path: string): Promise<cc.Prefab> {
        return new Promise((resolve, reject) => {
            cc.resources.load(path, (err: Error, asset: cc.Prefab) => {
                if (err) reject(err);
                else resolve(asset)
            })
        })
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

        this._SnakeFoodUseList.splice(0)
    }

    GetFree(freeList: cc.Node[], usedList: cc.Node[], prefab: cc.Prefab): cc.Node {
        let item = freeList.pop();
        if (item == null) item = cc.instantiate(prefab);
        usedList.push(item);
        return item
    }

    DelUse(freeList: cc.Node[], usedList: cc.Node[], node: cc.Node): boolean {
        node.parent = null;
        const idx = usedList.indexOf(node);
        if (idx < 0 || idx >= usedList.length) return false;

        usedList.splice(idx, 1)
        freeList.push(node)
        return true
    }
}