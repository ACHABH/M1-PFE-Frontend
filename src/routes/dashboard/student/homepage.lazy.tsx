import { createLazyFileRoute } from "@tanstack/react-router";
import { Badge, Button, Card, Col, Row } from "react-bootstrap";

export const Route = createLazyFileRoute("/dashboard/student/homepage")({
  component: Component,
});

const profile = {
  name: "Houari Yacine",
  initials: "HY",
  specialty: "GL",
  average: "16.9",
};

const assignedProject = {
  title: "AI-Based Health Diagnosis",
  description:
    "Using AI to predict and diagnose diseases based on health data.",
  timeLeft: "2025-6-08",
  type: "1275",
  status: "In Progress",
  supervisor: "Dr. Sarah Johnson",
};

function Component() {
  return (
    <div>
      <div className="mb-5">
        <h2>Welcome to the Homepage</h2>
      </div>
      <Row className="mt-4">
        <Col md={6}>
          {/* Welcome Card */}
          <Card className="text-center">
            <Card.Body>
              <div className="d-flex align-items-center">
                {/* Placeholder for avatar */}
                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                  style={{ width: "50px", height: "50px" }}
                >
                  {profile.initials}
                </div>
                {/* Welcome Message */}
                <div className="text-start">
                  <Card.Title>{profile.name}</Card.Title>
                  <Button
                    variant="link"
                    className="p-0"
                    onClick={() => {
                      console.log("Logout clicked");
                    }}
                  >
                    Sign out
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="profile-overview mb-4">
            <Card.Body>
              <Card.Title className="h6 mb-3 text-center">
                Profile Overview
              </Card.Title>
              <p className="mb-2">
                <strong>Specialty:</strong> {profile.specialty}
              </p>
              <p>
                <strong>Average:</strong> {profile.average}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <div className="mt-2">
        {/* <h3>Your Assigned Project</h3> */}
        <h3>Your Assigned Project</h3>
        <p className="mb-4">
          Here is your assigned project.
        </p>
        <Card className="mt-3">
          <Card.Body>
            <Card.Title>{assignedProject.title}</Card.Title>
            <Badge
              bg={assignedProject.type === "1275" ? "success" : "secondary"}
            >
              {assignedProject.type}
            </Badge>
            <p className="mt-3">{assignedProject.description}</p>
            <p>
              <strong>Status:</strong> {assignedProject.status}
            </p>
            <p>
              <strong>Supervisor:</strong> {assignedProject.supervisor}
            </p>
            <p className="text-danger">
              <strong>Time Left:</strong> {assignedProject.timeLeft}
            </p>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
