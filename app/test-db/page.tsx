import { createClient } from '@/utils/supabase/server'

export default async function TestDbPage() {
  const supabase = await createClient()
  const { data: venues, error } = await supabase.from('venues').select('*')

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Test de Conexión a Supabase</h1>
        
        {error ? (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
            <h2 className="text-xl font-semibold text-red-400 mb-2">❌ Error</h2>
            <pre className="text-red-300 text-sm overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        ) : venues && venues.length === 0 ? (
          <div className="bg-green-900/20 border border-green-500 rounded-lg p-4">
            <p className="text-green-400 text-lg">
              ✅ CONEXIÓN EXITOSA: La base de datos responde (Tabla Venues vacía)
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-900/20 border border-green-500 rounded-lg p-4 mb-4">
              <p className="text-green-400 text-lg">
                ✅ CONEXIÓN EXITOSA: Se encontraron {venues?.length || 0} registro(s)
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Datos de Venues:</h2>
              <pre className="text-sm overflow-auto text-gray-300">
                {JSON.stringify(venues, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
