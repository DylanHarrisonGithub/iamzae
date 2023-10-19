const config: {
  ENVIRONMENT: "PRODUCTION" | "LAN" | "DEVELOPMENT",
  APP_NAME: string,
  AUTH_TOKEN_STORAGE_METHOD: "LOCAL" | "SESSION" | "COOKIE" | "WINDOW",
  APP_STORAGE_METHOD: "LOCAL" | "SESSION" | "COOKIE" | "WINDOW",
  URI: { DEVELOPMENT: string, LAN: string, PRODUCTION: string },
  ASSETS: { DEVELOPMENT: string, LAN: string, PRODUCTION: string },
} = {
  ENVIRONMENT: <"PRODUCTION" | "LAN" | "DEVELOPMENT">(process.env.NODE_ENV.toUpperCase() || "PRODUCTION"),
  APP_NAME: "iamzae",
  AUTH_TOKEN_STORAGE_METHOD: "LOCAL",
  APP_STORAGE_METHOD: "LOCAL",
  URI: {
    DEVELOPMENT: "http://localhost:3000/",
    LAN: "",
    PRODUCTION: ""
  },
  ASSETS: {
    DEVELOPMENT: "http://localhost:3000/public/",
    LAN: "",
    PRODUCTION: "/public/"
  }
}

export default config;