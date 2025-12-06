// This component provides simple controls for managing hourly rate and tax rate used throughout
// the entire app. Values automatically saved  through the Zustand store.

import React from 'react';
import { Card, Form } from 'react-bootstrap';
import { useStore } from '../store/useStore';

export default function Header() {
    // Pull current values and update functions from store.
    const hourlyRate = useStore(state => state.hourlyRate);
    const taxRate = useStore(state => state.taxRate);
    const setHourlyRate = useStore(state => state.setHourlyRate);
    const setTaxRate = useStore(state => state.setTaxRate);

    return (
        <Card className="mb-3">
            <Card.Body>
                <Card.Title>Income Settings</Card.Title>
                <Form>
                    {/* Hourly rate input. */}
                    <Form.Group className="mb-3">
                        <Form.Label>Hourly Rate ($)</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.01"
                            value={hourlyRate}
                            onChange={e => setHourlyRate(parseFloat(e.target.value || 0))}
                        />
                    </Form.Group>

                    {/* Tax rate input. */}
                    <Form.Group>
                        <Form.Label>Tax Rate (%)</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.1"
                            value={taxRate}
                            onChange={e => setTaxRate(parseFloat(e.target.value || 0))}
                        />
                    </Form.Group>
                </Form>
            </Card.Body>
        </Card>
    );
}