import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, TrendingUp } from 'lucide-react';
import { usePortalData } from '@/hooks/usePortalData';
import { PRIORITY_LEVELS } from '@/lib/constants';

export function BrechasPage() {
  const { datasets } = usePortalData();
  const published = datasets.filter((d) => d.published);
  const gaps = published.filter((d) => d.openness_level === 0);

  return (
    <div className="animate-fade-in">
      <section className="relative overflow-hidden text-white py-14">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/35526170/pexels-photo-35526170.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Vista aérea de Santa Cruz del Quiché, Guatemala"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-cnc-900/90 to-cnc-950/85" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20 text-red-300 backdrop-blur-sm">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white sm:text-3xl">Brechas de datos para la integridad</h1>
              <p className="text-cnc-200 mt-1">Conjuntos de datos estratégicos que Guatemala aún no publica</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        {gaps.length === 0 ? (
          <div className="card p-12 text-center">
            <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay brechas identificadas</h3>
            <p className="text-sm text-gray-500">Todos los datasets del portal tienen algún nivel de publicación.</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Conjunto de datos</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden md:table-cell">Observaciones</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Categoría</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {gaps.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 font-medium text-gray-900">
                        <Link to={`/datasets/${item.slug}`} className="hover:text-cnc-700">
                          {item.name}
                        </Link>
                      </td>
                      <td className="px-4 py-4 text-gray-600 hidden md:table-cell text-xs">
                        {item.guatemala_observations ? (
                          <span className="line-clamp-2">{item.guatemala_observations}</span>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-4 text-gray-600 text-xs">
                        {item.category?.name || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <Link to="/explorar" className="btn-secondary">
            Explorar todos los datos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
