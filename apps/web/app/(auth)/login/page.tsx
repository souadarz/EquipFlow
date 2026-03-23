import LoginForm from '@/components/auth/LoginForm';

// Panel gauche partagé entre login et register
function BrandingPanel({ title, subtitle }: { title: string; subtitle: string }) {
    return (
        <div
            className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg,#274c77 0%,#1e3a5f 100%)' }}
        >
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="grid grid-cols-6 gap-4 h-full rotate-12 scale-125">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-xl" />
                    ))}
                </div>
            </div>
            <div className="relative z-10 max-w-sm">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                        <span className="material-icons text-primary text-3xl">inventory_2</span>
                    </div>
                    <span className="text-3xl font-extrabold text-white">EquipFlow</span>
                </div>
                <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">{title}</h2>
                <p className="text-white/60 text-base leading-relaxed mb-8">{subtitle}</p>
                <div className="space-y-3">
                    {[
                        'Réservation en quelques clics',
                        'Suivi temps réel des équipements',
                        'Dashboard personnalisé par rôle',
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                                <span className="material-icons text-white" style={{ fontSize: '14px' }}>check</span>
                            </div>
                            <span className="text-white/80 text-sm">{item}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="flex flex-col lg:flex-row min-h-screen">
            <BrandingPanel
                title="Bon retour parmi nous"
                subtitle="Gérez vos équipements, suivez vos réservations et optimisez l'utilisation de votre matériel."
            />
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-20 bg-bg">
                {/* Mobile logo */}
                <div className="w-full max-w-md">
                    <div className="lg:hidden flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                            <span className="material-icons text-white text-xl">inventory_2</span>
                        </div>
                        <span className="text-2xl font-bold text-primary">EquipFlow</span>
                    </div>
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}