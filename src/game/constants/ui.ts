export const UI = {
    POSITIONS: {
        BANK_DISPLAY: { x: 50, y: 50 },
        FUEL_BAR: { x: 1650, y: 50 },
        FUEL_TEXT: { x: 1600, y: 75 },
        PASSENGER_INFO: { x: 960, y: 50 },
        MINIMAP: { x: 1720, y: 200 },
    },
    SIZES: {
        FUEL_BAR: { width: 200, height: 20 },
        MINIMAP: { width: 150, height: 150 },
    },
    FONTS: {
        MAIN: "Arial",
        SIZE: {
            LARGE: 32,
            MEDIUM: 24,
            SMALL: 16,
        },
    },
    STYLES: {
        BANK_DISPLAY: {
            fontSize: "32px",
            fontFamily: "Arial",
            color: "#ffd700",
            stroke: "#000000",
            strokeThickness: 2,
        },
        FUEL_BAR: {
            fontSize: "16px",
            fontFamily: "Arial",
            color: "#ffffff",
        },
        PASSENGER_INFO: {
            fontSize: "20px",
            fontFamily: "Arial",
            color: "#00d4ff",
        },
    },
} as const;
