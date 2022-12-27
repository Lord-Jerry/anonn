import { useState, useRef, useEffect } from 'react';

export default (callback: (direction: string) => void) => {
  const ref = useRef<HTMLDivElement>(null);
  const [locked, setLocked] = useState(true);
  const [direction, setDirection] = useState<'up' | 'down' | null>(null);
  const handleScroll = (e: Event) => {
    e.stopPropagation();
    if (!ref.current) return;

    const documentTop = ref.current.getBoundingClientRect().top;
    const documentBottom = ref.current.getBoundingClientRect().bottom;
    const documentHeight = ref.current.getBoundingClientRect().height;

    if (documentBottom > 500 && locked) {
      if (direction === 'down') return;
      setLocked(false);
      setDirection('down');
    }

    if (documentTop > -50 && locked) {
      if (direction === 'up') return;
      setLocked(false);
      setDirection('up');
    }
  };
  useEffect(() => {
    document.addEventListener('scroll', handleScroll);
    return () => document.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (locked === false && direction) {
      callback(direction);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locked, direction]);

  return {
    ref,
  };
};
