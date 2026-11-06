import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../infrastructura/context/AuthContext";
import { CustomInput } from "../componentes/CustomInput";

interface LoginScreenProps {
  onLoginSuccess: (usuarioNombre: string) => void;
  onNavigateToRegisterUser?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onNavigateToRegisterUser,
}) => {
  const { state, dispatch } = useAuth();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleIngresar = () => {
    if (!correo.trim() || !password.trim()) {
      setErrorMsg("Completa todos los campos obligatorios.");
      return;
    }

    const encontrado = state.usuariosRegistrados.find(
      (u) =>
        u.usuario.toLowerCase() === correo.trim().toLowerCase() &&
        u.password === password,
    );

    if (encontrado) {
      setErrorMsg("");
      dispatch({
        type: "LOGIN",
        payload: {
          usuario: encontrado.usuario,
          nombre: encontrado.nombre,
          rol: encontrado.rol,
          telefono: encontrado.telefono,
        },
      });
      onLoginSuccess(encontrado.nombre);
    } else {
      setErrorMsg("Credenciales incorrectas. Verifica correo o contraseña.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.logoHeader}>
          <View style={styles.logoIcon}>
            <Ionicons name="construct-outline" size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.logoTitle}>AUTOFIX</Text>
          <Text style={styles.logoSub}>SERVICIO AUTOMOTRIZ</Text>
        </View>

        <View style={styles.bannerCard}>
          <Image
            source={require("../../public/logo.webp")}
            style={styles.bannerImg}
          />
          <View style={styles.badgeOverlay}>
            <Text style={styles.badgeText}>TU AUTO EN BUENAS MANOS</Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.tagline}>BIENVENIDO DE VUELTA</Text>
          <Text style={styles.title}>Inicia sesión</Text>
          <Text style={styles.subtitle}>
            Consulta el avance de tu vehículo desde cualquier lugar.
          </Text>

          {errorMsg ? <Text style={styles.errorBanner}>{errorMsg}</Text> : null}

          <CustomInput
            label="CORREO ELECTRÓNICO"
            placeholder="tu@correo.com"
            value={correo}
            onChangeText={setCorreo}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <CustomInput
            label="CONTRASEÑA"
            placeholder="Mínimo 8 caracteres"
            value={password}
            onChangeText={setPassword}
            isPassword
          />

          <TouchableOpacity style={styles.primaryBtn} onPress={handleIngresar}>
            <Text style={styles.btnText}>Ingresar a mi cuenta</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>

          {onNavigateToRegisterUser && (
            <TouchableOpacity
              onPress={onNavigateToRegisterUser}
              style={styles.linkBtn}
            >
              <Text style={styles.linkText}>
                ¿Primera vez? Crear una cuenta
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0F17" },
  scroll: { padding: 20, paddingTop: 40 },
  logoHeader: { alignItems: "center", marginBottom: 20 },
  logoIcon: {
    backgroundColor: "#FF5722",
    padding: 12,
    borderRadius: 14,
    marginBottom: 8,
  },
  logoTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 2,
  },
  logoSub: { color: "#9CA3AF", fontSize: 10, letterSpacing: 1.5 },
  bannerCard: {
    borderRadius: 16,
    overflow: "hidden",
    height: 140,
    marginBottom: 20,
    position: "relative",
  },
  bannerImg: { width: "100%", height: "100%" },
  badgeOverlay: {
    position: "absolute",
    bottom: 12,
    left: 12,
    backgroundColor: "#FF5722",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: { color: "#FFFFFF", fontSize: 10, fontWeight: "800" },
  formCard: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  tagline: {
    color: "#FF5722",
    fontSize: 11,
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
  errorBanner: { color: "#EF4444", marginBottom: 12, fontSize: 13 },
  primaryBtn: {
    backgroundColor: "#FF5722",
    borderRadius: 10,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },
  btnText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 15 },
  linkBtn: { marginTop: 16, alignItems: "center" },
  linkText: { color: "#9CA3AF", fontSize: 13, textDecorationLine: "underline" },
});
