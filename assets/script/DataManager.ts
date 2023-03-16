import { UIType } from './UIType';
const { ccclass, property } = cc._decorator;

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

enum RewardType{
    RT_GOLD = 0,
    RT_DIAMOND = 1,
    RT_FLOWER = 2
}

// TODO: 改为 enum
window.GameRewardType = {
    RT_GOLD: 0,
    RT_DIAMOND: 1,
    RT_FLOWER: 2
}

@ccclass
export default class extends cc.Component {
    @property(cc.Integer)
    public CurScore = 0;

    @property(cc.Integer)
    public CurGold = 0;

    @property(cc.Integer)
    public CurFlower = 0;

    @property(cc.Integer)
    public CurDiamond = 0;

    @property(cc.Boolean)
    public IsShareRelive = false;

    private VideoAdid = "adunit-bf61185a259df4c2"
    private BannerAdid1 = "adunit-84752a29a640a476"
    private BannerAdid2 = "adunit-cb8e21a61e779439"
    private AppID = "wxf6746ff760dc4257"
    private _ShareReliveCount = 0
    private _MyAvatarURL = ""
    private _MyNickName = ""
    private _Province = 0
    private _AllLinks = []
    private _CurSelectMode = 0
    private _FriendDataList = []
    private _MyQianDaoCount = 0
    private _MyQianDaoTake = false
    private _SignInitList = []
    private _FuHuoCostGold = 0
    private _LinkIconURL = ""
    private _LinkAppID = ""
    private _LinkPath = ""
    private _LinkExtra = ""
    private _ShareTitle = ""
    private _ShareImageUrl = ""
    private _ShareContent = ""
    private _ShareReward = 5
    private _IsShareRelive = true
    private _CurShareReliveCount = 0
    private _CurZSAdData = null
    private _SKinDataArray = []
    private _CurMySKinIndex = 0
    private _CurRecord = 0
    private _GameStartTime = 0

    onEnable() {
        if (window.wx == null) return

        wx.getStorage({
            key: "wxData",
            success: (t) => {
                this._MyAvatarURL = t.data.avaUrl
                this._MyNickName = t.data.nick
                GameGlobal.UIManager.getUI(UIType.UIType_Hall).updateMyInfo()
            },
            fail: () => {
            }
        })
    }

    start() {
        this._CurSelectMode = 0
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
