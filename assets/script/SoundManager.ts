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

    start() {
        this.playSound(SoundType.SoundType_Bg)
    }

    playSound(soundType: { ID: number, IsLoop: boolean }) {
        if (soundType.ID >= this.SoundList.length) return cc.error("playSound resIndex invalid ");

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

    enableBgMusic(isChecked: boolean) {
        this._BgVolume = 0;
        if (isChecked) this._BgVolume = this._OldVolume;
        if (this._CurPlayMusic > 0) cc.audioEngine.setVolume(this._CurPlayMusic, this._BgVolume)
    }

    enableSound(isChecked: boolean) {
        this._SoundVolume = 0;
        if (isChecked) this._SoundVolume = this._OldSoundVolume;
    }

    setMusicVolume(vol: number) {
        this._OldVolume = vol;
        if (this._CurPlayMusic > 0) cc.audioEngine.setVolume(this._CurPlayMusic, vol)
    }

    setSoundVolume(vol: number) {
        this._OldSoundVolume = vol
    }
}