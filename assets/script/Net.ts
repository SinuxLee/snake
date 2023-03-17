import { SignInitData, FriendInviteData, SkinData } from './DataManager'

import siteinfo from './siteinfo';
import { UIType } from './UIType';

const skinPrice = [0, 5e3, 8e3, 12e3, 100, 300, 600, 1e3, 2e3, 3e3, 4e3, 5e3, 6e3, 7e3, 8e3, 9e3, 1e4];
const skinType = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

const { ccclass, property } = cc._decorator;

@ccclass
export default class extends cc.Component {
    private _DataManager = null;
    private COMMON_M = "aishan_txtcs";

    onLoad() {
        this._DataManager = cc.find("DataManager").getComponent("DataManager")
    }

    onEnable() {
        this.requestUserInfo()
    }

    getURL(url:string, t) {
        let reqPath = siteinfo.siteroot + "?i=" + siteinfo.uniacid + "&t=" + siteinfo.multiid + "&v=" + siteinfo.version + "&from=wxapp&";
        if (url && ((url = url.split("/"))[0] &&
            (reqPath += "c=" + url[0] + "&"), url[1] &&
            (reqPath += "a=" + url[1] + "&"), url[2] &&
            (reqPath += "do=" + url[2] + "&")), t &&
            "object" === (void 0 === t ? "undefined" : r(t)))
            for (var n in t) n && t.hasOwnProperty(n) && t[n] && (reqPath += n + "=" + t[n] + "&");
        return reqPath
    }

    getUrl_qq(e, t) {
        var i = "i=" + siteinfo.uniacid + "&t=" + siteinfo.multiid + "&v=" + siteinfo.version + "&from=wxapp&";
        if (e && ((e = e.split("/"))[0] &&
            (i += "c=" + e[0] + "&"), e[1] &&
            (i += "a=" + e[1] + "&"), e[2] &&
            (i += "do=" + e[2] + "&")), t &&
            "object" === (void 0 === t ? "undefined" : r(t)))
            for (var n in t) n && t.hasOwnProperty(n) && t[n] && (i += n + "=" + t[n] + "&");
        return i
    }

    getQuery(e) {
        var t = [];
        if (-1 != e.indexOf("?"))
            for (var i = e.split("?")[1].split("&"), n = 0; n < i.length; n++) i[n].split("=")[0] && unescape(i[n].split("=")[1]) && (t[n] = {
                name: i[n].split("=")[0],
                value: unescape(i[n].split("=")[1])
            });
        return t
    }

    getUrlParam(e, t) {
        var i = new RegExp("(^|&)" + t + "=([^&]*)(&|$)"),
            n = e.split("?")[1].match(i);
        return null != n ? unescape(n[2]) : null
    }

    getSign(t, i, n) {
        var r = require('../lib/underscore'),
            a = require('../lib/md5'),
            s = "",
            c = this.getUrlParam(t, "sign");
        if (c || i && i.sign) return false;
        if (t && (s = this.getQuery(t)), i) {
            var f = [];
            for (var h in i) h && i[h] && (f = f.concat({
                name: h,
                value: i[h]
            }));
            s = s.concat(f)
        }
        s = r.sortBy(s, "name")
        s = r.uniq(s, true, "name");
        for (var d = "", u = 0; u < s.length; u++) s[u] && s[u].name && s[u].value && (d += s[u].name + "=" + s[u].value, u < s.length - 1 && (d += "&"));
        return n = n || siteinfo.token, console.log("危情生成的" + d + "---------" + n), c = a(d + n)
    }

    getUrlParam_qq(e, t) {
        var i = new RegExp("(^|&)" + t + "=([^&]*)(&|$)"),
            n = e.match(i);
        return null != n ? unescape(n[2]) : null
    }

    getSign_qq(url, data, n) {
        var r = require("../lib/underscore"),
            a = require("../lib/md5"),
            s = "",
            c = this.getUrlParam_qq(url, "sign");
        if (c || data && data.sign) return false;
        if (url && (s = this.getQuery(url)), data) {
            var f = [];
            for (var h in data) h && data[h] && (f = f.concat({
                name: h,
                value: data[h]
            }));
            s = s.concat(f)
        }
        s = r.sortBy(s, "name"), s = r.uniq(s, true, "name");
        for (var d = "", u = 0; u < s.length; u++) s[u] && s[u].name && s[u].value && (d += s[u].name + "=" + s[u].value, u < s.length - 1 && (d += "&"));
        return n = n || siteinfo.token, console.log("QQ生成的" + d + "---------" + n), d + "&sign=" + (c = a(d + n))
    }

