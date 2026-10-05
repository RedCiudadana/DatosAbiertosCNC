import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Network, Search, Building2, Database, ArrowRight } from 'lucide-react';
import { usePortalData } from '@/hooks/usePortalData';
import { DynamicIcon } from '@/components/DynamicIcon';
import { StatusBadge } from '@/components/StatusBadge';
import { useState } from 'react';

interface MapNode {
  id: string;
  label: string;
  type: 'dataset' | 'domain';
  icon?: string;
  color?: string;
  x: number;
  y: number;
}

interface MapEdge {
  source: string;
  target: string;
  label?: string;
}

export function MapaDatosPage() {
  const { integrityDomains, datasets } = usePortalData();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const published = datasets.filter((d) => d.published);

  const { nodes, edges } = useMemo(() => {
    const nodeList: MapNode[] = [];
    const edgeList: MapEdge[] = [];

    integrityDomains.forEach((d, i) => {
      const angle = (i / Math.max(integrityDomains.length, 1)) * 2 * Math.PI;
      nodeList.push({
        id: `domain-${d.id}`,
        label: d.name,
        type: 'domain',
        icon: d.icon_name,
        color: d.color,
        x: 50 + 35 * Math.cos(angle),
        y: 50 + 35 * Math.sin(angle),
      });
    });

    published.forEach((ds, i) => {
      const angle = (i / Math.max(published.length, 1)) * 2 * Math.PI;
      nodeList.push({
        id: `ds-${ds.id}`,
        label: ds.name,
        type: 'dataset',
        x: 50 + 20 * Math.cos(angle),
        y: 50 + 20 * Math.sin(angle),
      });
    });

    return { nodes: nodeList, edges: edgeList };
  }, [integrityDomains, published]);

  const selectedDataset = selectedNode?.startsWith('ds-')
    ? published.find((d) => `ds-${d.id}` === selectedNode)
    : null;
  const selectedDomain = selectedNode?.startsWith('domain-')
    ? integrityDomains.find((d) => `domain-${d.id}` === selectedNode)
    : null;

  return (
    <div className="animate-fade-in">
      <section className="relative overflow-hidden text-white py-14">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/16321326/pexels-photo-16321326.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Vista aérea de Ciudad de Guatemala"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-cnc-900/90 to-cnc-950/85" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/20 text-teal-300 backdrop-blur-sm">
              <Network className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white sm:text-3xl">Mapa de Datos para la Integridad de Guatemala</h1>
              <p className="text-cnc-200 mt-1">Visualiza las relaciones entre conjuntos de datos, ejes de integridad e identificadores</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map visualization */}
          <div className="lg:col-span-2 card overflow-hidden relative" style={{ minHeight: '500px' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-cnc-50/30 to-teal-50/30" />
            <svg className="absolute inset-0 w-full h-full" style={{ minHeight: '500px' }}>
              {edges.map((edge, i) => {
                const source = nodes.find((n) => n.id === edge.source);
                const target = nodes.find((n) => n.id === edge.target);
                if (!source || !target) return null;
                return (
                  <g key={i}>
                    <line
                      x1={`${source.x}%`} y1={`${source.y}%`}
                      x2={`${target.x}%`} y2={`${target.y}%`}
                      stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 2"
                    />
                  </g>
                );
              })}
            </svg>
            {nodes.map((node) => (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node.id)}
                className="absolute flex flex-col items-center gap-1 group"
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div
                  className={`flex items-center justify-center rounded-xl shadow-sm transition-all group-hover:scale-110 ${
                    selectedNode === node.id ? 'ring-2 ring-cnc-500 ring-offset-2' : ''
                  } ${
                    node.type === 'domain'
                      ? 'h-12 w-12 text-white'
                      : 'h-10 w-10 bg-white text-cnc-700 border border-gray-200'
                  }`}
                  style={node.type === 'domain' && node.color ? { backgroundColor: node.color } : {}}
                >
                  {node.icon ? (
                    <DynamicIcon name={node.icon} className={node.type === 'domain' ? 'h-5 w-5' : 'h-4 w-4'} />
                  ) : (
                    <Database className="h-4 w-4" />
                  )}
                </div>
                <span className={`text-xs font-medium px-1.5 py-0.5 rounded max-w-[120px] truncate ${
                  node.type === 'domain' ? 'text-white bg-gray-800/80' : 'text-gray-600 bg-white/80'
                }`}>
                  {node.label}
                </span>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <div className="space-y-4">
            {!selectedNode && (
              <div className="card p-6 text-center">
                <Search className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Selecciona un nodo</h3>
                <p className="text-xs text-gray-500">Haz clic en cualquier nodo del mapa para ver detalles.</p>
              </div>
            )}

            {selectedDomain && (
              <div className="card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white" style={{ backgroundColor: selectedDomain.color || '#0f766e' }}>
                    <DynamicIcon name={selectedDomain.icon_name} className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{selectedDomain.name}</h3>
                    {selectedDomain.question && <p className="text-xs text-cnc-700 font-medium">{selectedDomain.question}</p>}
                  </div>
                </div>
                {selectedDomain.description && <p className="text-sm text-gray-600 leading-relaxed mb-4">{selectedDomain.description}</p>}
                <Link to={`/explorar?domain=${selectedDomain.slug}`} className="btn-primary text-sm">
                  Ver datasets <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}

            {selectedDataset && (
              <div className="space-y-4">
                <div className="card p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cnc-50 text-cnc-700 shrink-0">
                      <DynamicIcon name={selectedDataset.icon_name} url={selectedDataset.icon_url} iconType={selectedDataset.icon_type} className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-gray-900">{selectedDataset.name}</h3>
                      {selectedDataset.short_description && <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{selectedDataset.short_description}</p>}
                    </div>
                  </div>
                  {selectedDataset.status && <StatusBadge status={selectedDataset.status} size="sm" />}
                  {selectedDataset.institution && (
                    <div className="flex items-center gap-2 mt-3 text-xs text-gray-600">
                      <Building2 className="h-3.5 w-3.5 text-gray-400" />
                      {selectedDataset.institution.name}
                    </div>
                  )}
                  <Link to={`/datasets/${selectedDataset.slug}`} className="btn-secondary text-xs mt-4 w-full justify-center">
                    Ver ficha completa <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
