import { Scene } from "phaser";
import { COLORS, PASSENGER } from "../constants";
import { LandingPlatform } from "./LandingPlatform";

export class Passenger extends Phaser.GameObjects.Sprite {
    public id: string;
    public destination: LandingPlatform | null;
    public status: "waiting" | "picked_up" | "delivered";
    public pointValue: number;
    public timeLimit: number;
    public timeRemaining: number;
    public type: "standard" | "vip" | "rush";
    public spawnTime: number;
    public urgencyLevel: number;
    private animationTimer: number;
    private waveTimer: number;

    constructor(scene: Scene, x: number, y: number, type: "standard" | "vip" | "rush" = "standard") {
        super(scene, x, y, "");

        this.id = `passenger_${Date.now()}_${Math.random()}`;
        this.destination = null;
        this.status = "waiting";
        this.type = type;
        this.spawnTime = scene.time.now;
        this.urgencyLevel = 0;
        this.animationTimer = 0;
        this.waveTimer = 0;

        // Set properties based on type
        this.setupPassengerType();

        // Create visual representation
        this.createPassengerVisual();

        // Add to scene
        scene.add.existing(this);

        // Start animation
        this.startAnimation();
    }

    private setupPassengerType(): void {
        switch (this.type) {
            case "standard":
                this.pointValue = 100;
                this.timeLimit = PASSENGER.TIME_LIMITS.STANDARD;
                break;
            case "vip":
                this.pointValue = 250;
                this.timeLimit = PASSENGER.TIME_LIMITS.VIP;
                break;
            case "rush":
                this.pointValue = 300;
                this.timeLimit = PASSENGER.TIME_LIMITS.RUSH;
                break;
        }
        this.timeRemaining = this.timeLimit;
    }

    private createPassengerVisual(): void {
        // Create a simple stick figure
        const graphics = this.scene.add.graphics();

        // Choose color based on type
        let color = COLORS.PASSENGER.NORMAL;
        if (this.type === "vip") color = COLORS.PASSENGER.VIP;

        graphics.fillStyle(color);

        // Head
        graphics.fillCircle(0, -8, 3);

        // Body
        graphics.fillRect(-1, -5, 2, 10);

        // Arms
        graphics.fillRect(-4, -3, 3, 1);
        graphics.fillRect(1, -3, 3, 1);

        // Legs
        graphics.fillRect(-2, 5, 1, 5);
        graphics.fillRect(1, 5, 1, 5);

        // Convert to texture
        graphics.generateTexture("passenger", 10, 20);
        graphics.destroy();

        this.setTexture("passenger");
    }

    private startAnimation(): void {
        // Create jumping and waving animation
        this.scene.tweens.add({
            targets: this,
            y: this.y - 5,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
        });

        // Hand waving animation (scale change to simulate waving)
        this.scene.tweens.add({
            targets: this,
            scaleX: 1.1,
            duration: 300,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
        });
    }

    public update(): void {
        if (this.status !== "waiting") return;

        // Update time remaining
        this.timeRemaining -= 1 / 60; // Assuming 60 FPS

        // Update urgency level
        const timePercentage = this.timeRemaining / this.timeLimit;
        if (timePercentage < 0.3) {
            this.urgencyLevel = 3;
            this.tint = COLORS.PASSENGER.URGENT;
            this.setScale(1.2); // Make them bigger when urgent
        } else if (timePercentage < 0.6) {
            this.urgencyLevel = 2;
            this.tint = 0xffaa00; // Orange
        } else {
            this.urgencyLevel = 1;
        }

        // Check if passenger should despawn
        if (this.timeRemaining <= 0) {
            this.despawn();
        }
    }

    public pickup(): void {
        this.status = "picked_up";
        this.setVisible(false);

        // Stop animations
        this.scene.tweens.killTweensOf(this);
    }

    public deliver(): void {
        this.status = "delivered";

        // Create delivery particle effect
        const deliveryParticles = this.scene.add.particles(this.x, this.y, "passenger", {
            scale: { start: 0.5, end: 0 },
            speed: { min: 50, max: 100 },
            lifespan: 300,
            tint: [0x00ff00, 0x00ffff, 0xffff00],
            quantity: 10,
        });

        this.scene.time.delayedCall(500, () => {
            deliveryParticles.destroy();
        });
    }

    private despawn(): void {
        this.status = "delivered"; // Mark as delivered to prevent further updates

        // Create despawn particle effect
        const despawnParticles = this.scene.add.particles(this.x, this.y, "passenger", {
            scale: { start: 0.3, end: 0 },
            speed: { min: 30, max: 60 },
            lifespan: 200,
            tint: [0xff0000, 0x888888],
            quantity: 5,
        });

        this.scene.time.delayedCall(300, () => {
            despawnParticles.destroy();
            this.destroy();
        });
    }

    public getUrgencyColor(): number {
        switch (this.urgencyLevel) {
            case 3:
                return COLORS.PASSENGER.URGENT;
            case 2:
                return 0xffaa00;
            default:
                return COLORS.PASSENGER.NORMAL;
        }
    }

    public destroy(): void {
        this.scene.tweens.killTweensOf(this);
        super.destroy();
    }
}
