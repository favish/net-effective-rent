import { test, assert } from "vitest"
import { calculateTIRate, calculateAverageBaseRate, calculateNetEffectiveBaseRate } from "../src"

test("NetEffectiveBaseRate - Simple unit test", () => {
  assert.equal(calculateNetEffectiveBaseRate(100, 17.5), 82.50)
})

test("NER - Full integration test", () => {
  // IF we want a full integration test 
  let avgBaseRate = calculateAverageBaseRate(24, 100, "Flat", 0, 0); // Should equal 100
  let TIRate = calculateTIRate(24, 35); // Should equal 17.5
  assert.equal(calculateNetEffectiveBaseRate(avgBaseRate, TIRate), 82.50)
})

test("NER - Full integration test with random values", () => {
  // IF we want a full integration test 
  let avgBaseRate = calculateAverageBaseRate(36, 58.75, "Percent", 15, 2);
  let TIRate = calculateTIRate(36, 35); // Should equal 17.5
  assert.equal(calculateNetEffectiveBaseRate(avgBaseRate, TIRate), 53.07)
})
