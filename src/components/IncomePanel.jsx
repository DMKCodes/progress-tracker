// This component provides simple controls for managing hourly rate and tax rate used throughout the entire app. Values automatically saved thru store.

import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { useStore } from '../store/useStore';

export default function IncomePanel() {
    // Pull current values and update functions from store.
    const hourlyRate = useStore(state => state.hourlyRate);
    const taxRate = useStore(state => state.taxRate);
    const setHourlyRate = useStore(state => state.setHourlyRate);
    const setTaxRate = useStore(state => state.setTaxRate);

    const [editing, setEditing] = useState(false);
    const [tempHourly, setTempHourly] = useState(hourlyRate);
    const [tempTax, setTempTax] = useState(taxRate);

    // Save changes and lock fields.
    const handleSave = () => {
        setHourlyRate(parseFloat(tempHourly || 0));
        setTaxRate(parseFloat(tempTax || 0));
        setEditing(false);
    };

    // Cancel edits and restore previous values.
    const handleCancel = () => {
        setTempHourly(hourlyRate);
        setTempTax(taxRate);
        setEditing(false);
    };

    return (
        <>
            <h3>Manage</h3>
            <Card className="mb-3">
                <Card.Body>
                    <Card.Title className="d-flex justify-content-between align-items-center">
                        <span>Income Settings</span>

                        {/* Toggle lock/unlock. */}
                        {!editing ? (
                            <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => setEditing(true)}
                            >
                                Edit Rates
                            </Button>
                        ) : (
                            <div>
                                <Button
                                    variant="success"
                                    size="sm"
                                    className="me-2"
                                    onClick={handleSave}
                                >
                                    Save
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </Card.Title>

                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Hourly Rate ($)</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                value={tempHourly}
                                disabled={!editing}
                                onChange={e => setTempHourly(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Tax Rate (%)</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.1"
                                value={tempTax}
                                disabled={!editing}
                                onChange={e => setTempTax(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>
        </>
    );
};