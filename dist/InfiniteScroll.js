"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var InfiniteScroll = function (_a) {
    var children = _a.children, _b = _a.element, element = _b === void 0 ? 'div' : _b, _c = _a.hasMore, hasMore = _c === void 0 ? false : _c, _d = _a.initialLoad, initialLoad = _d === void 0 ? true : _d, _e = _a.isReverse, isReverse = _e === void 0 ? false : _e, _f = _a.loader, loader = _f === void 0 ? null : _f, loadMore = _a.loadMore, _g = _a.pageStart, pageStart = _g === void 0 ? 0 : _g, getScrollParent = _a.getScrollParent, _h = _a.threshold, threshold = _h === void 0 ? 250 : _h, _j = _a.useCapture, useCapture = _j === void 0 ? false : _j, _k = _a.useWindow, useWindow = _k === void 0 ? true : _k, props = __rest(_a, ["children", "element", "hasMore", "initialLoad", "isReverse", "loader", "loadMore", "pageStart", "getScrollParent", "threshold", "useCapture", "useWindow"]);
    var scrollComponent = (0, react_1.useRef)(null);
    var pageLoaded = (0, react_1.useRef)(pageStart);
    var beforeScrollHeight = (0, react_1.useRef)(0);
    var beforeScrollTop = (0, react_1.useRef)(0);
    var loadMoreFlag = (0, react_1.useRef)(false);
    var retryTimer = (0, react_1.useRef)(undefined);
    var getParentElement = (0, react_1.useCallback)(function () {
        var _a;
        if (getScrollParent) {
            return getScrollParent();
        }
        return ((_a = scrollComponent.current) === null || _a === void 0 ? void 0 : _a.parentElement) || null;
    }, [getScrollParent]);
    // Fix: Use 'addEventListener' overload with string type for test event
    var isPassiveSupported = (0, react_1.useCallback)(function () {
        var passive = false;
        try {
            var options = {
                get passive() {
                    passive = true;
                    return false;
                },
            };
            window.addEventListener('test', function () { }, options);
            window.removeEventListener('test', function () { }, options);
        }
        catch (e) { }
        return passive;
    }, []);
    var eventListenerOptions = (0, react_1.useCallback)(function () {
        if (isPassiveSupported()) {
            return { useCapture: useCapture, passive: true };
        }
        else {
            return { passive: false };
        }
    }, [isPassiveSupported, useCapture]);
    var detachScrollListener = (0, react_1.useCallback)(function () {
        if (retryTimer.current) {
            window.clearTimeout(retryTimer.current);
            retryTimer.current = undefined;
        }
        var scrollEl = window;
        if (!useWindow) {
            scrollEl = getParentElement();
        }
        if (!scrollEl)
            return;
        scrollEl.removeEventListener('scroll', scrollListener, eventListenerOptions());
        scrollEl.removeEventListener('resize', scrollListener, eventListenerOptions());
        scrollEl.removeEventListener('mousewheel', mousewheelListener, eventListenerOptions());
    }, [useWindow, isReverse, threshold, eventListenerOptions, getParentElement, loadMore]);
    var mousewheelListener = (0, react_1.useCallback)(function (e) {
        if (e.deltaY === 1 && !isPassiveSupported()) {
            e.preventDefault();
        }
    }, [isPassiveSupported]);
    function calculateTopPosition(el) {
        if (!el)
            return 0;
        return el.offsetTop + calculateTopPosition(el.offsetParent);
    }
    function calculateOffset(el, scrollTop) {
        if (!el)
            return 0;
        return calculateTopPosition(el) + (el.offsetHeight - scrollTop - window.innerHeight);
    }
    var scrollListener = (0, react_1.useCallback)(function () {
        var el = scrollComponent.current;
        var parentNode = getParentElement();
        if (!el || !parentNode)
            return;
        var offset;
        if (useWindow) {
            var doc = document.documentElement || document.body.parentNode || document.body;
            var scrollTop = window.pageYOffset !== undefined ? window.pageYOffset : doc.scrollTop;
            offset = isReverse ? scrollTop : calculateOffset(el, scrollTop);
        }
        else if (isReverse) {
            offset = parentNode.scrollTop;
        }
        else {
            offset = el.scrollHeight - parentNode.scrollTop - parentNode.clientHeight;
        }
        if (offset < Number(threshold) &&
            el.offsetParent !== null) {
            detachScrollListener();
            beforeScrollHeight.current = parentNode.scrollHeight;
            beforeScrollTop.current = parentNode.scrollTop;
            if (typeof loadMore === 'function') {
                loadMore(++pageLoaded.current);
                loadMoreFlag.current = true;
            }
        }
    }, [useWindow, isReverse, threshold, detachScrollListener, getParentElement, loadMore]);
    var attachScrollListener = (0, react_1.useCallback)(function () {
        if (retryTimer.current) {
            window.clearTimeout(retryTimer.current);
            retryTimer.current = undefined;
        }
        var parentElement = getParentElement();
        if (!hasMore)
            return;
        if (!parentElement) {
            retryTimer.current = window.setTimeout(function () {
                attachScrollListener();
            }, 200);
            return;
        }
        var scrollEl = window;
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
    (0, react_1.useEffect)(function () {
        pageLoaded.current = pageStart;
        attachScrollListener();
        return function () {
            detachScrollListener();
        };
        // eslint-disable-next-line
    }, [attachScrollListener, detachScrollListener, pageStart]);
    // Re-attach when data or hasMore changes (after loadMore finishes)
    (0, react_1.useEffect)(function () {
        detachScrollListener();
        attachScrollListener();
        loadMoreFlag.current = false;
        // eslint-disable-next-line
    }, [children, hasMore, attachScrollListener, detachScrollListener]);
    // Render logic
    var childrenArray = react_1.default.Children.toArray(children);
    if (hasMore && loader !== null && loader !== undefined) {
        // Only add loader if it's not null or undefined
        var safeLoader = loader;
        if (isReverse) {
            childrenArray.unshift(safeLoader);
        }
        else {
            childrenArray.push(safeLoader);
        }
    }
    var Element = element || 'div';
    return react_1.default.createElement(Element, __assign({ ref: function (node) {
            scrollComponent.current = node;
        } }, props), childrenArray);
};
exports.default = InfiniteScroll;
