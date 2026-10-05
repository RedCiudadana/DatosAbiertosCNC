import { useParams, Link } from 'react-router-dom';

export function HistoriaDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Historia no encontrada</h1>
      <p className="text-gray-500 mb-6">La historia "{slug}" no existe o no está publicada.</p>
      <Link to="/historias" className="btn-primary">Volver a historias</Link>
    </div>
  );
}
