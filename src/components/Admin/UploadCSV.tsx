import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/esm/Form';
import Row from 'react-bootstrap/esm/Row';
import { XCircle } from 'react-bootstrap-icons';

interface UploadCSVProps {
    togglePage: () => void;
}

const UploadCSV: React.FC<UploadCSVProps> = (props) => {

    const style: React.CSSProperties = {
        display: "flex",
        flexDirection: "column",
        height: "fit-content",
        width: "30vw",
        margin: "auto",
        borderRadius: "20px",
        border: "1.5px solid #ccc",
        zIndex: "100",
    }

    return (
        <div style={style} className='bg-white shadow p-4'>
            <div>
                <p className="test-left">Upload a CSV file</p>
            </div>
            <Form>
                <div className='d-flex justify-content-between'>
                    <Form.Control
                        name="CSVfile"
                        type="file"
                        required
                        accept=".csv"
                        onChange={(e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) {
                                const fileType = file.type;
                                if (fileType !== 'text/csv') {
                                    alert('Please upload a valid CSV file.');
                                    e.target.value = ''; // Clear the input
                                    return;
                                } else {
                                    alert(`File ${file.name} uploaded! Users will be processed.`);
                                }
                            }
                        }}
                        style={{ width: "85%" }}
                    />
                    <Button className="btn-light text-danger" type="reset" style={{ border: "1.5px solid #ccc", borderRadius: "15px" }}>
                        <XCircle />
                    </Button>
                </div>
                <Container className='mt-3'>
                    <Row>
                        <Col className='text-center'>
                            <Button variant="primary" className='btn-oxford' type="submit" style={{ border: "1.5px solid #ccc", width: "60%", borderRadius: "15px" }}>
                                Create
                            </Button>
                        </Col>
                    </Row>
                    <Row className='mt-2'>
                        <Col className='text-center'>
                            <Button className="btn-light" type="reset" onClick={props.togglePage} style={{ padding: "0.5rem 1rem", width: "60%", border: "1.5px solid #ccc", borderRadius: "15px" }}>
                                Cancel
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </Form>
        </div>
    )
}

export default UploadCSV;
