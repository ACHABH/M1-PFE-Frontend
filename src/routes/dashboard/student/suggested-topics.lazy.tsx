import { createLazyFileRoute } from "@tanstack/react-router";
import {
  Card,
  Row,
  Col,
  Badge,
  Button,
  Modal,
  Form,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useState } from "react";
import { useSelectSql } from "../../../api/sql";

export const Route = createLazyFileRoute("/dashboard/student/suggested-topics")(
  {
    component: Component,
  }
);

function Component() {
  // Fetching topics from the database
  const { data, isLoading, error } = useSelectSql(
    `SELECT id, title, description, type FROM projects WHERE status = 'approved'`
  );

  // State Management
  const [selectedTopics, setSelectedTopics] = useState<number[]>([]); // Track selected topic IDs
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [binomeEmail, setBinomeEmail] = useState<string>(""); // Binome email

  const handleSelectTopic = (topicId: number) => {
    if (selectedTopics.includes(topicId)) {
      setSelectedTopics((prev) => prev.filter((id) => id !== topicId)); // Deselect
    } else if (selectedTopics.length < 10) {
      setSelectedTopics((prev) => [...prev, topicId]); // Select up to 10 topics
    } else {
      alert("You can select up to 10 topics.");
    }
  };

  const handleConfirmSelection = () => {
    setShowModal(true);
  };

  const handleSubmitBinome = () => {
    console.log("Selected Topics:", selectedTopics);
    console.log("Binome Email:", binomeEmail);
    setShowModal(false);
  };

  if (isLoading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">Error fetching topics.</Alert>;

  return (
    <div>
      <div className="mb-4 d-flex align-items-center justify-content-between">
        <div>
          <h2>Suggested Topics</h2>
          <p>Select up to 10 topics for your project.</p>
          {selectedTopics.length > 0 && (
            <Alert variant="info">
              You have selected {selectedTopics.length} topic(s).
            </Alert>
          )}
        </div>
        {selectedTopics.length > 0 && (
          <Button variant="success" onClick={handleConfirmSelection}>
            Add Binome
          </Button>
        )}
      </div>
      <Row className="gy-4">
        {data.map((topic: any) => (
          <Col md={6} key={topic.id}>
            <Card
              className={`h-100 shadow-sm ${
                selectedTopics.includes(topic.id) ? "border-primary" : ""
              }`}
            >
              <Card.Body>
                <Card.Title>{topic.title}</Card.Title>
                <Card.Text className="text-muted">
                  {topic.description}
                </Card.Text>
                <Card.Subtitle className="mb-2 text-muted">
                  {topic.teacher}
                </Card.Subtitle>
                <Badge
                  bg={topic.type === "1275" ? "success" : "secondary"}
                  className="mb-2"
                >
                  {topic.type}
                </Badge>
                <div className="text-center mt-3">
                  <Button
                    variant={
                      selectedTopics.includes(topic.id) ? "danger" : "primary"
                    }
                    onClick={() => handleSelectTopic(topic.id)}
                  >
                    {selectedTopics.includes(topic.id) ? "Deselect" : "Select"}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal for Binome Selection */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Binome Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="binomeEmail">
              <Form.Label>Enter Binome Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter binome's email"
                value={binomeEmail}
                onChange={(e) => setBinomeEmail(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmitBinome}>
            Send Request
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}