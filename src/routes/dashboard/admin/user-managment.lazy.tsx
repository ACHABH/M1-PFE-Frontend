import type { ColumnDef } from "@tanstack/react-table";
import type { User } from "../../../types/db";
import { useMemo, useState } from "react";
import { createLazyFileRoute, Link } from "@tanstack/react-router";
import EditUser from "../../../components/Admin/EditUser";
import UploadCSV2 from "../../../components/Admin/UploadCSV2";
import {
  useGetAll as useGetAllUsers,
  useDelete as useDeleteUser,
} from "../../../api/user";
import Table from "../../../components/Table";

export const Route = createLazyFileRoute("/dashboard/admin/user-managment")({
  component: RouteComponent,
});

function RouteComponent() {
  const { mutateAsync: deleteUser } = useDeleteUser();
  const [users, setUsers] = useState([
    {
      id: 1,
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      role: "Teacher",
    },
    {
      id: 2,
      first_name: "Jane",
      last_name: "Smith",
      email: "jane.smith@example.com",
      role: "Student",
    },
  ]);

  // const { data: users } = useGetAllUsers();

  // const handleEditUser = (updatedUser: User) => {
  //   setUsers(
  //     users.map((user) =>
  //       user.email === updatedUser.email ? updatedUser : user
  //     )
  //   );
  //   setShowEditModal(false);
  // };

  // const handleDeleteUser = (email: string) => {
  //   setUsers(users.filter((user) => user.email !== email));
  // };

  const columns = useMemo<ColumnDef<User>[]>(() => {
    return [
      {
        accessorKey: "first_name",
        header: "First name",
        // cell: (info) => info.getValue(),
      },
      {
        accessorKey: "last_name",
        header: "Last name",
        // cell: (info) => info.getValue(),
      },
      {
        accessorKey: "email",
        header: "Email",
        // cell: (info) => info.getValue(),
      },
      {
        accessorKey: "role",
        header: "Role",
      },
      {
        accessorKey: "id",
        header: "Actions",
        cell(props) {
          const userId = props.getValue<number>();

          return (
            <>
              <button
                type="button"
                className="btn btn-warning btn-sm me-2"
                onClick={() => {
                  // setEditingUser(user)
                  // setShowEditModal(true);
                }}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => {
                  deleteUser(userId);
                }}
              >
                Delete
              </button>
            </>
          );
        },
      },
    ];
  }, [deleteUser]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  // const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 5;

  // Filtered and Paginated Users
  const filteredUsers = useMemo(() => {
    return (
      users?.filter(
        (user) =>
          (selectedRole === "All" || user.role === selectedRole) &&
          (user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase()))
      ) ?? []
    );
  }, [searchTerm, selectedRole, users]);

  // const totalPages = useMemo(
  //   () => Math.ceil(filteredUsers.length / itemsPerPage),
  //   [filteredUsers.length]
  // );

  // const paginatedUsers = useMemo(() => {
  //   return filteredUsers.slice(
  //     (currentPage - 1) * itemsPerPage,
  //     currentPage * itemsPerPage
  //   );
  // }, [currentPage, filteredUsers]);

  const handleUploadCSV = (file: File) => {
    alert(`File ${file.name} uploaded! Users will be processed.`);
    setShowUploadModal(false);
  };

  const handleBulkDelete = () => {
    if (window.confirm("Are you sure you want to delete selected users?")) {
      setUsers(users.filter((user) => !selectedUsers.includes(user.email)));
      setSelectedUsers([]);
    }
  };

  const handleExportUsers = () => {
    const csvContent = [
      ["Name", "Email", "Role"],
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
    link.download = "user_list.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCancelUpload = () => {
    setShowUploadModal(false);
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingUser(null);
  };

  return (
    // <div className="container mt-4">
    <div className=" mx-auto mt-4" style={{ width: "95%", minHeight: "100vh" }}>
      <h2>User Management</h2>

      {/* Search and Filters */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Search by name, email, or role"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="form-select w-auto d-inline mb-2"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Student">Student</option>
          <option value="Teacher">Teacher</option>
          <option value="Company">Company</option>
        </select>
        <button
          className="btn btn-danger ms-2"
          onClick={handleBulkDelete}
          disabled={selectedUsers.length === 0}
        >
          Delete Selected
        </button>
        <button className="btn btn-secondary ms-2" onClick={handleExportUsers}>
          Export User List
        </button>
      </div>

      {/* Actions */}
      <div className="mb-3">
        <Link className="btn btn-primary" to="/dashboard/admin/add-user">
          Add User
        </Link>
        <button
          className="btn btn-secondary ms-2"
          onClick={() => setShowUploadModal(true)}
        >
          Upload CSV
        </button>
      </div>

      {/* User Table */}
      <Table data={users} columns={columns} />

      {showEditModal && editingUser && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
          style={{ zIndex: 1050 }}
        >
          <EditUser
            user={editingUser}
            // onUpdate={handleEditUser}
            onUpdate={() => {}}
            onCancel={handleCancelEdit}
          />
        </div>
      )}
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
    </div>
  );
}
