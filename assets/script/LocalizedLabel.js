const LanguageData = require('LanguageData');

cc.Class({
    extends: cc.Component,
    editor: {
        executeInEditMode: true,
        menu: "i18n/LocalizedLabel"
    },
    properties: {
        dataID: {
            get: function () {
                return this._dataID
            },
            set: function (e) {
                this._dataID !== e && (this._dataID = e, this.updateLabel())
            }
        },
        _dataID: ""
    },

    onLoad: function () {
        LanguageData.inst || LanguageData.init(), this.fetchRender()
    },

    fetchRender: function () {
        var e = this.getComponent(cc.Label);
        if (e) return this.label = e, void this.updateLabel()
    },

    updateLabel: function () {
        this.label ? LanguageData.t(this.dataID) && (this.label.string = LanguageData.t(this.dataID)) : cc.error("Failed to update localized label, label component is invalid!")
    }
})