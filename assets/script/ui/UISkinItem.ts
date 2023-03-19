import { UIType } from './UIManager';
import {RewardType} from '../logic/DataManager';
import UIManager from './UIManager';

const { ccclass, property } = cc._decorator;

@ccclass
export default class extends cc.Component {
    @property(cc.SpriteAtlas)
    public ResAtlas: cc.SpriteAtlas = null;

    private SkinSprite: cc.Sprite = null;
    private GoldBgSprite: cc.Sprite = null;
    private GoldLabel: cc.Label = null;
    private CostIcon: cc.Sprite = null;
    private SkinText: cc.Sprite = null;
    private LockSprite: cc.Sprite = null;
    private UseSprite: cc.Sprite = null;

    onLoad() {
        this.SkinSprite = this.node.getChildByName('skinImage').getComponent(cc.Sprite);
        this.GoldBgSprite = this.node.getChildByName('goldBgSprite').getComponent(cc.Sprite);
        this.GoldLabel = cc.find('goldBgSprite/priceLabel', this.node).getComponent(cc.Label);
        this.CostIcon = cc.find('goldBgSprite/iconSprite', this.node).getComponent(cc.Sprite);
        this.SkinText = this.node.getChildByName('skinText').getComponent(cc.Sprite);
        this.LockSprite = this.node.getChildByName('lockSprite').getComponent(cc.Sprite);
        this.UseSprite = this.node.getChildByName('useTag').getComponent(cc.Sprite);
    }

    start() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onSkinClick, this)
    }

    initSkin() {
        let tag = this.node.taggame + 1;
        let frame = this.ResAtlas.getSpriteFrame(`xingxiang_${tag}`);
        if (frame) this.SkinSprite.spriteFrame = frame;

        frame = this.ResAtlas.getSpriteFrame(`xingxiangwenzi_${tag}`)
        if (frame) this.SkinText.spriteFrame = frame

        this.LockSprite.node.active = false
        this.UseSprite.node.active = false
    }

    setCostType(type: number) {
        let frame = ""
        if (type == RewardType.RT_GOLD) {
            frame = "jinbi";
        } else if (type == RewardType.RT_DIAMOND) {
            frame = "zuan";
        } else if (type == RewardType.RT_FLOWER) {
            frame = "hua";
        }

        this.CostIcon.spriteFrame = this.ResAtlas.getSpriteFrame(frame)
    }

    setPrice(price: string) {
        this.GoldLabel.string = price;
    }

    setIsOwn(isOwn: boolean) {
        this.LockSprite.node.active = !isOwn
        this.GoldBgSprite.node.active = !isOwn
    }

    setIsUse(isUse: boolean) {
        this.UseSprite.node.active = isUse
    }

    onSkinClick(event: cc.Event.EventTouch) {
        event.stopPropagation();
        const tag = event.target.taggame;
        const skin = UIManager.inst.getUI(UIType.UIType_Skin);
        if (skin) skin.setCurSelectSkin(tag)
    }
}