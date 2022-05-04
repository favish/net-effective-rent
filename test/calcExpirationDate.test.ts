import { test, assert } from "vitest"
import { calculateExpirationDate, calculateIsActive } from "../src"

test("Expiration date", () => {
  assert.equal(
    calculateExpirationDate({ commencementDate: "2022-06-01", leaseTerm: 63 }),
    "2027-09-01",
  )
})

test("Calc is active - true", () => {
  assert.equal(
    calculateIsActive({ commencementDate: "2022-06-01", leaseTerm: 63 }),
    true,
  )
})

test("Calc is active - false", () => {
  assert.equal(
    calculateIsActive({ commencementDate: "2021-06-01", leaseTerm: 2 }),
    false,
  )
})
