export const WEATHER_TYPES = ["clear", "cloudy", "wind", "rain"];
export const TIME_PRESETS = ["dawn", "noon", "dusk", "night"];

export const TIME_STYLES = {
  dawn: {
    light: "rgba(255, 214, 162, 0.12)"
  },
  noon: {
    light: "rgba(255, 255, 236, 0.04)"
  },
  dusk: {
    light: "rgba(216, 139, 109, 0.18)"
  },
  night: {
    light: "rgba(28, 42, 74, 0.34)"
  }
};

export const WEATHER_STYLES = {
  clear: {
    tint: "rgba(255, 255, 255, 0)"
  },
  cloudy: {
    tint: "rgba(159, 172, 171, 0.13)"
  },
  wind: {
    tint: "rgba(192, 206, 180, 0.08)"
  },
  rain: {
    tint: "rgba(99, 123, 132, 0.18)"
  },
  snow: {
    tint: "rgba(224, 232, 235, 0.18)"
  }
};

export const THEMES = [
  {
    id: "grassland",
    label: "Grassland",
    name: "Grassland",
    groundType: "grass",
    palette: {
      skyTop: "#9cc5d5",
      skyBottom: "#d6dfc6",
      far: "#89a4a8",
      mid: "#7fa06d",
      ground: "#718b4f",
      road: "#9a9869",
      foreground: "#3d5534"
    }
  },
  {
    id: "forest",
    label: "Forest",
    name: "Forest",
    groundType: "grass",
    palette: {
      skyTop: "#829fa5",
      skyBottom: "#c2cdb8",
      far: "#647f79",
      mid: "#4e7057",
      ground: "#4a6041",
      road: "#7a744d",
      foreground: "#25392e"
    }
  },
  {
    id: "snow_wasteland",
    label: "Snow Wasteland",
    name: "Snow Wasteland",
    groundType: "stone",
    palette: {
      skyTop: "#99aebb",
      skyBottom: "#dbe2df",
      far: "#9ba9b0",
      mid: "#c1c9c5",
      ground: "#d0d5cf",
      road: "#a8b0ae",
      foreground: "#6f7d7e"
    }
  },
  {
    id: "desert",
    label: "Desert",
    name: "Desert",
    groundType: "sand",
    palette: {
      skyTop: "#9ebfce",
      skyBottom: "#e4cc9b",
      far: "#b99066",
      mid: "#c3a05e",
      ground: "#b68c4f",
      road: "#d1b36e",
      foreground: "#775f3c"
    }
  },
  {
    id: "seaside",
    label: "Seaside",
    name: "Seaside",
    groundType: "sand",
    palette: {
      skyTop: "#89b9cc",
      skyBottom: "#d1dfd0",
      far: "#799ca4",
      mid: "#709497",
      ground: "#98906f",
      road: "#c1b982",
      foreground: "#445b52"
    }
  }
];
