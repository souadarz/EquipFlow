'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';

interface RegisterValues {
    fullname: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export default function RegisterForm() {
    const { register: registerUser } = useAuth();
    const router = useRouter();
    const [showPass, setShowPass] = useState(false);
    const [serverError, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<RegisterValues>();

    const passwordValue = watch('password');

    const onSubmit = async ({ fullname, email, password }: RegisterValues) => {
        setError(null);
        try {
            await registerUser(fullname, email, password);
            router.replace('/dashboard');
        } catch (err: any) {
            const msg = err?.response?.data?.message;
            setError(Array.isArray(msg) ? msg[0] : (msg ?? 'Une erreur est survenue'));
        }
    };

    return (
        <div className="w-full max-w-md">

            <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Créer un compte</h2>
                <p className="text-textgray text-sm">Remplissez le formulaire pour rejoindre EquipFlow.</p>
            </div>

            {serverError && (
                <div className="mb-5 flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                    <span className="material-icons" style={{ fontSize: '16px' }}>error_outline</span>
                    {serverError}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

                <Input
                    id="fullname"
                    label="Nom complet"
                    type="text"
                    placeholder="Jean Dupont"
                    autoComplete="name"
                    error={errors.fullname?.message}
                    {...register('fullname', {
                        required: 'Le nom est obligatoire',
                        minLength: { value: 4, message: '4 caractères minimum' },
                    })}
                />

                <Input
                    id="email"
                    label="Adresse email"
                    type="email"
                    placeholder="nom@entreprise.com"
                    autoComplete="email"
                    error={errors.email?.message}
                    {...register('email', {
                        required: "L'email est obligatoire",
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email invalide' },
                    })}
                />

                {/* Password avec toggle */}
                <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Mot de passe
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPass ? 'text' : 'password'}
                            placeholder="8 caractères minimum"
                            autoComplete="new-password"
                            className={`w-full px-4 py-2.5 pr-10 rounded-lg border-2 outline-none
                text-gray-900 bg-white text-sm transition-all
                ${errors.password
                                    ? 'border-red-300 focus:border-red-500'
                                    : 'border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10'
                                }`}
                            {...register('password', {
                                required: 'Le mot de passe est obligatoire',
                                minLength: { value: 8, message: '8 caractères minimum' },
                            })}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPass(p => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-textgray hover:text-primary transition-colors"
                        >
                            <span className="material-icons" style={{ fontSize: '18px' }}>
                                {showPass ? 'visibility' : 'visibility_off'}
                            </span>
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                    )}
                </div>

                <Input
                    id="confirmPassword"
                    label="Confirmer le mot de passe"
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    error={errors.confirmPassword?.message}
                    {...register('confirmPassword', {
                        required: 'Veuillez confirmer le mot de passe',
                        validate: v => v === passwordValue || 'Les mots de passe ne correspondent pas',
                    })}
                />

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60
            disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl
            shadow-lg shadow-primary/20 transition-all active:scale-[0.98]
            flex items-center justify-center gap-2 mt-2"
                >
                    {isSubmitting && (
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                    )}
                    {isSubmitting ? 'Création du compte...' : 'Créer mon compte'}
                </button>
            </form>

            <p className="mt-8 text-center text-textgray text-sm">
                Déjà un compte ?{' '}
                <Link href="/login" className="text-primary font-bold hover:underline">
                    Se connecter
                </Link>
            </p>
        </div>
    );
}