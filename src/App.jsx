import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Header from './components/Header';
import WorkEntryForm from './components/WorkEntryForm';
import GoalForm from './components/GoalForm';
import GoalList from './components/GoalList';
import CompletedGoals from './components/CompletedGoals';
import StatsPanel from './components/StatsPanel';
import ExportImportPanel from './components/ExportImportPanel';

import './styles/app.css';

export default function App() {
    return (
        <Container fluid className="app-container">
            <Row className="h-100 app-row">
                <Col
                    lg={3}
                    md={12}
                    className="app-column column-left"
                >
                    <Header />
                    <WorkEntryForm />
                    <GoalForm />
                </Col>
                <Col
                    lg={5}
                    md={12}
                    className="app-column column-center"
                >
                  <GoalList />
                </Col>
                <Col
                    lg={4}
                    md={12}
                    className="app-column column-right"
                >
                    <CompletedGoals />
                    <StatsPanel />
                    <ExportImportPanel />
                </Col>
            </Row>
        </Container>
    );
};