import { test } from "node:test";
import assert from "node:assert/strict";
import { hashPassword, verifyPassword } from "./password.ts";

test("password hashes are salted and accept only the correct password", async () => {
  const password = "a long integration test password";
  const first = await hashPassword(password);
  const second = await hashPassword(password);
  assert.notEqual(first, second);
  assert.equal(await verifyPassword(password, first), true);
  assert.equal(await verifyPassword("incorrect password", first), false);
});

test("invalid stored hashes fail closed", async () => {
  for (const value of ["", "invalid", "scrypt:abc:def", "bcrypt:" + "a".repeat(200)]) {
    assert.equal(await verifyPassword("password", value), false);
  }
});

test("unicode passwords round trip without lossy transformations", async () => {
  const password = "correct horse 🔑 café 密碼";
  const hash = await hashPassword(password);
  assert.equal(await verifyPassword(password, hash), true);
  assert.equal(await verifyPassword(password + " ", hash), false);
});
