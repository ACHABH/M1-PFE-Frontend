// import { useState } from "react";
// import { createLazyFileRoute } from "@tanstack/react-router";
// import Table from "../../../components/table";
// import type { Project, Teacher, User } from "../../../types/db";
// import { useMemo } from "react";
// import { ColumnDef } from "@tanstack/react-table";
// import { Prettier } from "../../../types/util";
// import { FullProject } from "../../../api/project";

// export const Route = createLazyFileRoute("/dashboard/admin/supervision")({
//   component: RouteComponent,
// });

// function RouteComponent() {
//   //this is a dummy data for test UI while coding only
//   const [projects, setProjects] = useState([
//     { title: "AI Research", supervisor: "Dr. Jane Doe", status: "Assigned" },
//     { title: "Robotics Design", supervisor: "Unassigned", status: "approved" },
//     {
//       title: "Blockchain Security",
//       supervisor: "Unassigned",
//       status: "approved",
//     },
//   ]);

//   const [availableTeachers] = useState([
//     "Dr. Jane Doe",
//     "Dr. John Smith",
//     "Dr. Alice Green",
//     "Dr. Mark Brown",
//   ]);

//   const [selectedProject, setSelectedProject] = useState<string | null>(null);
//   const [showTeacherList, setShowTeacherList] = useState(false);

//   const handleAssign = (title: string, supervisor: string) => {
//     setProjects(
//       projects.map((project) =>
//         project.title === title
//           ? { ...project, supervisor, status: "Assigned" }
//           : project
//       )
//     );
//     setShowTeacherList(false); // Hide the teacher list after assignment
//     setSelectedProject(null);
//   };

//   const openTeacherList = (projectTitle: string) => {
//     setSelectedProject(projectTitle);
//     setShowTeacherList(true);
//   };

//   const closeTeacherList = () => {
//     setShowTeacherList(false);
//     setSelectedProject(null);
//   };

//   type Supervision = Prettier<FullProject & User & Teacher>;

//   const columns = useMemo<ColumnDef<Supervision>[]>(() => {
//     return [
//       {
//         accessorKey: "title",
//         header: "Title",
//         enableSorting: true,
//         cell: (props) => props.getValue(),
//       },
//       {
//         accessorKey: "supervisor",
//         header: "Supervisor",
//         enableSorting: true,
//         cell: (props) => props.getValue(),
//       },
//       {
//         accessorKey: "status",
//         header: "Status",
//         enableSorting: true,
//         cell: (props) => {
//           const status = props.getValue() as string;
//           return status === "approved" ? "Pending" : status;
//         },
//       },
//       {
//         accessorKey: "actions",
//         header: "Actions",
//         cell: (props) => {
//           const project = props.row.original;
//           return project.status === "approved" ? (
//             <button
//               className="btn btn-success btn-sm"
//               onClick={() => openTeacherList(project.title)}
//             >
//               Assign Supervisor
//             </button>
//           ) : null;
//         },
//       },
//     ];
//   }, []);

//   return (
//     <div className="mx-auto mt-4" style={{ width: "95%", minHeight: "100vh" }}>
//       <h2>Assign Supervision</h2>
//       <p className="h6 text-secondary">
//         This's the list of project left without superviser, Assign a superviser
//         for each project from the list of available Professors
//       </p>
//       <Table data={projects} columns={columns} />
//       {/* Modal for Selecting a Teacher */}
//       {showTeacherList && selectedProject && (
//         <div
//           className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
//           style={{ zIndex: 1050 }}
//         >
//           <div
//             className="component-bg p-4 rounded shadow"
//             style={{ width: "400px" }}
//           >
//             <h5>Assign Supervisor for "{selectedProject}"</h5>
//             <ul className="list-group mt-3">
//               {availableTeachers.map((teacher, index) => (
//                 <li
//                   key={index}
//                   className="list-group-item d-flex justify-content-between align-items-center"
//                 >
//                   {teacher}
//                   <button
//                     className="btn btn-primary btn-sm"
//                     onClick={() => handleAssign(selectedProject, teacher)}
//                   >
//                     Assign
//                   </button>
//                 </li>
//               ))}
//             </ul>
//             <button
//               className="btn btn-secondary mt-3 w-100"
//               onClick={closeTeacherList}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




import { useState, useMemo, useCallback } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import Table from "../../../components/table";
import { ColumnDef } from "@tanstack/react-table";
import { useGetAll as useGetAllProjects, useUpdate as useUpdateProject } from "../../../api/project";
import { useGetAll as useGetAllTeachers } from "../../../api/teacher";

export const Route = createLazyFileRoute("/dashboard/admin/supervision")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: projects = [] } = useGetAllProjects(); // Fetch projects
  const { data: teachers = [] } = useGetAllTeachers(); // Fetch available teachers
  const { mutateAsync: updateProject } = useUpdateProject();

  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [showTeacherList, setShowTeacherList] = useState(false);

  const handleAssign = useCallback(
    async (projectId: number, teacherId: number) => {
      try {
        await updateProject({
          id: projectId,
          body: { supervisor_id: teacherId },
        });
        setShowTeacherList(false); // Hide the teacher list after assignment
        setSelectedProject(null);
      } catch (error) {
        console.error("Failed to assign supervisor:", error);
      }
    },
    [updateProject]
  );

  const openTeacherList = useCallback((projectId: number) => {
    setSelectedProject(projectId);
    setShowTeacherList(true);
  }, []);

  const closeTeacherList = useCallback(() => {
    setShowTeacherList(false);
    setSelectedProject(null);
  }, []);

  const columns = useMemo<ColumnDef<any>[]>(() => {
    return [
      {
        accessorKey: "title",
        header: "Title",
        enableSorting: true,
        cell: (props) => props.getValue(),
      },
      {
        accessorKey: "supervisor",
        header: "Supervisor",
        enableSorting: true,
        cell: (props) => {
          const supervisor = props.row.original.supervisor;
          return supervisor ? supervisor.name : "Unassigned";
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        enableSorting: true,
        cell: (props) => props.getValue() === "approved" ? "Pending" : props.getValue(),
      },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: (props) => {
          const project = props.row.original;
          return project.status === "approved" ? (
            <button
              className="btn btn-success btn-sm"
              onClick={() => openTeacherList(project.id)}
            >
              Assign Supervisor
            </button>
          ) : null;
        },
      },
    ];
  }, [openTeacherList]);

  return (
    <div className="mx-auto mt-4" style={{ width: "95%", minHeight: "100vh" }}>
      <h2>Assign Supervision</h2>
      <p className="h6 text-secondary">
        This is the list of projects without a supervisor. Assign a supervisor to each project from the list of available professors.
      </p>
      <Table data={projects} columns={columns} />
      
      {/* Modal for Selecting a Teacher */}
      {showTeacherList && selectedProject !== null && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
          style={{ zIndex: 1050 }}
        >
          <div
            className="component-bg p-4 rounded shadow"
            style={{ width: "400px" }}
          >
            <h5>Assign Supervisor for "{projects.find((p) => p.id === selectedProject)?.title}"</h5>
            <ul className="list-group mt-3">
              {teachers.length > 0 ? (
                teachers.map((teacher) => (
                  <li
                    key={teacher.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {teacher.first_name}
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleAssign(selectedProject!, teacher.id)}
                    >
                      Assign
                    </button>
                  </li>
                ))
              ) : (
                <li className="list-group-item text-center">No teachers available</li>
              )}
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
  );
}
