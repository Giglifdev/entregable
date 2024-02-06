const passportStrategiesEnum = {
  JWT: "jwt",
  GITHUB: "github",
  NOTHING: "na",
};

const accessRolesEnum = {
  ADMIN: "admin",
  USER: "user",
  PUBLIC: "public",
  PREMIUM: "premium",
};

const EErrors = {
  ROUTING_ERROR: 1,
  INVALID_TYPE_ERROR: 2,
  USER_NOT_FOUND: 3,
  PRODUCT_NOT_FOUND: 4,
  INTERNAL_SERVER_ERROR: 5,
  DATABASE_ERROR: 6,
  CREDENTIALS_ERROR: 7,
  CONFLICT_ERROR: 8,
};

export { passportStrategiesEnum, accessRolesEnum, EErrors };
