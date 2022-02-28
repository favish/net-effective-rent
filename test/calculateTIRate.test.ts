import { test, assert } from "vitest"
import { calculateTIRate } from "../src"

test("TIRate - Normal Values", () => {
    assert.equal(calculateTIRate(24, 35), 17.50)
})

test("TIRate - No TI Value", () => {
    assert.equal(calculateTIRate(24, 0), 0)
})

test("TIRate - No Terms Value", () => {
    assert.equal(calculateTIRate(0, 35), 0)
})

// test("Escalation - Amount with free months with TI", () => {
//   //TODO add TI
//    assert.equal(myAverageBaseRate(24, 100, "Amount", 10, 12), 50)
//    // assert.equal(rentCalculator.calculateNetEffectiveBaseRate(24, 100, 10, 'Amount', 100, 12, 10), 50)
// })

// Irregular doesnt have a function is this just not calculated? -mf