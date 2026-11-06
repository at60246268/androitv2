import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = "primary",
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === "secondary" && styles.secondary,
        variant === "danger" && styles.danger,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        style={[styles.text, variant === "secondary" && styles.textSecondary]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    backgroundColor: "#FF5722",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginVertical: 4,
    width: "100%",
  },
  secondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#334155",
  },
  danger: { backgroundColor: "#DC2626" },
  text: { color: "#FFFFFF", fontSize: 14, fontWeight: "bold" },
  textSecondary: { color: "#94A3B8" },
});
