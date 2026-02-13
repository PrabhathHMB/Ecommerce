export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    mobile?: string;
    createdAt?: string;
}

export interface SignupRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    jwt: string;
    status: boolean;
}
