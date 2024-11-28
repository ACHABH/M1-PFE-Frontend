import { createLazyFileRoute } from '@tanstack/react-router'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Stack from 'react-bootstrap/Stack'
import { zodResolver } from '@hookform/resolvers/zod'
import isStrongPassword from 'validator/lib/isStrongPassword'
import { z } from 'zod'
import { useForm } from '../../hooks/useForm'
import { useMemo } from 'react'

const FormSchema = z.object({
  email: z.string().trim().min(1).email(),
  password: z.string().trim().min(1),
  first_name: z.string().trim().min(1),
  last_name: z.string().trim().min(1),
  role: z.string().trim().min(1),
  password_confirmation: z.string().trim().min(1),
})

export const Route = createLazyFileRoute('/admin/add-user')({
  component: Component,
})

function Component() {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      role: 'student',
      major: '',
      average: '',
      password: '',
      password_confirmation: '',
      recruitment_date: '',
      grade: '',
      company_name: '',
    },
  })

  const isPasswordStrong = useMemo(
    () => isStrongPassword(form.watch('password')),
    [form.watch('password')],
  )

  return (
    <Form
      onSubmit={form.onSubmit(async (data) => {
        console.log(data)
      })}
      className="justify-content-center bg-white p-4 shadow my-4"
      style={{
        width: '30%',
        margin: 'auto',
        borderRadius: '20px',
        border: '1.5px solid #ccc',
      }}
    >
      {/* Common Fields */}
      <Form.Group className="mb-3">
        <Form.Label htmlFor="role">Who Is He?</Form.Label>
        <Form.Select
          required
          {...form.register('role')}
          value={form.watch('role')}
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="company">Company</option>
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="first-name">First name</Form.Label>
        <Form.Control
          {...form.register('first_name')}
          name="first-name"
          type="text"
          placeholder="First name"
          required
        />
        {form.formState.errors.first_name?.message && (
          <Form.Text>{form.formState.errors.first_name?.message}</Form.Text>
        )}
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="last-name">Last name</Form.Label>
        <Form.Control
          {...form.register('last_name')}
          name="last-name"
          type="text"
          placeholder="Last name"
          required
        />
        {form.formState.errors.last_name?.message && (
          <Form.Text>{form.formState.errors.last_name?.message}</Form.Text>
        )}
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="email">Email address</Form.Label>
        <Form.Control
          {...form.register('email')}
          name="email"
          type="email"
          placeholder="Email"
          required
        />
        {form.formState.errors.email?.message && (
          <Form.Text>{form.formState.errors.email?.message}</Form.Text>
        )}
      </Form.Group>

      {/* Specific Fields Based On The Role */}
      {form.watch('role') === 'student' && (
        <>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="major">Master's Option</Form.Label>
            <Form.Select required {...form.register('major')}>
              <option value="gl">GL</option>
              <option value="ia">IA</option>
              <option value="rsd">RSD</option>
              <option value="sic">SIC</option>
            </Form.Select>
            {form.formState.errors.role?.message && (
              <Form.Text>{form.formState.errors.role?.message}</Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="average_score">
              Average Score (Master's 1)
            </Form.Label>
            <Form.Control
              type="number"
              {...form.register('average')}
              placeholder="Average Score"
              required
            />
            {form.formState.errors.average?.message && (
              <Form.Text>{form.formState.errors.average?.message}</Form.Text>
            )}
          </Form.Group>
        </>
      )}
      {form.watch('role') === 'teacher' && (
        <>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="recruitment_date">Recruitment Date</Form.Label>
            <Form.Control
              {...form.register('recruitment_date')}
              type="date"
              required
            />
            {form.formState.errors.recruitment_date?.message && (
              <Form.Text>
                {form.formState.errors.recruitment_date?.message}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="grade">Grade</Form.Label>
            <Form.Control
              {...form.register('grade')}
              type="text"
              placeholder="Grade (e.g., MAA, MAB)"
              required
            />
            {form.formState.errors.grade?.message && (
              <Form.Text>{form.formState.errors.grade?.message}</Form.Text>
            )}
          </Form.Group>
        </>
      )}
      {form.watch('role') === 'company' && (
        <Form.Group className="mb-3">
          <Form.Label htmlFor="company_name">Company Name</Form.Label>
          <Form.Control
            {...form.register('company_name')}
            type="text"
            placeholder="Company Name"
            required
          />
          {form.formState.errors.company_name?.message && (
            <Form.Text>{form.formState.errors.company_name?.message}</Form.Text>
          )}
        </Form.Group>
      )}

      {/* Password Fields */}
      <Form.Group className="mb-3">
        <Form.Label htmlFor="password">Password</Form.Label>
        <Form.Control
          {...form.register('password')}
          type="password"
          placeholder="Password"
          required
        />
        {form.formState.errors.password?.message && (
          <Form.Text>{form.formState.errors.password?.message}</Form.Text>
        )}
        {!isPasswordStrong && (
          <Form.Text>Make sure to create a strong password</Form.Text>
        )}
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="password-confirmation">
          Confirm Password
        </Form.Label>
        <Form.Control
          {...form.register('password_confirmation')}
          type="password"
          placeholder="Confirm password"
          required
        />
        {form.formState.errors.password_confirmation?.message && (
          <Form.Text>
            {form.formState.errors.password_confirmation?.message}
          </Form.Text>
        )}
      </Form.Group>
      <Stack direction="horizontal" style={{ justifyContent: 'space-between' }}>
        <Button variant="primary" type="submit" disabled={form.disabled}>
          Create User
        </Button>
      </Stack>
    </Form>
  )
}
