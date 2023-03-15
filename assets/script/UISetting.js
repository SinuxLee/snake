import { UIType } from './UIType';

cc.Class({
    extends: cc.Component,
    properties: {
        CloseBtn: {
            default: null,
            type: cc.Button
        },
        BgMusicCheck: {
            default: null,
            type: cc.Toggle
        },
        SoundCheck: {
            default: null,
            type: cc.Toggle
        },
        BgMusicSlider: {
            default: null,
            type: cc.Slider
        },
        SoundSlider: {
            default: null,
            type: cc.Slider
        }
    },

    onEnable: function () {
        this.BgMusicSlider.progress = GameGlobal.SoundManager._OldVolume, this.SoundSlider.progress = GameGlobal.SoundManager._OldSoundVolume
    },

    start: function () {
        this.CloseBtn.node.on(cc.Node.EventType.TOUCH_END, this.onClose, this), this.node.on(cc.Node.EventType.TOUCH_END, this.onBlock, this), this.BgMusicCheck.node.on("toggle", this.onBgMusicCheck, this), this.SoundCheck.node.on(cc.Node.EventType.TOUCH_END, this.onSoundCheck, this), this.BgMusicSlider.node.on("slide", this.onMusicSlider, this), this.SoundSlider.node.on("slide", this.onSoundSlider, this)
    },

    onClose: function (e) {
        e.stopPropagation(), GameGlobal.UIManager.closeUI(UIType.UIType_Setting)
    },

    onBlock: function (e) {
        e.stopPropagation()
    },

    onBgMusicCheck: function (e) {
        e.stopPropagation(), GameGlobal.SoundManager.enableBgMusic(this.BgMusicCheck.isChecked)
    },

    onSoundCheck: function (e) {
        e.stopPropagation(), GameGlobal.SoundManager.enableSound(this.SoundCheck.isChecked)
    },

    onMusicSlider: function (e) {
        e.stopPropagation(), GameGlobal.SoundManager.setMusicVolume(this.BgMusicSlider.progress)
    },

    onSoundSlider: function (e) {
        e.stopPropagation(), GameGlobal.SoundManager.setSoundVolume(this.SoundSlider.progress)
    }
})