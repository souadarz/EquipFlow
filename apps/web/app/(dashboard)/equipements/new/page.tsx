import EquipementForm from '@/components/equipements/EquipementForm';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function NewEquipementPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <EquipementForm />
    </ProtectedRoute>
  );
}