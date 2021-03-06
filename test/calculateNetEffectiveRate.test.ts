import { test, assert } from "vitest"
import {
  calculateTIRate,
  calculateAverageBaseRate,
  calculateNetEffectiveBaseRate,
} from "../src/calculators"

test("NetEffectiveBaseRate - Simple unit test", () => {
  assert.equal(calculateNetEffectiveBaseRate(100, 17.5), 82.5)
})

test("NER - Full integration test", () => {
  // IF we want a full integration test
  let avgBaseRate = calculateAverageBaseRate(24, 100, "Flat", 0, 0) // Should equal 100
  let TIRate = calculateTIRate(24, 35) // Should equal 17.5
  assert.equal(calculateNetEffectiveBaseRate(avgBaseRate, TIRate), 82.5)
})

// test("NER - Full integration test with random values", () => {
//   // IF we want a full integration test
//   let avgBaseRate = calculateAverageBaseRate(36, 58.75, "Percent", 15, 2)
//   let TIRate = calculateTIRate(36, 35) // Should equal 17.5
//   assert.equal(calculateNetEffectiveBaseRate(avgBaseRate, TIRate), 53.07)
// })

// test("NER - Full integration test with random values", () => {
//   // IF we want a full integration test
//   let avgBaseRate = calculateAverageBaseRate(7, 6.06, "Flat", 0, 0)
//   let TIRate = calculateTIRate(7, 4) // Should equal 17.5
//   assert.equal(calculateNetEffectiveBaseRate(avgBaseRate, TIRate), 53.07)
// })
