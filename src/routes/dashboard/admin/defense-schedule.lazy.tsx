import * as React from 'react'
import { createLazyFileRoute } from '@tanstack/react-router'
import AddDefenseSlot from '../../../components/Admin/AddDefenseSlot'
import { z } from 'zod'

const JuriesSlotSchema = z.object({
  date: z.string().date(),
  time: z.string().time(),
  room: z.string().min(1),
  teachers: z.string().min(1),
  students: z.string().min(1),
})

type JuriesSlot = z.infer<typeof JuriesSlotSchema>

export const Route = createLazyFileRoute('/dashboard/admin/defense-schedule')({
  component: RouteComponent,
})

function RouteComponent() {
  const [JuriesSlots, setJuriesSlots] = React.useState<JuriesSlot[]>([
    {
      date: '2024-01-20',
      time: '10:00 AM',
      room: 'S101',
      teachers: 'John Doe, Jane Smith',
      students: 'Alice Brown, Bob Green',
    },
    {
      date: '2024-01-21',
      time: '02:00 PM',
      room: 'N102',
      teachers: 'Alice Green, Mark Brown',
      students: 'Bob Johnson, Sarah White',
    },
  ])
  const [showAddModal, setShowAddModal] = React.useState(false)

  // Add Juries Slot
  const handleAddSlot = (newSlot: JuriesSlot) => {
    setJuriesSlots([...JuriesSlots, newSlot])
    setShowAddModal(false)
  }

  // Cancel Add Juries Slot
  const handleCancelAdd = () => {
    setShowAddModal(false)
  }

  // Export Schedule
  const handleExportSchedule = () => {
    const csvContent = [
      ['Date', 'Time', 'Room', 'Participants'], // Headers
      ...JuriesSlots.map((slot) => [
        slot.date,
        slot.time,
        slot.room,
        slot.teachers,
        slot.students,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'Juries_schedule.csv'
    link.click()
    URL.revokeObjectURL(url)
  }
  return (
    <div className="mx-auto mt-4" style={{ width: '95%', minHeight: '100vh' }}>
      <h2>Juries Management</h2>
      <div className="mb-3">
        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          Set Juries Plan
        </button>
        <button
          className="btn btn-secondary ms-2"
          onClick={handleExportSchedule}
        >
          Export Schedule
        </button>
      </div>

      <div style={{overflowX:"auto"}}>
        <table className="table table-bordered table-striped" style={{whiteSpace:"nowrap"}}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Room</th>
              <th>Teachers</th>
              <th>Students</th>
            </tr>
          </thead>
          <tbody>
            {JuriesSlots.map((slot, index) => (
              <tr key={index}>
                <td>{slot.date}</td>
                <td>{slot.time}</td>
                <td>{slot.room}</td>
                <td>{slot.teachers}</td>
                <td>{slot.students}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Juries Slot Modal */}
      {showAddModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
          style={{ zIndex: 1050 }}
        >
          <AddDefenseSlot onAdd={handleAddSlot} onCancel={handleCancelAdd} />
        </div>
      )}
    </div>
  )
}
