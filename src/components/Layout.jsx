import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Header from './Header';
import WorkEntryForm from './WorkEntryForm';
import GoalForm from './GoalForm';
import GoalList from './GoalList';
import CompletedGoals from './CompletedGoals';
import StatsPanel from './StatsPanel';
import ExImPanel from './ExImPanel';

export default function Layout() {
    return (
        <Container fluid className="app-container">
            <Row className="h-100 app-row">
                <Col className="app-column column-left p-4">
                    <Header />
                    <WorkEntryForm />
                    <GoalForm />
                </Col>
                <Col className="app-column column-center p-4">
                    <GoalList />
                </Col>
                <Col className="app-column column-right p-4">
                    <CompletedGoals />
                    <StatsPanel />
                    <ExImPanel />
                </Col>
            </Row>
        </Container>
    );
};