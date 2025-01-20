import { createLazyFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Table from "../../../components/table";
import type { ColumnDef } from "@tanstack/react-table";
import { User } from '../../../types/db';
import {
  type FullProject,
  useGetAll as useGetAllProjects
} from "../../../api/project";
import {useSelectSql} from '../../../api/sql';
import { sql } from "../../../api/sql.ts";
export const Route = createLazyFileRoute('/dashboard/admin/archive')({
  component: RouteComponent,
})

function RouteComponent() {
  const query = "SELECT * FROM projects";
  const {data} = useSelectSql(query);
  const propositionQuery= "SELECT * FROM project_propositions";

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
    const [selectedProject, setSelectedProject] = useState<{
      title: string;
        proposer: string;
        dateProposed: string;
        status: string;
        description: string;
        technologies: string;
        needs: string;
      } | null>(null);
      
      // Status colors for badges
      const statusBadgeClass = {
        Accepted: 'bg-success',
        Rejected: 'bg-danger',
        Pending: 'bg-warning',
      };
    
      interface Project {
        title: string;
        proposer: string;
        dateProposed: string;
        status: string;
        description: string;
        technologies: string;
        needs: string;
      }
      
      const handleProjectClick = (project: Project) => {
        setSelectedProject(project);
      };
      
      const closeModal = () => {
        setSelectedProject(null);
      };
      
      
      // const { data: projects } = useGetAllProjects();

      // const columns = useMemo<ColumnDef<FullProject & User>[]>(() => {
      //   return [
      //     {
      //       accessorKey: 'title',
      //       header: 'Title',
      //       enableSorting: true,
      //       cell: (props) => props.getValue(),
      //     },
      //     {
      //       accessorKey: 'proposer',
      //       accessorFn: (row) => `${row.first_name} ${row.last_name}`,
      //       header: 'Proposer',
      //       enableSorting: true,
      //       cell: (props) => props.getValue(),
      //     },
      //     {
      //       accessorKey: 'dateProposed',
      //       header: 'Date of Proposition',
      //       enableSorting: true,
      //       cell: (props) => props.getValue(),
      //     },
      //     {
      //       accessorKey: 'status',
      //       header: 'Status',
      //       enableSorting: true,
      //       cell: (props) => (
      //         <span className={`badge ${statusBadgeClass[props.getValue() as keyof typeof statusBadgeClass]}`}>
      //           {props.getValue() as string}
      //         </span>
      //       ),
      //     },
      //   ]
      // }, []);
      

      async function addNewProject() {
        const query = "INSERT INTO project_students (project_id, student_id) VALUES ('23','5')";
        try {
          const result = await sql("insert", query);
          console.log("Insert successful:", result);
        } catch (error) {
          console.error("Error inserting user:", error);
        }
      }
      // addNewProject();
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
                    <span className={`badge ${statusBadgeClass[project.status as keyof typeof statusBadgeClass]}`}>
                      {project.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* <Table
            columns={columns}
            data={projects}
            // onRowClick={(row) => handleProjectClick(row as any)}
          /> */}
    
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