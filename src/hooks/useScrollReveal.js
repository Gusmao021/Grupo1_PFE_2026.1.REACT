import { useEffect } from 'react';

/**
 * Hook global para ativar o efeito de Scroll Reveal
 * @param {string} selector - O seletor dos elementos a animar (padrão: '.reveal')
 * @param {Array} dependencies - Dependências de estados assíncronos (ex: dados de APIs)
 */
export const useScrollReveal = (selector = '.reveal', dependencies = []) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target); // Executa a animação apenas uma vez
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    // Pequeno timeout para garantir que o React já montou o DOM
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => observer.observe(el));
    }, 50);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selector, ...dependencies]);
};