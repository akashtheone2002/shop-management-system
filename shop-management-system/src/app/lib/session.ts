import { IUser } from '@/types/apiModels/apiModels';
import { getIronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: 'user-session',
  cookieOptions: {
    httponly:true,
    secure: process.env.NODE_ENV === 'production',
  },
};

// Function to create a session
export async function createSession(payload:IUser) {
  const session = await getSession();
  session.email = payload.email;
  session.name = payload.name;
  session.id = payload.id;
  session.role = payload.role;
  session.save();
}

// Function to get a session
export async function getSession() {
  const session = await getIronSession<IUser>((await cookies()), sessionOptions);
  return session;
}

// Function to delete a session
export async function deleteSession() {
  const session = await getSession();
  session.destroy();
}

export async function getSessionUserRole(){
  const session = await getSession();
  return session?.role?? "";
}

export async function getSessionUserId(){
  const session = await getSession();
  return session?.id?? "";
}