// middleware.ts
import { Roles } from '@/types/entity/entity';
import { NextRequest, NextResponse } from 'next/server';
import { getSession, getSessionUserRole } from './app/lib/session';

// Role-based access control
const rolePermissions = {
  '/home': [Roles.ADMIN],
  '/order': [Roles.ADMIN, Roles.EMPLOYEE],
  '/history': [Roles.ADMIN, Roles.EMPLOYEE],
  '/api/recommendation/refresh': [Roles.ADMIN],
};

export async function middleware(request: NextRequest) {
  const session = await getSession(); // Get the session details (e.g., role, etc.)
  const url = request.url;
  const urlObj = new URL(request.url);
  // If the route is not restricted, allow the request to proceed
  if (!Object.keys(rolePermissions).includes(urlObj.pathname)) {
    return NextResponse.next();
  }
  let role = '';

  if (urlObj.pathname !== '/login') {
    role = await getSessionUserRole();
    if(!role || role == ""){
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Set role in the headers
  request.headers.set('x-user-role', role);

  // Check if the user is trying to access a restricted route
  for (const route in rolePermissions) {
    if (urlObj.pathname == route) {
      // If the user doesn't have the required role
      if (!session || !session.role || !rolePermissions[route].includes(session.role)) {
        if(urlObj.pathname == "/home" && session?.role == Roles.EMPLOYEE){
          return NextResponse.redirect(new URL('/order', request.url));
        }
        // Redirect to login or unauthorized page
        return NextResponse.redirect(new URL('/login', request.url));
      }
      break; // If the user is authorized, continue to the next middleware or page
    }
  }
  // Create a response and set the role in the headers
  const response = NextResponse.next();
  response.headers.set('x-user-role', role);

  return response; // Allow the request to proceed if authorized
}
