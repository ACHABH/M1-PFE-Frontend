import { createLazyFileRoute } from '@tanstack/react-router'
import { ElementRef, useCallback, useMemo, useRef, useState } from 'react'
import SignatureModal from '../../../components/Teacher/signature-modal';
import NoteModal from '../../../components/Teacher/note-modal';
import { FullProject } from '../../../api/project';
import { FullGroup } from '../../../api/group';
import { ColumnDef } from '@tanstack/react-table';
import { ProjectPresentation, User } from '../../../types/db';

export const Route = createLazyFileRoute(
  '/dashboard/teacher/my-supervised-projects',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const [supervisedProjects, setSupervisedProjects] = useState<Project[]>([
    {
      id: 1,
      title: 'AI Research',
      student: 'John Doe',
      status: 'Pending Approval',
      presentationDate: null,
      note: null,
    },
    {
      id: 2,
      title: 'Robotics Design',
      student: 'Jane Smith',
      status: 'Pending Approval',
      presentationDate: null,
      note: null,
    },
    {
      id: 3,
      title: 'Blockchain Security',
      student: 'Emily Brown',
      status: 'Approved for June',
      presentationDate: 'June',
      note: 14.25,
    },
  ])

  interface Project {
    id: number;
    title: string;
    student: string;
    status: string;
    presentationDate: string | null;
    note: number | null;
  }

  const handleApproval = (studentName: string, presentationDate: string): void => {
    setSupervisedProjects(
      supervisedProjects.map((project: Project) =>
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
  const SignatureRef = useRef<ElementRef<typeof SignatureModal>>(null);
  const ref = useRef<ElementRef<typeof NoteModal>>(null);
  const [projectId, setProjectId] = useState(0);

  const onShow = useCallback((projectID: number = 0) => {
    ref.current?.show();
    setProjectId(projectID);
  }, []);
    
  const onClose = useCallback(() => {
    ref.current?.close();
    setProjectId(0);
  }, []);

  const SignatureOnShow = useCallback(() => {
    SignatureRef.current?.show();
  }, []);
    
  const SignatureOnClose = useCallback(() => {
    SignatureRef.current?.close();
  }, []);


  // const columns = useMemo<ColumnDef<FullProject & FullGroup & User & ProjectPresentation>[]>(() => {
  //   return [
  //     {
  //       accessorKey: "title",
  //       header: "Title",
  //       enableSorting: true,
  //       cell: (props) => props.getValue(),
  //     },
  //     {
  //       accessorKey: "student",
  //       header: "Student Names",
  //       enableSorting: true,
  //       cell: (props) => props.getValue(),
  //     },
  //     {
  //       accessorKey: "status",
  //       header: "Status",
  //       enableSorting: true,
  //       cell: (props) => props.getValue(),
  //     },
  //     {
  //       header: "Presentation Date",
  //       enableSorting: true,
  //       cell(props) {
  //         const project = props.row.original;
  //         return project.date || 'Not Assigned';
  //       },
  //     },
  //     {
  //       accessorKey: "status",
  //       header: "Status",
  //       enableSorting: true,
  //       cell: (props) => props.getValue(),
  //     },
  //     {
  //       header: "Actions",
  //       cell(props) {
  //         const project = props.row.original;
  //         return (
  //           // {project.status === 'Assigned' && (
  //           //   <>
  //           //     <button
  //           //       className="btn btn-primary btn-sm me-2"
  //           //       onClick={() => handleApproval(project.student, 'June')}
  //           //     >
  //           //       Approve for June
  //           //     </button>
  //           //     <button
  //           //       className="btn btn-warning btn-sm"
  //           //       onClick={() =>
  //           //         handleApproval(project.student, 'September')
  //           //       }
  //           //     >
  //           //       Defer to September
  //           //     </button>
  //           //   </>
  //           // )}
  //         );
  //       },
  //     },
  //   ];
  // }, []);
  
  return (
    <div className="container mt-4">
      <h3>Supervised Projects</h3>
      <p className='h6 text-secondary my-3'>
        A student cannot present until you approve their work.
      </p>
      <button className='btn btn-primary mb-3' onClick={SignatureOnShow}>
        Add Signature
      </button>
      <div style={{overflowX:"auto"}}>
        <table className="table table-bordered" style={{whiteSpace:"nowrap"}}>
          <thead>
            <tr>
              <th>Project Title</th>
              <th>Student Name</th>
              <th>Status</th>
              <th>Presentation Date</th>
              <th>Note</th>
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
            {project.note ? (
              <>
              {project.note}
              <button
                className="btn btn-secondary btn-sm ms-2"
                onClick={() => onShow(project.id)}
              >
                <i className="bi bi-pencil"></i>
              </button>
              </>
            ) : (
              <button
              className="btn btn-secondary btn-sm"
              onClick={() => onShow(project.id)}
              >
              Give Note
              </button>
            )}
            </td>
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
      <SignatureModal ref={SignatureRef} onClose={SignatureOnClose} />
      <NoteModal ref={ref} onClose={onClose} projectId={projectId} />

    </div>
  )
}
