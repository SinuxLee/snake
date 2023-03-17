import { UIType } from './UIType';

const { ccclass, property } = cc._decorator;
@ccclass
export default class extends cc.Component {
    private _WXOpenID = "";
    private _SessionID = "";
    private _CurQuery = "";
    private _ShareCount = 0;
    private _ShareGroupArray = [];
    private _LastShareDate = 0;

    getWXOpenID() {
        return this._WXOpenID
    }

    start() {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            if (window.wx == null) return;
            wx.onShow(this.onWeiXinShow);
            var e = wx.getStorageSync("openid");
            e && (this._WXOpenID = e);
            var t = wx.getStorageSync("s3id");
            this.wxLogin()
        } else if (cc.sys.platform === cc.sys.QQ_PLAY) {
            this._WXOpenID = GameStatusInfo.openId;
            var i = GameGlobal.DataManager;
            BK.MQQ.Account.getNick(GameStatusInfo.openId, function (e, t) {
                BK.Script.log(0, 0, "Nick :" + t), i._MyNickName = t
            }), BK.MQQ.Account.getHeadEx(GameStatusInfo.openId, function (e, t) {
                i._MyAvatarURL = t;
                GameGlobal.UIManager.getUI(UIType.UIType_Hall).updateMyInfo()
            });
            t = GameGlobal.localStorage.getItem("s3id");
            t ? (this._SessionID = t, GameGlobal.Net.requestUserInfo(), GameGlobal.Net.requestSign(this._SessionID), this.checkQQIsInviteReq()) : (this.qqLogin())
        }
    }

    wxLogin() {
        if (window.wx == null || this._SessionID != '') return;

        const nickName = cc.sys.localStorage.getItem("usernickname");
        if (nickName) {
            window.playname = nickName
            window.playimg = cc.sys.localStorage.getItem("usernickimg")
            GameGlobal.DataManager._MyNickName = nickName
            GameGlobal.DataManager._MyAvatarURL = window.playimg
            window.mainhall.updateMyInfo()
            return;
        }

        GameGlobal.UIManager.showMask(true);
        const width = wx.getSystemInfoSync().windowWidth;
        const height = wx.getSystemInfoSync().windowHeight;
        const wxButton = wx.createUserInfoButton({
            type: "text",
            text: "",
            style: {
                left: 0,
                top: 0,
                width: width,
                height: height,
                lineHeight: height,
                backgroundColor: "rgba(0, 0, 0, 0)",
                color: "rgba(0, 0, 0, 0)",
                textAlign: "center",
                fontSize: 16,
                borderRadius: 4
            }
        });

        window.wxbutton = wxButton
        wxButton.onTap(() => {
            wxButton.hide()
            GameGlobal.UIManager.showMask(false);
            wx.login({
                success: (rsp) => {
                    var t = [];
                    t.push(rsp.code)
                    window.userid = rsp.code
                    window.loginkeylist = t
                    wx.getUserInfo({
                        openIdList: window.loginkeylist,
                        success: (e) => {
                            const info = e.userInfo;
                            window.wxbutton.hide();
                            window.islogin = true
                            window.playname = info.nickName
                            window.playimg = info.avatarUrl
                            cc.sys.localStorage.setItem("usernickname", info.nickName)
                            cc.sys.localStorage.setItem("usernickuserid", window.userid)
                            cc.sys.localStorage.setItem("usernickimg", window.playimg)
                            GameGlobal.DataManager._MyNickName = window.playname
                            GameGlobal.DataManager._MyAvatarURL = window.playimg
                            window.mainhall.updateMyInfo()
                        },
                        fail: () => {
                            window.wxbutton.hide()
                            window.playname = "游客"
                            window.islogin = true
                        }
                    })
                },
                fail: () => {
                    window.playname = "游客";
                    window.islogin = true;
                }
            })
            cc.sys.localStorage.setItem("usernickuserid", window.userid)
        })
    }

    qqLogin() {
        BK.QQ.fetchOpenKey((t, i, n) => {
            if (0 == t) {
                var r = n.openKey;
                GameGlobal.Net.request("entry/wxapp/login", { m: GameGlobal.Net.COMMON_M }, {
                    openkey: r,
                    openid: GameStatusInfo.openId
                }, (t) => {
                    t && (GameGlobal.localStorage.setItem("s3id", t.session3rd),
                        this._SessionID = t.session3rd,
                        GameGlobal.Net.requestZSShare(),
                        GameGlobal.Net.requestUserInfo(),
                        GameGlobal.Net.requestSign(this._SessionID),
                        this.checkQQIsInviteReq())
                })
            }
        })
    }

    wxLoginForShare(e) {
        if (window.wx == null) return

        wx.login({
            success: (i) => {
                wx.getUserInfo({
                    withCredentials: true,
                    success: (r) => {
                        GameGlobal.Net.request("entry/wxapp/login", {
                            m: GameGlobal.Net.COMMON_M
                        }, {
                            code: i.code,
                            encryptedData: r.encryptedData,
                            iv: r.iv
                        }, (i) => {
                            var r = i.userInfo.openId;
                            wx.setStorageSync("openid", r)
                            wx.setStorageSync("s3id", i.session3rd)
                            this._WXOpenID = r
                            this._SessionID = i.session3rd;
                            var a = GameGlobal.DataManager;
                            a._MyAvatarURL = i.userInfo.avatarUrl
                            a._MyNickName = i.userInfo.nickName
                            a._Province = i.userInfo.province
                            e && e()
                            wx.setStorage({
                                key: "wxData",
                                data: {
                                    nick: a._MyNickName,
                                    avaUrl: a._MyAvatarURL
                                }
                            })
                            GameGlobal.UIManager.getUI(UIType.UIType_Hall).updateMyInfo()
                            GameGlobal.Net.requestUserInfo()
                        })
                    },
                    fail: () => {
                        wx.showToast({
                            title: "获取信息失败",
                            icon: "none",
                            duration: 1500
                        })
                    }
                })
            },
            fail: () => {
                wx.showToast({
                    title: "登陆失败",
                    icon: "none",
                    duration: 1500
                })
            }
        })
    }

    onWXShare() {
        if (window.wx == null || this._WXOpenID == null) return;
        const param = "srcOpenID=" + this._WXOpenID;
        const mgr = GameGlobal.DataManager;
        wx.onShareAppMessage( () =>{
            return {
                title: mgr.getShareTitle(),
                imageUrl: mgr.getShareImage(),
                query: param
            }
        })
    }

    checkInviteAndRequest(e) {
        e && e.srcOpenID && GameGlobal.Net.requestInviteCome(e.srcOpenID)
    }

    checkQQIsInviteReq() {
        if (cc.sys.platform === cc.sys.QQ_PLAY && GameStatusInfo.gameParam && GameStatusInfo.gameParam.length > 0) {
            var e = GameStatusInfo.gameParam.split("=");
            if (e && e.length >= 2) {
                var t = e[1];
                t && GameGlobal.Net.requestInviteCome(t)
            }
        }
    }

    onWeiXinShow(e) {
        var t = GameGlobal.WeiXinPlatform;
        e.query && t.checkInviteAndRequest(e.query)
    }

    showShare(e, t) {
        cc.sys.platform === cc.sys.WECHAT_GAME && wx.shareAppMessage({
            title: "",
            imageUrl: "",
            desc: "1010快消是一款简单而有挑战的益智类小游戏，玩法简单易学！",
            link: "http://baidu.com",
            path: "/pages/index",
            type: "link",
            query: "",
            success: function (e) { },
            fail: function (e) {
            },
            complete: function () {
            }
        })
    }

    postScoreToPlatform(e, t) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            if (window.wx == null) return;
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
            BK.QQ.uploadScoreWithoutRoom(1, i, function (e, t, i) {
                0 === e || BK.Script.log(1, 1, "上传分数失败!错误码：" + e)
            })
        }
    }
}
