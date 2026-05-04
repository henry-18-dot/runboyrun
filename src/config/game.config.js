export const GAME_CONFIG = {
  canvas: {
    logicalHeight: 180
  },
  camera: {
    followSmoothing: 3.8
  },
  world: {
    segmentWidth: 320,
    keepBehindSegments: 2,
    keepAheadSegments: 5
  },
  scene: {
    defaultDurationSeconds: 600
  },
  pause: {
    drawerTimeScale: 0.08,
    activeTimeScale: 1,
    smoothing: 9
  },
  speeds: {
    slow: { default: 58 },
    normal: { default: 118 },
    fast: { default: 218 }
  },
  fastRun: {
    defaultDurationSeconds: 16,
    excitedSeconds: 0.7,
    fatigueSlowSeconds: 3.2,
    cooldownSeconds: 5.5
  },
  rider: {
    screenAnchor: 0.33,
    fastScreenAnchor: 0.28,
    saluteSeconds: 1.15,
    longStopBoredSeconds: 7,
    leftWalkLimit: 150,
    leftWalkSpeed: -42
  }
};
