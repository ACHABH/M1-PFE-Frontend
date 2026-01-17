import { useState, useEffect } from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
import { Card, Container, Row, Col, Button, Badge } from 'react-bootstrap';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaProjectDiagram,
  FaCalendarCheck,
  FaUpload,
  FaClock,
  FaBell,
  FaSearch,
} from 'react-icons/fa';
import UploadCSV from '../../../components/admin/UploadCSV2';
import SetDeadline from '../../../components/admin/SetDeadline';
import { useTheme } from '../../../contexts/theme';
import { motion } from 'framer-motion';
import { sql, useSelectSql } from '../../../api/sql.ts';


export const Route = createLazyFileRoute('/dashboard/admin/dashboard')({
  component: RouteComponent,
});

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function StatusCard({ icon: Icon, title, value, trend, color }: any) {
  const { theme } = useTheme() ?? { theme: 'light' };

  
  // const query = `SELECT COUNT(id) FROM users WHERE role = 'student';`;
  // const { data: student, error, isLoading  } = useSelectSql(query);
  // console.log("Result:", student?.data);
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`h-100 border-0 shadow-sm ${theme === 'dark' ? 'bg-dark text-light' : ''}`}>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <div className="text-muted small mb-1">{title}</div>
              <h3 className="mb-0">{value}</h3>
              {trend && (
                <small className={trend >= 0 ? 'text-success' : 'text-danger'}>
                  {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
                </small>
              )}
            </div>
            <div className={`p-3 rounded-circle ${color}`}>
              <Icon size={24} className="text-white" />
            </div>
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
}

function RouteComponent() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isSetDeadlineOpen, setIsSetDeadlineOpen] = useState(false);
  const { theme } = useTheme() ?? { theme: 'light' };

  // Sample data for charts
  const projectData = [
    { name: 'Jan', projects: 4 },
    { name: 'Feb', projects: 3 },
    { name: 'Mar', projects: 6 },
    { name: 'Apr', projects: 8 },
    { name: 'May', projects: 7 },
    { name: 'Jun', projects: 9 },
  ];

  const pieData = [
    { name: 'Web Dev', value: 400 },
    { name: 'Mobile', value: 300 },
    { name: 'AI/ML', value: 300 },
    { name: 'Other', value: 200 },
  ];

  const handleUploadCSV = (file: File) => {
    alert(`File ${file.name} uploaded! Users will be processed.`);
    setShowUploadModal(false);
  };

  const handleCancelUpload = () => {
    setShowUploadModal(false);
  };

  return (
    <Container fluid className="px-4 py-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Dashboard</h2>
          <p className="text-muted mb-0">Welcome back! Here's what's happening with your projects.</p>
        </div>
        <div className="d-flex gap-2">
          <Button
            variant="outline-primary"
            className="d-flex align-items-center gap-2"
            onClick={() => setShowUploadModal(true)}
          >
            <FaUpload /> Upload CSV
          </Button>
          <Button
            variant="primary"
            className="d-flex align-items-center gap-2"
            onClick={() => setIsSetDeadlineOpen(true)}
          >
            <FaClock /> Set Deadline
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <Row className="g-3 mb-4">
        <Col xl={3} sm={6}>
          <StatusCard
            icon={FaUserGraduate}
            title="Total Students"
            value="2,845"
            trend={12.5}
            color="bg-primary"
          />
        </Col>
        <Col xl={3} sm={6}>
          <StatusCard
            icon={FaChalkboardTeacher}
            title="Total Teachers"
            value="154"
            trend={-2.4}
            color="bg-success"
          />
        </Col>
        <Col xl={3} sm={6}>
          <StatusCard
            icon={FaProjectDiagram}
            title="Active Projects"
            value="85"
            trend={8.2}
            color="bg-warning"
          />
        </Col>
        <Col xl={3} sm={6}>
          <StatusCard
            icon={FaCalendarCheck}
            title="Scheduled Defenses"
            value="24"
            trend={5.1}
            color="bg-info"
          />
        </Col>
      </Row>

      {/* Charts */}
      <Row className="g-3 mb-4">
        <Col lg={8}>
          <Card className={`border-0 shadow-sm h-100 ${theme === 'dark' ? 'bg-dark text-light' : ''}`}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0">Project Submissions</h5>
                <div className="d-flex gap-2">
                  <Badge bg="primary" className="py-2 px-3">Monthly</Badge>
                  <Badge bg="secondary" className="py-2 px-3">Weekly</Badge>
                </div>
              </div>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={projectData}>
                    <defs>
                      <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0088FE" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="projects"
                      stroke="#0088FE"
                      fillOpacity={1}
                      fill="url(#colorProjects)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className={`border-0 shadow-sm h-100 ${theme === 'dark' ? 'bg-dark text-light' : ''}`}>
            <Card.Body>
              <h5 className="mb-4">Project Categories</h5>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3">
                {pieData.map((entry, index) => (
                  <div key={entry.name} className="d-flex align-items-center mb-2">
                    <div
                      className="rounded-circle me-2"
                      style={{
                        width: 12,
                        height: 12,
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    />
                    <span className="small">{entry.name}</span>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity & Upcoming Deadlines */}
      <Row className="g-3">
        <Col lg={6}>
          <Card className={`border-0 shadow-sm ${theme === 'dark' ? 'bg-dark text-light' : ''}`}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0">Recent Activity</h5>
                <Button variant="link" className="p-0">View All</Button>
              </div>
              <div className="activity-list">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="d-flex align-items-center mb-3">
                    <div className={`p-2 rounded-circle bg-${['primary', 'success', 'warning'][i]} me-3`}>
                      <FaBell className="text-white" />
                    </div>
                    <div>
                      <p className="mb-0">New project proposal submitted</p>
                      <small className="text-muted">2 hours ago</small>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className={`border-0 shadow-sm ${theme === 'dark' ? 'bg-dark text-light' : ''}`}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0">Upcoming Deadlines</h5>
                <Button variant="link" className="p-0">View Calendar</Button>
              </div>
              <div className="deadline-list">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="d-flex align-items-center mb-3">
                    <div className={`p-2 rounded-circle bg-${['danger', 'info', 'secondary'][i]} me-3`}>
                      <FaCalendarCheck className="text-white" />
                    </div>
                    <div className="flex-grow-1">
                      <p className="mb-0">Project Defense Presentations</p>
                      <small className="text-muted">In 3 days</small>
                    </div>
                    <Badge bg="danger">Important</Badge>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modals */}
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

      {isSetDeadlineOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
          style={{ zIndex: 1050 }}
        >
          <div className={`card border-0 shadow-lg ${theme === 'dark' ? 'bg-dark text-light' : ''}`} style={{ width: '400px' }}>
            <div className="card-body">
              <SetDeadline onSetDeadline={(deadline: string) => console.log(deadline)} />
              <Button
                variant="secondary"
                className="w-100 mt-3"
                onClick={() => setIsSetDeadlineOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
