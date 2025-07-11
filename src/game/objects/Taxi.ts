import { Scene } from "phaser";
import { PHYSICS, FUEL, COLORS } from "../constants";
import { Passenger } from "./Passenger";

export class Taxi extends Phaser.Physics.Arcade.Sprite {
    public fuel: number;
    public maxFuel: number;
    public passenger: Passenger | null;
    public state: "flying" | "landed" | "crashed" | "refueling";
    public crashCount: number;
    public lastCrashTime: number;
    private thrusterParticles: Phaser.GameObjects.Particles.ParticleEmitter | null;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private wasdKeys: any;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, "");

        // Initialize properties
        this.fuel = FUEL.STARTING_AMOUNT;
        this.maxFuel = FUEL.STARTING_AMOUNT;
        this.passenger = null;
        this.state = "flying";
        this.crashCount = 0;
        this.lastCrashTime = 0;
        this.thrusterParticles = null;

        // Create visual representation (procedural)
        this.createTaxiVisual();

        // Add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Configure physics
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setGravityY(PHYSICS.GRAVITY);
        body.setMaxVelocity(PHYSICS.MAX_VELOCITY);
        body.setDrag(PHYSICS.DRAG);
        body.setBounce(PHYSICS.BOUNCE);
        body.setCollideWorldBounds(true);

        // Setup input
        this.cursors = scene.input.keyboard!.createCursorKeys();
        this.wasdKeys = scene.input.keyboard!.addKeys("W,S,A,D,SPACE");

        // Create particle system for thrusters
        this.createThrusterParticles();
    }

    private createTaxiVisual(): void {
        // Create a simple geometric taxi shape
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(COLORS.UI.PRIMARY);
        graphics.fillRect(-15, -10, 30, 20);
        graphics.fillStyle(COLORS.UI.ACCENT);
        graphics.fillRect(-10, -5, 20, 10);

        // Convert to texture
        graphics.generateTexture("taxi", 30, 20);
        graphics.destroy();

        this.setTexture("taxi");
    }

    private createThrusterParticles(): void {
        // Create particle emitter for thruster effects
        this.thrusterParticles = this.scene.add.particles(0, 0, "taxi", {
            scale: { start: 0.1, end: 0 },
            speed: { min: 50, max: 100 },
            lifespan: 200,
            tint: [0xff6600, 0xff0000, 0xffff00],
            emitting: false,
        });

        this.thrusterParticles.startFollow(this);
    }

    public update(): void {
        this.handleInput();
        this.updateFuel();
        this.updateState();
    }

    private handleInput(): void {
        const isThrusting = this.cursors.up.isDown || this.wasdKeys.W.isDown;
        const isLeftThrust = this.cursors.left.isDown || this.wasdKeys.A.isDown;
        const isRightThrust = this.cursors.right.isDown || this.wasdKeys.D.isDown;
        const isDownThrust = this.cursors.down.isDown || this.wasdKeys.S.isDown;
        const isEmergencyBrake = this.wasdKeys.SPACE.isDown;

        if (this.fuel <= 0) return;

        if (isThrusting) {
            this.body!.setAccelerationY(-PHYSICS.THRUST_POWER);
            this.consumeFuel();
            this.thrusterParticles?.setEmitting(true);
        } else {
            this.body!.setAccelerationY(0);
            this.thrusterParticles?.setEmitting(false);
        }

        if (isLeftThrust) {
            this.body!.setAccelerationX(-PHYSICS.LATERAL_THRUST_POWER);
            this.body!.setAccelerationY(this.body!.acceleration.y - PHYSICS.LATERAL_THRUST_POWER * 0.2);
            this.consumeFuel();
        } else if (isRightThrust) {
            this.body!.setAccelerationX(PHYSICS.LATERAL_THRUST_POWER);
            this.body!.setAccelerationY(this.body!.acceleration.y - PHYSICS.LATERAL_THRUST_POWER * 0.2);
            this.consumeFuel();
        } else {
            this.body!.setAccelerationX(0);
        }

        if (isDownThrust) {
            this.body!.setAccelerationY(PHYSICS.DOWNWARD_THRUST_POWER);
            this.consumeFuel();
        }

        if (isEmergencyBrake) {
            this.body!.setVelocity(
                this.body!.velocity.x * PHYSICS.EMERGENCY_BRAKE_POWER,
                this.body!.velocity.y * PHYSICS.EMERGENCY_BRAKE_POWER
            );
            this.consumeFuel(3); // Higher fuel cost for emergency brake
        }
    }

    private consumeFuel(amount: number = FUEL.CONSUMPTION_RATE): void {
        this.fuel = Math.max(0, this.fuel - amount);
    }

    private updateFuel(): void {
        // Fuel warnings handled by UI scene
    }

    private updateState(): void {
        if (this.fuel <= 0 && this.state !== "crashed") {
            this.state = "crashed";
        }
    }

    public refuel(amount: number = FUEL.REFUEL_AMOUNT): void {
        this.fuel = Math.min(this.maxFuel, this.fuel + amount);
        this.state = "refueling";
    }

    public crash(): void {
        this.state = "crashed";
        this.crashCount++;
        this.lastCrashTime = this.scene.time.now;

        // Create crash particle effect
        const crashParticles = this.scene.add.particles(this.x, this.y, "taxi", {
            scale: { start: 0.3, end: 0 },
            speed: { min: 100, max: 200 },
            lifespan: 500,
            tint: [0xff0000, 0xff6600, 0xffff00],
            quantity: 20,
        });

        this.scene.time.delayedCall(1000, () => {
            crashParticles.destroy();
            this.state = "flying";
        });
    }

    public pickupPassenger(passenger: Passenger): void {
        this.passenger = passenger;
        passenger.status = "picked_up";
    }

    public dropoffPassenger(): Passenger | null {
        if (this.passenger) {
            const passenger = this.passenger;
            this.passenger = null;
            passenger.status = "delivered";
            return passenger;
        }
        return null;
    }

    public getFuelPercentage(): number {
        return (this.fuel / this.maxFuel) * 100;
    }

    public destroy(): void {
        if (this.thrusterParticles) {
            this.thrusterParticles.destroy();
        }
        super.destroy();
    }
}
