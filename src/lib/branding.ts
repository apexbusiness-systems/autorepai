export const getBranding = () => {
  const mode = import.meta.env.VITE_BRANDING_MODE || 'autorepai';

  if (mode === 'doorstep') {
    return {
      name: 'Doorstep Auto',
      logo: '/doorstep/doorstep-logo.png',
      favicon: '/doorstep/favicon.ico',
      colors: {
        primary: '#377620',
        secondary: '#000000', // Assuming black or using a fallback
      },
      fonts: ['Arial', 'sans-serif'], // Assuming generic sans-serif for simplicity if no specific web font was scraped
    };
  }

  return {
    name: 'AutoRepAi',
    logo: '/vite.svg', // Default vite logo placeholder
    favicon: '/vite.svg',
    colors: {
      primary: '#ef4444', // Red as per memory
      secondary: '#1e293b',
    },
    fonts: ['Inter', 'sans-serif'],
  };
};

export const BRANDING_CONFIG = getBranding();
