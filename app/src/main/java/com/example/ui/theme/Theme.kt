package com.example.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val AetherDarkColorScheme = darkColorScheme(
  primary = NeonCyan,
  onPrimary = Color.Black,
  primaryContainer = DeepIndigo,
  onPrimaryContainer = Color.White,
  secondary = ElectricViolet,
  onSecondary = Color.White,
  secondaryContainer = ObsidianSurfaceHighlight,
  onSecondaryContainer = NeonCyan,
  tertiary = EmeraldMint,
  onTertiary = Color.Black,
  background = ObsidianBackground,
  onBackground = TextPrimary,
  surface = ObsidianSurface,
  onSurface = TextPrimary,
  surfaceVariant = ObsidianSurfaceElevated,
  onSurfaceVariant = TextSecondary,
  outline = ObsidianBorder,
  error = CrimsonAlert,
  onError = Color.White
)

private val AetherLightColorScheme = lightColorScheme(
  primary = DeepIndigo,
  onPrimary = Color.White,
  primaryContainer = Color(0xFFE0E7FF),
  onPrimaryContainer = DeepIndigo,
  secondary = ElectricViolet,
  onSecondary = Color.White,
  secondaryContainer = Color(0xFFEDE9FE),
  onSecondaryContainer = ElectricViolet,
  tertiary = EmeraldMint,
  onTertiary = Color.Black,
  background = Color(0xFFF8FAFC),
  onBackground = Color(0xFF0F172A),
  surface = Color.White,
  onSurface = Color(0xFF0F172A),
  surfaceVariant = Color(0xFFF1F5F9),
  onSurfaceVariant = Color(0xFF475569),
  outline = Color(0xFFCBD5E1),
  error = CrimsonAlert,
  onError = Color.White
)

@Composable
fun MyApplicationTheme(
  darkTheme: Boolean = true, // Default to futuristic dark cyber vibe
  dynamicColor: Boolean = false,
  content: @Composable () -> Unit,
) {
  val colorScheme = if (darkTheme) AetherDarkColorScheme else AetherLightColorScheme
  MaterialTheme(colorScheme = colorScheme, typography = Typography, content = content)
}

