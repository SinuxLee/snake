import { UIType } from './UIManager';
import UISkinItem from './UISkinItem';
import {RewardType, default as DataManager} from '../logic/DataManager';
import Net from '../logic/Net';
import UIManager from './UIManager';
import App from '../logic/App';

const { ccclass, property } = cc._decorator;

@ccclass
export default class extends cc.Component {
    @property(cc.Prefab)
    public SkinPrefab: cc.Prefab = null;

    @property(cc.SpriteAtlas)
    public HeadAtlas: cc.SpriteAtlas = null;

    @property(cc.SpriteAtlas)
    public BodyAtlas: cc.SpriteAtlas = null;

    @property([cc.Sprite])
    public PreviewBodyList: cc.Sprite[] = [];

    private ViewContent: cc.Node = null;
    private CloseBtn: cc.Button = null;
    private UseBtn: cc.Button = null;
    private BuyBtn: cc.Button = null;
    private PreviewHead: cc.Sprite = null;
    private _SkinSpritePrefabCache: cc.Node[] = [];
    private _CurSlectSkinIndex = 0;

    onLoad() {
        this.ViewContent = cc.find('ScrollView/view/content', this.node);
        this.CloseBtn = this.node.getChildByName('closeBtn').getComponent(cc.Button);
        this.UseBtn = this.node.getChildByName('OKButton').getComponent(cc.Button);
        this.BuyBtn = this.node.getChildByName('BuyButton').getComponent(cc.Button);
        this.PreviewHead = cc.find('preview/headSprite', this.node).getComponent(cc.Sprite);

        let len = this.BodyAtlas.getSpriteFrames().length;
        while (len--) {
            const skin = cc.instantiate(this.SkinPrefab)
            skin.parent = this.ViewContent
            this._SkinSpritePrefabCache.push(skin);
        }
    }

    onEnable() {
        this.updateSkin()
    }

    start() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onBlock, this)
        this.CloseBtn.node.on(cc.Node.EventType.TOUCH_END, this.onCloseBtn, this)
        this.UseBtn.node.on(cc.Node.EventType.TOUCH_END, this.onUseBtn, this)
        this.BuyBtn.node.on(cc.Node.EventType.TOUCH_END, this.onBuyBtn, this);

        this._SkinSpritePrefabCache.forEach((skin, idx) => {
            skin.taggame = idx
            skin.getComponent(UISkinItem).initSkin()
        })

        this.updateSkin()
    }

    updateSkin() {
        const mgr = DataManager.inst;
        this._SkinSpritePrefabCache.forEach((cache,idx)=>{
            const skin = mgr._SKinDataArray[idx]
            if (skin == null) return;
            const item = cache.getComponent(UISkinItem);
            item.setIsOwn(skin.IsOwn)
            item.setIsUse(skin.IsUse)
            item.setPrice(skin.Price)
            item.setCostType(skin.Type)
        })
        
        this.updatePreview(this._CurSlectSkinIndex)
    }

    onUseBtn(event: cc.Event.EventTouch) {
        event.stopPropagation();
        const mgr = DataManager.inst;
        if (this._CurSlectSkinIndex >= mgr._SKinDataArray.length) return

        const skin = mgr._SKinDataArray[this._CurSlectSkinIndex]
        if (!skin.IsOwn) return

        App.inst.localStorage.setItem("tcs_skinIndex", skin.ID - 1)
        Net.inst.requestUserInfo()
        DataManager.inst._CurSelectMode = 0
        UIManager.inst.closeUI(UIType.UIType_Skin)
        UIManager.inst.openUI(UIType.UIType_GameLoading)
    }

    onBuyBtn(event: cc.Event.EventTouch) {
        event.stopPropagation();
        const mgr = DataManager.inst;
        if (this._CurSlectSkinIndex >= mgr._SKinDataArray.length) return

        let item = mgr._SKinDataArray[this._CurSlectSkinIndex]
        if (item.Type == RewardType.RT_GOLD) {
            if (item.Price > mgr.CurGold) return UIManager.inst.showMessage("金币不足，无法购买");
            App.inst.localStorage.setItem("tcs_gold", mgr.CurGold - item.Price)
        } else if (item.Type == RewardType.RT_DIAMOND) {
            if (item.Price > mgr.CurDiamond) return UIManager.inst.showMessage("钻石不足，无法购买");
            App.inst.localStorage.setItem("tcs_diamond", mgr.CurDiamond - item.Price)
        }

        const skinList = []
        const len = mgr._SKinDataArray.length;
        for (let r = 0; r < len; ++r) {
            item = mgr._SKinDataArray[r]
            item.IsOwn && skinList.push(r + 1)
        }
        skinList.push(this._CurSlectSkinIndex + 1);

        const data = JSON.stringify({ skin_list: skinList });
        App.inst.localStorage.setItem("tcs_skinlist", data);
        Net.inst.requestUserInfo();
    }

    setCurSelectSkin(idx: number) {
        this._CurSlectSkinIndex = idx
        this.updatePreview(idx)
    }

    updatePreview(idx: number) {
        let frame = this.HeadAtlas.getSpriteFrame(`biaoqing_${idx + 1}`);
        if (frame == null) return;
        this.PreviewHead.spriteFrame = frame

        frame = this.BodyAtlas.getSpriteFrame(`body_${idx + 1}`)
        this.PreviewBodyList.forEach(body => body.spriteFrame = frame);

        const mgr = DataManager.inst;
        if (idx >= mgr._SKinDataArray.length) return

        const skin = mgr._SKinDataArray[idx];
        if (skin == null) return
        if (skin.IsOwn) {
            this.BuyBtn.node.active = false
            this.UseBtn.node.active = !skin.IsUse
        } else {
            this.BuyBtn.node.active = true
            this.UseBtn.node.active = false
        }
    }

    onBlock(event: cc.Event.EventTouch) {
        event.stopPropagation()
    }

    onCloseBtn(event: cc.Event.EventTouch) {
        event.stopPropagation()
        UIManager.inst.closeUI(UIType.UIType_Skin)
    }
}
