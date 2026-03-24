import React from 'react'
import { EquipementProvider } from '@/context/EquipementContext';
import AdminDashboardPage from './AdminDashboardPage';

const Page = () => {
    return (
        <EquipementProvider>
            <AdminDashboardPage />
        </EquipementProvider>
    )
}

export default Page