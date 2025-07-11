# Owunji Taxi - Game Specification

## Game Overview

Owunji Taxi is a modern web-based Space Taxi clone built with Phaser 3, TypeScript, and Firebase. Players control a futuristic taxi that must pick up passengers and deliver them to their destinations while managing fuel, avoiding crashes, and maintaining their bank balance.

## Technical Stack

-   **Game Engine**: Phaser 3.90.0
-   **Language**: TypeScript 5.7.2
-   **Build Tool**: Vite 6.3.1
-   **Physics**: Phaser Arcade Physics
-   **Backend**: Firebase just to host the game
-   **Deployment**: Web-based (HTML5)

## Visual Design

### Color Scheme

### Art Style

-   **Minimalist**: Clean geometric shapes
-   **Retro-Futuristic**: Inspired by classic arcade games
-   **Pixel-Perfect**: Sharp, crisp rendering
-   **Particle Effects**: Thruster flames, explosion particles

### Game Elements

-   **Taxi**: Procedurally generated ship with thruster animations and directional thrusters
-   **Buildings**: Procedurally generated skyscrapers with random heights, colors, and positions. Buildings act as game obstacles and will cause the player to crash if impacted. Buildings can be 1-2 or many, situated next to each other with only the surface of each building reachable. Buildings should be roughly 10% - 60% the height of the screen.
-   **Landing Platforms**: Generated geometric shapes extending from building sides. These platforms can contain:
    -   Passengers waiting for pickup
    -   Nothing (empty platform)
    -   Decorative objects (balcony chairs, tables, umbrellas, etc.)
-   **Passengers**: Procedurally generated stick figures that wave their hand and jump up and down. They start to flash red and jump more after they are not picked up in time
-   **Fuel**: Generated fuel containers with geometric shapes that spawn on random platforms
-   **UI**: All text and interface elements generated at runtime

## Game Mechanics

### Taxi Physics (Arcade Physics)

-   **Gravity**: Constant downward force (configurable)
-   **Thrust**: Upward and directional force when keys pressed
-   **Alignment Of Taxi**: The Taxi can move laterally and up and down but doesn't rotate with any movement
-   **Drag**: Air resistance affecting movement
-   **Bounce**: Elastic collisions with platforms
-   **Velocity Limits**: Maximum speed caps for control

### Fuel System

-   **Starting Fuel**: 100 units
-   **Consumption**: 1 unit per second of thrust
-   **Refuel Stations**: Special platforms that restore fuel
-   **Emergency Fuel**: Limited reserve for critical situations
-   **Fuel Efficiency**: Skill-based fuel management

### Banking System

-   **Score as Money**: All scoring is represented as dollars ($$) in a bank account
-   **Crash Penalties**: Crashes subtract money from the bank with audio feedback
-   **Continue on Funds**: Player can continue playing as long as they have funds available
-   **Passenger Rewards**: Successfully delivering passengers adds money to the bank

### Passenger System

-   **Spawn Points**: Random landing platforms on buildings
-   **Pickup Range**: Proximity-based passenger collection
-   **Destination Markers**: Visual indicators for drop-off points
-   **Passenger Types**: Different point values and requirements
-   **Time Limits**: Optional time pressure for deliveries

### Collision System

-   **Building Collisions**: Crash detection when hitting building walls
-   **Platform Collisions**: Safe landing vs. crash detection
-   **Boundary Collisions**: Screen edge handling
-   **Passenger Collisions**: Pickup and drop-off detection
-   **Obstacle Collisions**: Hazard avoidance

## Controls

### Primary Controls

-   **W/Up Arrow**: Main thruster (upward thrust)
-   **A/Left Arrow**: Left thruster (leftward + slight upward)
-   **D/Right Arrow**: Right thruster (rightward + slight upward)
-   **S/Down Arrow**: Downward thrust (limited)
-   **Space**: Emergency brake (rapid deceleration, high fuel cost)

### Game Controls

-   **R**: Restart game
-   **P**: Pause/Resume game
-   **M**: Toggle sound/music
-   **ESC**: Return to main menu
-   **Enter**: Confirm selections

## Game Objects

### Taxi Class

```typescript
interface Taxi {
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    fuel: number;
    maxFuel: number;
    passenger: Passenger | null;
    state: "flying" | "landed" | "crashed" | "refueling";
    thrusterParticles: ParticleEmitter;
}
```

### Passenger Class

