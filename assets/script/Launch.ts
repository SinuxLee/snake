import App from "./App";
import Game from "./Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    protected onLoad (): void  {
        App.inst;
        Game.inst;
    }

    protected start(): void {
        cc.game.setFrameRate(60)
    }
}
