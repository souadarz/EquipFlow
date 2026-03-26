'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { findAllEquipements } from '@/services/equipement.service';
import { findAllCategories } from '@/services/category.service';
import ReservationModal from '@/components/resevations/reservationModal';
import Spinner from '@/components/ui/Spinner';
import { EquipementStatus } from '@repo/shared';
import type { IEquipement, ICategory } from '@repo/shared';
import Footer from '@/components/layout/Footer';
import EquipementCard from '@/components/equipements/EquipementCard';
import { ReservationProvider } from '@/context/ReservationContext';

export default function HomePage() {
  const { user } = useAuth();
  const [equipements, setEquipements] = useState<IEquipement[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState<IEquipement | null>(null);

  const LIMIT = 12;

  const load = useCallback(async () => {
    setLoading(true);
    const data = await findAllEquipements({
      search: search || undefined,
      status: statusFilter as EquipementStatus || undefined,
      category: categoryFilter || undefined,
      page,
      limit: LIMIT,
    });
    if (data) {
      setEquipements(data.data);
      setTotalPages(data.meta.totalPages);
    }
    setLoading(false);
  }, [search, statusFilter, categoryFilter, page]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    findAllCategories().then(data => {
      if (data) setCategories(data);
    });
  }, []);

  const handleReserve = (eq: IEquipement) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    setSelected(eq);
  };

  return (
    <>
      <ReservationProvider>
        {/* Hero */}
        <section
          className="relative overflow-hidden px-6 py-20 text-center"
          style={{
            background: 'linear-gradient(135deg,#274c77 0%,#1e3a5f 60%,#6096ba 100%)',
          }}
        >
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="grid grid-cols-8 gap-4 w-full h-full rotate-12 scale-150">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-32 bg-white rounded-xl" />
              ))}
            </div>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">

            <h1 className="text-5xl font-extrabold text-white leading-tight mb-5">
              Equip<span style={{ color: '#a3cef1' }}>Flow</span>
            </h1>

            <p className="text-xl text-white/70 mb-10 max-w-xl mx-auto leading-relaxed">
              Réservez le matériel dont vous avez besoin en quelques clics.
            </p>

            <div className="flex flex-col items-center gap-8 w-full">

              {(
                <div className="flex gap-4">
                  <Link
                    href="/login"
                    className="bg-white text-primary font-bold px-8 py-3.5
                  rounded-xl text-base hover:bg-white/90 transition-all
                  shadow-xl shadow-black/20"
                  >
                    Se connecter
                  </Link>
                  <Link
                    href="/register"
                    className="bg-white/10 border border-white/20 text-white
                  font-bold px-8 py-3.5 rounded-xl text-base
                  hover:bg-white/20 transition-all"
                  >
                    S&apos;inscrire
                  </Link>
                </div>
              )}

              {/* Stats */}
              <div className="flex justify-center gap-12 text-white/60">
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-white">500+</div>
                  <div className="text-sm mt-1">Équipes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-white">12k+</div>
                  <div className="text-sm mt-1">Réservations</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-white">99%</div>
                  <div className="text-sm mt-1">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/*Catalogue */}
        <section className="max-w-7xl mx-auto px-6 py-10">

          {/* Filtres */}
          <div className="flex flex-col lg:flex-row gap-3 mb-8">

            {/* Recherche */}
            <div className="relative flex-1">
              <span
                className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-textgray"
                style={{ fontSize: '20px' }}
              >
                search
              </span>
              <input
                type="text"
                placeholder="Rechercher un équipement..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200
                rounded-xl outline-none text-sm bg-white
                focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>

            {/* Filtre catégorie */}
            <select
              value={categoryFilter}
              onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}
              className="py-2.5 px-4 border-2 border-gray-200 rounded-xl outline-none
              text-sm bg-white focus:border-primary focus:ring-2 focus:ring-primary/10
              transition-all lg:w-52"
            >
              <option value="">Toutes catégories</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>

            {/* Filtre statut */}
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              className="py-2.5 px-4 border-2 border-gray-200 rounded-xl outline-none
              text-sm bg-white focus:border-primary focus:ring-2 focus:ring-primary/10
              transition-all lg:w-44"
            >
              <option value="">Tous les états</option>
              <option value={EquipementStatus.DISPONIBLE}>Disponible</option>
              <option value={EquipementStatus.RESERVE}>Réservé</option>
              <option value={EquipementStatus.EN_MAINTENANCE}>Maintenance</option>
              <option value={EquipementStatus.HORS_SERVICE}>Hors service</option>
            </select>
          </div>

          {/* Résultats */}
          {loading ? (
            <div className="flex justify-center py-24">
              <Spinner size="lg" />
            </div>
          ) : !equipements.length ? (
            <div className="flex flex-col items-center py-24 gap-3 text-textgray">
              <span className="material-icons text-5xl text-gray-200">
                inventory_2
              </span>
              <p className="font-medium">Aucun équipement trouvé</p>
              {(search || statusFilter || categoryFilter) && (
                <button
                  onClick={() => {
                    setSearch('');
                    setStatusFilter('');
                    setCategoryFilter('');
                    setPage(1);
                  }}
                  className="text-primary text-sm font-semibold hover:underline"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {equipements.map(eq => (
                  <EquipementCard
                    key={eq._id}
                    equipement={eq}
                    variant="public"
                    onReserve={() => handleReserve(eq)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="w-9 h-9 rounded-lg border border-gray-200 flex items-center
                    justify-center text-textgray hover:border-primary hover:text-primary
                    disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <span className="material-icons" style={{ fontSize: '18px' }}>
                      chevron_left
                    </span>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all
                      ${p === page
                          ? 'bg-primary text-white'
                          : 'border border-gray-200 text-textgray hover:border-primary hover:text-primary'
                        }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="w-9 h-9 rounded-lg border border-gray-200 flex items-center
                    justify-center text-textgray hover:border-primary hover:text-primary
                    disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <span className="material-icons" style={{ fontSize: '18px' }}>
                      chevron_right
                    </span>
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        <Footer />

        {/* Modal réservation */}
        {selected && (
          <ReservationModal
            equipement={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </ReservationProvider>
    </>
  );
}