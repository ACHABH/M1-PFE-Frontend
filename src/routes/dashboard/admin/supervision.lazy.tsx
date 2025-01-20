import { useState, useMemo, useCallback } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import Table from "../../../components/Table";
import { ColumnDef } from "@tanstack/react-table";
import { sql, useSelectSql } from '../../../api/sql.ts';

export const Route = createLazyFileRoute("/dashboard/admin/supervision")({
  component: RouteComponent,
});

function RouteComponent() {
  // const { data: projects = [] } = useGetAllProjects();
  const query1 = `SELECT * FROM projects WHERE status = 'approved';`
  const { data: projets, refetch } = useSelectSql(query1);
  const projects = projets?.data;
  const query = `SELECT * FROM users WHERE role = 'teacher';`;
  const { data, error, isLoading  } = useSelectSql(query);
  const teachers = data?.data;

  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [showTeacherList, setShowTeacherList] = useState(false);

  const handleAssign = useCallback(
    async (projectId: number, teacherId: number) => {
      try {
        const query= `UPDATE projects SET status = 'assigned' WHERE id = ${projectId}`;
        const query2 = `INSERT INTO project_supervisors (project_id, teacher_id, role) VALUES (${projectId}, ${teacherId}, 'SUPERVISOR')`;
        await sql("update", query);
        await sql("insert", query2);
        alert("Supervisor assigned successfully");
        setShowTeacherList(false);
        setSelectedProject(null);
        refetch();
      } catch (error) {
        console.error("Failed to assign supervisor:", error);
      }
    },
    [refetch]
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

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

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
            <h5>Assign Supervisor for "{projects.find((p:any) => p.id === selectedProject)?.title}"</h5>
            <ul className="list-group mt-3">
              {teachers.length > 0 ? (
                teachers?.map((teacher:any) => (
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
