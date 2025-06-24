import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Database } from '../lib/database.types'
import { Save, ArrowLeft } from 'lucide-react'

type TaskInsert = Database['public']['Tables']['tasks']['Insert']
type TaskUpdate = Database['public']['Tables']['tasks']['Update']
type Client = Database['public']['Tables']['clients']['Row']

export function TaskForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const preselectedClientId = searchParams.get('client_id')
  const isEditing = !!id

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [formData, setFormData] = useState<TaskInsert>({
    client_id: preselectedClientId || '',
    title: '',
    description: '',
    status: 'new',
    priority: 'medium',
    due_date: '',
    assigned_to: '',
    category: '',
    estimated_hours: 0,
    actual_hours: 0
  })

  useEffect(() => {
    fetchClients()
    if (isEditing) {
      fetchTask()
    }
  }, [id, isEditing])

  async function fetchClients() {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name, vat_number')
        .eq('status', 'active')
        .order('name')

      if (error) throw error
      setClients(data || [])
    } catch (err) {
      console.error('Error fetching clients:', err)
    }
  }

  async function fetchTask() {
    if (!id) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setFormData(data)
    } catch (err) {
      console.error('Error fetching task:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const taskData = {
        ...formData,
        estimated_hours: formData.estimated_hours || null,
        actual_hours: formData.actual_hours || null,
        due_date: formData.due_date || null
      }

      if (isEditing) {
        const { error } = await supabase
          .from('tasks')
          .update(taskData as TaskUpdate)
          .eq('id', id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('tasks')
          .insert([taskData])

        if (error) throw error
      }

      if (preselectedClientId) {
        navigate(`/clients/${preselectedClientId}`)
      } else {
        navigate('/tasks')
      }
    } catch (err) {
      console.error('Error saving task:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : parseFloat(value)) : value
    }))
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(preselectedClientId ? `/clients/${preselectedClientId}` : '/tasks')}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back {preselectedClientId ? 'to Client' : 'to Tasks'}
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">
          {isEditing ? 'Edit Task' : 'Add New Task'}
        </h1>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
        <div className="px-4 py-6 sm:p-8">
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {/* Basic Information */}
            <div className="sm:col-span-6">
              <h2 className="text-base font-semibold leading-7 text-gray-900">Task Details</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Enter the details for this task.
              </p>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="client_id" className="block text-sm font-medium leading-6 text-gray-900">
                Client *
              </label>
              <select
                name="client_id"
                id="client_id"
                required
                value={formData.client_id}
                onChange={handleInputChange}
                disabled={!!preselectedClientId}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:bg-gray-100"
              >
                <option value="">Select a client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} ({client.vat_number})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">
                Category
              </label>
              <input
                type="text"
                name="category"
                id="category"
                value={formData.category || ''}
                onChange={handleInputChange}
                placeholder="e.g., Accounting, Legal, Consultation"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                Task Title *
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={3}
                value={formData.description || ''}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            {/* Status and Priority */}
            <div className="sm:col-span-2">
              <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">
                Status
              </label>
              <select
                name="status"
                id="status"
                value={formData.status || 'new'}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="new">New</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="priority" className="block text-sm font-medium leading-6 text-gray-900">
                Priority
              </label>
              <select
                name="priority"
                id="priority"
                value={formData.priority || 'medium'}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="due_date" className="block text-sm font-medium leading-6 text-gray-900">
                Due Date
              </label>
              <input
                type="date"
                name="due_date"
                id="due_date"
                value={formData.due_date || ''}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            {/* Assignment and Time Tracking */}
            <div className="sm:col-span-6 mt-8">
              <h2 className="text-base font-semibold leading-7 text-gray-900">Assignment & Time Tracking</h2>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="assigned_to" className="block text-sm font-medium leading-6 text-gray-900">
                Assigned To
              </label>
              <input
                type="text"
                name="assigned_to"
                id="assigned_to"
                value={formData.assigned_to || ''}
                onChange={handleInputChange}
                placeholder="Person or team"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="estimated_hours" className="block text-sm font-medium leading-6 text-gray-900">
                Estimated Hours
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                name="estimated_hours"
                id="estimated_hours"
                value={formData.estimated_hours || ''}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="actual_hours" className="block text-sm font-medium leading-6 text-gray-900">
                Actual Hours
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                name="actual_hours"
                id="actual_hours"
                value={formData.actual_hours || ''}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
          <button
            type="button"
            onClick={() => navigate(preselectedClientId ? `/clients/${preselectedClientId}` : '/tasks')}
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isEditing ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  )
}