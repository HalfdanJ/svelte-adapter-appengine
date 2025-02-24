import { describe, it, expect } from "vitest";

describe("Integration test", () => {
  it("runs the server", async () => {
    const response = await fetch("http://localhost:8080/sverdle");
    expect(response.status).toBe(200);
  });

  it("return 200 OK from /_ah/start scaling route", async () => {
    const response = await fetch("http://localhost:8080/_ah/start");
    expect(response.status).toBe(200);
    expect(await response.text()).toBe("OK");
  });

  it("return 200 OK from /test.json prerendered route", async () => {
    const response = await fetch("http://localhost:8080/test.json");
    expect(response.status).toBe(200);
    expect(await response.text()).toBe('{"test":true}');
  });
});
