import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

interface CustomInputProps extends TextInputProps {
  label: string;
  error?: string;
  isPassword?: boolean;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  error,
  isPassword,
  ...restProps
}) => {
  const [hidePassword, setHidePassword] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          placeholderTextColor="#4B5563"
          secureTextEntry={isPassword ? hidePassword : false}
          {...restProps}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setHidePassword(!hidePassword)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={hidePassword ? "eye-outline" : "eye-off-outline"}
              size={18}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 14, width: "100%" },
  label: {
    fontSize: 10,
    fontWeight: "700",
    color: "#9CA3AF",
    marginBottom: 6,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  inputWrapper: { position: "relative", justifyContent: "center" },
  input: {
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#1E293B",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#FFFFFF",
  },
  inputError: { borderColor: "#EF4444" },
  eyeIcon: { position: "absolute", right: 14, padding: 4 },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
});
