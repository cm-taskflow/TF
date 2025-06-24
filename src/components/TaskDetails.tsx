import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Database } from '../lib/database.types'
import { ArrowLeft, Edit, Calendar, User, Clock, Tag } from 'lucide-react'

type Task = Database['public']['Tables']['tasks']['Row'] & {
  client?: { id: string; name: string; vat_number: string }
}

export function TaskDetails() {
  const { id } = useParams<{ id: string }>()
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      fetchTaskDetails()
    }
  }, [id])

  async function fetchTaskDetails() {
    if (!id) return

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          client:clients(id, name, vat_number)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      setTask(data)
    } catch (err) {
      console.error('Error fetching task details:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  async function updateTaskStatus(newStatus: string) {
    if (!task) return

    try {
      const updates: any = { status: newStatus }
      if (newStatus === 'completed' && !task.completed_at) {
        updates.completed_at = new Date().toISOString()
      }

      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', task.id)

      if (error) throw error

      setTask(prev => prev ? { ...prev, ...updates } : null)
    } catch (err) {
      console.error('Error updating task status:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error || !task) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || 'Task not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/tasks"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Tasks
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{task.title}</h1>
            {task.client && (
              <p className="text-sm text-gray-500">
                Client: <Link to={`/clients/${task.client.id}`} className="text-indigo-600 hover:text-indigo-500">
                  {task.client.name}
                </Link>
              </p>
            )}
          </div>
          <div className="flex space-x-3">
            <Link
              to={`/tasks/${task.id}/edit`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Task
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Task Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Task Information
              </h3>
              
              {task.description && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Description</h4>
                  <p className="text-sm text-gray-900">{task.description}</p>
                </div>
              )}

              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      task.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : task.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-800'
                        : task.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {task.status || 'new'}
                    </span>
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">Priority</dt>
                  <dd className="mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      task.priority === 'urgent'
                        ? 'bg-red-100 text-red-800'
                        : task.priority === 'high'
                        ? 'bg-orange-100 text-orange-800'
                        : task.priority === 'low'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {task.priority || 'medium'}
                    </span>
                  </dd>
                </div>

                {task.category && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Category</dt>
                    <dd className="mt-1 text-sm text-gray-900 flex items-center">
                      <Tag className="h-4 w-4 mr-1 text-gray-400" />
                      {task.category}
                    </dd>
                  </div>
                )}

                {task.assigned_to && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Assigned To</dt>
                    <dd className="mt-1 text-sm text-gray-900 flex items-center">
                      <User className="h-4 w-4 mr-1 text-gray-400" />
                      {task.assigned_to}
                    </dd>
                  </div>
                )}

                {task.due_date && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Due Date</dt>
                    <dd className="mt-1 text-sm text-gray-900 flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      {new Date(task.due_date).toLocaleDateString()}
                    </dd>
                  </div>
                )}

                {task.completed_at && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Completed At</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(task.completed_at).toLocaleDateString()}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Time Tracking */}
          {(task.estimated_hours || task.actual_hours) && (
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Time Tracking
                </h3>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
                  {task.estimated_hours && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Estimated Hours</dt>
                      <dd className="mt-1 text-sm text-gray-900 flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-400" />
                        {task.estimated_hours}h
                      </dd>
                    </div>
                  )}
                  
                  {task.actual_hours && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Actual Hours</dt>
                      <dd className="mt-1 text-sm text-gray-900 flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-400" />
                        {task.actual_hours}h
                      </dd>
                    </div>
                  )}

                  {task.estimated_hours && task.actual_hours && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Variance</dt>
                      <dd className="mt-1 text-sm flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-400" />
                        <span className={task.actual_hours > task.estimated_hours ? 'text-red-600' : 'text-green-600'}>
                          {task.actual_hours > task.estimated_hours ? '+' : ''}
                          {(task.actual_hours - task.estimated_hours).toFixed(1)}h
                        </span>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          )}
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                {task.status !== 'in-progress' && (
                  <button
                    onClick={() => updateTaskStatus('in-progress')}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Start Task
                  </button>
                )}
                
                {task.status !== 'completed' && (
                  <button
                    onClick={() => updateTaskStatus('completed')}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    Mark Complete
                  </button>
                )}

                {task.status === 'completed' && (
                  <button
                    onClick={() => updateTaskStatus('in-progress')}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Reopen Task
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Task Stats */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Task Info
              </h3>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Created</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {task.created_at ? new Date(task.created_at).toLocaleDateString() : 'Unknown'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Last Updated</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {task.updated_at ? new Date(task.updated_at).toLocaleDateString() : 'Unknown'}
                  </dd>
                </div>
                {task.price && (
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Price</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      €{task.price.toFixed(2)}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}