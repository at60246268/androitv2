import React, { createContext, useContext, useReducer } from "react";

export type RolUsuario = "cliente" | "admin";

export interface Usuario {
  usuario: string;
  nombre: string;
  rol: RolUsuario;
  telefono?: string;
}

interface AuthState {
  isLoggedIn: boolean;
  usuarioActual: Usuario | null;
  usuariosRegistrados: {
    usuario: string;
    password: string;
    nombre: string;
    rol: RolUsuario;
    telefono?: string;
  }[];
}

type AuthAction =
  | { type: "LOGIN"; payload: Usuario }
  | { type: "LOGOUT" }
  | {
      type: "REGISTRAR_USUARIO";
      payload: {
        usuario: string;
        password: string;
        nombre: string;
        rol: RolUsuario;
        telefono?: string;
      };
    };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, isLoggedIn: true, usuarioActual: action.payload };
    case "LOGOUT":
      return { ...state, isLoggedIn: false, usuarioActual: null };
    case "REGISTRAR_USUARIO":
      return {
        ...state,
        usuariosRegistrados: [action.payload, ...state.usuariosRegistrados],
      };
    default:
      return state;
  }
};

const initialAuthState: AuthState = {
  isLoggedIn: false,
  usuarioActual: null,
  usuariosRegistrados: [
    {
      usuario: "admin@autofix.com",
      password: "123456",
      nombre: "JOSE",
      rol: "admin",
    },
    {
      usuario: "jose@gmail.com",
      password: "123456",
      nombre: "JOSE",
      rol: "cliente",
      telefono: "982371347",
    },
  ],
};

const AuthContext = createContext<
  | {
      state: AuthState;
      dispatch: React.Dispatch<AuthAction>;
    }
  | undefined
>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
