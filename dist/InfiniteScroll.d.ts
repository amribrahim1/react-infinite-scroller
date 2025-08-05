import React, { ElementType, ComponentProps } from 'react';
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
type InfiniteScrollProps<T extends ElementType = 'div'> = InfiniteScrollOwnProps & Omit<ComponentProps<T>, keyof InfiniteScrollOwnProps | 'ref' | 'children'> & {
    element?: T;
};
declare const InfiniteScroll: <T extends ElementType = "div">(props: InfiniteScrollProps<T>) => React.ReactElement<any, string | React.JSXElementConstructor<any>>;
export type { InfiniteScrollProps };
export default InfiniteScroll;
//# sourceMappingURL=InfiniteScroll.d.ts.map