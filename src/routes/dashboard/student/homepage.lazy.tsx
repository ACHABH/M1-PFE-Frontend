import { createLazyFileRoute } from "@tanstack/react-router";
import { Badge, Card, Col, Row } from "react-bootstrap";
import { useProfile } from "../../../api/user";
import { useSelectSql } from "../../../api/sql";

export const Route = createLazyFileRoute("/dashboard/student/homepage")({
  component: Component,
});

// const assignedProject = {
//   title: "AI-Based Health Diagnosis",
//   description:
//     "Using AI to predict and diagnose diseases based on health data",
//   timeLeft: "2025-6-08",
//   type: "1275",
//   status: "In Progress",
//   supervisor: "Dr. Sarah Johnson",
// };

function Component() {
  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
  } = useProfile();

  const {
    data: studentData,
    isLoading: isStudentLoading,
    isError: isStudentError,
    error: studentError,
  } = useSelectSql(`SELECT * FROM students WHERE user_id = ${user?.id};`);

  const {
    data: assignedProjectData
  } = useSelectSql(
    `SELECT * FROM projects WHERE status = 'assigned';`
  );

  const assignedProject = assignedProjectData?.data?.[0];
  const student = studentData?.data?.[0];

  if (isUserLoading || isStudentLoading) return <div>Loading...</div>;
  if (isUserError) return <div>Error: {userError.message}</div>;
  if (isStudentError) return <div>Error: {studentError.message}</div>;

  return (
    <div>
      <div className="mt-5 mb-5">
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
                  {user?.last_name?.charAt(0).toUpperCase()}
                  {user?.first_name?.charAt(0).toUpperCase()}
                </div>
                {/* Welcome Message */}
                <div className="text-start">
                  <Card.Title>
                    {user?.last_name} {user?.first_name}
                  </Card.Title>

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
                <strong>Specialty:</strong> {student?.major}
              </p>
              <p>
                <strong>Average:</strong> {student?.average_score}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {assignedProject && (
        <div className="mt-2">
          <h3>Your Assigned Project</h3>
          <p className="mb-4">Here is your assigned project.</p>
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
              {/* <p>
                <strong>Supervisor:</strong> {assignedProject.supervisor}
              </p>
              <p className="text-danger">
                <strong>Time Left:</strong> {assignedProject.timeLeft}
              </p> */}
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
}
