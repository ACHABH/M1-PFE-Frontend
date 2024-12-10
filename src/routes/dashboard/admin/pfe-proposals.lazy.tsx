import { createLazyFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import type { Project } from "../../../types/db";
import AddPFEProposal from "../../../components/Admin/AddPFEProposal";
import { ColumnDef } from "@tanstack/react-table";
import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/esm/Button";
import { useDelete as useDeleteProject } from "../../../api/project";
import Table from "../../../components/table";

export const Route = createLazyFileRoute("/dashboard/admin/pfe-proposals")({
  component: RouteComponent,
});

function RouteComponent() {
  const { mutateAsync: deleteProject } = useDeleteProject();
  const [proposals, setProposals] = useState([
    {
      title: "AI Research",
      type: "Classic",
      description: "Exploring AI-based solutions for education.",
    },
    {
      title: "Robotics Design",
      type: "Innovative",
      description: "Creating robotic models for industrial automation.",
    },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddProposal = (/* newProposal: {
    title: string
    type: string
    description: string
  } */) => {
    // setProposals([...proposals, newProposal])
    setShowAddModal(false);
  };

  const handleDeleteProposal = (title: string) => {
    setProposals(proposals.filter((proposal) => proposal.title !== title));
  };

  const handleCancelProposal = () => {
    setShowAddModal(false);
  };

  const columns = useMemo<ColumnDef<Project>[]>(() => {
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
  }, [deleteProject]);


  return (
    <div
      className=" mx-auto mt-2, mb-3"
      style={{ width: "95%", minHeight: "100vh" }}
    >
      <h2>PFE Proposals</h2>
      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowAddModal(true)}
      >
        Add PFE Proposal
      </button>
      {/* <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {proposals.map((proposal, index) => (
            <tr key={index}>
              <td>{proposal.title}</td>
              <td>{proposal.type}</td>
              <td>{proposal.description}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteProposal(proposal.title)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}
      <Table columns={columns} data={proposals} />

      {showAddModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
          style={{ zIndex: 1050 }}
        >
          <AddPFEProposal
            onAdd={handleAddProposal}
            onCancel={handleCancelProposal}
          />
        </div>
      )}
    </div>
  );
}
