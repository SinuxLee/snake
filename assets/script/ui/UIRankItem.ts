const { ccclass, property } = cc._decorator;

@ccclass
export default class extends cc.Component {
    private IndexLabel: cc.Label = null;
    private HeadImageSprite: cc.Sprite = null;
    private NickNameLabel: cc.Label = null;
    private ScoreLabel: cc.Label = null;
    private IndexSprite: cc.Sprite = null;

    onLoad(){
        this.IndexLabel = this.node.getChildByName('closeBtn').getComponent(cc.Label);
        this.HeadImageSprite = this.node.getChildByName('closeBtn').getComponent(cc.Sprite);
        this.NickNameLabel = this.node.getChildByName('closeBtn').getComponent(cc.Label);
        this.ScoreLabel = this.node.getChildByName('closeBtn').getComponent(cc.Label);
        this.IndexSprite = this.node.getChildByName('closeBtn').getComponent(cc.Sprite);
    }

    init (e: number, t) {
        this.IndexLabel.string = (e + 1).toString()
        this.createImage(t.url)
        this.NickNameLabel.string = t.nick
        this.ScoreLabel.string = "" + t.score
        this.IndexSprite.node.active = e <= 2
    }

    createImage (url: string) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            if (window.wx == null) return
            try {
                const image = wx.createImage();
                image.src = url
                image.onload = () =>{
                    try {
                        const texture = new cc.Texture2D();
                        texture.initWithElement(image)
                        texture.handleLoadedTexture()
                        this.HeadImageSprite.spriteFrame = new cc.SpriteFrame(texture)
                    } catch (e) {
                        this.HeadImageSprite.node.active = false
                    }
                }
            } catch (e) {
                this.HeadImageSprite.node.active = false
            }
        } else if (cc.sys.platform === cc.sys.QQ_PLAY){
            try {
                const image = new Image();
                image.src = url;
                image.onload = () =>{
                    try {
                        const texture = new cc.Texture2D;
                        texture.initWithElement(image)
                        texture.handleLoadedTexture()
                        this.HeadImageSprite.spriteFrame = new cc.SpriteFrame(texture)
                    } catch (e) {
                        this.HeadImageSprite.node.active = false
                    }
                }
            } catch (e) {
                this.HeadImageSprite.node.active = false
            }
        }
    }
}
