import { test, assert } from "vitest"
import RentCalculator from "../src"

test("Free Months greater than Lease Term", () => {
  const rentCalculator = new RentCalculator();
  assert.equal(rentCalculator.calculateNetEffectiveBaseRate(60, 100, 0, 'Flat', 100, 90, 0), 0)
})

test("Number of free months is greater than 1 year", () => {
  const rentCalculator = new RentCalculator();
  assert.equal(rentCalculator.calculateNetEffectiveBaseRate(24, 100, 10, 'Percent', 100, 23, 0), 4.58)
})

test("Free Month", () => {
  const rentCalculator = new RentCalculator();
  assert.equal(rentCalculator.calculateNetEffectiveBaseRate(60, 100, 0, 'Flat', 100, 1, 0), 98.33)
})

test("Escalation - Flat", () => {
  const rentCalculator = new RentCalculator();
  assert.equal(rentCalculator.calculateNetEffectiveBaseRate(60, 100, 0, 'Flat', 100, 0, 0), 100)
})

test("Escalation - Flat with value", () => {
  const rentCalculator = new RentCalculator();
  assert.equal(rentCalculator.calculateNetEffectiveBaseRate(60, 100, 100, 'Flat', 100, 0, 0), 100)
})

test("Escalation - Amount", () => {
  const rentCalculator = new RentCalculator();
  assert.equal(rentCalculator.calculateNetEffectiveBaseRate(24, 100, 10, 'Amount', 100, 0, 0), 105)
})

test("Escalation - Amount with free months", () => {
  const rentCalculator = new RentCalculator();
  assert.equal(rentCalculator.calculateNetEffectiveBaseRate(24, 100, 10, 'Amount', 100, 12, 0), 55)
})

test("Escalation - Amount with free months with TI", () => {
  const rentCalculator = new RentCalculator();
  assert.equal(rentCalculator.calculateNetEffectiveBaseRate(24, 100, 10, 'Amount', 100, 12, 10), 50)
})

test("Escalation - Percent", () => {
  const rentCalculator = new RentCalculator();
  assert.equal(rentCalculator.calculateNetEffectiveBaseRate(24, 100, 10, 'Percent', 100, 0, 0), 105)
})

test("Escalation - Percent with with free months", () => {
  const rentCalculator = new RentCalculator();
  assert.equal(rentCalculator.calculateNetEffectiveBaseRate(24, 100, 10, 'Percent', 100, 12, 0), 55)
})

test("Escalation - Percent with with free months with TI", () => {
  const rentCalculator = new RentCalculator();
  assert.equal(rentCalculator.calculateNetEffectiveBaseRate(24, 100, 10, 'Percent', 100, 12, 10), 50)
})

// Irregular doesnt have a function is this just not calculated? -mf