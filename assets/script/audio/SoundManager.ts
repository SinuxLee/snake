export class SoundType {
    public static Bg = {
        ID: 0,
        IsLoop: true
    }

    public static GameBg = {
        ID: 1,
        IsLoop: true
    }

    public static GetGold = {
        ID: 2,
        IsLoop: false
    }

    public static Fall: {
        ID: 3,
        IsLoop: false
    }
}

export default class SoundManager {
    private SoundList: cc.AudioClip[] = [];
    public _OldVolume = 1;
    private _BgVolume = 1;
    public _OldSoundVolume = 1;
    private _SoundVolume = 1;
    private _CurPlayMusic = -1;

    private static _inst: SoundManager = null;
    public static get inst() {
        if (this._inst == null) this._inst = new SoundManager();
        return this._inst;
    }

    private constructor() {
        cc.resources.load('audio/gameBg', (err: Error, asset: cc.AudioClip) => {
            if (err) return cc.error(err)
            this.SoundList.push(asset, asset);
            this.playSound(SoundType.Bg)
        })
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