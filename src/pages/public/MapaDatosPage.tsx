import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Network, Search, Building2, Database, ArrowRight, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { usePortalData } from '@/hooks/usePortalData';
import { DynamicIcon } from '@/components/DynamicIcon';
import { StatusBadge } from '@/components/StatusBadge';
import type { DatasetWithRelations, DatasetRelationship, Identifier } from '@/types';

interface MapNode {
  id: string;
  label: string;
  type: 'dataset' | 'domain' | 'identifier';
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
  const { integrityDomains, identifiers, institutions } = usePortalData();
  const [datasets, setDatasets] = useState<DatasetWithRelations[]>([]);
  const [relationships, setRelationships] = useState<DatasetRelationship[]>([]);
  const [datasetIdentifiers, setDatasetIdentifiers] = useState<Record<string, string[]>>({});
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [dsRes, relRes, diRes] = await Promise.all([
        supabase
          .from('datasets')
          .select('*, category:categories(*), institution:institutions(*), status:statuses(*)')
          .eq('published', true)
          .order('name'),
        supabase.from('dataset_relationships').select('*'),
        supabase.from('dataset_identifiers').select('dataset_id, identifier_id, identifier:identifiers(name)'),
      ]);

      const dsData = (dsRes.data || []) as unknown as DatasetWithRelations[];
      setDatasets(dsData);
      setRelationships((relRes.data as DatasetRelationship[]) || []);

      const diMap: Record<string, string[]> = {};
      (diRes.data || []).forEach((r: unknown) => {
        const row = r as { dataset_id: string; identifier: { name: string } | null };
        if (row.identifier) {
          if (!diMap[row.dataset_id]) diMap[row.dataset_id] = [];
          diMap[row.dataset_id].push(row.identifier.name);
        }
      });
      setDatasetIdentifiers(diMap);
      setLoading(false);
    }
    load();
  }, []);

  const { nodes, edges } = useMemo(() => {
    const nodeList: MapNode[] = [];
    const edgeList: MapEdge[] = [];

    integrityDomains.forEach((d, i) => {
      const angle = (i / integrityDomains.length) * 2 * Math.PI;
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

    const dsPerDomain = 12;
    datasets.forEach((ds, i) => {
      const domain = integrityDomains[0];
      const angle = (i / Math.max(datasets.length, 1)) * 2 * Math.PI;
      nodeList.push({
        id: `ds-${ds.id}`,
        label: ds.name,
        type: 'dataset',
        x: 50 + 20 * Math.cos(angle),
        y: 50 + 20 * Math.sin(angle),
      });
    });

    relationships.forEach((rel) => {
      edgeList.push({
        source: `ds-${rel.source_dataset_id}`,
        target: `ds-${rel.target_dataset_id}`,
        label: rel.join_field || rel.relationship_type,
      });
    });

    return { nodes: nodeList, edges: edgeList };
  }, [integrityDomains, datasets, relationships]);

  const selectedDataset = selectedNode?.startsWith('ds-')
    ? datasets.find((d) => `ds-${d.id}` === selectedNode)
    : null;
  const selectedDomain = selectedNode?.startsWith('domain-')
    ? integrityDomains.find((d) => `domain-${d.id}` === selectedNode)
    : null;
  const selectedDsRelationships = selectedDataset
    ? relationships.filter((r) => r.source_dataset_id === selectedDataset.id || r.target_dataset_id === selectedDataset.id)
    : [];

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

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-96 bg-gray-200 rounded-xl" />
        </div>
      ) : (
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
                <p className="text-xs text-gray-500">Haz clic en cualquier nodo del mapa para ver detalles, datasets relacionados e identificadores.</p>
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

                {datasetIdentifiers[selectedDataset.id] && datasetIdentifiers[selectedDataset.id].length > 0 && (
                  <div className="card p-5">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Identificadores disponibles</h4>
                    <div className="flex flex-wrap gap-2">
                      {datasetIdentifiers[selectedDataset.id].map((idn) => (
                        <span key={idn} className="chip bg-blue-50 text-blue-700 text-xs">{idn}</span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedDsRelationships.length > 0 && (
                  <div className="card p-5">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Datos que puedes cruzar</h4>
                    <div className="space-y-2">
                      {selectedDsRelationships.map((rel) => {
                        const targetId = rel.source_dataset_id === selectedDataset.id ? rel.target_dataset_id : rel.source_dataset_id;
                        const target = datasets.find((d) => d.id === targetId);
                        if (!target) return null;
                        return (
                          <Link
                            key={rel.id}
                            to={`/datasets/${target.slug}`}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                          >
                            <Database className="h-4 w-4 text-gray-300 group-hover:text-cnc-700" />
                            <span className="text-sm text-gray-700 group-hover:text-cnc-700 flex-1 truncate">{target.name}</span>
                            {rel.join_field && <span className="text-xs text-gray-400">{rel.join_field}</span>}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Identifiers legend */}
            {identifiers.length > 0 && !selectedNode && (
              <div className="card p-5">
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Identificadores de interoperabilidad</h4>
                <div className="flex flex-wrap gap-2">
                  {identifiers.map((idn) => (
                    <span key={idn.id} className="chip bg-blue-50 text-blue-700 text-xs">{idn.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
