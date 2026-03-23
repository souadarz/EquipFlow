'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { ILoginPayload } from '@repo/shared';

export default function LoginForm() {
    const { login } = useAuth();
    const router = useRouter();
    const [showPass, setShowPass] = useState(false);
    const [serverError, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ILoginPayload>();

    const onSubmit = async ({ email, password }: ILoginPayload) => {
        setError(null);
        try {
            await login(email, password);
            router.replace('/dashboard');
        } catch (err: any) {
            const msg = err?.response?.data?.message;
            setError(Array.isArray(msg) ? msg[0] : (msg ?? 'Email ou mot de passe incorrect'));
        }
    };

    return (
        <div className="w-full max-w-md">

            <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Connexion</h2>
                <p className="text-textgray text-sm">Entrez vos identifiants pour accéder à votre espace.</p>
            </div>

            {serverError && (
                <div className="mb-5 flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                    <span className="material-icons" style={{ fontSize: '16px' }}>error_outline</span>
                    {serverError}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

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

                <div>
                    <div className="flex justify-between items-center mb-1.5">
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                            Mot de passe
                        </label>
                        <a href="#" className="text-xs font-bold text-secondary hover:underline">
                            Mot de passe oublié ?
                        </a>
                    </div>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPass ? 'text' : 'password'}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            className={`w-full px-4 py-2.5 pr-10 rounded-lg border-2 outline-none
                text-gray-900 bg-white text-sm transition-all
                ${errors.password
                                    ? 'border-red-300 focus:border-red-500'
                                    : 'border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10'
                                }`}
                            {...register('password', { required: 'Le mot de passe est obligatoire' })}
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

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60
            disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl
            shadow-lg shadow-primary/20 transition-all active:scale-[0.98]
            flex items-center justify-center gap-2"
                >
                    {isSubmitting && (
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                    )}
                    {isSubmitting ? 'Connexion...' : 'Accéder au tableau de bord'}
                </button>
            </form>

            <p className="mt-8 text-center text-textgray text-sm">
                Pas encore de compte ?{' '}
                <Link href="/register" className="text-primary font-bold hover:underline">
                    Créer un compte
                </Link>
            </p>
        </div>
    );
}