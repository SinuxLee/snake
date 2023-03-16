import { UIType } from './UIType';

const { ccclass, property } = cc._decorator;

@ccclass
export default class extends cc.Component {
    private _btnClose: cc.Button = null;
    private _bgMusicCheck: cc.Toggle = null;
    private _soundCheck: cc.Toggle = null;
    private _bgMusicVolSlider: cc.Slider = null;
    private _soundVolSlider: cc.Slider = null;

    onLoad() {
        this._btnClose = this.node.getChildByName('closeBtn').getComponent(cc.Button);
        this._bgMusicCheck = this.node.getChildByName('bgMusicToggle').getComponent(cc.Toggle);
        this._soundCheck = this.node.getChildByName('soundToggle').getComponent(cc.Toggle);
        this._bgMusicVolSlider = this.node.getChildByName('bgMusicSlider').getComponent(cc.Slider);
        this._soundVolSlider = this.node.getChildByName('soundSlider').getComponent(cc.Slider);
    }

    onEnable() {
        this._bgMusicVolSlider.progress = GameGlobal.SoundManager._OldVolume;
        this._soundVolSlider.progress = GameGlobal.SoundManager._OldSoundVolume;
    }

    start() {
        this._btnClose.node.on(cc.Node.EventType.TOUCH_END, this.onClose, this)
        this.node.on(cc.Node.EventType.TOUCH_END, this.onBlock, this)
        this._soundCheck.node.on(cc.Node.EventType.TOUCH_END, this.onSoundCheck, this)

        this._bgMusicCheck.node.on("toggle", this.onBgMusicCheck, this)
        this._bgMusicVolSlider.node.on("slide", this.onMusicSlider, this)
        this._soundVolSlider.node.on("slide", this.onSoundSlider, this)
    }

    onClose(event: cc.Event.EventTouch) {
        GameGlobal.UIManager.closeUI(UIType.UIType_Setting)
    }

    onBlock(event: cc.Event.EventTouch) {
    }

    onBgMusicCheck(e) {
        GameGlobal.SoundManager.enableBgMusic(this._bgMusicCheck.isChecked)
    }

    onSoundCheck(e) {
        GameGlobal.SoundManager.enableSound(this._soundCheck.isChecked)
    }

    onMusicSlider(e) {
        GameGlobal.SoundManager.setMusicVolume(this._bgMusicVolSlider.progress)
    }

    onSoundSlider(e) {
        GameGlobal.SoundManager.setSoundVolume(this._soundVolSlider.progress)
    }
}