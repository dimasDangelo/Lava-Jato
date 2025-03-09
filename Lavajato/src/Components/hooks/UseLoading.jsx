import { useCallback } from 'react';

const useLoadingBlur = () => {
  const useblur = useCallback((isLoading) => {
    if (isLoading) {
      // Cria o overlay e o spinner
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
      overlay.style.display = 'flex';
      overlay.style.justifyContent = 'center';
      overlay.style.alignItems = 'center';
      overlay.style.zIndex = '9999';
      overlay.style.backdropFilter = 'blur(5px)';
      overlay.id = 'loading-blur-overlay';

      const spinner = document.createElement('div');
      spinner.style.border = '4px solid rgba(0, 0, 0, 0.1)';
      spinner.style.borderLeftColor = '#3498db';
      spinner.style.borderRadius = '50%';
      spinner.style.width = '50px';
      spinner.style.height = '50px';
      spinner.style.animation = 'spin 1s linear infinite';

      const style = document.createElement('style');
      style.textContent = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;

      // Adiciona os elementos ao DOM
      overlay.appendChild(spinner);
      document.body.appendChild(overlay);
      document.head.appendChild(style);
    } else {
      // Remove o overlay e o spinner
      const overlay = document.getElementById('loading-blur-overlay');
      if (overlay) {
        overlay.remove();
        const style = document.querySelector('style[data-emotion]');
        if (style){
          style.remove();
        }
      }
    }
  }, []);

  return { useblur };
};

export default useLoadingBlur;