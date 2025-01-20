// import { createLazyFileRoute } from '@tanstack/react-router'
// import { useState } from 'react'
// import Table from "../../../components/Table";
// import { useMemo } from "react";
// import { sql, useSelectSql } from '../../../api/sql.ts';
// import { useGetAll } from '../../../api/project.ts';
// import { ColumnDef } from "@tanstack/react-table";
// import type { Project} from "../../../types/db";
// import { Prettier } from "../../../types/util";
// import { Tab } from 'react-bootstrap';

// export const Route = createLazyFileRoute('/dashboard/teacher/defense-selction')(
//   {
//     component: RouteComponent,
//   },
// )

// function RouteComponent() {
//   const { data: projects } = useGetAll();

//   const [selectedProjects, setSelectedProjects] = useState<SelectedProject[]>([]);

  

//   interface SelectedProject {
//     id: number;
//     priority: number;
//   }

//   const handleSelectProject = (id: number) => {
//     if (selectedProjects.length >= 5) {
//       alert('All projects have been selected.');
//       return;
//     }
//     const nextPriority = selectedProjects.length + 1;
//     setSelectedProjects([...selectedProjects, { id, priority: nextPriority }]);
//   };

//   const handleResetSelection = () => {
//     setProjects(
//       projects.map((project) => ({
//         ...project,
//         status: 'Available',
//         priority: null,
//       }))
//     );
//     setSelectedProjects([]);
//   };

//   const handleSubmitSelection = async () => {};
//   type Supervise = Prettier<Project>;

//   const columns = useMemo<ColumnDef<Supervise & SelectedProject>[]>(() => {
//       return [
//         {
//           header: 'Priority',
//           accessorKey: 'priority',
//           enableSorting: true,
//           cell: (props) => props.getValue() || '-',
//         },
//         {
//           header: 'Title',
//           accessorKey: 'title',
//           enableSorting: true,
//           cell: (props) => props.getValue(),
//         },
//         {
//           header: 'Description',
//           accessorKey: 'description',
//           enableSorting: true,
//           cell: (props) => props.getValue(),
//         },
//         {
//           accessorKey: "actions",
//           header: "Actions",
//           cell: (props) => {
//             const project = props.row.original;
//             return <button
//             className="btn btn-primary btn-sm"
//             onClick={() => handleSelectProject(project.id)}
//             >
//             Select
//           </button>
//           },
//         },
//       ]
//     }, []);

//   return (
//     <div className="container mt-4">
//       <h3>Supervise Projects</h3>
//       <p className='h6 text-secondary my-3'>Select projects based on your preference.</p>
//       {/* <div style={{overflowX:"auto"}}>
//         <table className="table table-bordered" style={{whiteSpace:"nowrap"}}>
//           <thead>
//             <tr>
//               <th>Priority</th>
//               <th>Title</th>
//               <th>Description</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {projects.map((project, index) => (
//               <tr key={index}>
//                 <td>{project.priority || '-'}</td>
//                 <td>{project.title}</td>
//                 <td>{project.description}</td>
//                 <td>
//                     <button
//                       className="btn btn-primary btn-sm"
//                       onClick={() => handleSelectProject(project.title)}
//                     >
//                       Select
//                     </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div> */}
//       <div className="my-2">
//         {selectedProjects.length > 0 && (
//           <>
//             <h5>Your Selected Projects</h5>
//             <ol>
//               {selectedProjects
//                 .sort((a, b) => a.priority - b.priority)
//                 .map((project, index) => (
//                   <li key={index}>
//                     {project.priority}. {project.title}
//                   </li>
//                 ))}
//             </ol>
//             <button className="btn btn-success mt-3 me-3" onClick={async ()=> await handleSubmitSelection()}>
//               Submit Selection
//             </button>
//             <button className="btn btn-danger mt-3" onClick={handleResetSelection}>
//               Reset Selection
//             </button>
//           </>
//         )}
//       </div>
//       <Table columns={columns} data={projects} />
//     </div>
//   );
// };


import { createLazyFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import Table from "../../../components/Table";
import { useMemo } from "react";
import { sql } from '../../../api/sql.ts';
import { useGetAll } from '../../../api/project.ts';
import { ColumnDef } from "@tanstack/react-table";
import type { Project } from "../../../types/db";
import { Prettier } from "../../../types/util";
import { useAuth } from '../../../api/auth';

export const Route = createLazyFileRoute('/dashboard/teacher/defense-selction')(
  {
    component: RouteComponent,
  },
);

function RouteComponent() {
  const { data: projects } = useGetAll();
  const [selectedProjects, setSelectedProjects] = useState<SelectedProject[]>([]);
  const user = useAuth((user) => {
    if (user) return;
  });

  const teacherId = user?.id;

  interface SelectedProject {
    id: number;
    priority: number;
    title: string;
  }

  const handleSelectProject = (id: number, title: string) => {
    if (selectedProjects.length >= 5) {
      alert('You can only select up to 5 projects.');
      return;
    }
    const nextPriority = selectedProjects.length + 1;
    setSelectedProjects([...selectedProjects, { id, priority: nextPriority, title }]);
  };

  const handleResetSelection = () => {
    setSelectedProjects([]);
  };

  const handleSubmitSelection = async () => {
    if (selectedProjects.length < 5) {
      alert('You must select exactly 5 projects.');
      return;
    }

    // Create the insert query for teacher_project_choices table
    const query = `
      INSERT INTO teacher_project_choices (teacher_id, option1, option2, option3, option4, option5)
      VALUES (
        ${teacherId},
        ${selectedProjects[0]?.id || 'NULL'},
        ${selectedProjects[1]?.id || 'NULL'},
        ${selectedProjects[2]?.id || 'NULL'},
        ${selectedProjects[3]?.id || 'NULL'},
        ${selectedProjects[4]?.id || 'NULL'}
      );
    `;

    try {
      const result = await sql("insert", query);
      alert('Your project selection has been successfully submitted!');
      setSelectedProjects([]); 
    } catch (error) {
      console.error("Error submitting selection: ", error);
      alert('There was an error submitting your selection.');
    }
  };

  type Supervise = Prettier<Project>;

  const columns = useMemo<ColumnDef<Supervise>[]>(() => {
    return [
      {
        header: 'Title',
        accessorKey: 'title',
        enableSorting: true,
        cell: (props) => props.getValue(),
      },
      {
        header: 'Description',
        accessorKey: 'description',
        enableSorting: true,
        cell: (props) => props.getValue(),
      },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: (props) => {
          const project = props.row.original;
          return <button
            className="btn btn-primary btn-sm"
            onClick={() => handleSelectProject(project.id, project.title)}
          >
            Select
          </button>;
        },
      },
    ];
  }, [selectedProjects]);

  return (
    <div className="container mt-4">
      <h3>Supervise Projects</h3>
      <p className='h6 text-secondary my-3'>Select projects based on your preference.</p>
      <div style={{height: "60vh"}}>
        <Table columns={columns} data={projects} />
      </div>
      <div className="my-2" style={{height: "30vh"}}>
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
            <button className="btn btn-success mt-3 me-3" onClick={async () => await handleSubmitSelection()}>
              Submit Selection
            </button>
            <button className="btn btn-danger mt-3" onClick={handleResetSelection}>
              Reset Selection
            </button>
          </>
        )}
      </div>
    </div>
  );
}