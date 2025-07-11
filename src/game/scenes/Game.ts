import { Scene } from "phaser";

export class Game extends Scene {
    private buildings: Phaser.GameObjects.Group;
    private platforms: Phaser.GameObjects.Group;
    private passengers: Phaser.GameObjects.Group;
    private taxi: Phaser.Physics.Arcade.Sprite;
    private gameState: {
        bankBalance: number;
        fuel: number;
        passengersDelivered: number;
        gameStatus: "playing" | "paused" | "game_over";
        crashCount: number;
        gameTime: number;
    };
    private uiScene: Scene;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private wasdKeys: any;
    private lastFuelUpdate: number = 0;

    constructor() {
        super("Game");
    }

    create() {
        // Set camera background
        this.cameras.main.setBackgroundColor(0x0a0a0a);

        // Initialize game state
        this.gameState = {
            bankBalance: 1000,
            fuel: 100,
            passengersDelivered: 0,
            gameStatus: "playing",
            crashCount: 0,
            gameTime: 0,
        };

        // Create groups for game objects
        this.buildings = this.add.group();
        this.platforms = this.add.group();
        this.passengers = this.add.group();

        // Get reference to UI scene (started simultaneously from MainMenu)
        this.uiScene = this.scene.get("UIScene");

        // Generate initial level
        this.generateLevel();

        // Create taxi
        this.createTaxi();

        // Setup input
        this.setupInput();

        // Setup collisions
        this.setupCollisions();

        // Setup game timers
        this.setupTimers();
    }

    private generateLevel(): void {
        // Generate buildings
        const buildingCount = Math.floor(Math.random() * 3) + 1; // 1-3 buildings
        let lastX = 100;

        for (let i = 0; i < buildingCount; i++) {
            const buildingWidth = 80 + Math.random() * 120;
            const buildingHeight = 200 + Math.random() * 400;
            const buildingX = lastX + buildingWidth / 2;
            const buildingY = 1080 - buildingHeight / 2;

            // Create building
            const building = this.add.rectangle(buildingX, buildingY, buildingWidth, buildingHeight, 0x00d4ff);
            this.buildings.add(building);

            // Add physics to building
            this.physics.add.existing(building, true);

            // Generate platforms on building sides
            if (Math.random() < 0.4) {
                const platformWidth = 60 + Math.random() * 40;
                const platformHeight = 20;
                const platformX = buildingX + buildingWidth / 2 + platformWidth / 2;
                const platformY = buildingY - buildingHeight / 2 + 100 + Math.random() * (buildingHeight - 200);

                const platform = this.add.rectangle(platformX, platformY, platformWidth, platformHeight, 0x00ff88);
                this.platforms.add(platform);
                this.physics.add.existing(platform, true);
            }

            if (Math.random() < 0.4) {
                const platformWidth = 60 + Math.random() * 40;
                const platformHeight = 20;
                const platformX = buildingX - buildingWidth / 2 - platformWidth / 2;
                const platformY = buildingY - buildingHeight / 2 + 100 + Math.random() * (buildingHeight - 200);

                const platform = this.add.rectangle(platformX, platformY, platformWidth, platformHeight, 0x00ff88);
                this.platforms.add(platform);
                this.physics.add.existing(platform, true);
            }

            lastX = buildingX + buildingWidth / 2 + 50;
        }

        // Spawn initial passengers
        this.spawnPassengers();
    }

    private createTaxi(): void {
        // Create simple taxi sprite
        const graphics = this.add.graphics();
        graphics.fillStyle(0x00d4ff);
        graphics.fillRect(-15, -10, 30, 20);
        graphics.fillStyle(0xb026ff);
        graphics.fillRect(-10, -5, 20, 10);
        graphics.generateTexture("taxi", 30, 20);
        graphics.destroy();

        // Create taxi physics sprite
        this.taxi = this.physics.add.sprite(200, 300, "taxi");
        this.taxi.setCollideWorldBounds(true);
        this.taxi.setBounce(0.3);

        const taxiBody = this.taxi.body as Phaser.Physics.Arcade.Body;
        taxiBody.setGravityY(300);
        taxiBody.setMaxVelocity(500);
        taxiBody.setDrag(0.98);
    }

