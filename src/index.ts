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

    // helper utils
    const round2digits = (num) => Math.round(num * 100) / 100;

    // early return due to free duration
    if (leaseTerm <= numOfFreeMonths) {
        return 0;
    }

    // accumulator for base rate during yearly interval
    const accumulatorBaseRate = accumulateBaseRate(escalationValue);

    // over a year accumulation
    let totalBaseRent = 0;
    let totalBaseRentFirstYear = 0;
    let monthsToCalculate = 0;

    if (numOfFreeMonths <= 12) {
        totalBaseRentFirstYear = (baseRate / 12) * sizeSf * (12 - numOfFreeMonths);
        monthsToCalculate = leaseTerm - 12;
    } else {
        totalBaseRentFirstYear = 0;
        monthsToCalculate = leaseTerm - numOfFreeMonths;
    }

    totalBaseRent = totalBaseRentFirstYear; // initial value for first fiscal year

    let accBaseRate = 0; // accumulator for base rate
    const intervalYear = parseInt(String(monthsToCalculate / 12));
    const remainMonths = monthsToCalculate - 12 * intervalYear;

    // initial accumulate value of base rate
    accBaseRate = baseRate;
    for (let i = 0; i < Math.round(intervalYear); i++) {
        // If its not the first year we need to up the rent according to the escalation
        // if (i > 0) {
        //     let accumulatorBaseRate = accumulateBaseRate(escalationValue);
        // }
        accBaseRate = accumulatorBaseRate(accBaseRate);
        totalBaseRent += accBaseRate * sizeSf;
    }
    if (remainMonths > 0) {
        accBaseRate = accumulatorBaseRate(accBaseRate);
        totalBaseRent += (accBaseRate / 12) * sizeSf * remainMonths;
    }

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
        const averageBaseRateValue = this.calculateAverageBaseRent(
            leaseTerm,
            baseRate,
            escalationValue,
            escalationType,
            sizeSf,
            numOfFreeMonths
        );
        if (averageBaseRateValue === 0) {
            return 0;
        }

        if (!averageBaseRateValue) {
            return null;
        }

        return (
            // NEBR = ABR - (TI / ( Terms / 12 ) )
            // Epsilon is here to fix JS floating point oddities this is also why we multiply then divide by 100
            Math.round(
                (averageBaseRateValue - tiAllowance / (leaseTerm / 12) + Number.EPSILON) *
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