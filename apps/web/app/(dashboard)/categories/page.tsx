'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import {
    findAllCategories,
    createCategory,
    deleteCategory,
} from '@/services/category.service';
import type { ICategory } from '@repo/shared';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface FormValues {
    name: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>();

    const load = async () => {
        setLoading(true);
        const data = await findAllCategories();
        console.log("dataaaaaaaa =", data);
        if (data) setCategories(data);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const onSubmit = async (values: FormValues) => {
        setSubmitting(true);
        try {
            await createCategory({ name: values.name });
            toast.success('Catégorie créée');
            reset();
            await load();
        } catch (err: any) {
            const msg = err?.response?.data?.message;
            toast.error(Array.isArray(msg) ? msg[0] : (msg ?? 'Erreur lors de la création'));
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Supprimer cette catégorie ?')) return;
        try {
            await deleteCategory(id);
            toast.success('Catégorie supprimée');
            await load();
        } catch (err: any) {
            const msg = err?.response?.data?.message;
            toast.error(Array.isArray(msg) ? msg[0] : 'Erreur lors de la suppression');
        }
    };

    console.log("caaaaaaaaaaaaat", categories)

    return (
        <ProtectedRoute requireAdmin={true}>
            <div className="max-w-3xl space-y-6">

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900">Catégories</h1>
                    <p className="text-textgray text-sm mt-1">
                        Gérez les catégories d&apos;équipements de la plateforme.
                    </p>
                </div>

                {/* Formulaire création */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="material-icons text-primary" style={{ fontSize: '20px' }}>
                            add_circle_outline
                        </span>
                        Nouvelle catégorie
                    </h2>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex gap-3 items-start"
                        noValidate
                    >
                        <div className="flex-1">
                            <Input
                                id="name"
                                label=""
                                placeholder="Ex: BTP, Événementiel, Audiovisuel..."
                                error={errors.name?.message}
                                {...register('name', {
                                    required: 'Le nom est obligatoire',
                                    minLength: { value: 2, message: '2 caractères minimum' },
                                })}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-primary hover:bg-primary/90 disabled:opacity-60
                  disabled:cursor-not-allowed text-white font-bold px-6 py-2.5
                  rounded-xl flex items-center gap-2 transition-all
                  active:scale-[0.98] whitespace-nowrap"
                        >
                            {submitting && (
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10"
                                        stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                            )}
                            <span className="material-icons" style={{ fontSize: '18px' }}>add</span>
                            Ajouter
                        </button>
                    </form>
                </div>

                {/* Liste */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="font-bold text-gray-900">
                            Catégories existantes
                        </h2>
                        <span className="text-xs font-semibold text-textgray bg-bg
                px-2.5 py-1 rounded-full">
                            {categories.length} au total
                        </span>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Spinner />
                        </div>
                    ) : !categories.length ? (
                        <div className="flex flex-col items-center py-12 gap-3 text-textgray">
                            <span className="material-icons text-4xl text-gray-200">category</span>
                            <p className="text-sm font-medium">Aucune catégorie pour le moment</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-50">
                            {categories.map(cat => (
                                <li
                                    key={cat._id}
                                    className="flex items-center justify-between px-6 py-4
                      hover:bg-gray-50/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex
                        items-center justify-center">
                                            <span className="material-icons text-primary"
                                                style={{ fontSize: '18px' }}>
                                                category
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">
                                                {cat.name}
                                            </p>
                                            <p className="text-xs text-textgray">
                                                Créée le {new Date(cat.createdAt).toLocaleDateString('fr-FR', {
                                                    day: '2-digit', month: 'long', year: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(cat._id)}
                                        className="text-textgray hover:text-red-500 transition-colors
                        p-2 rounded-lg hover:bg-red-50"
                                        title="Supprimer"
                                    >
                                        <span className="material-icons" style={{ fontSize: '18px' }}>
                                            delete_outline
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}