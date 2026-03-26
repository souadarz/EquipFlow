import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Role } from '@repo/shared';
import jwt from 'jsonwebtoken';

export default async function DashboardRedirectPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const payload = token ? jwt.decode(token) : null;
    const role = payload?.role;
    console.log('role:', role);
    console.log('Role.ADMIN:', Role.ADMIN);
    if (role === Role.ADMIN) redirect('/dashboard/admin');
    redirect('/dashboard/user');
}