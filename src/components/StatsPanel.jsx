// This component shows lifetime statistics to give a quick overview of total work and income.
// Numbers here accumulate over entire lifespan of app unless reset.
//
// Stats displayed:
//   - Total hours worked
//   - Total money earned
//   - Total goals completed

import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import { useStore } from '../store/useStore';

export default function StatsPanel() {
    const stats = useStore(state => state.stats);

    return (
        <Card className="mb-3">
            <Card.Body>
                <Card.Title>Lifetime Stats</Card.Title>

                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <strong>Total Hours Worked:</strong> {stats.lifetimeHoursWorked.toFixed(2)}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <strong>Total Money Earned:</strong> ${stats.lifetimeMoneyEarned.toFixed(2)}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <strong>Goals Completed:</strong> {stats.lifetimeGoalsCompleted}
                    </ListGroup.Item>
                </ListGroup>
            </Card.Body>
        </Card>
    );
};
