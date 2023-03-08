var n = require('UIType');
// require('WXBizDataCrypt');
cc.Class({
    extends: cc.Component,
    properties: {
        _WXOpenID: "",
        _SessionID: "",
        _CurQuery: "",
        _ShareCount: 0,
        _ShareGroupArray: [],
        _LastShareDate: 0
    },
    onLoad: function() {
        cc.log("WeiXinPlatform onLoad----------------------")
    },
    onEnable: function() {},
    onDisable: function() {},
    getWXOpenID: function() {
        return this._WXOpenID
    },
    start: function() {
        if (cc.log("WeiXinPlatform start enter-----------------------------"), this.clear(), cc.sys.platform === cc.sys.WECHAT_GAME) {
            if (void 0 == window.wx) return;
            wx.onShow(this.onWeiXinShow);
            var e = wx.getStorageSync("openid");
            e && (this._WXOpenID = e);
            var t = wx.getStorageSync("s3id");
            console.log("weixinPlatform start", t), console.log("getStorageSync first login"), this.wxLogin()
        } else if (cc.sys.platform === cc.sys.QQ_PLAY) {
            this._WXOpenID = GameStatusInfo.openId;
            var i = GameGlobal.DataManager;
            BK.MQQ.Account.getNick(GameStatusInfo.openId, function(e, t) {
                BK.Script.log(0, 0, "Nick :" + t), i._MyNickName = t
            }), BK.MQQ.Account.getHeadEx(GameStatusInfo.openId, function(e, t) {
                cc.log("getHeadEx " + t), i._MyAvatarURL = t, GameGlobal.UIManager.getUI(n.UIType_Hall).updateMyInfo()
            });
            t = GameGlobal.localStorage.getItem("s3id");
            console.log("weixinPlatform start" + t), t ? (console.log("getStorageSync sessionID", t), this._SessionID = t, GameGlobal.Net.requestUserInfo(), GameGlobal.Net.requestSign(this._SessionID), this.checkQQIsInviteReq()) : (console.log("qq getStorageSync first login"), this.qqLogin())
        }
        cc.log("WeiXinPlatform start leave-----------------------------")
    },
    clear: function() {},
    wxLogin: function() {
        if (console.log("wxLogin enter--------"), void 0 != window.wx) {
            var e = cc.sys.localStorage.getItem("usernickname1");
            if (!(this._SessionID.length > 0)) {
                if ("" != e && null != e && void 0 != e) return window.playname = cc.sys.localStorage.getItem("usernickname1"), window.playimg = cc.sys.localStorage.getItem("usernickimg"), GameGlobal.DataManager._MyNickName = window.playname, GameGlobal.DataManager._MyAvatarURL = window.playimg, window.mainhall.updateMyInfo(), void console.log("已经登录过了 ： " + window.playname + " : " + window.playimg);
                console.log("will call wx login------------------------");
                GameGlobal.UIManager.showMask(!0);
                wx.getSystemInfoSync().screenWidth, wx.getSystemInfoSync().screenHeight;
                var t = wx.getSystemInfoSync().windowWidth,
                    i = wx.getSystemInfoSync().windowHeight;
                console.warn("创建获取用户信息按钮");
                var n = wx.createUserInfoButton({
                    type: "text",
                    text: "",
                    style: {
                        left: 0,
                        top: 0,
                        width: t,
                        height: i,
                        lineHeight: i,
                        backgroundColor: "rgba(0, 0, 0, 0)",
                        color: "rgba(0, 0, 0, 0)",
                        textAlign: "center",
                        fontSize: 16,
                        borderRadius: 4
                    }
                });
                window.wxbutton = n, n.onTap(function(e) {
                    n.hide(), GameGlobal.UIManager.showMask(!1), wx.login({
                        success: function(e) {
                            console.log("weixin name :", e.code);
                            var t = [];
                            t.push(e.code), window.userid = e.code, window.loginkeylist = t, wx.getUserInfo({
                                openIdList: window.loginkeylist,
                                success: function(e) {
                                    var t = e.userInfo;
                                    window.wxbutton.hide(), console.log("weixin name :" + t + " userid:" + window.userid), window.islogin = !0, window.playname = t.nickName, window.playimg = t.avatarUrl, console.log("weixin name 1 :" + window.playname + " userid:" + window.playimg), cc.sys.localStorage.setItem("usernickname1", t.nickName), cc.sys.localStorage.setItem("usernickuserid", window.userid), cc.sys.localStorage.setItem("usernickimg", window.playimg), GameGlobal.DataManager._MyNickName = window.playname, GameGlobal.DataManager._MyAvatarURL = window.playimg, window.mainhall.updateMyInfo()
                                },
                                fail: function(e) {
                                    window.wxbutton.hide(), console.log("winxinfail", e), window.playname = "游客", window.islogin = !0
                                }
                            })
                        },
                        fail: function(e) {
                            console.log("weixin fail :", e.code), window.playname = "游客", window.islogin = !0
                        }
                    }), cc.sys.localStorage.setItem("usernickuserid", window.userid)
                })
            }
        }
    },
    qqLogin: function() {
        cc.log("qqLogin enter ------------------------------");
        var e = this;
        BK.QQ.fetchOpenKey(function(t, i, n) {
            if (0 == t) {
                var r = n.openKey;
                console.log("qq fetchOpenKey " + r), console.log("qq openid" + GameStatusInfo.openId), GameGlobal.Net.request("entry/wxapp/login", {
                    m: GameGlobal.Net.COMMON_M
                }, {
                    openkey: r,
                    openid: GameStatusInfo.openId
                }, function(t) {
                    t && (GameGlobal.localStorage.setItem("s3id", t.session3rd), e._SessionID = t.session3rd, GameGlobal.Net.requestZSShare(), GameGlobal.Net.requestUserInfo(), GameGlobal.Net.requestSign(e._SessionID), e.checkQQIsInviteReq())
                })
            }
        }), cc.log("qqLogin leave ------------------------------")
    },
    wxLoginForShare: function(e) {
        if (console.log("wxLogin enter--------"), void 0 != window.wx) {
            console.log("will call wx login------------------------");
            var t = this;
            wx.login({
                success: function(i) {
                    wx.getUserInfo({
                        withCredentials: !0,
                        success: function(r) {
                            console.log("getUserInfo ", r), GameGlobal.Net.request("entry/wxapp/login", {
                                m: GameGlobal.Net.COMMON_M
                            }, {
                                code: i.code,
                                encryptedData: r.encryptedData,
                                iv: r.iv
                            }, function(i) {
                                var r = i.userInfo.openId;
                                wx.setStorageSync("openid", r), wx.setStorageSync("s3id", i.session3rd), t._WXOpenID = r, t._SessionID = i.session3rd;
                                var a = GameGlobal.DataManager;
                                a._MyAvatarURL = i.userInfo.avatarUrl, a._MyNickName = i.userInfo.nickName, a._Province = i.userInfo.province, e && e(), wx.setStorage({
                                    key: "wxData",
                                    data: {
                                        nick: a._MyNickName,
                                        avaUrl: a._MyAvatarURL
                                    }
                                }), GameGlobal.UIManager.getUI(n.UIType_Hall).updateMyInfo(), GameGlobal.Net.requestUserInfo()
                            })
                        },
                        fail: function() {
                            wx.showToast({
                                title: "获取信息失败",
                                icon: "none",
                                duration: 1500
                            })
                        }
                    })
                },
                fail: function() {
                    wx.showToast({
                        title: "登陆失败",
                        icon: "none",
                        duration: 1500
                    })
                }
            })
        }
    },
    onWXShare: function() {
        if (void 0 != window.wx)
            if (void 0 != this._WXOpenID && 0 != this._WXOpenID.length) {
                var e = "srcOpenID=" + this._WXOpenID,
                    t = GameGlobal.DataManager;
                wx.onShareAppMessage(function() {
                    return {
                        title: t.getShareTitle(),
                        imageUrl: t.getShareImage(),
                        query: e
                    }
                })
            } else console.log("onWXShare invalid openID")
    },
    checkInviteAndRequest: function(e) {
        console.log("-----------------------------checkInviteAndRequest----------------------------- ", e), e && e.srcOpenID && GameGlobal.Net.requestInviteCome(e.srcOpenID)
    },
    checkQQIsInviteReq: function() {
        if (console.log("-----------------------------checkQQIsInviteReq----------------------------- "), cc.sys.platform === cc.sys.QQ_PLAY && GameStatusInfo.gameParam && GameStatusInfo.gameParam.length > 0) {
            console.log("-----------------------------checkQQIsInviteReq---------------- " + GameStatusInfo.gameParam);
            var e = GameStatusInfo.gameParam.split("=");
            if (e && e.length >= 2) {
                var t = e[1];
                t && GameGlobal.Net.requestInviteCome(t)
            }
        }
    },
    onWeiXinShow: function(e) {
        console.log("---------------------------------onWeiXinShow---------------------------------"), console.log(e);
        var t = GameGlobal.WeiXinPlatform;
        e.query && t.checkInviteAndRequest(e.query)
    },
    showShare: function(e, t) {
        GameGlobal.DataManager;
        return cc.sys.platform === cc.sys.WECHAT_GAME && wx.shareAppMessage({
            title: "",
            imageUrl: "",
            desc: "1010快消是一款简单而有挑战的益智类小游戏，玩法简单易学！",
            link: "http://baidu.com",
            path: "/pages/index",
            type: "link",
            query: "",
            success: function(e) {},
            fail: function(e) {
                console.log("share faile", e)
            },
            complete: function() {
                console.log("share complete--------------------")
            }
        }), !0
    },
    postScoreToPlatform: function(e, t) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            if (void 0 == window.wx) return;
            wx.postMessage({
                msgType: 1,
                bestScore: e
            })
        } else if (cc.sys.platform === cc.sys.QQ_PLAY) {
            var i = {
                userData: [{
                    openId: GameStatusInfo.openId,
                    startMs: t.toString(),
                    endMs: (new Date).getTime().toString(),
                    scoreInfo: {
                        score: e
                    }
                }],
                attr: {
                    score: {
                        type: "rank",
                        order: 1
                    }
                }
            };
            BK.QQ.uploadScoreWithoutRoom(1, i, function(e, t, i) {
                0 === e || BK.Script.log(1, 1, "上传分数失败!错误码：" + e)
            })
        }
    }
})