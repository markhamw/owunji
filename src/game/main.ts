import { Boot } from "./scenes/Boot";
import { GameOver } from "./scenes/GameOver";
import { Game as MainGame } from "./scenes/Game";
import { MainMenu } from "./scenes/MainMenu";
import { UIScene } from "./scenes/UIScene";
import { AUTO, Game } from "phaser";
import { Preloader } from "./scenes/Preloader";

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1920,
    height: 1080,
    parent: "game-container",
    backgroundColor: 0x0a0a0a,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { x: 0, y: 0 }, // Gravity handled per object
        },
    },
    scene: [Preloader, MainMenu, MainGame, UIScene, GameOver],
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;
