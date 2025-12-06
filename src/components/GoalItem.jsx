// This component represents one goal inside a sortable list of goals.
// Each goal includes:
//   - name
//   - progress bar
//   - cumulative hours remaining
//   - edit and delete controls
//   - drag handle to reorder priorities

import React, { useState } from 'react';
import { Card, ProgressBar, Button, Form, Modal } from 'react-bootstrap';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useStore } from '../store/useStore';

export default function GoalItem({ goal, cumulativeHours }) {
    // Pull delete and update methods from store.
    const reorderGoals = useStore(state => state.reorderGoals);
    const goals = useStore(state => state.goals);
    const setGoals = useStore.setState;

    const [showEdit, setShowEdit] = useState(false);
    const [editName, setEditName] = useState(goal.name);
    const [editTarget, setEditTarget] = useState(goal.targetAmount);

    // useSortable for drag-and-drop.
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: goal.id });

    // Inline style for smooth item movement during dragging.
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    // Handle deleting goal.
    const handleDelete = () => {
        const confirmed = window.confirm('Delete this goal permanently?');
        if (!confirmed) return;

        // Remove goal from state.
        const updated = goals.filter(g => g.id !== goal.id);

        // Reassign priorities to keep them sequential.
        const reprioritized = updated.map((g, idx) => ({
            ...g,
            priority: idx,
        }));

        setGoals({ goals: reprioritized });
        useStore.getState().persist();
    };

    // Handle saving edits.
    const handleEditSave = () => {
        const updated = goals.map(g => {
            if (g.id !== goal.id) return g;
            return {
                ...g,
                name: editName.trim(),
                targetAmount: parseFloat(editTarget || 0),
            };
        });

        // Reassign unchanged prios.
        setGoals({ goals: updated });
        useStore.getState().persist();

        setShowEdit(false);
    };

    return (
        <>
            <Modal show={showEdit} onHide={() => setShowEdit(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Goal</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Goal Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Target Amount ($)</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                value={editTarget}
                                onChange={e => setEditTarget(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEdit(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleEditSave}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Main goal item. */}
            <Card ref={setNodeRef} style={style} className="mb-3">
                <Card.Body className="d-flex align-items-center">
                    {/* Drag handle. */}
                    <div
                        {...attributes}
                        {...listeners}
                        style={{
                        cursor: 'grab',
                        padding: '0 10px',
                        fontSize: '1.4rem',
                        userSelect: 'none',
                        }}
                    >
                        ≡
                    </div>

                    {/* Goal info. */}
                    <div className="flex-grow-1">
                        <div className="d-flex justify-content-between">
                            <strong>{goal.name}</strong>
                            <span>
                                ${goal.amountSaved.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                            </span>
                        </div>

                        {/* Progress bar. */}
                        <ProgressBar
                            now={(goal.amountSaved / goal.targetAmount) * 100}
                            className="my-2"
                        />

                        {/* Cumulative hours remaining. */}
                        <div style={{ fontSize: '0.9rem', color: '#555' }}>
                            Hours Remaining (Cumulative): {cumulativeHours.toFixed(2)}
                        </div>
                    </div>

                    {/* Edit button. */}
                    <Button
                        variant="outline-primary"
                        size="sm"
                        className="ms-2"
                        onClick={() => setShowEdit(true)}
                    >
                        Edit
                    </Button>

                    {/* Delete button. */}
                    <Button
                        variant="outline-danger"
                        size="sm"
                        className="ms-2"
                        onClick={handleDelete}
                    >
                        ✕
                    </Button>
                </Card.Body>
            </Card>
        </>
    );
};
