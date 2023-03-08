
var n = require('polyglot.min'),
    r = null;

function a(e) {
    return window.i18n.languages[e]
}

function o(e) {
    e && (r ? r.replace(e) : r = new n({
        phrases: e,
        allowMissing: !0
    }))
}
window.i18n || (window.i18n = {
    languages: {},
    curLang: ""
})

module.exports = {
    init: function(e) {
        if (e !== window.i18n.curLang) {
            var t = a(e) || {};
            window.i18n.curLang = e, o(t), this.inst = r
        }
    },
    t: function(e, t) {
        if (r) return r.t(e, t)
    },
    inst: r,
    updateSceneRenderers: function() {
        for (var e = cc.director.getScene().children, t = [], i = 0; i < e.length; ++i) {
            var n = e[i].getComponentsInChildren("LocalizedLabel");
            Array.prototype.push.apply(t, n)
        }
        for (var r = 0; r < t.length; ++r) {
            var a = t[r];
            a.node.active && a.updateLabel()
        }
        for (var o = [], s = 0; s < e.length; ++s) {
            var c = e[s].getComponentsInChildren("LocalizedSprite");
            Array.prototype.push.apply(o, c)
        }
        for (var f = 0; f < o.length; ++f) {
            var h = o[f];
            h.node.active && h.updateSprite(window.i18n.curLang)
        }
    }
}