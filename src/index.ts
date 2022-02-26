const round2digits = (num: number) => Math.round(num * 100) / 100;

export function calculateAverageBaseRate(
    leaseTerm: number,
    baseRate: number,
    escalationType: "Flat" | "Percent" | "Amount" | "Irregular",
    escalationValue: number,
    numOfFreeMonths: number,
) {
    let totalRateThing = 0;
    let currentBaseRate = baseRate;

    // Lets iterate through every month in the term and just add up the costs.
    for (let i = 1; i <= leaseTerm; i++) {

        // Pay rent first then increase rent because thats how it works in real life.
        // If we have free months and were still in them don't pay rent
        if (numOfFreeMonths !== 0 && i <= numOfFreeMonths) {
            totalRateThing += 0;
        } else {
            totalRateThing += currentBaseRate;
        }

        // Increase the rent each year if its not flat or irregular escalation which are ignored
        // TODO Should we really ignore irregular escalation lets ask Kirk? -mf
        if (escalationType !== ("Flat" || "Irregular") && i % 12 === 0) {

            // Increase the rent by amount
            if (escalationType === "Amount") {
                currentBaseRate += escalationValue;

                // Increase the rent by percent
            } else if (escalationType === "Percent") {
                currentBaseRate *= (1 + escalationValue / 100);
            }
        }


    }
    // helper function for clarity

    return round2digits(totalRateThing / leaseTerm);
}

export function calculateTIRate(
    leaseTerm: number,
    averageBaseRate: number,
    tiAllowance: number
) {
    // Avg TI RATE = SQFT * TI / Terms
    return (
        round2digits(averageBaseRate - tiAllowance / (leaseTerm / 12))
    );
}

export function calculateNetEffectiveBaseRate(
    baseRate: number,
    TIRate: number
) {

    // If there is no base rate it seems silly to go negative right?
    if (baseRate === 0) {
        return 0;
    }

    // Avg TI RATE = SQFT * TI / Terms
    return (
        round2digits(baseRate - TIRate)
    );
}
