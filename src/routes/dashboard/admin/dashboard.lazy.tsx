import { useState } from 'react'
import { createLazyFileRoute } from '@tanstack/react-router'
import WelcomeCard from '../../../components/welcome-card'
import UploadCSV from '../../../components/admin/UploadCSV2'
import AdminStatus from '../../../components/admin/AdminStatus'
import SetDeadline from '../../../components/admin/SetDeadline'

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
  
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleUploadCSV = (file: File) => {
    alert(`File ${file.name} uploaded! Users will be processed.`);
    setShowUploadModal(false);
  };

  const handleCancelUpload = () => {
    setShowUploadModal(false);
  };


  return (
    <>
      <div className="d-flex justify-content-between">
        <h4 className="text-left mx-3 mt-3">Dashboard</h4>
        {!isSetDeadlineOpen && (
          <>
            <div>
              <button
                className="btn-oxford mx-3 mt-3 uploadCSV-btn"
                onClick={() => setShowUploadModal(true)}
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
          {showUploadModal && (
            <div
              className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
              style={{ zIndex: 1050 }}
            >
              <UploadCSV
                onUpload={handleUploadCSV}
                onCancel={handleCancelUpload}
              />
            </div>
          )}
          <WelcomeCard name="User Full Name" path="" />
          <AdminStatus />
        </>
      )}
    </>
  )
}
