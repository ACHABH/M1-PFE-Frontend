import { useState } from 'react'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute(
  '/dashboard/teacher/supervise-projects',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const [projects, setProjects] = useState([
    {
      title: 'AI Research',
      proposer: 'Dr. Jane Doe',
      type: 'Classic',
      summary: 'Exploring AI applications in education.',
      status: 'Available',
    },
    {
      title: 'Robotics Design',
      proposer: 'Dr. John Smith',
      type: 'Innovative',
      summary: 'Creating robotic models for industrial automation.',
      status: 'Available',
    },
    {
      title: 'Blockchain Security',
      proposer: 'Dr. Alice Green',
      type: 'Innovative',
      summary: 'Developing secure blockchain algorithms.',
      status: 'Selected',
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

  return (
    <div className="container mt-4">
      <h3>Supervise Project</h3>
      <h6 className='my-3 text-secondary'>Select Project You Want To Supervise</h6>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Proposer</th>
            <th>Type</th>
            <th>Summary</th>
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
              <td>{project.summary}</td>
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
    </div>
  )
}
