import { redirect } from 'next/navigation';
import { cookies }  from 'next/headers';

export default async function DashboardRedirectPage() {
    const cookieStore = await cookies();
    const role = cookieStore.get('user_role')?.value;

    if (role === 'admin') redirect('/dashboard/admin');
    redirect('/dashboard/user');
}