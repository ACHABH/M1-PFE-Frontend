import { createLazyFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createLazyFileRoute(
  '/dashboard/teacher/supervise-projects',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const [projects, setProjects] = useState([
    { title: 'AI Research', status: 'Available', students: 'John Doe' },
    { title: 'Robotics Design', status: 'Available', students: 'Jane Smith' },
  ])

  const handleSupervise = (title: string) => {
    setProjects(
      projects.map((project) =>
        project.title === title
          ? { ...project, status: 'Supervised' }
          : project,
      ),
    )
    alert(`You are now supervising "${title}".`)
  }

  return (
    <div className="container mt-4">
      <h3>Supervise Projects</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Title</th>
            <th>Students</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr key={index}>
              <td>{project.title}</td>
              <td>{project.students}</td>
              <td>{project.status}</td>
              <td>
                {project.status === 'Available' && (
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleSupervise(project.title)}
                  >
                    Supervise
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
