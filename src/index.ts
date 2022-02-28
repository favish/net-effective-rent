import {
  calculateIsActive,
  calculateNetEffectiveBaseRate,
  calculateExpirationDate,
  calculateIsIncomplete,
  calculateAverageBaseRate,
  calculateTIRate,
  calculateIsEstimated,
} from "./calculators"
import { EscalationTypeUnion } from "./types"

export * from "./calculators"

export function generateComputedFields(data: {
  baseRate: number
  commencementDate: string
  leaseTerm: number
  escalationType: EscalationTypeUnion | ""
  freeRentType: string
  transactionType: string | number | null
  leaseType: number
  escalationValue: number
  freeMonths: number
  tiAllowance: number
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

  return {
    isActive,
    isEstimated,
    isIncomplete,
    expiration_date,
    netEffectiveBaseRate,
  }
}
