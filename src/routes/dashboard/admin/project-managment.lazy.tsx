import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import Table from "../../../components/table";
import type { Project, ProjectProposition, Teacher, User } from "../../../types/db";
import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Prettier } from "../../../types/util";

export const Route = createLazyFileRoute('/dashboard/admin/project-managment')({
  component: RouteComponent,
})

function RouteComponent() {
  // const [projects, setProjects] = useState([
  //   {
  //     title: 'AI Research',
  //     type: 'Classic',
  //     description: 'Exploring AI-based solutions for education.',
  //     status: 'Pending',
  //     submittedBy: 'Dr. Jane Doe',
  //   },
  //   {
  //     title: 'Robotics Design',
  //     type: 'Innovative',
  //     description: 'Creating robotic models for industrial automation.',
  //     status: 'Pending',
  //     submittedBy: 'John Smith',
  //   },
  //   {
  //     title: 'Blockchain Security',
  //     type: 'Innovative',
  //     description: 'Developing secure blockchain algorithms.',
  //     status: 'Validated',
  //     submittedBy: 'Dr. Alice Green',
  //   },
  //   {
  //     title: 'IoT Applications',
  //     type: 'Classic',
  //     description: 'Building IoT frameworks for smart homes.',
  //     status: 'Rejected',
  //     submittedBy: 'Mark Brown',
  //   },
  // ])

const [projects, setProjects] = useState<Project[]>([]);

useEffect(() => {
  const exampleProjects = [];
  for (let i = 1; i <= 100; i++) {
    exampleProjects.push({
      title: `Project ${i}`,
      type: i % 2 === 0 ? 'Classic' : 'Innovative',
      description: `Description for project ${i}`,
      status: i % 4 === 0 ? 'Validated' : i % 3 === 0 ? 'Rejected' : 'Pending',
      submittedBy: `User ${i}`,
    });
  }
  setProjects(exampleProjects);
}, []);

  const [filterStatus, setFilterStatus] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  // Filter Projects
  const filteredProjects = projects.filter(
    (project) => filterStatus === 'All' || project.status === filterStatus,
  )

  // Pagination
  // const totalPages = Math.ceil(filteredProjects.length / itemsPerPage)
  // const paginatedProjects = filteredProjects.slice(
  //   (currentPage - 1) * itemsPerPage,
  //   currentPage * itemsPerPage,
  // )

  const handleValidate = (title: string) => {
    if (window.confirm(`Are you sure you want to validate "${title}"?`)) {
      setProjects(
        projects.map((project) =>
          project.title === title
            ? { ...project, status: 'Validated' }
            : project,
        ),
      )
      alert(`Project "${title}" has been validated.`)
    }
  }


const handleReject = (title: string) => {
  const feedback = window.prompt(
    `Provide feedback for rejecting the project "${title}":`
  );
  if (feedback !== null && feedback.trim() !== '') {
    const isFinal = window.confirm(
      'Is this rejection final? Click OK for final rejection, Cancel for "Pending Revision".'
    );

    const newStatus = isFinal ? 'Rejected' : 'Pending Revision';

    setProjects(
      projects.map((project) =>
        project.title === title
          ? { ...project, status: newStatus, feedback }
          : project
      )
    );

    alert(
      `Project "${title}" has been ${
        isFinal ? 'rejected' : 'marked as "Pending Revision".'
      }`
    );
  } else {
    alert('Feedback is required to reject a project.');
  }
};

    type Propositions = Prettier<ProjectProposition & User & Teacher & Project>

    const columns: ColumnDef<Propositions>[] = useMemo(() => {
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
          accessorKey: "submittedBy",
          header: "Submitted By",
          enableSorting: true,
          cell: (props) => props.getValue(),
        },
        {
          accessorKey: "status",
          header: "Status",
          enableSorting: true,
          cell: (props) => {
            const status = props.getValue() as string;
            return (
              <span
                className={`badge ${
                  status === 'Pending'
                    ? 'bg-warning'
                    : status === 'Validated'
                    ? 'bg-success'
                    : status === 'Rejected'
                    ? 'bg-danger'
                    : 'bg-info'
                }`}
              >
                {status}
              </span>
            );
          },
        },
        {
          accessorKey: "actions",
          header: "Actions",
          cell: (props) => {
            const project = props.row.original;
            return project.status === 'Pending' ? (
              <>
                <button
                  className="btn btn-success btn-sm me-2"
                  onClick={() => handleValidate(project.title)}
                >
                  Validate
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleReject(project.title)}
                >
                  Reject
                </button>
              </>
            ) : null;
          },
        }
      ]
    },[]);


  return (
    <div className=" mx-auto mt-4" style={{ width: '95%', minHeight: '100vh' }}>
      <h2>Project Management</h2>

      {/* Filter */}
      <div className="mb-3">
        <label className="form-label me-2">Filter by Status:</label>
        <select
          className="form-select w-auto d-inline"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Validated">Validated</option>
          <option value="Rejected">Rejected</option>
          <option value="Pending Revision">Pending Revision</option>
        </select>
      </div>

      {/* Table */}
      {/* <div style={{overflowX:"auto"}}>
        <table className="table table-bordered table-striped" style={{whiteSpace:"nowrap"}}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Description</th>
              <th>Submitted By</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProjects.map((project, index) => (
              <tr key={index}>
                <td>{project.title}</td>
                <td>{project.type}</td>
                <td>{project.description}</td>
                <td>{project.submittedBy}</td>
                <td>
                <span
                  className={`badge ${
                    project.status === 'Pending'
                      ? 'bg-warning'
                      : project.status === 'Validated'
                      ? 'bg-success'
                      : project.status === 'Rejected'
                      ? 'bg-danger'
                      : 'bg-info'
                  }`}
                >
                  {project.status}
                </span>
                </td>
                <td>
                  {project.status === 'Pending' && (
                    <>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => handleValidate(project.title)}
                      >
                        Validate
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleReject(project.title)}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}

      <Table data={filteredProjects} columns={columns} />

      {/* Pagination */}
      {/* <div className="d-flex justify-content-between align-items-center mt-3">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div>
          <button
            className="btn btn-secondary btn-sm me-2"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          <button
            className="btn btn-secondary btn-sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div> */}
    </div>
  )
}
