import { createLazyFileRoute, Link } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/dashboard/teacher/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="container mt-4">
      <h2>Teacher Dashboard</h2>
      <div className="row mt-4">
        <div className="col-md-4">
          <Link
            to="/dashboard/teacher/submit-proposal"
            className="btn btn-primary w-100 mb-3"
          >
            Submit PFE Proposal
          </Link>
        </div>
        <div className="col-md-4">
          <Link
            to="/dashboard/teacher/supervise-projects"
            className="btn btn-secondary w-100 mb-3"
          >
            Supervise Projects
          </Link>
        </div>
        <div className="col-md-4">
          <Link
            to="/dashboard/teacher/manage-defense-schedule"
            className="btn btn-info w-100 mb-3"
          >
            Manage Defense Schedule
          </Link>
        </div>
      </div>
    </div>
  )
}
