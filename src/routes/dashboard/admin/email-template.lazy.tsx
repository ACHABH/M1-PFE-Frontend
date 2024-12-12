import { createLazyFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import EmailTemplateForm from '../../../components/admin/EmailTemplateForm'
import Table from "../../../components/table";
import type { EmailTemplate } from "../../../types/db";
import { ColumnDef } from '@tanstack/react-table';
import Button from 'react-bootstrap/esm/Button';
import Container from 'react-bootstrap/esm/Container';
import {useDelete as useDeleteTemplate} from '../../../api/email/template'


export const Route = createLazyFileRoute('/dashboard/admin/email-template')({
  component: RouteComponent,
})


function RouteComponent() {
  const { mutateAsync: deleteTemplate } = useDeleteTemplate();
  const [templates, setTemplates] = useState([
    {
      id: 1,
      title: 'PFE Proposal Reminder',
      subject: 'Reminder: Submit Your PFE Proposal',
      body: 'Dear {name},\n\nThis is a reminder to submit your PFE proposal by {deadline}.',
    },
  ])
  const [currentTemplate, setCurrentTemplate] = useState<{
    id: number
    title: string
    subject: string
    body: string
  } | null>(null)
  const [showForm, setShowForm] = useState(false)

  const handleSaveTemplate = (template: any) => {
    if (template.id) {
      //update an existing template
      setTemplates(templates.map((t) => (t.id === template.id ? template : t)))
    } else {
      // adding new template
      setTemplates([...templates, { ...template, id: Date.now() }])
    }
    setShowForm(false)
  }

  const handleDeleteTemplate = (id: any) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      setTemplates(templates.filter((t) => t.id !== id))
    }
  }

  const columns = useMemo<ColumnDef<EmailTemplate>[]>(() => {
    return[
      {
        accessorKey: 'title',
        header: 'Title',
        enableSorting: true,
        cell: (props) => props.getValue()
      },
      {
        accessorKey: 'subject',
        header: 'Subject',
        enableSorting: true,
        cell: (props) => props.getValue()
      },
      {
        accessorKey: "id",
        header: "Actions",
        enableSorting: false,
        cell(props) {
          const userId = props.getValue<number>();
          return (
            <Container as="div" style={{ display: "flex", gap: 5 }}>
              <Button
                type="button"
                variant="warning"
                size="sm"
                onClick={() => {
                  // setCurrentTemplate(template);
                  // setShowForm(true);
                }}
              >
                Edit
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => {
                  const confirmation = window.confirm("Confirm delete action?");
                  // if (confirmation) deleteTemplate(emailId);
                }}
              >
                Delete
              </Button>
            </Container>
          );
        },
      },
    ]
  },[deleteTemplate]);


  return (
    <div className="container mt-4">
      <h3>Email Template Manager</h3>
      <p className='h6 text-secondary mb-3'>Create, Edit, Delete Email Templates from this page</p>
      <button
        className="btn btn-primary mb-3"
        onClick={() => {
          setCurrentTemplate(null)
          setShowForm(true)
        }}
      >
        Add New Template
      </button>
      {/* <div style={{overflowX:"auto"}}>
        <table className="table table-bordered" style={{whiteSpace:"nowrap"}}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Subject</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((template) => (
              <tr key={template.id}>
                <td>{template.title}</td>
                <td>{template.subject}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => {
                      setCurrentTemplate(template)
                      setShowForm(true)
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteTemplate(template.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}

      <Table columns={columns} data={templates} />

      {showForm && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
          style={{ zIndex: 1050 }}
        >
          <EmailTemplateForm
            template={currentTemplate}
            onSave={handleSaveTemplate}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}
    </div>
  )
}
