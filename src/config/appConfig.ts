/**
 * App Configuration
 * Centralized configuration for app branding and settings
 * This allows easy customization for different app flavors
 */

export interface AppConfig {
  // App Branding
  appName: string;
  appShortName: string; // For logos/abbreviations
  appTagline: string;
  appDescription: string;
  
  // Logo/Icon
  logoInitials: string; // e.g., "LW" for Last War
  
  // Theme Colors (can be extended for different themes)
  primaryColor: string;
  secondaryColor: string;
  
  // Game-specific text
  gameName: string; // e.g., "Last War"
  knowledgeText: string; // e.g., "Last War knowledge"
}

/**
 * Default App Configuration
 * This is the base configuration for "Last War Quiz"
 * For other flavors, create separate config files or use environment variables
 */
const appConfig: AppConfig = {
  appName: 'Last War Quiz',
  appShortName: 'LW Quiz',
  appTagline: 'Test your Last War knowledge',
  appDescription: 'Test your Last War knowledge and compete with players worldwide.',
  logoInitials: 'LW',
  primaryColor: 'indigo',
  secondaryColor: 'purple',
  gameName: 'Last War',
  knowledgeText: 'Last War knowledge',
};

export default appConfig;

