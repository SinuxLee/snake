
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
            let t = getLang(lang) || {};
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
        const children = cc.director.getScene().children
        for (let i = 0; i < children.length; ++i) {
            const label = children[i].getComponentsInChildren("LocalizedLabel");
            label.node.active && label.updateLabel()
        }

        for (let s = 0; s < children.length; ++s) {
            const sprite = children[s].getComponentsInChildren("LocalizedSprite");
            sprite.node.active && sprite.updateSprite(window.i18n.curLang)
        }
    }
}