// import { createLazyFileRoute } from '@tanstack/react-router'
// import { ElementRef, useCallback, useMemo, useRef, useState } from 'react'
// import SignatureModal from '../../../components/Teacher/signature-modal';
// import NoteModal from '../../../components/Teacher/note-modal';
// import { useAuth } from "../../../api/auth";
// import { sql, useSelectSql  } from "../../../api/sql.ts";
// // import { FullProject } from '../../../api/project';
// // import { FullGroup } from '../../../api/group';
// // import { ColumnDef } from '@tanstack/react-table';
// // import { ProjectPresentation, User } from '../../../types/db';

// export const Route = createLazyFileRoute(
//   '/dashboard/teacher/my-supervised-projects',
// )({
//   component: RouteComponent,
// })

// function RouteComponent() {

//   const user = useAuth((user) => {
//     if (user) return;
//   });

//   const query = `SELECT 
//     p.id AS project_id,
//     p.title AS project_title,
//     GROUP_CONCAT(DISTINCT u.first_name || ' ' || u.last_name, ', ') AS student_names,
//     p.status AS project_status,
//     MAX(CASE WHEN ps.can_present = 1 THEN ps.updated_at END) AS presentation_date
//     FROM 
//         projects p
//     LEFT JOIN 
//         project_students ps ON p.id = ps.project_id
//     LEFT JOIN 
//         users u ON ps.student_id = u.id
//     GROUP BY 
//         p.id, p.title, p.status
//     ORDER BY 
//         p.title;
//   `;

// const { data, error, isLoading } = useSelectSql(query);
// // console.log("Result:",data?.data);

//   const [supervisedProjects, setSupervisedProjects] = useState<Project[]>([
//     {
//       id: 1,
//       title: 'AI Research',
//       student: 'John Doe',
//       status: 'Pending Approval',
//       presentationDate: null,
//       note: null,
//     },
//     {
//       id: 2,
//       title: 'Robotics Design',
//       student: 'Jane Smith',
//       status: 'Pending Approval',
//       presentationDate: null,
//       note: null,
//     },
//     {
//       id: 3,
//       title: 'Blockchain Security',
//       student: 'Emily Brown',
//       status: 'Approved for June',
//       presentationDate: 'June',
//       note: 14.25,
//     },
//   ])

//   // const supervisedProjects = (data?.data.length ? data : []).map((project: any) => ({
//   //   id: project.project_id,
//   //   title: project.project_title,
//   //   student: project.students,
//   // }));
  

//   interface Project {
//     id: number;
//     title: string;
//     student: string;
//     status: string;
//     presentationDate: string | null;
//     note: number | null;
//   }

//   const handleApproval = (studentName: string, presentationDate: string): void => {
//     setSupervisedProjects(
//       supervisedProjects.map((project: Project) =>
//         project.student === studentName
//           ? {
//               ...project,
//               status:
//                 presentationDate === 'June'
//                   ? 'Approved for June'
//                   : 'Deferred to September',
//               presentationDate,
//             }
//           : project,
//       ),
//     )
//     alert(
//       `${studentName} has been ${
//         presentationDate === 'June' ? 'approved' : 'deferred'
//       } for ${presentationDate} presentation.`,
//     )
//   }
//   const SignatureRef = useRef<ElementRef<typeof SignatureModal>>(null);
//   const ref = useRef<ElementRef<typeof NoteModal>>(null);
//   const [projectId, setProjectId] = useState(0);
  
  

//   const onShow = useCallback((projectID: number = 0) => {
//     ref.current?.show();
//     setProjectId(projectID);
//   }, []);
    
//   const onClose = useCallback(() => {
//     ref.current?.close();
//     setProjectId(0);
//   }, []);

//   const SignatureOnShow = useCallback(() => {
//     SignatureRef.current?.show();
//   }, []);
    
//   const SignatureOnClose = useCallback(() => {
//     SignatureRef.current?.close();
//   }, []);


//   if (isLoading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error.message}</p>;
  
//   return (
//     <div className="container mt-4">
//       <h3>Supervised Projects</h3>
//       <p className='h6 text-secondary my-3'>
//         A student cannot present until you approve their work.
//       </p>
//       <button className='btn btn-primary mb-3' onClick={SignatureOnShow}>
//         Add Signature
//       </button>
//       <div style={{overflowX:"auto"}}>
//         <table className="table table-bordered" style={{whiteSpace:"nowrap"}}>
//           <thead>
//             <tr>
//               <th>Project Title</th>
//               <th>Student Names</th>
//               <th>Status</th>
//               <th>Presentation Date</th>
//               <th>Note</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {supervisedProjects.map((project, index) => (
//               <tr key={index}>
//           <td>{project.title}</td>
//           <td>{project.student}</td>
//           <td>
//             <span
//               className={`badge ${
//                 project.status.includes('Approved')
//             ? 'bg-success'
//             : 'bg-warning'
//               }`}
//             >
//               {project.status}
//             </span>
//           </td>
//           <td>{project.presentationDate || 'Not Assigned'}</td>
//             <td>
//             {project.note ? (
//               <>
//               {project.note}
//               <button
//                 className="btn btn-secondary btn-sm ms-2"
//                 onClick={() => onShow(project.id)}
//               >
//                 <i className="bi bi-pencil"></i>
//               </button>
//               </>
//             ) : (
//               <button
//               className="btn btn-secondary btn-sm"
//               onClick={() => onShow(project.id)}
//               >
//               Give Note
//               </button>
//             )}
//             </td>
//           <td>
//             {project.status === 'Pending Approval' && (
//               <>
//                 <button
//                   className="btn btn-primary btn-sm me-2"
//                   onClick={() => handleApproval(project.student, 'June')}
//                 >
//                   Approve for June
//                 </button>
//                 <button
//                   className="btn btn-warning btn-sm"
//                   onClick={() =>
//                     handleApproval(project.student, 'September')
//                   }
//                 >
//                   Defer to September
//                 </button>
//               </>
//             )}
//           </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <SignatureModal ref={SignatureRef} onClose={SignatureOnClose} />
//       <NoteModal ref={ref} onClose={onClose} projectId={projectId} />

