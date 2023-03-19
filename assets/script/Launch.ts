import SoundManager from "./audio/SoundManager";
import App from "./logic/App";
import Game from "./logic/Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Launch extends cc.Component {
    protected onLoad (): void  {
        App.inst;
        Game.inst;
        SoundManager.inst;
    }

    protected start(): void {
        cc.game.setFrameRate(60)
    }
}
