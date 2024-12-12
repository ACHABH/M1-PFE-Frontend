import type { ColumnDef } from "@tanstack/react-table";
import type { Room } from "../../../types/db";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { z } from "zod";
import Table from "../../../components/table";
import AddRoom from "../../../components/Admin/AddRoom";
import { useGetAll as useGetAllRooms } from "../../../api/room";

const FormSchema = z.object({
  room: z.string().min(1),
  // status: z.string().min(1),
});

type ZodFormSchema = z.infer<typeof FormSchema>;

export const Route = createLazyFileRoute("/dashboard/admin/rooms")({
  component: Component,
});

function Component() {
  const { data: rooms } = useGetAllRooms();

  // const [Rooms] = useState<unknown[]>([
  //   {
  //     id: 0,
  //     room: "S101",
  //     // status: "Available"
  //   },
  //   {
  //     id: 1,
  //     room: "N102",
  //     // status: "Not Available"
  //   },
  // ]);

  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddRoom = () => {
    // setJuriesRooms([...Rooms, newRoom]) // handled by query
    setShowAddModal(false);
  };

  const handleCancelAdd = () => {
    setShowAddModal(false);
  };

  const handleExportSchedule = () => {
    const csvContent = [["Room"], ...Rooms.map((Room) => [Room.room])]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Rooms.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const columns = useMemo<ColumnDef<Room>[]>(() => {
    return [
      {
        accessorKey: "room",
        header: "Room",
        enableSorting: true,
        cell: (props) => props.getValue(),
      },
      {
        accessorKey: "id",
        header: "Actions",
        enableSorting: false,
        cell(props) {
          const roomId = props.getValue<number>();
          return (
            <Container as="div" style={{ display: "flex", gap: 5 }}>
              <Button
                type="button"
                variant="warning"
                size="sm"
                onClick={() => {
                  // setCurrentTemplate(template);
                  // setShowForm(true);
                }}
              >
                Edit
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => {
                  const confirmation = window.confirm("Confirm delete action?");
                  // if (confirmation) deleteTemplate(emailId);
                }}
              >
                Delete
              </Button>
            </Container>
          );
        },
      },
    ];
  }, []);

  return (
    <div className="mx-auto mt-4" style={{ width: "95%", minHeight: "100vh" }}>
      <h2>Room Management</h2>

      <Container as="div" className="mb-3" style={{ display: "flex", gap: 5 }}>
        <Button
          type="button"
          variant="primary"
          onClick={() => setShowAddModal(true)}
        >
          Add Room
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={handleExportSchedule}
        >
          Export Rooms
        </Button>
      </Container>

      <Table columns={columns} data={rooms} />

      {/* Add Juries Room Modal */}
      {showAddModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
          style={{ zIndex: 1050 }}
        >
          <AddRoom onAdd={handleAddRoom} onCancel={handleCancelAdd} />
        </div>
      )}
    </div>
  );
}
