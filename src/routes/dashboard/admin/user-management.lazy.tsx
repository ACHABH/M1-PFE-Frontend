import type { ColumnDef } from "@tanstack/react-table";
import type { User } from "../../../types/db";
import { ElementRef, useCallback, useMemo, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { USER_ROLE, type UserRole } from "../../../constant/enum";
import UploadCSV2 from "../../../components/admin/UploadCSV2";
import Table from "../../../components/table";
import {
  useGetAll as useGetAllUsers,
  useDelete as useDeleteUser,
} from "../../../api/user";
import UserModal from "../../../components/admin/user-modal";

export const Route = createLazyFileRoute("/dashboard/admin/user-management")({
  component: Component,
});

function Component() {
  const ref = useRef<ElementRef<typeof UserModal>>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const { data: users } = useGetAllUsers();
  const { mutateAsync: deleteUser } = useDeleteUser();

  const activeUsers = useMemo(() => {
    return users?.filter((user) => !user.deleted_at) ?? [];
  }, [users]);

  const onShow = useCallback((userId: number = 0) => {
      ref.current?.show();
      setUserId(userId);
    }, []);
  
    const onClose = useCallback(() => {
      ref.current?.close();
      setUserId(0);
    }, []);

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
        accessorKey: "role",
        header: "Role",
        enableSorting: true,
        cell: (props) => props.getValue(),
      },
      {
        accessorKey: "id",
        header: "Actions",
        enableSorting: false,
        cell(props) {
          const userId = props.getValue<number>();
          return (
            <Container as="div" style={{ display: "flex", gap: 5 }}>
              <Button
                type="button"
                variant="warning"
                size="sm"
                onClick={() => onShow(userId)}
              >
                Update
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => {
                  const confirmation = window.confirm("Confirm delete action?");
                  if (confirmation) deleteUser(userId);
                }}
              >
                Delete
              </Button>
            </Container>
          );
        },
      },
    ];
  }, [deleteUser, onShow]);

  const [showUploadModal, setShowUploadModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const filteredUsers = useMemo(() => {
    return (
      activeUsers?.filter(
        (user) =>
          (selectedRole === null || user.role === selectedRole) &&
          (user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase()))
      ) ?? []
    );
  }, [searchTerm, selectedRole, users]);

  const handleUploadCSV = (file: File) => {
    alert(`File ${file.name} uploaded! Users will be processed.`);
    setShowUploadModal(false);
  };

  // const handleBulkDelete = () => {
  //   if (window.confirm("Are you sure you want to delete selected users?")) {
  //     setUsers(users.filter((user) => !selectedUsers.includes(user.email)));
  //     setSelectedUsers([]);
  //   }
  // };

  const handleExportUsers = () => {
    const csvContent = [
      ["first name", "last name", "email", "role"],
      ...filteredUsers.map((user) => [
        user.first_name,
        user.last_name,
        user.email,
        user.role,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "users_list.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCancelUpload = () => {
    setShowUploadModal(false);
  };

  return (
    <Container as="div" style={{ width: "95%", minHeight: "100vh" }}>
      <h1>User Management</h1>

      {/* Search and Filters */}
      <Container as="div" style={{ display: "flex", gap: 5 }}>
        <Form.Control
          type="text"
          className="mb-2"
          style={{ width: "70%" }}
          placeholder="Search by name, email, or role"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Form.Select
          className="mb-2"
          style={{ width: "30%" }}
          value={selectedRole ?? ""}
          onChange={(e) =>
            setSelectedRole((e.target.value as UserRole) || null)
          }
        >
          <option value="">All</option>
          {USER_ROLE.map((role) =>
            role === "admin" || role === "owner" ? null : (
              <option key={role} value={role}>
                {role}
              </option>
            )
          )}
        </Form.Select>
      </Container>
      <Container as="div" style={{ display: "flex", gap: 5 }} className="mb-2">
        {/* <Button
          type="button"
          variant="danger"
          className="ms-2"
          onClick={handleBulkDelete}
          disabled={selectedUsers.length === 0}
        >
          Delete Selected
        </Button> */}
        <Link className="btn btn-primary" to="/dashboard/admin/add-user">
          Add User
        </Link>
        <Button
          type="button"
          variant="secondary"
          className="ms-2"
          onClick={handleExportUsers}
        >
          Export User List
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="ms-2"
          onClick={() => setShowUploadModal(true)}
        >
          Upload CSV
        </Button>
      </Container>

      <Table data={filteredUsers} columns={columns} />
      <UserModal ref={ref} userId={userId ?? 0} onClose={onClose} />
      {showUploadModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
          style={{ zIndex: 1050 }}
        >
          <UploadCSV2
            onUpload={handleUploadCSV}
            onCancel={handleCancelUpload}
          />
        </div>
      )}
    </Container>
  );
}
