export default function Footer() {
  return (
    <footer style={{ background: '#274c77' }} className="mt-16 px-6 py-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row
        justify-between gap-8">

        {/* Logo + description */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="material-icons text-primary" style={{ fontSize: '18px' }}>
                inventory_2
              </span>
            </div>
            <span className="text-white font-extrabold text-lg">EquipFlow</span>
          </div>
          <p className="text-white/50 text-sm max-w-xs">
            Plateforme SaaS de gestion et d&apos;allocation d&apos;équipements professionnels.
          </p>
        </div>

        {/* Liens */}
        <div className="grid grid-cols-2 gap-8 text-sm">
          <div>
            <h4 className="text-white font-bold mb-3">Produit</h4>
            <div className="space-y-2 text-white/50">
              <div>Catalogue</div>
              <div>Réservations</div>
              <div>Maintenance</div>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3">Support</h4>
            <div className="space-y-2 text-white/50">
              <div>Documentation</div>
              <div>CGU</div>
              <div>Confidentialité</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/10
        text-center text-white/30 text-xs">
        © {new Date().getFullYear()} EquipFlow · Tous droits réservés
      </div>
    </footer>
  );
}