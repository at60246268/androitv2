import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../infrastructura/context/AuthContext";
import { useSolicitudes } from "../../infrastructura/context/SolicitudesContext";

interface Props {
  onNavigateToList: () => void;
  onNavigateToRegister: () => void;
  onLogout: () => void;
}

const tipsMecanica = [
  "Revisa la presión de tus neumáticos al menos una vez al mes.",
  "Verifica el nivel de aceite de motor antes de emprender viajes largos.",
  "Cambia los filtros de aire y aceite según las recomendaciones del fabricante.",
  "Revisa las pastillas de freno cada 10,000 km para prevenir desgaste excesivo.",
];

export const HomeScreen: React.FC<Props> = ({
  onNavigateToList,
  onNavigateToRegister,
  onLogout,
}) => {
  const { state } = useAuth();
  const { solicitudes } = useSolicitudes();
  const usuario = state.usuarioActual;
  const esAdmin = usuario?.rol === "admin";
  const [tipActual, setTipActual] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTipActual((prev) => (prev + 1) % tipsMecanica.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const misSolicitudes = esAdmin
    ? solicitudes
    : solicitudes.filter(
        (s) =>
          s.usuarioCliente === usuario?.usuario ||
          s.clienteNombre === usuario?.nombre,
      );

  const total = misSolicitudes.length;
  const enProceso = misSolicitudes.filter(
    (s) => s.estado === "EN_PROCESO",
  ).length;
  const finalizados = misSolicitudes.filter(
    (s) => s.estado === "FINALIZADO",
  ).length;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Ionicons name="construct-outline" size={18} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.brandTitle}>AUTOFIX</Text>
            <Text style={styles.brandSub}>SERVICIO AUTOMOTRIZ</Text>
          </View>
        </View>
        <View style={styles.userRole}>
          <Text style={styles.userName}>{usuario?.nombre}</Text>
          <Text style={styles.roleTag}>
            {esAdmin ? "ADMINISTRADOR" : "CLIENTE"}
          </Text>
        </View>
      </View>

      <View style={styles.bannerContainer}>
        <Image
          source={require("../../public/logo.webp")}
          style={styles.bannerImage}
        />
        <View style={styles.bannerOverlay}>
          <Text style={styles.bannerSub}>
            {esAdmin ? "PANEL ADMINISTRATIVO" : "ÁREA DE CLIENTES"}
          </Text>
          <Text style={styles.bannerTitle}>Hola, {usuario?.nombre}</Text>
          <Text style={styles.bannerDesc}>
            En AutoFix combinamos experiencia, diagnóstico preciso y
            comunicación clara para cuidar tu vehículo.
          </Text>
        </View>
      </View>

      <View style={styles.tipCard}>
        <Ionicons name="construct-outline" size={20} color="#FF5722" />
        <View style={styles.tipTextCol}>
          <Text style={styles.tipTitle}>TIP AUTOFIX</Text>
          <Text style={styles.tipDesc}>{tipsMecanica[tipActual]}</Text>
        </View>
      </View>

      {esAdmin && (
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricVal}>{total}</Text>
            <Text style={styles.metricLabel}>TOTAL</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricVal}>{enProceso}</Text>
            <Text style={styles.metricLabel}>EN PROCESO</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricVal}>{finalizados}</Text>
            <Text style={styles.metricLabel}>FINALIZADOS</Text>
          </View>
        </View>
      )}

      <Text style={styles.sectionHeader}>PANEL DE CONTROL</Text>

      <TouchableOpacity
        style={styles.actionCardDark}
        onPress={onNavigateToList}
        activeOpacity={0.8}
      >
        <View style={styles.actionIconBadge}>
          <Ionicons name="list" size={20} color="#FF5722" />
        </View>
        <View style={styles.actionTextCol}>
          <Text style={styles.actionTitle}>
            {esAdmin ? "Gestionar solicitudes" : "Ver solicitudes"}
          </Text>
          <Text style={styles.actionSub}>
            {esAdmin
              ? "Revisa todos los vehículos"
              : "Consulta avances y mensajes"}
          </Text>
        </View>
        <Ionicons name="arrow-forward" size={18} color="#6B7280" />
      </TouchableOpacity>

      {!esAdmin && (
        <TouchableOpacity
          style={styles.actionCardOrange}
          onPress={onNavigateToRegister}
          activeOpacity={0.8}
        >
          <View style={styles.actionIconBadgeLight}>
            <Ionicons name="add" size={20} color="#FF5722" />
          </View>
          <View style={styles.actionTextCol}>
            <Text style={styles.actionTitleLight}>Registrar solicitud</Text>
            <Text style={styles.actionSubLight}>Agenda una nueva atención</Text>
          </View>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
        <Ionicons name="log-out-outline" size={18} color="#9CA3AF" />
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0F17", padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  logoBadge: { backgroundColor: "#FF5722", padding: 8, borderRadius: 10 },
  brandTitle: { color: "#FFFFFF", fontWeight: "900", fontSize: 18 },
  brandSub: { color: "#9CA3AF", fontSize: 9, letterSpacing: 1 },
  userRole: { alignItems: "flex-end" },
  userName: { color: "#FFFFFF", fontWeight: "700", fontSize: 13 },
  roleTag: { color: "#FF5722", fontSize: 9, fontWeight: "800" },
  bannerContainer: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    position: "relative",
  },
  bannerImage: { width: "100%", height: 160 },
  bannerOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(11,15,23,0.75)",
    padding: 16,
    justifyContent: "center",
  },
  bannerSub: {
    color: "#FF5722",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  bannerTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 4,
  },
  bannerDesc: { color: "#D1D5DB", fontSize: 12 },
  tipCard: {
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  tipTextCol: { flex: 1 },
  tipTitle: {
    color: "#FF5722",
    fontSize: 10,
    fontWeight: "800",
    marginBottom: 2,
  },
  tipDesc: { color: "#D1D5DB", fontSize: 12 },
  metricsRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  metricCard: {
    flex: 1,
    backgroundColor: "#111827",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  metricVal: { color: "#FFFFFF", fontSize: 22, fontWeight: "bold" },
  metricLabel: {
    color: "#9CA3AF",
    fontSize: 9,
    fontWeight: "700",
    marginTop: 4,
  },
  sectionHeader: {
    color: "#9CA3AF",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 12,
  },
  actionCardDark: {
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  actionCardOrange: {
    backgroundColor: "#FF5722",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 12,
  },
  actionIconBadge: { backgroundColor: "#1F2937", padding: 10, borderRadius: 8 },
  actionIconBadgeLight: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 10,
    borderRadius: 8,
  },
  actionTextCol: { flex: 1 },
  actionTitle: { color: "#FFFFFF", fontWeight: "bold", fontSize: 15 },
  actionSub: { color: "#9CA3AF", fontSize: 12 },
  actionTitleLight: { color: "#FFFFFF", fontWeight: "bold", fontSize: 15 },
  actionSubLight: { color: "rgba(255,255,255,0.8)", fontSize: 12 },
  logoutBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    padding: 16,
    marginTop: 10,
  },
  logoutText: { color: "#9CA3AF", fontSize: 14, fontWeight: "600" },
});
