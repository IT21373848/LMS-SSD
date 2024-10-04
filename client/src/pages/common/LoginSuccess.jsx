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
            setTimeout(() => {
                window.location.href = '/portal';
            },3000)
        }
    }, [])

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500">
            <div className="bg-white p-12 rounded-xl shadow-xl">
                <h1 className="text-6xl font-bold text-purple-700">Login Success</h1>
                <p className="text-2xl mt-4">You have successfully logged in, {firstName}.</p>
                <p className="text-lg mt-4">You will be redirected to the portal in a few seconds.</p>
                <div className="flex items-center justify-center mt-8">
                    <div className="w-16 h-16 border-b-2 border-blue-400 animate-spin rounded-full"></div>
                </div>
            </div>
        </div>
    )
}

export default LoginSuccess
