import type { EscalationTypeUnion } from "./types"
import dayjs from "dayjs"

const round2digits = (num: number) => Math.round(num * 100) / 100

export function calculateAverageBaseRate(
  leaseTerm: number,
  baseRate: number,
  escalationType: EscalationTypeUnion | "",
  escalationValue: number,
  numOfFreeMonths: number,
) {
  let totalRate = 0
  let currentBaseRate = baseRate

  // Lets iterate through every month in the term and just add up the costs.
  for (let i = 1; i <= leaseTerm; i++) {
    // Pay rent first then increase rent because thats how it works in real life.
    // If we have free months and were still in them don't pay rent
    if (numOfFreeMonths !== 0 && i <= numOfFreeMonths) {
      totalRate += 0
    } else {
      totalRate += currentBaseRate
    }

    // Increase the rent each year if its not flat or irregular escalation which are ignored
    // TODO Should we really ignore irregular escalation lets ask Kirk? -mf
    if (escalationType !== ("Flat" || "Irregular") && i % 12 === 0) {
      // Increase the rent by amount
      if (escalationType === "Amount") {
        currentBaseRate += escalationValue

        // Increase the rent by percent
      } else if (escalationType === "Percent") {
        currentBaseRate *= 1 + escalationValue / 100
      }
    }
  }

  return round2digits(totalRate / leaseTerm)
}

export function calculateTIRate(leaseTerm: number, tiAllowance: number) {
  if (leaseTerm === 0) {
    return 0
  }

  // Avg TI RATE = SQFT * TI / Terms
  return round2digits(tiAllowance / (leaseTerm / 12))
}

export function calculateNetEffectiveBaseRate(
  baseRate: number,
  TIRate: number,
) {
  // If there is no base rate or ti is negative lets stop the madness
  if (baseRate === 0 || TIRate >= baseRate) {
    return 0
  }

  // Avg TI RATE = SQFT * TI / Terms
  return round2digits(baseRate - TIRate)
}

export function calculateExpirationDate(fields: {
  commencementDate: string
  leaseTerm: number
}): string | null {
  if (
    fields.commencementDate === "" ||
    fields.commencementDate === null ||
    isNaN(fields.leaseTerm)
  ) {
    return null
  }

  return dayjs(fields.commencementDate)
    .add(fields.leaseTerm || 0, "M")
    .subtract(1, "d") // tenants have to be out 1 day before exp
    .format("YYYY-MM-DD")
}

export function calculateIsIncomplete(fields: {
  commencementDate: string
  escalationType: EscalationTypeUnion | ""
  freeRentType: string
  transactionType: string | number | null
  leaseType: any
  escalationValue: any
  freeMonths: any
  tiAllowance: any
}): boolean {
  // commencement_date can either be an empty string, or a null value
  return (
    fields.commencementDate === "" ||
    fields.commencementDate === null ||
    fields.escalationType === "" ||
    fields.freeRentType === "" ||
    fields.transactionType === "" ||
    fields.leaseType === "" ||
    fields.escalationValue === "" ||
    fields.freeMonths === "" ||
    fields.tiAllowance === ""
  )
}

export function calculateIsActive({
  commencementDate,
  leaseTerm,
}: {
  commencementDate: string
  leaseTerm: number
}): boolean {
  const expirationDate = calculateExpirationDate({
    commencementDate,
    leaseTerm,
  })

  return dayjs(expirationDate, "YYYY-MM-DD").diff(dayjs(), "days") > 0
}

export function calculateIsEstimated(fields: {
  executionDateEstimated: any
  commencementDateEstimated: any
  leaseTermEstimated: any
  escalationValueEstimated: any
  electricalAndJanitorialEstimated: any
  baseRateEstimated: any
  sizeSfEstimated: any
  opexEstimated: any
  freeMonthsEstimated: any
  tiAllowanceEstimated: any
}): boolean {
  return !!(
    fields.executionDateEstimated ||
    fields.commencementDateEstimated ||
    fields.leaseTermEstimated ||
    fields.escalationValueEstimated ||
    fields.electricalAndJanitorialEstimated ||
    fields.baseRateEstimated ||
    fields.sizeSfEstimated ||
    fields.opexEstimated ||
    fields.freeMonthsEstimated ||
    fields.tiAllowanceEstimated
  )
}

export function calculateFullServiceRate(fields: {
  opex: number
  baseRate: number
}) {
  if (isNaN(fields.opex) || isNaN(fields.baseRate)) {
    return null
  }

  return (
    (Math.floor(fields.opex * 100) + Math.floor(fields.baseRate * 100)) / 100
  )
}
