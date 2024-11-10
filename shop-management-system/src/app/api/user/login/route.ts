import { login } from '@/agent/user/user';
import { createSession } from '@/app/lib/session';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        // Extract search parameters from the request URL
        const { searchParams } = new URL(request.url);
        const username = searchParams.get('username');
        const password = searchParams.get('password');

        console.log(username, password);

        const user = await login(username || "", password || "");
        if (user.hasError){
          return NextResponse.json({ error: "Invalid login id or password." }, { status: 401 });
        }else if (!user){
          return NextResponse.json({ error: "An error occured." }, { status: 500 });
        }
        await createSession(user);
        return NextResponse.json(true);
    } catch (error) {
        console.error("Error handling GET request:", error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}