// This component creates new goals. A goal has:
//   - name
//   - target amount (total money needed to complete)
//
// When added, goal is assigned next priority index and starts w/ $0 saved.

import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { useStore } from '../store/useStore';

export default function GoalForm() {
    const [name, setName] = useState('');
    const [target, setTarget] = useState('');

    // Pull action from store.
    const addGoal = useStore(state => state.addGoal);

    // Handle form submission.
    const handleSubmit = (e) => {
        e.preventDefault();

        const targetFloat = parseFloat(target || 0);

        // Create goal using store.
        addGoal(name.trim(), targetFloat);

        // Clear form.
        setName('');
        setTarget('');
    };

    return (
        <Card className="mb-0">
            <Card.Body>
                <Card.Title>Create New Goal</Card.Title>

                <Form onSubmit={handleSubmit}>
                    {/* Goal name field. */}
                    <Form.Group className="mb-3">
                        <Form.Label>Goal Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </Form.Group>

                    {/* Target amount field. */}
                    <Form.Group className="mb-3">
                        <Form.Label>Target Amount ($)</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.01"
                            value={target}
                            onChange={e => setTarget(e.target.value)}
                        />
                    </Form.Group>

                    <Button type="submit" variant="success">
                        Add Goal
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};
