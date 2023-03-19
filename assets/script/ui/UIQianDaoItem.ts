import {RewardType} from '../logic/DataManager'
const { ccclass, property } = cc._decorator;

@ccclass
export default class extends cc.Component {
    @property(cc.SpriteAtlas)
    public ReWardAtlas: cc.SpriteAtlas = null;

    private DayLabel: cc.Label = null;
    private RewardSprite: cc.Sprite = null;
    private RewardLabel: cc.Label = null;
    private MaskSprite: cc.Sprite = null;

    onLoad(){
        this.DayLabel = this.node.getChildByName('dayLabel').getComponent(cc.Label);
        this.RewardSprite = this.node.getChildByName('rewardSprite').getComponent(cc.Sprite);
        this.RewardLabel = this.node.getChildByName('rewardLabel').getComponent(cc.Label);
        this.MaskSprite = this.node.getChildByName('maskSprite').getComponent(cc.Sprite);
    }

    setParam (day: number, type: number, count: number) {
        let itemName = "";
        let frame = "";
        if (type == RewardType.RT_GOLD) {
            frame = "jinbi";
            itemName = "金币"
        } else if (type == RewardType.RT_DIAMOND) {
            frame = "zuan";
            itemName = "钻石"
        } else if (type == RewardType.RT_FLOWER) {
            frame = "hua";
            itemName = "花"
        }

        this.DayLabel.string = `第${day}天`;
        this.RewardSprite.spriteFrame = this.ReWardAtlas.getSpriteFrame(frame);
        this.RewardLabel.string = count + itemName;
    }

    setMask (enable: boolean) {
        this.MaskSprite && (this.MaskSprite.node.active = enable)
    }
}
