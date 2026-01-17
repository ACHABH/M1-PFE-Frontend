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
    <div className="container-fluid px-4 py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-2">Project Supervision</h2>
          <p className="text-muted mb-0">
            Manage and assign supervisors to approved projects
          </p>
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-primary" 
            onClick={() => refetch()}
          >
            <i className="fas fa-sync-alt me-2"></i>
            Refresh List
          </button>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <Table
            data={projects || []}
            columns={columns}
            className="table-hover"
          />
        </div>
      </div>

      {/* Teacher Assignment Modal */}
      {showTeacherList && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-bottom-0">
                <h5 className="modal-title">Assign Supervisor</h5>
                <button type="button" className="btn-close" onClick={closeTeacherList}></button>
              </div>
              <div className="modal-body">
                <div className="list-group">
                  {teachers?.map((teacher: any) => (
                    <button
                      key={teacher.id}
                      className="list-group-item list-group-item-action d-flex align-items-center gap-3 py-3"
                      onClick={() => handleAssign(selectedProject!, teacher.id)}
                    >
                      <div className="avatar bg-primary bg-opacity-10 rounded-circle p-2">
                        <i className="fas fa-user text-primary"></i>
                      </div>
                      <div>
                        <h6 className="mb-0">{teacher.name}</h6>
                        <small className="text-muted">
                          {teacher.department || 'Department not specified'}
                        </small>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
