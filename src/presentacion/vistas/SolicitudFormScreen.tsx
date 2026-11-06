import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  PrioridadAuto,
  SolicitudAuto,
  TipoServicioAuto,
} from "../../domain/Solicitud";
import { useAuth } from "../../infrastructura/context/AuthContext";
import { useSolicitudes } from "../../infrastructura/context/SolicitudesContext";
import { CustomInput } from "../componentes/CustomInput";

interface Props {
  onBack: () => void;
  solicitudAEditar?: SolicitudAuto | null;
}

export const SolicitudFormScreen: React.FC<Props> = ({
  onBack,
  solicitudAEditar,
}) => {
  const { agregarSolicitud, actualizarSolicitud } = useSolicitudes();
  const { state } = useAuth();
  const usuario = state.usuarioActual;

  const [clienteNombre, setClienteNombre] = useState(
    solicitudAEditar?.clienteNombre ?? usuario?.nombre ?? "JOSE",
  );
  const [telefono, setTelefono] = useState(
    solicitudAEditar?.telefono ?? usuario?.telefono ?? "982371347",
  );
  const [vehiculoPlaca, setVehiculoPlaca] = useState(
    solicitudAEditar?.vehiculoPlaca ?? "",
  );
  const [vehiculoModelo, setVehiculoModelo] = useState(
    solicitudAEditar?.vehiculoModelo ?? "",
  );
  const [tipoServicio, setTipoServicio] = useState<TipoServicioAuto>(
    solicitudAEditar?.tipoServicio ?? "Diagnóstico general",
  );
  const [prioridad, setPrioridad] = useState<PrioridadAuto>(
    solicitudAEditar?.prioridad ?? "Media",
  );
  const [descripcion, setDescripcion] = useState(
    solicitudAEditar?.descripcion ?? "",
  );

  const [errores, setErrores] = useState<{
    clienteNombre?: string;
    telefono?: string;
    vehiculoPlaca?: string;
    descripcion?: string;
  }>({});

  const validar = (): boolean => {
    const err: typeof errores = {};

    if (!clienteNombre.trim())
      err.clienteNombre = "El nombre del cliente es obligatorio.";
    if (!telefono.trim())
      err.telefono = "El teléfono de contacto es obligatorio.";
    if (!vehiculoPlaca.trim())
      err.vehiculoPlaca = "La placa del vehículo es obligatoria.";
    if (!descripcion.trim())
      err.descripcion = "La descripción de la falla es obligatoria.";

    setErrores(err);
    return Object.keys(err).length === 0;
  };

  const handleGuardar = () => {
    if (!validar()) return;

    if (solicitudAEditar) {
      const solicitudActualizada: SolicitudAuto = {
        ...solicitudAEditar,
        clienteNombre: clienteNombre.trim(),
        telefono: telefono.trim(),
        vehiculoPlaca: vehiculoPlaca.trim().toUpperCase(),
        vehiculoModelo: vehiculoModelo.trim() || "Toyota Corolla 2020",
        tipoServicio,
        prioridad,
        descripcion: descripcion.trim(),
      };
      actualizarSolicitud(solicitudActualizada);
      Alert.alert("Éxito", "Solicitud actualizada correctamente.");
    } else {
      const nuevaSolicitud: SolicitudAuto = {
        id: Date.now().toString(),
        clienteNombre: clienteNombre.trim(),
        telefono: telefono.trim(),
        vehiculoPlaca: vehiculoPlaca.trim().toUpperCase(),
        vehiculoModelo: vehiculoModelo.trim() || "Toyota Corolla 2020",
        tipoServicio,
        prioridad,
        descripcion: descripcion.trim(),
        estado: "RECIBIDO",
        fechaRegistro: new Date().toLocaleDateString("es-PE"),
        usuarioCliente: usuario?.usuario,
      };
      agregarSolicitud(nuevaSolicitud);
      Alert.alert("Éxito", "Nueva solicitud registrada correctamente.");
    }

    onBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardView}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topNav}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Ionicons name="chevron-back" size={18} color="#9CA3AF" />
            <Text style={styles.backText}>Volver</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTag}>NUEVA ATENCIÓN</Text>
        <Text style={styles.title}>
          {solicitudAEditar ? "Editar solicitud" : "Registrar solicitud"}
        </Text>
        <Text style={styles.subtitle}>
          Cuéntanos qué sucede con tu vehículo. Nuestro equipo revisará el caso.
        </Text>

        <CustomInput
          label="NOMBRE DEL CLIENTE"
          placeholder="JOSE"
          value={clienteNombre}
          onChangeText={setClienteNombre}
          error={errores.clienteNombre}
        />

        <CustomInput
          label="TELÉFONO DE CONTACTO"
          placeholder="982371347"
          keyboardType="phone-pad"
          value={telefono}
          onChangeText={setTelefono}
          error={errores.telefono}
        />

        <CustomInput
          label="PLACA DEL VEHÍCULO"
          placeholder="ABC-123"
          autoCapitalize="characters"
          value={vehiculoPlaca}
          onChangeText={setVehiculoPlaca}
          error={errores.vehiculoPlaca}
        />

        <CustomInput
          label="MARCA O MODELO"
          placeholder="Toyota Corolla 2020"
          value={vehiculoModelo}
          onChangeText={setVehiculoModelo}
        />

        <CustomInput
          label="TIPO DE SOLICITUD"
          placeholder="Diagnóstico general"
          value={tipoServicio}
          onChangeText={(txt) => setTipoServicio(txt as TipoServicioAuto)}
        />

        <CustomInput
          label="PRIORIDAD"
          placeholder="Media"
          value={prioridad}
          onChangeText={(txt) => setPrioridad(txt as PrioridadAuto)}
        />

        <CustomInput
          label="DESCRIPCIÓN DE LA FALLA"
          placeholder="Describe los ruidos, alertas o comportamientos que notaste..."
          multiline
          numberOfLines={4}
          value={descripcion}
          onChangeText={setDescripcion}
          error={errores.descripcion}
        />

        <TouchableOpacity style={styles.submitBtn} onPress={handleGuardar}>
          <Text style={styles.submitText}>
            {solicitudAEditar ? "Guardar cambios" : "Enviar solicitud"}
          </Text>
          <Ionicons name="checkmark" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardView: { flex: 1, backgroundColor: "#0B0F17" },
  container: { padding: 20, paddingTop: 30 },
  topNav: { marginBottom: 10 },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  backText: { color: "#9CA3AF", fontSize: 14 },
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
  subtitle: { color: "#9CA3AF", fontSize: 13, marginBottom: 20 },
  submitBtn: {
    backgroundColor: "#FF5722",
    borderRadius: 10,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
    marginBottom: 30,
  },
  submitText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 15 },
});
