import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Database } from '../lib/database.types'
import { ArrowLeft, Edit, FileText, Calendar } from 'lucide-react'

type Client = Database['public']['Tables']['clients']['Row']
type Task = Database['public']['Tables']['tasks']['Row']

export function ClientDetails() {
  const { id } = useParams<{ id: string }>()
  const [client, setClient] = useState<Client | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      fetchClientDetails()
    }
  }, [id])

  async function fetchClientDetails() {
    if (!id) return

    try {
      setLoading(true)
      setError(null)

      // Fetch client
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single()

      if (clientError) throw clientError

      // Fetch client's tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('client_id', id)
        .order('created_at', { ascending: false })

      if (tasksError) throw tasksError

      setClient(clientData)
      setTasks(tasksData || [])
    } catch (err) {
      console.error('Error fetching client details:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error || !client) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || 'Client not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/clients"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Clients
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{client.name}</h1>
            <p className="text-sm text-gray-500">VAT: {client.vat_number}</p>
          </div>
          <div className="flex space-x-3">
            <Link
              to={`/clients/${client.id}/edit`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Client
            </Link>
            <Link
              to={`/tasks/new?client_id=${client.id}`}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <FileText className="h-4 w-4 mr-2" />
              Add Task
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Client Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Basic Information
              </h3>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Legal Form</dt>
                  <dd className="mt-1 text-sm text-gray-900">{client.legal_form}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Fiscal Year End</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(client.fiscal_year_end).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Language</dt>
                  <dd className="mt-1 text-sm text-gray-900">{client.language}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      client.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : client.status === 'inactive'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {client.status || 'unknown'}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Risk Profile</dt>
                  <dd className="mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      client.risk_profile === 'low' 
                        ? 'bg-green-100 text-green-800'
                        : client.risk_profile === 'high'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {client.risk_profile || 'normal'}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Client Type</dt>
                  <dd className="mt-1 text-sm text-gray-900">{client.client_type || 'company'}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Director Information */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Director Information
              </h3>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{client.director_name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <a href={`mailto:${client.director_email}`} className="text-indigo-600 hover:text-indigo-500">
                      {client.director_email}
                    </a>
                  </dd>
                </div>
                {client.director_phone && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="mt-1 text-sm text-gray-900">{client.director_phone}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Additional Information */}
          {client.notes && (
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Notes
                </h3>
                <p className="text-sm text-gray-900">{client.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Tasks Sidebar */}
        <div className="space-y-6">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Recent Tasks
                </h3>
                <Link
                  to={`/tasks/new?client_id=${client.id}`}
                  className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                >
                  Add Task
                </Link>
              </div>
              
              {tasks.length === 0 ? (
                <p className="text-sm text-gray-500">No tasks yet</p>
              ) : (
                <div className="space-y-3">
                  {tasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="border-l-4 border-indigo-400 pl-3">
                      <Link
                        to={`/tasks/${task.id}`}
                        className="block hover:bg-gray-50 rounded p-2 -ml-2"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{task.title}</p>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            task.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : task.status === 'in-progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {task.status || 'new'}
                          </span>
                        </div>
                        {task.due_date && (
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            Due {new Date(task.due_date).toLocaleDateString()}
                          </div>
                        )}
                      </Link>
                    </div>
                  ))}
                  
                  {tasks.length > 5 && (
                    <Link
                      to={`/tasks?client_id=${client.id}`}
                      className="block text-sm text-indigo-600 hover:text-indigo-500 text-center pt-2"
                    >
                      View all {tasks.length} tasks
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Quick Stats
              </h3>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Total Tasks</dt>
                  <dd className="text-sm font-medium text-gray-900">{tasks.length}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Completed</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {tasks.filter(t => t.status === 'completed').length}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">In Progress</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {tasks.filter(t => t.status === 'in-progress').length}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Client Since</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {client.created_at ? new Date(client.created_at).toLocaleDateString() : 'Unknown'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}