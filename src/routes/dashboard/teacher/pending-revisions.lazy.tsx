import { createLazyFileRoute } from '@tanstack/react-router'
import { ElementRef, useCallback, useMemo, useRef, useState } from "react";
import { useAuth } from '../../../api/auth';
import Table from "../../../components/table";
import { ColumnDef } from "@tanstack/react-table";
import ProposalModal from "../../../components/Teacher/proposal-modal";
import { 
  type FullProject,
  useGetAll as useGetAllProjects,
 } from '../../../api/project';

export const Route = createLazyFileRoute(
  '/dashboard/teacher/pending-revisions',
)({
  component: RouteComponent,
})

function RouteComponent() {
  // const [proposals, setProposals] = useState([
  //   {
  //     title: 'AI Research',
  //     feedback: 'Please elaborate on the technologies section.',
  //     status: 'pending',
  //     description: 'Exploring AI applications in education.',
  //   },
  //   {
  //     title: 'Robotics Design',
  //     feedback: 'Provide more details on material requirements.',
  //     status: 'pending',
  //     description: 'Creating robotic models for industrial automation.',
  //   },
  //   {
  //     title: 'Blockchain Security',
  //     feedback: '',
  //     status: 'approved',
  //     description: 'Developing secure blockchain algorithms.',
  //   },
  // {
  //   title: 'Quantum Computing',
  //   feedback: 'The proposal lacks sufficient detail on implementation.',
  //   status: 'rejected',
  //   description: 'Investigating quantum algorithms for cryptography.',
  // },
  // ])

  const { data: projects } = useGetAllProjects();
  const user = useAuth((user) => {
      if (user) return;
    });

  const proposals = useMemo(
    () =>
      projects.filter(
        (project) =>
          (project.status === "proposed") &&
          project.project_proposition?.user_id === user?.id
      ),
    [projects, user?.id]
  );
  const ref = useRef<ElementRef<typeof ProposalModal>>(null);
  const [projectId, setProjectId] = useState<number | null>(null);

  const onShow = useCallback((projectId: number = 0) => {
    ref.current?.show();
    setProjectId(projectId);
  }, []);

  const onClose = useCallback(() => {
    ref.current?.close();
    setProjectId(0);
  }, []);


  const columns = useMemo<ColumnDef<FullProject>[]>(() => {
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
          return proposal.project_proposition?.status === "pending" ? (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onShow(proposal.id)}
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
      <Table data={proposals} columns={columns} />
      <ProposalModal ref={ref} projectID={projectId ?? 0} onClose={onClose} />
      {/* {!showEditForm ? (
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
        projectID={currentProposal}
          onCancel={() => setShowEditForm(false)}
        />
      )} */}
    </div>
  )
}
