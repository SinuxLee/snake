export class SignInitData{
    public signDay = 0;
    public signReward = 0;
    public signRewardNum = 0;
    public signStatus = 0;
}

export class FriendInviteData {
    public HeadUrl = "";
    public IsCanTake = false;
    public Reward = 0;
    public ID = 0;
    public OpenID = "";
}

export class SkinData{
    public ID = 0;
    public Price = 5;
    public Type = 0;
    public IsOwn = false;
    public IsUse = false;
}

export enum RewardType{
    RT_GOLD = 0,
    RT_DIAMOND = 1,
    RT_FLOWER = 2
}

export default class DataManager{
    public CurScore = 0;
    public CurGold = 0;
    public CurFlower = 0;
    public CurDiamond = 0;
    public IsShareRelive = false;

    public VideoAdid = "adunit-bf61185a259df4c2"
    private BannerAdid1 = "adunit-84752a29a640a476"
    private BannerAdid2 = "adunit-cb8e21a61e779439"
    private AppID = "wxf6746ff760dc4257"
    public _ShareReliveCount = 0
    public _MyAvatarURL = ""
    public _MyNickName = ""
    private _Province = 0
    private _AllLinks = []
    public _CurSelectMode = 0
    public _FriendDataList = []
    public _MyQianDaoCount = 0
    public _MyQianDaoTake = false
    public _SignInitList = []
    public _FuHuoCostGold = 0
    public _LinkIconURL = ""
    public _LinkAppID = ""
    public _LinkPath = ""
    public _LinkExtra = ""
    private _ShareTitle = ""
    private _ShareImageUrl = ""
    private _ShareContent = ""
    public _ShareReward = 5
    private _IsShareRelive = true
    public _CurShareReliveCount = 0
    public _CurZSAdData = null
    public _SKinDataArray = []
    public _CurMySKinIndex = 0
    public _CurRecord = 0
    private _GameStartTime = 0

    private static _inst: DataManager = null;
    public static get inst(){
        if(this._inst == null) this._inst = new DataManager();
        return this._inst;
    }

    constructor() {
        if (window.wx == null) return

        wx.getStorage({
            key: "wxData",
            success: (t) => {
                this._MyAvatarURL = t.data.avaUrl
                this._MyNickName = t.data.nick;
            },
            fail: () => {}
        })
    }

    getCurScore() {
        return this.CurScore
    }

    setCurScore(score: number) {
        this.CurScore = score
    }

    getCurGold() {
        return this.CurGold
    }

    setCurGold(gold: number) {
        this.CurGold = gold
    }

    getCurFlower() {
        return this.CurFlower
    }

    setCurFlower(flower: number) {
        this.CurFlower = flower
    }

    setDiamond(diamond: number) {
        this.CurDiamond = diamond
    }

    getCurDiamond() {
        return this.CurDiamond
    }

    getFuHuoGold() {
        return this._FuHuoCostGold
    }

    setShareRelive(isRelive: boolean) {
        this.IsShareRelive = isRelive
    }

    getShareRelive() {
        return this.IsShareRelive
    }

    setShareTitle(title: string) {
        this._ShareTitle = title
    }

    getShareTitle() {
        return this._ShareTitle
    }

    setShareImage(url: string) {
        this._ShareImageUrl = url
    }

    getShareImage() {
        return this._ShareImageUrl
    }

    setShareReliveCount(count: number) {
        this._ShareReliveCount = count
    }

    getShareReliveCount() {
        return this._ShareReliveCount
    }
}
