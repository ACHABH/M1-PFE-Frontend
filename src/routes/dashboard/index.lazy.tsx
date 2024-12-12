import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { STUDENT_MAJOR, TEACHER_GRADE } from "../../constant/enum";
import { useAuth } from "../../api/auth";

export const Route = createLazyFileRoute("/dashboard/")({
  component: Component,
});

function Component() {
  const user = useAuth();
  const [editProfile, setEditProfile] = useState(true);

  return (
    <Container
      as="div"
      className="component-bg p-3 mx-auto mt-4 rounded shadow"
    >
      <h3>Profile</h3>
      <Container className="d-flex justify-content-between flex-wrap p-2">
        <p>View and edit your profile</p>
        <Button variant="primary" onClick={() => setEditProfile(!editProfile)}>
          Edit
        </Button>
      </Container>
      <Form>
        <Form.Group className="mb-3" controlId="fName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ahmed"
            disabled={editProfile}
            readOnly={editProfile}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="lName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Family"
            disabled={editProfile}
            readOnly={editProfile}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="name@example.com"
            disabled
            readOnly
          />
        </Form.Group>
        {user?.role === "student" && (
          <>
            <Form.Group className="mb-3" controlId="avgScore">
              <Form.Label>Average Score</Form.Label>
              <Form.Control type="text" placeholder="14" disabled readOnly />
            </Form.Group>
            <Form.Select
              className="mb-3"
              disabled={editProfile}
              // readOnly={editProfile}
            >
              {STUDENT_MAJOR.map((major) => (
                <option key={major} value={major}>
                  {major}
                </option>
              ))}
            </Form.Select>
          </>
        )}
        {user?.role === "teacher" && (
          <>
            <Form.Group className="mb-3" controlId="recruitmentDate">
              <Form.Label>Recruitment Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="YYYY-MM-DD"
                disabled
                readOnly
              />
            </Form.Group>
            <Form.Select
              className="mb-3"
              disabled={editProfile}
              // readOnly={editProfile}
            >
              {TEACHER_GRADE.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </Form.Select>
          </>
        )}
        {user?.role === "company" && (
          <>
            <Form.Group className="mb-3" controlId="companyName">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Company Name"
                disabled={editProfile}
                readOnly={editProfile}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="companyNumber">
              <Form.Label>Company Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Company Number"
                disabled={editProfile}
                readOnly={editProfile}
              />
            </Form.Group>
          </>
        )}
        <Button variant="primary" type="submit" disabled={editProfile}>
          Save
        </Button>
      </Form>
    </Container>
  );
}