//     </div>
//   )
// }


import { createLazyFileRoute } from '@tanstack/react-router';
import { ElementRef, useCallback, useMemo, useRef, useState } from 'react';
import SignatureModal from '../../../components/Teacher/signature-modal';
import NoteModal from '../../../components/Teacher/note-modal';
import { useAuth } from '../../../api/auth';
import { sql, useSelectSql } from '../../../api/sql.ts';

export const Route = createLazyFileRoute(
  '/dashboard/teacher/my-supervised-projects',
)({
  component: RouteComponent,
});


function RouteComponent() {
  const user = useAuth((user) => {
    if (user) return;
  });

  
  const query = `
    SELECT 
    p.id AS project_id,
    p.title AS project_title,
    GROUP_CONCAT(u.first_name || ' ' || u.last_name, ', ') AS student_names,
    ps.can_present AS project_status,
    MAX(CASE WHEN ps.can_present = 1 THEN ps.updated_at END) AS presentation_date,
    pn.note AS project_note
    FROM 
        projects p
    LEFT JOIN 
        project_students ps ON p.id = ps.project_id
    LEFT JOIN 
        users u ON ps.student_id = u.id
    LEFT JOIN 
        project_notes pn ON p.id = pn.project_id
    WHERE 
        EXISTS (
          SELECT 1 
          FROM project_supervisors s 
          WHERE s.project_id = p.id 
            AND s.teacher_id = ${user?.id}
        )
    GROUP BY 
        p.id, p.title, p.status, pn.note
    ORDER BY 
        p.title;
  `;

  const { data, error, isLoading, refetch } = useSelectSql(query);


  const supervisedProjects = useMemo(() => {
    if (data?.data) {
      return data.data.map((project: any) => ({
        id: project.project_id,
        title: project.project_title,
        student: project.student_names || 'No students assigned',
        status: project.project_status,
        presentationDate: project.presentation_date
          ? new Date(project.presentation_date).toLocaleDateString()
          : null,
        note: project.project_note,
      }));
    }
    return [];
  }, [data]);
  

  const [projectId, setProjectId] = useState(0);
  const SignatureRef = useRef<ElementRef<typeof SignatureModal>>(null);
  const ref = useRef<ElementRef<typeof NoteModal>>(null);

  const onShow = useCallback((projectID: number = 0) => {
    ref.current?.show();
    setProjectId(projectID);
  }, []);

  const onClose = useCallback(() => {
    ref.current?.close();
    setProjectId(0);
    refetch();
  }, []);

  const SignatureOnShow = useCallback(() => {
    SignatureRef.current?.show();
  }, []);

  const SignatureOnClose = useCallback(() => {
    SignatureRef.current?.close();
  }, []);

  const handleApproval = async (project_id: number): Promise<void> => {
    const query= `UPDATE project_students SET can_present = 1 WHERE project_id = ${project_id}`;
    const response = await sql('update',query);
    alert('Project approved for presentation');
    refetch();
  };

  const handleDellay = async (project_id: number): Promise<void> => {
    const query= `UPDATE project_students SET can_present = 0 WHERE project_id = ${project_id}`;
    const response = await sql('update',query);
    alert('Project deferred to September');
    refetch();
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container mt-4">
      <h3>Supervised Projects</h3>
      <p className="h6 text-secondary my-3">
        A student cannot present until you approve their work.
      </p>
      <button className="btn btn-primary mb-3" onClick={SignatureOnShow}>
        Add Signature
      </button>
      <div style={{ overflowX: 'auto' }}>
        <table className="table table-bordered" style={{ whiteSpace: 'nowrap' }}>
          <thead>
            <tr>
              <th>Project Title</th>
              <th>Student Names</th>
              <th>Status</th>
              <th>Presentation Date</th>
              <th>Note</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {supervisedProjects.map((project:any, index:any) => (
              <tr key={index}>
                <td>{project.title}</td>
                <td>{project.student}</td>
                <td>
                  <span
                    className={`badge ${
                      project.status=='1'
                        ? 'bg-success'
                        : 'bg-warning'
                    }`}
                  >
                    {project.status == '1' ? 'Allowed' : 'Not Approved'}
                  </span>
                </td>
                <td>{project.presentationDate || 'Not Assigned'}</td>
                <td>
                    {project.status == '1' ? (
                    project.note ? (
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
                    )
                    ) : (
                    "Didn't Presented Yet"
                    )}
                </td>
                <td>
                  {project.status == '0' && (
                    <>
                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => handleApproval(project.id)}
                      >
                        Approve to Present
                      </button>
                      {/* <button
                        className="btn btn-warning btn-sm"
                        onClick={() =>
                          handleDellay(project.id)
                        }
                      >
                        Defer to September
                      </button> */}
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
  );
}