```typescript
interface Passenger {
    id: string;
    position: { x: number; y: number };
    destination: LandingPlatform;
    status: "waiting" | "picked_up" | "delivered";
    pointValue: number;
    timeLimit?: number;
    type: "standard" | "vip" | "rush";
}
```

### Building Class

```typescript
interface Building {
    id: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    color: string;
    landingPlatforms: LandingPlatform[];
}
```

### Landing Platform Class

```typescript
interface LandingPlatform {
    id: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    type: "passenger" | "empty" | "decorative" | "fuel";
    content: Passenger | DecorativeObject | FuelContainer | null;
    isActive: boolean;
}
```

### Decorative Object Class

```typescript
interface DecorativeObject {
    id: string;
    type: "chair" | "table" | "umbrella" | "plant";
    geometry: {
        shape: "rectangle" | "circle" | "triangle";
        dimensions: { width: number; height: number };
        color: string;
    };
}
```

### Game State

```typescript
interface GameState {
    bankBalance: number;
    fuel: number;
    passengersDelivered: number;
    gameStatus: "playing" | "paused" | "game_over";
    currentPassenger: Passenger | null;
    buildings: Building[];
    activePassengers: Passenger[];
    totalScore: number;
}
```

## Camera & Visual Perspective

-   **Perspective**: 2D side-view (like classic Space Taxi)
-   **Camera**: Fixed position, no scrolling
-   **View**: Single screen viewport (1920x1080)
-   **Movement**: Taxi moves within the fixed camera view
-   **Buildings**: Appear as vertical rectangles from side view
-   **Platforms**: Extend horizontally from building sides

## Procedural Content Generation

### Overview

-   **All Game Objects**: Buildings, platforms, passengers, and decorative objects are procedurally generated
-   **No Pre-made Assets**: No static sprites or textures - everything is created at runtime
-   **Dynamic Generation**: Content is generated fresh for each game session
-   **Algorithm-based**: All visual elements use mathematical algorithms and geometric shapes

### Generated Elements

-   **Buildings**: Procedurally generated rectangles with random heights, colors, and positions
-   **Landing Platforms**: Generated as geometric shapes extending from building sides
-   **Passengers**: Simple stick figures created with basic shapes and animations
-   **Decorative Objects**: Geometric representations of chairs, tables, umbrellas, etc.
-   **UI Elements**: All text and interface elements are generated, not pre-rendered
-   **Particle Effects**: Thruster flames and explosions generated mathematically

### Generation Algorithms

-   **Building Generation**: Random height (10-60% screen), random color from palette, adjacent placement
-   **Platform Generation**: Random chance per building side, random size within constraints
-   **Content Distribution**: Random assignment of passengers, decorative objects, or empty spaces
-   **Color Schemes**: Generated from predefined color palettes

## Level Design

### Map Generation

-   **Single Screen**: 1920x1080 pixel play area
-   **Fixed Camera**: No scrolling - everything happens on one screen
-   **2D Side View**: Buildings appear as vertical structures
-   **Random Building Spawn**: 1-2 buildings or many buildings situated next to each other
-   **Building Heights**: 10% - 60% of screen height
-   **Landing Platform Generation**: Each building has a chance to spawn landing platforms
-   **Boundary Walls**: Solid screen edges
-   **No Traditional Levels**: Continuous gameplay with rolling score

### Building Layout

-   **Adjacent Placement**: Buildings spawn next to each other, not floating in space
-   **Surface Accessibility**: Only the surface/top of buildings are reachable
-   **Platform Distribution**: Landing platforms appear on building sides
-   **Content Variety**: Platforms can contain passengers, decorative objects, or nothing

### Platform Types

-   **Passenger Platforms**: Platforms with waiting passengers
-   **Empty Platforms**: Safe landing zones with no content
-   **Decorative Platforms**: Platforms with aesthetic objects (chairs, tables, umbrellas)
-   **Fuel Platforms**: Platforms with fuel containers

## Firebase Integration

-   Hosting the game

## UI/UX Design

### Main Menu

-   **Start Game**: Begin new game session
-   **Settings**: Audio, controls, display options
-   **Credits**: Game information

### In-Game UI

-   **Bank Display**: Top-left corner showing current balance ($$)
-   **Fuel Bar**: Top-right corner with warning indicators
-   **Passenger Info**: Current passenger destination and time
-   **Total Score**: Running total of all earnings
-   **Mini-map**: Real time minimap

### Game Over Screen

-   **Final Bank Balance**: Total money earned
-   **Passengers Delivered**: Total successful deliveries
-   **Fuel Remaining**: Bonus points for fuel conservation
-   **Restart Option**: Quick restart button