    private setupInput(): void {
        // Create cursor keys for arrow key input
        this.cursors = this.input.keyboard!.createCursorKeys();

        // Create WASD keys with proper key codes
        this.wasdKeys = {
            W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            SPACE: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            R: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.R),
            P: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.P),
            M: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.M),
            ESC: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC),
        };
    }

    private setupCollisions(): void {
        // Taxi vs buildings
        this.physics.add.collider(this.taxi, this.buildings, this.handleCrash, undefined, this);

        // Taxi vs platforms (safe landing)
        this.physics.add.collider(this.taxi, this.platforms, this.handlePlatformLanding, undefined, this);

        // Taxi vs passengers (pickup)
        this.physics.add.overlap(this.taxi, this.passengers, this.handlePassengerPickup, undefined, this);
    }

    private setupTimers(): void {
        // Spawn new passengers periodically
        this.time.addEvent({
            delay: 20000, // 20 seconds
            callback: this.spawnPassengers,
            callbackScope: this,
            loop: true,
        });
    }

    private spawnPassengers(): void {
        // Spawn passengers on random platforms
        const platformArray = this.platforms.getChildren() as Phaser.GameObjects.Rectangle[];
        const availablePlatforms = platformArray.filter((platform) => {
            // Check if platform doesn't already have a passenger
            return !this.passengers
                .getChildren()
                .some((passenger) =>
                    Phaser.Geom.Rectangle.Overlaps(
                        platform.getBounds(),
                        (passenger as Phaser.GameObjects.Sprite).getBounds()
                    )
                );
        });

        if (availablePlatforms.length > 0) {
            const platform = availablePlatforms[Math.floor(Math.random() * availablePlatforms.length)];
            this.createPassenger(platform.x, platform.y - 20);
        }
    }

    private createPassenger(x: number, y: number): void {
        // Create simple passenger sprite
        const graphics = this.add.graphics();
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(0, -8, 3); // Head
        graphics.fillRect(-1, -5, 2, 10); // Body
        graphics.fillRect(-4, -3, 3, 1); // Left arm
        graphics.fillRect(1, -3, 3, 1); // Right arm
        graphics.fillRect(-2, 5, 1, 5); // Left leg
        graphics.fillRect(1, 5, 1, 5); // Right leg
        graphics.generateTexture("passenger", 10, 20);
        graphics.destroy();

        const passenger = this.add.sprite(x, y, "passenger");
        this.passengers.add(passenger);

        // Add jumping animation
        this.tweens.add({
            targets: passenger,
            y: y - 5,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
        });
    }

    private handleCrash(taxi: any, building: any): void {
        this.gameState.crashCount++;
        this.gameState.bankBalance = Math.max(0, this.gameState.bankBalance - 150);

        // Emit crash event to UI
        this.events.emit("crash", this.gameState.crashCount);
        this.events.emit("updateBank", this.gameState.bankBalance);

        // Screen shake effect
        this.cameras.main.shake(300, 0.02);

        // Check game over
        if (this.gameState.bankBalance <= 0) {
            this.gameState.gameStatus = "game_over";
            this.scene.start("GameOver");
        }
    }

    private handlePlatformLanding(taxi: any, platform: any): void {
        // Safe landing - no penalty
        // Optional: Add a small visual feedback for successful landing
        this.tweens.add({
            targets: platform,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 100,
            yoyo: true,
            ease: "Power2",
        });
    }

    private handlePassengerPickup(taxi: any, passenger: any): void {
        // Remove passenger and add money
        passenger.destroy();
        this.gameState.bankBalance += 100;
        this.gameState.passengersDelivered++;

        // Emit events to UI
        this.events.emit("updateBank", this.gameState.bankBalance);
        this.events.emit("updatePassenger", `Passenger delivered! +$100`);

        // Spawn new passenger after delay
        this.time.delayedCall(5000, this.spawnPassengers, [], this);
    }

    update(): void {
        if (this.gameState.gameStatus !== "playing") return;

        this.handleTaxiInput();
        this.updateGameState();
        this.updateUI();
    }

    private handleTaxiInput(): void {
        const isThrusting = this.cursors.up.isDown || this.wasdKeys.W.isDown;
        const isLeftThrust = this.cursors.left.isDown || this.wasdKeys.A.isDown;
        const isRightThrust = this.cursors.right.isDown || this.wasdKeys.D.isDown;
        const isDownThrust = this.cursors.down.isDown || this.wasdKeys.S.isDown;
        const isEmergencyBrake = this.wasdKeys.SPACE.isDown;

        const taxiBody = this.taxi.body as Phaser.Physics.Arcade.Body;
        const currentTime = this.time.now;

        // Ensure physics body is active
        if (!taxiBody.enable) {
            taxiBody.enable = true;
        }

        // Reset accelerations at the start of each frame
        taxiBody.setAcceleration(0, 0);

        // Always ensure gravity is applied
        taxiBody.setGravityY(300);

        // Handle movement controls (only if fuel available and not crashed)
        if (this.gameState.fuel > 0) {
            // Calculate fuel consumption (once per second)
            if (currentTime - this.lastFuelUpdate >= 1000) {
                // Only consume fuel if any thrust is active
                if (isThrusting || isLeftThrust || isRightThrust || isDownThrust) {
                    this.gameState.fuel = Math.max(0, this.gameState.fuel - 5); // 5 units per second
                    this.lastFuelUpdate = currentTime;
                }
            }

            if (isThrusting) {
                taxiBody.setAccelerationY(-400);
            }

            if (isLeftThrust) {
                taxiBody.setAccelerationX(-300);
            } else if (isRightThrust) {
                taxiBody.setAccelerationX(300);
            }

            if (isDownThrust) {
                taxiBody.setAccelerationY(200);
            }

            if (isEmergencyBrake) {
                // Apply strong brake force
                const newVelX = taxiBody.velocity.x * 0.5;
                const newVelY = taxiBody.velocity.y * 0.5;
                taxiBody.setVelocity(newVelX, newVelY);
                // Zero out any acceleration
                taxiBody.setAcceleration(0, 0);
                // Emergency brake uses more fuel
                if (currentTime - this.lastFuelUpdate >= 1000) {
                    this.gameState.fuel = Math.max(0, this.gameState.fuel - 10);
                    this.lastFuelUpdate = currentTime;
                }
            }
        }

        // Handle other controls (always available)
        if (Phaser.Input.Keyboard.JustDown(this.wasdKeys.R)) {
            this.scene.restart();
        }
        if (Phaser.Input.Keyboard.JustDown(this.wasdKeys.P)) {
            this.scene.pause();
        }
    }

    private updateGameState(): void {
        this.gameState.gameTime += 16; // Assuming 60 FPS

        // Check fuel depletion - but don't trigger game over
        // Player can continue as long as they have funds (spec requirement)
        if (this.gameState.fuel <= 0) {
            // Just prevent movement, don't crash or change state
        }

        // Update taxi physics state
        const taxiBody = this.taxi.body as Phaser.Physics.Arcade.Body;
        if (!taxiBody.enable) {
            taxiBody.enable = true;
            taxiBody.setGravityY(300);
        }
    }

    private updateUI(): void {
        this.events.emit("updateBank", this.gameState.bankBalance);
        this.events.emit("updateFuel", this.gameState.fuel, 100);
        this.events.emit("updatePassenger", `Delivered: ${this.gameState.passengersDelivered}`);
    }
}
