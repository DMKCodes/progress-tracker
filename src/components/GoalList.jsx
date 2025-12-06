// This component renders the entire goal list.
// It's responsible for:
//   - creating DndContext
//   - making list sortable
//   - detecting when user reorders goals
//   - calling reorderGoals() from the store

import React from 'react';
import {
    DndContext,
    closestCenter,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable';
import { useStore } from '../store/useStore';
import { computeCumulativeHours, computeNetHourly } from '../utils/calculations';
import GoalItem from './GoalItem';

export default function GoalList() {
    const goals = useStore(state => state.goals);
    const reorderGoals = useStore(state => state.reorderGoals);

    const hourlyRate = useStore(state => state.hourlyRate);
    const taxRate = useStore(state => state.taxRate);

    // Sort goals by prio before rendering.
    const sortedGoals = [...goals].sort((a, b) => a.priority - b.priority);

    // Compute net hourly rate for hours remaining calculation.
    const netHourly = computeNetHourly(hourlyRate, taxRate);

    // Compute cumulative hours for each goal.
    const cumulativeHoursArr = computeCumulativeHours(sortedGoals, netHourly);

    // Extract array of IDs for sortable list.
    const goalIds = sortedGoals.map(g => g.id);

    // Handle drag-end event, check if position changed.
    const handleDragEnd = (event) => {
        const { active, over } = event;

        // If over = null, user dragged item outside list.
        if (!over) return;

        // If item dropped back in original position, ignore.
        if (active.id === over.id) return;

        // Find old and new indices inside sortedGoals array.
        const oldIndex = goalIds.indexOf(active.id);
        const newIndex = goalIds.indexOf(over.id);

        // Rearrange ID order.
        const newOrder = arrayMove(goalIds, oldIndex, newIndex);

        // Pass new ID order to store.
        reorderGoals(newOrder);
    };

    return (
        <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={goalIds}
                strategy={verticalListSortingStrategy}
            >
                {sortedGoals.map((goal, idx) => (
                    <GoalItem
                        key={goal.id}
                        goal={goal}
                        cumulativeHours={cumulativeHoursArr[idx]}
                    />
                ))}
            </SortableContext>
        </DndContext>
    );
};
