var n;
var r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
    return typeof e
} : function(e) {
    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
};

function a(e, t, i) {
    return t in e ? Object.defineProperty(e, t, {
        value: i,
        enumerable: true,
        configurable: true,
        writable: true
    }) : e[t] = i, e
}
var o = require('siteinfo'),
    s = require('UIType'),
    c = require('DataManager').SignInitData,
    f = require("DataManager").FriendInviteData,
    h = require("DataManager").SkinData,
    d = [0, 5e3, 8e3, 12e3, 100, 300, 600, 1e3, 2e3, 3e3, 4e3, 5e3, 6e3, 7e3, 8e3, 9e3, 1e4],
    u = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
cc.Class((a(n = {
    extends: cc.Component,
    properties: {
        _DataManager: null,
        COMMON_M: "aishan_txtcs"
    },
    onLoad: function() {
        var e = cc.find("DataManager");
        this._DataManager = e.getComponent("DataManager")
    },
    onEnable: function() {
        this.requestUserInfo()
    },
    
    getURL: function(e, t) {
        var i = o.siteroot + "?i=" + o.uniacid + "&t=" + o.multiid + "&v=" + o.version + "&from=wxapp&";
        if (e && ((e = e.split("/"))[0] && (i += "c=" + e[0] + "&"), e[1] && (i += "a=" + e[1] + "&"), e[2] && (i += "do=" + e[2] + "&")), t && "object" === (void 0 === t ? "undefined" : r(t)))
            for (var n in t) n && t.hasOwnProperty(n) && t[n] && (i += n + "=" + t[n] + "&");
        return i
    },
    getUrl_qq: function(e, t) {
        var i = "i=" + o.uniacid + "&t=" + o.multiid + "&v=" + o.version + "&from=wxapp&";
        if (e && ((e = e.split("/"))[0] && (i += "c=" + e[0] + "&"), e[1] && (i += "a=" + e[1] + "&"), e[2] && (i += "do=" + e[2] + "&")), t && "object" === (void 0 === t ? "undefined" : r(t)))
            for (var n in t) n && t.hasOwnProperty(n) && t[n] && (i += n + "=" + t[n] + "&");
        return i
    },
    getQuery: function(e) {
        var t = [];
        if (-1 != e.indexOf("?"))
            for (var i = e.split("?")[1].split("&"), n = 0; n < i.length; n++) i[n].split("=")[0] && unescape(i[n].split("=")[1]) && (t[n] = {
                name: i[n].split("=")[0],
                value: unescape(i[n].split("=")[1])
            });
        return t
    },
    getUrlParam: function(e, t) {
        var i = new RegExp("(^|&)" + t + "=([^&]*)(&|$)"),
            n = e.split("?")[1].match(i);
        return null != n ? unescape(n[2]) : null
    },
    getSign: function(t, i, n) {
        var r = require('underscore'),
            a = require('md5'),
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
        s = r.sortBy(s, "name"), s = r.uniq(s, true, "name");
        for (var d = "", u = 0; u < s.length; u++) s[u] && s[u].name && s[u].value && (d += s[u].name + "=" + s[u].value, u < s.length - 1 && (d += "&"));
        return n = n || o.token, console.log("危情生成的" + d + "---------" + n), c = a(d + n)
    }
}, "getUrlParam", function(e, t) {
    var i = new RegExp("(^|&)" + t + "=([^&]*)(&|$)"),
        n = e.split("?")[1].match(i);
    return null != n ? unescape(n[2]) : null
}), a(n, "getSign", function(t, i, n) {
    var r = e("underscore"),
        a = e("md5"),
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
    s = r.sortBy(s, "name"), s = r.uniq(s, true, "name");
    for (var d = "", u = 0; u < s.length; u++) s[u] && s[u].name && s[u].value && (d += s[u].name + "=" + s[u].value, u < s.length - 1 && (d += "&"));
    return n = n || o.token, console.log("危情生成的" + d + "---------" + n), c = a(d + n)
}), a(n, "getUrlParam_qq", function(e, t) {
    var i = new RegExp("(^|&)" + t + "=([^&]*)(&|$)"),
        n = e.match(i);
    return null != n ? unescape(n[2]) : null
}), a(n, "getSign_qq", function(t, i, n) {
    var r = e("underscore"),
        a = e("md5"),
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
    return n = n || o.token, console.log("QQ生成的" + d + "---------" + n), d + "&sign=" + (c = a(d + n))
}), a(n, "request", function(e, t, i, n) {
    if (cc.log("net request enter ----------------------" + e), cc.sys.platform === cc.sys.WECHAT_GAME) {
        var r = this.getURL(e, t);
        if (!(a = this.getSign(r, i))) return void console.log("error sign");
        if (r = r + "&sign=" + a, console.log("wx request ", r), void 0 == window.wx) return;
        wx.request({
            url: r,
            data: i,
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: function(e) {
                console.log("response: ", e), 0 != e.data.errno && e.data.message && GameGlobal.UIManager.showMessage(e.data.message), n(e.data.data, e.data.errno)
            },
            fail: function(e) {
                console.log("request fail----------------")
            }
        })
    } else if (cc.sys.platform === cc.sys.QQ_PLAY) {
        var a;
        r = this.getUrl_qq(e, t);
        if (!(a = this.getSign_qq(r, i))) return void console.log("error sign");
        r += a, console.log("url = " + o.siteroot);
        var s = o.siteroot + "?" + r;
        console.log("qq request url " + s)
    }
    cc.log("net request leave ----------------------" + e)
}), a(n, "sendTakeMsg", function() {}), a(n, "requestSign", function(e) {
    this.request("entry/wxapp/Sign", {
        m: this.COMMON_M
    }, {
        session3rd: e
    }, function(e, t) {
        console.log("requestSign callback----------", t);
        var i = GameGlobal.DataManager;
        if (i._MyQianDaoTake = 0 === e.sign_status, void 0 != e.sign_list) {
            var n = e.sign_list;
            i._SignInitList = [];
            for (var r = 0; r < n.length; ++r) {
                var a = new c;
                a.signDay = n[r].id, a.signReward = n[r].type, a.signRewardNum = n[r].number, a.signStatus = n[r].sign_status, i._SignInitList.push(a)
            }
            if (0 == i._MyQianDaoTake) GameGlobal.UIManager.openUI(s.UIType_QianDao);
            else {
                var o = GameGlobal.UIManager.getUI(s.UIType_QianDao);
                o && o.refreshUI()
            }
        }
    })
}), a(n, "requestSignReward", function(e) {
    var t = this;
    this.request("entry/wxapp/SignReward", {
        m: t.COMMON_M
    }, {
        session3rd: GameGlobal.WeiXinPlatform._SessionID,
        id: e
    }, function(e, i) {
        console.log("requestSignReward callback----------", i), GameGlobal.UIManager.showMessage("领取成功"), GameGlobal.DataManager.setCurGold(e.gold), GameGlobal.DataManager.setDiamond(e.diamond), GameGlobal.DataManager._MyQianDaoTake = true, GameGlobal.UIManager.RefreshCoin();
        var n = GameGlobal.UIManager.getUI(s.UIType_QianDao);
        n && n.refreshUI(), t.requestSign(GameGlobal.WeiXinPlatform._SessionID)
    })
}), a(n, "requestUserInfo", function() {
    var e = GameGlobal.localStorage.getItem("tcs_gold"),
        t = GameGlobal.DataManager;
    e && t.setCurGold(parseInt(e));
    var i = GameGlobal.localStorage.getItem("tcs_diamond");
    i && t.setDiamond(parseInt(i)), GameGlobal.UIManager.RefreshCoin();
    var n = GameGlobal.localStorage.getItem("tcs_skinIndex");
    null != n && void 0 != n && (t._CurMySKinIndex = parseInt(n)), t._SKinDataArray = [];
    for (var r = 0; r < 16; ++r) {
        (f = new h).ID = r + 1, f.IsOwn = false, f.IsUse = false, f.Price = d[r], f.Type = u[r], t._SKinDataArray.push(f)
    }
    n && n < t._SKinDataArray.length && ((f = t._SKinDataArray[n]).IsUse = true);
    var a, o = GameGlobal.localStorage.getItem("tcs_skinlist");
    if (o || (o = '{"skin_list":[1]}'), (a = JSON.parse(o).skin_list) && a.length > 0)
        for (var c = 0; c < a.length; ++c) {
            var f, l = a[c];
            if (l && l - 1 < t._SKinDataArray.length)(f = t._SKinDataArray[l - 1]).IsOwn = true
        }
    GameGlobal.UIManager.getUI(s.UIType_Skin).updateSkin()
}), a(n, "requestInviteCome", function(e) {
    var t = GameGlobal.WeiXinPlatform._SessionID;
    if (!(void 0 == t || t.length <= 0)) {
        this.request("entry/wxapp/Invite", {
            m: this.COMMON_M
        }, {
            session3rd: t,
            srcOpenID: e
        }, function(e, t) {
            console.log("requestInviteCome response")
        })
    }
}), a(n, "requestInviteReward", function(e) {
    var t = GameGlobal.WeiXinPlatform._SessionID;
    if (!(void 0 == t || t.length <= 0)) {
        this.request("entry/wxapp/Invite", {
            m: this.COMMON_M
        }, {
            session3rd: t,
            srcOpenID: srcOpenID
        }, function(e, t) {
            console.log("requestInviteCome response")
        })
    }
}), a(n, "requestFriendList", function() {
    var e = GameGlobal.WeiXinPlatform;
    if (e._SessionID && !(e._SessionID.length <= 0)) {
        this.request("entry/wxapp/InviteFriend", {
            m: this.COMMON_M
        }, {
            session3rd: e._SessionID
        }, function(e, t) {
            var i = GameGlobal.DataManager;
            i._FriendDataList = [];
            for (var n = 0; n < e.length; ++n) {
                var r = e[n],
                    a = new f;
                a.HeadUrl = r.avatarUrl, a.IsCanTake = 0 == r.status, a.ID = r.id, a.Reward = r.reward, a.OpenID = r.openId, i._FriendDataList.push(a)
            }
            GameGlobal.UIManager.getUI(s.UIType_InviteFriend).refreshList()
        })
    }
}), a(n, "requestScore", function(e) {
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
            }, function(e, t) {})
        }
    }
}), a(n, "requestScoreGold", function(e) {
    var t = Math.ceil(e / 1e3);
    GameGlobal.UIManager.getUI(s.UIType_GameEnd).refreshRewardGold(t);
    var i = GameGlobal.localStorage.getItem("tcs_gold");
    console.log(" -----jinbi :  " + i);
    var n = parseInt(i) + t;
    return GameGlobal.localStorage.setItem("tcs_gold", JSON.stringify(n)), void this.requestUserInfo()
}), a(n, "getZSURL", function(e, t) {
    if (void 0 == t.sign && (t.sign = this.getZSSign(e, t)), t) {
        var i = "",
            n = 0;
        for (var r in t) r && t[r] && (i += 0 == n ? r + "=" + t[r] : "&" + r + "=" + t[r], ++n);
        e += "?" + i
    }
    return e
}), a(n, "getZSSign", function(t, i) {
    var n = e("underscore"),
        r = require('md5-2'),
        a = "";
    if (t && (a = this.getQuery(t)), i) {
        var o = [];
        for (var s in i) s && i[s] && (o = o.concat({
            name: s,
            value: i[s]
        }));
        a = a.concat(o)
    }
    a = n.sortBy(a, "name"), a = n.uniq(a, true, "name");
    for (var c = "", f = 0; f < a.length; f++) a[f] && a[f].name && a[f].value && (c += a[f].name + ":" + a[f].value);
    c += "u9GUhTZ8DzV2f5ko", console.log("getZSSign before ", c);
    var h = r(c).toLowerCase();
    return console.log("getZSSign", h, c), h
}), a(n, "requestZSShare", function() {}), a(n, "requestZSAd", function(e) {}), a(n, "requestZSAdCollect", function(e) {}), a(n, "requestZSTest", function() {}), n))