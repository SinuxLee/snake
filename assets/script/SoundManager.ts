import SoundType from './SoundType';

const { ccclass, property } = cc._decorator;

@ccclass
export default class extends cc.Component {
    @property([cc.AudioClip])
    public SoundList: cc.AudioClip[] = []

    private _EnableMusic = true;
    private _OldVolume = 1;
    private _BgVolume = 1;
    private _OldSoundVolume = 1;
    private _SoundVolume = 1;
    private _CurPlayMusic = -1;

    onLoad() {
        cc.log("SoundManager onLoad----------------------------------")
    }

    start() {
        cc.log("SoundManager start-------------------------")
        this.playSound(SoundType.SoundType_Bg)
    }

    playSound(soundType: { ID: number, IsLoop: boolean }) {
        if (soundType.ID >= this.SoundList.length) return cc.log("playSound resIndex invalid ");
        
        if (!soundType.IsLoop) {
            const audioId = cc.audioEngine.play(this.SoundList[soundType.ID], soundType.IsLoop, 0);
            cc.audioEngine.setVolume(audioId, this._SoundVolume)
            return
        }

        if (this._CurPlayMusic > 0) return

        this._CurPlayMusic = cc.audioEngine.play(this.SoundList[soundType.ID], soundType.IsLoop, 0);
        cc.audioEngine.setVolume(this._CurPlayMusic, this._BgVolume)
    }

    stopSound(e) {
        e.ID >= this.SoundList.length && cc.log("stopSound resIndex invalid ")
    }

    stopAll() {
        this._CurPlayMusic = -1;
        cc.audioEngine.stopAll()
    }

    enableBgMusic(e) {
        this._BgVolume = e ? this._OldVolume : 0, -1 != this._CurPlayMusic && cc.audioEngine.setVolume(this._CurPlayMusic, this._BgVolume)
    }

    enableSound(e) {
        this._SoundVolume = e ? this._OldSoundVolume : 0
    }

    setMusicVolume(vol: number) {
        this._OldVolume = vol;
        -1 != this._CurPlayMusic && cc.audioEngine.setVolume(this._CurPlayMusic, vol)
    }

    setSoundVolume(vol: number) {
        this._OldSoundVolume = vol
    }
}