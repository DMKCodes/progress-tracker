// This file defines global state w/ Zustand.
// Store manages:
//  - custom settings (hourlyRate, taxRate)
//  - active goals
//  - completed goals
//  - lifetime statistics
//  - actions for updating, saving, loading data

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { loadState, saveState } from '../utils/persistence';
import {
  computeNetHourly,
  computeEarnedMoney,
  allocateIncomeToGoals,
} from '../utils/calculations';

// Key to save app state. Not secure as app is not intended for distribution.
const STORAGE_KEY = 'progress-tracker-state';

// ------------------------------------------------------------
// Default state used if nothing exists in localStorage.
// ------------------------------------------------------------
const defaultState = {
  hourlyRate: 25,
  taxRate: 20,

  goals: [],

  completedGoals: [],

  stats: {
    lifetimeHoursWorked: 0,
    lifetimeMoneyEarned: 0,
    lifetimeGoalsCompleted: 0,
  },
};

// ------------------------------------------------------------
// Zustand store
// ------------------------------------------------------------
export const useStore = create((set, get) => ({
  // ----------------------------------------------------------
  // Attempt to load initial state from localStorage, otherwise default.
  // ----------------------------------------------------------
  ...(() => {
    const saved = loadState(STORAGE_KEY);
    return saved ? saved : defaultState;
  })(),

  // ----------------------------------------------------------
  // Save current state to localStorage.
  // ----------------------------------------------------------
  persist: () => {
    const state = get();
    saveState(STORAGE_KEY, state);
  },

  // ----------------------------------------------------------
  // Update hourly rate.
  // ----------------------------------------------------------
  setHourlyRate: (rate) => {
    set({ hourlyRate: rate });
    get().persist();
  },

  // ----------------------------------------------------------
  // Update tax rate.
  // ----------------------------------------------------------
  setTaxRate: (rate) => {
    set({ taxRate: rate });
    get().persist();
  },

  // ----------------------------------------------------------
  // Add new goal.
  // ----------------------------------------------------------
  addGoal: (name, targetAmount) => {
    const goals = get().goals;

    const newGoal = {
      id: uuidv4(),
      name,
      targetAmount,
      amountSaved: 0,
      hoursAccumulated: 0,
      completedDate: null,
      priority: goals.length, // last position
    };

    set({
      goals: [...goals, newGoal],
    });

    get().persist();
  },

  // ----------------------------------------------------------
  // Reorder goals w/ drag-and-drop UI.
  // Accepts array of goal IDs in new order.
  // ----------------------------------------------------------
  reorderGoals: (orderedIds) => {
    const goals = get().goals;

    // Rebuild array in order given by orderedIds.
    const reordered = orderedIds.map((id, index) => {
      const goal = goals.find(g => g.id === id);
      return { ...goal, priority: index };
    });

    set({ goals: reordered });
    get().persist();
  },

  // ----------------------------------------------------------
  // Record hours worked and bonuses, apply income to goals,
  // update stats, move completed goals, etc.
  // ----------------------------------------------------------
  recordWork: (hoursWorked, bonus) => {
    const state = get();

    // Compute net hourly rate.
    const netHourly = computeNetHourly(
      state.hourlyRate,
      state.taxRate
    );

    // Convert worked hours + bonus into earned money.
    const earnedMoney = computeEarnedMoney(
      hoursWorked,
      bonus,
      netHourly
    );

    // Apply income to goals in prio order.
    const sortedGoals = [...state.goals].sort(
      (a, b) => a.priority - b.priority
    );

    const {
      activeGoals,
      completedGoals,
    } = allocateIncomeToGoals(sortedGoals, earnedMoney, netHourly);

    // Update lifetime stats.
    const updatedStats = {
      lifetimeHoursWorked: state.stats.lifetimeHoursWorked + hoursWorked,
      lifetimeMoneyEarned: state.stats.lifetimeMoneyEarned + earnedMoney,
      lifetimeGoalsCompleted:
        state.stats.lifetimeGoalsCompleted + completedGoals.length,
    };

    // Merge new completed goals w/ existing.
    const newCompleted = [
      ...state.completedGoals,
      ...completedGoals,
    ];

    // Save to store.
    set({
      goals: activeGoals,
      completedGoals: newCompleted,
      stats: updatedStats,
    });

    get().persist();
  },

  // ----------------------------------------------------------
  // Replace app state with imported data.
  // Used for JSON import.
  // ----------------------------------------------------------
  importState: (newState) => {
    set(newState);
    saveState(STORAGE_KEY, newState);
  },

  // ----------------------------------------------------------
  // Clear all data and restore defaults.
  // ----------------------------------------------------------
  resetAll: () => {
    set(defaultState);
    saveState(STORAGE_KEY, defaultState);
  },
}));
