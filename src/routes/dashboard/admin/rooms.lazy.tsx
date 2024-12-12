import type { ColumnDef } from "@tanstack/react-table";
import type { Room } from "../../../types/db";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Table from "../../../components/table";
import AddRoom from "../../../components/Admin/AddRoom";
import {
  useGetAll as useGetAllRooms,
  useUpdate as useUPdateRoom,
  useDelete as useDeleteRoom,
} from "../../../api/room";

export const Route = createLazyFileRoute("/dashboard/admin/rooms")({
  component: Component,
});

function Component() {
  const { data: rooms } = useGetAllRooms();
  const { mutateAsync: updateRoom } = useUPdateRoom();
  const { mutateAsync: deleteRoom } = useDeleteRoom();

  const [showAddModal, setShowAddModal] = useState(false);

  const onAdd = () => {
    // setJuriesRooms([...Rooms, newRoom]) // handled by query
    setShowAddModal(false);
  };

  const onCancel = () => {
    setShowAddModal(false);
  };

  const handleExportSchedule = () => {
    const csvContent = [
      ["id", "room", "create_at", "updated_at", "deleted_at"],
      ...rooms.map((room) => [
        room.id,
        room.room,
        room.created_at,
        room.updated_at,
        room.deleted_at,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "rooms.csv";
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
                Update
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => {
                  const confirmation = window.confirm("Confirm delete action?");
                  if (confirmation) deleteRoom(roomId);
                }}
              >
                Delete
              </Button>
            </Container>
          );
        },
      },
    ];
  }, [deleteRoom]);

  return (
    <Container
      as="div"
      className="mx-auto mt-4"
      style={{ width: "95%", minHeight: "100vh" }}
    >
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
          <AddRoom onAdd={onAdd} onCancel={onCancel} />
        </div>
      )}
    </Container>
  );
}
