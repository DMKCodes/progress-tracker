// This component displays all completed goals for data tracking.
// Each completed goal moves into "completedGoals" array when it reached its target amount through income allocation.
// Data referenced is:
//   - Goal name
//   - Date completed
//   - Total hours worked toward goal
//   - Total money allocated

import React from 'react';
import { Card, Table } from 'react-bootstrap';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';

export default function CompletedGoals() {
    const completedGoals = useStore(state => state.completedGoals);

    return (
        <>
            <h3>History</h3>
            <Card className="mb-3">
                <Card.Body>
                    <Card.Title>Completed Goals</Card.Title>

                    {completedGoals.length === 0 ? (
                        <div style={{ color: '#555' }}>No goals completed. Keep going!</div>
                    ) : (
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr>
                                    <th>Goal Name</th>
                                    <th>Date Completed</th>
                                    <th>Total Hours</th>
                                    <th>Total Money</th>
                                </tr>
                            </thead>

                            <tbody>
                                {completedGoals.map(goal => (
                                    <tr key={goal.id}>
                                        <td>{goal.name}</td>
                                        <td>{format(new Date(goal.completedDate), 'yyyy-MM-dd')}</td>
                                        <td>{goal.totalHours.toFixed(2)}</td>
                                        <td>${goal.totalMoney.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
        </>
    );
};
