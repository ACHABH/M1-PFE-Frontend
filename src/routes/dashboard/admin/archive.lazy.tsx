import { createLazyFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

export const Route = createLazyFileRoute('/dashboard/admin/archive')({
  component: RouteComponent,
})

function RouteComponent() {
    const [projects] = useState([
        {
          title: 'AI Research',
          proposer: 'Dr. Jane Doe (Teacher)',
          dateProposed: '2024-01-15',
          status: 'Accepted',
          description: 'This project explores AI applications in education.',
          technologies: 'Python, TensorFlow, PyTorch',
          needs: 'High-performance GPU, Dataset access',
        },
        {
          title: 'Robotics Design',
          proposer: 'Dr. John Smith (Teacher)',
          dateProposed: '2024-02-10',
          status: 'Rejected',
          description: 'Designing robotic models for industrial automation.',
          technologies: 'ROS, C++, MATLAB',
          needs: 'Robotics kits, Testing lab',
        },
        {
          title: 'Blockchain Security',
          proposer: 'ACME Corp (Company)',
          dateProposed: '2024-03-05',
          status: 'Pending',
          description: 'Developing secure blockchain algorithms.',
          technologies: 'Solidity, Ethereum, Cryptography',
          needs: 'Test blockchain environment',
        },
      ]);
    
      // State for modal
      const [selectedProject, setSelectedProject] = useState(null);
    
      // Status colors for badges
      const statusBadgeClass = {
        Accepted: 'bg-success',
        Rejected: 'bg-danger',
        Pending: 'bg-warning',
      };
    
      const handleProjectClick = (project) => {
        setSelectedProject(project);
      };
    
      const closeModal = () => {
        setSelectedProject(null);
      };
    
      return (
        <div className="container mt-4">
          <h3>Project Archive</h3>
          <p>This page contains all the proposed projects since the platform's creation.</p>
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Project Title</th>
                <th>Proposer</th>
                <th>Date of Proposition</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr key={index} onClick={() => handleProjectClick(project)} style={{ cursor: 'pointer' }}>
                  <td>{project.title}</td>
                  <td>{project.proposer}</td>
                  <td>{project.dateProposed}</td>
                  <td>
                    <span className={`badge ${statusBadgeClass[project.status]}`}>
                      {project.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
    
          {/* Modal for project details */}
          {selectedProject && (
            <Modal show={true} onHide={closeModal} centered>
              <Modal.Header closeButton>
                <Modal.Title>{selectedProject.title}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p><strong>Proposer:</strong> {selectedProject.proposer}</p>
                <p><strong>Date of Proposition:</strong> {selectedProject.dateProposed}</p>
                <p><strong>Status:</strong> {selectedProject.status}</p>
                <p><strong>Description:</strong> {selectedProject.description}</p>
                <p><strong>Technologies:</strong> {selectedProject.technologies}</p>
                <p><strong>Needs:</strong> {selectedProject.needs}</p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          )}
        </div>
      );
    };