import { createLazyFileRoute } from "@tanstack/react-router";
import { ElementRef, useCallback, useMemo, useRef, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import {
  type FullProject,
  useDelete as useDeleteProject,
  useGetAll as useGetAllProjects,
} from "../../../api/project";
import Table from "../../../components/table";
import ProposalModal from "../../../components/admin/proposal-modal";

export const Route = createLazyFileRoute("/dashboard/admin/pfe-proposals")({
  component: RouteComponent,
});

function RouteComponent() {
  const ref = useRef<ElementRef<typeof ProposalModal>>(null);
  const [projectId, setProjectId] = useState<number | null>(null);

  const { mutateAsync: deleteProject } = useDeleteProject();
  const { data: projects } = useGetAllProjects();

  const proposals = useMemo(
    () => projects.filter((project) => project.status === "proposed"),
    [projects]
  );

  const onShow = useCallback((projectId: number = 0) => {
    ref.current?.show();
    setProjectId(projectId);
  }, []);

  const onClose = useCallback(() => {
    ref.current?.close();
    setProjectId(0);
  }, []);

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
        accessorKey: "id",
        header: "Actions",
        enableSorting: false,
        cell(props) {
          const projectId = props.getValue<number>();
          return (
            <Container as="div" style={{ display: "flex", gap: 5 }}>
              <Button
                type="button"
                variant="warning"
                size="sm"
                onClick={() => onShow(projectId)}
              >
                Update
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => {
                  const confirmation = window.confirm("Confirm delete action?");
                  if (confirmation) deleteProject(projectId);
                }}
              >
                Delete
              </Button>
            </Container>
          );
        },
      },
    ];
  }, [deleteProject, onShow]);

  return (
    <Container
      as="div"
      className=" mx-auto mt-2, mb-3"
      style={{ width: "95%", minHeight: "100vh" }}
    >
      <h2>PFE Proposals</h2>
      <Button variant="primary" className="mb-3" onClick={() => onShow()}>
        Create PFE Proposal
      </Button>
      <Table columns={columns} data={proposals} />
      <ProposalModal ref={ref} projectId={projectId ?? 0} onClose={onClose} />
    </Container>
  );
}
