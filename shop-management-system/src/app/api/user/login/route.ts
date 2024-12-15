import { createSession } from '@/app/lib/session';
import { NextResponse } from 'next/server';
import { login } from '../../../../../agents/user';

export async function GET(request: Request) {
    try {
        // Extract search parameters from the request URL
        const { searchParams } = new URL(request.url);
        const username = searchParams.get('username');
        const password = searchParams.get('password');

        console.log(username, password);

        const user = await login(username || "", password || "");
        await createSession(user);
        return NextResponse.json(true);
    } catch (error) {
        console.error("Error handling GET request:", error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}