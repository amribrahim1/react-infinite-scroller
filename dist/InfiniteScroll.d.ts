import React from 'react';
interface InfiniteScrollBaseProps {
    children: React.ReactNode;
    element?: React.ElementType;
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
}
export type InfiniteScrollProps<E extends React.ElementType = 'div'> = InfiniteScrollBaseProps & Omit<React.ComponentProps<E>, keyof InfiniteScrollBaseProps> & {
    element?: E;
};
declare const InfiniteScroll: <E extends React.ElementType = "div">({ children, element, hasMore, initialLoad, isReverse, loader, loadMore, pageStart, getScrollParent, threshold, useCapture, useWindow, ...props }: InfiniteScrollProps<E>) => React.ReactElement<any, string | React.JSXElementConstructor<any>>;
export default InfiniteScroll;
//# sourceMappingURL=InfiniteScroll.d.ts.map