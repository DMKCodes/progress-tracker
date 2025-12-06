// This file contains helper functions used by global store.

// ---------------------------------------------------------------
// Compute after-tax hourly rate.
// ---------------------------------------------------------------
export function computeNetHourly(hourlyRate, taxRate) {
  return hourlyRate * (1 - taxRate / 100);
}

// ---------------------------------------------------------------
// Given hoursWorked and bonus, compute net earnings.
// ---------------------------------------------------------------
export function computeEarnedMoney(hoursWorked, bonus, netHourlyRate) {
  const hoursMoney = hoursWorked * netHourlyRate;
  return hoursMoney + bonus;
}

// ---------------------------------------------------------------
// Apply income to list of goals in priority order.
// Completed goals (if any) extracted and returned separately.
// ---------------------------------------------------------------
export function allocateIncomeToGoals(goals, incomeAmount, netHourlyRate) {
  // Clone arrays to avoid data mutation.
  let remainingIncome = incomeAmount;
  let updatedGoals = goals.map(g => ({ ...g }));
  let completed = [];

  for (let goal of updatedGoals) {
    if (remainingIncome <= 0) break;

    // Compute remaining money required for goal.
    const needed = goal.targetAmount - goal.amountSaved;

    if (needed <= 0) {
      // Goal complete.
      continue;
    }

    if (remainingIncome >= needed) {
      // Enough income to finish goal.
      goal.amountSaved += needed;
      goal.hoursAccumulated += needed / netHourlyRate;
      remainingIncome -= needed;

      // Mark completed
      completed.push({
        id: goal.id,
        name: goal.name,
        // Completed date is determined by store, not this helper.
        completedDate: new Date().toISOString(),
        totalHours: goal.hoursAccumulated,
        totalMoney: goal.amountSaved,
      });
    } else {
      // Partial income applied to goal.
      goal.amountSaved += remainingIncome;
      goal.hoursAccumulated += remainingIncome / netHourlyRate;
      remainingIncome = 0;
      break;
    }
  }

  // Filter out completed goals (so store can move them)
  const activeGoals = updatedGoals.filter(
    g => !completed.some(c => c.id === g.id)
  );

  return {
    activeGoals,
    completedGoals: completed,
    leftoverIncome: remainingIncome,
  };
}

// ---------------------------------------------------------------
// Calculate hours needed for single goal.
// ---------------------------------------------------------------
export function computeHoursRemaining(goal, netHourlyRate) {
  const remainingMoney = goal.targetAmount - goal.amountSaved;
  if (remainingMoney <= 0) return 0;
  return remainingMoney / netHourlyRate;
}

// ---------------------------------------------------------------
// Produce array of cumulative hours remaining for each goal.
// ---------------------------------------------------------------
export function computeCumulativeHours(goals, netHourlyRate) {
  let cumulative = 0;
  return goals.map(goal => {
    const hoursForThisGoal = computeHoursRemaining(goal, netHourlyRate);
    cumulative += hoursForThisGoal;
    return cumulative;
  });
}