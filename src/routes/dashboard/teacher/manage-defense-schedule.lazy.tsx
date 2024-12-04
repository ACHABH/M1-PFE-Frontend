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
      status: 'Rejceted',
    },
  ])

  return (
    <div className="container mt-4">
      <h3>Jurie Schedule</h3>
      <p className='h6 my-3 text-secondary'>Assigned Defense Roles</p>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Student</th>
            <th>Project</th>
            <th>Date</th>
            <th>Time</th>
            <th>Role</th>
            <th>Status</th>
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
                      : 'bg-danger'
                  }`}
                >
                  {schedule.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
