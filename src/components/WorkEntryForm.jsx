// This component logs new work sessions. Each session consists of:
//   - hours worked (float)
//   - bonus money earned (float)
//
// When submitted, data goes thru store’s recordWork() method, which handles:
//   - converting hours to money
//   - applying income to goals
//   - updating stats
//   - saving to localStorage

import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { useStore } from '../store/useStore';

export default function WorkEntryForm() {
    const [hours, setHours] = useState('');
    const [bonus, setBonus] = useState('');

    // Pull action from store.
    const recordWork = useStore(state => state.recordWork);

    // Handle form submission.
    const handleSubmit = (e) => {
        e.preventDefault();

        // Convert text inputs to numeric values.
        const hoursFloat = parseFloat(hours || 0);
        const bonusFloat = parseFloat(bonus || 0);

        // Call store to record work session.
        recordWork(hoursFloat, bonusFloat);

        // Clear inputs after submitting.
        setHours('');
        setBonus('');
    };

    return (
        <Card className="mb-3">
            <Card.Body>
                <Card.Title>Log Work Entry</Card.Title>
                <Form onSubmit={handleSubmit}>
                    {/* Hours worked input. */}
                    <Form.Group className="mb-3">
                        <Form.Label>Hours Worked</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.1"
                            value={hours}
                            onChange={e => setHours(e.target.value)}
                        />
                    </Form.Group>

                    {/* Bonus input. */}
                    <Form.Group className="mb-3">
                        <Form.Label>Bonus ($)</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.01"
                            value={bonus}
                            onChange={e => setBonus(e.target.value)}
                        />
                    </Form.Group>

                    <Button type="submit" variant="primary">
                        Apply to Goals
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};
