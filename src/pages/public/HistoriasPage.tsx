import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export function HistoriasPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Historias con datos</h1>
            <p className="text-gray-500 mt-1">Análisis e investigaciones realizadas con los datasets del portal</p>
          </div>
        </div>
      </div>

      <div className="card p-12 text-center">
        <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay historias publicadas</h3>
        <p className="text-sm text-gray-500">Las historias con datos se publicarán próximamente.</p>
        <Link to="/explorar" className="btn-primary mt-6">Explorar datos</Link>
      </div>
    </div>
  );
}
