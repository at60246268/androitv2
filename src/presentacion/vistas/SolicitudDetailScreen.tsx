import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { EstadoAuto, SolicitudAuto } from "../../domain/Solicitud";
import { useAuth } from "../../infrastructura/context/AuthContext";
import { useSolicitudes } from "../../infrastructura/context/SolicitudesContext";
import { CustomButton } from "../componentes/CustomButton";

interface Props {
  solicitud: SolicitudAuto;
  onBack: () => void;
  onEdit: (item: SolicitudAuto) => void;
}

export const SolicitudDetailScreen: React.FC<Props> = ({
  solicitud: solicitudInicial,
  onBack,
  onEdit,
}) => {
  const {
    cambiarEstado,
    enviarMensajeCliente,
    eliminarSolicitud,
    solicitudes,
  } = useSolicitudes();
  const { state } = useAuth();
  const usuario = state.usuarioActual;
  const esAdmin = usuario?.rol === "admin";
  const solicitud =
    solicitudes.find((item) => item.id === solicitudInicial.id) ??
    solicitudInicial;

  const [mensajeInput, setMensajeInput] = useState(
    solicitud.mensajeAdmin || "",
  );

  const handleEliminar = () => {
    Alert.alert(
      "Confirmar Eliminación",
      `¿Está seguro de eliminar la solicitud del vehículo con placa ${solicitud.vehiculoPlaca}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            eliminarSolicitud(solicitud.id);
            Alert.alert(
              "Registro Eliminado",
              "La solicitud fue eliminada correctamente.",
            );
            onBack();
          },
        },
      ],
    );
  };

  const handleEstado = (nuevoEstado: EstadoAuto) => {
    cambiarEstado(solicitud.id, nuevoEstado);
    Alert.alert(
      "Estado Actualizado",
      `El estado cambió a: ${nuevoEstado.replace("_", " ")}`,
    );
  };

  const handleEnviarMensaje = () => {
    if (!mensajeInput.trim()) return;
    enviarMensajeCliente(solicitud.id, mensajeInput.trim());
    Alert.alert("Mensaje Enviado", "Notificación enviada al cliente.");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Ionicons name="chevron-back" size={18} color="#9CA3AF" />
        <Text style={styles.backText}>Volver a la lista</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTag}>
        {esAdmin ? "GESTIÓN ADMINISTRATIVA" : "DETALLE DE SOLICITUD"}
      </Text>
      <Text style={styles.title}>{solicitud.vehiculoPlaca}</Text>
      <Text style={styles.subtitle}>{solicitud.vehiculoModelo}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>CLIENTE</Text>
        <Text style={styles.value}>
          {solicitud.clienteNombre} ({solicitud.telefono})
        </Text>

        <Text style={styles.label}>TIPO DE SERVICIO</Text>
        <Text style={styles.valueService}>{solicitud.tipoServicio}</Text>

        <Text style={styles.label}>PRIORIDAD</Text>
        <Text style={styles.value}>{solicitud.prioridad}</Text>

        <Text style={styles.label}>ESTADO ACTUAL</Text>
        <Text style={styles.valueStatus}>
          {solicitud.estado.replace("_", " ")}
        </Text>

        <Text style={styles.label}>DESCRIPCIÓN DE LA FALLA</Text>
        <Text style={styles.valueDesc}>{solicitud.descripcion}</Text>

        {solicitud.mensajeAdmin ? (
          <View style={styles.msgAlertBox}>
            <Text style={styles.msgAlertTitle}>MENSAJE DEL TALLER</Text>
            <Text style={styles.msgAlertText}>{solicitud.mensajeAdmin}</Text>
          </View>
        ) : null}
      </View>

      {esAdmin && (
        <View style={styles.adminBox}>
          <Text style={styles.adminSectionTitle}>CAMBIAR ESTADO DEL AUTO</Text>
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[
                styles.statusBtn,
                solicitud.estado === "RECIBIDO" && styles.statusBtnActive,
              ]}
              accessibilityState={{ selected: solicitud.estado === "RECIBIDO" }}
              onPress={() => handleEstado("RECIBIDO")}
            >
              <Text style={styles.statusBtnText}>RECIBIDO</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.statusBtn,
                solicitud.estado === "EN_PROCESO" && styles.statusBtnActive,
              ]}
              accessibilityState={{
                selected: solicitud.estado === "EN_PROCESO",
              }}
              onPress={() => handleEstado("EN_PROCESO")}
            >
              <Text style={styles.statusBtnText}>EN PROCESO</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.statusBtn,
                solicitud.estado === "FINALIZADO" && styles.statusBtnActive,
              ]}
              accessibilityState={{
                selected: solicitud.estado === "FINALIZADO",
              }}
              onPress={() => handleEstado("FINALIZADO")}
            >
              <Text style={styles.statusBtnText}>FINALIZADO</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.adminSectionTitle}>NOTIFICAR AL CLIENTE</Text>
          <TextInput
            style={styles.msgInput}
            placeholder="Ej. Su vehículo ya se encuentra listo para recojo."
            placeholderTextColor="#4B5563"
            value={mensajeInput}
            onChangeText={setMensajeInput}
            multiline
          />
          <CustomButton
            title="Enviar mensaje al usuario"
            onPress={handleEnviarMensaje}
          />
        </View>
      )}

      <View style={styles.actionsGroup}>
        <CustomButton
          title="Editar datos de solicitud"
          onPress={() => onEdit(solicitud)}
        />
        <CustomButton
          title="Eliminar registro"
          variant="danger"
          onPress={handleEliminar}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 30, backgroundColor: "#0B0F17" },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 16,
  },
  backText: { color: "#9CA3AF", fontSize: 14 },
  sectionTag: {
    color: "#FF5722",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginVertical: 2,
  },
  subtitle: { fontSize: 14, color: "#9CA3AF", marginBottom: 16 },
  card: {
    backgroundColor: "#111827",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1F2937",
    marginBottom: 20,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    color: "#6B7280",
    marginTop: 10,
    letterSpacing: 0.5,
  },
  value: { fontSize: 15, color: "#FFFFFF", marginTop: 2 },
  valueService: {
    fontSize: 15,
    color: "#FF5722",
    fontWeight: "600",
    marginTop: 2,
  },
  valueStatus: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#FF5722",
    marginTop: 2,
  },
  valueDesc: {
    fontSize: 14,
    color: "#D1D5DB",
    marginTop: 4,
    lineHeight: 20,
  },
  msgAlertBox: {
    backgroundColor: "#0F172A",
    borderRadius: 8,
    padding: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#FF5722",
  },
  msgAlertTitle: {
    color: "#FF5722",
    fontSize: 10,
    fontWeight: "800",
    marginBottom: 4,
  },
  msgAlertText: { color: "#FFFFFF", fontSize: 13 },
  adminBox: {
    backgroundColor: "#111827",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1F2937",
    marginBottom: 20,
  },
  adminSectionTitle: {
    color: "#9CA3AF",
    fontSize: 11,
    fontWeight: "800",
    marginBottom: 10,
    marginTop: 6,
  },
  btnRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  statusBtn: {
    flex: 1,
    backgroundColor: "#0F172A",
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  statusBtnActive: { backgroundColor: "#FF5722", borderColor: "#FF5722" },
  statusBtnText: { color: "#FFFFFF", fontSize: 10, fontWeight: "800" },
  msgInput: {
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#1E293B",
    borderRadius: 8,
    padding: 12,
    color: "#FFFFFF",
    fontSize: 13,
    marginBottom: 12,
    minHeight: 70,
  },
  actionsGroup: { gap: 8, marginBottom: 30 },
});
