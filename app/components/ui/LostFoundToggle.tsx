import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../constants/Colors';

interface LostFoundToggleProps {
  isLost: boolean;
  setIsLost: (value: boolean) => void;
}

export default function LostFoundToggle({ isLost, setIsLost }: LostFoundToggleProps) {
  return (
    <View style={styles.container}>
      <View style={styles.toggleWrapper}>
        <TouchableOpacity
          style={[styles.button, isLost && styles.activeButton]}
          onPress={() => setIsLost(true)}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, isLost && styles.activeText]}>Lost</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, !isLost && styles.activeButton]}
          onPress={() => setIsLost(false)}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, !isLost && styles.activeText]}>Found</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  toggleWrapper: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeButton: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 15,
  },
  activeText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});