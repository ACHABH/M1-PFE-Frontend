import type { ColumnDef } from "@tanstack/react-table";
import type { User } from "../../../types/db";
import { ElementRef, useCallback, useMemo, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FaUserPlus, FaFileExport, FaSearch, FaEdit, FaTrash, FaUpload } from 'react-icons/fa';
import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { USER_ROLE, type UserRole } from "../../../constant/enum";
import UploadCSV2 from "../../../components/admin/UploadCSV2";
import Table from "../../../components/Table";
import {
  useGetAll as useGetAllUsers,
  useDelete as useDeleteUser,
} from "../../../api/user";
import UserModal from "../../../components/admin/user-modal";
import { useTheme } from "../../../contexts/theme";

export const Route = createLazyFileRoute("/dashboard/admin/user-management")({
  component: Component,
});

function Component() {
  const ref = useRef<ElementRef<typeof UserModal>>(null);
  const [userId, setUserId] = useState<number>(0);
  const { data: users, isLoading } = useGetAllUsers();
  const { mutateAsync: deleteUser } = useDeleteUser();
  const { theme } = useTheme() ?? { theme: 'light' };
  const activeUsers = useMemo(() => {
    return users?.filter((user:any) => !user.deleted_at) ?? [];
  }, [users]);

  const onShow = useCallback((userId: number = 0) => {
    ref.current?.show();
    setUserId(userId);
  }, []);

  const onClose = useCallback(() => {
    ref.current?.close();
    setUserId(0);
  }, []);

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
        cell: (props) => (
          <span className="text-capitalize badge bg-primary">
            {props.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "id",
        header: "Actions",
        enableSorting: false,
        cell(props) {
          const userId = props.getValue<number>();
          return (
            <div className="d-flex gap-2">
              <Button
                type="button"
                variant="outline-warning"
                size="sm"
                onClick={() => onShow(userId)}
                className="d-flex align-items-center gap-1"
              >
                <FaEdit /> Edit
              </Button>
              <Button
                type="button"
                variant="outline-danger"
                size="sm"
                onClick={() => {
                  const confirmation = window.confirm("Confirm delete action?");
                  if (confirmation) deleteUser(userId);
                }}
                className="d-flex align-items-center gap-1"
              >
                <FaTrash /> Delete
              </Button>
            </div>
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
  }, [activeUsers, searchTerm, selectedRole]);

  const handleUploadCSV = (file: File) => {
    alert(`File ${file.name} uploaded! Users will be processed.`);
    setShowUploadModal(false);
  };

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
    <Container fluid className="px-4 py-3">
      <Card className={`shadow-sm border-0 ${theme === 'dark' ? 'bg-dark' : ''}`}>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3 mb-0">User Management</h1>
            <div className="d-flex gap-2">
              <Link
                to="/dashboard/admin/add-user"
                className="btn btn-primary d-flex align-items-center gap-2"
              >
                <FaUserPlus /> Add User
              </Link>
              <Button
                variant="outline-secondary"
                onClick={handleExportUsers}
                className="d-flex align-items-center gap-2"
              >
                <FaFileExport /> Export
              </Button>
              <Button
                variant="outline-primary"
                onClick={() => setShowUploadModal(true)}
                className="d-flex align-items-center gap-2"
              >
                <FaUpload /> Upload CSV
              </Button>
              
            </div>
          </div>

          <Row className="g-3 mb-4">
            <Col md={8}>
              <div className="input-group">
                <span className={`input-group-text ${theme === 'dark' ? 'bg-dark border-secondary' : 'bg-white'}`}>
                  <FaSearch className="text-muted" />
                </span>
                <Form.Control
                  type="text"
                  placeholder="Search by name, email, or role"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={theme === 'dark' ? 'bg-dark border-secondary' : ''}
                />
              </div>
            </Col>
            <Col md={4}>
              <Form.Select
                value={selectedRole ?? ""}
                onChange={(e) =>
                  setSelectedRole((e.target.value as UserRole) || null)
                }
                className={theme === 'dark' ? 'bg-dark border-secondary' : ''}
              >
                <option value="">All Roles</option>
                {USER_ROLE.map((role) =>
                  role === "admin" || role === "owner" ? null : (
                    <option key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                  )
                )}
              </Form.Select>
            </Col>
          </Row>

<<<<<<< HEAD
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
=======
          <div className="table-responsive">
            <Table
              columns={columns}
              data={filteredUsers}
              isLoading={isLoading}
            />
          </div>
        </Card.Body>
      </Card>

      <UserModal ref={ref} userId={userId} onClose={onClose} />
      <UploadCSV2
        show={showUploadModal}
        onUpload={handleUploadCSV}
        onCancel={handleCancelUpload}
      />
>>>>>>> dev
    </Container>
  );
}
