/**
 * Denomination Calculator Utility
 * Calculates Thai Baht denomination breakdowns using a Greedy Algorithm.
 */

const DENOMINATIONS = [1000, 500, 100, 50, 20, 10, 5, 2, 1];

/**
 * Calculate the denomination breakdown for a single amount
 * using the Greedy Algorithm.
 * @param {number} amount - The amount to break down
 * @returns {Object} breakdown - Object with denomination keys and count values
 */
export function calculateBreakdown(amount) {
  const breakdown = {};
  let remaining = Math.round(amount); // Ensure integer

  for (const denom of DENOMINATIONS) {
    const count = Math.floor(remaining / denom);
    breakdown[denom] = count;
    remaining -= count * denom;
  }

  return breakdown;
}

/**
 * Process all employees and calculate individual + grand total breakdowns.
 * @param {Array} employees - Array of { id_or_name, amount }
 * @returns {Object} result - { summary_total_amount, grand_total_breakdown, individual_breakdown }
 */
export function calculateAllDenominations(employees) {
  const grandTotal = {};
  DENOMINATIONS.forEach((d) => (grandTotal[d] = 0));

  let summaryTotalAmount = 0;

  const individualBreakdown = employees.map((emp) => {
    const amount = Math.round(emp.amount);
    const breakdown = calculateBreakdown(amount);

    // Aggregate into grand total
    for (const denom of DENOMINATIONS) {
      grandTotal[denom] += breakdown[denom];
    }

    summaryTotalAmount += amount;

    return {
      id_or_name: emp.id_or_name,
      amount,
      breakdown,
    };
  });

  return {
    summary_total_amount: summaryTotalAmount,
    grand_total_breakdown: grandTotal,
    individual_breakdown: individualBreakdown,
  };
}

export { DENOMINATIONS };
