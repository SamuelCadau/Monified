process.env.NODE_ENV = "test";
process.env.LOG_LEVEL = "error";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

[
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_CALLBACK_URL",
  "GOOGLE_CALLBACK_URI",
  "MS_CLIENT_ID",
  "MS_CLIENT_SECRET",
  "MS_CALLBACK_URL",
  "MS_TENANT_ID",
  "MICROSOFT_CLIENT_ID",
  "MICROSOFT_CLIENT_SECRET",
  "MICROSOFT_CALLBACK_URI",
  "MICROSOFT_TENANT_ID",
].forEach((key) => {
  process.env[key] = "";
});

const express = require("express");
const jwt = require("jsonwebtoken");
const request = require("supertest");

const app = require("../app");
const db = require("../src/models");
const authJwt = require("../src/middleware/Auth/authJwt.middleware");
const UserService = require("../src/services/User/user.services");
const authConfig = require("../src/config/auth.config");

const buildProtectedApp = () => {
  const protectedApp = express();
  protectedApp.use(express.json());
  protectedApp.delete(
    "/protected",
    authJwt.verifyToken,
    authJwt.isAdmin,
    (req, res) => {
      res.json({ status: "ok", userId: req.body.userId });
    }
  );
  return protectedApp;
};

describe("GET /healthz", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns 200 when the database is reachable", async () => {
    const authenticateSpy = jest
      .spyOn(db.sequelize, "authenticate")
      .mockResolvedValue();

    const response = await request(app).get("/healthz");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body.dependencies).toEqual({ database: "up" });
    expect(authenticateSpy).toHaveBeenCalledTimes(1);
  });

  it("returns 503 when the database connection fails", async () => {
    const authenticateSpy = jest
      .spyOn(db.sequelize, "authenticate")
      .mockRejectedValue(new Error("connection refused"));

    const response = await request(app).get("/healthz");

    expect(response.status).toBe(503);
    expect(response.body.status).toBe("error");
    expect(response.body.message).toBe("Database connectivity failed");
    expect(response.body.dependencies.database).toMatch(/connection refused/i);
    expect(authenticateSpy).toHaveBeenCalledTimes(1);
  });
});

describe("OAuth routes without configuration", () => {
  it("returns 501 for Google OAuth when secrets are missing", async () => {
    const response = await request(app).get("/api/auth/google");

    expect(response.status).toBe(501);
    expect(response.body.success).toBe(false);
    expect(response.body.errorMessage).toMatch(/google/i);
  });

  it("returns 501 for Microsoft OAuth when secrets are missing", async () => {
    const response = await request(app).get("/api/auth/microsoft");

    expect(response.status).toBe(501);
    expect(response.body.success).toBe(false);
    expect(response.body.errorMessage).toMatch(/microsoft/i);
  });
});

describe("Protected route middleware", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("denies access when no bearer token is provided", async () => {
    const protectedApp = buildProtectedApp();

    const response = await request(protectedApp).delete("/protected");

    expect(response.status).toBe(403);
    expect(response.body.errorMessage).toMatch(/No token provided/i);
  });

  it("allows access for admin users with a valid token", async () => {
    const protectedApp = buildProtectedApp();
    const token = jwt.sign({ id: 42 }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
      algorithm: "HS256",
    });

    jest
      .spyOn(UserService.prototype, "findOne")
      .mockResolvedValue({ id: 42, role_id: 2 });

    const response = await request(protectedApp)
      .delete("/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body.userId).toBe(42);
  });
});
