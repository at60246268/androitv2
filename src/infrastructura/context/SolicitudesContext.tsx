import React, { createContext, useContext, useReducer } from "react";
import { EstadoAuto, SolicitudAuto } from "../../domain/Solicitud";

type Action =
  | { type: "ADD_SOLICITUD"; payload: SolicitudAuto }
  | { type: "UPDATE_SOLICITUD"; payload: SolicitudAuto }
  | { type: "DELETE_SOLICITUD"; payload: string }
  | { type: "CHANGE_STATUS"; payload: { id: string; estado: EstadoAuto } }
  | { type: "SEND_MESSAGE"; payload: { id: string; mensaje: string } };

const solicitudesIniciales: SolicitudAuto[] = [
  {
    id: "1",
    clienteNombre: "JOSE",
    telefono: "982371347",
    vehiculoPlaca: "ABC-123",
    vehiculoModelo: "Toyota Corolla 2020",
    tipoServicio: "Diagnóstico general",
    prioridad: "Media",
    descripcion:
      "Ruido metálico al frenar en frío y baja presión de neumáticos.",
    estado: "EN_PROCESO",
    fechaRegistro: "05/11/2026",
    usuarioCliente: "jose@gmail.com",
    mensajeAdmin: "Su vehículo se encuentra en rampa de inspección.",
  },
];

function solicitudesReducer(
  state: SolicitudAuto[],
  action: Action,
): SolicitudAuto[] {
  switch (action.type) {
    case "ADD_SOLICITUD":
      return [action.payload, ...state];
    case "UPDATE_SOLICITUD":
      return state.map((item) =>
        item.id === action.payload.id ? action.payload : item,
      );
    case "DELETE_SOLICITUD":
      return state.filter((item) => item.id !== action.payload);
    case "CHANGE_STATUS":
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, estado: action.payload.estado }
          : item,
      );
    case "SEND_MESSAGE":
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, mensajeAdmin: action.payload.mensaje }
          : item,
      );
    default:
      return state;
  }
}

interface SolicitudesContextType {
  solicitudes: SolicitudAuto[];
  agregarSolicitud: (solicitud: SolicitudAuto) => void;
  actualizarSolicitud: (solicitud: SolicitudAuto) => void;
  eliminarSolicitud: (id: string) => void;
  cambiarEstado: (id: string, estado: EstadoAuto) => void;
  enviarMensajeCliente: (id: string, mensaje: string) => void;
}

const SolicitudesContext = createContext<SolicitudesContextType | undefined>(
  undefined,
);

export const SolicitudesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [solicitudes, dispatch] = useReducer(
    solicitudesReducer,
    solicitudesIniciales,
  );

  const agregarSolicitud = (solicitud: SolicitudAuto) =>
    dispatch({ type: "ADD_SOLICITUD", payload: solicitud });
  const actualizarSolicitud = (solicitud: SolicitudAuto) =>
    dispatch({ type: "UPDATE_SOLICITUD", payload: solicitud });
  const eliminarSolicitud = (id: string) =>
    dispatch({ type: "DELETE_SOLICITUD", payload: id });
  const cambiarEstado = (id: string, estado: EstadoAuto) =>
    dispatch({ type: "CHANGE_STATUS", payload: { id, estado } });
  const enviarMensajeCliente = (id: string, mensaje: string) =>
    dispatch({ type: "SEND_MESSAGE", payload: { id, mensaje } });

  return (
    <SolicitudesContext.Provider
      value={{
        solicitudes,
        agregarSolicitud,
        actualizarSolicitud,
        eliminarSolicitud,
        cambiarEstado,
        enviarMensajeCliente,
      }}
    >
      {children}
    </SolicitudesContext.Provider>
  );
};

export const useSolicitudes = () => {
  const context = useContext(SolicitudesContext);
  if (!context)
    throw new Error("useSolicitudes debe usarse dentro de SolicitudesProvider");
  return context;
};
