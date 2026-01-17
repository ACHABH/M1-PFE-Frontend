import { createLazyFileRoute } from '@tanstack/react-router'
import Table from "../../../components/Table";
import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import type { Project} from "../../../types/db";
import { Prettier } from "../../../types/util";
import { sql, useSelectSql  } from "../../../api/sql.ts";
import { useAuth } from "../../../api/auth";

export const Route = createLazyFileRoute(
  '/dashboard/teacher/supervise-projects',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const query = `SELECT * FROM projects WHERE status = 'approved'`;
  const { data, error, isLoading, refetch } = useSelectSql(query);
  

  const user = useAuth((user) => {
    if (user) return;
  });

  const handleSelectProject = (id: number, title: string) => {
    try{
      const updateQuery = `UPDATE projects SET status = 'assigned' WHERE id = ${id}`;
      const result = sql("update",updateQuery);
      console.log("Project Assigned: ",result);
      const setSupervisorQuery = `INSERT INTO project_supervisors (project_id, teacher_id, role) VALUES (${id}, ${user?.id}, 'SUPERVISOR')`;
      const result2 = sql("insert",setSupervisorQuery);
      console.log("Project Assigned: ",result2);
      alert(`You have selected "${title}" for supervision.`);
      refetch();
    }catch (error) {
      console.error("Error submitting proposal:", error);
    }
  }

  type Supervise = Prettier<Project>;

  const columns = useMemo<ColumnDef<Supervise>[]>(() => {
    return [
      {
        header: 'Title',
        accessorKey: 'title',
        enableSorting: true,
        cell: (props) => props.getValue(),
      },
      {
        header: 'Type',
        accessorKey: 'type',
        enableSorting: true,
        cell: (props) => props.getValue(),
      },
      {
        header: 'Description',
        accessorKey: 'description',
        enableSorting: true,
        cell: (props) => props.getValue(),
      },
      {
        header: 'Status',
        accessorKey: 'status',
        enableSorting: true,
        cell: (props) => {
          const status = props.getValue();
          return status === 'approved' ? 'Available' : status === 'assigned' ? 'Selected' : status;
        },
      },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: (props) => {
          const projects = props.row.original;
          return projects.status === "approved" ? (
          <button
            className="btn btn-success btn-sm"
            onClick={() => handleSelectProject(projects.id, projects.title)}
          >
            Select
          </button>
          ) : null;
        },
      },
    ]
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div className="container mt-4">
      <h3>Supervise Project</h3>
      <h6 className='my-3 text-secondary'>Select Project You Want To Supervise</h6>
      {/* <div style={{overflowX:"auto"}}>
        <table className="table table-bordered table-striped" style={{whiteSpace:"nowrap"}}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Proposer</th>
              <th>Type</th>
              <th>description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, index) => (
              <tr key={index}>
                <td>{project.title}</td>
                <td>{project.proposer}</td>
                <td>{project.type}</td>
                <td>{project.description}</td>
                <td>
                  <span
                    className={`badge ${
                      project.status === 'Available'
                        ? 'bg-success'
                        : 'bg-secondary'
                    }`}
                  >
                    {project.status}
                  </span>
                </td>
                <td>
                  {project.status === 'Available' && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleSelectProject(project.title)}
                    >
                      Select
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
      <Table data={data?.data} columns={columns} />
    </div>
  )
}
