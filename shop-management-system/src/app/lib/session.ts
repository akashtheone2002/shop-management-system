import { IUser } from '@/types/apiModels/apiModels';
import { getIronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';
import { useRouter } from 'next/navigation';
export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: 'user-session',
  cookieOptions: {
    httponly: true,
    secure: process.env.NODE_ENV === 'production',
  },
};

// Function to create a session
export async function createSession(payload: IUser) {
  const session = await getSession();
  if (session) {
    session.email = payload.email;
    session.name = payload.name;
    session.id = payload.id;
    session.role = payload.role;
    await session.save();
  }
}

// Function to get a session
export async function getSession() {
  try {
    const cookieStore = await cookies();

    // Ensure cookies are valid before passing to `getIronSession`
    const session = await getIronSession<IUser>(cookieStore || {}, sessionOptions);
    
    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null; // Return null or an empty session object if needed
  }
}

// Function to delete a session
export async function deleteSession() {
  const session = await getSession();
  if (session) {
    session.destroy();
  }
}

export async function getSessionUserRole() {
  const session = await getSession();
  return session?.role ?? "";
}

export async function getSessionUserId() {
  const session = await getSession();
  return session?.id ?? "";
}