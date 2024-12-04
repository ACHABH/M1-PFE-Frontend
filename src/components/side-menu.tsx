import {Link } from "@tanstack/react-router";
import { Nav } from "react-bootstrap";
import {useState, useEffect} from 'react';

interface SidebarProps {
  userRole: string;
  pendingAmount?: number;
}

const SideMenu: React.FC<SidebarProps> = ({
  userRole,
}) => {

  const [isUserManagementMenuOpen, setIsUserManagementMenuOpen] = useState(false);

    function toggleUserManagementMenu(): void {
        setIsUserManagementMenuOpen(!isUserManagementMenuOpen);
    const userManagementMenu = document.querySelector('.user-managment-menu');
    if (userManagementMenu) {
        (userManagementMenu as HTMLElement).style.display = isUserManagementMenuOpen ? 'block' : 'none';
    }
    }

    const [isScheduleManagementMenuOpen, setIsScheduleManagementMenuOpen] = useState(false);

    function toggleScheduleManagementMenu(): void {
        setIsScheduleManagementMenuOpen(!isScheduleManagementMenuOpen);
        const scheduleManagementMenu = document.querySelector('.schedule-managment-menu');
    if (scheduleManagementMenu) {
        (scheduleManagementMenu as HTMLElement).style.display = isScheduleManagementMenuOpen ? 'block' : 'none';
    }
    }

    //TODO : fix the active link 
    const [activeLink, setActiveLink] = useState<string>('');

    function handleNavLinkClick(link: string): void {
      // setActiveLink(link);
      // const links = document.querySelectorAll('.aside-option');
      // links.forEach((linkElement) => {
      // if (linkElement.id === link) {
      //   linkElement.classList.add('active');
      // } else {
      //   linkElement.classList.remove('active');
      // }
      // });
    }

    const [isProjectManagementMenuOpen, setIsProjectManagementMenuOpen] = useState(false);

    function toggleProjectManagementMenu(): void {
        setIsProjectManagementMenuOpen(!isProjectManagementMenuOpen);
    const ProjectManagementMenu = document.querySelector('.project-managment-menu');
    if (ProjectManagementMenu) {
        (ProjectManagementMenu as HTMLElement).style.display = isProjectManagementMenuOpen ? 'block' : 'none';
    }
    }

    const [isTeacherScheduleManagementMenuOpen, setIsTeacherScheduleManagementMenuOpen] = useState(false);

    function toggleTeacherScheduleManagementMenu(): void {
        setIsTeacherScheduleManagementMenuOpen(!isTeacherScheduleManagementMenuOpen);
        const TeacherScheduleManagementMenu = document.querySelector('.schedule-managment-menu');
    if (TeacherScheduleManagementMenu) {
        (TeacherScheduleManagementMenu as HTMLElement).style.display = isTeacherScheduleManagementMenuOpen ? 'block' : 'none';
    }
    }

    //TODO: test this function
    const [pendingAmount, setPendingAmount] = useState(2);

    useEffect(() => {
      async function fetchPendingAmount() {
        try {
          const response = await fetch('/api/pending-amount');
          const data = await response.json();
          setPendingAmount(data.pendingAmount);
        } catch (error) {
          console.error('Error fetching pending amount:', error);
        }
      }

      fetchPendingAmount();
    }, []);
    return (
        <Nav className="d-flex flex-column" style={{}}>
          {userRole === "teacher" && (
            <Nav className="flex-column">
            <div className="dashboard py-3 px-2 myBorder-bottom">
              <Link to="/dashboard/teacher/dashboard" className='aside-option' id='0' onClick={() => handleNavLinkClick('0')}>
                    <i className="bi-house me-2"></i>
                    Dashboard
              </Link>
              <Link to="/dashboard/teacher/archive" className='aside-option' id="6" onClick={() => handleNavLinkClick('6')}>
                    <i className="bi-archive me-2"></i>
                    Archive
              </Link>
            </div>
            <>
                <div className="Project-managment py-3 px-2 myBorder-bottom">
                    <div 
                      className="project-managment-menu-btn side-menu-btn btn d-flex justify-content-between align-items-center px-3" 
                      style={{width:"100%"}} 
                      onClick={toggleProjectManagementMenu}
                    >
                      <h6 className="text-left">Project Management</h6>
                      <i className={`bi ${isProjectManagementMenuOpen ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
                    </div>
                    <div className="project-managment-menu">
                        <Link to="/dashboard/teacher/submit-proposal" className='aside-option' id="2" onClick={() => handleNavLinkClick('2')}>
                            <i className="bi bi-collection me-2"></i>
                            Submit Proposal
                        </Link>
                        <Link to="/dashboard/teacher/defense-selction" className='aside-option' id="3" onClick={() => handleNavLinkClick('3')}>
                            <i className="bi bi-person-check me-2"></i>
                            Defense Selection
                        </Link>
                        <Link to="/dashboard/teacher/supervise-projects" className='aside-option' id="3" onClick={() => handleNavLinkClick('3')}>
                            <i className="bi bi-person-check me-2"></i>
                            Supervise Projects
                        </Link>
                        <Link to="/dashboard/teacher/pending-revisions" className='aside-option' id="3" onClick={() => handleNavLinkClick('3')}>
                            <i className="bi bi-person-check me-2"></i>
                            Pending Revisions &nbsp;&nbsp; <span className='text-white' style={{backgroundColor: "red", borderRadius: "5px",border: "1px solid red", padding:"1px 2px"}}>{pendingAmount}</span>
                        </Link>
                        <Link to="/dashboard/teacher/my-supervised-projects" className='aside-option' id="4" onClick={() => handleNavLinkClick('4')}>
                          <i className="bi bi-folder-check me-2"></i>
                          Projects I Supervise
                        </Link>
                    </div>
                </div>
                <div className="Schedule-managment py-3 px-2">
                    <div 
                      className="project-managment-menu-btn side-menu-btn btn d-flex justify-content-between align-items-center px-3" 
                      style={{width:"100%"}} 
                      onClick={toggleTeacherScheduleManagementMenu}
                    >
                      <h6 className="text-left">Schedule</h6>
                      <i className={`bi ${isTeacherScheduleManagementMenuOpen ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
                    </div>
                    <div className="schedule-managment-menu">
                        <Link to="/dashboard/teacher/manage-defense-schedule" className='aside-option' id="4" onClick={() => handleNavLinkClick('4')}>
                            <i className="bi-calendar-event me-2"></i>
                            Jurie Schedule
                        </Link>
                    </div>
                </div>
              </>                 
            </Nav>
          )}
    
          {userRole === "admin" && (
            <>
              {/* Admin-specific links */}
              <Nav className="flex-column">
                    <div className="dashboard py-3 px-2 myBorder-bottom">
                    <Link to="/dashboard/admin/dashboard" className='aside-option' id='0' onClick={() => handleNavLinkClick('0')}>
                            <i className="bi-house me-2"></i>
                            Dashboard
                        </Link>
                        <Link to="/dashboard/admin/pfe-proposals" className='aside-option' id="1" onClick={() => handleNavLinkClick('1')}>
                            {/* <FontAwesomeIcon icon={faChalkboardUser} className="fa-icon"/> */}
                            <i className="bi-folder-plus me-2"></i>
                            PFE Proposals
                        </Link>
                        <Link to="/dashboard/admin/archive" className='aside-option' id="6" onClick={() => handleNavLinkClick('6')}>
                          <i className="bi-archive me-2"></i>
                          Archive
                        </Link>
                    </div>
                    <>
                        <div className="user-managment py-3 px-2 myBorder-bottom">
                            <div 
                              className="user-managment-menu-btn side-menu-btn btn d-flex justify-content-between align-items-center px-3" 
                              style={{width:"100%"}} 
                              onClick={toggleUserManagementMenu}
                            >
                              <h6 className="text-left">Management</h6>
                              <i className={`bi ${isUserManagementMenuOpen ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
                            </div>
                            <div className="user-managment-menu">
                                <Link to="/dashboard/admin/supervision" className='aside-option' id="2" onClick={() => handleNavLinkClick('2')}>
                                    <i className="bi bi-person-check me-2"></i>
                                    Supervision
                                </Link>
                                <Link to="/dashboard/admin/project-managment" className='aside-option' id="3" onClick={() => handleNavLinkClick('3')}>
                                    <i className="bi bi-collection me-2"></i>
                                    Projects
                                </Link>
                                
                                <Link to="/dashboard/admin/user-managment" className='aside-option' id="3" onClick={() => handleNavLinkClick('3')}>
                                    <i className="bi bi-people-fill me-2"></i>
                                    Users
                                </Link>
                                <Link to="/dashboard/admin/email-template" className='aside-option' id="5" onClick={() => handleNavLinkClick('5')}>
                                    <i className="bi-file-earmark-text me-2"></i>
                                    Emails Template
                                </Link>
                            </div>
                        </div>
                        <div className="topics-managment  py-3 px-2">
                            <div 
                              className="user-managment-menu-btn side-menu-btn btn d-flex justify-content-between align-items-center px-3" 
                              style={{width:"100%"}} 
                              onClick={toggleScheduleManagementMenu}
                            >
                              <h6 className="text-left">Schedule</h6>
                              <i className={`bi ${isScheduleManagementMenuOpen ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
                            </div>
                            <div className="schedule-managment-menu">
                                <Link to="/dashboard/admin/defense-schedule" className='aside-option' id="4" onClick={() => handleNavLinkClick('4')}>
                                    <i className="bi-calendar-event me-2"></i>
                                    Jurie Schedule
                                </Link>
                                <Link to="/dashboard/admin/email-schedule" className='aside-option' id="5" onClick={() => handleNavLinkClick('5')}>
                                    <i className="bi-clock me-2"></i>
                                    Emails Schedule
                                </Link>
                                
                            </div>
                        </div>
                    </>                 
                </Nav>
            </>
          )}
        </Nav>
      );
    };
    
export default SideMenu;