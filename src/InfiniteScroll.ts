import React, { useEffect, useRef, useCallback, ElementType, ComponentProps } from 'react';

type InfiniteScrollOwnProps = {
  children: React.ReactNode;
  element?: ElementType;
  hasMore?: boolean;
  initialLoad?: boolean;
  isReverse?: boolean;
  loader?: React.ReactNode;
  loadMore: (page: number) => void;
  pageStart?: number;
  getScrollParent?: () => HTMLElement | null;
  threshold?: number;
  useCapture?: boolean;
  useWindow?: boolean;
};

type InfiniteScrollProps<T extends ElementType = 'div'> =
  InfiniteScrollOwnProps &
  Omit<ComponentProps<T>, keyof InfiniteScrollOwnProps | 'ref' | 'children'> & {
    element?: T;
  };

const InfiniteScroll = <T extends ElementType = 'div'>(props: InfiniteScrollProps<T>) => {
  const {
    children,
    element: Element = 'div',
    hasMore = false,
    initialLoad = true,
    isReverse = false,
    loader = null,
    loadMore,
    pageStart = 0,
    getScrollParent = null,
    threshold = 250,
    useCapture = false,
    useWindow = true,
    ...rest
  } = props;
  const scrollComponent = useRef<HTMLElement | null>(null);
  const pageLoaded = useRef(pageStart);
  const beforeScrollHeight = useRef(0);
  const beforeScrollTop = useRef(0);
  const loadMoreFlag = useRef(false);

  const getParentElement = useCallback(() => {
    if (getScrollParent) {
      return getScrollParent();
    }
    return scrollComponent.current?.parentElement || null;
  }, [getScrollParent]);

  // Fix: Use 'addEventListener' overload with string type for test event
  const isPassiveSupported = useCallback(() => {
    let passive = false;
    try {
      const options = {
        get passive() {
          passive = true;
          return false;
        },
      };
      window.addEventListener('test', () => { }, options as unknown as boolean);
      window.removeEventListener('test', () => { }, options as unknown as boolean);
    } catch (e) { }
    return passive;
  }, []);

  const eventListenerOptions = useCallback(() => {
    if (isPassiveSupported()) {
      return { useCapture, passive: true };
    } else {
      return { passive: false };
    }
  }, [isPassiveSupported, useCapture]);

  const detachScrollListener = useCallback(() => {
    let scrollEl: any = window;
    if (!useWindow) {
      scrollEl = getParentElement();
    }
    if (!scrollEl) return;
    scrollEl.removeEventListener('scroll', scrollListener, eventListenerOptions());
    scrollEl.removeEventListener('resize', scrollListener, eventListenerOptions());
    scrollEl.removeEventListener('mousewheel', mousewheelListener, eventListenerOptions());
  }, [useWindow, getParentElement, eventListenerOptions]);

  const mousewheelListener = useCallback((e: any) => {
    if (e.deltaY === 1 && !isPassiveSupported()) {
      e.preventDefault();
    }
  }, [isPassiveSupported]);

  function calculateTopPosition(el: any): number {
    if (!el) return 0;
    return el.offsetTop + calculateTopPosition(el.offsetParent);
  }

  function calculateOffset(el: any, scrollTop: number): number {
    if (!el) return 0;
    return calculateTopPosition(el) + (el.offsetHeight - scrollTop - window.innerHeight);
  }

  const scrollListener = useCallback(() => {
    const el = scrollComponent.current;
    const parentNode = getParentElement();
    if (!el || !parentNode) return;
    let offset;
    if (useWindow) {
      const doc = document.documentElement || document.body.parentNode || document.body;
      const scrollTop = window.pageYOffset !== undefined ? window.pageYOffset : doc.scrollTop;
      offset = isReverse ? scrollTop : calculateOffset(el, scrollTop);
    } else if (isReverse) {
      offset = parentNode.scrollTop;
    } else {
      offset = el.scrollHeight - parentNode.scrollTop - parentNode.clientHeight;
    }
    if (
      offset < Number(threshold) &&
      el.offsetParent !== null
    ) {
      detachScrollListener();
      beforeScrollHeight.current = parentNode.scrollHeight;
      beforeScrollTop.current = parentNode.scrollTop;
      if (typeof loadMore === 'function') {
        loadMore(++pageLoaded.current);
        loadMoreFlag.current = true;
      }
    }
  }, [useWindow, isReverse, threshold, detachScrollListener, getParentElement, loadMore]);

  const attachScrollListener = useCallback(() => {
    const parentElement = getParentElement();
    if (!hasMore || !parentElement) return;
    let scrollEl: any = window;
    if (!useWindow) {
      scrollEl = parentElement;
    }
    scrollEl.addEventListener('scroll', scrollListener, eventListenerOptions());
    scrollEl.addEventListener('resize', scrollListener, eventListenerOptions());
    scrollEl.addEventListener('mousewheel', mousewheelListener, eventListenerOptions());
    if (initialLoad) {
      scrollListener();
    }
  }, [hasMore, useWindow, getParentElement, scrollListener, eventListenerOptions, mousewheelListener, initialLoad]);

  useEffect(() => {
    pageLoaded.current = pageStart;
    attachScrollListener();
    return () => {
      detachScrollListener();
    };
    // eslint-disable-next-line
  }, [attachScrollListener, detachScrollListener, pageStart]);

  // Render logic
  const childrenArray = React.Children.toArray(children);
  if (hasMore && loader !== null && loader !== undefined) {
    // Only add loader if it's not null or undefined
    const safeLoader = loader as Exclude<React.ReactNode, null | undefined | boolean>;
    if (isReverse) {
      childrenArray.unshift(safeLoader);
    } else {
      childrenArray.push(safeLoader);
    }
  }

  return React.createElement(
    Element,
    {
      ref: (node: HTMLElement) => {
        scrollComponent.current = node;
      },
      ...rest,
    },
    childrenArray
  );
};


export type { InfiniteScrollProps };
export default InfiniteScroll;