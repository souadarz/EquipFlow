import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Role } from '@repo/shared';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface MyJwtPayload extends JwtPayload {
  role: Role;
}

//important pour jsonwebtoken dans Next.js
export const runtime = 'nodejs';

export default async function DashboardRedirectPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  let role: Role | null = null;

  if (token) {
    const decoded = jwt.decode(token);

    if (decoded && typeof decoded !== 'string') {
      role = (decoded as MyJwtPayload).role;
    }
  }

  console.log('role:', role);
  console.log('Role.ADMIN:', Role.ADMIN);

  if (role === Role.ADMIN) {
    redirect('/dashboard/admin');
  }

  redirect('/dashboard/user');
}