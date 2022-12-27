import { inRange } from 'lodash';
import { useState, useRef, useEffect } from 'react';

export default (
  callback: (direction?: string) => void
) => {
  const ref = useRef<HTMLDivElement>(null);

  const [lock, setLock] = useState(false);
  const scrollState = useRef<{
    direction?: 'up' | 'down' ;
    lastUpScrollPosition: number;
    lastDownScrollPosition: number;
  }>({
    direction: undefined,
    lastUpScrollPosition: 0,
    lastDownScrollPosition: 0,
  });

  const handleScroll = (e: Event) => {
    e.stopPropagation();
    if (!ref.current) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const documentHeight = document.documentElement.clientHeight;

    const currentPosition = scrollTop + documentHeight;

    // check if current scroll position is within a calculated range
    // cache last scroll position, so we don't trigger the callback when the user scrolls back and forth
    if (
      inRange(currentPosition, scrollHeight - 50, scrollHeight - 150) &&
      scrollState.current.lastDownScrollPosition < currentPosition
      && !lock
    ) {
      setLock(true);
      scrollState.current = {
        ...scrollState.current,
        direction: 'down',
        lastDownScrollPosition: currentPosition + 350,
      };
    }

    if (scrollTop <= 50) {
      console.log('up', scrollTop, currentPosition);      // if (direction === 'up') return;
      // setLocked(false);
      // setDirection('up');
    }
  };

  useEffect(() => {
    document.addEventListener('scroll', handleScroll);
    return () => document.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      if (!lock) return;
      callback(scrollState.current.direction);
      setLock(false);
    }, 0);

    return () => clearTimeout(id);
  }, [lock]);

  return {
    ref,
  };
};
