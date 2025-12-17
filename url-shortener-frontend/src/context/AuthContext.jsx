import { createContext, useState, useEffect } from "react";
import { login as loginApi, register as registerApi } from "../services/api";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [loading, setLoading] = useState(true);

    //load user from localStorage on refresh
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        const savedToken = localStorage.getItem("token");

        if(savedUser && savedToken) {
            setUser(JSON.parse(savedUser));
            setToken(savedToken);
        }

        setLoading(false);
    },[]);

    //login handler
    const login = async (credentials) => {
        try {
            const res = await loginApi(credentials);
            console.log('login response:',res);

            //save user
            setUser(res.user);
            setToken(res.token);

            localStorage.setItem("user",JSON.stringify(res.user));
            localStorage.setItem("token",res.token);

            return res;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    //Register handler
    const registerUser = async (data) => {
        try {
            const res = await registerApi(data);
            return res;
        } catch (error) {
            console.error("Register error:",error);
            throw error;
        }
    }

    //Logout handler
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
        setToken(null);
    };

    return(
        <AuthContext.Provider
         value={{
            user,
            token,
            login,
            registerUser,
            logout,
            loading,
         }}
         >
            {children}
        </AuthContext.Provider>
    );
};