import { createLazyFileRoute } from '@tanstack/react-router'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from '../../hooks/useForm'

const FormSchema = z.object({
  password: z.string().trim().min(1),
  password_confirmation: z.string().trim().min(1),
})

type ZodFormSchema = z.infer<typeof FormSchema>

export const Route = createLazyFileRoute('/auth/reset-password')({
  component: RouteComponent,
})

function RouteComponent() {
  const form = useForm<ZodFormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: '',
      password_confirmation: '',
    },
  })

  return (
    <Form
      onSubmit={form.onSubmit(async (data) => {
        console.log(data)
      })}
      className="justify-content-center bg-white p-4 shadow mt-5"
      style={{
        width: '30%',
        margin: 'auto',
        borderRadius: '20px',
        border: '1.5px solid #ccc',
      }}
    >
      <h3 className='text-center mb-2'>Reset Password</h3>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="password">Password</Form.Label>
        <Form.Control
          {...form.register('password', { required: false })}
          name="password"
          type="password"
          placeholder="Password"
        />
        {form.formState.errors.password?.message && (
          <Form.Text>{form.formState.errors.password?.message}</Form.Text>
        )}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="password-confirmation">
          Confirm Password
        </Form.Label>
        <Form.Control
          {...form.register('password_confirmation', { required: true })}
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
      <Button variant="primary" type="submit" disabled={form.disabled}>
        Reset Password
      </Button>
    </Form>
  )
}
