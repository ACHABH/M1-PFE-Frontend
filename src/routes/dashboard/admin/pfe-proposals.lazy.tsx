import type { ColumnDef } from "@tanstack/react-table";
import { createLazyFileRoute } from "@tanstack/react-router";
import { ElementRef, useCallback, useMemo, useRef, useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Badge from "react-bootstrap/Badge";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import {
  type FullProject,
  useDelete as useDeleteProject,
  useGetAll as useGetAllProjects,
} from "../../../api/project";
import Table from "../../../components/Table";
import ProposalModal from "../../../components/admin/proposal-modal";
import { useTheme } from "../../../contexts/theme";

export const Route = createLazyFileRoute("/dashboard/admin/pfe-proposals")({
  component: Component,
});

function Component() {
  const ref = useRef<ElementRef<typeof ProposalModal>>(null);
  const [projectId, setProjectId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("");
  const { theme } = useTheme() ?? { theme: 'light' };

  const { mutateAsync: deleteProject } = useDeleteProject();
  const { data: projects, isLoading } = useGetAllProjects();

  const proposals = useMemo(
    () => projects?.filter((project) => project.status === "approved" || project.status === "proposed") ?? [],
    [projects]
  );

  const filteredProposals = useMemo(() => {
    return proposals.filter(
      (proposal) =>
        (filterType === "" || proposal.type === filterType) &&
        (proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
         proposal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
         proposal.type.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [proposals, searchTerm, filterType]);

  const uniqueTypes = useMemo(() => {
    return Array.from(new Set(proposals.map((p) => p.type)));
  }, [proposals]);

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
        cell: (props) => (
          <div className="fw-medium text-primary">{props.getValue<string>()}</div>
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
        enableSorting: true,
        cell: (props) => (
          <Badge bg="info" className="text-uppercase">
            {props.getValue<string>()}
          </Badge>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        enableSorting: true,
        cell: (props) => (
          <div className="text-muted" style={{ maxWidth: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {props.getValue<string>()}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        enableSorting: true,
        cell: (props) => {
          const status = props.getValue<string>();
          const bgColor = status === "approved" ? "success" : "warning";
          return (
            <Badge bg={bgColor} className="text-uppercase">
              {status}
            </Badge>
          );
        },
      },
      {
        accessorKey: "id",
        header: "Actions",
        enableSorting: false,
        cell(props) {
          const projectId = props.getValue<number>();
          return (
            <div className="d-flex gap-2">
              <Button
                type="button"
                variant="outline-warning"
                size="sm"
                onClick={() => onShow(projectId)}
                className="d-flex align-items-center gap-1"
              >
                <FaEdit /> Edit
              </Button>
              <Button
                type="button"
                variant="outline-danger"
                size="sm"
                onClick={() => {
                  const confirmation = window.confirm("Confirm delete action?");
                  if (confirmation) deleteProject(projectId);
                }}
                className="d-flex align-items-center gap-1"
              >
                <FaTrash /> Delete
              </Button>
            </div>
          );
        },
      },
    ];
  }, [deleteProject, onShow]);

  return (
    <Container fluid className="px-4 py-3">
      <Card className={`shadow-sm border-0 ${theme === 'dark' ? 'bg-dark' : ''}`}>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h3 mb-0">PFE Proposals</h2>
            <Button
              variant="primary"
              onClick={() => onShow()}
              className="d-flex align-items-center gap-2"
            >
              <FaPlus /> Create Proposal
            </Button>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-8">
              <InputGroup>
                <InputGroup.Text className={theme === 'dark' ? 'bg-dark border-secondary' : 'bg-white'}>
                  <FaSearch className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by title, description, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={theme === 'dark' ? 'bg-dark border-secondary' : ''}
                />
              </InputGroup>
            </div>
            <div className="col-md-4">
              <Form.Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className={theme === 'dark' ? 'bg-dark border-secondary' : ''}
              >
                <option value="">All Types</option>
                {uniqueTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </Form.Select>
            </div>
          </div>

          <div className="table-responsive">
            <Table
              columns={columns}
              data={filteredProposals}
              isLoading={isLoading}
            />
          </div>
        </Card.Body>
      </Card>

      <ProposalModal ref={ref} projectId={projectId ?? 0} onClose={onClose} />
    </Container>
  );
}
