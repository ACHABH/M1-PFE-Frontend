import { Link } from "@tanstack/react-router";
import { Nav } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Sticky } from "react-bootstrap-icons";

type Props = {
  userRole: string;
  pendingAmount?: number;
};

export default function SideMenu({ userRole }: Props) {
  const [menuOpen, setMenuOpen] = useState({
    isUserManagement: true,
    isScheduleManagement: true,
    isProjectManagement: true,
    isTeacherScheduleManagement: true,
  });
  // const [isUserManagementMenuOpen, setIsUserManagementMenuOpen] =
  //   useState(true);
  // const [isScheduleManagementMenuOpen, setIsScheduleManagementMenuOpen] =
  //   useState(true);
  // const [isProjectManagementMenuOpen, setIsProjectManagementMenuOpen] =
  //   useState(true);
  // const [
  //   isTeacherScheduleManagementMenuOpen,
  //   setIsTeacherScheduleManagementMenuOpen,
  // ] = useState(true);
  const [pendingAmount, setPendingAmount] = useState(0);

  // const toggleMenu = (
  //   setter: React.Dispatch<React.SetStateAction<boolean>>
  // ) => {
  //   setter((prev) => !prev);
  // };

  useEffect(() => {
    // Simulate fetching data
    const pendingAmountFromServer = 2;
    setPendingAmount(pendingAmountFromServer);
  }, []);

  return (
    <Nav className="d-flex flex-column" style={{minHeight: "100vh", position: "sticky"}}>
      {userRole === "teacher" && (
        <Nav className="flex-column">
          <div className="dashboard py-3 px-2 myBorder-bottom">
            <Link to="/dashboard/teacher/dashboard" className="aside-option">
              <i className="bi-house me-2"></i>
              Dashboard
            </Link>
            <Link to="/dashboard/teacher/archive" className="aside-option">
              <i className="bi-archive me-2"></i>
              Archive
            </Link>
          </div>

          <div className="project-management py-3 px-2 myBorder-bottom">
            <button
              className="side-menu-btn btn d-flex justify-content-between align-items-center px-3"
              style={{ width: "100%" }}
              onClick={() =>
                setMenuOpen((prev) => ({
                  ...prev,
                  isProjectManagement: !prev.isProjectManagement,
                }))
              }
            >
              <h6 className="text-left">Project Management</h6>
              <i
                className={`bi ${menuOpen.isProjectManagement ? "bi-chevron-up" : "bi-chevron-down"}`}
              ></i>
            </button>
            {menuOpen.isProjectManagement && (
              <div className="project-management-menu">
                <Link
                  to="/dashboard/teacher/submit-proposal"
                  className="aside-option"
                >
                  <i className="bi bi-collection me-2"></i>
                  Submit Proposal
                </Link>
                <Link
                  to="/dashboard/teacher/defense-selction"
                  className="aside-option"
                >
                  <i className="bi bi-person-check me-2"></i>
                  Defense Selection
                </Link>
                <Link
                  to="/dashboard/teacher/supervise-projects"
                  className="aside-option"
                >
                  <i className="bi bi-person-check me-2"></i>
                  Supervise Projects
                </Link>
                <Link
                  to="/dashboard/teacher/pending-revisions"
                  className="aside-option"
                >
                  <i className="bi bi-person-check me-2"></i>
                  Pending Revisions
                  <span
                    className="text-white"
                    style={{
                      backgroundColor: "red",
                      borderRadius: "5px",
                      border: "1px solid red",
                      padding: "1px 2px",
                      marginLeft: "5px",
                    }}
                  >
                    {pendingAmount}
                  </span>
                </Link>
                <Link
                  to="/dashboard/teacher/my-supervised-projects"
                  className="aside-option"
                >
                  <i className="bi bi-folder-check me-2"></i>
                  Projects I Supervise
                </Link>
              </div>
            )}
          </div>

          <div className="schedule-management py-3 px-2">
            <button
              className="side-menu-btn btn d-flex justify-content-between align-items-center px-3"
              style={{ width: "100%" }}
              onClick={() =>
                setMenuOpen((prev) => ({
                  ...prev,
                  isTeacherScheduleManagement:
                    !prev.isTeacherScheduleManagement,
                }))
              }
            >
              <h6 className="text-left">Schedule</h6>
              <i
                className={`bi ${menuOpen.isTeacherScheduleManagement ? "bi-chevron-up" : "bi-chevron-down"}`}
              ></i>
            </button>
            {menuOpen.isTeacherScheduleManagement && (
              <div className="schedule-management-menu">
                <Link
                  to="/dashboard/teacher/manage-defense-schedule"
                  className="aside-option"
                >
                  <i className="bi-calendar-event me-2"></i>
                  Jury Schedule
                </Link>
              </div>
            )}
          </div>
        </Nav>
      )}
      {userRole === "admin" && (
        <Nav className="flex-column">
          <div className="dashboard py-3 px-2 myBorder-bottom">
            <Link to="/dashboard/admin/dashboard" className="aside-option">
              <i className="bi-house me-2"></i>
              Dashboard
            </Link>
            <Link to="/dashboard/admin/pfe-proposals" className="aside-option">
              <i className="bi-folder-plus me-2"></i>
              PFE Proposals
            </Link>
            <Link to="/dashboard/admin/archive" className="aside-option">
              <i className="bi-archive me-2"></i>
              Archive
            </Link>
          </div>
          <div className="user-management py-3 px-2 myBorder-bottom">
            <button
              className="side-menu-btn btn d-flex justify-content-between align-items-center px-3"
              style={{ width: "100%" }}
              onClick={() =>
                setMenuOpen((prev) => ({
                  ...prev,
                  isUserManagement: !prev.isUserManagement,
                }))
              }
            >
              <h6 className="text-left">Management</h6>
              <i
                className={`bi ${menuOpen.isUserManagement ? "bi-chevron-up" : "bi-chevron-down"}`}
              ></i>
            </button>
            {menuOpen.isUserManagement && (
              <div className="user-management-menu">
                <Link
                  to="/dashboard/admin/supervision"
                  className="aside-option"
                >
                  <i className="bi bi-person-check me-2"></i>
                  Supervision
                </Link>
                <Link
                  to="/dashboard/admin/project-managment"
                  className="aside-option"
                >
                  <i className="bi bi-collection me-2"></i>
                  Projects
                </Link>
                <Link
                  to="/dashboard/admin/user-managment"
                  className="aside-option"
                >
                  <i className="bi bi-people-fill me-2"></i>
                  Users
                </Link>
                <Link
                  to="/dashboard/admin/email-template"
                  className="aside-option"
                >
                  <i className="bi bi-file-earmark-text me-2"></i>
                  Emails Template
                </Link>
              </div>
            )}
          </div>

          <div className="topics-management py-3 px-2">
            <button
              className="side-menu-btn btn d-flex justify-content-between align-items-center px-3"
              style={{ width: "100%" }}
              onClick={() =>
                setMenuOpen((prev) => ({
                  ...prev,
                  isScheduleManagement: !prev.isScheduleManagement,
                }))
              }
            >
              <h6 className="text-left">Schedule</h6>
              <i
                className={`bi ${menuOpen.isScheduleManagement ? "bi-chevron-up" : "bi-chevron-down"}`}
              ></i>
            </button>
            {menuOpen.isScheduleManagement && (
              <div className="schedule-management-menu">
                <Link
                  to="/dashboard/admin/defense-schedule"
                  className="aside-option"
                >
                  <i className="bi-calendar-event me-2"></i>
                  Jury Schedule
                </Link>
                <Link
                  to="/dashboard/admin/email-schedule"
                  className="aside-option"
                >
                  <i className="bi-clock me-2"></i>
                  Emails Schedule
                </Link>
              </div>
            )}
          </div>
        </Nav>
      )}
      {userRole === "student" && (
        <Nav className="flex-column">
        <div className="dashboard py-3 px-2 myBorder-bottom">
          <Link to="/dashboard/student/homepage" className="aside-option">
            <i className="bi-house me-2"></i>
            Dashboard
          </Link>
        </div>

        <div className="project-management py-3 px-2 myBorder-bottom">
          <button
            className="side-menu-btn btn d-flex justify-content-between align-items-center px-3"
            style={{ width: "100%" }}
            onClick={() =>
              setMenuOpen((prev) => ({
                ...prev,
                isProjectManagement: !prev.isProjectManagement,
              }))
            }
          >
            <h6 className="text-left">Project Management</h6>
            <i
              className={`bi ${menuOpen.isProjectManagement ? "bi-chevron-up" : "bi-chevron-down"}`}
            ></i>
          </button>
          {menuOpen.isProjectManagement && (
            <div className="project-management-menu">
              <Link
                to="/dashboard/student/my-projects"
                className="aside-option"
              >
                <i className="bi bi-collection me-2"></i>
                My Projects
              </Link>
              <Link
                to="/dashboard/student/propose-topic"
                className="aside-option"
              >
                <i className="bi bi-person-check me-2"></i>
                Propose Topic
              </Link>
            </div>
          )}
        </div>

        <div className="schedule-management py-3 px-2">
          <button
            className="side-menu-btn btn d-flex justify-content-between align-items-center px-3"
            style={{ width: "100%" }}
            onClick={() =>
              setMenuOpen((prev) => ({
                ...prev,
                isTeacherScheduleManagement:
                  !prev.isTeacherScheduleManagement,
              }))
            }
          >
            <h6 className="text-left">Schedule</h6>
            <i
              className={`bi ${menuOpen.isTeacherScheduleManagement ? "bi-chevron-up" : "bi-chevron-down"}`}
            ></i>
          </button>
          {menuOpen.isTeacherScheduleManagement && (
            <div className="schedule-management-menu">
              <Link
                to="/dashboard/student/suggested-topics"
                className="aside-option"
              >
                <i className="bi-calendar-event me-2"></i>
                Suggested Topics
              </Link>
            </div>
          )}
        </div>
      </Nav>
      )}
      {userRole === "company" && (
        <Nav className="flex-column">
        <div className="dashboard py-3 px-2 myBorder-bottom">
          <Link to="/dashboard/company/homepage" className="aside-option">
            <i className="bi-house me-2"></i>
            Dashboard
          </Link>
        </div>

        <div className="project-management py-3 px-2 myBorder-bottom">
          <button
            className="side-menu-btn btn d-flex justify-content-between align-items-center px-3"
            style={{ width: "100%" }}
            onClick={() =>
              setMenuOpen((prev) => ({
                ...prev,
                isProjectManagement: !prev.isProjectManagement,
              }))
            }
          >
            <h6 className="text-left">Project Management</h6>
            <i
              className={`bi ${menuOpen.isProjectManagement ? "bi-chevron-up" : "bi-chevron-down"}`}
            ></i>
          </button>
          {menuOpen.isProjectManagement && (
            <div className="project-management-menu">
              <Link
                to="/dashboard/company/my-projects"
                className="aside-option"
              >
                <i className="bi bi-collection me-2"></i>
                My Projects
              </Link>
              <Link
                to="/dashboard/company/propose-topics"
                className="aside-option"
              >
                <i className="bi bi-person-check me-2"></i>
                Propose Topic
              </Link>
            </div>
          )}
        </div>
      </Nav>
      )}
    </Nav>
    //  </div>
  );
}
