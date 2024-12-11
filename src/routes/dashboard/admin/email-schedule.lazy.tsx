import * as React from 'react'
import { createLazyFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import AddEmailSchedule from '../../../components/Admin/AddEmailSchedule'
import EditEmailSchedule from '../../../components/Admin/EditEmailSchedule'

export const Route = createLazyFileRoute('/dashboard/admin/email-schedule')({
  component: RouteComponent,
})

const ScheduleSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  date: z.string().date(),
  time: z.string().time(),
})

type Schedule = z.infer<typeof ScheduleSchema>

function RouteComponent() {
  const [schedules, setSchedules] = React.useState<Schedule[]>([
    {
      id: 1,
      title: 'PFE Proposal Reminder',
      description: 'Reminder to submit PFE proposals.',
      date: '2024-12-01',
      time: '10:00 AM',
    },
    {
      id: 2,
      title: 'Form Submission Deadline',
      description: 'Notification for form submission deadline.',
      date: '2024-12-10',
      time: '05:00 PM',
    },
  ])

  const templates = [
    { id: 1, title: "PFE Proposal Reminder", description: "Submit your PFE proposals now!" },
    { id: 2, title: "Form Submission Deadline", description: "Don't forget to submit your forms!" },
  ];


  const [showAddModal, setShowAddModal] = React.useState(false)
  const [showEditModal, setShowEditModal] = React.useState(false)
  const [editingSchedule, setEditingSchedule] = React.useState<Schedule | null>(
    null,
  )
  const [searchTerm, setSearchTerm] = React.useState('')
  const [dateFilter, setDateFilter] = React.useState('')

  // Add Schedule Handler
  const handleAddSchedule = (/* newSchedule: Omit<Schedule, 'id'> */) => {
    // setSchedules([...schedules, { ...newSchedule, id: Date.now() }])
    setShowAddModal(false)
    alert('Schedule added successfully!')
  }

  const handleCancelEmail = () => {
    setShowAddModal(false)
  }

  const handleCancelEdit = () => {
    setShowEditModal(false)
    setEditingSchedule(null)
  }

  // Edit Schedule Handler
  const handleEditSchedule = (updatedSchedule: Schedule) => {
    setSchedules(
      schedules.map((schedule) =>
        schedule.id === updatedSchedule.id ? updatedSchedule : schedule,
      ),
    )
    setShowEditModal(false)
    alert('Schedule updated successfully!')
  }

  // Delete Schedule Handler
  const handleDeleteSchedule = (id: number) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      setSchedules(schedules.filter((schedule) => schedule.id !== id))
      alert('Schedule deleted successfully!')
    }
  }

  // Filter Schedules
  const filteredSchedules = schedules.filter(
    (schedule) =>
      schedule.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!dateFilter || schedule.date === dateFilter),
  )

  return (
    <div className="container mt-4">
      <h2>Email Schedule</h2>

      {/* Search and Filter */}
      <div className="mb-3 d-flex align-items-center">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Search by title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '69.5%' }}
        />
        <input
          type="date"
          className="form-control w-auto me-2"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          Add Schedule
        </button>
      </div>

      {/* Schedule Table */}
      <div style={{overflowX:"auto"}}>
        <table className="table table-bordered table-striped" style={{whiteSpace:"nowrap"}}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Date</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchedules.map((schedule) => (
              <tr key={schedule.id}>
                <td>{schedule.title}</td>
                <td>{schedule.description}</td>
                <td>{schedule.date}</td>
                <td>{schedule.time}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => {
                      setEditingSchedule(schedule)
                      setShowEditModal(true)
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteSchedule(schedule.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Add Schedule Modal */}
      {showAddModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
          style={{ zIndex: 1050 }}
        >
          <AddEmailSchedule
            templates={templates}
            onAdd={handleAddSchedule}
            onCancel={handleCancelEmail}
          />
        </div>
      )}

      {/* Edit Schedule Modal */}
      {showEditModal && editingSchedule && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
          style={{ zIndex: 1050 }}
        >
          <EditEmailSchedule
            schedule={editingSchedule}
            onUpdate={handleEditSchedule}
            onCancel={handleCancelEdit}
          />
        </div>
      )}
    </div>
  )
}