### Pause Menu

-   **Resume**: Continue current game
-   **Restart Game**: Reset current game
-   **Settings**: In-game options
-   **Main Menu**: Return to main menu

## Audio Design

### Sound Effects

-   **Thruster Sounds**: Different tones for each thruster
-   **Collision Sounds**: Landing, crash, pickup sounds
-   **Crash Penalty Sound**: Audio feedback when money is deducted
-   **UI Sounds**: Menu navigation, button clicks
-   **Ambient Sounds**: Space background effects
-   **Customer Sounds**: Taxi riders will make little squawks when requesting rides

### Music

We add later

## Performance Requirements

### Target Specifications

-   **Frame Rate**: >30. Keep it locked to no more than 70 if possible.
-   **Resolution**: 1920x1080
-   **Browser Support**: Chrome Edge aka Major browsers only matters

### Optimization

-   **Asset Loading**: Efficient sprite and audio loading
-   **Particle Systems**: Optimized thruster and explosion effects
-   **Collision Detection**: Efficient arcade physics calculations
-   **Memory Management**: Proper cleanup of game objects

## Development Phases

### Phase 1: Core Mechanics (Week 1-2)

-   Basic taxi physics and controls
-   Building collision system
-   Fuel management
-   Simple passenger pickup/delivery

### Phase 2: Game Systems (Week 3-4)

-   Building generation and layout
-   Banking system and UI
-   Sound effects and basic audio
-   Game state management

### Phase 3: Firebase Integration (Week 5-6)

-   High score system
-   User authentication
-   Real-time leaderboards
-   Data persistence

### Phase 4: Polish & Testing (Week 7-8)

-   Visual effects and particles
-   Audio polish and music
-   Performance optimization
-   Cross-browser testing

### Phase 5: Deployment (Week 9)

-   Production build optimization
-   Firebase deployment
-   Final testing and bug fixes
-   Launch preparation

## Success Metrics

### Technical Metrics

-   **Performance**: Consistent 60 FPS gameplay
-   **Load Time**: < 3 seconds initial load
-   **Uptime**: 99.9% availability
-   **Error Rate**: < 1% crash rate

### User Engagement

-   **Session Length**: Average 10+ minutes per session
-   **Retention**: 50% return rate within 7 days
-   **Bank Balance Growth**: Players consistently increase their balance
-   **Social Sharing**: 20% of players share scores

### Business Metrics

-   **Player Base**: 1000+ unique players in first month
-   **High Scores**: 100+ scores submitted daily
-   **User Feedback**: 4.5+ star rating
-   **Community Growth**: Active Discord/community engagement

## Future Enhancements

### Short Term (Post-Launch)

-   **Mobile Support**: Touch controls and responsive design
-   **Additional Building Types**: More complex building layouts and challenges
-   **Power-ups**: Extra fuel, speed boost, shield
-   **Achievement System**: Unlockable milestones

### Medium Term (3-6 months)

-   **Multiplayer Mode**: Real-time competitive play
-   **Custom Buildings**: Building editor for community content
-   **Seasonal Events**: Special challenges and rewards
-   **Progression System**: Unlockable taxi skins and upgrades

### Long Term (6+ months)

-   **VR Support**: Immersive virtual reality experience
-   **AI Opponents**: Computer-controlled taxi competitors
-   **Story Mode**: Narrative-driven campaign
-   **Cross-Platform**: Mobile app and desktop versions

## Risk Assessment

### Technical Risks

-   **Browser Compatibility**: Different browser physics implementations
-   **Performance Issues**: Complex particle systems and real-time updates
-   **Firebase Limits**: Rate limiting and data storage costs
-   **Mobile Performance**: Touch input and smaller screen challenges

### Mitigation Strategies

-   **Progressive Enhancement**: Core features work on all browsers
-   **Performance Monitoring**: Real-time FPS and memory tracking
-   **Firebase Optimization**: Efficient data structures and caching
-   **Responsive Design**: Adaptive UI for different screen sizes

## Conclusion

Owunji Taxi represents a modern take on the classic Space Taxi formula, leveraging the power of Phaser 3, TypeScript, and Firebase to create an engaging, scalable web-based game. The building-based gameplay with rolling score system and crash penalties creates a unique economic challenge that adds depth to the classic arcade experience.

The development plan prioritizes core gameplay mechanics while building toward a robust, feature-rich experience that can grow with the community. The Firebase integration provides a solid foundation for social features and data persistence, while the modular TypeScript architecture ensures maintainability and extensibility.
