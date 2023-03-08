
var n;

function r(e, t, i) {
    return t in e ? Object.defineProperty(e, t, {
        value: i,
        enumerable: true,
        configurable: true,
        writable: true
    }) : e[t] = i, e
}

const UIType = require('UIType')
const SignInitData = cc.Class({
    properties: {
        signDay: 0,
        signReward: 0,
        signRewardNum: 0,
        signStatus: 0
    }
})

const FriendInviteData = cc.Class({
    properties: {
        HeadUrl: "",
        IsCanTake: false,
        Reward: 0,
        ID: 0,
        OpenID: ""
    }
})

const SkinData = cc.Class({
    properties: {
        ID: 0,
        Price: 5,
        Type: 0,
        IsOwn: false,
        IsUse: false
    }
});

cc.Class({
    extends: cc.Component,
    properties: (n = {
        CurScore: {
            default: 0,
            type: cc.Integer
        },
        CurGold: {
            default: 0,
            type: cc.Integer
        },
        CurFlower: {
            default: 0,
            type: cc.Integer
        },
        CurDiamond: {
            default: 0,
            type: cc.Integer
        },
        IsShareRelive: {
            default: false,
        },

        VideoAdid: "adunit-bf61185a259df4c2",
        BannerAdid1: "adunit-84752a29a640a476",
        BannerAdid2: "adunit-cb8e21a61e779439",
        AppID: "wxf6746ff760dc4257",
        _ShareReliveCount: 0,
        _MyAvatarURL: "",
        _MyNickName: "",
        _Province: 0,
        _AllLinks: [],
        _CurSelectMode: 0,
        _FriendDataList: [],
        _MyQianDaoCount: 0,
        _MyQianDaoTake: false,
        _SignInitList: [],
        _FuHuoCostGold: 0,
        _LinkIconURL: "",
        _LinkAppID: "",
        _LinkPath: "",
        _LinkExtra: "",
        _ShareTitle: "",
        _ShareImageUrl: "",
        _ShareContent: "",
        _ShareReward: 5,
        _IsShareRelive: true
    },
        r(n, "_ShareReliveCount", 0),
        r(n, "_CurShareReliveCount", 0),
        r(n, "_CurZSAdData", null),
        r(n, "_SKinDataArray", []),
        r(n, "_CurMySKinIndex", 0),
        r(n, "_CurRecord", 0),
        r(n, "_GameStartTime", 0),
        n
    ),

    onEnable: function () {
        if (window.wx == null) return

        wx.getStorage({
            key: "wxData",
            success: (t) => {
                console.log("getStorage user success ", t)
                this._MyAvatarURL = t.data.avaUrl
                this._MyNickName = t.data.nick
                GameGlobal.UIManager.getUI(UIType.UIType_Hall).updateMyInfo()
            },
            fail: () => {
                console.log("getStorage wxData fail ")
            }
        })
    },

    start: function () {
        cc.log("DataManager start")
        this._CurSelectMode = 0
    },

    getCurScore: function () {
        return this.CurScore
    },

    setCurScore: function (e) {
        this.CurScore = e
    },

    getCurGold: function () {
        return this.CurGold
    },

    setCurGold: function (e) {
        e && (this.CurGold = e)
    },

    getCurFlower: function () {
        return this.CurFlower
    },

    setCurFlower: function (e) {
        e < 0 && (e = 0), this.CurFlower = e
    },

    setDiamond: function (e) {
        e && (e < 0 && (e = 0), this.CurDiamond = e)
    },

    getCurDiamond: function () {
        return this.CurDiamond
    },

    getFuHuoGold: function () {
        return this._FuHuoCostGold
    },

    setShareRelive: function (e) {
        e && (this.IsShareRelive = e)
    },

    getShareRelive: function () {
        return this.IsShareRelive
    },

    setShareTitle: function (e) {
        this._ShareTitle = e
    },

    getShareTitle: function () {
        return this._ShareTitle
    },

    setShareImage: function (e) {
        this._ShareImageUrl = e
    },

    getShareImage: function () {
        return this._ShareImageUrl
    },

    setShareReliveCount: function (e) {
        this._ShareReliveCount = e
    },

    getShareReliveCount: function () {
        return this._ShareReliveCount
    }
})

module.exports = {
    FriendInviteData,
    SignInitData,
    SkinData
}

window.GameRewardType = {
    RT_GOLD: 0,
    RT_DIAMOND: 1,
    RT_FLOWER: 2
}