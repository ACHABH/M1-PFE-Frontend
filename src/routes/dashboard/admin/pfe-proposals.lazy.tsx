import { createLazyFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import AddPFEProposal from '../../../components/Admin/AddPFEProposal'

export const Route = createLazyFileRoute('/dashboard/admin/pfe-proposals')({
  component: RouteComponent,
})

function RouteComponent() {
  const [proposals, setProposals] = useState([
    {
      title: 'AI Research',
      type: 'Classic',
      description: 'Exploring AI-based solutions for education.',
    },
    {
      title: 'Robotics Design',
      type: 'Innovative',
      description: 'Creating robotic models for industrial automation.',
    },
  ])
  const [showAddModal, setShowAddModal] = useState(false)

  const handleAddProposal = (newProposal: {
    title: string
    type: string
    description: string
  }) => {
    setProposals([...proposals, newProposal])
    setShowAddModal(false)
  }

  const handleDeleteProposal = (title: string) => {
    setProposals(proposals.filter((proposal) => proposal.title !== title))
  }

  const handleCancelProposal = () => {
    setShowAddModal(false)
  }

  return (
    <div className=" mx-auto mt-2, mb-3" style={{ width: '95%', minHeight: '100vh' }}>
      <h2>PFE Proposals</h2>
      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowAddModal(true)}
      >
        Add PFE Proposal
      </button>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {proposals.map((proposal, index) => (
            <tr key={index}>
              <td>{proposal.title}</td>
              <td>{proposal.type}</td>
              <td>{proposal.description}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteProposal(proposal.title)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showAddModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
          style={{ zIndex: 1050 }}
        >
          <AddPFEProposal
            onAdd={handleAddProposal}
            onCancel={handleCancelProposal}
          />
        </div>
      )}
    </div>
  )
}
