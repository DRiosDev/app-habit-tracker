/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { Text as DefaultText, View as DefaultView } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from './useColorScheme';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  if (lightColor || darkColor) {
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    return <DefaultText style={[{ color }, style]} {...otherProps} />;
  }
  return <DefaultText className="text-text-main" style={style} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  if (lightColor || darkColor) {
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
  }
  return <DefaultView style={style} {...otherProps} />;
}

/**
 * Contenedor dinámico principal para pantallas.
 * Cambia automáticamente entre el fondo claro y oscuro centralizado en global.css.
 */
export function ScreenView({ className = "", style, ...props }: DefaultView['props'] & { className?: string }) {
  return (
    <DefaultView
      className={`flex-1 bg-screen ${className}`}
      style={style}
      {...props}
    />
  );
}

/**
 * Contenedor dinámico para tarjetas estándar.
 * Cambia automáticamente según el tema activo centralizado en global.css.
 */
export function CardView({ className = "", style, ...props }: DefaultView['props'] & { className?: string }) {
  return (
    <DefaultView
      className={`rounded-2xl p-4 bg-card ${className}`}
      style={style}
      {...props}
    />
  );
}

