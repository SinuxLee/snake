
const polyglot = require('../lib/polyglot.min');
const noDef = null;

function getLang(e) {
    return window.i18n.languages[e]
}

function newPoly(e) {
    e && (noDef ? noDef.replace(e) : noDef = new polyglot({
        phrases: e,
        allowMissing: true
    }))
}
window.i18n || (window.i18n = {
    languages: {},
    curLang: ""
})

module.exports = {
    init: function (lang) {
        if (lang !== window.i18n.curLang) {
            var t = getLang(lang) || {};
            window.i18n.curLang = lang
            newPoly(t)
            this.inst = noDef
        }
    },

    t: function (e, t) {
        if (noDef) return noDef.t(e, t)
    },

    inst: noDef,

    updateSceneRenderers: function () {
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