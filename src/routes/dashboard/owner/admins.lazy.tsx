import type { ColumnDef } from "@tanstack/react-table";
import type { User } from "../../../types/db";
import { createLazyFileRoute } from "@tanstack/react-router";
import { type ElementRef, useMemo, useRef } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import AdminModel from "../../../components/owner/admin-model";
import { exportCSV } from "../../../lib/csv";
import Table from "../../../components/table";
import {
  useDelete as useDeleteAdmin,
  useGetAll as useGetAllAdmins,
} from "../../../api/admin";

export const Route = createLazyFileRoute("/dashboard/owner/admins")({
  component: Component,
});

function Component() {
  const ref = useRef<ElementRef<typeof AdminModel>>(null);
  const { data: admins } = useGetAllAdmins();
  const { mutateAsync: deleteAdmin } = useDeleteAdmin();

  const columns = useMemo<ColumnDef<User>[]>(() => {
    return [
      {
        accessorKey: "first_name",
        header: "First name",
        enableSorting: true,
        cell: (props) => props.getValue(),
      },
      {
        accessorKey: "last_name",
        header: "Last name",
        enableSorting: true,
        cell: (props) => props.getValue(),
      },
      {
        accessorKey: "email",
        header: "Email",
        enableSorting: true,
        cell: (props) => props.getValue(),
      },
      {
        accessorKey: "id",
        header: "Actions",
        enableSorting: false,
        cell(props) {
          const adminId = props.getValue<number>();
          return (
            <Button
              variant="danger"
              size="sm"
              onClick={async () => {
                const confirmation = window.confirm("Confirm delete action ?");
                if (!confirmation) return;
                deleteAdmin(adminId);
              }}
            >
              Delete
            </Button>
          );
        },
      },
    ];
  }, [deleteAdmin]);

  return (
    <Container as="div" className="mt-4" style={{ minHeight: "100vh" }}>
      <Container
        as="div"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          gap: 3,
          marginBottom: 15,
        }}
      >
        <h3>Admins management</h3>
        <Container
          as="div"
          style={{
            display: "flex",
            gap: 3,
          }}
        >
          <Button
            variant="primary"
            onClick={() => {
              ref.current?.show();
            }}
          >
            Add Admin
          </Button>
          <Button
            variant="info"
            onClick={() => {
              exportCSV(
                [
                  "id",
                  "first_name",
                  "last_name",
                  "email",
                  "email_verified_at",
                  "created_at",
                  "updated_at",
                  "deleted_at",
                ],
                admins.map((admin) => [
                  admin.id,
                  admin.first_name,
                  admin.last_name,
                  admin.email,
                  admin.email_verified_at,
                  admin.created_at,
                  admin.updated_at,
                  admin.deleted_at,
                ]),
                "admins"
              );
            }}
          >
            Export CSV
          </Button>
        </Container>
      </Container>
      <Table data={admins} columns={columns} />
      <AdminModel ref={ref} />
    </Container>
  );
}
