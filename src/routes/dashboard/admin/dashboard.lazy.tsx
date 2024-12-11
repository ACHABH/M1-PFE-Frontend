import { useState } from 'react'
import { createLazyFileRoute } from '@tanstack/react-router'
import WelcomeCard from '../../../components/welcome-card'
import UploadCSV from '../../../components/Admin/UploadCSV'
import AdminStatus from '../../../components/Admin/AdminStatus'
import SetDeadline from '../../../components/Admin/SetDeadline'

export const Route = createLazyFileRoute('/dashboard/admin/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isUploadCSVOpen, setIsUploadCSVOpen] = useState(false)
  const [isSetDeadlineOpen, setIsSetDeadlineOpen] = useState(false)

  // Toggles between WelcomeCard and UploadCSV
  const toggleUploadCSV = () => {
    setIsUploadCSVOpen(!isUploadCSVOpen)
  }

  // Opens the SetDeadline component and hides others
  const openSetDeadline = () => {
    setIsSetDeadlineOpen(true)
    setIsUploadCSVOpen(false)
  }

  // Closes the SetDeadline component and restores others
  const closeSetDeadline = () => {
    setIsSetDeadlineOpen(false)
  }

  return (
    <>
      <div className="d-flex justify-content-between">
        <h4 className="text-left mx-3 mt-3">Dashboard</h4>
        {!isSetDeadlineOpen && (
          <>
            <div>
              <button
                className="btn-oxford mx-3 mt-3 uploadCSV-btn"
                onClick={toggleUploadCSV}
                style={{ borderRadius: '10px' }}
              >
                Upload CSV
              </button>
              <button
                className="btn-oxford mx-3 mt-3"
                onClick={openSetDeadline}
                style={{ borderRadius: '10px' }}
              >
                Set Deadline
              </button>
            </div>
          </>
        )}
      </div>

      {/* Render SetDeadline or the rest of the components */}
      {isSetDeadlineOpen ? (
        <div className="position-relative">
          <div className="position-absolute top-0 start-0 end-0 component-bg p-3 shadow rounded w-50 mx-auto">
            <SetDeadline
              onSetDeadline={(deadline: string) => console.log(deadline)}
            />
            <button
              className="btn btn-secondary mt-3"
              onClick={closeSetDeadline}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          {isUploadCSVOpen ? (
            <UploadCSV togglePage={toggleUploadCSV} />
          ) : (
            <WelcomeCard name="User Full Name" path="" />
          )}
          {!isUploadCSVOpen && <AdminStatus />}
        </>
      )}
    </>
  )
}
