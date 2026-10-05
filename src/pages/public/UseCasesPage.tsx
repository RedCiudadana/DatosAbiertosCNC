import { Link } from 'react-router-dom';
import { Lightbulb } from 'lucide-react';

export function UseCasesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Casos de uso</h1>
        <p className="text-gray-500 mt-1">Ejemplos de cómo utilizar los datos anticorrupción</p>
      </div>

      <div className="card p-12 text-center">
        <Lightbulb className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay casos de uso publicados</h3>
        <p className="text-sm text-gray-500">Los casos de uso se publicarán próximamente.</p>
        <Link to="/explorar" className="btn-primary mt-6">Explorar datos</Link>
      </div>
    </div>
  );
}
