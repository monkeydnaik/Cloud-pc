1.  **Project Setup**: Initialize a basic React + React Three Fiber (R3F) application using Vite, which has already been started.
2.  **Player Controller**: Implement a basic character controller utilizing `@react-three/rapier` for physics and `@react-three/drei` for keyboard input, allowing movement (WASD) and jumping.
3.  **Environment Generation**: Add a floating island terrain using simple generated geometry to represent the "shattered world" of Oakhaven.
4.  **Grapple/Glider Mechanics**:
    *   Implement a state machine for the player (grounded, falling, gliding).
    *   Add a glider mechanic that slows descent and allows limited directional control in the air.
5.  **Aether Crystals (Collectibles)**: Scatter simple glowing cubes around the environment that the player can collect to represent "Aether".
6.  **UI Overlay**: Add a simple HUD to display collected Aether crystals.
7.  **Testing and Refinement**: Verify the gameplay loop, adjusting physics, speed, and jump height for better game feel.
8.  **Pre-commit steps**: Run pre-commit instructions to ensure everything is verified.
9.  **Submit**: Commit the finalized prototype to the repository.
