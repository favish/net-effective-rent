// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */

function averageBaseRate(
  leaseTerm: number,
  baseRate: number,
  escalationValue: number,
  sizeSf: number,
  numOfFreeMonths: number,
  accumulateBaseRate: Function
) {
  // variables
  let averageBaseRate = 0;

  // early return due to free duration
  if (leaseTerm <= numOfFreeMonths) {
    return 0;
  }

  // helper utils
  const round2digits = (num) => Math.round(num * 100) / 100;

  // in between a year
  if (numOfFreeMonths < leaseTerm && leaseTerm <= numOfFreeMonths + 11) {
    return round2digits((baseRate * (leaseTerm - numOfFreeMonths)) / leaseTerm);
  }

  // accumulator for base rate during yearly interval
  const accumulatorBaseRate = accumulateBaseRate(escalationValue);

  // over a year accumulation
  let totalBaseRent = 0;
  let totalBaseRentFirstYear = 0;
  let monthsToCalculate = 0;
  let shouldStartPeriod = false;

  if (numOfFreeMonths <= 12) {
    totalBaseRentFirstYear = (baseRate / 12) * sizeSf * (12 - numOfFreeMonths);
    monthsToCalculate = leaseTerm - 12;
    shouldStartPeriod = true;
    // console.log('totalBaseRentFirstYear = ' + totalBaseRentFirstYear)
  } else {
    totalBaseRentFirstYear = 0;
    monthsToCalculate = leaseTerm - numOfFreeMonths;
    shouldStartPeriod = false;
  }
  // console.log('monthsToCalculate = ' + monthsToCalculate)

  totalBaseRent = totalBaseRentFirstYear; // initial value for first fiscal year

  let accBaseRate = 0; // accumulator for base rate

  // next calculation is less than a year
  if (monthsToCalculate <= 12) {
    // this time, base rate is accumulated
    accBaseRate = !shouldStartPeriod ? baseRate : accumulatorBaseRate(baseRate);
    // console.log(accBaseRate)
    totalBaseRent += (accBaseRate / 12) * sizeSf * monthsToCalculate;
  }
  // make interval calculation
  else {
    const intervalYear = parseInt(String(monthsToCalculate / 12));
    const remainMonths = monthsToCalculate - 12 * intervalYear;
    // console.log('intervalYear = ' + intervalYear)
    // console.log('remainMonths = ' + remainMonths)
    // console.log('shouldStartPeriod = ' + (shouldStartPeriod))

    // initial accumulate value of base rate
    accBaseRate = baseRate;
    for (let i = 0; i < Math.round(intervalYear); i++) {
      if (!shouldStartPeriod) {
        shouldStartPeriod = true;
      } else {
        accBaseRate = accumulatorBaseRate(accBaseRate);
      }
      totalBaseRent += accBaseRate * sizeSf;
      // console.log('accBaseRate = ' + accBaseRate + ' | totalRent = ' + (accBaseRate * sizeSf))
    }
    if (remainMonths > 0) {
      accBaseRate = accumulatorBaseRate(accBaseRate);
      totalBaseRent += (accBaseRate / 12) * sizeSf * remainMonths;
      // console.log('accBaseRate = ' + accBaseRate + ' | totalRent = ' + ((accBaseRate / 12) * sizeSf * remainMonths))
    }
  }
  // console.log('totalBaseRent = ' + totalBaseRent)

  // calculate average base rate
  averageBaseRate = (totalBaseRent / leaseTerm / sizeSf) * 12;

  // round up to 2 decimal digits
  // return parseFloat(averageBaseRate.toFixed(2));
  return round2digits(averageBaseRate);
}

class RentCalculator {
  private calculator: {
    Percent: (
      leaseTerm,
      baseRate,
      escalationValue,
      sizeSf,
      numOfFreeMonths
    ) => number;
    Amount: (
      leaseTerm,
      baseRate,
      escalationValue,
      sizeSf,
      numOfFreeMonths
    ) => number;
    Flat: (
      leaseTerm,
      baseRate,
      escalationValue,
      sizeSf,
      numOfFreeMonths
    ) => number;
  };

  constructor() {
    this.calculator = {
      Flat: this._calcFlat,
      Percent: this._calcPercent,
      Amount: this._calcAmount,
    };
  }

  calculateNetEffectiveBaseRate(
    leaseTerm,
    baseRate,
    escalationValue,
    escalationType,
    sizeSf,
    numOfFreeMonths,
    tiAllowance
  ) {
    const averageBaseRate = this.calculateAverageBaseRent(
      leaseTerm,
      baseRate,
      escalationValue,
      escalationType,
      sizeSf,
      numOfFreeMonths
    );
    if (averageBaseRate === 0) {
      return 0;
    }

    if (!averageBaseRate) {
      return null;
    }

    return (
      Math.round(
        (averageBaseRate - tiAllowance / (leaseTerm / 12) + Number.EPSILON) *
          100
      ) / 100
    );
  }

  calculateAverageBaseRent(
    leaseTerm,
    baseRate,
    escalationValue,
    escalationType,
    sizeSf,
    numOfFreeMonths
  ) {
    const calculator = this.calculator[escalationType];
    if (typeof calculator === "undefined") {
      return null;
    }

    return calculator(
      leaseTerm,
      baseRate,
      escalationValue,
      sizeSf,
      numOfFreeMonths
    );
  }

  _calcFlat(leaseTerm, baseRate, escalationValue, sizeSf, numOfFreeMonths) {
    const accumulateBaseRate = (escalationValue) => (rate) => rate;
    return averageBaseRate(
      leaseTerm,
      baseRate,
      escalationValue,
      sizeSf,
      numOfFreeMonths,
      accumulateBaseRate
    );
  }

  _calcPercent(leaseTerm, baseRate, escalationValue, sizeSf, numOfFreeMonths) {
    const accumulateBaseRate = (escalationValue) => (rate) =>
      rate + (rate * escalationValue) / 100;
    return averageBaseRate(
      leaseTerm,
      baseRate,
      escalationValue,
      sizeSf,
      numOfFreeMonths,
      accumulateBaseRate
    );
  }

  _calcAmount(leaseTerm, baseRate, escalationValue, sizeSf, numOfFreeMonths) {
    const accumulateBaseRate = (escalationValue) => (rate) =>
      rate + escalationValue;
    return averageBaseRate(
      leaseTerm,
      baseRate,
      escalationValue,
      sizeSf,
      numOfFreeMonths,
      accumulateBaseRate
    );
  }
}

export default RentCalculator;