    request(url:string, t, data:object, callback:Function) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            var r = this.getURL(url, t);
            if (!(sign = this.getSign(r, data))) return
            r = r + "&sign=" + sign
            if (window.wx == null) return;
            wx.request({
                url: r,
                data: data,
                header: {
                    "content-type": "application/x-www-form-urlencoded"
                },
                success: function (e) {
                    0 != e.data.errno && e.data.message && GameGlobal.UIManager.showMessage(e.data.message), callback(e.data.data, e.data.errno)
                },
                fail: function (e) {
                }
            })
        } else if (cc.sys.platform === cc.sys.QQ_PLAY) {
            let qqUrl = this.getUrl_qq(url, t);
            const sign = this.getSign_qq(qqUrl, data)
            if (!sign) return
            qqUrl += sign;
        }
    }

    sendTakeMsg() { }
    requestSign(session: string) {
        this.request("entry/wxapp/Sign", {m: this.COMMON_M}, {session3rd: session}, (e, t) =>{
            const mgr = GameGlobal.DataManager;
            mgr._MyQianDaoTake = (0 === e.sign_status)
            if (e.sign_list== null) return

            const signList = e.sign_list;
            mgr._SignInitList = [];

            for (let r = 0; r < signList.length; ++r) {
                const signData = new SignInitData();
                signData.signDay = signList[r].id
                signData.signReward = signList[r].type
                signData.signRewardNum = signList[r].number
                signData.signStatus = signList[r].sign_status
                mgr._SignInitList.push(signData)
            }

            if (0 == mgr._MyQianDaoTake) GameGlobal.UIManager.openUI(UIType.UIType_QianDao);
            else {
                const uiSign = GameGlobal.UIManager.getUI(UIType.UIType_QianDao);
                uiSign && uiSign.refreshUI()
            }
        })
    }

    requestSignReward(openId: string) {
        const data = {
            session3rd: GameGlobal.WeiXinPlatform._SessionID,
            id: openId
        }
        this.request("entry/wxapp/SignReward", {m: this.COMMON_M}, data, function (e, i) {
            GameGlobal.UIManager.showMessage("领取成功")
            GameGlobal.DataManager.setCurGold(e.gold)
            GameGlobal.DataManager.setDiamond(e.diamond)
            GameGlobal.DataManager._MyQianDaoTake = true
            GameGlobal.UIManager.RefreshCoin();
            const uiSign = GameGlobal.UIManager.getUI(UIType.UIType_QianDao);
            uiSign && uiSign.refreshUI()
            this.requestSign(GameGlobal.WeiXinPlatform._SessionID)
        })
    }

    requestUserInfo() {
        const gold = GameGlobal.localStorage.getItem("tcs_gold");
        const mgr = GameGlobal.DataManager;
        gold && mgr.setCurGold(parseInt(gold));

        const diamond = GameGlobal.localStorage.getItem("tcs_diamond");
        diamond && mgr.setDiamond(parseInt(diamond))
        GameGlobal.UIManager.RefreshCoin();

        const skinIdx = GameGlobal.localStorage.getItem("tcs_skinIndex");
        if(skinIdx) mgr._CurMySKinIndex = parseInt(skinIdx)
        mgr._SKinDataArray = [];

        for (var r = 0; r < 16; ++r) {
            const newSkin = new SkinData()
            newSkin.ID = r + 1
            newSkin.IsOwn = false
            newSkin.IsUse = false
            newSkin.Price = skinPrice[r]
            newSkin.Type = skinType[r]
            mgr._SKinDataArray.push(newSkin)
        }

        if(skinIdx && skinIdx < mgr._SKinDataArray.length) {
            const skinData = mgr._SKinDataArray[skinIdx]
            skinData.IsUse = true
        }

        let skinJSON = GameGlobal.localStorage.getItem("tcs_skinlist");
        if(!skinJSON) skinJSON = skinJSON = '{"skin_list":[1]}';
        const skinList = JSON.parse(skinJSON).skin_list;

        for (let c = 0; c < skinList.length; ++c) {
            const idx = skinList[c];
            if (idx && idx - 1 < mgr._SKinDataArray.length) {
                const skin = mgr._SKinDataArray[idx - 1]
                skin.IsOwn = true
            }
        }
            
        GameGlobal.UIManager.getUI(UIType.UIType_Skin).updateSkin()
    }

    requestInviteCome(openId) {
        const session = GameGlobal.WeiXinPlatform._SessionID;
        if(!session) return

        const data = {session3rd: session,srcOpenID: openId}
        this.request("entry/wxapp/Invite", {m: this.COMMON_M}, data, (e, t) => {

        })
    }

    requestInviteReward(openId) {
        const session = GameGlobal.WeiXinPlatform._SessionID;
        if(!session) return
        const data = {
            session3rd: session,
            srcOpenID: openId
        }
        this.request("entry/wxapp/Invite", {m: this.COMMON_M}, data, (e, t) => {

        })
    }

    requestFriendList() {
        const wxp = GameGlobal.WeiXinPlatform;
        if (wxp._SessionID && !(wxp._SessionID.length <= 0)) {
            this.request("entry/wxapp/InviteFriend", {m: this.COMMON_M}, {session3rd: wxp._SessionID}, (e, t) => {
                const mgr = GameGlobal.DataManager;
                mgr._FriendDataList = [];
                for (let n = 0; n < e.length; ++n) {
                    const r = e[n],data = new FriendInviteData();
                    data.HeadUrl = r.avatarUrl
                    data.IsCanTake = 0 == r.status
                    data.ID = r.id
                    data.Reward = r.reward
                    data.OpenID = r.openId
                    mgr._FriendDataList.push(data)
                }
                GameGlobal.UIManager.getUI(UIType.UIType_InviteFriend).refreshList()
            })
        }
    }

    requestScore(e) {
        const wxp = GameGlobal.WeiXinPlatform;
        if (wxp._SessionID && !(wxp._SessionID.length <= 0)) {
            const mgr = GameGlobal.DataManager;
            if (!(Number(mgr._CurRecord) >= Number(e))) {
                mgr._CurRecord = Number(e);
                this.request("entry/wxapp/Record", {m: this.COMMON_M}, {
                    session3rd: wxp._SessionID,
                    record: e
                }, (e, t) => { })
            }
        }
    }

    requestScoreGold(len: number) {
        const score = Math.ceil(len / 1e3);
        GameGlobal.UIManager.getUI(UIType.UIType_GameEnd).refreshRewardGold(score);

        let totalGold = parseInt(GameGlobal.localStorage.getItem("tcs_gold"));
        totalGold += score;
        GameGlobal.localStorage.setItem("tcs_gold", JSON.stringify(totalGold))
        this.requestUserInfo()
    }

    requestZSShare() {

    }
    requestZSAd(e) {

    }
    requestZSAdCollect(e) {

    }
    requestZSTest() {

    }
}