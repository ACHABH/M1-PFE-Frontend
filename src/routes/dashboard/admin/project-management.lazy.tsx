import type { ColumnDef } from "@tanstack/react-table";
import {
  type ProjectStatus,
  PROJECT_STATUS,
} from "../../../constant/enum";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";
import Table from "../../../components/table";
import {
  type FullProject,
  useGetAll as useGetAllProjects,
  useReject as useRejectProject,
  useValidate as useValidateProject,
} from "../../../api/project";
import { useGetAll as useGetAllUsers } from "../../../api/user";

export const Route = createLazyFileRoute("/dashboard/admin/project-management")(
  {
    component: RouteComponent,
  }
);

function RouteComponent() {
  const { data: users } = useGetAllUsers();

  const { data: projects } = useGetAllProjects();
  const { mutateAsync: validateProject } = useValidateProject();
  const { mutateAsync: rejectProject } = useRejectProject();

  const [status, setStatus] = useState<ProjectStatus | null>(null);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      return (
        status === null || project.status.toLowerCase() === status.toLowerCase()
      );
    });
  }, [status, projects]);

  const columns = useMemo<ColumnDef<FullProject>[]>(() => {
    return [
      {
        accessorKey: "title",
        header: "Title",
        enableSorting: true,
        cell: (props) => props.getValue(),
      },
      {
        accessorKey: "type",
        header: "Type",
        enableSorting: true,
        cell: (props) => props.getValue(),
      },
      {
        accessorKey: "description",
        header: "Description",
        enableSorting: true,
        cell: (props) => props.getValue(),
      },
      {
        header: "Submitted By",
        enableSorting: true,
        cell(props) {
          const project = props.row.original;
          const admin = users.find((user) => {
            return user.id === project?.project_proposition?.validated_by;
          });
          return admin ? `${admin.first_name} ${admin.last_name}` : null;
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        enableSorting: true,
        cell(props) {
          const status = props.getValue<ProjectStatus>();
          return (
            <Badge as="span" className="bg-info">
              {status}
            </Badge>
          );
        },
      },
      {
        header: "Actions",
        enableSorting: false,
        cell(props) {
          const project = props.row.original;
          return project?.project_proposition?.status !== "validated" ? (
            <Container
              as="div"
              style={{
                display: "flex",
                gap: 5,
              }}
            >
              <Button
                variant="success"
                size="sm"
                onClick={() => validateProject(project.id)}
              >
                Validate
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={async () => {
                  const feedback = window.prompt("Feedback", "")!;
                  await rejectProject({
                    id: project.id,
                    body: { feedback },
                  });
                }}
              >
                Reject
              </Button>
            </Container>
          ) : null;
        },
      },
    ];
  }, [rejectProject, users, validateProject]);

  return (
    <Container
      as="div"
      className="mx-auto mt-4"
      style={{ width: "95%", minHeight: "100vh" }}
    >
      <h2>Project Management</h2>
      <Container as="div" className="mb-3">
        <Form.Label className="me-2">Filter by Status:</Form.Label>
        <Form.Select
          className="w-auto d-inline"
          value={status ?? ""}
          onChange={(e) => setStatus((e.target.value as ProjectStatus) || null)}
        >
          <option value="">All</option>
          {PROJECT_STATUS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </Form.Select>
      </Container>
      <Table columns={columns} data={filteredProjects} />
    </Container>
  );
}
