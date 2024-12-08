import { createLazyFileRoute, Link } from '@tanstack/react-router'
import EditUser from '../../../components/Admin/EditUser'
import UploadCSV2 from '../../../components/Admin/UploadCSV2'
import { useState } from 'react'
import { z } from 'zod'

export const Route = createLazyFileRoute('/dashboard/admin/user-managment')({
  component: RouteComponent,
})

const UserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  role: z.string(),
})

type User = z.infer<typeof UserSchema>

function RouteComponent() {
  const [users, setUsers] = useState([
    { name: 'John Doe', email: 'john.doe@example.com', role: 'Teacher' },
    { name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Student' },
  ])

  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('All')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Filtered and Paginated Users
  const filteredUsers = users.filter(
    (user) =>
      (selectedRole === 'All' || user.role === selectedRole) &&
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const handleEditUser = (updatedUser: User) => {
    setUsers(
      users.map((user) =>
        user.email === updatedUser.email ? updatedUser : user,
      ),
    )
    setShowEditModal(false)
  }

  const handleDeleteUser = (email: string) => {
    setUsers(users.filter((user) => user.email !== email))
  }

  const handleUploadCSV = (file: File) => {
    alert(`File ${file.name} uploaded! Users will be processed.`)
    setShowUploadModal(false)
  }

  const handleBulkDelete = () => {
    if (window.confirm('Are you sure you want to delete selected users?')) {
      setUsers(users.filter((user) => !selectedUsers.includes(user.email)))
      setSelectedUsers([])
    }
  }

  const handleExportUsers = () => {
    const csvContent = [
      ['Name', 'Email', 'Role'],
      ...filteredUsers.map((user) => [user.name, user.email, user.role]),
    ]
      .map((row) => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'user_list.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleCancelUpload = () => {
    setShowUploadModal(false)
  }

  const handleCancelEdit = () => {
    setShowEditModal(false)
    setEditingUser(null)
  }

  return (
    // <div className="container mt-4">
    <div className=" mx-auto mt-4" style={{ width: '95%', minHeight: '100vh' }}>
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
      <div style={{overflowX:"auto"}}>
        <table className="table table-bordered table-striped" style={{whiteSpace:"nowrap"}}>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    setSelectedUsers(
                      e.target.checked ? users.map((user) => user.email) : [],
                    )
                  }}
                />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.email}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.email)}
                    onChange={(e) =>
                      setSelectedUsers((prev) =>
                        e.target.checked
                          ? [...prev, user.email]
                          : prev.filter((email) => email !== user.email),
                      )
                    }
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => {
                      setEditingUser(user)
                      setShowEditModal(true)
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteUser(user.email)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div>
          <button
            className="btn btn-secondary btn-sm me-2"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          <button
            className="btn btn-secondary btn-sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {showEditModal && editingUser && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
          style={{ zIndex: 1050 }}
        >
          <EditUser
            user={editingUser}
            onUpdate={handleEditUser}
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
  )
}
