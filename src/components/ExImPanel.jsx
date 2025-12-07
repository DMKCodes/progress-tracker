// This component provides tools for backing up and restoring the entire
// application state using JSON. This allows me to:
//   - Export all data into a downloadable .json file
//   - Import previously saved data from a file
//   - Completely reset all data back to default values
//
// Because this application is for personal use, JSON import will
// completely overwrite the current state without merging.

import React from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { useStore } from '../store/useStore';

export default function ExportImportPanel() {
    const state = useStore();
    const importState = useStore(state => state.importState);
    const resetAll = useStore(state => state.resetAll);

    // ---------------------------------------------------------
    // Create downloadable JSON file containing full state.
    // ---------------------------------------------------------
    const handleExport = () => {
        const data = JSON.stringify(state, null, 2);

        // Create temporary blob file in memory.
        const blob = new Blob([data], { type: 'application/json' });

        // Create temporary download link.
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = url;
        a.download = 'progress-tracker-backup.json';

        a.click();

        // Cleanup.
        URL.revokeObjectURL(url);
    };

    // ---------------------------------------------------------
    // Load JSON file selected by user and overwrite state.
    // ---------------------------------------------------------
    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const newState = JSON.parse(event.target.result);
                // Replace existing state.
                importState(newState);
                alert('Import successful!');
            } catch (err) {
                alert('Error reading JSON file.');
            }
        };
        reader.readAsText(file);
    };

    // ---------------------------------------------------------
    // Reset existing state back to application default.
    // ---------------------------------------------------------
    const handleReset = () => {
        const confirmed = window.confirm('Reset ALL data? This cannot be undone.');
        if (!confirmed) return;
        resetAll();
    };

    return (
        <Card className="mb-0">
            <Card.Body>
                <Card.Title className="mb-3">Backup / Restore</Card.Title>

                {/* Export button. */}
                <Button variant="secondary" className="me-3" onClick={handleExport}>
                    Export JSON
                </Button>

                {/* Import button. */}
                <Form.Label
                    htmlFor="import-json"
                    className="btn btn-secondary me-3 mb-0"
                >
                    Import JSON
                </Form.Label>
                <Form.Control
                    id="import-json"
                    type="file"
                    accept="application/json"
                    style={{ display: 'none' }}
                    onChange={handleImport}
                />

                {/* Reset button. */}
                <Button variant="danger" onClick={handleReset}>
                    Reset All Data
                </Button>
            </Card.Body>
        </Card>
    );
};