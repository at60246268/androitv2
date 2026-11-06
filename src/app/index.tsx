import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet } from "react-native";

import { AuthProvider } from "../infrastructura/context/AuthContext";
import {
  SolicitudesProvider
} from "../infrastructura/context/SolicitudesContext";

import { HomeScreen } from "../presentacion/vistas/HomeScreen";
import { LoginScreen } from "../presentacion/vistas/LoginScreen";
import { RegisterUserScreen } from "../presentacion/vistas/RegisterUserScreen";
import { SolicitudDetailScreen } from "../presentacion/vistas/SolicitudDetailScreen";
import { SolicitudesListScreen } from "../presentacion/vistas/SolicitudesListScreen";
import { SolicitudFormScreen } from "../presentacion/vistas/SolicitudFormScreen";

import { SolicitudAuto } from "../domain/Solicitud";

type Vista = "home" | "list" | "create" | "detail" | "registerUser";

function AppNavigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [vistaActual, setVistaActual] = useState<Vista>("home");
  const [historial, setHistorial] = useState<Vista[]>([]);
  const [solicitudSeleccionada, setSolicitudSeleccionada] =
    useState<SolicitudAuto | null>(null);

  const navegarA = (vista: Vista) => {
    setHistorial((anterior) => [...anterior, vistaActual]);
    setVistaActual(vista);
  };

  const volver = () => {
    const vistaAnterior = historial[historial.length - 1] ?? "home";
    setHistorial((anterior) => anterior.slice(0, -1));
    setVistaActual(vistaAnterior);
  };

  const cerrarSesion = () => {
    setHistorial([]);
    setVistaActual("home");
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    if (vistaActual === "registerUser") {
      return (
        <RegisterUserScreen onBackToLogin={volver} />
      );
    }
    return (
      <LoginScreen
      onLoginSuccess={() => {
        setHistorial([]);
        setVistaActual("home");
        setIsLoggedIn(true);
        }}
        onNavigateToRegisterUser={() => navegarA("registerUser")}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {vistaActual === "home" && (
        <HomeScreen
          onNavigateToList={() => navegarA("list")}
          onNavigateToRegister={() => {
            setSolicitudSeleccionada(null);
            navegarA("create");
          }}
          onLogout={cerrarSesion}
        />
      )}

      {vistaActual === "list" && (
        <SolicitudesListScreen
          onBack={volver}
          onNewSolicitud={() => {
            setSolicitudSeleccionada(null);
            navegarA("create");
          }}
          onSelectSolicitud={(item) => {
            setSolicitudSeleccionada(item);
            navegarA("detail");
          }}
        />
      )}

      {vistaActual === "create" && (
        <SolicitudFormScreen
          solicitudAEditar={solicitudSeleccionada}
          onBack={volver}
        />
      )}

      {vistaActual === "detail" && solicitudSeleccionada && (
        <SolicitudDetailScreen
          solicitud={solicitudSeleccionada}
          onBack={volver}
          onEdit={(item) => {
            setSolicitudSeleccionada(item);
            navegarA("create");
          }}
        />
      )}
    </SafeAreaView>
  );
}

export default function Index() {
  return (
    <AuthProvider>
      <SolicitudesProvider>
        <AppNavigation />
      </SolicitudesProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F17",
  },
});
