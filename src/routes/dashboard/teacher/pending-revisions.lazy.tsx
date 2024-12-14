import { createLazyFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import EditProposalForm from '../../../components/Teacher/EditProposal'
import Table from "../../../components/table";
import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import type { Project, ProjectProposition, ProjectPropositionFeedback} from "../../../types/db";
import { Prettier } from "../../../types/util";

export const Route = createLazyFileRoute(
  '/dashboard/teacher/pending-revisions',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const [proposals, setProposals] = useState([
    {
      title: 'AI Research',
      feedback: 'Please elaborate on the technologies section.',
      status: 'pending',
      description: 'Exploring AI applications in education.',
    },
    {
      title: 'Robotics Design',
      feedback: 'Provide more details on material requirements.',
      status: 'pending',
      description: 'Creating robotic models for industrial automation.',
    },
    {
      title: 'Blockchain Security',
      feedback: '',
      status: 'approved',
      description: 'Developing secure blockchain algorithms.',
    },
  {
    title: 'Quantum Computing',
    feedback: 'The proposal lacks sufficient detail on implementation.',
    status: 'rejected',
    description: 'Investigating quantum algorithms for cryptography.',
  },
  ])

  const [currentProposal, setCurrentProposal] = useState<Proposal | null>(null)
  const [showEditForm, setShowEditForm] = useState(false)

  interface Proposal {
    title: string
    feedback: string
    status: string
    description: string
  }

  const handleEdit = (proposal: Proposal) => {
    setCurrentProposal(proposal)
    setShowEditForm(true)
  }

  interface UpdatedProposal {
    title: string
    feedback: string
    status: string
    description: string
  }

  const handleSaveChanges = (updatedProposal: UpdatedProposal) => {
    setProposals(
      proposals.map((proposal) =>
        proposal.title === updatedProposal.title ? updatedProposal : proposal,
      ),
    )
    setShowEditForm(false)
    alert('Proposal updated successfully!')
  }

  type Revision = Prettier<Project & ProjectPropositionFeedback & ProjectProposition>;

  const columns = useMemo<ColumnDef<Revision>[]>(() => {
    return[
      {
        header: 'Title',
        accessorKey: 'title',
        enableSorting: true,
        cell: (props) => props.getValue(),
      },
      {
        header: 'Description',
        accessorKey: 'description',
        enableSorting: true,
        cell: (props) => props.getValue(),
      },
      {
        header: 'Status',
        accessorKey: 'status',
        enableSorting: true,
        cell: (props) => props.getValue(),
      },
      {
        header: 'Feedback',
        accessorKey: 'feedback',
        enableSorting: true,
        cell: (props) => props.getValue(),
      },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: (props) => {
          const proposal = props.row.original;
          return proposal.status === "pending" ? (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => handleEdit(proposal)}
            >
              Edit
            </button>
          ) : null;
        },
      },
    ]
  }, []);

  return (
    <div className="container mt-4">
      <h3>Validate Subjects</h3>
      {!showEditForm ? (
        // <div style={{overflowX:"auto"}}>
        //   <table className="table table-bordered table-striped" style={{whiteSpace:"nowrap"}}>
        //     <thead>
        //       <tr>
        //         <th>Title</th>
        //         <th>Description</th>
        //         <th>Status</th>
        //         <th>Feedback</th>
        //         <th>Actions</th>
        //       </tr>
        //     </thead>
        //     <tbody>
        //       {proposals.map((proposal, index) => (
        //         <tr key={index}>
        //           <td>{proposal.title}</td>
        //           <td>{proposal.description}</td>
        //           <td>
        //             <span
        //               className={`badge ${
        //                 proposal.status === 'Needs Revision'
        //                   ? 'bg-warning'
        //                   : 'bg-success'
        //               }`}
        //             >
        //               {proposal.status}
        //             </span>
        //           </td>
        //           <td>{proposal.feedback || 'No feedback'}</td>
        //           <td>
        //             {proposal.status === 'Needs Revision' && (
        //               <button
        //                 className="btn btn-primary btn-sm"
        //                 onClick={() => handleEdit(proposal)}
        //               >
        //                 Edit
        //               </button>
        //             )}
        //           </td>
        //         </tr>
        //       ))}
        //     </tbody>
        //   </table>
        // </div>
      <Table data={proposals} columns={columns} />
      ) : (
        <EditProposalForm
          proposal={currentProposal}
          onSave={handleSaveChanges}
          onCancel={() => setShowEditForm(false)}
        />
      )}
    </div>
  )
}
