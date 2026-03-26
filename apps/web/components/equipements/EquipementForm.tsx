'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { useEquipement } from '@/hooks/useEquipement';
import { findAllCategories } from '@/services/category.service';
import { EquipementStatus } from '@repo/shared';
import type {
  IEquipement,
  ICategory,
  IEquipementPayload,
} from '@repo/shared';

interface FormValues {
  name: string;
  description: string;
  category: string;
  status: EquipementStatus;
  serialNumber: string;
  imageUrl: string;
}

interface Props {
  equipement?: IEquipement;
}

export default function EquipementForm({ equipement }: Props) {
  const isEdit = !!equipement;
  const { create, update } = useEquipement();
  const router = useRouter();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(equipement?.imageUrl ?? '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: equipement?.name ?? '',
      description: equipement?.description ?? '',
      category: equipement?.category?._id ?? '',
      status: equipement?.status ?? EquipementStatus.DISPONIBLE,
      serialNumber: equipement?.serialNumber ?? '',
      imageUrl: equipement?.imageUrl ?? '',
    },
  });

  useEffect(() => {
    findAllCategories()
      .then(data => {
        if (data) setCategories(data);
      })
      .catch(() => { });
  }, []);

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      let resolvedImageUrl = values.imageUrl || undefined;

      // Si un fichier est sélectionné, on l'uploade d'abord
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'}/equipements/upload-image`,
          { method: 'POST', body: formData, credentials: 'include' }
        );
        if (!res.ok) throw new Error('Échec de l upload de l image');
        const data = await res.json();
        resolvedImageUrl = `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'}${data.url}`;
      }

      const payload: IEquipementPayload = {
        name: values.name,
        description: values.description,
        category: values.category,
        status: values.status,
        serialNumber: values.serialNumber,
        imageUrl: resolvedImageUrl,
      };

      if (isEdit) {
        await update(equipement!._id, payload);
      } else {
        await create(payload);
      }

      router.replace('/equipements');
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setServerError(Array.isArray(msg) ? msg[0] : (msg ?? 'Une erreur est survenue'));
    }
  };

  return (
    <div className="max-w-2xl space-y-6">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-textgray">
        <Link href="/equipements" className="hover:text-primary transition-colors">
          Équipements
        </Link>
        <span className="material-icons" style={{ fontSize: '16px' }}>
          chevron_right
        </span>
        <span className="text-gray-900 font-medium">
          {isEdit ? 'Modifier' : 'Ajouter'}
        </span>
      </div>

      {/* Card principale */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8">

        {/* Titre */}
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
          {isEdit ? "Modifier l'équipement" : 'Ajouter un équipement'}
        </h1>
        <p className="text-textgray text-sm mb-8">
          {isEdit
            ? "Modifiez les informations de l'équipement."
            : 'Remplissez les informations pour ajouter un nouvel équipement.'}
        </p>

        {/* Erreur serveur */}
        {serverError && (
          <div className="mb-6 flex items-center gap-2 p-3 rounded-xl
            bg-red-50 border border-red-200 text-red-700 text-sm">
            <span className="material-icons" style={{ fontSize: '16px' }}>
              error_outline
            </span>
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

          {/* Nom */}
          <Input
            id="name"
            label="Nom de l'équipement"
            placeholder="Ex: PC Portable Dell XPS"
            error={errors.name?.message}
            {...register('name', {
              required: 'Le nom est obligatoire',
              minLength: { value: 2, message: '2 caractères minimum' },
            })}
          />

          {/* Numéro de série */}
          <Input
            id="serialNumber"
            label="Numéro de série"
            placeholder="Ex: SN-2024-001, DELL-XPS-0042..."
            helperText="Numéro de série physique inscrit sur l'équipement"
            error={errors.serialNumber?.message}
            disabled={isEdit}
            {...register('serialNumber', {
              required: 'Le numéro de série est obligatoire',
            })}
          />

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-700 mb-1.5"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              placeholder="Caractéristiques techniques, usage prévu..."
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg
                outline-none text-sm bg-white transition-all resize-none
                focus:border-primary focus:ring-2 focus:ring-primary/10"
              {...register('description')}
            />
          </div>

          {/* Catégorie + Statut */}
          <div className="grid grid-cols-2 gap-4">

            {/* Catégorie */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                Catégorie <span className="text-red-400">*</span>
              </label>
              <select
                id="category"
                className={`w-full px-4 py-2.5 border-2 rounded-lg outline-none
                  text-sm bg-white transition-all
                  focus:border-primary focus:ring-2 focus:ring-primary/10
                  ${errors.category ? 'border-red-300' : 'border-gray-200'}`}
                {...register('category', {
                  required: 'La catégorie est obligatoire',
                })}
              >
                <option value="">Sélectionner...</option>
                {categories.map(c => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Statut */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                État
              </label>
              <select
                id="status"
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg
                  outline-none text-sm bg-white transition-all
                  focus:border-primary focus:ring-2 focus:ring-primary/10"
                {...register('status')}
              >
                <option value={EquipementStatus.DISPONIBLE}>
                  Disponible
                </option>
                <option value={EquipementStatus.HORS_SERVICE}>
                  Hors service
                </option>
              </select>
            </div>
          </div>

          {/* Upload Image */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Image (Optionnel)
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl cursor-pointer transition-all hover:border-primary hover:bg-primary/5 ${
                imagePreview ? 'h-52 border-primary/40' : 'h-36 border-gray-200'
              }`}
            >
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Aperçu"
                    className="absolute inset-0 w-full h-full object-cover rounded-2xl opacity-80"
                  />
                  <div className="relative z-10 bg-black/50 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-1">
                    <span className="material-icons" style={{ fontSize: '14px' }}>edit</span>
                    Changer l&apos;image
                  </div>
                </>
              ) : (
                <>
                  <span className="material-icons text-gray-300" style={{ fontSize: '40px' }}>add_photo_alternate</span>
                  <p className="text-sm text-textgray font-medium">
                    Cliquez pour sélectionner une image
                  </p>
                  <p className="text-xs text-gray-400">JPG, PNG, WEBP — max 5 Mo</p>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary hover:bg-primary/90
                disabled:opacity-60 disabled:cursor-not-allowed
                text-white font-bold py-3.5 rounded-xl
                flex items-center justify-center gap-2
                shadow-lg shadow-primary/20
                transition-all active:scale-[0.98]"
            >
              {isSubmitting && (
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12" cy="12" r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              )}
              <span className="material-icons" style={{ fontSize: '18px' }}>
                save
              </span>
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>

            <Link
              href="/equipements"
              className="flex-1 py-3.5 rounded-xl font-bold
                border border-gray-200 text-textgray
                hover:bg-gray-50 transition-all
                flex items-center justify-center gap-2 text-sm"
            >
              Annuler
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}