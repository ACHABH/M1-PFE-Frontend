// import { createLazyFileRoute } from '@tanstack/react-router'
// import { useState } from 'react'

// export const Route = createLazyFileRoute(
//   '/dashboard/teacher/manage-defense-schedule',
// )({
//   component: RouteComponent,
// })


// function RouteComponent() {
//   const [defenseSchedules] = useState([
//     {
//       student: 'John Doe',
//       project: 'AI Research',
//       date: '2024-01-20',
//       time: '10:00 AM',
//       role: 'Supervisor',
//       // status: 'Confirmed',
//     },
//     {
//       student: 'Jane Smith',
//       project: 'Robotics Design',
//       date: '2024-01-22',
//       time: '02:00 PM',
//       role: 'Examiner',
//       // status: 'Rejceted',
//     },
//   ])

//   return (
//     <div className="container mt-4">
//       <h3>Jurie Schedule</h3>
//       <p className='h6 my-3 text-secondary'>Assigned Defense Roles</p>
//       <div style={{overflowX:"auto"}}>
//         <table className="table table-bordered table-striped" style={{whiteSpace:"nowrap"}}>
//           <thead>
//             <tr>
//               <th>Student</th>
//               <th>Project</th>
//               <th>Date</th>
//               <th>Time</th>
//               <th>Role</th>
//               {/* <th>Status</th> */}
//             </tr>
//           </thead>
//           <tbody>
//             {defenseSchedules.map((schedule, index) => (
//               <tr key={index}>
//                 <td>{schedule.student}</td>
//                 <td>{schedule.project}</td>
//                 <td>{schedule.date}</td>
//                 <td>{schedule.time}</td>
//                 <td>{schedule.role}</td>
//                 {/* <td>
//                   <span
//                     className={`badge ${
//                       schedule.status === 'Confirmed'
//                         ? 'bg-success'
//                         : 'bg-danger'
//                     }`}
//                   >
//                     {schedule.status}
//                   </span>
//                 </td> */}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }

import { createLazyFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { sql, useSelectSql } from '../../../api/sql.ts';
import { useAuth } from '../../../api/auth';

export const Route = createLazyFileRoute(
  '/dashboard/teacher/manage-defense-schedule',
)( {
  component: RouteComponent,
})

function RouteComponent() {
  const [defenseSchedules, setDefenseSchedules] = useState<any[]>([])

  const user = useAuth((user) => {
    if (user) return;
  });
  
  const teacherId = user?.id;
  
  const { data, isLoading, isError } = useSelectSql(
    `SELECT 
      GROUP_CONCAT(u.first_name || ' ' || u.last_name, ', ') AS student_names,
      p.title AS project_title,
      pp.date AS presentation_date,
      strftime('%H:%M', pp.date) AS presentation_time,  -- Extract the time
      pj.role AS role
    FROM 
      project_juries pj
    JOIN 
      projects p ON pj.project_id = p.id
    JOIN 
      project_students ps ON p.id = ps.project_id
    JOIN 
      users u ON ps.student_id = u.id
    JOIN 
      project_presentations pp ON p.id = pp.project_id
    WHERE 
      pj.teacher_id = ${teacherId}
    GROUP BY 
      p.id, pp.date, pj.role
    ORDER BY 
      pp.date;`
  );

  useEffect(() => {
    if (data) {
      setDefenseSchedules(data?.data);
    }
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading defense schedules.</div>;
  }

  const getRoleClass = (role: string) => {
    switch (role) {
      case 'supervisor':
        return 'badge bg-success';
      case 'examiner':
        return 'badge bg-warning text-dark';
      case 'president':
        return 'badge bg-primary';
      default:
        return '';
    }
  }

  return (
    <div className="container mt-4">
      <h3>Jurie Schedule</h3>
      <p className="h6 my-3 text-secondary">Assigned Defense Roles</p>
      <div style={{ overflowX: 'auto' }}>
        <table className="table table-bordered table-striped" style={{ whiteSpace: 'nowrap' }}>
          <thead>
            <tr>
              <th>Student</th>
              <th>Project</th>
              <th>Date</th>
              <th>Time</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {defenseSchedules.map((schedule, index) => (
              <tr key={index}>
                <td>{schedule.student_names}</td>
                <td>{schedule.project_title}</td>
                <td>{schedule.presentation_date}</td>
                <td>{schedule.presentation_time}</td>
                <td>
                <span className={getRoleClass(schedule.role)}>
                    {schedule.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

