import { useState } from 'react'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/dashboard/admin/supervision')({
  component: RouteComponent,
})

function RouteComponent() {
  const [projects, setProjects] = useState([
    { title: 'AI Research', supervisor: 'Dr. Jane Doe', status: 'Assigned' },
    { title: 'Robotics Design', supervisor: 'Unassigned', status: 'Pending' },
    {
      title: 'Blockchain Security',
      supervisor: 'Unassigned',
      status: 'Pending',
    },
  ])

  const [availableTeachers] = useState([
    'Dr. Jane Doe',
    'Dr. John Smith',
    'Dr. Alice Green',
    'Dr. Mark Brown',
  ])

  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [showTeacherList, setShowTeacherList] = useState(false)

  const handleAssign = (title: string, supervisor: string) => {
    setProjects(
      projects.map((project) =>
        project.title === title
          ? { ...project, supervisor, status: 'Assigned' }
          : project,
      ),
    )
    setShowTeacherList(false) // Hide the teacher list after assignment
    setSelectedProject(null)
  }

  const openTeacherList = (projectTitle: string) => {
    setSelectedProject(projectTitle)
    setShowTeacherList(true)
  }

  const closeTeacherList = () => {
    setShowTeacherList(false)
    setSelectedProject(null)
  }

  return (
    <div className="mx-auto mt-4" style={{ width: '95%', minHeight: '100vh' }}>
      <h2>Supervision</h2>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Supervisor</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr key={index}>
              <td>{project.title}</td>
              <td>{project.supervisor}</td>
              <td>{project.status}</td>
              <td>
                {project.status === 'Pending' && (
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => openTeacherList(project.title)}
                  >
                    Assign Supervisor
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Selecting a Teacher */}
      {showTeacherList && selectedProject && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
          style={{ zIndex: 1050 }}
        >
          <div
            className="bg-white p-4 rounded shadow"
            style={{ width: '400px' }}
          >
            <h5>Assign Supervisor for "{selectedProject}"</h5>
            <ul className="list-group mt-3">
              {availableTeachers.map((teacher, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {teacher}
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleAssign(selectedProject, teacher)}
                  >
                    Assign
                  </button>
                </li>
              ))}
            </ul>
            <button
              className="btn btn-secondary mt-3 w-100"
              onClick={closeTeacherList}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
