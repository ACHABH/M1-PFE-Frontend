import { useState } from 'react'
import { createLazyFileRoute } from '@tanstack/react-router'
import Table from "../../../components/table";
import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import type { Project} from "../../../types/db";
import { Prettier } from "../../../types/util";


export const Route = createLazyFileRoute(
  '/dashboard/teacher/supervise-projects',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const [projects, setProjects] = useState([
    {
      title: 'AI Research',
      type: 'Classic',
      description: 'Exploring AI applications in education.',
      status: 'approved',
      id: 1,
    },
    {
      title: 'Robotics Design',
      type: 'Innovative',
      description: 'Creating robotic models for industrial automation.',
      status: 'approved',
      id: 2,
    },
    {
      title: 'Blockchain Security',
      type: 'Innovative',
      description: 'Developing secure blockchain algorithms.',
      status: 'assigned',
      id: 3,
    },
  ])

  const handleSelectProject = (title: string) => {
    setProjects(
      projects.map((project) =>
        project.title === title ? { ...project, status: 'Selected' } : project,
      ),
    )
    alert(`You have selected "${title}" for supervision.`)
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
            onClick={() => handleSelectProject(projects.title)}
          >
            Select
          </button>
          ) : null;
        },
      },
    ]
  }, []);

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
      <Table data={projects} columns={columns} />
    </div>
  )
}
