import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { EstadoAuto, SolicitudAuto } from "../../domain/Solicitud";
import { useAuth } from "../../infrastructura/context/AuthContext";
import { useSolicitudes } from "../../infrastructura/context/SolicitudesContext";
import { SolicitudCard } from "../componentes/SolicitudCard";

interface Props {
  onBack: () => void;
  onNewSolicitud: () => void;
  onSelectSolicitud: (solicitud: SolicitudAuto) => void;
}

export const SolicitudesListScreen: React.FC<Props> = ({
  onBack,
  onNewSolicitud,
  onSelectSolicitud,
}) => {
  const { solicitudes } = useSolicitudes();
  const { state } = useAuth();
  const usuario = state.usuarioActual;
  const esAdmin = usuario?.rol === "admin";

  const [filtroEstado, setFiltroEstado] = useState<EstadoAuto | "TODOS">(
    "TODOS",
  );

  const misSolicitudes = esAdmin
    ? solicitudes
    : solicitudes.filter(
        (s) =>
          s.usuarioCliente === usuario?.usuario ||
          s.clienteNombre === usuario?.nombre,
      );

  const filtradas = misSolicitudes.filter((item) => {
    if (filtroEstado === "TODOS") return true;
    return item.estado === filtroEstado;
  });

  return (
    <View style={styles.container}>
      <View style={styles.topNav}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="chevron-back" size={18} color="#9CA3AF" />
          <Text style={styles.backText}>Inicio</Text>
        </TouchableOpacity>

        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Ionicons name="construct-outline" size={14} color="#FFFFFF" />
          </View>
          <Text style={styles.brandTitle}>AUTOFIX</Text>
        </View>

        <View style={styles.userRole}>
          <Text style={styles.userName}>{usuario?.nombre}</Text>
          <Text style={styles.roleTag}>
            {esAdmin ? "ADMINISTRADOR" : "CLIENTE"}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTag}>
        {esAdmin ? "VISTA ADMINISTRATIVA" : "HISTORIAL DEL VEHÍCULO"}
      </Text>
      <Text style={styles.title}>
        {esAdmin ? "Todas las solicitudes" : "Mis solicitudes"}
      </Text>
      <Text style={styles.subtitle}>
        {esAdmin
          ? "Supervisa el flujo completo del taller."
          : "Consulta el estado y abre cada registro para ver sus detalles."}
      </Text>

      <View style={styles.filterRow}>
        {(["TODOS", "RECIBIDO", "EN_PROCESO", "FINALIZADO"] as const).map(
          (filtro) => {
            const isActive = filtroEstado === filtro;
            return (
              <TouchableOpacity
                key={filtro}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setFiltroEstado(filtro)}
              >
                <Text
                  style={[
                    styles.filterText,
                    isActive && styles.filterTextActive,
                  ]}
                >
                  {filtro === "TODOS"
                    ? "Todos"
                    : filtro === "EN_PROCESO"
                      ? "En proceso"
                      : filtro.charAt(0) + filtro.slice(1).toLowerCase()}
                </Text>
              </TouchableOpacity>
            );
          },
        )}
      </View>

      <FlatList
        data={filtradas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SolicitudCard
            solicitud={item}
            onPress={() => onSelectSolicitud(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="car-outline" size={48} color="#374151" />
            <Text style={styles.emptyTitle}>No hay solicitudes aquí</Text>
            <Text style={styles.emptySub}>
              Los registros aparecerán en esta sección.
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0F17", padding: 16 },
  topNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  backText: { color: "#9CA3AF", fontSize: 14 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  logoBadge: { backgroundColor: "#FF5722", padding: 4, borderRadius: 6 },
  brandTitle: { color: "#FFFFFF", fontWeight: "bold", fontSize: 14 },
  userRole: { alignItems: "flex-end" },
  userName: { color: "#FFFFFF", fontSize: 12, fontWeight: "bold" },
  roleTag: { color: "#FF5722", fontSize: 9, fontWeight: "800" },
  sectionTag: {
    color: "#FF5722",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 4,
  },
  subtitle: { color: "#9CA3AF", fontSize: 13, marginBottom: 16 },
  filterRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  filterChipActive: { backgroundColor: "#FF5722", borderColor: "#FF5722" },
  filterText: { color: "#9CA3AF", fontSize: 12, fontWeight: "600" },
  filterTextActive: { color: "#FFFFFF" },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    borderWidth: 1,
    borderColor: "#1F2937",
    borderStyle: "dashed",
    borderRadius: 16,
    marginTop: 20,
  },
  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 12,
  },
  emptySub: { color: "#6B7280", fontSize: 12, marginTop: 4 },
});
