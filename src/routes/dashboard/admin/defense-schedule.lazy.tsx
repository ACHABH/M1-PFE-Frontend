import { ElementRef, useCallback, useMemo, useRef, useState } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import JurieModal from "../../../components/admin/jurie-modal";
import { z } from "zod";
import Table from "../../../components/table";
import type { Room, Student, Teacher, User } from "../../../types/db";
import { ColumnDef } from "@tanstack/react-table";
import { Prettier } from "../../../types/util";

const JuriesSlotSchema = z.object({
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
  const [defenseId, setDefenseId] = useState(0);

  const [JuriesSlots] = useState<JuriesSlot[]>([
    {
      date: "2024-01-20",
      time: "10:00 AM",
      room: "S101",
      teachers: "John Doe, Jane Smith",
      students: "Alice Brown, Bob Green",
    },
    {
      date: "2024-01-21",
      time: "02:00 PM",
      room: "N102",
      teachers: "Alice Green, Mark Brown",
      students: "Bob Johnson, Sarah White",
    },
  ]);

  // const [showAddModal, setShowAddModal] = useState(false);

  // // Add Juries Slot
  // const handleAddSlot = (/* newSlot: JuriesSlot */) => {
  //   // setJuriesSlots([...JuriesSlots, newSlot]) // handled by query
  //   setShowAddModal(false);
  // };

  // // Cancel Add Juries Slot
  // const handleCancelAdd = () => {
  //   setShowAddModal(false);
  // };

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

  type DefenseSchedule = Prettier<User & Room & Student & Teacher>

  const columns = useMemo<ColumnDef<DefenseSchedule>[]>(() => {
    return [
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
    ];
  }, []);

  const onShow = useCallback((defenseId: number = 0) => {
    ref.current?.show();
    setDefenseId(defenseId);
  }, []);

  const onClose = useCallback(() => {
    ref.current?.close();
    setDefenseId(0);
  }, []);

  return (
    <div className="mx-auto mt-4" style={{ width: "95%", minHeight: "100vh" }}>
      <h2>Juries Schedule</h2>
      <p className="h6 text-secondary mb-3">
        This page allows you to generate and view Jurie schedule.
      </p>
      <div className="mb-3">
        <button
          className="btn btn-primary"
          onClick={() => onShow()}
        >
          Set Juries Plan
        </button>
        <button
          className="btn btn-secondary ms-2"
          onClick={handleExportSchedule}
        >
          Export Schedule
        </button>
      </div>

      <Table columns={columns} data={JuriesSlots} />
      <JurieModal ref={ref} defenseID={defenseId} onClose={onClose}/>

      {/* <div style={{ overflowX: "auto" }}>
        <table
          className="table table-bordered table-striped"
          style={{ whiteSpace: "nowrap" }}
        >
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Room</th>
              <th>Teachers</th>
              <th>Students</th>
            </tr>
          </thead>
          <tbody>
            {JuriesSlots.map((slot, index) => (
              <tr key={index}>
                <td>{slot.date}</td>
                <td>{slot.time}</td>
                <td>{slot.room}</td>
                <td>{slot.teachers}</td>
                <td>{slot.students}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}

      {/* Add Juries Slot Modal */}
      {/* {showAddModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
          style={{ zIndex: 1050 }}
        >
          <AddDefenseSlot onAdd={handleAddSlot} onCancel={handleCancelAdd} />
        </div>
      )} */}
    </div>
  );
}
