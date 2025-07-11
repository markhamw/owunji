import { Scene } from "phaser";

export class UIScene extends Scene {
    private bankText: Phaser.GameObjects.Text;
    private fuelBar: Phaser.GameObjects.Graphics;
    private fuelText: Phaser.GameObjects.Text;
    private passengerInfoText: Phaser.GameObjects.Text;
    private gameTimeText: Phaser.GameObjects.Text;
    private crashCountText: Phaser.GameObjects.Text;

    private bankBalance: number = 1000;
    private fuelAmount: number = 100;
    private maxFuel: number = 100;
    private gameTime: number = 0;
    private crashCount: number = 0;
    private currentPassengerInfo: string = "";
    private gameScene: Scene | null = null;

    constructor() {
        super({ key: "UIScene", active: true });
    }

    create() {
        this.createUIElements();
        this.setupEventListeners();
    }

    private createUIElements(): void {
        // Bank display (top-left)
        this.bankText = this.add.text(50, 50, `$${this.bankBalance}`, {
            fontSize: "32px",
            color: "#ffd700",
            fontFamily: "Arial",
            stroke: "#000000",
            strokeThickness: 2,
        });

        // Fuel bar (top-right)
        this.fuelBar = this.add.graphics();
        this.updateFuelBar();

        // Fuel text
        this.fuelText = this.add.text(1600, 75, `Fuel: ${this.fuelAmount}`, {
            fontSize: "24px",
            color: "#ffffff",
            fontFamily: "Arial",
        });

        // Game time (top-center)
        this.gameTimeText = this.add.text(960, 50, "Time: 0s", {
            fontSize: "24px",
            color: "#ffffff",
            fontFamily: "Arial",
        });

        // Crash count (top-right, below fuel)
        this.crashCountText = this.add.text(1600, 120, "Crashes: 0", {
            fontSize: "24px",
            color: "#ffffff",
            fontFamily: "Arial",
        });

        // Passenger info (bottom-center)
        this.passengerInfoText = this.add.text(960, 1000, "", {
            fontSize: "24px",
            color: "#00d4ff",
            fontFamily: "Arial",
            align: "center",
        });
        this.passengerInfoText.setOrigin(0.5, 0);
    }

    private setupEventListeners(): void {
        try {
            this.gameScene = this.scene.get("Game");

            if (!this.gameScene) {
                console.error("❌ Game scene not found!");
                return;
            }

            // Listen for game state updates
            this.gameScene.events.on("updateBank", (balance: number) => {
                this.bankBalance = balance;
                this.updateBankDisplay();
            });

            this.gameScene.events.on("updateFuel", (fuel: number) => {
                this.fuelAmount = fuel;
                this.updateFuelDisplay();
            });

            this.gameScene.events.on("updateTime", (time: number) => {
                this.gameTime = time;
                this.updateTimeDisplay();
            });

            this.gameScene.events.on("crash", (crashCount: number) => {
                this.crashCount = crashCount;
                this.updateCrashDisplay();
            });

            this.gameScene.events.on("passengerInfo", (info: string) => {
                this.currentPassengerInfo = info;
                this.updatePassengerInfo();
            });
        } catch (error) {
            console.error("❌ Error setting up UI event listeners:", error);
        }
    }

    private updateBankDisplay(): void {
        if (this.bankText) {
            this.bankText.setText(`$${this.bankBalance}`);
        }
    }

    private updateFuelDisplay(): void {
        if (this.fuelText) {
            this.fuelText.setText(`Fuel: ${Math.round(this.fuelAmount)}`);

            // Color coding based on fuel level
            if (this.fuelAmount <= 10) {
                this.fuelText.setColor("#ff0000"); // Red for critical
            } else if (this.fuelAmount <= 30) {
                this.fuelText.setColor("#ffff00"); // Yellow for warning
            } else {
                this.fuelText.setColor("#ffffff"); // White for normal
            }
        }

        this.updateFuelBar();
    }

    private updateFuelBar(): void {
        if (!this.fuelBar) return;

        this.fuelBar.clear();

        const barWidth = 200;
        const barHeight = 20;
        const barX = 1650;
        const barY = 50;

        // Background
        this.fuelBar.fillStyle(0x333333);
        this.fuelBar.fillRect(barX, barY, barWidth, barHeight);

        // Fuel level
        const fuelPercent = this.fuelAmount / this.maxFuel;
        const fuelWidth = barWidth * fuelPercent;

        let fuelColor = 0x00ff00; // Green
        if (this.fuelAmount <= 10) {
            fuelColor = 0xff0000; // Red
        } else if (this.fuelAmount <= 30) {
            fuelColor = 0xffff00; // Yellow
        }

        this.fuelBar.fillStyle(fuelColor);
        this.fuelBar.fillRect(barX, barY, fuelWidth, barHeight);

        // Border
        this.fuelBar.lineStyle(2, 0xffffff);
        this.fuelBar.strokeRect(barX, barY, barWidth, barHeight);
    }

    private updateTimeDisplay(): void {
        if (this.gameTimeText) {
            this.gameTimeText.setText(`Time: ${Math.round(this.gameTime / 1000)}s`);
        }
    }

    private updateCrashDisplay(): void {
        if (this.crashCountText) {
            this.crashCountText.setText(`Crashes: ${this.crashCount}`);
        }
    }

    private updatePassengerInfo(): void {
        if (this.passengerInfoText) {
            this.passengerInfoText.setText(this.currentPassengerInfo);
        }
    }
}
