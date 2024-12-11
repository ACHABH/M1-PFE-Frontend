import { useState, useEffect } from 'react'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/dashboard/teacher/submit-proposal')({
  component: RouteComponent,
})

function RouteComponent() {
  const [formData, setFormData] = useState({
    coSupervisorFirstName: '',
    coSupervisorLastName: '',
    mastersOption: '',
    type: 'Classic',
    title: '',
    summary: '',
    technologies: '',
    materials: '',
  })

  const [submissionReminder, setSubmissionReminder] = useState(false)

  // Simulated Reminder Logic
  useEffect(() => {
    const deadline = new Date('2024-12-15') //exp date
    const now = new Date()
    if (now < deadline) {
      setSubmissionReminder(true)
    }
  }, [])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    alert('PFE Proposal submitted successfully!')
    console.log(formData)
    setFormData({
      coSupervisorFirstName: '',
      coSupervisorLastName: '',
      mastersOption: '',
      type: 'Classic',
      title: '',
      summary: '',
      technologies: '',
      materials: '',
    })
  }

  return (
    <div className="container my-3 component-bg rounded p-3" style={{width:"90%"}}>
      <h3>Submit PFE Proposal</h3>
      {submissionReminder && (
        <div className="alert alert-warning">
          Reminder: The deadline for submitting PFE proposals is approaching!
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="d-flex flex-wrap justify-content-between"
        
      >
        {/* <div className="mb-3" style={{width:"49%"}}>
              <label className="form-label">Supervisor First Name</label>
              <input
                type="text"
                className="form-control"
                name="supervisorFirstName"
                value={formData.supervisorFirstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3" style={{width:"49%"}}>
              <label className="form-label">Supervisor Last Name</label>
              <input
                type="text"
                className="form-control"
                name="supervisorLastName"
                value={formData.supervisorLastName}
                onChange={handleChange}
                required
              />
            </div> */}
        <div className="mb-3" style={{ width: '49%' }}>
          <label className="form-label">Co-Supervisor First Name</label>
          <input
            type="text"
            className="form-control"
            name="coSupervisorFirstName"
            value={formData.coSupervisorFirstName}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3" style={{ width: '49%' }}>
          <label className="form-label">Co-Supervisor Last Name</label>
          <input
            type="text"
            className="form-control"
            name="coSupervisorLastName"
            value={formData.coSupervisorLastName}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3" style={{ width: '49%' }}>
          <label className="form-label">Master's Option</label>
          <select
            className="form-select"
            name="mastersOption"
            value={formData.mastersOption}
            onChange={handleChange}
            required
          >
            <option value="">Select an Option</option>
            <option value="GL">GL</option>
            <option value="IA">IA</option>
            <option value="RSD">RSD</option>
            <option value="SIC">SIC</option>
          </select>
        </div>
        <div className="mb-3" style={{ width: '49%' }}>
          <label className="form-label">Type</label>
          <select
            className="form-select"
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="Classic">Classic</option>
            <option value="Innovative">Innovative</option>
          </select>
        </div>
        <div className="mb-3" style={{ width: '49%' }}>
          <label className="form-label">PFE Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3" style={{ width: '49%' }}>
          <label className="form-label">Summary</label>
          <textarea
            className="form-control"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="mb-3" style={{ width: '49%' }}>
          <label className="form-label">Technologies</label>
          <textarea
            className="form-control"
            name="technologies"
            value={formData.technologies}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="mb-3" style={{ width: '49%' }}>
          <label className="form-label">Material Needs</label>
          <textarea
            className="form-control"
            name="materials"
            value={formData.materials}
            onChange={handleChange}
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit Proposal
        </button>
      </form>
    </div>
  )
}
