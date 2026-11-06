import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SolicitudAuto } from "../../domain/Solicitud";

interface Props {
  solicitud: SolicitudAuto;
  onPress: () => void;
}

export const SolicitudCard: React.FC<Props> = ({ solicitud, onPress }) => {
  const getBadgeStyle = () => {
    switch (solicitud.estado) {
      case "RECIBIDO":
        return styles.badgeRecibido;
      case "EN_PROCESO":
        return styles.badgeProceso;
      case "FINALIZADO":
        return styles.badgeFinalizado;
      default:
        return styles.badgeRecibido;
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.cliente}>{solicitud.clienteNombre}</Text>
        <View style={[styles.badge, getBadgeStyle()]}>
          <Text style={styles.badgeText}>
            {solicitud.estado.replace("_", " ")}
          </Text>
        </View>
      </View>
      <Text style={styles.info}>
        {solicitud.vehiculoModelo} ({solicitud.vehiculoPlaca})
      </Text>
      <Text style={styles.servicio}>{solicitud.tipoServicio}</Text>
      {solicitud.mensajeAdmin ? (
        <View style={styles.msgBox}>
          <Ionicons name="chatbox-ellipses-outline" size={14} color="#FF5722" />
          <Text style={styles.msgText}>{solicitud.mensajeAdmin}</Text>
        </View>
      ) : null}
      <Text style={styles.fecha}>{solicitud.fechaRegistro}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  cliente: { fontSize: 16, fontWeight: "bold", color: "#FFFFFF" },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeRecibido: { backgroundColor: "rgba(234, 179, 8, 0.2)" },
  badgeProceso: { backgroundColor: "rgba(59, 130, 246, 0.2)" },
  badgeFinalizado: { backgroundColor: "rgba(34, 197, 94, 0.2)" },
  badgeText: { fontSize: 10, fontWeight: "800", color: "#FFFFFF" },
  info: { fontSize: 14, color: "#9CA3AF", marginTop: 2 },
  servicio: { fontSize: 13, color: "#FF5722", fontWeight: "600", marginTop: 4 },
  msgBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    backgroundColor: "#0F172A",
    padding: 8,
    borderRadius: 6,
  },
  msgText: { fontSize: 12, color: "#CBD5E1", flex: 1 },
  fecha: { fontSize: 11, color: "#64748B", marginTop: 8 },
});
