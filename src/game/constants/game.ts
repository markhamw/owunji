export const GAME_CONFIG = {
    TITLE: "Owunji Taxi",
    VERSION: "1.0.0",
    WIDTH: 1920,
    HEIGHT: 1080,
    FPS: 60,
    MAX_FPS: 70,
} as const;

export const DEBUG = {
    ENABLED: true,
    PHYSICS_DEBUG: true,
    SHOW_FPS: true,
    SHOW_COLLISION_BOXES: true,
    SHOW_TAXI_INFO: true,
    SHOW_GAME_STATE: true,
    SHOW_PLATFORM_INFO: true,
    SHOW_PASSENGER_INFO: true,
    CONSOLE_LOGGING: true,
    VISUAL_DEBUG: true,
    PERFORMANCE_MONITOR: true,
};

export const BANKING = {
    STARTING_BALANCE: 1000,
    CRASH_PENALTIES: {
        MINOR: 50,
        MAJOR: 150,
        BUILDING: 200,
    },
    PASSENGER_REWARDS: {
        STANDARD: 100,
        VIP: 250,
        RUSH: 300,
    },
    FUEL_CONSERVATION_BONUS: 25,
} as const;

export const FUEL = {
    STARTING_AMOUNT: 100,
    CONSUMPTION_RATE: 1,
    REFUEL_AMOUNT: 50,
    WARNING_THRESHOLD: 30,
    CRITICAL_THRESHOLD: 10,
} as const;

export const PASSENGER = {
    TIME_LIMITS: {
        STANDARD: 60,
        VIP: 45,
        RUSH: 30,
    },
    SPAWN_RATE: {
        MIN: 15,
        MAX: 30,
    },
    DESPAWN_TIME: 90,
    PICKUP_RANGE: 50,
} as const;

export const BUILDING = {
    HEIGHT_RANGE: {
        MIN: 0.1,
        MAX: 0.6,
    },
    MAX_COUNT: 8,
    MIN_SPACING: 100,
    PLATFORM_SPAWN_CHANCE: 0.4,
    FUEL_SPAWN_CHANCE: 0.15,
} as const;
