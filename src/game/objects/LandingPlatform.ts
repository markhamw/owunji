import { Scene } from "phaser";
import { COLORS } from "../constants";
import { Passenger } from "./Passenger";

export interface DecorativeObject {
    id: string;
    type: "chair" | "table" | "umbrella" | "plant";
    geometry: {
        shape: "rectangle" | "circle" | "triangle";
        dimensions: { width: number; height: number };
        color: string;
    };
}

export interface FuelContainer {
    id: string;
    fuelAmount: number;
    isCollected: boolean;
}

export class LandingPlatform extends Phaser.Physics.Arcade.Sprite {
    public id: string;
    public type: "passenger" | "empty" | "decorative" | "fuel";
    public content: Passenger | DecorativeObject | FuelContainer | null;
    public isActive: boolean;
    public platformSide: "left" | "right" | "top";
    private contentSprite: Phaser.GameObjects.Sprite | null;

    constructor(scene: Scene, x: number, y: number, width: number, height: number, side: "left" | "right" | "top") {
        super(scene, x, y, "");

        this.id = `platform_${Date.now()}_${Math.random()}`;
        this.type = "empty";
        this.content = null;
        this.isActive = true;
        this.platformSide = side;
        this.contentSprite = null;

        // Create visual representation
        this.createPlatformVisual(width, height);

        // Add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this, true); // Static body

        // Set body size
        (this.body as Phaser.Physics.Arcade.StaticBody).setSize(width, height);
    }

    private createPlatformVisual(width: number, height: number): void {
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(COLORS.UI.PRIMARY);
        graphics.fillRect(-width / 2, -height / 2, width, height);

        // Add platform edge details
        graphics.fillStyle(COLORS.UI.ACCENT);
        graphics.fillRect(-width / 2, -height / 2, width, 2);

        // Convert to texture
        graphics.generateTexture("platform", width, height);
        graphics.destroy();

        this.setTexture("platform");
    }

    public setContent(type: "passenger" | "decorative" | "fuel", content?: any): void {
        this.type = type;

        // Remove existing content
        if (this.contentSprite) {
            this.contentSprite.destroy();
            this.contentSprite = null;
        }

        switch (type) {
            case "passenger":
                this.content = content as Passenger;
                break;
            case "decorative":
                this.content = this.createDecorativeObject();
                this.createDecorativeVisual();
                break;
            case "fuel":
                this.content = this.createFuelContainer();
                this.createFuelVisual();
                break;
        }
    }

    private createDecorativeObject(): DecorativeObject {
        const types: DecorativeObject["type"][] = ["chair", "table", "umbrella", "plant"];
        const shapes: DecorativeObject["geometry"]["shape"][] = ["rectangle", "circle", "triangle"];
        const colors = ["#ff6600", "#00ff88", "#b026ff", "#ffd700"];

        return {
            id: `deco_${Date.now()}_${Math.random()}`,
            type: types[Math.floor(Math.random() * types.length)],
            geometry: {
                shape: shapes[Math.floor(Math.random() * shapes.length)],
                dimensions: { width: 10 + Math.random() * 10, height: 10 + Math.random() * 10 },
                color: colors[Math.floor(Math.random() * colors.length)],
            },
        };
    }

    private createDecorativeVisual(): void {
        if (!this.content || this.type !== "decorative") return;

        const deco = this.content as DecorativeObject;
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(deco.geometry.color);

        const { width, height } = deco.geometry.dimensions;

        switch (deco.geometry.shape) {
            case "rectangle":
                graphics.fillRect(-width / 2, -height / 2, width, height);
                break;
            case "circle":
                graphics.fillCircle(0, 0, Math.min(width, height) / 2);
                break;
            case "triangle":
                graphics.fillTriangle(0, -height / 2, -width / 2, height / 2, width / 2, height / 2);
                break;
        }

        graphics.generateTexture("decorative", width, height);
        graphics.destroy();

        this.contentSprite = this.scene.add.sprite(this.x, this.y - 15, "decorative");
    }

    private createFuelContainer(): FuelContainer {
        return {
            id: `fuel_${Date.now()}_${Math.random()}`,
            fuelAmount: 50,
            isCollected: false,
        };
    }

    private createFuelVisual(): void {
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(COLORS.FUEL.NORMAL);
        graphics.fillRect(-8, -12, 16, 24);

        // Add fuel indicator
        graphics.fillStyle(COLORS.UI.ACCENT);
        graphics.fillRect(-6, -10, 12, 2);
        graphics.fillRect(-6, -6, 12, 2);
        graphics.fillRect(-6, -2, 12, 2);

        graphics.generateTexture("fuel", 16, 24);
        graphics.destroy();

        this.contentSprite = this.scene.add.sprite(this.x, this.y - 15, "fuel");
    }

    public collectFuel(): number {
        if (this.type === "fuel" && this.content) {
            const fuel = this.content as FuelContainer;
            if (!fuel.isCollected) {
                fuel.isCollected = true;
                if (this.contentSprite) {
                    this.contentSprite.destroy();
                    this.contentSprite = null;
                }
                this.type = "empty";
                this.content = null;
                return fuel.fuelAmount;
            }
        }
        return 0;
    }

    public removeDecorative(): void {
        if (this.type === "decorative") {
            if (this.contentSprite) {
                this.contentSprite.destroy();
                this.contentSprite = null;
            }
            this.type = "empty";
            this.content = null;
        }
    }

    public isEmpty(): boolean {
        return this.type === "empty";
    }

    public destroy(): void {
        if (this.contentSprite) {
            this.contentSprite.destroy();
        }
        super.destroy();
    }
}
