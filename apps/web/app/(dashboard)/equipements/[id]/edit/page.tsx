'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import EquipementForm from '@/components/equipements/EquipementForm';
import Spinner from '@/components/ui/Spinner';
import type { IEquipement } from '@repo/shared';
import { findOneEquipement } from '@/services/equipement.service';

export default function EditEquipementPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [equipement, setEquipement] = useState<IEquipement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchEquipement() {
      setLoading(true);
      const data = await findOneEquipement(id);

      if (!data) {
        // si l'équipement n'existe pas, on redirige
        router.replace('/equipements');
        return;
      }

      setEquipement(data);
      setLoading(false);
    }

    fetchEquipement();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!equipement) return null;

  return <EquipementForm equipement={equipement} />;
}