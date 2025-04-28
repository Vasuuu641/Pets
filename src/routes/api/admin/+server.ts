import { parse } from 'cookie';
import jwt from 'jsonwebtoken';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request }) => {
    try {
        // Get the cookies from the request headers
        const cookies = parse(request.headers.get('cookie') || '');
        const token = cookies.session;

        // If no token, user is not logged in
        if (!token) {
            return new Response('You must be logged in to access this page', { status: 401 });
        }

        // Verify the token (check its validity and expiration)
        const decoded: any = jwt.verify(token, 'your-secret-key'); // Use the same secret as when signing

        // Check if the user has the role of "admin"
        if (decoded.role !== 'admin') {
            return new Response('Forbidden: You do not have the correct privileges', { status: 403 });
        }

        // If the user is admin, proceed with returning the admin page content
        return new Response('Welcome to the admin page', { status: 200 });

    } catch (error) {
        console.error(error);
        return new Response('Invalid token or session expired', { status: 401 });
    }
};
