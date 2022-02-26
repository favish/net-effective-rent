import { test, assert } from "vitest"
import { calculateAverageBaseRate } from "../src"

test("Escalation - Flat (None)", () => {
  assert.equal(calculateAverageBaseRate(24, 100, "Flat", 0, 0), 100)
})

test("Escalation - Flat with escalationValue that should have no effect", () => {
  assert.equal(calculateAverageBaseRate(60, 100, "Flat", 100, 0), 100)
})

test("Escalation - Percent", () => {
  assert.equal(calculateAverageBaseRate(24, 100, "Percent", 10, 0), 105)
})

test("Escalation - Percent with escalationValue that shoule cause no escalation", () => {
  assert.equal(calculateAverageBaseRate(24, 100, "Percent", 0, 0), 100)
})

test("Number of free months is greater than 1 year", () => {
  assert.equal(calculateAverageBaseRate(24, 100, "Percent", 10, 23), 4.58)
})

test("Free Month", () => {
  assert.equal(calculateAverageBaseRate(60, 100, "Flat", 0, 1), 98.33)
})


test("Escalation - Amount", () => {
  assert.equal(calculateAverageBaseRate(24, 100, "Amount", 10, 0), 105)
})

test("Escalation - Amount with free months", () => {
  assert.equal(calculateAverageBaseRate(60, 100, "Flat", 100, 0), 100)
})

test("Escalation - Percent with with free months", () => {
  assert.equal(calculateAverageBaseRate(24, 100, "Percent", 10, 12), 55)
})

test("Free Months greater than Lease Term", () => {
  assert.equal(calculateAverageBaseRate(24, 100, "Flat", 0, 30), 0)
})

// test("Escalation - Percent with with free months with TI", () => {
//   assert.equal(myAverageBaseRate(24, 100, "Percent", 10, 12), 50)
// })

// test("Escalation - Amount with free months with TI", () => {
//   //TODO add TI
//    assert.equal(myAverageBaseRate(24, 100, "Amount", 10, 12), 50)
//    // assert.equal(rentCalculator.calculateNetEffectiveBaseRate(24, 100, 10, 'Amount', 100, 12, 10), 50)
// })

// Irregular doesnt have a function is this just not calculated? -mf