import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SolicitudAuto, TipoServicioAuto } from "../../domain/Solicitud";
import { CustomButton } from "../componentes/CustomButton";
import { CustomInput } from "../componentes/CustomInput";
import { useSolicitudes } from "../../infrastructura/context/SolicitudesContext";

interface RegisterScreenProps {
  onBack: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onBack }) => {
  const { agregarSolicitud } = useSolicitudes();

  const [clienteNombre, setClienteNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [vehiculoPlaca, setVehiculoPlaca] = useState("");
  const [vehiculoModelo, setVehiculoModelo] = useState("");
  const tipoServicio: TipoServicioAuto = "Mantenimiento Preventivo";
  const [descripcion, setDescripcion] = useState("");

  const [errores, setErrores] = useState<{
    clienteNombre?: string;
    telefono?: string;
    vehiculoPlaca?: string;
    descripcion?: string;
  }>({});

  const handleGuardar = () => {
    const err: typeof errores = {};

    if (!clienteNombre.trim())
      err.clienteNombre = "El nombre del cliente es obligatorio.";
    if (!telefono.trim()) err.telefono = "El teléfono es obligatorio.";
    else if (telefono.trim().length < 9)
      err.telefono = "El teléfono debe tener mínimo 9 dígitos.";
    if (!vehiculoPlaca.trim())
      err.vehiculoPlaca = "La placa del vehículo es obligatoria.";
    if (!descripcion.trim())
      err.descripcion = "La descripción de la falla es obligatoria.";

    if (Object.keys(err).length > 0) {
      setErrores(err);
      return;
    }

    const nuevaSolicitud: SolicitudAuto = {
      id: Date.now().toString(),
      clienteNombre,
      telefono,
      vehiculoPlaca,
      vehiculoModelo: vehiculoModelo || "Sin especificar",
      tipoServicio,
      prioridad: "Media",
      descripcion,
      estado: "RECIBIDO",
      fechaRegistro: new Date().toLocaleDateString(),
    };

    agregarSolicitud(nuevaSolicitud);

    Alert.alert("Éxito", "Solicitud registrada correctamente.");
    onBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registro de Solicitud</Text>
      <Text style={styles.subtitle}>
        Complete los datos del cliente y vehículo
      </Text>

      <CustomInput
        label="Nombre del Cliente *"
        placeholder="Ej. Juan Pérez"
        value={clienteNombre}
        onChangeText={setClienteNombre}
        error={errores.clienteNombre}
      />

      <CustomInput
        label="Teléfono de Contacto *"
        placeholder="Ej. 987654321"
        keyboardType="phone-pad"
        value={telefono}
        onChangeText={setTelefono}
        error={errores.telefono}
      />

      <CustomInput
        label="Placa del Vehículo *"
        placeholder="Ej. ABC-123"
        autoCapitalize="characters"
        value={vehiculoPlaca}
        onChangeText={setVehiculoPlaca}
        error={errores.vehiculoPlaca}
      />

      <CustomInput
        label="Modelo del Vehículo"
        placeholder="Ej. Toyota Corolla 2021"
        value={vehiculoModelo}
        onChangeText={setVehiculoModelo}
      />

      <CustomInput
        label="Descripción de la Falla *"
        placeholder="Detalle los síntomas o reparación requerida"
        multiline
        numberOfLines={3}
        value={descripcion}
        onChangeText={setDescripcion}
        error={errores.descripcion}
      />

      <View style={styles.btnGroup}>
        <CustomButton title="Guardar Solicitud" onPress={handleGuardar} />
        <CustomButton title="Cancelar" variant="secondary" onPress={onBack} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#ffffff",
    flexGrow: 1,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f172a",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 20,
  },
  btnGroup: {
    marginTop: 10,
  },
});