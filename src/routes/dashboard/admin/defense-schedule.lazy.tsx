import { ElementRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import JurieModal from "../../../components/admin/jurie-modal";
import { z } from "zod";
import Table from "../../../components/Table";
import type { Room, Student, Teacher, User } from "../../../types/db";
import { ColumnDef } from "@tanstack/react-table";
import { Prettier } from "../../../types/util";
import ValidationModal from "../../../components/admin/validation-modal";
import {
  type FullProject
} from "../../../api/project";
import { useSelectSql } from '../../../api/sql.ts';

const JuriesSlotSchema = z.object({
  title: z.string().min(1),
  date: z.string().date(),
  time: z.string().time(),
  room: z.string().min(1),
  teachers: z.string().min(1),
  students: z.string().min(1),
});

type JuriesSlot = z.infer<typeof JuriesSlotSchema>;

export const Route = createLazyFileRoute("/dashboard/admin/defense-schedule")({
  component: RouteComponent,
});


function RouteComponent() {
  const ref = useRef<ElementRef<typeof JurieModal>>(null);
  const ValidationRef = useRef<ElementRef<typeof ValidationModal>>(null);
  const [projectId, setProjectId] = useState(0);
  const [defenseSchedules, setDefenseSchedules] = useState<any[]>([]);


  const { data, isLoading, isError } = useSelectSql(`
    SELECT 
    p.id AS id,
    p.title AS title,
    pp.date AS date,
    strftime('%H:%M', pp.date) AS time, -- Extracting time from datetime
    r.room AS room,
    GROUP_CONCAT(DISTINCT t.first_name || ' ' || t.last_name || ' (' || pj.role || ')') AS teachers,
    GROUP_CONCAT(DISTINCT s.first_name || ' ' || s.last_name) AS students
    FROM 
        project_presentations pp
    JOIN 
        rooms r ON pp.room_id = r.id
    JOIN 
        projects p ON pp.project_id = p.id
    LEFT JOIN 
        project_juries pj ON pj.project_id = p.id
    LEFT JOIN 
        users t ON pj.teacher_id = t.id
    LEFT JOIN 
        project_students ps ON ps.project_id = p.id
    LEFT JOIN 
        users s ON ps.student_id = s.id
    GROUP BY 
        p.id, pp.date, r.room;
    `);

    useEffect(() => {
        if (data) {
          setDefenseSchedules(data?.data);
        }
      }, [data]);


  type DefenseSchedule = Prettier<User & Room & Student & Teacher & FullProject>;

  const columns = useMemo<ColumnDef<DefenseSchedule>[]>(() => {
    return [
      {
        accessorKey: "title",
        header: "Title",
        enableSorting: true,
        cell: (props) => props.getValue(),
      },
      {
        accessorKey: "date",
        header: "Date",
        enableSorting: true,
        cell: (props) => props.getValue(),
      },
      {
        accessorKey: "time",
        header: "Time",
        enableSorting: true,
        cell: (props) => props.getValue(),
      },
      {
        accessorKey: "room",
        header: "Room",
        enableSorting: true,
        cell: (props) => props.getValue(),
      },
      {
        accessorKey: "teachers",
        header: "Teachers",
        enableSorting: true,
        cell: (props) => props.getValue(),
      },
      {
        accessorKey: "students",
        header: "Students",
        enableSorting: true,
        cell: (props) => props.getValue(),
      },
      {
        header: "Actions",
        cell: (props) => {
          const defense = props.row.original;
          return (
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onShowValidation(defense.id)}
              >
                Update
              </button>
            </div>
          );
        }
      }
    ];
  }, []);

  // const onShow = useCallback((defenseId: number) => {
  //   ref.current?.show();
  // }, []);

  // const onClose = useCallback(() => {
  //   ref.current?.close();
  //   setDefenseId(0);
  // }, []);

  const onShowValidation = useCallback((projectId: number) => {
    ValidationRef.current?.show();
    setProjectId(projectId);
  }, []);

  const onCloseValidation = useCallback(() => {
    ValidationRef.current?.close();
    setProjectId(0);
  }, []);



  // Export Schedule
  const handleExportSchedule = () => {
    const csvContent = [
      ["Date", "Time", "Room", "Teachers", "Students"],
      ...JuriesSlots.map((slot) => [
        slot.date,
        slot.time,
        slot.room,
        slot.teachers,
        slot.students,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Juries_schedule.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading defense schedules.</div>;
  }

  return (
    <div className="mx-auto mt-4" style={{ width: "95%", minHeight: "100vh" }}>
      <h2>Juries Schedule</h2>
      <p className="h6 text-secondary mb-3">
        This page allows you to generate and view Jurie schedule.
      </p>
      <div className="mb-3">
        {/* <button
          className="btn btn-primary"
          onClick={() => onShow()}
        >
          Set Juries Plan
        </button> */}
        <button
          className="btn btn-secondary ms-2"
          onClick={handleExportSchedule}
        >
          Export Schedule
        </button>
      </div>

      <Table columns={columns} data={defenseSchedules} />
      <ValidationModal ref={ValidationRef} projectId={projectId} onClose={onCloseValidation}/>

    </div>
  );
}
