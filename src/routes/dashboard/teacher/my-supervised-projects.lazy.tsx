import { createLazyFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createLazyFileRoute(
  '/dashboard/teacher/my-supervised-projects',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const [supervisedProjects, setSupervisedProjects] = useState([
    {
      title: 'AI Research',
      student: 'John Doe',
      status: 'Pending Approval',
      presentationDate: null,
    },
    {
      title: 'Robotics Design',
      student: 'Jane Smith',
      status: 'Pending Approval',
      presentationDate: null,
    },
    {
      title: 'Blockchain Security',
      student: 'Emily Brown',
      status: 'Approved for June',
      presentationDate: 'June',
    },
  ])

  const handleApproval = (studentName, presentationDate) => {
    setSupervisedProjects(
      supervisedProjects.map((project) =>
        project.student === studentName
          ? {
              ...project,
              status:
                presentationDate === 'June'
                  ? 'Approved for June'
                  : 'Deferred to September',
              presentationDate,
            }
          : project,
      ),
    )
    alert(
      `${studentName} has been ${
        presentationDate === 'June' ? 'approved' : 'deferred'
      } for ${presentationDate} presentation.`,
    )
  }

  return (
    <div className="container mt-4">
      <h3>Supervised Projects</h3>
      <p className='h6 text-secondary my-3'>
        A student cannot present until you approve their work.
      </p>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Project Title</th>
            <th>Student Name</th>
            <th>Status</th>
            <th>Presentation Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {supervisedProjects.map((project, index) => (
            <tr key={index}>
              <td>{project.title}</td>
              <td>{project.student}</td>
              <td>
                <span
                  className={`badge ${
                    project.status.includes('Approved')
                      ? 'bg-success'
                      : 'bg-warning'
                  }`}
                >
                  {project.status}
                </span>
              </td>
              <td>{project.presentationDate || 'Not Assigned'}</td>
              <td>
                {project.status === 'Pending Approval' && (
                  <>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleApproval(project.student, 'June')}
                    >
                      Approve for June
                    </button>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() =>
                        handleApproval(project.student, 'September')
                      }
                    >
                      Defer to September
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
