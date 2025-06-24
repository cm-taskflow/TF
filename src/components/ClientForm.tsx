import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Database } from '../lib/database.types'
import { Save, ArrowLeft } from 'lucide-react'

type ClientInsert = Database['public']['Tables']['clients']['Insert']
type ClientUpdate = Database['public']['Tables']['clients']['Update']

export function ClientForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = !!id

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<ClientInsert>({
    name: '',
    legal_form: '',
    vat_number: '',
    fiscal_year_end: '',
    director_name: '',
    director_email: '',
    director_phone: '',
    language: 'NL',
    status: 'active',
    risk_profile: 'normal',
    client_type: 'company',
    billing_method: 'fixed'
  })

  useEffect(() => {
    if (isEditing) {
      fetchClient()
    }
  }, [id, isEditing])

  async function fetchClient() {
    if (!id) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        throw error
      }

      setFormData(data)
    } catch (err) {
      console.error('Error fetching client:', err)
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
      if (isEditing) {
        const { error } = await supabase
          .from('clients')
          .update(formData as ClientUpdate)
          .eq('id', id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('clients')
          .insert([formData])

        if (error) throw error
      }

      navigate('/clients')
    } catch (err) {
      console.error('Error saving client:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/clients')}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Clients
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">
          {isEditing ? 'Edit Client' : 'Add New Client'}
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
              <h2 className="text-base font-semibold leading-7 text-gray-900">Basic Information</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Enter the basic details for this client.
              </p>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                Company Name *
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="legal_form" className="block text-sm font-medium leading-6 text-gray-900">
                Legal Form *
              </label>
              <input
                type="text"
                name="legal_form"
                id="legal_form"
                required
                value={formData.legal_form}
                onChange={handleInputChange}
                placeholder="e.g., BV, NV, BVBA"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="vat_number" className="block text-sm font-medium leading-6 text-gray-900">
                VAT Number *
              </label>
              <input
                type="text"
                name="vat_number"
                id="vat_number"
                required
                value={formData.vat_number}
                onChange={handleInputChange}
                placeholder="BE0123456789"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="fiscal_year_end" className="block text-sm font-medium leading-6 text-gray-900">
                Fiscal Year End *
              </label>
              <input
                type="date"
                name="fiscal_year_end"
                id="fiscal_year_end"
                required
                value={formData.fiscal_year_end}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="language" className="block text-sm font-medium leading-6 text-gray-900">
                Language
              </label>
              <select
                name="language"
                id="language"
                value={formData.language}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="NL">Dutch</option>
                <option value="FR">French</option>
                <option value="EN">English</option>
              </select>
            </div>

            {/* Director Information */}
            <div className="sm:col-span-6 mt-8">
              <h2 className="text-base font-semibold leading-7 text-gray-900">Director Information</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Contact details for the primary director or contact person.
              </p>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="director_name" className="block text-sm font-medium leading-6 text-gray-900">
                Director Name *
              </label>
              <input
                type="text"
                name="director_name"
                id="director_name"
                required
                value={formData.director_name}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="director_email" className="block text-sm font-medium leading-6 text-gray-900">
                Director Email *
              </label>
              <input
                type="email"
                name="director_email"
                id="director_email"
                required
                value={formData.director_email}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="director_phone" className="block text-sm font-medium leading-6 text-gray-900">
                Director Phone
              </label>
              <input
                type="tel"
                name="director_phone"
                id="director_phone"
                value={formData.director_phone || ''}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            {/* Status and Settings */}
            <div className="sm:col-span-6 mt-8">
              <h2 className="text-base font-semibold leading-7 text-gray-900">Status & Settings</h2>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">
                Status
              </label>
              <select
                name="status"
                id="status"
                value={formData.status || 'active'}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="risk_profile" className="block text-sm font-medium leading-6 text-gray-900">
                Risk Profile
              </label>
              <select
                name="risk_profile"
                id="risk_profile"
                value={formData.risk_profile || 'normal'}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="client_type" className="block text-sm font-medium leading-6 text-gray-900">
                Client Type
              </label>
              <select
                name="client_type"
                id="client_type"
                value={formData.client_type || 'company'}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="company">Company</option>
                <option value="person">Person</option>
                <option value="non-profit">Non-Profit</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
          <button
            type="button"
            onClick={() => navigate('/clients')}
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
            {isEditing ? 'Update Client' : 'Create Client'}
          </button>
        </div>
      </form>
    </div>
  )
}