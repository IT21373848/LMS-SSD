import React, { useEffect } from 'react'
import { useAuth } from './AuthContext';
import Cookies from 'js-cookie';
const LoginSuccess = () => {
    const { login } = useAuth();
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const useRole = urlParams.get('userRole');
    const firstName = urlParams.get('firstName');

    useEffect(() => {
        console.log(token, useRole, firstName)
        if (token && useRole && firstName) {
            // Cookies.set('token', token, { expires: 1 });
            // Cookies.set('useRole', useRole, { expires: 1 });
            Cookies.set('firstName', firstName, { expires: 1 });
            login(useRole, token);
            window.location.href = '/portal';
        }
    }, [])

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="bg-white p-12 rounded-xl shadow-xl">
                <h1 className="text-4xl font-bold">Login Success</h1>
                <p className="text-lg mt-4">You have successfully logged in.</p>
            </div>
        </div>
    )
}

export default LoginSuccess
