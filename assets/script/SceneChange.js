cc.Class({
    extends: cc.Component,
    properties: {
        jindu: cc.Label
    },

    start: function () {
        var e = "SCS";
        cc.director.preloadScene(e, this.onProgress, function (t) {
            t ? console.log(" preloadScene er:" + t) : cc.director.loadScene(e)
        })
    },

    onProgress: function (e, t, i) {
        this.jindu.string = "进度:" + parseInt(e / t * 100) + "%"
    }
})