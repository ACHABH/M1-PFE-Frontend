import { Card, Button, Col, Row, ListGroup, Badge } from "react-bootstrap";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/dashboard/company/homepage")({
  component: Component,
});

const Data = {
  companyName: "Tech Innovators Inc.",
  totalProposed: 15,
  pendingProposed: 5,
  popularSpecialty: "GL",
  recentTopics: [
    {
      id: 1,
      title: "AI-Powered Health Diagnosis",
      status: "Pending",
    },
    {
      id: 2,
      title: "Blockchain for Secure Transactions",
      status: "Accepted",
    },
    {
      id: 3,
      title: "IoT for Smart Cities",
      status: "Pending",
    },
  ],
};

function Component() {
  const {
    companyName,
    totalProposed,
    pendingProposed,
    popularSpecialty,
    recentTopics,
  } = Data;

  return (
    <div className="container mt-4">
      <div className="mb-5">
        <h2>Welcome, {companyName}!</h2>
        <p className="text-muted">Here's an overview of your activity.</p>
      </div>

      {/* Summary Section */}
      <Row className="mb-5">
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>Total Proposed Topics</Card.Title>
              <h3>{totalProposed}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>Pending Topics</Card.Title>
              <h3>{pendingProposed}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>Popular Specialty</Card.Title>
              <h3>{popularSpecialty}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Recent Topics</h4>
        <div>
          <Button variant="primary" className="me-2" size="sm">
            Propose New Topic
          </Button>
          <Button variant="outline-secondary" size="sm">
            View All Topics
          </Button>
        </div>
      </div>

      {/* Recent Topics */}
      <ListGroup>
        {recentTopics.map((topic) => (
          <ListGroup.Item
            key={topic.id}
            className="d-flex justify-content-between align-items-center"
          >
            <span>{topic.title}</span>
            <Badge bg={topic.status === "Accepted" ? "success" : "warning"}>
              {topic.status}
            </Badge>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}
