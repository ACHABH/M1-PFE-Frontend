import { createLazyFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createLazyFileRoute(
  '/dashboard/teacher/manage-defense-schedule',
)({
  component: RouteComponent,
})


function RouteComponent() {
  const [defenseSchedules, setDefenseSchedules] = useState([
    {
      student: 'John Doe',
      project: 'AI Research',
      date: '2024-01-20',
      time: '10:00 AM',
      role: 'Supervisor',
      status: 'Confirmed',
    },
    {
      student: 'Jane Smith',
      project: 'Robotics Design',
      date: '2024-01-22',
      time: '02:00 PM',
      role: 'Examiner',
      status: 'Pending Confirmation',
    },
  ])

  const [preferredDates, setPreferredDates] = useState<string[]>([])
  const [newPreferredDate, setNewPreferredDate] = useState('')
  const [showPreferredDateForm, setShowPreferredDateForm] = useState(false)

  const handleAddPreferredDate = () => {
    if (newPreferredDate) {
      setPreferredDates([...preferredDates, newPreferredDate])
      setNewPreferredDate('')
      alert('Preferred date added successfully!')
    }
  }

  const handleConfirmRole = (index: number) => {
    setDefenseSchedules(
      defenseSchedules.map((schedule, i) =>
        i === index ? { ...schedule, status: 'Confirmed' } : schedule,
      ),
    )
    alert('Role confirmed successfully!')
  }
  return (
    <div className="container mt-4">
      <h3>Manage Defense Schedule</h3>

      <div className="mb-4">
        <h5>Preferred Dates</h5>
        <ul className="list-group mb-3">
          {preferredDates.map((date, index) => (
            <li key={index} className="list-group-item">
              {date}
            </li>
          ))}
        </ul>
        {showPreferredDateForm ? (
          <div className="d-flex align-items-center">
            <input
              type="date"
              className="form-control me-2"
              value={newPreferredDate}
              onChange={(e) => setNewPreferredDate(e.target.value)}
            />
            <button
              className="btn btn-primary"
              onClick={handleAddPreferredDate}
            >
              Add Date
            </button>
            <button
              className="btn btn-secondary ms-2"
              onClick={() => setShowPreferredDateForm(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            className="btn btn-primary"
            onClick={() => setShowPreferredDateForm(true)}
          >
            Add Preferred Date
          </button>
        )}
      </div>

      <h5>Assigned Defense Roles</h5>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Student</th>
            <th>Project</th>
            <th>Date</th>
            <th>Time</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {defenseSchedules.map((schedule, index) => (
            <tr key={index}>
              <td>{schedule.student}</td>
              <td>{schedule.project}</td>
              <td>{schedule.date}</td>
              <td>{schedule.time}</td>
              <td>{schedule.role}</td>
              <td>
                <span
                  className={`badge ${
                    schedule.status === 'Confirmed'
                      ? 'bg-success'
                      : 'bg-warning'
                  }`}
                >
                  {schedule.status}
                </span>
              </td>
              <td>
                {schedule.status === 'Pending Confirmation' && (
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleConfirmRole(index)}
                  >
                    Confirm
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
