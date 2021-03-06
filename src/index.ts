import {
  calculateIsActive,
  calculateNetEffectiveBaseRate,
  calculateExpirationDate,
  calculateIsIncomplete,
  calculateAverageBaseRate,
  calculateTIRate,
  calculateIsEstimated,
  calculateFullServiceRate,
} from "./calculators"
import { EscalationTypeUnion } from "./types"

export * from "./calculators"

export function generateComputedFields(data: {
  baseRate: number
  commencementDate: string
  freeMonths: number
  escalationType: EscalationTypeUnion | ""
  escalationValue: number
  freeRentType: string
  leaseTerm: number
  leaseType: number
  opex: number
  tiAllowance: number
  transactionType: string | number | null
  /** estimated fields **/
  executionDateEstimated: boolean
  commencementDateEstimated: boolean
  leaseTermEstimated: boolean
  escalationValueEstimated: boolean
  electricalAndJanitorialEstimated: boolean
  baseRateEstimated: boolean
  sizeSfEstimated: boolean
  opexEstimated: boolean
  freeMonthsEstimated: boolean
  tiAllowanceEstimated: boolean
}) {
  const isActive = calculateIsActive({
    commencementDate: data.commencementDate,
    leaseTerm: data.leaseTerm,
  })

  const isEstimated = calculateIsEstimated({
    executionDateEstimated: data.executionDateEstimated,
    commencementDateEstimated: data.commencementDateEstimated,
    leaseTermEstimated: data.leaseTermEstimated,
    escalationValueEstimated: data.escalationValueEstimated,
    electricalAndJanitorialEstimated: data.electricalAndJanitorialEstimated,
    baseRateEstimated: data.baseRateEstimated,
    sizeSfEstimated: data.sizeSfEstimated,
    opexEstimated: data.opexEstimated,
    freeMonthsEstimated: data.freeMonthsEstimated,
    tiAllowanceEstimated: data.tiAllowanceEstimated,
  })

  const isIncomplete = calculateIsIncomplete({
    commencementDate: data.commencementDate,
    escalationType: data.escalationType,
    freeRentType: data.freeRentType,
    transactionType: data.transactionType,
    leaseType: data.leaseType,
    escalationValue: data.escalationValue,
    freeMonths: data.freeMonths,
    tiAllowance: data.tiAllowance,
  })

  const expiration_date = calculateExpirationDate({
    commencementDate: data?.commencementDate,
    leaseTerm: data?.leaseTerm,
  })

  function handleNetEffective() {
    const castedData = data as any
    // i didnt check for falsy because values can be 0 and still need to calculate
    if (
      castedData.leaseTerm === null ||
      castedData.baseRate === null ||
      castedData.escalationValue === null ||
      castedData.escalationType === null ||
      castedData.tiAllowance === null ||
      castedData.freeMonths === null ||
      typeof castedData.leaseTerm === "undefined" ||
      typeof castedData.baseRate === "undefined" ||
      typeof castedData.escalationValue === "undefined" ||
      typeof castedData.escalationType === "undefined" ||
      typeof castedData.freeMonths === "undefined" ||
      typeof castedData.tiAllowance === "undefined"
    ) {
      return null
    }

    const avgBaseRate = calculateAverageBaseRate(
      data?.leaseTerm,
      data.baseRate,
      data.escalationType,
      data.escalationValue,
      data.freeMonths,
    ) // Should equal 100
    const tiRate = calculateTIRate(data.leaseTerm, data.tiAllowance) // Should equal 17.5
    const netEffectiveBaseRate = calculateNetEffectiveBaseRate(
      avgBaseRate,
      tiRate,
    )

    return netEffectiveBaseRate
  }

  const fullServiceRate = calculateFullServiceRate({
    opex: data?.opex,
    baseRate: data?.baseRate,
  })

  return {
    isActive,
    isEstimated,
    isIncomplete,
    expiration_date,
    netEffectiveBaseRate: handleNetEffective(),
    fullServiceRate,
  }
}
