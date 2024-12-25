import type { ColumnDef } from "@tanstack/react-table";
import type { Room } from "../../../types/db";
import { createLazyFileRoute } from "@tanstack/react-router";
import { ElementRef, useCallback, useMemo, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Table from "../../../components/table";
import RoomModal from "../../../components/admin/room-modal";
import {
  useGetAll as useGetAllRooms,
  useDelete as useDeleteRoom,
} from "../../../api/room";
import { exportCSV } from "../../../lib/csv";

export const Route = createLazyFileRoute("/dashboard/admin/rooms")({
  component: Component,
});

function Component() {
  const ref = useRef<ElementRef<typeof RoomModal>>(null);
  const [roomId, setRoomId] = useState(0);

  const { data: rooms } = useGetAllRooms();
  const { mutateAsync: deleteRoom } = useDeleteRoom();

  const onShow = useCallback((roomId: number = 0) => {
    ref.current?.show();
    setRoomId(roomId);
  }, []);

  const onClose = useCallback(() => {
    ref.current?.close();
    setRoomId(0);
  }, []);

  // const handleExportSchedule = useCallback(() => {
  //   const csvContent = [
  //     ["id", "room", "create_at", "updated_at", "deleted_at"],
  //     ...rooms.map((room) => [
  //       room.id,
  //       room.room,
  //       room.created_at,
  //       room.updated_at,
  //       room.deleted_at,
  //     ]),
  //   ]
  //     .map((row) => row.join(","))
  //     .join("\n");

  //   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  //   const url = URL.createObjectURL(blob);
  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.download = "rooms.csv";
  //   link.click();
  //   URL.revokeObjectURL(url);
  // }, [rooms]);

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
                onClick={() => onShow(roomId)}
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
  }, [deleteRoom, onShow]);

  return (
    <Container
      as="div"
      className="mx-auto mt-4"
      style={{ width: "95%", minHeight: "100vh" }}
    >
      <h2>Room Management</h2>
      <Container as="div" className="mb-3" style={{ display: "flex", gap: 5 }}>
        <Button type="button" variant="primary" onClick={() => onShow()}>
          Add Room
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            exportCSV(
              ["id", "room", "create_at", "updated_at", "deleted_at"],
              rooms.map((room) => [
                room.id,
                room.room,
                room.created_at,
                room.updated_at,
                room.deleted_at,
              ]),
              "rooms"
            );
          }}
        >
          Export Rooms
        </Button>
      </Container>
      <Table columns={columns} data={rooms} />
      <RoomModal ref={ref} roomId={roomId} onClose={onClose} />
    </Container>
  );
}
