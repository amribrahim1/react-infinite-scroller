import React from 'react';
interface InfiniteScrollProps extends React.HTMLProps<HTMLElement> {
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
declare const InfiniteScroll: React.FC<InfiniteScrollProps>;
export { InfiniteScrollProps };
export default InfiniteScroll;
//# sourceMappingURL=InfiniteScroll.d.ts.map