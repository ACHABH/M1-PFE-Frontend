import { ElementRef, useCallback, useMemo, useRef, useState } from "react";
import { createLazyFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { Button, Form, InputGroup } from "react-bootstrap";
import Table from "../../../components/Table";
import { ColumnDef } from "@tanstack/react-table";
import type { Email } from "../../../types/db";
import EmailModal from "../../../components/Admin/email-modal";

export const Route = createLazyFileRoute('/dashboard/admin/email-schedule')({
  component: RouteComponent,
})

const ScheduleSchema = z.object({
  id: z.number(),
  subject: z.string(),
  content: z.string(),
  // date: z.string().date(),
  // time: z.string().time(),
})

type Schedule = z.infer<typeof ScheduleSchema>

function RouteComponent() {
  const ref = useRef<ElementRef<typeof EmailModal>>(null);

  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      id: 1,
      subject: 'PFE Proposal Reminder',
      content: 'Reminder to submit PFE proposals.',
      // date: '2024-12-01',
      // time: '10:00 AM',
    },
    {
      id: 2,
      subject: 'Form Submission Deadline',
      content: 'Notification for form submission deadline.',
      // date: '2024-12-10',
      // time: '05:00 PM',
    },
  ])

  const templates = [
    { id: 1, subject: "PFE Proposal Reminder", content: "Submit your PFE proposals now!" },
    { id: 2, subject: "Form Submission Deadline", content: "Don't forget to submit your forms!" },
  ];


  // const [showAddModal, setShowAddModal] = useState(false)
  // const [showEditModal, setShowEditModal] = useState(false)
  
  // const handleAddSchedule = (/* newSchedule: Omit<Schedule, 'id'> */) => {
  //   // setSchedules([...schedules, { ...newSchedule, id: Date.now() }])
  //   setShowAddModal(false)
  //   alert('Schedule added successfully!')
  // }

  // const handleCancelEmail = () => {
  //   setShowAddModal(false)
  // }

  // const handleCancelEdit = () => {
  //   setShowEditModal(false)
  //   setEditingSchedule(null)
  // }

  // const handleEditSchedule = (updatedSchedule: Schedule) => {
  //   setSchedules(
  //     schedules.map((schedule) =>
  //       schedule.id === updatedSchedule.id ? updatedSchedule : schedule,
  //     ),
  //   )
  //   setShowEditModal(false)
  //   alert('Schedule updated successfully!')
  // }

  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(
    null,
  )
  const [searchTerm, setSearchTerm] = useState('')
  // const [dateFilter, setDateFilter] = useState('')

  const handleDeleteSchedule = (id: number) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      setSchedules(schedules.filter((schedule) => schedule.id !== id))
      alert('Schedule deleted successfully!')
    }
  }

  const filteredSchedules = schedules.filter(
    (schedule) =>
      schedule.subject.toLowerCase().includes(searchTerm.toLowerCase()) /*&&*/
      // (!dateFilter || schedule.date === dateFilter),
  )

  const onShow = useCallback(() => {
    ref.current?.show();
  }, []);

  const onClose = useCallback(() => {
    ref.current?.close();
    setEditingSchedule(null);
  }, []);

  const columns = useMemo<ColumnDef<Email>[]>(() => {
    return [
      {
        accessorKey: 'subject',
        header: 'Subject',
        enableSorting: true,
        cell: (props) => props.getValue(),
      },
      {
        accessorKey: 'content',
        header: 'Content',
        enableSorting: true,
        cell: (props) => props.getValue(),
      },
      // {
      //   accessorKey: 'date',
      //   header: 'Date',
      //   enableSorting: true,
      //   cell: (props) => props.getValue(),
      // },
      // {
      //   accessorKey: 'time',
      //   header: 'Time',
      //   enableSorting: true,
      //   cell: (props) => props.getValue(),
      // },
      {
        accessorKey: 'id',
        header: 'Actions',
        enableSorting: false,
        cell(props) {
          const scheduleId = props.getValue<number>()
          return (
            <>
              <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => {
                  const scheduleToEdit = schedules.find((s) => s.id === scheduleId);
                  setEditingSchedule(scheduleToEdit || null);
                  onShow();
                }}
              >
                Edit
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDeleteSchedule(scheduleId)}
              >
                Delete
              </button>
            </>
          )
        },
      },
    ]
  },[]);

  return (
    <div className="container mt-4">
      <h2>Email Schedule</h2>
      <p className='h6 text-secondary mb-3'> Schedule Email by adding, editing, and deleting them.</p>
      {/* Search and Filter */}
      {/* <div className="mb-3 d-flex align-items-center"> */}
      <InputGroup className="mb-3 px-4">
        <Form.Control
          type="text"
          placeholder="Search by subject"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "70%" }}
          className="me-2"
        />
        {/* <Form.Control
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="me-2"
          style={{ width: "auto" }}
        /> */}
        <Button variant="primary" 
          onClick={() => {
            setEditingSchedule(null);
            onShow();
          }}
        >
          Add Schedule
        </Button>
      </InputGroup>
      {/* </div> */}


      <Table columns={columns} data={filteredSchedules} />
      <EmailModal ref={ref} email={editingSchedule || { id: 0, receiver: "", subject: "", content: "" }} template={templates} onClose={onClose} isEdit={!!editingSchedule}/>
      
      
      {/* Schedule Table */}
      {/* <div style={{overflowX:"auto"}}>
        <table className="table table-bordered table-striped" style={{whiteSpace:"nowrap"}}>
          <thead>
            <tr>
              <th>subject</th>
              <th>content</th>
              <th>Date</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchedules.map((schedule) => (
              <tr key={schedule.id}>
                <td>{schedule.subject}</td>
                <td>{schedule.content}</td>
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
      </div> */}

      {/* Add Schedule Modal */}
      {/* {showAddModal && (
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
      )} */}

      {/* Edit Schedule Modal */}
      {/* {showEditModal && editingSchedule && (
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
      )} */}
    </div>
  )
}
