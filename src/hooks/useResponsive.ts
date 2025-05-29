import { Platform, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';

export const useResponsive = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const isWeb = Platform.OS === 'web';
  const isMobile = !isWeb;
  const isTablet = dimensions.width >= 768;
  const isDesktop = dimensions.width >= 1024;
  
  return {
    isWeb,
    isMobile,
    isTablet,
    isDesktop,
    width: dimensions.width,
    height: dimensions.height,
    containerWidth: isWeb ? Math.min(dimensions.width * 0.9, 400) : dimensions.width,
  };
}; 