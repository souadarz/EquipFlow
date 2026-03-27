import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
    return (
        <div className="flex flex-col lg:flex-row min-h-screen">
            <div
                className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg,#274c77 0%,#1e3a5f 100%)' }}
            >
                <div className="relative z-10 max-w-sm">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                            <span className="material-icons text-primary text-3xl">inventory_2</span>
                        </div>
                        <span className="text-3xl font-extrabold text-white">EquipFlow</span>
                    </div>
                    <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
                        Commencez gratuitement
                    </h2>
                    <p className="text-white/60 text-base leading-relaxed mb-8">
                        Rejoignez des centaines d&apos;équipes qui font confiance à EquipFlow.
                    </p>
                    <div className="grid gap-4">
                        {[
                            { icon: '', title: 'Déploiement immédiat', sub: 'Compte actif en moins d\'une minute' },
                            { icon: '', title: 'Données sécurisées', sub: 'Chiffrement JWT + cookies httpOnly' },
                        ].map((item, i) => (
                            <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className="font-bold text-white mb-1">{item.icon} {item.title}</div>
                                <div className="text-white/50 text-sm">{item.sub}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-20 bg-bg">
                <div className="w-full max-w-md">
                    <div className="lg:hidden flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                            <span className="material-icons text-white text-xl">inventory_2</span>
                        </div>
                        <span className="text-2xl font-bold text-primary">EquipFlow</span>
                    </div>
                    <RegisterForm />
                </div>
            </div>
        </div>
    );
}