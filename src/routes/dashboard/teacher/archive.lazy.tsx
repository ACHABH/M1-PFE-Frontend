import { createLazyFileRoute } from '@tanstack/react-router'
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

export const Route = createLazyFileRoute('/dashboard/teacher/archive')({
  component: RouteComponent,
})

function RouteComponent() {
    const [projects] = useState([
        {
          title: 'AI Research',
          participants: ['Alice Brown', 'Bob White'],
          status: 'Completed',
          defenseDate: '2024-06-10',
          details: 'A project exploring AI applications in education.',
        },
        {
          title: 'Robotics Design',
          participants: ['Charlie Green', 'Daisy Blue'],
          status: 'Pending',
          defenseDate: '2024-09-15',
          details: 'A project focused on designing robotic models for automation.',
        },
        {
          title: 'Blockchain Security',
          participants: ['Ethan Black'],
          status: 'Completed',
          defenseDate: '2024-05-20',
          details: 'A project aiming to develop secure blockchain algorithms.',
        },
      ]);
    
      const [selectedProject, setSelectedProject] = useState<{
        title: string;
        participants: string[];
        status: string;
        defenseDate: string;
        details: string;
      } | null>(null);
    
      interface Project {
        title: string;
        participants: string[];
        status: string;
        defenseDate: string;
        details: string;
      }

      const handleRowClick = (project: Project) => {
        setSelectedProject(project);
      };
    
      const closeModal = () => {
        setSelectedProject(null);
      };
    

      return (
        <div className="container mt-4">
          <h3>Project Archive</h3>
          <p>This page contains all the projects you have supervised or participated in.</p>
          <div style={{overflowX:"auto"}}>
            <table className="table table-bordered table-striped" style={{whiteSpace:"nowrap"}}>
              <thead>
                <tr>
                  <th>Project Title</th>
                  <th>Participants</th>
                  <th>Status</th>
                  <th>Defense Date</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, index) => (
                  <tr
                    key={index}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleRowClick(project)}
                  >
                    <td>{project.title}</td>
                    <td>{project.participants.join(', ')}</td>
                    <td>
                      <span
                        className={`badge ${
                          project.status === 'Completed' ? 'bg-success' : 'bg-warning'
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td>{project.defenseDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>     
          {/* Modal for Project Details */}
          {selectedProject && (
            <Modal show onHide={closeModal} centered>
              <Modal.Header closeButton>
                <Modal.Title>{selectedProject.title}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p><strong>Participants:</strong> {selectedProject.participants.join(', ')}</p>
                <p><strong>Status:</strong> {selectedProject.status}</p>
                <p><strong>Defense Date:</strong> {selectedProject.defenseDate}</p>
                <p><strong>Details:</strong> {selectedProject.details}</p>
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