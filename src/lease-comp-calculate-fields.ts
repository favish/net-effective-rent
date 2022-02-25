import moment from "moment";
import RentCalculator from "./rent-calculator";

// calc lease comps
// and only lease comps
// wrote this for ross later cause he big noob
export function generateComputedFields(data) {
  const is_active = calculateIsActive({
    commencementDate: data.commencement_date,
    leaseTerm: data.lease_term,
  });

  const is_estimated = calculateIsEstimated({
    execution_date_estimated: data.execution_date_estimated,
    commencement_date_estimated: data.commencement_date_estimated,
    lease_term_estimated: data.lease_term_estimated,
    escalation_value_estimated: data.escalation_value_estimated,
    electrical_and_janitorial_estimated:
      data.electrical_and_janitorial_estimated,
    base_rate_estimated: data.base_rate_estimated,
    size_sf_estimated: data.size_sf_estimated,
    opex_estimated: data.opex_estimated,
    free_months_estimated: data.free_months_estimated,
    ti_allowance_estimated: data.ti_allowance_estimated,
  });

  const is_incomplete = calculateIsIncomplete({
    commencement_date: data.commencement_date,
    escalation_type: data.escalation_type,
    free_rent_type: data.free_rent_type,
    transaction_type: data.transaction_type,
    lease_type: data.lease_type,
    escalation_value: data.escalation_value,
    free_months: data.free_months,
    ti_allowance: data.ti_allowance,
  });

  const expiration_date = calculateExpirationDate({
    commencement_date: data?.commencement_date,
    lease_term: data?.lease_term,
  });

  const net_effective_base_rate = calculateNetEffectiveBaseRate({
    lease_term: data.lease_term,
    base_rate: data.base_rate,
    escalation_value: data.escalation_value,
    escalation_type: data.escalation_type,
    size_sf: data.size_sf,
    free_months: data.free_months,
    ti_allowance: data.ti_allowance,
  });

  return {
    is_active,
    is_estimated,
    is_incomplete,
    expiration_date,
    net_effective_base_rate,
  };
}

function calculateIsActive({ commencementDate, leaseTerm }): boolean {
  const expirationDate = moment(commencementDate, "YYYY-MM-DD")
    .add(leaseTerm || 0, "M")
    .format("YYYY-MM-DD");
  return moment(expirationDate, "YYYY-MM-DD").diff(moment.now(), "days") > 0;
}

function calculateIsEstimated({
  execution_date_estimated,
  commencement_date_estimated,
  lease_term_estimated,
  escalation_value_estimated,
  electrical_and_janitorial_estimated,
  base_rate_estimated,
  size_sf_estimated,
  opex_estimated,
  free_months_estimated,
  ti_allowance_estimated,
}): boolean {
  return !!(
    execution_date_estimated ||
    commencement_date_estimated ||
    lease_term_estimated ||
    escalation_value_estimated ||
    electrical_and_janitorial_estimated ||
    base_rate_estimated ||
    size_sf_estimated ||
    opex_estimated ||
    free_months_estimated ||
    ti_allowance_estimated
  );
}

function calculateIsIncomplete({
  commencement_date,
  escalation_type,
  free_rent_type,
  transaction_type,
  lease_type,
  escalation_value,
  free_months,
  ti_allowance,
}): boolean {
  // commencement_date can either be an empty string, or a null value
  return (
    commencement_date === "" ||
    commencement_date === null ||
    escalation_type === "" ||
    free_rent_type === "" ||
    transaction_type === "" ||
    lease_type === "" ||
    escalation_value === "" ||
    free_months === "" ||
    ti_allowance === ""
  );
}

function calculateExpirationDate({ commencement_date, lease_term }) {
  if (
    commencement_date === "" ||
    commencement_date === null ||
    isNaN(lease_term)
  ) {
    return null;
  }

  return moment(commencement_date)
    .add(lease_term || 0, "M")
    .toString();
}

function calculateNetEffectiveBaseRate({
  lease_term,
  base_rate,
  escalation_value,
  escalation_type,
  size_sf,
  free_months,
  ti_allowance,
}): number | number | null {
  if (
    lease_term === null ||
    base_rate === null ||
    escalation_value === null ||
    escalation_type === null ||
    size_sf === null ||
    free_months === null ||
    ti_allowance === null
  ) {
    return null;
  }

  const rentCalculator = new RentCalculator();

  if (
    typeof lease_term !== "undefined" &&
    typeof base_rate !== "undefined" &&
    typeof escalation_value !== "undefined" &&
    typeof escalation_type !== "undefined" &&
    typeof size_sf !== "undefined" &&
    typeof free_months !== "undefined" &&
    typeof ti_allowance !== "undefined"
  ) {
    return rentCalculator.calculateNetEffectiveBaseRate(
      lease_term,
      base_rate,
      escalation_value,
      escalation_type,
      size_sf,
      free_months,
      ti_allowance
    );
  } else {
    return null;
  }
}
