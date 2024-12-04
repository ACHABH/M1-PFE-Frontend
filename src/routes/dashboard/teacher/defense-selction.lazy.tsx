import { createLazyFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createLazyFileRoute('/dashboard/teacher/defense-selction')(
  {
    component: RouteComponent,
  },
)

function RouteComponent() {
  const [projects, setProjects] = useState([
    { title: 'AI Research', status: 'Available', students: 'John Doe', priority: null },
    { title: 'Robotics Design', status: 'Available', students: 'Jane Smith', priority: null },
    { title: 'Blockchain Security', status: 'Available', students: 'Emily Brown', priority: null },
  ]);

  const [selectedProjects, setSelectedProjects] = useState([]);

  const handleSelectProject = (title) => {
    if (selectedProjects.length >= projects.length) {
      alert('All projects have been selected.');
      return;
    }

    const nextPriority = selectedProjects.length + 1;

    setProjects(
      projects.map((project) =>
        project.title === title
          ? { ...project, status: 'Pending', priority: nextPriority }
          : project
      )
    );

    setSelectedProjects([...selectedProjects, { title, priority: nextPriority }]);
    alert(`You have selected "${title}" with priority ${nextPriority}.`);
  };

  const handleResetSelection = () => {
    setProjects(
      projects.map((project) => ({
        ...project,
        status: 'Available',
        priority: null,
      }))
    );
    setSelectedProjects([]);
  };

  return (
    <div className="container mt-4">
      <h3>Supervise Projects</h3>
      <p className='h6 text-secondary my-3'>Select projects based on your preference.</p>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Priority</th>
            <th>Title</th>
            <th>Students</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr key={index}>
              <td>{project.priority || '-'}</td>
              <td>{project.title}</td>
              <td>{project.students}</td>
              <td>
                <span
                  className={`badge ${
                    project.status === 'Available' ? 'bg-success' : 'bg-warning'
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

      <div className="mt-4">
        {selectedProjects.length > 0 && (
          <>
            <h5>Your Selected Projects</h5>
            <ol>
              {selectedProjects
                .sort((a, b) => a.priority - b.priority)
                .map((project, index) => (
                  <li key={index}>
                    {project.priority}. {project.title}
                  </li>
                ))}
            </ol>
            <button className="btn btn-danger mt-3" onClick={handleResetSelection}>
              Reset Selection
            </button>
          </>
        )}
      </div>
    </div>
  );
};