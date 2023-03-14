const SoundType = require('SoundType');
cc.Class({
    extends: cc.Component,
    properties: {
        SoundList: {
            default: [],
            type: [cc.AudioClip]
        },
        _EnableMusic: true,
        _OldVolume: 1,
        _BgVolume: 1,
        _OldSoundVolume: 1,
        _SoundVolume: 1,
        _CurPlayMusic: -1
    },

    onLoad: function () {
        cc.log("SoundManager onLoad----------------------------------")
    },

    start: function () {
        cc.log("SoundManager start-------------------------")
        this.playSound(SoundType.SoundType_Bg)
    },

    playSound: function (e) {
        if (e.ID >= this.SoundList.length) cc.log("playSound resIndex invalid ");
        else if (e.IsLoop) {
            if (-1 == this._CurPlayMusic) {
                var t = cc.audioEngine.play(this.SoundList[e.ID], e.IsLoop);
                this._CurPlayMusic = t
                cc.audioEngine.setVolume(t, this._BgVolume)
            }
        } else {
            t = cc.audioEngine.play(this.SoundList[e.ID], e.IsLoop);
            cc.audioEngine.setVolume(t, this._SoundVolume)
        }
    },

    stopSound: function (e) {
        e.ID >= this.SoundList.length && cc.log("stopSound resIndex invalid ")
    },

    stopAll: function () {
        this._CurPlayMusic = -1;
        cc.audioEngine.stopAll()
    },

    enableBgMusic: function (e) {
        this._BgVolume = e ? this._OldVolume : 0, -1 != this._CurPlayMusic && cc.audioEngine.setVolume(this._CurPlayMusic, this._BgVolume)
    },

    enableSound: function (e) {
        this._SoundVolume = e ? this._OldSoundVolume : 0
    },

    setMusicVolume: function (e) {
        this._OldVolume = e, -1 != this._CurPlayMusic && cc.audioEngine.setVolume(this._CurPlayMusic, e)
    },

    setSoundVolume: function (e) {
        this._OldSoundVolume = e
    }
})