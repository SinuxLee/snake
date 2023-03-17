import { SignInitData, FriendInviteData, SkinData } from './DataManager'

import siteinfo from './siteinfo';
import { UIType } from './UIType';

const d = [0, 5e3, 8e3, 12e3, 100, 300, 600, 1e3, 2e3, 3e3, 4e3, 5e3, 6e3, 7e3, 8e3, 9e3, 1e4];
const u = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

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

    getURL(e, t) {
        var i = siteinfo.siteroot + "?i=" + siteinfo.uniacid + "&t=" + siteinfo.multiid + "&v=" + siteinfo.version + "&from=wxapp&";
        if (e && ((e = e.split("/"))[0] &&
            (i += "c=" + e[0] + "&"), e[1] &&
            (i += "a=" + e[1] + "&"), e[2] &&
            (i += "do=" + e[2] + "&")), t &&
            "object" === (void 0 === t ? "undefined" : r(t)))
            for (var n in t) n && t.hasOwnProperty(n) && t[n] && (i += n + "=" + t[n] + "&");
        return i
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

    getSign_qq(t, i, n) {
        var r = require("../lib/underscore"),
            a = require("../lib/md5"),
            s = "",
            c = this.getUrlParam_qq(t, "sign");
        if (c || i && i.sign) return false;
        if (t && (s = this.getQuery(t)), i) {
            var f = [];
            for (var h in i) h && i[h] && (f = f.concat({
                name: h,
                value: i[h]
            }));
            s = s.concat(f)
        }
        s = r.sortBy(s, "name"), s = r.uniq(s, true, "name");
        for (var d = "", u = 0; u < s.length; u++) s[u] && s[u].name && s[u].value && (d += s[u].name + "=" + s[u].value, u < s.length - 1 && (d += "&"));
        return n = n || siteinfo.token, console.log("QQ生成的" + d + "---------" + n), d + "&sign=" + (c = a(d + n))
    }

    request(e, t, i, n) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            var r = this.getURL(e, t);
            if (!(a = this.getSign(r, i))) return
            r = r + "&sign=" + a
            if (window.wx == null) return;
            wx.request({
                url: r,
                data: i,
                header: {
                    "content-type": "application/x-www-form-urlencoded"
                },
                success: function (e) {
                    0 != e.data.errno && e.data.message && GameGlobal.UIManager.showMessage(e.data.message), n(e.data.data, e.data.errno)
                },
                fail: function (e) {
                }
            })
        } else if (cc.sys.platform === cc.sys.QQ_PLAY) {
            var a;
            r = this.getUrl_qq(e, t);
            if (!(a = this.getSign_qq(r, i))) return

            r += a;
        }
    }

    sendTakeMsg() { }
    requestSign(e) {
        this.request("entry/wxapp/Sign", {
            m: this.COMMON_M
        }, {
            session3rd: e
        }, function (e, t) {
            var i = GameGlobal.DataManager;
            if (i._MyQianDaoTake = 0 === e.sign_status, void 0 != e.sign_list) {
                var n = e.sign_list;
                i._SignInitList = [];
                for (var r = 0; r < n.length; ++r) {
                    var a = new SignInitData();
                    a.signDay = n[r].id, a.signReward = n[r].type, a.signRewardNum = n[r].number, a.signStatus = n[r].sign_status, i._SignInitList.push(a)
                }
                if (0 == i._MyQianDaoTake) GameGlobal.UIManager.openUI(UIType.UIType_QianDao);
                else {
                    var o = GameGlobal.UIManager.getUI(UIType.UIType_QianDao);
                    o && o.refreshUI()
                }
            }
        })
    }

    requestSignReward(e) {
        var t = this;
        this.request("entry/wxapp/SignReward", {
            m: t.COMMON_M
        }, {
            session3rd: GameGlobal.WeiXinPlatform._SessionID,
            id: e
        }, function (e, i) {
            GameGlobal.UIManager.showMessage("领取成功"), GameGlobal.DataManager.setCurGold(e.gold), GameGlobal.DataManager.setDiamond(e.diamond), GameGlobal.DataManager._MyQianDaoTake = true, GameGlobal.UIManager.RefreshCoin();
            var n = GameGlobal.UIManager.getUI(UIType.UIType_QianDao);
            n && n.refreshUI(), t.requestSign(GameGlobal.WeiXinPlatform._SessionID)
        })
    }

    requestUserInfo() {
        var e = GameGlobal.localStorage.getItem("tcs_gold"),
            t = GameGlobal.DataManager;
        e && t.setCurGold(parseInt(e));
        var i = GameGlobal.localStorage.getItem("tcs_diamond");
        i && t.setDiamond(parseInt(i)), GameGlobal.UIManager.RefreshCoin();
        var n = GameGlobal.localStorage.getItem("tcs_skinIndex");
        null != n && void 0 != n && (t._CurMySKinIndex = parseInt(n)), t._SKinDataArray = [];
        for (var r = 0; r < 16; ++r) {
            (f = new SkinData()).ID = r + 1, f.IsOwn = false, f.IsUse = false, f.Price = d[r], f.Type = u[r], t._SKinDataArray.push(f)
        }
        n && n < t._SKinDataArray.length && ((f = t._SKinDataArray[n]).IsUse = true);
        var a, o = GameGlobal.localStorage.getItem("tcs_skinlist");
        if (o || (o = '{"skin_list":[1]}'), (a = JSON.parse(o).skin_list) && a.length > 0)
            for (var c = 0; c < a.length; ++c) {
                var f, l = a[c];
                if (l && l - 1 < t._SKinDataArray.length) (f = t._SKinDataArray[l - 1]).IsOwn = true
            }
        GameGlobal.UIManager.getUI(UIType.UIType_Skin).updateSkin()
    }

    requestInviteCome(e) {
        var t = GameGlobal.WeiXinPlatform._SessionID;
        if (!(void 0 == t || t.length <= 0)) {
            this.request("entry/wxapp/Invite", {
                m: this.COMMON_M
            }, {
                session3rd: t,
                srcOpenID: e
            }, function (e, t) {
            })
        }
    }

    requestInviteReward(e) {
        var t = GameGlobal.WeiXinPlatform._SessionID;
        if (!(void 0 == t || t.length <= 0)) {
            this.request("entry/wxapp/Invite", {
                m: this.COMMON_M
            }, {
                session3rd: t,
                srcOpenID: srcOpenID
            }, function (e, t) {
            })
        }
    }

    requestFriendList() {
        var e = GameGlobal.WeiXinPlatform;
        if (e._SessionID && !(e._SessionID.length <= 0)) {
            this.request("entry/wxapp/InviteFriend", {
                m: this.COMMON_M
            }, {
                session3rd: e._SessionID
            }, function (e, t) {
                var i = GameGlobal.DataManager;
                i._FriendDataList = [];
                for (var n = 0; n < e.length; ++n) {
                    var r = e[n],
                        a = new FriendInviteData();
                    a.HeadUrl = r.avatarUrl
                    a.IsCanTake = 0 == r.status
                    a.ID = r.id
                    a.Reward = r.reward
                    a.OpenID = r.openId
                    i._FriendDataList.push(a)
                }
                GameGlobal.UIManager.getUI(UIType.UIType_InviteFriend).refreshList()
            })
        }
    }

    requestScore(e) {
        var t = GameGlobal.WeiXinPlatform;
        if (t._SessionID && !(t._SessionID.length <= 0)) {
            var i = GameGlobal.DataManager;
            if (!(Number(i._CurRecord) >= Number(e))) {
                i._CurRecord = Number(e);
                this.request("entry/wxapp/Record", {
                    m: this.COMMON_M
                }, {
                    session3rd: t._SessionID,
                    record: e
                }, function (e, t) { })
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