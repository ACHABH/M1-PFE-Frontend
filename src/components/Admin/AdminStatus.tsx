import React from 'react';

interface AdminStatusProps {}

const AdminStatus: React.FC<AdminStatusProps> = () => {
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-4">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h5>Active Users</h5>
              <p>Students: 120 | Teachers: 25 | Companies: 15</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-warning text-dark">
            <div className="card-body">
              <h5>Pending Tasks</h5>
              <p>Proposals: 10 | Assignments: 5</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5>Upcoming Defenses</h5>
              <p>Next Week: 8</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatus;
