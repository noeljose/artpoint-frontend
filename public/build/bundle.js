
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.1' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /*
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const isUndefined = value => typeof value === "undefined";

    const isFunction = value => typeof value === "function";

    const isNumber = value => typeof value === "number";

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
    	return (
    		!event.defaultPrevented &&
    		event.button === 0 &&
    		!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
    	);
    }

    function createCounter() {
    	let i = 0;
    	/**
    	 * Returns an id and increments the internal state
    	 * @returns {number}
    	 */
    	return () => i++;
    }

    /**
     * Create a globally unique id
     *
     * @returns {string} An id
     */
    function createGlobalId() {
    	return Math.random().toString(36).substring(2);
    }

    const isSSR = typeof window === "undefined";

    function addListener(target, type, handler) {
    	target.addEventListener(type, handler);
    	return () => target.removeEventListener(type, handler);
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    /*
     * Adapted from https://github.com/EmilTholin/svelte-routing
     *
     * https://github.com/EmilTholin/svelte-routing/blob/master/LICENSE
     */

    const createKey = ctxName => `@@svnav-ctx__${ctxName}`;

    // Use strings instead of objects, so different versions of
    // svelte-navigator can potentially still work together
    const LOCATION = createKey("LOCATION");
    const ROUTER = createKey("ROUTER");
    const ROUTE = createKey("ROUTE");
    const ROUTE_PARAMS = createKey("ROUTE_PARAMS");
    const FOCUS_ELEM = createKey("FOCUS_ELEM");

    const paramRegex = /^:(.+)/;

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    const startsWith = (string, search) =>
    	string.substr(0, search.length) === search;

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    const isRootSegment = segment => segment === "";

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    const isDynamic = segment => paramRegex.test(segment);

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    const isSplat = segment => segment[0] === "*";

    /**
     * Strip potention splat and splatname of the end of a path
     * @param {string} str
     * @return {string}
     */
    const stripSplat = str => str.replace(/\*.*$/, "");

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    const stripSlashes = str => str.replace(/(^\/+|\/+$)/g, "");

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri, filterFalsy = false) {
    	const segments = stripSlashes(uri).split("/");
    	return filterFalsy ? segments.filter(Boolean) : segments;
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    const addQuery = (pathname, query) =>
    	pathname + (query ? `?${query}` : "");

    /**
     * Normalizes a basepath
     *
     * @param {string} path
     * @returns {string}
     *
     * @example
     * normalizePath("base/path/") // -> "/base/path"
     */
    const normalizePath = path => `/${stripSlashes(path)}`;

    /**
     * Joins and normalizes multiple path fragments
     *
     * @param {...string} pathFragments
     * @returns {string}
     */
    function join(...pathFragments) {
    	const joinFragment = fragment => segmentize(fragment, true).join("/");
    	const joinedSegments = pathFragments.map(joinFragment).join("/");
    	return normalizePath(joinedSegments);
    }

    // We start from 1 here, so we can check if an origin id has been passed
    // by using `originId || <fallback>`
    const LINK_ID = 1;
    const ROUTE_ID = 2;
    const ROUTER_ID = 3;
    const USE_FOCUS_ID = 4;
    const USE_LOCATION_ID = 5;
    const USE_MATCH_ID = 6;
    const USE_NAVIGATE_ID = 7;
    const USE_PARAMS_ID = 8;
    const USE_RESOLVABLE_ID = 9;
    const USE_RESOLVE_ID = 10;
    const NAVIGATE_ID = 11;

    const labels = {
    	[LINK_ID]: "Link",
    	[ROUTE_ID]: "Route",
    	[ROUTER_ID]: "Router",
    	[USE_FOCUS_ID]: "useFocus",
    	[USE_LOCATION_ID]: "useLocation",
    	[USE_MATCH_ID]: "useMatch",
    	[USE_NAVIGATE_ID]: "useNavigate",
    	[USE_PARAMS_ID]: "useParams",
    	[USE_RESOLVABLE_ID]: "useResolvable",
    	[USE_RESOLVE_ID]: "useResolve",
    	[NAVIGATE_ID]: "navigate",
    };

    const createLabel = labelId => labels[labelId];

    function createIdentifier(labelId, props) {
    	let attr;
    	if (labelId === ROUTE_ID) {
    		attr = props.path ? `path="${props.path}"` : "default";
    	} else if (labelId === LINK_ID) {
    		attr = `to="${props.to}"`;
    	} else if (labelId === ROUTER_ID) {
    		attr = `basepath="${props.basepath || ""}"`;
    	}
    	return `<${createLabel(labelId)} ${attr || ""} />`;
    }

    function createMessage(labelId, message, props, originId) {
    	const origin = props && createIdentifier(originId || labelId, props);
    	const originMsg = origin ? `\n\nOccurred in: ${origin}` : "";
    	const label = createLabel(labelId);
    	const msg = isFunction(message) ? message(label) : message;
    	return `<${label}> ${msg}${originMsg}`;
    }

    const createMessageHandler = handler => (...args) =>
    	handler(createMessage(...args));

    const fail = createMessageHandler(message => {
    	throw new Error(message);
    });

    // eslint-disable-next-line no-console
    const warn = createMessageHandler(console.warn);

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
    	const score = route.default
    		? 0
    		: segmentize(route.fullPath).reduce((acc, segment) => {
    				let nextScore = acc;
    				nextScore += SEGMENT_POINTS;

    				if (isRootSegment(segment)) {
    					nextScore += ROOT_POINTS;
    				} else if (isDynamic(segment)) {
    					nextScore += DYNAMIC_POINTS;
    				} else if (isSplat(segment)) {
    					nextScore -= SEGMENT_POINTS + SPLAT_PENALTY;
    				} else {
    					nextScore += STATIC_POINTS;
    				}

    				return nextScore;
    		  }, 0);

    	return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
    	return (
    		routes
    			.map(rankRoute)
    			// If two routes have the exact same score, we go by index instead
    			.sort((a, b) => {
    				if (a.score < b.score) {
    					return 1;
    				}
    				if (a.score > b.score) {
    					return -1;
    				}
    				return a.index - b.index;
    			})
    	);
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { fullPath, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
    	let bestMatch;
    	let defaultMatch;

    	const [uriPathname] = uri.split("?");
    	const uriSegments = segmentize(uriPathname);
    	const isRootUri = uriSegments[0] === "";
    	const ranked = rankRoutes(routes);

    	for (let i = 0, l = ranked.length; i < l; i++) {
    		const { route } = ranked[i];
    		let missed = false;
    		const params = {};

    		// eslint-disable-next-line no-shadow
    		const createMatch = uri => ({ ...route, params, uri });

    		if (route.default) {
    			defaultMatch = createMatch(uri);
    			continue;
    		}

    		const routeSegments = segmentize(route.fullPath);
    		const max = Math.max(uriSegments.length, routeSegments.length);
    		let index = 0;

    		for (; index < max; index++) {
    			const routeSegment = routeSegments[index];
    			const uriSegment = uriSegments[index];

    			if (!isUndefined(routeSegment) && isSplat(routeSegment)) {
    				// Hit a splat, just grab the rest, and return a match
    				// uri:   /files/documents/work
    				// route: /files/* or /files/*splatname
    				const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

    				params[splatName] = uriSegments
    					.slice(index)
    					.map(decodeURIComponent)
    					.join("/");
    				break;
    			}

    			if (isUndefined(uriSegment)) {
    				// URI is shorter than the route, no match
    				// uri:   /users
    				// route: /users/:userId
    				missed = true;
    				break;
    			}

    			const dynamicMatch = paramRegex.exec(routeSegment);

    			if (dynamicMatch && !isRootUri) {
    				const value = decodeURIComponent(uriSegment);
    				params[dynamicMatch[1]] = value;
    			} else if (routeSegment !== uriSegment) {
    				// Current segments don't match, not dynamic, not splat, so no match
    				// uri:   /users/123/settings
    				// route: /users/:id/profile
    				missed = true;
    				break;
    			}
    		}

    		if (!missed) {
    			bestMatch = createMatch(join(...uriSegments.slice(0, index)));
    			break;
    		}
    	}

    	return bestMatch || defaultMatch || null;
    }

    /**
     * Check if the `route.fullPath` matches the `uri`.
     * @param {Object} route
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
    	return pick([route], uri);
    }

    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    function resolve(to, base) {
    	// /foo/bar, /baz/qux => /foo/bar
    	if (startsWith(to, "/")) {
    		return to;
    	}

    	const [toPathname, toQuery] = to.split("?");
    	const [basePathname] = base.split("?");
    	const toSegments = segmentize(toPathname);
    	const baseSegments = segmentize(basePathname);

    	// ?a=b, /users?b=c => /users?a=b
    	if (toSegments[0] === "") {
    		return addQuery(basePathname, toQuery);
    	}

    	// profile, /users/789 => /users/789/profile
    	if (!startsWith(toSegments[0], ".")) {
    		const pathname = baseSegments.concat(toSegments).join("/");
    		return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
    	}

    	// ./       , /users/123 => /users/123
    	// ../      , /users/123 => /users
    	// ../..    , /users/123 => /
    	// ../../one, /a/b/c/d   => /a/b/one
    	// .././one , /a/b/c/d   => /a/b/c/one
    	const allSegments = baseSegments.concat(toSegments);
    	const segments = [];

    	allSegments.forEach(segment => {
    		if (segment === "..") {
    			segments.pop();
    		} else if (segment !== ".") {
    			segments.push(segment);
    		}
    	});

    	return addQuery(`/${segments.join("/")}`, toQuery);
    }

    /**
     * Normalizes a location for consumption by `Route` children and the `Router`.
     * It removes the apps basepath from the pathname
     * and sets default values for `search` and `hash` properties.
     *
     * @param {Object} location The current global location supplied by the history component
     * @param {string} basepath The applications basepath (i.e. when serving from a subdirectory)
     *
     * @returns The normalized location
     */
    function normalizeLocation(location, basepath) {
    	const { pathname, hash = "", search = "", state } = location;
    	const baseSegments = segmentize(basepath, true);
    	const pathSegments = segmentize(pathname, true);
    	while (baseSegments.length) {
    		if (baseSegments[0] !== pathSegments[0]) {
    			fail(
    				ROUTER_ID,
    				`Invalid state: All locations must begin with the basepath "${basepath}", found "${pathname}"`,
    			);
    		}
    		baseSegments.shift();
    		pathSegments.shift();
    	}
    	return {
    		pathname: join(...pathSegments),
    		hash,
    		search,
    		state,
    	};
    }

    const normalizeUrlFragment = frag => (frag.length === 1 ? "" : frag);

    /**
     * Creates a location object from an url.
     * It is used to create a location from the url prop used in SSR
     *
     * @param {string} url The url string (e.g. "/path/to/somewhere")
     *
     * @returns {{ pathname: string; search: string; hash: string }} The location
     */
    function createLocation(url) {
    	const searchIndex = url.indexOf("?");
    	const hashIndex = url.indexOf("#");
    	const hasSearchIndex = searchIndex !== -1;
    	const hasHashIndex = hashIndex !== -1;
    	const hash = hasHashIndex ? normalizeUrlFragment(url.substr(hashIndex)) : "";
    	const pathnameAndSearch = hasHashIndex ? url.substr(0, hashIndex) : url;
    	const search = hasSearchIndex
    		? normalizeUrlFragment(pathnameAndSearch.substr(searchIndex))
    		: "";
    	const pathname = hasSearchIndex
    		? pathnameAndSearch.substr(0, searchIndex)
    		: pathnameAndSearch;
    	return { pathname, search, hash };
    }

    /**
     * Resolves a link relative to the parent Route and the Routers basepath.
     *
     * @param {string} path The given path, that will be resolved
     * @param {string} routeBase The current Routes base path
     * @param {string} appBase The basepath of the app. Used, when serving from a subdirectory
     * @returns {string} The resolved path
     *
     * @example
     * resolveLink("relative", "/routeBase", "/") // -> "/routeBase/relative"
     * resolveLink("/absolute", "/routeBase", "/") // -> "/absolute"
     * resolveLink("relative", "/routeBase", "/base") // -> "/base/routeBase/relative"
     * resolveLink("/absolute", "/routeBase", "/base") // -> "/base/absolute"
     */
    function resolveLink(path, routeBase, appBase) {
    	return join(appBase, resolve(path, routeBase));
    }

    /**
     * Get the uri for a Route, by matching it against the current location.
     *
     * @param {string} routePath The Routes resolved path
     * @param {string} pathname The current locations pathname
     */
    function extractBaseUri(routePath, pathname) {
    	const fullPath = normalizePath(stripSplat(routePath));
    	const baseSegments = segmentize(fullPath, true);
    	const pathSegments = segmentize(pathname, true).slice(0, baseSegments.length);
    	const routeMatch = match({ fullPath }, join(...pathSegments));
    	return routeMatch && routeMatch.uri;
    }

    /*
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const POP = "POP";
    const PUSH = "PUSH";
    const REPLACE = "REPLACE";

    function getLocation(source) {
    	return {
    		...source.location,
    		pathname: encodeURI(decodeURI(source.location.pathname)),
    		state: source.history.state,
    		_key: (source.history.state && source.history.state._key) || "initial",
    	};
    }

    function createHistory(source) {
    	let listeners = [];
    	let location = getLocation(source);
    	let action = POP;

    	const notifyListeners = (listenerFns = listeners) =>
    		listenerFns.forEach(listener => listener({ location, action }));

    	return {
    		get location() {
    			return location;
    		},
    		listen(listener) {
    			listeners.push(listener);

    			const popstateListener = () => {
    				location = getLocation(source);
    				action = POP;
    				notifyListeners([listener]);
    			};

    			// Call listener when it is registered
    			notifyListeners([listener]);

    			const unlisten = addListener(source, "popstate", popstateListener);
    			return () => {
    				unlisten();
    				listeners = listeners.filter(fn => fn !== listener);
    			};
    		},
    		/**
    		 * Navigate to a new absolute route.
    		 *
    		 * @param {string|number} to The path to navigate to.
    		 *
    		 * If `to` is a number we will navigate to the stack entry index + `to`
    		 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
    		 * @param {Object} options
    		 * @param {*} [options.state] The state will be accessible through `location.state`
    		 * @param {boolean} [options.replace=false] Replace the current entry in the history
    		 * stack, instead of pushing on a new one
    		 */
    		navigate(to, options) {
    			const { state = {}, replace = false } = options || {};
    			action = replace ? REPLACE : PUSH;
    			if (isNumber(to)) {
    				if (options) {
    					warn(
    						NAVIGATE_ID,
    						"Navigation options (state or replace) are not supported, " +
    							"when passing a number as the first argument to navigate. " +
    							"They are ignored.",
    					);
    				}
    				action = POP;
    				source.history.go(to);
    			} else {
    				const keyedState = { ...state, _key: createGlobalId() };
    				// try...catch iOS Safari limits to 100 pushState calls
    				try {
    					source.history[replace ? "replaceState" : "pushState"](
    						keyedState,
    						"",
    						to,
    					);
    				} catch (e) {
    					source.location[replace ? "replace" : "assign"](to);
    				}
    			}

    			location = getLocation(source);
    			notifyListeners();
    		},
    	};
    }

    function createStackFrame(state, uri) {
    	return { ...createLocation(uri), state };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
    	let index = 0;
    	let stack = [createStackFrame(null, initialPathname)];

    	return {
    		// This is just for testing...
    		get entries() {
    			return stack;
    		},
    		get location() {
    			return stack[index];
    		},
    		addEventListener() {},
    		removeEventListener() {},
    		history: {
    			get state() {
    				return stack[index].state;
    			},
    			pushState(state, title, uri) {
    				index++;
    				// Throw away anything in the stack with an index greater than the current index.
    				// This happens, when we go back using `go(-n)`. The index is now less than `stack.length`.
    				// If we call `go(+n)` the stack entries with an index greater than the current index can
    				// be reused.
    				// However, if we navigate to a path, instead of a number, we want to create a new branch
    				// of navigation.
    				stack = stack.slice(0, index);
    				stack.push(createStackFrame(state, uri));
    			},
    			replaceState(state, title, uri) {
    				stack[index] = createStackFrame(state, uri);
    			},
    			go(to) {
    				const newIndex = index + to;
    				if (newIndex < 0 || newIndex > stack.length - 1) {
    					return;
    				}
    				index = newIndex;
    			},
    		},
    	};
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = !!(
    	!isSSR &&
    	window.document &&
    	window.document.createElement
    );
    // Use memory history in iframes (for example in Svelte REPL)
    const isEmbeddedPage = !isSSR && window.location.origin === "null";
    const globalHistory = createHistory(
    	canUseDOM && !isEmbeddedPage ? window : createMemorySource(),
    );
    const { navigate } = globalHistory;

    // We need to keep the focus candidate in a separate file, so svelte does
    // not update, when we mutate it.
    // Also, we need a single global reference, because taking focus needs to
    // work globally, even if we have multiple top level routers
    // eslint-disable-next-line import/no-mutable-exports
    let focusCandidate = null;

    // eslint-disable-next-line import/no-mutable-exports
    let initialNavigation = true;

    /**
     * Check if RouterA is above RouterB in the document
     * @param {number} routerIdA The first Routers id
     * @param {number} routerIdB The second Routers id
     */
    function isAbove(routerIdA, routerIdB) {
    	const routerMarkers = document.querySelectorAll("[data-svnav-router]");
    	for (let i = 0; i < routerMarkers.length; i++) {
    		const node = routerMarkers[i];
    		const currentId = Number(node.dataset.svnavRouter);
    		if (currentId === routerIdA) return true;
    		if (currentId === routerIdB) return false;
    	}
    	return false;
    }

    /**
     * Check if a Route candidate is the best choice to move focus to,
     * and store the best match.
     * @param {{
         level: number;
         routerId: number;
         route: {
           id: number;
           focusElement: import("svelte/store").Readable<Promise<Element>|null>;
         }
       }} item A Route candidate, that updated and is visible after a navigation
     */
    function pushFocusCandidate(item) {
    	if (
    		// Best candidate if it's the only candidate...
    		!focusCandidate ||
    		// Route is nested deeper, than previous candidate
    		// -> Route change was triggered in the deepest affected
    		// Route, so that's were focus should move to
    		item.level > focusCandidate.level ||
    		// If the level is identical, we want to focus the first Route in the document,
    		// so we pick the first Router lookin from page top to page bottom.
    		(item.level === focusCandidate.level &&
    			isAbove(item.routerId, focusCandidate.routerId))
    	) {
    		focusCandidate = item;
    	}
    }

    /**
     * Reset the focus candidate.
     */
    function clearFocusCandidate() {
    	focusCandidate = null;
    }

    function initialNavigationOccurred() {
    	initialNavigation = false;
    }

    /*
     * `focus` Adapted from https://github.com/oaf-project/oaf-side-effects/blob/master/src/index.ts
     *
     * https://github.com/oaf-project/oaf-side-effects/blob/master/LICENSE
     */
    function focus(elem) {
    	if (!elem) return false;
    	const TABINDEX = "tabindex";
    	try {
    		if (!elem.hasAttribute(TABINDEX)) {
    			elem.setAttribute(TABINDEX, "-1");
    			let unlisten;
    			// We remove tabindex after blur to avoid weird browser behavior
    			// where a mouse click can activate elements with tabindex="-1".
    			const blurListener = () => {
    				elem.removeAttribute(TABINDEX);
    				unlisten();
    			};
    			unlisten = addListener(elem, "blur", blurListener);
    		}
    		elem.focus();
    		return document.activeElement === elem;
    	} catch (e) {
    		// Apparently trying to focus a disabled element in IE can throw.
    		// See https://stackoverflow.com/a/1600194/2476884
    		return false;
    	}
    }

    function isEndMarker(elem, id) {
    	return Number(elem.dataset.svnavRouteEnd) === id;
    }

    function isHeading(elem) {
    	return /^H[1-6]$/i.test(elem.tagName);
    }

    function query(selector, parent = document) {
    	return parent.querySelector(selector);
    }

    function queryHeading(id) {
    	const marker = query(`[data-svnav-route-start="${id}"]`);
    	let current = marker.nextElementSibling;
    	while (!isEndMarker(current, id)) {
    		if (isHeading(current)) {
    			return current;
    		}
    		const heading = query("h1,h2,h3,h4,h5,h6", current);
    		if (heading) {
    			return heading;
    		}
    		current = current.nextElementSibling;
    	}
    	return null;
    }

    function handleFocus(route) {
    	Promise.resolve(get_store_value(route.focusElement)).then(elem => {
    		const focusElement = elem || queryHeading(route.id);
    		if (!focusElement) {
    			warn(
    				ROUTER_ID,
    				"Could not find an element to focus. " +
    					"You should always render a header for accessibility reasons, " +
    					'or set a custom focus element via the "useFocus" hook. ' +
    					"If you don't want this Route or Router to manage focus, " +
    					'pass "primary={false}" to it.',
    				route,
    				ROUTE_ID,
    			);
    		}
    		const headingFocused = focus(focusElement);
    		if (headingFocused) return;
    		focus(document.documentElement);
    	});
    }

    const createTriggerFocus = (a11yConfig, announcementText, location) => (
    	manageFocus,
    	announceNavigation,
    ) =>
    	// Wait until the dom is updated, so we can look for headings
    	tick().then(() => {
    		if (!focusCandidate || initialNavigation) {
    			initialNavigationOccurred();
    			return;
    		}
    		if (manageFocus) {
    			handleFocus(focusCandidate.route);
    		}
    		if (a11yConfig.announcements && announceNavigation) {
    			const { path, fullPath, meta, params, uri } = focusCandidate.route;
    			const announcementMessage = a11yConfig.createAnnouncement(
    				{ path, fullPath, meta, params, uri },
    				get_store_value(location),
    			);
    			Promise.resolve(announcementMessage).then(message => {
    				announcementText.set(message);
    			});
    		}
    		clearFocusCandidate();
    	});

    const visuallyHiddenStyle =
    	"position:fixed;" +
    	"top:-1px;" +
    	"left:0;" +
    	"width:1px;" +
    	"height:1px;" +
    	"padding:0;" +
    	"overflow:hidden;" +
    	"clip:rect(0,0,0,0);" +
    	"white-space:nowrap;" +
    	"border:0;";

    /* node_modules/svelte-navigator/src/Router.svelte generated by Svelte v3.44.1 */

    const file$C = "node_modules/svelte-navigator/src/Router.svelte";

    // (195:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}
    function create_if_block$f(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*$announcementText*/ ctx[0]);
    			attr_dev(div, "role", "status");
    			attr_dev(div, "aria-atomic", "true");
    			attr_dev(div, "aria-live", "polite");
    			attr_dev(div, "style", visuallyHiddenStyle);
    			add_location(div, file$C, 195, 1, 5906);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$announcementText*/ 1) set_data_dev(t, /*$announcementText*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$f.name,
    		type: "if",
    		source: "(195:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$C(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let if_block_anchor;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], null);
    	let if_block = /*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements && create_if_block$f(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = space();
    			if (default_slot) default_slot.c();
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			set_style(div, "display", "none");
    			attr_dev(div, "aria-hidden", "true");
    			attr_dev(div, "data-svnav-router", /*routerId*/ ctx[3]);
    			add_location(div, file$C, 190, 0, 5750);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t0, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 524288)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[19], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements) if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t0);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$C.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const createId$1 = createCounter();
    const defaultBasepath = "/";

    function instance$C($$self, $$props, $$invalidate) {
    	let $location;
    	let $activeRoute;
    	let $prevLocation;
    	let $routes;
    	let $announcementText;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, ['default']);
    	let { basepath = defaultBasepath } = $$props;
    	let { url = null } = $$props;
    	let { history = globalHistory } = $$props;
    	let { primary = true } = $$props;
    	let { a11y = {} } = $$props;

    	const a11yConfig = {
    		createAnnouncement: route => `Navigated to ${route.uri}`,
    		announcements: true,
    		...a11y
    	};

    	// Remember the initial `basepath`, so we can fire a warning
    	// when the user changes it later
    	const initialBasepath = basepath;

    	const normalizedBasepath = normalizePath(basepath);
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const isTopLevelRouter = !locationContext;
    	const routerId = createId$1();
    	const manageFocus = primary && !(routerContext && !routerContext.manageFocus);
    	const announcementText = writable("");
    	validate_store(announcementText, 'announcementText');
    	component_subscribe($$self, announcementText, value => $$invalidate(0, $announcementText = value));
    	const routes = writable([]);
    	validate_store(routes, 'routes');
    	component_subscribe($$self, routes, value => $$invalidate(18, $routes = value));
    	const activeRoute = writable(null);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(16, $activeRoute = value));

    	// Used in SSR to synchronously set that a Route is active.
    	let hasActiveRoute = false;

    	// Nesting level of router.
    	// We will need this to identify sibling routers, when moving
    	// focus on navigation, so we can focus the first possible router
    	const level = isTopLevelRouter ? 0 : routerContext.level + 1;

    	// If we're running an SSR we force the location to the `url` prop
    	const getInitialLocation = () => normalizeLocation(isSSR ? createLocation(url) : history.location, normalizedBasepath);

    	const location = isTopLevelRouter
    	? writable(getInitialLocation())
    	: locationContext;

    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(15, $location = value));
    	const prevLocation = writable($location);
    	validate_store(prevLocation, 'prevLocation');
    	component_subscribe($$self, prevLocation, value => $$invalidate(17, $prevLocation = value));
    	const triggerFocus = createTriggerFocus(a11yConfig, announcementText, location);
    	const createRouteFilter = routeId => routeList => routeList.filter(routeItem => routeItem.id !== routeId);

    	function registerRoute(route) {
    		if (isSSR) {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				hasActiveRoute = true;

    				// Return the match in SSR mode, so the matched Route can use it immediatly.
    				// Waiting for activeRoute to update does not work, because it updates
    				// after the Route is initialized
    				return matchingRoute; // eslint-disable-line consistent-return
    			}
    		} else {
    			routes.update(prevRoutes => {
    				// Remove an old version of the updated route,
    				// before pushing the new version
    				const nextRoutes = createRouteFilter(route.id)(prevRoutes);

    				nextRoutes.push(route);
    				return nextRoutes;
    			});
    		}
    	}

    	function unregisterRoute(routeId) {
    		routes.update(createRouteFilter(routeId));
    	}

    	if (!isTopLevelRouter && basepath !== defaultBasepath) {
    		warn(ROUTER_ID, 'Only top-level Routers can have a "basepath" prop. It is ignored.', { basepath });
    	}

    	if (isTopLevelRouter) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = history.listen(changedHistory => {
    				const normalizedLocation = normalizeLocation(changedHistory.location, normalizedBasepath);
    				prevLocation.set($location);
    				location.set(normalizedLocation);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		registerRoute,
    		unregisterRoute,
    		manageFocus,
    		level,
    		id: routerId,
    		history: isTopLevelRouter ? history : routerContext.history,
    		basepath: isTopLevelRouter
    		? normalizedBasepath
    		: routerContext.basepath
    	});

    	const writable_props = ['basepath', 'url', 'history', 'primary', 'a11y'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('basepath' in $$props) $$invalidate(10, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(11, url = $$props.url);
    		if ('history' in $$props) $$invalidate(12, history = $$props.history);
    		if ('primary' in $$props) $$invalidate(13, primary = $$props.primary);
    		if ('a11y' in $$props) $$invalidate(14, a11y = $$props.a11y);
    		if ('$$scope' in $$props) $$invalidate(19, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createCounter,
    		createId: createId$1,
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		normalizePath,
    		pick,
    		match,
    		normalizeLocation,
    		createLocation,
    		isSSR,
    		warn,
    		ROUTER_ID,
    		pushFocusCandidate,
    		visuallyHiddenStyle,
    		createTriggerFocus,
    		defaultBasepath,
    		basepath,
    		url,
    		history,
    		primary,
    		a11y,
    		a11yConfig,
    		initialBasepath,
    		normalizedBasepath,
    		locationContext,
    		routerContext,
    		isTopLevelRouter,
    		routerId,
    		manageFocus,
    		announcementText,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		level,
    		getInitialLocation,
    		location,
    		prevLocation,
    		triggerFocus,
    		createRouteFilter,
    		registerRoute,
    		unregisterRoute,
    		$location,
    		$activeRoute,
    		$prevLocation,
    		$routes,
    		$announcementText
    	});

    	$$self.$inject_state = $$props => {
    		if ('basepath' in $$props) $$invalidate(10, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(11, url = $$props.url);
    		if ('history' in $$props) $$invalidate(12, history = $$props.history);
    		if ('primary' in $$props) $$invalidate(13, primary = $$props.primary);
    		if ('a11y' in $$props) $$invalidate(14, a11y = $$props.a11y);
    		if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*basepath*/ 1024) {
    			if (basepath !== initialBasepath) {
    				warn(ROUTER_ID, 'You cannot change the "basepath" prop. It is ignored.');
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$routes, $location*/ 294912) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$location, $prevLocation*/ 163840) {
    			// Manage focus and announce navigation to screen reader users
    			{
    				if (isTopLevelRouter) {
    					const hasHash = !!$location.hash;

    					// When a hash is present in the url, we skip focus management, because
    					// focusing a different element will prevent in-page jumps (See #3)
    					const shouldManageFocus = !hasHash && manageFocus;

    					// We don't want to make an announcement, when the hash changes,
    					// but the active route stays the same
    					const announceNavigation = !hasHash || $location.pathname !== $prevLocation.pathname;

    					triggerFocus(shouldManageFocus, announceNavigation);
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$activeRoute*/ 65536) {
    			// Queue matched Route, so top level Router can decide which Route to focus.
    			// Non primary Routers should just be ignored
    			if (manageFocus && $activeRoute && $activeRoute.primary) {
    				pushFocusCandidate({ level, routerId, route: $activeRoute });
    			}
    		}
    	};

    	return [
    		$announcementText,
    		a11yConfig,
    		isTopLevelRouter,
    		routerId,
    		manageFocus,
    		announcementText,
    		routes,
    		activeRoute,
    		location,
    		prevLocation,
    		basepath,
    		url,
    		history,
    		primary,
    		a11y,
    		$location,
    		$activeRoute,
    		$prevLocation,
    		$routes,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$C,
    			create_fragment$C,
    			safe_not_equal,
    			{
    				basepath: 10,
    				url: 11,
    				history: 12,
    				primary: 13,
    				a11y: 14
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$C.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get history() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set history(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primary() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primary(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get a11y() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set a11y(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Router$1 = Router;

    /**
     * Check if a component or hook have been created outside of a
     * context providing component
     * @param {number} componentId
     * @param {*} props
     * @param {string?} ctxKey
     * @param {number?} ctxProviderId
     */
    function usePreflightCheck(
    	componentId,
    	props,
    	ctxKey = ROUTER,
    	ctxProviderId = ROUTER_ID,
    ) {
    	const ctx = getContext(ctxKey);
    	if (!ctx) {
    		fail(
    			componentId,
    			label =>
    				`You cannot use ${label} outside of a ${createLabel(ctxProviderId)}.`,
    			props,
    		);
    	}
    }

    const toReadonly = ctx => {
    	const { subscribe } = getContext(ctx);
    	return { subscribe };
    };

    /**
     * Access the current location via a readable store.
     * @returns {import("svelte/store").Readable<{
        pathname: string;
        search: string;
        hash: string;
        state: {};
      }>}
     *
     * @example
      ```html
      <script>
        import { useLocation } from "svelte-navigator";

        const location = useLocation();

        $: console.log($location);
        // {
        //   pathname: "/blog",
        //   search: "?id=123",
        //   hash: "#comments",
        //   state: {}
        // }
      </script>
      ```
     */
    function useLocation() {
    	usePreflightCheck(USE_LOCATION_ID);
    	return toReadonly(LOCATION);
    }

    /**
     * @typedef {{
        path: string;
        fullPath: string;
        uri: string;
        params: {};
      }} RouteMatch
     */

    /**
     * @typedef {import("svelte/store").Readable<RouteMatch|null>} RouteMatchStore
     */

    /**
     * Access the history of top level Router.
     */
    function useHistory() {
    	const { history } = getContext(ROUTER);
    	return history;
    }

    /**
     * Access the base of the parent Route.
     */
    function useRouteBase() {
    	const route = getContext(ROUTE);
    	return route ? derived(route, _route => _route.base) : writable("/");
    }

    /**
     * Resolve a given link relative to the current `Route` and the `Router`s `basepath`.
     * It is used under the hood in `Link` and `useNavigate`.
     * You can use it to manually resolve links, when using the `link` or `links` actions.
     *
     * @returns {(path: string) => string}
     *
     * @example
      ```html
      <script>
        import { link, useResolve } from "svelte-navigator";

        const resolve = useResolve();
        // `resolvedLink` will be resolved relative to its parent Route
        // and the Routers `basepath`
        const resolvedLink = resolve("relativePath");
      </script>

      <a href={resolvedLink} use:link>Relative link</a>
      ```
     */
    function useResolve() {
    	usePreflightCheck(USE_RESOLVE_ID);
    	const routeBase = useRouteBase();
    	const { basepath: appBase } = getContext(ROUTER);
    	/**
    	 * Resolves the path relative to the current route and basepath.
    	 *
    	 * @param {string} path The path to resolve
    	 * @returns {string} The resolved path
    	 */
    	const resolve = path => resolveLink(path, get_store_value(routeBase), appBase);
    	return resolve;
    }

    /**
     * A hook, that returns a context-aware version of `navigate`.
     * It will automatically resolve the given link relative to the current Route.
     * It will also resolve a link against the `basepath` of the Router.
     *
     * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router>
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /absolutePath
      </button>
      ```
      *
      * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router basepath="/base">
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /base/route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /base/absolutePath
      </button>
      ```
     */
    function useNavigate() {
    	usePreflightCheck(USE_NAVIGATE_ID);
    	const resolve = useResolve();
    	const { navigate } = useHistory();
    	/**
    	 * Navigate to a new route.
    	 * Resolves the link relative to the current route and basepath.
    	 *
    	 * @param {string|number} to The path to navigate to.
    	 *
    	 * If `to` is a number we will navigate to the stack entry index + `to`
    	 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
    	 * @param {Object} options
    	 * @param {*} [options.state]
    	 * @param {boolean} [options.replace=false]
    	 */
    	const navigateRelative = (to, options) => {
    		// If to is a number, we navigate to the target stack entry via `history.go`.
    		// Otherwise resolve the link
    		const target = isNumber(to) ? to : resolve(to);
    		return navigate(target, options);
    	};
    	return navigateRelative;
    }

    /* node_modules/svelte-navigator/src/Route.svelte generated by Svelte v3.44.1 */
    const file$B = "node_modules/svelte-navigator/src/Route.svelte";

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*$params*/ 16,
    	location: dirty & /*$location*/ 8
    });

    const get_default_slot_context = ctx => ({
    	params: isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4],
    	location: /*$location*/ ctx[3],
    	navigate: /*navigate*/ ctx[10]
    });

    // (97:0) {#if isActive}
    function create_if_block$e(ctx) {
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				primary: /*primary*/ ctx[1],
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const router_changes = {};
    			if (dirty & /*primary*/ 2) router_changes.primary = /*primary*/ ctx[1];

    			if (dirty & /*$$scope, component, $location, $params, $$restProps*/ 264217) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$e.name,
    		type: "if",
    		source: "(97:0) {#if isActive}",
    		ctx
    	});

    	return block;
    }

    // (113:2) {:else}
    function create_else_block$5(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, $params, $location*/ 262168)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(113:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (105:2) {#if component !== null}
    function create_if_block_1$a(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[3] },
    		{ navigate: /*navigate*/ ctx[10] },
    		isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4],
    		/*$$restProps*/ ctx[11]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, navigate, isSSR, get, params, $params, $$restProps*/ 3608)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 8 && { location: /*$location*/ ctx[3] },
    					dirty & /*navigate*/ 1024 && { navigate: /*navigate*/ ctx[10] },
    					dirty & /*isSSR, get, params, $params*/ 528 && get_spread_object(isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4]),
    					dirty & /*$$restProps*/ 2048 && get_spread_object(/*$$restProps*/ ctx[11])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$a.name,
    		type: "if",
    		source: "(105:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    // (98:1) <Router {primary}>
    function create_default_slot$3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$a, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(98:1) <Router {primary}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$B(ctx) {
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let current;
    	let if_block = /*isActive*/ ctx[2] && create_if_block$e(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			div1 = element("div");
    			set_style(div0, "display", "none");
    			attr_dev(div0, "aria-hidden", "true");
    			attr_dev(div0, "data-svnav-route-start", /*id*/ ctx[5]);
    			add_location(div0, file$B, 95, 0, 2622);
    			set_style(div1, "display", "none");
    			attr_dev(div1, "aria-hidden", "true");
    			attr_dev(div1, "data-svnav-route-end", /*id*/ ctx[5]);
    			add_location(div1, file$B, 121, 0, 3295);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isActive*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isActive*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$e(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t1.parentNode, t1);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$B.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const createId = createCounter();

    function instance$B($$self, $$props, $$invalidate) {
    	let isActive;
    	const omit_props_names = ["path","component","meta","primary"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $activeRoute;
    	let $location;
    	let $parentBase;
    	let $params;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Route', slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	let { meta = {} } = $$props;
    	let { primary = true } = $$props;
    	usePreflightCheck(ROUTE_ID, $$props);
    	const id = createId();
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(15, $activeRoute = value));
    	const parentBase = useRouteBase();
    	validate_store(parentBase, 'parentBase');
    	component_subscribe($$self, parentBase, value => $$invalidate(16, $parentBase = value));
    	const location = useLocation();
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(3, $location = value));
    	const focusElement = writable(null);

    	// In SSR we cannot wait for $activeRoute to update,
    	// so we use the match returned from `registerRoute` instead
    	let ssrMatch;

    	const route = writable();
    	const params = writable({});
    	validate_store(params, 'params');
    	component_subscribe($$self, params, value => $$invalidate(4, $params = value));
    	setContext(ROUTE, route);
    	setContext(ROUTE_PARAMS, params);
    	setContext(FOCUS_ELEM, focusElement);

    	// We need to call useNavigate after the route is set,
    	// so we can use the routes path for link resolution
    	const navigate = useNavigate();

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway
    	if (!isSSR) {
    		onDestroy(() => unregisterRoute(id));
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(23, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(11, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('path' in $$new_props) $$invalidate(12, path = $$new_props.path);
    		if ('component' in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ('meta' in $$new_props) $$invalidate(13, meta = $$new_props.meta);
    		if ('primary' in $$new_props) $$invalidate(1, primary = $$new_props.primary);
    		if ('$$scope' in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createCounter,
    		createId,
    		getContext,
    		onDestroy,
    		setContext,
    		writable,
    		get: get_store_value,
    		Router: Router$1,
    		ROUTER,
    		ROUTE,
    		ROUTE_PARAMS,
    		FOCUS_ELEM,
    		useLocation,
    		useNavigate,
    		useRouteBase,
    		usePreflightCheck,
    		isSSR,
    		extractBaseUri,
    		join,
    		ROUTE_ID,
    		path,
    		component,
    		meta,
    		primary,
    		id,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		parentBase,
    		location,
    		focusElement,
    		ssrMatch,
    		route,
    		params,
    		navigate,
    		isActive,
    		$activeRoute,
    		$location,
    		$parentBase,
    		$params
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(23, $$props = assign(assign({}, $$props), $$new_props));
    		if ('path' in $$props) $$invalidate(12, path = $$new_props.path);
    		if ('component' in $$props) $$invalidate(0, component = $$new_props.component);
    		if ('meta' in $$props) $$invalidate(13, meta = $$new_props.meta);
    		if ('primary' in $$props) $$invalidate(1, primary = $$new_props.primary);
    		if ('ssrMatch' in $$props) $$invalidate(14, ssrMatch = $$new_props.ssrMatch);
    		if ('isActive' in $$props) $$invalidate(2, isActive = $$new_props.isActive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*path, $parentBase, meta, $location, primary*/ 77834) {
    			{
    				// The route store will be re-computed whenever props, location or parentBase change
    				const isDefault = path === "";

    				const rawBase = join($parentBase, path);

    				const updatedRoute = {
    					id,
    					path,
    					meta,
    					// If no path prop is given, this Route will act as the default Route
    					// that is rendered if no other Route in the Router is a match
    					default: isDefault,
    					fullPath: isDefault ? "" : rawBase,
    					base: isDefault
    					? $parentBase
    					: extractBaseUri(rawBase, $location.pathname),
    					primary,
    					focusElement
    				};

    				route.set(updatedRoute);

    				// If we're in SSR mode and the Route matches,
    				// `registerRoute` will return the match
    				$$invalidate(14, ssrMatch = registerRoute(updatedRoute));
    			}
    		}

    		if ($$self.$$.dirty & /*ssrMatch, $activeRoute*/ 49152) {
    			$$invalidate(2, isActive = !!(ssrMatch || $activeRoute && $activeRoute.id === id));
    		}

    		if ($$self.$$.dirty & /*isActive, ssrMatch, $activeRoute*/ 49156) {
    			if (isActive) {
    				const { params: activeParams } = ssrMatch || $activeRoute;
    				params.set(activeParams);
    			}
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		primary,
    		isActive,
    		$location,
    		$params,
    		id,
    		activeRoute,
    		parentBase,
    		location,
    		params,
    		navigate,
    		$$restProps,
    		path,
    		meta,
    		ssrMatch,
    		$activeRoute,
    		$parentBase,
    		slots,
    		$$scope
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$B, create_fragment$B, safe_not_equal, {
    			path: 12,
    			component: 0,
    			meta: 13,
    			primary: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$B.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get meta() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set meta(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primary() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primary(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Route$1 = Route;

    /* node_modules/svelte-navigator/src/Link.svelte generated by Svelte v3.44.1 */
    const file$A = "node_modules/svelte-navigator/src/Link.svelte";

    function create_fragment$A(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);
    	let a_levels = [{ href: /*href*/ ctx[0] }, /*ariaCurrent*/ ctx[2], /*props*/ ctx[1]];
    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$A, 63, 0, 1735);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*onClick*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				dirty & /*ariaCurrent*/ 4 && /*ariaCurrent*/ ctx[2],
    				dirty & /*props*/ 2 && /*props*/ ctx[1]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$A.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$A($$self, $$props, $$invalidate) {
    	let href;
    	let isPartiallyCurrent;
    	let isCurrent;
    	let ariaCurrent;
    	let props;
    	const omit_props_names = ["to","replace","state","getProps"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Link', slots, ['default']);
    	let { to } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = null } = $$props;
    	usePreflightCheck(LINK_ID, $$props);
    	const location = useLocation();
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(11, $location = value));
    	const dispatch = createEventDispatcher();
    	const resolve = useResolve();
    	const { navigate } = useHistory();

    	function onClick(event) {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = isCurrent || replace;

    			navigate(href, { state, replace: shouldReplace });
    		}
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(17, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('to' in $$new_props) $$invalidate(5, to = $$new_props.to);
    		if ('replace' in $$new_props) $$invalidate(6, replace = $$new_props.replace);
    		if ('state' in $$new_props) $$invalidate(7, state = $$new_props.state);
    		if ('getProps' in $$new_props) $$invalidate(8, getProps = $$new_props.getProps);
    		if ('$$scope' in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		useLocation,
    		useResolve,
    		useHistory,
    		usePreflightCheck,
    		shouldNavigate,
    		isFunction,
    		startsWith,
    		LINK_ID,
    		to,
    		replace,
    		state,
    		getProps,
    		location,
    		dispatch,
    		resolve,
    		navigate,
    		onClick,
    		href,
    		isCurrent,
    		isPartiallyCurrent,
    		props,
    		ariaCurrent,
    		$location
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), $$new_props));
    		if ('to' in $$props) $$invalidate(5, to = $$new_props.to);
    		if ('replace' in $$props) $$invalidate(6, replace = $$new_props.replace);
    		if ('state' in $$props) $$invalidate(7, state = $$new_props.state);
    		if ('getProps' in $$props) $$invalidate(8, getProps = $$new_props.getProps);
    		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
    		if ('isCurrent' in $$props) $$invalidate(9, isCurrent = $$new_props.isCurrent);
    		if ('isPartiallyCurrent' in $$props) $$invalidate(10, isPartiallyCurrent = $$new_props.isPartiallyCurrent);
    		if ('props' in $$props) $$invalidate(1, props = $$new_props.props);
    		if ('ariaCurrent' in $$props) $$invalidate(2, ariaCurrent = $$new_props.ariaCurrent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $location*/ 2080) {
    			// We need to pass location here to force re-resolution of the link,
    			// when the pathname changes. Otherwise we could end up with stale path params,
    			// when for example an :id changes in the parent Routes path
    			$$invalidate(0, href = resolve(to, $location));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 2049) {
    			$$invalidate(10, isPartiallyCurrent = startsWith($location.pathname, href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 2049) {
    			$$invalidate(9, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 512) {
    			$$invalidate(2, ariaCurrent = isCurrent ? { "aria-current": "page" } : {});
    		}

    		$$invalidate(1, props = (() => {
    			if (isFunction(getProps)) {
    				const dynamicProps = getProps({
    					location: $location,
    					href,
    					isPartiallyCurrent,
    					isCurrent
    				});

    				return { ...$$restProps, ...dynamicProps };
    			}

    			return $$restProps;
    		})());
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		href,
    		props,
    		ariaCurrent,
    		location,
    		onClick,
    		to,
    		replace,
    		state,
    		getProps,
    		isCurrent,
    		isPartiallyCurrent,
    		$location,
    		$$scope,
    		slots
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$A, create_fragment$A, safe_not_equal, { to: 5, replace: 6, state: 7, getProps: 8 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$A.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*to*/ ctx[5] === undefined && !('to' in props)) {
    			console.warn("<Link> was created without expected prop 'to'");
    		}
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getProps() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getProps(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Link$1 = Link;

    const API_URL = 'http://localhost:5000';

    /* src/pages/auth/login.svelte generated by Svelte v3.44.1 */
    const file$z = "src/pages/auth/login.svelte";

    function create_fragment$z(ctx) {
    	let main;
    	let div10;
    	let div9;
    	let div8;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div6;
    	let div2;
    	let p0;
    	let t2;
    	let div1;
    	let label0;
    	let input0;
    	let t3;
    	let t4;
    	let label1;
    	let input1;
    	let t5;
    	let t6;
    	let div3;
    	let p1;
    	let t8;
    	let input2;
    	let t9;
    	let div4;
    	let p2;
    	let t11;
    	let input3;
    	let t12;
    	let p3;
    	let t13;
    	let t14;
    	let div5;
    	let button;
    	let t16;
    	let div7;
    	let a;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div10 = element("div");
    			div9 = element("div");
    			div8 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div6 = element("div");
    			div2 = element("div");
    			p0 = element("p");
    			p0.textContent = "USER TYPE";
    			t2 = space();
    			div1 = element("div");
    			label0 = element("label");
    			input0 = element("input");
    			t3 = text(" SUPER ADMIN");
    			t4 = space();
    			label1 = element("label");
    			input1 = element("input");
    			t5 = text(" MARKETER");
    			t6 = space();
    			div3 = element("div");
    			p1 = element("p");
    			p1.textContent = "USERNAME/E-Mail";
    			t8 = space();
    			input2 = element("input");
    			t9 = space();
    			div4 = element("div");
    			p2 = element("p");
    			p2.textContent = "PASSWORD";
    			t11 = space();
    			input3 = element("input");
    			t12 = space();
    			p3 = element("p");
    			t13 = text(/*errs*/ ctx[1]);
    			t14 = space();
    			div5 = element("div");
    			button = element("button");
    			button.textContent = "LOGIN";
    			t16 = space();
    			div7 = element("div");
    			a = element("a");
    			a.textContent = "Forget Password ?";
    			attr_dev(img, "alt", "logo");
    			if (!src_url_equal(img.src, img_src_value = "/assert/artLogo.PNG")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-yrquif");
    			add_location(img, file$z, 44, 20, 1588);
    			attr_dev(div0, "class", "row loginTitle justify-content-center svelte-yrquif");
    			add_location(div0, file$z, 43, 16, 1516);
    			attr_dev(p0, "class", "inputLabel svelte-yrquif");
    			add_location(p0, file$z, 48, 24, 1777);
    			attr_dev(input0, "type", "radio");
    			attr_dev(input0, "name", "super");
    			attr_dev(input0, "id", "super");
    			attr_dev(input0, "autocomplete", "off");
    			add_location(input0, file$z, 51, 36, 2009);
    			attr_dev(label0, "class", "btn btn-outline-info");
    			add_location(label0, file$z, 50, 32, 1936);
    			attr_dev(input1, "type", "radio");
    			attr_dev(input1, "name", "admin");
    			attr_dev(input1, "id", "admin");
    			attr_dev(input1, "autocomplete", "off");
    			add_location(input1, file$z, 54, 36, 2265);
    			attr_dev(label1, "class", "btn btn-outline-info");
    			add_location(label1, file$z, 53, 32, 2192);
    			attr_dev(div1, "class", "btn-group btn-group-toggle");
    			attr_dev(div1, "data-toggle", "buttons");
    			add_location(div1, file$z, 49, 28, 1841);
    			attr_dev(div2, "class", "form-group text-center");
    			add_location(div2, file$z, 47, 20, 1715);
    			attr_dev(p1, "class", "inputLabel svelte-yrquif");
    			add_location(p1, file$z, 59, 24, 2542);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "class", "form-control loginInput svelte-yrquif");
    			attr_dev(input2, "name", "username");
    			add_location(input2, file$z, 60, 24, 2608);
    			attr_dev(div3, "class", "form-group");
    			add_location(div3, file$z, 58, 20, 2493);
    			attr_dev(p2, "class", "inputLabel svelte-yrquif");
    			add_location(p2, file$z, 63, 24, 2798);
    			attr_dev(input3, "type", "password");
    			attr_dev(input3, "class", "form-control loginInput svelte-yrquif");
    			attr_dev(input3, "name", "password");
    			add_location(input3, file$z, 64, 24, 2857);
    			attr_dev(div4, "class", "form-group");
    			add_location(div4, file$z, 62, 20, 2749);
    			attr_dev(p3, "class", "text-danger text-center");
    			add_location(p3, file$z, 66, 20, 3005);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn svelte-yrquif");
    			add_location(button, file$z, 68, 24, 3136);
    			attr_dev(div5, "class", "col loginButton text-right svelte-yrquif");
    			add_location(div5, file$z, 67, 20, 3071);
    			attr_dev(div6, "class", "loginForm svelte-yrquif");
    			add_location(div6, file$z, 46, 16, 1671);
    			attr_dev(a, "class", "btn svelte-yrquif");
    			attr_dev(a, "href", "/");
    			add_location(a, file$z, 72, 20, 3318);
    			attr_dev(div7, "class", "col forgetLink  svelte-yrquif");
    			add_location(div7, file$z, 71, 16, 3268);
    			attr_dev(div8, "class", "col-lg-6 col-md-6 col-sm-6 loginBox svelte-yrquif");
    			add_location(div8, file$z, 39, 12, 1287);
    			attr_dev(div9, "class", "row justify-content-center align-items-center");
    			add_location(div9, file$z, 38, 8, 1215);
    			attr_dev(div10, "class", "container");
    			add_location(div10, file$z, 37, 4, 1183);
    			attr_dev(main, "class", "body svelte-yrquif");
    			add_location(main, file$z, 36, 0, 1159);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div10);
    			append_dev(div10, div9);
    			append_dev(div9, div8);
    			append_dev(div8, div0);
    			append_dev(div0, img);
    			append_dev(div8, t0);
    			append_dev(div8, div6);
    			append_dev(div6, div2);
    			append_dev(div2, p0);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, label0);
    			append_dev(label0, input0);
    			append_dev(label0, t3);
    			append_dev(div1, t4);
    			append_dev(div1, label1);
    			append_dev(label1, input1);
    			append_dev(label1, t5);
    			append_dev(div6, t6);
    			append_dev(div6, div3);
    			append_dev(div3, p1);
    			append_dev(div3, t8);
    			append_dev(div3, input2);
    			set_input_value(input2, /*input*/ ctx[0].email);
    			append_dev(div6, t9);
    			append_dev(div6, div4);
    			append_dev(div4, p2);
    			append_dev(div4, t11);
    			append_dev(div4, input3);
    			set_input_value(input3, /*input*/ ctx[0].password);
    			append_dev(div6, t12);
    			append_dev(div6, p3);
    			append_dev(p3, t13);
    			append_dev(div6, t14);
    			append_dev(div6, div5);
    			append_dev(div5, button);
    			append_dev(div8, t16);
    			append_dev(div8, div7);
    			append_dev(div7, a);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						input0,
    						"blur",
    						function () {
    							if (is_function(/*input*/ ctx[0].type = "superAdmin")) (/*input*/ ctx[0].type = "superAdmin").apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						input1,
    						"blur",
    						function () {
    							if (is_function(/*input*/ ctx[0].type = "marketer")) (/*input*/ ctx[0].type = "marketer").apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[3]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[4]),
    					listen_dev(button, "click", /*login*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*input*/ 1 && input2.value !== /*input*/ ctx[0].email) {
    				set_input_value(input2, /*input*/ ctx[0].email);
    			}

    			if (dirty & /*input*/ 1 && input3.value !== /*input*/ ctx[0].password) {
    				set_input_value(input3, /*input*/ ctx[0].password);
    			}

    			if (dirty & /*errs*/ 2) set_data_dev(t13, /*errs*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$z.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$z($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Login', slots, []);

    	let input = {
    		email: "",
    		password: "",
    		type: "",
    		token: ""
    	};

    	let errs = '';

    	const login = async () => {
    		if (input.type == "") {
    			$$invalidate(1, errs = "Select Admin Type");
    		} else if (input.type == "superAdmin") {
    			$$invalidate(1, errs = "");

    			if (input.email === 'admin' && input.password === '123') {
    				localStorage.setItem("admin_details", JSON.stringify(input));
    				navigate('/admin');
    			} else {
    				$$invalidate(1, errs = 'Wrong Credentials');
    			}
    		} else if (input.type == "marketer") {
    			$$invalidate(1, errs = "");

    			const res = await fetch(`${API_URL}/marketeer/login`, {
    				method: 'post',
    				body: JSON.stringify(input),
    				headers: { 'Content-Type': 'application/json' }
    			});

    			const json = await res.json();

    			if (json.status === true) {
    				localStorage.setItem("admin_details", JSON.stringify(json.data));
    				navigate('/marketer');
    			} else {
    				$$invalidate(1, errs = 'Wrong Credentials');
    			}
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Login> was created with unknown prop '${key}'`);
    	});

    	function input2_input_handler() {
    		input.email = this.value;
    		$$invalidate(0, input);
    	}

    	function input3_input_handler() {
    		input.password = this.value;
    		$$invalidate(0, input);
    	}

    	$$self.$capture_state = () => ({ navigate, API_URL, input, errs, login });

    	$$self.$inject_state = $$props => {
    		if ('input' in $$props) $$invalidate(0, input = $$props.input);
    		if ('errs' in $$props) $$invalidate(1, errs = $$props.errs);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [input, errs, login, input2_input_handler, input3_input_handler];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$z, create_fragment$z, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$z.name
    		});
    	}
    }

    /* src/component/adminNav.svelte generated by Svelte v3.44.1 */
    const file$y = "src/component/adminNav.svelte";

    function create_fragment$y(ctx) {
    	let main;
    	let nav;
    	let a0;
    	let img;
    	let img_src_value;
    	let t0;
    	let button0;
    	let span;
    	let t1;
    	let div3;
    	let li0;
    	let div0;
    	let t3;
    	let div2;
    	let a1;
    	let i0;
    	let t4;
    	let t5;
    	let a2;
    	let i1;
    	let t6;
    	let t7;
    	let a3;
    	let i2;
    	let t8;
    	let t9;
    	let a4;
    	let i3;
    	let t10;
    	let t11;
    	let div1;
    	let t12;
    	let li1;
    	let button1;
    	let i4;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			main = element("main");
    			nav = element("nav");
    			a0 = element("a");
    			img = element("img");
    			t0 = space();
    			button0 = element("button");
    			span = element("span");
    			t1 = space();
    			div3 = element("div");
    			li0 = element("li");
    			div0 = element("div");
    			div0.textContent = "Profile";
    			t3 = space();
    			div2 = element("div");
    			a1 = element("a");
    			i0 = element("i");
    			t4 = text("Orders");
    			t5 = space();
    			a2 = element("a");
    			i1 = element("i");
    			t6 = text("Product");
    			t7 = space();
    			a3 = element("a");
    			i2 = element("i");
    			t8 = text("Marketers");
    			t9 = space();
    			a4 = element("a");
    			i3 = element("i");
    			t10 = text("Client");
    			t11 = space();
    			div1 = element("div");
    			t12 = space();
    			li1 = element("li");
    			button1 = element("button");
    			i4 = element("i");
    			attr_dev(img, "alt", "logo");
    			if (!src_url_equal(img.src, img_src_value = "/assert/artLogo.PNG")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-1rg4p9j");
    			add_location(img, file$y, 10, 43, 305);
    			attr_dev(a0, "class", "navbar-brand svelte-1rg4p9j");
    			attr_dev(a0, "href", "/");
    			add_location(a0, file$y, 10, 10, 272);
    			attr_dev(span, "class", "navbar-toggler-icon");
    			add_location(span, file$y, 12, 12, 568);
    			attr_dev(button0, "class", "navbar-toggler");
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "data-toggle", "collapse");
    			attr_dev(button0, "data-target", "#navbarTogglerDemo01");
    			attr_dev(button0, "aria-controls", "navbarTogglerDemo01");
    			attr_dev(button0, "aria-expanded", "false");
    			attr_dev(button0, "aria-label", "Toggle navigation");
    			add_location(button0, file$y, 11, 10, 363);
    			attr_dev(div0, "class", "btn nav-item dropdown-toggle svelte-1rg4p9j");
    			attr_dev(div0, "type", "button");
    			attr_dev(div0, "id", "dropdownMenuButton");
    			attr_dev(div0, "data-toggle", "dropdown");
    			attr_dev(div0, "aria-haspopup", "true");
    			attr_dev(div0, "aria-expanded", "false");
    			add_location(div0, file$y, 16, 16, 768);
    			attr_dev(i0, "class", "fa fa-desktop m-2 text-info");
    			add_location(i0, file$y, 19, 59, 1089);
    			attr_dev(a1, "class", "dropdown-item svelte-1rg4p9j");
    			attr_dev(a1, "href", "/admin");
    			add_location(a1, file$y, 19, 20, 1050);
    			attr_dev(i1, "class", "fa fa-cubes m-2 text-info");
    			add_location(i1, file$y, 20, 71, 1214);
    			attr_dev(a2, "class", "dropdown-item svelte-1rg4p9j");
    			attr_dev(a2, "href", "/admin/produt_view");
    			add_location(a2, file$y, 20, 20, 1163);
    			attr_dev(i2, "class", "fa fa-users m-2 text-info");
    			add_location(i2, file$y, 21, 71, 1338);
    			attr_dev(a3, "class", "dropdown-item svelte-1rg4p9j");
    			attr_dev(a3, "href", "/admin/client_view");
    			add_location(a3, file$y, 21, 20, 1287);
    			attr_dev(i3, "class", "fa fa-users m-2 text-info");
    			add_location(i3, file$y, 22, 69, 1462);
    			attr_dev(a4, "class", "dropdown-item svelte-1rg4p9j");
    			attr_dev(a4, "href", "/admin/user_view");
    			add_location(a4, file$y, 22, 20, 1413);
    			attr_dev(div1, "class", "dropdown-divider text-primary");
    			add_location(div1, file$y, 23, 20, 1534);
    			attr_dev(div2, "class", "dropdown-menu svelte-1rg4p9j");
    			attr_dev(div2, "aria-labelledby", "dropdownMenuButton");
    			add_location(div2, file$y, 18, 18, 965);
    			attr_dev(li0, "class", "nav dropdown ml-auto svelte-1rg4p9j");
    			add_location(li0, file$y, 15, 14, 718);
    			attr_dev(i4, "class", "text-danger fa fa-sign-out fa-lg");
    			add_location(i4, file$y, 29, 71, 1877);
    			attr_dev(button1, "class", "nav-link btn svelte-1rg4p9j");
    			add_location(button1, file$y, 29, 18, 1824);
    			attr_dev(li1, "class", "nav nav-item ml-4 svelte-1rg4p9j");
    			add_location(li1, file$y, 28, 14, 1775);
    			attr_dev(div3, "class", "collapse navbar-collapse");
    			attr_dev(div3, "id", "navbarTogglerDemo01");
    			add_location(div3, file$y, 14, 10, 640);
    			attr_dev(nav, "class", "navbar navbar-expand-lg navbar-light bg-light  svelte-1rg4p9j");
    			add_location(nav, file$y, 9, 6, 201);
    			attr_dev(main, "class", "body svelte-1rg4p9j");
    			add_location(main, file$y, 8, 2, 175);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, nav);
    			append_dev(nav, a0);
    			append_dev(a0, img);
    			append_dev(nav, t0);
    			append_dev(nav, button0);
    			append_dev(button0, span);
    			append_dev(nav, t1);
    			append_dev(nav, div3);
    			append_dev(div3, li0);
    			append_dev(li0, div0);
    			append_dev(li0, t3);
    			append_dev(li0, div2);
    			append_dev(div2, a1);
    			append_dev(a1, i0);
    			append_dev(a1, t4);
    			append_dev(div2, t5);
    			append_dev(div2, a2);
    			append_dev(a2, i1);
    			append_dev(a2, t6);
    			append_dev(div2, t7);
    			append_dev(div2, a3);
    			append_dev(a3, i2);
    			append_dev(a3, t8);
    			append_dev(div2, t9);
    			append_dev(div2, a4);
    			append_dev(a4, i3);
    			append_dev(a4, t10);
    			append_dev(div2, t11);
    			append_dev(div2, div1);
    			append_dev(div3, t12);
    			append_dev(div3, li1);
    			append_dev(li1, button1);
    			append_dev(button1, i4);

    			if (!mounted) {
    				dispose = listen_dev(button1, "click", /*logouthandle*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$y.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$y($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AdminNav', slots, []);

    	function logouthandle() {
    		localStorage.removeItem('admin_details');
    		navigate('/');
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AdminNav> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ navigate, logouthandle });
    	return [logouthandle];
    }

    class AdminNav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$y, create_fragment$y, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AdminNav",
    			options,
    			id: create_fragment$y.name
    		});
    	}
    }

    const productValid = (values)=>{
        if(!values.title){
            return {error:"*Enter the Product Name.", valid:false}
        }
        if(!values.category){
            return {error:"*Enter the Product Category.", valid:false}
        }
        if(!values.subCategory){
            return {error:"*Enter the Product Sub Category.", valid:false}
        }
        if(!values.image){
            return {error:"*Upload Product Image.", valid:false}
        }
        return {error:"All are valid -- Saving...", valid:true}
    };

    const marketerValid = (values)=>{
        if(!values.name){
            return {error:"*Enter the Marketer Name.", valid:false}
        }
        if(!values.email){
            return {error:"*Enter the E-mail.", valid:false}
        }
        if(!values.phone){
            return {error:"*Enter the Phone Number.", valid:false}
        }
        if(!values.password){
            return {error:"*Enter a password.", valid:false}
        }
        return {error:"All are valid -- Saving...", valid:true}
    };

    const distributerValid=(values)=>{
        if(!values.name){
            return {error:"*Enter the Marketer Name.", valid:false}
        }
        if(!values.phone){
            return {error:"*Enter the Phone Number.", valid:false}
        }
        if(!values.email){
            return {error:"*Enter the E-mail.", valid:false}
        }
        if(!values.password){
            return {error:"*Enter a password.", valid:false}
        }
        if(!values.basePrice){
            return {error:"*Enter the Base Price.", valid:false}
        }
        if(!values.deliveryPrice){
            return {error:"*Enter a Delivery Price.", valid:false}
        }
        return {error:"All are valid -- Saving...", valid:true}
    };

    /* src/pages/superAdmin/product/productAdd.svelte generated by Svelte v3.44.1 */
    const file$x = "src/pages/superAdmin/product/productAdd.svelte";

    function get_each_context$p(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	return child_ctx;
    }

    // (119:36) {#each categories as item}
    function create_each_block_1$5(ctx) {
    	let option;
    	let t_value = /*item*/ ctx[19].category + "";
    	let t;
    	let option_key_value;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			attr_dev(option, "key", option_key_value = /*item*/ ctx[19]._id);
    			option.__value = option_value_value = /*item*/ ctx[19].category;
    			option.value = option.__value;
    			add_location(option, file$x, 119, 40, 3559);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*categories*/ 2 && t_value !== (t_value = /*item*/ ctx[19].category + "")) set_data_dev(t, t_value);

    			if (dirty & /*categories*/ 2 && option_key_value !== (option_key_value = /*item*/ ctx[19]._id)) {
    				attr_dev(option, "key", option_key_value);
    			}

    			if (dirty & /*categories*/ 2 && option_value_value !== (option_value_value = /*item*/ ctx[19].category)) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$5.name,
    		type: "each",
    		source: "(119:36) {#each categories as item}",
    		ctx
    	});

    	return block;
    }

    // (127:36) {#each sCate as item}
    function create_each_block$p(ctx) {
    	let option;
    	let t_value = /*item*/ ctx[19] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*item*/ ctx[19];
    			option.value = option.__value;
    			add_location(option, file$x, 127, 40, 4081);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*sCate*/ 4 && t_value !== (t_value = /*item*/ ctx[19] + "")) set_data_dev(t, t_value);

    			if (dirty & /*sCate*/ 4 && option_value_value !== (option_value_value = /*item*/ ctx[19])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$p.name,
    		type: "each",
    		source: "(127:36) {#each sCate as item}",
    		ctx
    	});

    	return block;
    }

    // (145:32) {#if imageShow}
    function create_if_block$d(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*imageShow*/ ctx[5])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "pic");
    			attr_dev(img, "class", "img img-responsive p-1 m-1 svelte-4mbj4m");
    			add_location(img, file$x, 145, 32, 5022);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*imageShow*/ 32 && !src_url_equal(img.src, img_src_value = /*imageShow*/ ctx[5])) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$d.name,
    		type: "if",
    		source: "(145:32) {#if imageShow}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$x(ctx) {
    	let main;
    	let div13;
    	let div12;
    	let h4;
    	let t1;
    	let form;
    	let div3;
    	let input0;
    	let t2;
    	let div2;
    	let div0;
    	let select0;
    	let option0;
    	let t4;
    	let div1;
    	let select1;
    	let option1;
    	let t6;
    	let div6;
    	let div5;
    	let div4;
    	let t7;
    	let div9;
    	let div8;
    	let div7;
    	let i0;
    	let t8;
    	let t9;
    	let input1;
    	let t10;
    	let button0;
    	let i1;
    	let t11;
    	let t12;
    	let div10;
    	let p;
    	let b;
    	let t13_value = /*message*/ ctx[3].msg + "";
    	let t13;
    	let p_class_value;
    	let t14;
    	let div11;
    	let button1;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*categories*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$5(get_each_context_1$5(ctx, each_value_1, i));
    	}

    	let each_value = /*sCate*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$p(get_each_context$p(ctx, each_value, i));
    	}

    	let if_block = /*imageShow*/ ctx[5] && create_if_block$d(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div13 = element("div");
    			div12 = element("div");
    			h4 = element("h4");
    			h4.textContent = "Add New Product";
    			t1 = space();
    			form = element("form");
    			div3 = element("div");
    			input0 = element("input");
    			t2 = space();
    			div2 = element("div");
    			div0 = element("div");
    			select0 = element("select");
    			option0 = element("option");
    			option0.textContent = "Category.. ";

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t4 = space();
    			div1 = element("div");
    			select1 = element("select");
    			option1 = element("option");
    			option1.textContent = "Sub Category.. ";

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t6 = space();
    			div6 = element("div");
    			div5 = element("div");
    			div4 = element("div");
    			if (if_block) if_block.c();
    			t7 = space();
    			div9 = element("div");
    			div8 = element("div");
    			div7 = element("div");
    			i0 = element("i");
    			t8 = text(" Pick Image");
    			t9 = space();
    			input1 = element("input");
    			t10 = space();
    			button0 = element("button");
    			i1 = element("i");
    			t11 = text(" Upload");
    			t12 = space();
    			div10 = element("div");
    			p = element("p");
    			b = element("b");
    			t13 = text(t13_value);
    			t14 = space();
    			div11 = element("div");
    			button1 = element("button");
    			button1.textContent = "Add Product";
    			attr_dev(h4, "class", "heading text-center  svelte-4mbj4m");
    			add_location(h4, file$x, 105, 16, 2599);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "form-control form-input svelte-4mbj4m");
    			attr_dev(input0, "placeholder", "Product Name");
    			add_location(input0, file$x, 108, 24, 2758);
    			option0.__value = "";
    			option0.value = option0.__value;
    			add_location(option0, file$x, 117, 36, 3418);
    			attr_dev(select0, "class", "form-control form-select svelte-4mbj4m");
    			if (/*inputs*/ ctx[4].category === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[12].call(select0));
    			add_location(select0, file$x, 116, 32, 3280);
    			attr_dev(div0, "class", "col-sm");
    			add_location(div0, file$x, 115, 28, 3227);
    			option1.__value = "";
    			option1.value = option1.__value;
    			add_location(option1, file$x, 125, 36, 3941);
    			attr_dev(select1, "class", "form-control form-select svelte-4mbj4m");
    			if (/*inputs*/ ctx[4].subCategory === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[13].call(select1));
    			add_location(select1, file$x, 124, 32, 3831);
    			attr_dev(div1, "class", "col-sm");
    			add_location(div1, file$x, 123, 28, 3778);
    			attr_dev(div2, "class", "row");
    			add_location(div2, file$x, 114, 24, 3181);
    			attr_dev(div3, "class", "");
    			add_location(div3, file$x, 107, 20, 2719);
    			attr_dev(div4, "class", "p-2");
    			add_location(div4, file$x, 143, 28, 4924);
    			attr_dev(div5, "class", "col-sm-6");
    			add_location(div5, file$x, 142, 24, 4873);
    			attr_dev(div6, "class", "row upload svelte-4mbj4m");
    			add_location(div6, file$x, 141, 20, 4824);
    			attr_dev(i0, "class", "fa fa-picture-o fa-lg");
    			add_location(i0, file$x, 152, 87, 5409);
    			attr_dev(div7, "class", "uploadBtn svelte-4mbj4m");
    			add_location(div7, file$x, 152, 28, 5350);
    			set_style(input1, "display", "none");
    			attr_dev(input1, "type", "file");
    			add_location(input1, file$x, 153, 28, 5492);
    			attr_dev(i1, "class", "fa fa-upload fa-lg");
    			add_location(i1, file$x, 154, 73, 5660);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "svelte-4mbj4m");
    			add_location(button0, file$x, 154, 28, 5615);
    			attr_dev(div8, "class", "col-sm-6 d-flex");
    			add_location(div8, file$x, 151, 24, 5292);
    			attr_dev(div9, "class", "row upload svelte-4mbj4m");
    			add_location(div9, file$x, 150, 20, 5243);
    			add_location(b, file$x, 158, 51, 5888);
    			attr_dev(p, "class", p_class_value = "" + (null_to_empty(/*message*/ ctx[3].style) + " svelte-4mbj4m"));
    			add_location(p, file$x, 158, 24, 5861);
    			attr_dev(div10, "class", "row m-auto justify-content-center");
    			add_location(div10, file$x, 157, 20, 5789);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "btn btn-create svelte-4mbj4m");
    			add_location(button1, file$x, 161, 24, 6029);
    			attr_dev(div11, "class", "row m-auto justify-content-end");
    			add_location(div11, file$x, 160, 20, 5960);
    			attr_dev(form, "class", "p-3 border-top");
    			add_location(form, file$x, 106, 16, 2669);
    			attr_dev(div12, "class", "container ml-2 p-2 border");
    			add_location(div12, file$x, 104, 12, 2543);
    			attr_dev(div13, "class", "row justify-content-center");
    			add_location(div13, file$x, 103, 4, 2489);
    			add_location(main, file$x, 102, 0, 2478);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div13);
    			append_dev(div13, div12);
    			append_dev(div12, h4);
    			append_dev(div12, t1);
    			append_dev(div12, form);
    			append_dev(form, div3);
    			append_dev(div3, input0);
    			set_input_value(input0, /*inputs*/ ctx[4].title);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, select0);
    			append_dev(select0, option0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(select0, null);
    			}

    			select_option(select0, /*inputs*/ ctx[4].category);
    			append_dev(div2, t4);
    			append_dev(div2, div1);
    			append_dev(div1, select1);
    			append_dev(select1, option1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select1, null);
    			}

    			select_option(select1, /*inputs*/ ctx[4].subCategory);
    			append_dev(form, t6);
    			append_dev(form, div6);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			if (if_block) if_block.m(div4, null);
    			append_dev(form, t7);
    			append_dev(form, div9);
    			append_dev(div9, div8);
    			append_dev(div8, div7);
    			append_dev(div7, i0);
    			append_dev(div7, t8);
    			append_dev(div8, t9);
    			append_dev(div8, input1);
    			/*input1_binding*/ ctx[16](input1);
    			append_dev(div8, t10);
    			append_dev(div8, button0);
    			append_dev(button0, i1);
    			append_dev(button0, t11);
    			append_dev(form, t12);
    			append_dev(form, div10);
    			append_dev(div10, p);
    			append_dev(p, b);
    			append_dev(b, t13);
    			append_dev(form, t14);
    			append_dev(form, div11);
    			append_dev(div11, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[10]),
    					listen_dev(select0, "change", /*change_handler*/ ctx[11], false, false, false),
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[12]),
    					listen_dev(select1, "change", /*select1_change_handler*/ ctx[13]),
    					listen_dev(div7, "click", /*click_handler*/ ctx[14], false, false, false),
    					listen_dev(input1, "change", /*change_handler_1*/ ctx[15], false, false, false),
    					listen_dev(button0, "click", /*imageUpload*/ ctx[7], false, false, false),
    					listen_dev(button1, "click", /*addProduct*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*inputs, categories*/ 18 && input0.value !== /*inputs*/ ctx[4].title) {
    				set_input_value(input0, /*inputs*/ ctx[4].title);
    			}

    			if (dirty & /*categories*/ 2) {
    				each_value_1 = /*categories*/ ctx[1];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$5(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$5(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(select0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*inputs, categories*/ 18) {
    				select_option(select0, /*inputs*/ ctx[4].category);
    			}

    			if (dirty & /*sCate*/ 4) {
    				each_value = /*sCate*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$p(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$p(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*inputs, categories*/ 18) {
    				select_option(select1, /*inputs*/ ctx[4].subCategory);
    			}

    			if (/*imageShow*/ ctx[5]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$d(ctx);
    					if_block.c();
    					if_block.m(div4, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*message*/ 8 && t13_value !== (t13_value = /*message*/ ctx[3].msg + "")) set_data_dev(t13, t13_value);

    			if (dirty & /*message*/ 8 && p_class_value !== (p_class_value = "" + (null_to_empty(/*message*/ ctx[3].style) + " svelte-4mbj4m"))) {
    				attr_dev(p, "class", p_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    			/*input1_binding*/ ctx[16](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$x.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$x($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ProductAdd', slots, []);
    	let fileinput;
    	let categories = [];
    	let sCate = [];
    	let selectedCate;
    	let message = { msg: "", style: "" };

    	let inputs = {
    		title: "",
    		category: "",
    		subCategory: "",
    		image: ""
    	};

    	let imageShow = null;
    	let imageData;

    	onMount(async () => {
    		await fetch(`${API_URL}/products/category/list`, { method: 'POST' }).then(response => response.json()).then(datas => {
    			$$invalidate(1, categories = datas.data);
    		});
    	});

    	const cateChange = e => {
    		selectedCate = e.target.value;

    		if (selectedCate == "" || selectedCate == "undefined") {
    			$$invalidate(2, sCate = []);
    		} else {
    			let cate = categories.find(tmp => tmp.category === selectedCate);
    			$$invalidate(2, sCate = cate.subCategory);
    		}
    	};

    	const imageUpload = async () => {
    		const formData = new FormData();
    		formData.append("productimage", imageData);

    		try {
    			const res = await fetch(`${API_URL}/products/uploadimage`, {
    				method: "POST",
    				body: formData,
    				headers: { 'Accept': 'application/json' }
    			});

    			const json = await res.json();
    			$$invalidate(3, message.style = 'text-info', message);
    			$$invalidate(3, message.msg = json.message, message);

    			if (json.status === true) {
    				$$invalidate(4, inputs.image = json.data, inputs);
    			}
    		} catch(error) {
    			
    		}
    	};

    	const imageChange = event => {
    		let image = event.target.files[0];
    		imageData = image;
    		let reader = new FileReader();
    		reader.readAsDataURL(image);

    		reader.onload = e => {
    			$$invalidate(5, imageShow = e.target.result);
    		};
    	};

    	const addProduct = async () => {
    		let validate = productValid(inputs);

    		if (validate.valid == true) {
    			$$invalidate(3, message.style = 'text-info', message);
    			$$invalidate(3, message.msg = validate.error, message);

    			try {
    				$$invalidate(3, message.msg = "Loading..", message);

    				const res = await fetch(`${API_URL}/products/create`, {
    					method: 'post',
    					body: JSON.stringify(inputs),
    					headers: { 'Content-Type': 'application/json' }
    				});

    				const json = await res.json();
    				$$invalidate(3, message.style = 'text-info', message);
    				$$invalidate(3, message.msg = json.message, message);

    				if (json.status === true) {
    					$$invalidate(4, inputs.image = "", inputs);
    				}
    			} catch(error) {
    				$$invalidate(3, message.style = 'text-warning', message);
    				$$invalidate(3, message.msg = "Network error !!", message);
    			}
    		} else {
    			$$invalidate(3, message.style = 'text-danger', message);
    			$$invalidate(3, message.msg = validate.error, message);
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ProductAdd> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		inputs.title = this.value;
    		$$invalidate(4, inputs);
    		$$invalidate(1, categories);
    	}

    	const change_handler = e => cateChange(e);

    	function select0_change_handler() {
    		inputs.category = select_value(this);
    		$$invalidate(4, inputs);
    		$$invalidate(1, categories);
    	}

    	function select1_change_handler() {
    		inputs.subCategory = select_value(this);
    		$$invalidate(4, inputs);
    		$$invalidate(1, categories);
    	}

    	const click_handler = () => {
    		fileinput.click();
    	};

    	const change_handler_1 = e => imageChange(e);

    	function input1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			fileinput = $$value;
    			$$invalidate(0, fileinput);
    		});
    	}

    	$$self.$capture_state = () => ({
    		API_URL,
    		productValid,
    		onMount,
    		fileinput,
    		categories,
    		sCate,
    		selectedCate,
    		message,
    		inputs,
    		imageShow,
    		imageData,
    		cateChange,
    		imageUpload,
    		imageChange,
    		addProduct
    	});

    	$$self.$inject_state = $$props => {
    		if ('fileinput' in $$props) $$invalidate(0, fileinput = $$props.fileinput);
    		if ('categories' in $$props) $$invalidate(1, categories = $$props.categories);
    		if ('sCate' in $$props) $$invalidate(2, sCate = $$props.sCate);
    		if ('selectedCate' in $$props) selectedCate = $$props.selectedCate;
    		if ('message' in $$props) $$invalidate(3, message = $$props.message);
    		if ('inputs' in $$props) $$invalidate(4, inputs = $$props.inputs);
    		if ('imageShow' in $$props) $$invalidate(5, imageShow = $$props.imageShow);
    		if ('imageData' in $$props) imageData = $$props.imageData;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		fileinput,
    		categories,
    		sCate,
    		message,
    		inputs,
    		imageShow,
    		cateChange,
    		imageUpload,
    		imageChange,
    		addProduct,
    		input0_input_handler,
    		change_handler,
    		select0_change_handler,
    		select1_change_handler,
    		click_handler,
    		change_handler_1,
    		input1_binding
    	];
    }

    class ProductAdd extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$x, create_fragment$x, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProductAdd",
    			options,
    			id: create_fragment$x.name
    		});
    	}
    }

    /* src/pages/superAdmin/product/products.svelte generated by Svelte v3.44.1 */
    const file$w = "src/pages/superAdmin/product/products.svelte";

    function get_each_context$o(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    // (63:24) {#each categories as item}
    function create_each_block_2$2(ctx) {
    	let option;
    	let t_value = /*item*/ ctx[15].category + "";
    	let t;
    	let option_key_value;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			attr_dev(option, "key", option_key_value = /*item*/ ctx[15]._id);
    			option.__value = option_value_value = /*item*/ ctx[15].category;
    			option.value = option.__value;
    			add_location(option, file$w, 63, 28, 1630);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*categories*/ 1 && t_value !== (t_value = /*item*/ ctx[15].category + "")) set_data_dev(t, t_value);

    			if (dirty & /*categories*/ 1 && option_key_value !== (option_key_value = /*item*/ ctx[15]._id)) {
    				attr_dev(option, "key", option_key_value);
    			}

    			if (dirty & /*categories*/ 1 && option_value_value !== (option_value_value = /*item*/ ctx[15].category)) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$2.name,
    		type: "each",
    		source: "(63:24) {#each categories as item}",
    		ctx
    	});

    	return block;
    }

    // (71:24) {#each sCate as item}
    function create_each_block_1$4(ctx) {
    	let option;
    	let t_value = /*item*/ ctx[15] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*item*/ ctx[15];
    			option.value = option.__value;
    			add_location(option, file$w, 71, 28, 2058);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*sCate*/ 4 && t_value !== (t_value = /*item*/ ctx[15] + "")) set_data_dev(t, t_value);

    			if (dirty & /*sCate*/ 4 && option_value_value !== (option_value_value = /*item*/ ctx[15])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$4.name,
    		type: "each",
    		source: "(71:24) {#each sCate as item}",
    		ctx
    	});

    	return block;
    }

    // (80:12) {#if products !== ""}
    function create_if_block_1$9(ctx) {
    	let div;
    	let each_value = /*products*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$o(get_each_context$o(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "row justify-content-center");
    			add_location(div, file$w, 80, 16, 2396);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*products, API_URL*/ 2) {
    				each_value = /*products*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$o(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$o(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$9.name,
    		type: "if",
    		source: "(80:12) {#if products !== \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    // (82:20) {#each products as datas}
    function create_each_block$o(ctx) {
    	let div3;
    	let a;
    	let div2;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let h5;
    	let t1_value = /*datas*/ ctx[12].title + "";
    	let t1;
    	let t2;
    	let p0;
    	let t3_value = /*datas*/ ctx[12].category + "";
    	let t3;
    	let t4;
    	let p1;
    	let i;
    	let t5_value = /*datas*/ ctx[12].subCategory + "";
    	let t5;
    	let a_href_value;
    	let t6;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			a = element("a");
    			div2 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			h5 = element("h5");
    			t1 = text(t1_value);
    			t2 = space();
    			p0 = element("p");
    			t3 = text(t3_value);
    			t4 = space();
    			p1 = element("p");
    			i = element("i");
    			t5 = text(t5_value);
    			t6 = space();
    			if (!src_url_equal(img.src, img_src_value = `${API_URL}/products/images/${/*datas*/ ctx[12].image}`)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "images");
    			attr_dev(img, "class", "svelte-1e10mst");
    			add_location(img, file$w, 86, 32, 2732);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file$w, 85, 28, 2682);
    			attr_dev(h5, "class", "m-2 ");
    			add_location(h5, file$w, 89, 32, 2915);
    			attr_dev(p0, "class", "m-2 ");
    			add_location(p0, file$w, 90, 32, 2983);
    			add_location(i, file$w, 91, 48, 3068);
    			attr_dev(p1, "class", "m-2 ");
    			add_location(p1, file$w, 91, 32, 3052);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$w, 88, 28, 2865);
    			attr_dev(div2, "class", "row p-3");
    			add_location(div2, file$w, 84, 24, 2632);
    			attr_dev(a, "href", a_href_value = "/admin/produt_view/" + /*datas*/ ctx[12]._id);
    			attr_dev(a, "class", "svelte-1e10mst");
    			add_location(a, file$w, 83, 24, 2566);
    			attr_dev(div3, "class", "card rounded-lg col-sm-5 svelte-1e10mst");
    			add_location(div3, file$w, 82, 20, 2503);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, a);
    			append_dev(a, div2);
    			append_dev(div2, div0);
    			append_dev(div0, img);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, h5);
    			append_dev(h5, t1);
    			append_dev(div1, t2);
    			append_dev(div1, p0);
    			append_dev(p0, t3);
    			append_dev(div1, t4);
    			append_dev(div1, p1);
    			append_dev(p1, i);
    			append_dev(i, t5);
    			append_dev(div3, t6);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*products*/ 2 && !src_url_equal(img.src, img_src_value = `${API_URL}/products/images/${/*datas*/ ctx[12].image}`)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*products*/ 2 && t1_value !== (t1_value = /*datas*/ ctx[12].title + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*products*/ 2 && t3_value !== (t3_value = /*datas*/ ctx[12].category + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*products*/ 2 && t5_value !== (t5_value = /*datas*/ ctx[12].subCategory + "")) set_data_dev(t5, t5_value);

    			if (dirty & /*products*/ 2 && a_href_value !== (a_href_value = "/admin/produt_view/" + /*datas*/ ctx[12]._id)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$o.name,
    		type: "each",
    		source: "(82:20) {#each products as datas}",
    		ctx
    	});

    	return block;
    }

    // (100:12) {#if products == ""}
    function create_if_block$c(ctx) {
    	let div;
    	let h5;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h5 = element("h5");
    			h5.textContent = "Select Category to list Products..";
    			attr_dev(h5, "class", "text-secondary p-2 ");
    			add_location(h5, file$w, 101, 20, 3402);
    			attr_dev(div, "class", "row justify-content-center");
    			add_location(div, file$w, 100, 16, 3341);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h5);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(100:12) {#if products == \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$w(ctx) {
    	let main;
    	let div5;
    	let h4;
    	let t1;
    	let div4;
    	let div3;
    	let div0;
    	let select0;
    	let option0;
    	let t3;
    	let div1;
    	let select1;
    	let option1;
    	let t5;
    	let div2;
    	let button;
    	let t7;
    	let t8;
    	let mounted;
    	let dispose;
    	let each_value_2 = /*categories*/ ctx[0];
    	validate_each_argument(each_value_2);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2$2(get_each_context_2$2(ctx, each_value_2, i));
    	}

    	let each_value_1 = /*sCate*/ ctx[2];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$4(get_each_context_1$4(ctx, each_value_1, i));
    	}

    	let if_block0 = /*products*/ ctx[1] !== "" && create_if_block_1$9(ctx);
    	let if_block1 = /*products*/ ctx[1] == "" && create_if_block$c(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div5 = element("div");
    			h4 = element("h4");
    			h4.textContent = "Product Listing";
    			t1 = space();
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			select0 = element("select");
    			option0 = element("option");
    			option0.textContent = "Category.. ";

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t3 = space();
    			div1 = element("div");
    			select1 = element("select");
    			option1 = element("option");
    			option1.textContent = "Sub Category.. ";

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t5 = space();
    			div2 = element("div");
    			button = element("button");
    			button.textContent = "Search";
    			t7 = space();
    			if (if_block0) if_block0.c();
    			t8 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(h4, "class", "heading text-center p-2  svelte-1e10mst");
    			add_location(h4, file$w, 56, 8, 1177);
    			option0.__value = "";
    			option0.value = option0.__value;
    			add_location(option0, file$w, 61, 24, 1513);
    			attr_dev(select0, "class", "form-control form-select svelte-1e10mst");
    			if (/*inputs*/ ctx[3].category === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[7].call(select0));
    			add_location(select0, file$w, 60, 20, 1387);
    			attr_dev(div0, "class", "col-sm-4");
    			add_location(div0, file$w, 59, 16, 1344);
    			option1.__value = "";
    			option1.value = option1.__value;
    			add_location(option1, file$w, 69, 24, 1942);
    			attr_dev(select1, "class", "form-control form-select svelte-1e10mst");
    			if (/*inputs*/ ctx[3].subCategory === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[8].call(select1));
    			add_location(select1, file$w, 68, 20, 1844);
    			attr_dev(div1, "class", "col-sm-4");
    			add_location(div1, file$w, 67, 16, 1801);
    			attr_dev(button, "class", "btn btn-create svelte-1e10mst");
    			add_location(button, file$w, 76, 20, 2239);
    			attr_dev(div2, "class", "col-sm-2");
    			add_location(div2, file$w, 75, 16, 2196);
    			attr_dev(div3, "class", "row justify-content-center m-auto");
    			add_location(div3, file$w, 58, 12, 1280);
    			attr_dev(div4, "class", "border-top");
    			add_location(div4, file$w, 57, 8, 1243);
    			attr_dev(div5, "class", "container border");
    			add_location(div5, file$w, 55, 4, 1138);
    			add_location(main, file$w, 54, 0, 1127);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div5);
    			append_dev(div5, h4);
    			append_dev(div5, t1);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div0, select0);
    			append_dev(select0, option0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(select0, null);
    			}

    			select_option(select0, /*inputs*/ ctx[3].category);
    			append_dev(div3, t3);
    			append_dev(div3, div1);
    			append_dev(div1, select1);
    			append_dev(select1, option1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select1, null);
    			}

    			select_option(select1, /*inputs*/ ctx[3].subCategory);
    			append_dev(div3, t5);
    			append_dev(div3, div2);
    			append_dev(div2, button);
    			append_dev(div4, t7);
    			if (if_block0) if_block0.m(div4, null);
    			append_dev(div4, t8);
    			if (if_block1) if_block1.m(div4, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select0, "change", /*change_handler*/ ctx[6], false, false, false),
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[7]),
    					listen_dev(select1, "change", /*select1_change_handler*/ ctx[8]),
    					listen_dev(button, "click", /*search*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*categories*/ 1) {
    				each_value_2 = /*categories*/ ctx[0];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$2(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_2$2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(select0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_2.length;
    			}

    			if (dirty & /*inputs, categories*/ 9) {
    				select_option(select0, /*inputs*/ ctx[3].category);
    			}

    			if (dirty & /*sCate*/ 4) {
    				each_value_1 = /*sCate*/ ctx[2];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$4(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (dirty & /*inputs, categories*/ 9) {
    				select_option(select1, /*inputs*/ ctx[3].subCategory);
    			}

    			if (/*products*/ ctx[1] !== "") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$9(ctx);
    					if_block0.c();
    					if_block0.m(div4, t8);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*products*/ ctx[1] == "") {
    				if (if_block1) ; else {
    					if_block1 = create_if_block$c(ctx);
    					if_block1.c();
    					if_block1.m(div4, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Products', slots, []);
    	let categories = [];
    	let products = [];
    	let sCate = [];
    	let selectedCate;

    	let inputs = {
    		skip: "",
    		limit: "",
    		category: "",
    		subCategory: ""
    	};

    	onMount(async () => {
    		fetchCategory();
    	}); // fetchProduct()

    	const fetchCategory = async () => {
    		await fetch(`${API_URL}/products/category/list`, { method: 'POST' }).then(response => response.json()).then(datas => {
    			$$invalidate(0, categories = datas.data);
    		});
    	};

    	const cateChange = e => {
    		selectedCate = e.target.value;

    		if (selectedCate == "" || selectedCate == "undefined") {
    			$$invalidate(2, sCate = []);
    		} else {
    			let cate = categories.find(tmp => tmp.category === selectedCate);
    			$$invalidate(2, sCate = cate.subCategory);
    		}
    	};

    	const fetchProduct = async () => {
    		await fetch(`${API_URL}/products/list`, {
    			method: 'POST',
    			body: JSON.stringify(inputs),
    			headers: { 'Content-Type': 'application/json' }
    		}).then(response => response.json()).then(datas => {
    			$$invalidate(1, products = datas.data);
    		});
    	};

    	const search = async () => {
    		fetchProduct();
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Products> was created with unknown prop '${key}'`);
    	});

    	const change_handler = e => cateChange(e);

    	function select0_change_handler() {
    		inputs.category = select_value(this);
    		$$invalidate(3, inputs);
    		$$invalidate(0, categories);
    	}

    	function select1_change_handler() {
    		inputs.subCategory = select_value(this);
    		$$invalidate(3, inputs);
    		$$invalidate(0, categories);
    	}

    	$$self.$capture_state = () => ({
    		API_URL,
    		onMount,
    		categories,
    		products,
    		sCate,
    		selectedCate,
    		inputs,
    		fetchCategory,
    		cateChange,
    		fetchProduct,
    		search
    	});

    	$$self.$inject_state = $$props => {
    		if ('categories' in $$props) $$invalidate(0, categories = $$props.categories);
    		if ('products' in $$props) $$invalidate(1, products = $$props.products);
    		if ('sCate' in $$props) $$invalidate(2, sCate = $$props.sCate);
    		if ('selectedCate' in $$props) selectedCate = $$props.selectedCate;
    		if ('inputs' in $$props) $$invalidate(3, inputs = $$props.inputs);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		categories,
    		products,
    		sCate,
    		inputs,
    		cateChange,
    		search,
    		change_handler,
    		select0_change_handler,
    		select1_change_handler
    	];
    }

    class Products$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$w, create_fragment$w, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Products",
    			options,
    			id: create_fragment$w.name
    		});
    	}
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    /*!
    * sweetalert2 v11.3.0
    * Released under the MIT License.
    */

    var sweetalert2_all = createCommonjsModule(function (module, exports) {
    (function (global, factory) {
      module.exports = factory() ;
    }(commonjsGlobal, function () {
      const DismissReason = Object.freeze({
        cancel: 'cancel',
        backdrop: 'backdrop',
        close: 'close',
        esc: 'esc',
        timer: 'timer'
      });

      const consolePrefix = 'SweetAlert2:';
      /**
       * Filter the unique values into a new array
       * @param arr
       */

      const uniqueArray = arr => {
        const result = [];

        for (let i = 0; i < arr.length; i++) {
          if (result.indexOf(arr[i]) === -1) {
            result.push(arr[i]);
          }
        }

        return result;
      };
      /**
       * Capitalize the first letter of a string
       * @param str
       */

      const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.slice(1);
      /**
       * Convert NodeList to Array
       * @param nodeList
       */

      const toArray = nodeList => Array.prototype.slice.call(nodeList);
      /**
       * Standardise console warnings
       * @param message
       */

      const warn = message => {
        console.warn("".concat(consolePrefix, " ").concat(typeof message === 'object' ? message.join(' ') : message));
      };
      /**
       * Standardise console errors
       * @param message
       */

      const error = message => {
        console.error("".concat(consolePrefix, " ").concat(message));
      };
      /**
       * Private global state for `warnOnce`
       * @type {Array}
       * @private
       */

      const previousWarnOnceMessages = [];
      /**
       * Show a console warning, but only if it hasn't already been shown
       * @param message
       */

      const warnOnce = message => {
        if (!previousWarnOnceMessages.includes(message)) {
          previousWarnOnceMessages.push(message);
          warn(message);
        }
      };
      /**
       * Show a one-time console warning about deprecated params/methods
       */

      const warnAboutDeprecation = (deprecatedParam, useInstead) => {
        warnOnce("\"".concat(deprecatedParam, "\" is deprecated and will be removed in the next major release. Please use \"").concat(useInstead, "\" instead."));
      };
      /**
       * If `arg` is a function, call it (with no arguments or context) and return the result.
       * Otherwise, just pass the value through
       * @param arg
       */

      const callIfFunction = arg => typeof arg === 'function' ? arg() : arg;
      const hasToPromiseFn = arg => arg && typeof arg.toPromise === 'function';
      const asPromise = arg => hasToPromiseFn(arg) ? arg.toPromise() : Promise.resolve(arg);
      const isPromise = arg => arg && Promise.resolve(arg) === arg;

      const isJqueryElement = elem => typeof elem === 'object' && elem.jquery;

      const isElement = elem => elem instanceof Element || isJqueryElement(elem);

      const argsToParams = args => {
        const params = {};

        if (typeof args[0] === 'object' && !isElement(args[0])) {
          Object.assign(params, args[0]);
        } else {
          ['title', 'html', 'icon'].forEach((name, index) => {
            const arg = args[index];

            if (typeof arg === 'string' || isElement(arg)) {
              params[name] = arg;
            } else if (arg !== undefined) {
              error("Unexpected type of ".concat(name, "! Expected \"string\" or \"Element\", got ").concat(typeof arg));
            }
          });
        }

        return params;
      };

      const swalPrefix = 'swal2-';
      const prefix = items => {
        const result = {};

        for (const i in items) {
          result[items[i]] = swalPrefix + items[i];
        }

        return result;
      };
      const swalClasses = prefix(['container', 'shown', 'height-auto', 'iosfix', 'popup', 'modal', 'no-backdrop', 'no-transition', 'toast', 'toast-shown', 'show', 'hide', 'close', 'title', 'html-container', 'actions', 'confirm', 'deny', 'cancel', 'default-outline', 'footer', 'icon', 'icon-content', 'image', 'input', 'file', 'range', 'select', 'radio', 'checkbox', 'label', 'textarea', 'inputerror', 'input-label', 'validation-message', 'progress-steps', 'active-progress-step', 'progress-step', 'progress-step-line', 'loader', 'loading', 'styled', 'top', 'top-start', 'top-end', 'top-left', 'top-right', 'center', 'center-start', 'center-end', 'center-left', 'center-right', 'bottom', 'bottom-start', 'bottom-end', 'bottom-left', 'bottom-right', 'grow-row', 'grow-column', 'grow-fullscreen', 'rtl', 'timer-progress-bar', 'timer-progress-bar-container', 'scrollbar-measure', 'icon-success', 'icon-warning', 'icon-info', 'icon-question', 'icon-error']);
      const iconTypes = prefix(['success', 'warning', 'info', 'question', 'error']);

      const getContainer = () => document.body.querySelector(".".concat(swalClasses.container));
      const elementBySelector = selectorString => {
        const container = getContainer();
        return container ? container.querySelector(selectorString) : null;
      };

      const elementByClass = className => {
        return elementBySelector(".".concat(className));
      };

      const getPopup = () => elementByClass(swalClasses.popup);
      const getIcon = () => elementByClass(swalClasses.icon);
      const getTitle = () => elementByClass(swalClasses.title);
      const getHtmlContainer = () => elementByClass(swalClasses['html-container']);
      const getImage = () => elementByClass(swalClasses.image);
      const getProgressSteps = () => elementByClass(swalClasses['progress-steps']);
      const getValidationMessage = () => elementByClass(swalClasses['validation-message']);
      const getConfirmButton = () => elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.confirm));
      const getDenyButton = () => elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.deny));
      const getInputLabel = () => elementByClass(swalClasses['input-label']);
      const getLoader = () => elementBySelector(".".concat(swalClasses.loader));
      const getCancelButton = () => elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.cancel));
      const getActions = () => elementByClass(swalClasses.actions);
      const getFooter = () => elementByClass(swalClasses.footer);
      const getTimerProgressBar = () => elementByClass(swalClasses['timer-progress-bar']);
      const getCloseButton = () => elementByClass(swalClasses.close); // https://github.com/jkup/focusable/blob/master/index.js

      const focusable = "\n  a[href],\n  area[href],\n  input:not([disabled]),\n  select:not([disabled]),\n  textarea:not([disabled]),\n  button:not([disabled]),\n  iframe,\n  object,\n  embed,\n  [tabindex=\"0\"],\n  [contenteditable],\n  audio[controls],\n  video[controls],\n  summary\n";
      const getFocusableElements = () => {
        const focusableElementsWithTabindex = toArray(getPopup().querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])')) // sort according to tabindex
        .sort((a, b) => {
          a = parseInt(a.getAttribute('tabindex'));
          b = parseInt(b.getAttribute('tabindex'));

          if (a > b) {
            return 1;
          } else if (a < b) {
            return -1;
          }

          return 0;
        });
        const otherFocusableElements = toArray(getPopup().querySelectorAll(focusable)).filter(el => el.getAttribute('tabindex') !== '-1');
        return uniqueArray(focusableElementsWithTabindex.concat(otherFocusableElements)).filter(el => isVisible(el));
      };
      const isModal = () => {
        return !hasClass(document.body, swalClasses['toast-shown']) && !hasClass(document.body, swalClasses['no-backdrop']);
      };
      const isToast = () => {
        return getPopup() && hasClass(getPopup(), swalClasses.toast);
      };
      const isLoading = () => {
        return getPopup().hasAttribute('data-loading');
      };

      const states = {
        previousBodyPadding: null
      };
      const setInnerHtml = (elem, html) => {
        // #1926
        elem.textContent = '';

        if (html) {
          const parser = new DOMParser();
          const parsed = parser.parseFromString(html, "text/html");
          toArray(parsed.querySelector('head').childNodes).forEach(child => {
            elem.appendChild(child);
          });
          toArray(parsed.querySelector('body').childNodes).forEach(child => {
            elem.appendChild(child);
          });
        }
      };
      const hasClass = (elem, className) => {
        if (!className) {
          return false;
        }

        const classList = className.split(/\s+/);

        for (let i = 0; i < classList.length; i++) {
          if (!elem.classList.contains(classList[i])) {
            return false;
          }
        }

        return true;
      };

      const removeCustomClasses = (elem, params) => {
        toArray(elem.classList).forEach(className => {
          if (!Object.values(swalClasses).includes(className) && !Object.values(iconTypes).includes(className) && !Object.values(params.showClass).includes(className)) {
            elem.classList.remove(className);
          }
        });
      };

      const applyCustomClass = (elem, params, className) => {
        removeCustomClasses(elem, params);

        if (params.customClass && params.customClass[className]) {
          if (typeof params.customClass[className] !== 'string' && !params.customClass[className].forEach) {
            return warn("Invalid type of customClass.".concat(className, "! Expected string or iterable object, got \"").concat(typeof params.customClass[className], "\""));
          }

          addClass(elem, params.customClass[className]);
        }
      };
      const getInput = (popup, inputType) => {
        if (!inputType) {
          return null;
        }

        switch (inputType) {
          case 'select':
          case 'textarea':
          case 'file':
            return getChildByClass(popup, swalClasses[inputType]);

          case 'checkbox':
            return popup.querySelector(".".concat(swalClasses.checkbox, " input"));

          case 'radio':
            return popup.querySelector(".".concat(swalClasses.radio, " input:checked")) || popup.querySelector(".".concat(swalClasses.radio, " input:first-child"));

          case 'range':
            return popup.querySelector(".".concat(swalClasses.range, " input"));

          default:
            return getChildByClass(popup, swalClasses.input);
        }
      };
      const focusInput = input => {
        input.focus(); // place cursor at end of text in text input

        if (input.type !== 'file') {
          // http://stackoverflow.com/a/2345915
          const val = input.value;
          input.value = '';
          input.value = val;
        }
      };
      const toggleClass = (target, classList, condition) => {
        if (!target || !classList) {
          return;
        }

        if (typeof classList === 'string') {
          classList = classList.split(/\s+/).filter(Boolean);
        }

        classList.forEach(className => {
          if (target.forEach) {
            target.forEach(elem => {
              condition ? elem.classList.add(className) : elem.classList.remove(className);
            });
          } else {
            condition ? target.classList.add(className) : target.classList.remove(className);
          }
        });
      };
      const addClass = (target, classList) => {
        toggleClass(target, classList, true);
      };
      const removeClass = (target, classList) => {
        toggleClass(target, classList, false);
      };
      const getChildByClass = (elem, className) => {
        for (let i = 0; i < elem.childNodes.length; i++) {
          if (hasClass(elem.childNodes[i], className)) {
            return elem.childNodes[i];
          }
        }
      };
      const applyNumericalStyle = (elem, property, value) => {
        if (value === "".concat(parseInt(value))) {
          value = parseInt(value);
        }

        if (value || parseInt(value) === 0) {
          elem.style[property] = typeof value === 'number' ? "".concat(value, "px") : value;
        } else {
          elem.style.removeProperty(property);
        }
      };
      const show = function (elem) {
        let display = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'flex';
        elem.style.display = display;
      };
      const hide = elem => {
        elem.style.display = 'none';
      };
      const setStyle = (parent, selector, property, value) => {
        const el = parent.querySelector(selector);

        if (el) {
          el.style[property] = value;
        }
      };
      const toggle = (elem, condition, display) => {
        condition ? show(elem, display) : hide(elem);
      }; // borrowed from jquery $(elem).is(':visible') implementation

      const isVisible = elem => !!(elem && (elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length));
      const allButtonsAreHidden = () => !isVisible(getConfirmButton()) && !isVisible(getDenyButton()) && !isVisible(getCancelButton());
      const isScrollable = elem => !!(elem.scrollHeight > elem.clientHeight); // borrowed from https://stackoverflow.com/a/46352119

      const hasCssAnimation = elem => {
        const style = window.getComputedStyle(elem);
        const animDuration = parseFloat(style.getPropertyValue('animation-duration') || '0');
        const transDuration = parseFloat(style.getPropertyValue('transition-duration') || '0');
        return animDuration > 0 || transDuration > 0;
      };
      const animateTimerProgressBar = function (timer) {
        let reset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        const timerProgressBar = getTimerProgressBar();

        if (isVisible(timerProgressBar)) {
          if (reset) {
            timerProgressBar.style.transition = 'none';
            timerProgressBar.style.width = '100%';
          }

          setTimeout(() => {
            timerProgressBar.style.transition = "width ".concat(timer / 1000, "s linear");
            timerProgressBar.style.width = '0%';
          }, 10);
        }
      };
      const stopTimerProgressBar = () => {
        const timerProgressBar = getTimerProgressBar();
        const timerProgressBarWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
        timerProgressBar.style.removeProperty('transition');
        timerProgressBar.style.width = '100%';
        const timerProgressBarFullWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
        const timerProgressBarPercent = parseInt(timerProgressBarWidth / timerProgressBarFullWidth * 100);
        timerProgressBar.style.removeProperty('transition');
        timerProgressBar.style.width = "".concat(timerProgressBarPercent, "%");
      };

      // Detect Node env
      const isNodeEnv = () => typeof window === 'undefined' || typeof document === 'undefined';

      const sweetHTML = "\n <div aria-labelledby=\"".concat(swalClasses.title, "\" aria-describedby=\"").concat(swalClasses['html-container'], "\" class=\"").concat(swalClasses.popup, "\" tabindex=\"-1\">\n   <button type=\"button\" class=\"").concat(swalClasses.close, "\"></button>\n   <ul class=\"").concat(swalClasses['progress-steps'], "\"></ul>\n   <div class=\"").concat(swalClasses.icon, "\"></div>\n   <img class=\"").concat(swalClasses.image, "\" />\n   <h2 class=\"").concat(swalClasses.title, "\" id=\"").concat(swalClasses.title, "\"></h2>\n   <div class=\"").concat(swalClasses['html-container'], "\" id=\"").concat(swalClasses['html-container'], "\"></div>\n   <input class=\"").concat(swalClasses.input, "\" />\n   <input type=\"file\" class=\"").concat(swalClasses.file, "\" />\n   <div class=\"").concat(swalClasses.range, "\">\n     <input type=\"range\" />\n     <output></output>\n   </div>\n   <select class=\"").concat(swalClasses.select, "\"></select>\n   <div class=\"").concat(swalClasses.radio, "\"></div>\n   <label for=\"").concat(swalClasses.checkbox, "\" class=\"").concat(swalClasses.checkbox, "\">\n     <input type=\"checkbox\" />\n     <span class=\"").concat(swalClasses.label, "\"></span>\n   </label>\n   <textarea class=\"").concat(swalClasses.textarea, "\"></textarea>\n   <div class=\"").concat(swalClasses['validation-message'], "\" id=\"").concat(swalClasses['validation-message'], "\"></div>\n   <div class=\"").concat(swalClasses.actions, "\">\n     <div class=\"").concat(swalClasses.loader, "\"></div>\n     <button type=\"button\" class=\"").concat(swalClasses.confirm, "\"></button>\n     <button type=\"button\" class=\"").concat(swalClasses.deny, "\"></button>\n     <button type=\"button\" class=\"").concat(swalClasses.cancel, "\"></button>\n   </div>\n   <div class=\"").concat(swalClasses.footer, "\"></div>\n   <div class=\"").concat(swalClasses['timer-progress-bar-container'], "\">\n     <div class=\"").concat(swalClasses['timer-progress-bar'], "\"></div>\n   </div>\n </div>\n").replace(/(^|\n)\s*/g, '');

      const resetOldContainer = () => {
        const oldContainer = getContainer();

        if (!oldContainer) {
          return false;
        }

        oldContainer.remove();
        removeClass([document.documentElement, document.body], [swalClasses['no-backdrop'], swalClasses['toast-shown'], swalClasses['has-column']]);
        return true;
      };

      const resetValidationMessage = () => {
        if (Swal.isVisible()) {
          Swal.resetValidationMessage();
        }
      };

      const addInputChangeListeners = () => {
        const popup = getPopup();
        const input = getChildByClass(popup, swalClasses.input);
        const file = getChildByClass(popup, swalClasses.file);
        const range = popup.querySelector(".".concat(swalClasses.range, " input"));
        const rangeOutput = popup.querySelector(".".concat(swalClasses.range, " output"));
        const select = getChildByClass(popup, swalClasses.select);
        const checkbox = popup.querySelector(".".concat(swalClasses.checkbox, " input"));
        const textarea = getChildByClass(popup, swalClasses.textarea);
        input.oninput = resetValidationMessage;
        file.onchange = resetValidationMessage;
        select.onchange = resetValidationMessage;
        checkbox.onchange = resetValidationMessage;
        textarea.oninput = resetValidationMessage;

        range.oninput = () => {
          resetValidationMessage();
          rangeOutput.value = range.value;
        };

        range.onchange = () => {
          resetValidationMessage();
          range.nextSibling.value = range.value;
        };
      };

      const getTarget = target => typeof target === 'string' ? document.querySelector(target) : target;

      const setupAccessibility = params => {
        const popup = getPopup();
        popup.setAttribute('role', params.toast ? 'alert' : 'dialog');
        popup.setAttribute('aria-live', params.toast ? 'polite' : 'assertive');

        if (!params.toast) {
          popup.setAttribute('aria-modal', 'true');
        }
      };

      const setupRTL = targetElement => {
        if (window.getComputedStyle(targetElement).direction === 'rtl') {
          addClass(getContainer(), swalClasses.rtl);
        }
      };
      /*
       * Add modal + backdrop to DOM
       */


      const init = params => {
        // Clean up the old popup container if it exists
        const oldContainerExisted = resetOldContainer();
        /* istanbul ignore if */

        if (isNodeEnv()) {
          error('SweetAlert2 requires document to initialize');
          return;
        }

        const container = document.createElement('div');
        container.className = swalClasses.container;

        if (oldContainerExisted) {
          addClass(container, swalClasses['no-transition']);
        }

        setInnerHtml(container, sweetHTML);
        const targetElement = getTarget(params.target);
        targetElement.appendChild(container);
        setupAccessibility(params);
        setupRTL(targetElement);
        addInputChangeListeners();
      };

      const parseHtmlToContainer = (param, target) => {
        // DOM element
        if (param instanceof HTMLElement) {
          target.appendChild(param); // Object
        } else if (typeof param === 'object') {
          handleObject(param, target); // Plain string
        } else if (param) {
          setInnerHtml(target, param);
        }
      };

      const handleObject = (param, target) => {
        // JQuery element(s)
        if (param.jquery) {
          handleJqueryElem(target, param); // For other objects use their string representation
        } else {
          setInnerHtml(target, param.toString());
        }
      };

      const handleJqueryElem = (target, elem) => {
        target.textContent = '';

        if (0 in elem) {
          for (let i = 0; (i in elem); i++) {
            target.appendChild(elem[i].cloneNode(true));
          }
        } else {
          target.appendChild(elem.cloneNode(true));
        }
      };

      const animationEndEvent = (() => {
        // Prevent run in Node env

        /* istanbul ignore if */
        if (isNodeEnv()) {
          return false;
        }

        const testEl = document.createElement('div');
        const transEndEventNames = {
          WebkitAnimation: 'webkitAnimationEnd',
          OAnimation: 'oAnimationEnd oanimationend',
          animation: 'animationend'
        };

        for (const i in transEndEventNames) {
          if (Object.prototype.hasOwnProperty.call(transEndEventNames, i) && typeof testEl.style[i] !== 'undefined') {
            return transEndEventNames[i];
          }
        }

        return false;
      })();

      // https://github.com/twbs/bootstrap/blob/master/js/src/modal.js

      const measureScrollbar = () => {
        const scrollDiv = document.createElement('div');
        scrollDiv.className = swalClasses['scrollbar-measure'];
        document.body.appendChild(scrollDiv);
        const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
        document.body.removeChild(scrollDiv);
        return scrollbarWidth;
      };

      const renderActions = (instance, params) => {
        const actions = getActions();
        const loader = getLoader(); // Actions (buttons) wrapper

        if (!params.showConfirmButton && !params.showDenyButton && !params.showCancelButton) {
          hide(actions);
        } else {
          show(actions);
        } // Custom class


        applyCustomClass(actions, params, 'actions'); // Render all the buttons

        renderButtons(actions, loader, params); // Loader

        setInnerHtml(loader, params.loaderHtml);
        applyCustomClass(loader, params, 'loader');
      };

      function renderButtons(actions, loader, params) {
        const confirmButton = getConfirmButton();
        const denyButton = getDenyButton();
        const cancelButton = getCancelButton(); // Render buttons

        renderButton(confirmButton, 'confirm', params);
        renderButton(denyButton, 'deny', params);
        renderButton(cancelButton, 'cancel', params);
        handleButtonsStyling(confirmButton, denyButton, cancelButton, params);

        if (params.reverseButtons) {
          if (params.toast) {
            actions.insertBefore(cancelButton, confirmButton);
            actions.insertBefore(denyButton, confirmButton);
          } else {
            actions.insertBefore(cancelButton, loader);
            actions.insertBefore(denyButton, loader);
            actions.insertBefore(confirmButton, loader);
          }
        }
      }

      function handleButtonsStyling(confirmButton, denyButton, cancelButton, params) {
        if (!params.buttonsStyling) {
          return removeClass([confirmButton, denyButton, cancelButton], swalClasses.styled);
        }

        addClass([confirmButton, denyButton, cancelButton], swalClasses.styled); // Buttons background colors

        if (params.confirmButtonColor) {
          confirmButton.style.backgroundColor = params.confirmButtonColor;
          addClass(confirmButton, swalClasses['default-outline']);
        }

        if (params.denyButtonColor) {
          denyButton.style.backgroundColor = params.denyButtonColor;
          addClass(denyButton, swalClasses['default-outline']);
        }

        if (params.cancelButtonColor) {
          cancelButton.style.backgroundColor = params.cancelButtonColor;
          addClass(cancelButton, swalClasses['default-outline']);
        }
      }

      function renderButton(button, buttonType, params) {
        toggle(button, params["show".concat(capitalizeFirstLetter(buttonType), "Button")], 'inline-block');
        setInnerHtml(button, params["".concat(buttonType, "ButtonText")]); // Set caption text

        button.setAttribute('aria-label', params["".concat(buttonType, "ButtonAriaLabel")]); // ARIA label
        // Add buttons custom classes

        button.className = swalClasses[buttonType];
        applyCustomClass(button, params, "".concat(buttonType, "Button"));
        addClass(button, params["".concat(buttonType, "ButtonClass")]);
      }

      function handleBackdropParam(container, backdrop) {
        if (typeof backdrop === 'string') {
          container.style.background = backdrop;
        } else if (!backdrop) {
          addClass([document.documentElement, document.body], swalClasses['no-backdrop']);
        }
      }

      function handlePositionParam(container, position) {
        if (position in swalClasses) {
          addClass(container, swalClasses[position]);
        } else {
          warn('The "position" parameter is not valid, defaulting to "center"');
          addClass(container, swalClasses.center);
        }
      }

      function handleGrowParam(container, grow) {
        if (grow && typeof grow === 'string') {
          const growClass = "grow-".concat(grow);

          if (growClass in swalClasses) {
            addClass(container, swalClasses[growClass]);
          }
        }
      }

      const renderContainer = (instance, params) => {
        const container = getContainer();

        if (!container) {
          return;
        }

        handleBackdropParam(container, params.backdrop);
        handlePositionParam(container, params.position);
        handleGrowParam(container, params.grow); // Custom class

        applyCustomClass(container, params, 'container');
      };

      /**
       * This module contains `WeakMap`s for each effectively-"private  property" that a `Swal` has.
       * For example, to set the private property "foo" of `this` to "bar", you can `privateProps.foo.set(this, 'bar')`
       * This is the approach that Babel will probably take to implement private methods/fields
       *   https://github.com/tc39/proposal-private-methods
       *   https://github.com/babel/babel/pull/7555
       * Once we have the changes from that PR in Babel, and our core class fits reasonable in *one module*
       *   then we can use that language feature.
       */
      var privateProps = {
        awaitingPromise: new WeakMap(),
        promise: new WeakMap(),
        innerParams: new WeakMap(),
        domCache: new WeakMap()
      };

      const inputTypes = ['input', 'file', 'range', 'select', 'radio', 'checkbox', 'textarea'];
      const renderInput = (instance, params) => {
        const popup = getPopup();
        const innerParams = privateProps.innerParams.get(instance);
        const rerender = !innerParams || params.input !== innerParams.input;
        inputTypes.forEach(inputType => {
          const inputClass = swalClasses[inputType];
          const inputContainer = getChildByClass(popup, inputClass); // set attributes

          setAttributes(inputType, params.inputAttributes); // set class

          inputContainer.className = inputClass;

          if (rerender) {
            hide(inputContainer);
          }
        });

        if (params.input) {
          if (rerender) {
            showInput(params);
          } // set custom class


          setCustomClass(params);
        }
      };

      const showInput = params => {
        if (!renderInputType[params.input]) {
          return error("Unexpected type of input! Expected \"text\", \"email\", \"password\", \"number\", \"tel\", \"select\", \"radio\", \"checkbox\", \"textarea\", \"file\" or \"url\", got \"".concat(params.input, "\""));
        }

        const inputContainer = getInputContainer(params.input);
        const input = renderInputType[params.input](inputContainer, params);
        show(input); // input autofocus

        setTimeout(() => {
          focusInput(input);
        });
      };

      const removeAttributes = input => {
        for (let i = 0; i < input.attributes.length; i++) {
          const attrName = input.attributes[i].name;

          if (!['type', 'value', 'style'].includes(attrName)) {
            input.removeAttribute(attrName);
          }
        }
      };

      const setAttributes = (inputType, inputAttributes) => {
        const input = getInput(getPopup(), inputType);

        if (!input) {
          return;
        }

        removeAttributes(input);

        for (const attr in inputAttributes) {
          input.setAttribute(attr, inputAttributes[attr]);
        }
      };

      const setCustomClass = params => {
        const inputContainer = getInputContainer(params.input);

        if (params.customClass) {
          addClass(inputContainer, params.customClass.input);
        }
      };

      const setInputPlaceholder = (input, params) => {
        if (!input.placeholder || params.inputPlaceholder) {
          input.placeholder = params.inputPlaceholder;
        }
      };

      const setInputLabel = (input, prependTo, params) => {
        if (params.inputLabel) {
          input.id = swalClasses.input;
          const label = document.createElement('label');
          const labelClass = swalClasses['input-label'];
          label.setAttribute('for', input.id);
          label.className = labelClass;
          addClass(label, params.customClass.inputLabel);
          label.innerText = params.inputLabel;
          prependTo.insertAdjacentElement('beforebegin', label);
        }
      };

      const getInputContainer = inputType => {
        const inputClass = swalClasses[inputType] ? swalClasses[inputType] : swalClasses.input;
        return getChildByClass(getPopup(), inputClass);
      };

      const renderInputType = {};

      renderInputType.text = renderInputType.email = renderInputType.password = renderInputType.number = renderInputType.tel = renderInputType.url = (input, params) => {
        if (typeof params.inputValue === 'string' || typeof params.inputValue === 'number') {
          input.value = params.inputValue;
        } else if (!isPromise(params.inputValue)) {
          warn("Unexpected type of inputValue! Expected \"string\", \"number\" or \"Promise\", got \"".concat(typeof params.inputValue, "\""));
        }

        setInputLabel(input, input, params);
        setInputPlaceholder(input, params);
        input.type = params.input;
        return input;
      };

      renderInputType.file = (input, params) => {
        setInputLabel(input, input, params);
        setInputPlaceholder(input, params);
        return input;
      };

      renderInputType.range = (range, params) => {
        const rangeInput = range.querySelector('input');
        const rangeOutput = range.querySelector('output');
        rangeInput.value = params.inputValue;
        rangeInput.type = params.input;
        rangeOutput.value = params.inputValue;
        setInputLabel(rangeInput, range, params);
        return range;
      };

      renderInputType.select = (select, params) => {
        select.textContent = '';

        if (params.inputPlaceholder) {
          const placeholder = document.createElement('option');
          setInnerHtml(placeholder, params.inputPlaceholder);
          placeholder.value = '';
          placeholder.disabled = true;
          placeholder.selected = true;
          select.appendChild(placeholder);
        }

        setInputLabel(select, select, params);
        return select;
      };

      renderInputType.radio = radio => {
        radio.textContent = '';
        return radio;
      };

      renderInputType.checkbox = (checkboxContainer, params) => {
        const checkbox = getInput(getPopup(), 'checkbox');
        checkbox.value = 1;
        checkbox.id = swalClasses.checkbox;
        checkbox.checked = Boolean(params.inputValue);
        const label = checkboxContainer.querySelector('span');
        setInnerHtml(label, params.inputPlaceholder);
        return checkboxContainer;
      };

      renderInputType.textarea = (textarea, params) => {
        textarea.value = params.inputValue;
        setInputPlaceholder(textarea, params);
        setInputLabel(textarea, textarea, params);

        const getMargin = el => parseInt(window.getComputedStyle(el).marginLeft) + parseInt(window.getComputedStyle(el).marginRight);

        setTimeout(() => {
          // #2291
          if ('MutationObserver' in window) {
            // #1699
            const initialPopupWidth = parseInt(window.getComputedStyle(getPopup()).width);

            const textareaResizeHandler = () => {
              const textareaWidth = textarea.offsetWidth + getMargin(textarea);

              if (textareaWidth > initialPopupWidth) {
                getPopup().style.width = "".concat(textareaWidth, "px");
              } else {
                getPopup().style.width = null;
              }
            };

            new MutationObserver(textareaResizeHandler).observe(textarea, {
              attributes: true,
              attributeFilter: ['style']
            });
          }
        });
        return textarea;
      };

      const renderContent = (instance, params) => {
        const htmlContainer = getHtmlContainer();
        applyCustomClass(htmlContainer, params, 'htmlContainer'); // Content as HTML

        if (params.html) {
          parseHtmlToContainer(params.html, htmlContainer);
          show(htmlContainer, 'block'); // Content as plain text
        } else if (params.text) {
          htmlContainer.textContent = params.text;
          show(htmlContainer, 'block'); // No content
        } else {
          hide(htmlContainer);
        }

        renderInput(instance, params);
      };

      const renderFooter = (instance, params) => {
        const footer = getFooter();
        toggle(footer, params.footer);

        if (params.footer) {
          parseHtmlToContainer(params.footer, footer);
        } // Custom class


        applyCustomClass(footer, params, 'footer');
      };

      const renderCloseButton = (instance, params) => {
        const closeButton = getCloseButton();
        setInnerHtml(closeButton, params.closeButtonHtml); // Custom class

        applyCustomClass(closeButton, params, 'closeButton');
        toggle(closeButton, params.showCloseButton);
        closeButton.setAttribute('aria-label', params.closeButtonAriaLabel);
      };

      const renderIcon = (instance, params) => {
        const innerParams = privateProps.innerParams.get(instance);
        const icon = getIcon(); // if the given icon already rendered, apply the styling without re-rendering the icon

        if (innerParams && params.icon === innerParams.icon) {
          // Custom or default content
          setContent(icon, params);
          applyStyles(icon, params);
          return;
        }

        if (!params.icon && !params.iconHtml) {
          return hide(icon);
        }

        if (params.icon && Object.keys(iconTypes).indexOf(params.icon) === -1) {
          error("Unknown icon! Expected \"success\", \"error\", \"warning\", \"info\" or \"question\", got \"".concat(params.icon, "\""));
          return hide(icon);
        }

        show(icon); // Custom or default content

        setContent(icon, params);
        applyStyles(icon, params); // Animate icon

        addClass(icon, params.showClass.icon);
      };

      const applyStyles = (icon, params) => {
        for (const iconType in iconTypes) {
          if (params.icon !== iconType) {
            removeClass(icon, iconTypes[iconType]);
          }
        }

        addClass(icon, iconTypes[params.icon]); // Icon color

        setColor(icon, params); // Success icon background color

        adjustSuccessIconBackgoundColor(); // Custom class

        applyCustomClass(icon, params, 'icon');
      }; // Adjust success icon background color to match the popup background color


      const adjustSuccessIconBackgoundColor = () => {
        const popup = getPopup();
        const popupBackgroundColor = window.getComputedStyle(popup).getPropertyValue('background-color');
        const successIconParts = popup.querySelectorAll('[class^=swal2-success-circular-line], .swal2-success-fix');

        for (let i = 0; i < successIconParts.length; i++) {
          successIconParts[i].style.backgroundColor = popupBackgroundColor;
        }
      };

      const setContent = (icon, params) => {
        icon.textContent = '';

        if (params.iconHtml) {
          setInnerHtml(icon, iconContent(params.iconHtml));
        } else if (params.icon === 'success') {
          setInnerHtml(icon, "\n      <div class=\"swal2-success-circular-line-left\"></div>\n      <span class=\"swal2-success-line-tip\"></span> <span class=\"swal2-success-line-long\"></span>\n      <div class=\"swal2-success-ring\"></div> <div class=\"swal2-success-fix\"></div>\n      <div class=\"swal2-success-circular-line-right\"></div>\n    ");
        } else if (params.icon === 'error') {
          setInnerHtml(icon, "\n      <span class=\"swal2-x-mark\">\n        <span class=\"swal2-x-mark-line-left\"></span>\n        <span class=\"swal2-x-mark-line-right\"></span>\n      </span>\n    ");
        } else {
          const defaultIconHtml = {
            question: '?',
            warning: '!',
            info: 'i'
          };
          setInnerHtml(icon, iconContent(defaultIconHtml[params.icon]));
        }
      };

      const setColor = (icon, params) => {
        if (!params.iconColor) {
          return;
        }

        icon.style.color = params.iconColor;
        icon.style.borderColor = params.iconColor;

        for (const sel of ['.swal2-success-line-tip', '.swal2-success-line-long', '.swal2-x-mark-line-left', '.swal2-x-mark-line-right']) {
          setStyle(icon, sel, 'backgroundColor', params.iconColor);
        }

        setStyle(icon, '.swal2-success-ring', 'borderColor', params.iconColor);
      };

      const iconContent = content => "<div class=\"".concat(swalClasses['icon-content'], "\">").concat(content, "</div>");

      const renderImage = (instance, params) => {
        const image = getImage();

        if (!params.imageUrl) {
          return hide(image);
        }

        show(image, ''); // Src, alt

        image.setAttribute('src', params.imageUrl);
        image.setAttribute('alt', params.imageAlt); // Width, height

        applyNumericalStyle(image, 'width', params.imageWidth);
        applyNumericalStyle(image, 'height', params.imageHeight); // Class

        image.className = swalClasses.image;
        applyCustomClass(image, params, 'image');
      };

      const createStepElement = step => {
        const stepEl = document.createElement('li');
        addClass(stepEl, swalClasses['progress-step']);
        setInnerHtml(stepEl, step);
        return stepEl;
      };

      const createLineElement = params => {
        const lineEl = document.createElement('li');
        addClass(lineEl, swalClasses['progress-step-line']);

        if (params.progressStepsDistance) {
          lineEl.style.width = params.progressStepsDistance;
        }

        return lineEl;
      };

      const renderProgressSteps = (instance, params) => {
        const progressStepsContainer = getProgressSteps();

        if (!params.progressSteps || params.progressSteps.length === 0) {
          return hide(progressStepsContainer);
        }

        show(progressStepsContainer);
        progressStepsContainer.textContent = '';

        if (params.currentProgressStep >= params.progressSteps.length) {
          warn('Invalid currentProgressStep parameter, it should be less than progressSteps.length ' + '(currentProgressStep like JS arrays starts from 0)');
        }

        params.progressSteps.forEach((step, index) => {
          const stepEl = createStepElement(step);
          progressStepsContainer.appendChild(stepEl);

          if (index === params.currentProgressStep) {
            addClass(stepEl, swalClasses['active-progress-step']);
          }

          if (index !== params.progressSteps.length - 1) {
            const lineEl = createLineElement(params);
            progressStepsContainer.appendChild(lineEl);
          }
        });
      };

      const renderTitle = (instance, params) => {
        const title = getTitle();
        toggle(title, params.title || params.titleText, 'block');

        if (params.title) {
          parseHtmlToContainer(params.title, title);
        }

        if (params.titleText) {
          title.innerText = params.titleText;
        } // Custom class


        applyCustomClass(title, params, 'title');
      };

      const renderPopup = (instance, params) => {
        const container = getContainer();
        const popup = getPopup(); // Width

        if (params.toast) {
          // #2170
          applyNumericalStyle(container, 'width', params.width);
          popup.style.width = '100%';
          popup.insertBefore(getLoader(), getIcon());
        } else {
          applyNumericalStyle(popup, 'width', params.width);
        } // Padding


        applyNumericalStyle(popup, 'padding', params.padding); // Color

        if (params.color) {
          popup.style.color = params.color;
        } // Background


        if (params.background) {
          popup.style.background = params.background;
        }

        hide(getValidationMessage()); // Classes

        addClasses(popup, params);
      };

      const addClasses = (popup, params) => {
        // Default Class + showClass when updating Swal.update({})
        popup.className = "".concat(swalClasses.popup, " ").concat(isVisible(popup) ? params.showClass.popup : '');

        if (params.toast) {
          addClass([document.documentElement, document.body], swalClasses['toast-shown']);
          addClass(popup, swalClasses.toast);
        } else {
          addClass(popup, swalClasses.modal);
        } // Custom class


        applyCustomClass(popup, params, 'popup');

        if (typeof params.customClass === 'string') {
          addClass(popup, params.customClass);
        } // Icon class (#1842)


        if (params.icon) {
          addClass(popup, swalClasses["icon-".concat(params.icon)]);
        }
      };

      const render = (instance, params) => {
        renderPopup(instance, params);
        renderContainer(instance, params);
        renderProgressSteps(instance, params);
        renderIcon(instance, params);
        renderImage(instance, params);
        renderTitle(instance, params);
        renderCloseButton(instance, params);
        renderContent(instance, params);
        renderActions(instance, params);
        renderFooter(instance, params);

        if (typeof params.didRender === 'function') {
          params.didRender(getPopup());
        }
      };

      /*
       * Global function to determine if SweetAlert2 popup is shown
       */

      const isVisible$1 = () => {
        return isVisible(getPopup());
      };
      /*
       * Global function to click 'Confirm' button
       */

      const clickConfirm = () => getConfirmButton() && getConfirmButton().click();
      /*
       * Global function to click 'Deny' button
       */

      const clickDeny = () => getDenyButton() && getDenyButton().click();
      /*
       * Global function to click 'Cancel' button
       */

      const clickCancel = () => getCancelButton() && getCancelButton().click();

      function fire() {
        const Swal = this;

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return new Swal(...args);
      }

      /**
       * Returns an extended version of `Swal` containing `params` as defaults.
       * Useful for reusing Swal configuration.
       *
       * For example:
       *
       * Before:
       * const textPromptOptions = { input: 'text', showCancelButton: true }
       * const {value: firstName} = await Swal.fire({ ...textPromptOptions, title: 'What is your first name?' })
       * const {value: lastName} = await Swal.fire({ ...textPromptOptions, title: 'What is your last name?' })
       *
       * After:
       * const TextPrompt = Swal.mixin({ input: 'text', showCancelButton: true })
       * const {value: firstName} = await TextPrompt('What is your first name?')
       * const {value: lastName} = await TextPrompt('What is your last name?')
       *
       * @param mixinParams
       */
      function mixin(mixinParams) {
        class MixinSwal extends this {
          _main(params, priorityMixinParams) {
            return super._main(params, Object.assign({}, mixinParams, priorityMixinParams));
          }

        }

        return MixinSwal;
      }

      /**
       * Shows loader (spinner), this is useful with AJAX requests.
       * By default the loader be shown instead of the "Confirm" button.
       */

      const showLoading = buttonToReplace => {
        let popup = getPopup();

        if (!popup) {
          Swal.fire();
        }

        popup = getPopup();
        const loader = getLoader();

        if (isToast()) {
          hide(getIcon());
        } else {
          replaceButton(popup, buttonToReplace);
        }

        show(loader);
        popup.setAttribute('data-loading', true);
        popup.setAttribute('aria-busy', true);
        popup.focus();
      };

      const replaceButton = (popup, buttonToReplace) => {
        const actions = getActions();
        const loader = getLoader();

        if (!buttonToReplace && isVisible(getConfirmButton())) {
          buttonToReplace = getConfirmButton();
        }

        show(actions);

        if (buttonToReplace) {
          hide(buttonToReplace);
          loader.setAttribute('data-button-to-replace', buttonToReplace.className);
        }

        loader.parentNode.insertBefore(loader, buttonToReplace);
        addClass([popup, actions], swalClasses.loading);
      };

      const RESTORE_FOCUS_TIMEOUT = 100;

      const globalState = {};

      const focusPreviousActiveElement = () => {
        if (globalState.previousActiveElement && globalState.previousActiveElement.focus) {
          globalState.previousActiveElement.focus();
          globalState.previousActiveElement = null;
        } else if (document.body) {
          document.body.focus();
        }
      }; // Restore previous active (focused) element


      const restoreActiveElement = returnFocus => {
        return new Promise(resolve => {
          if (!returnFocus) {
            return resolve();
          }

          const x = window.scrollX;
          const y = window.scrollY;
          globalState.restoreFocusTimeout = setTimeout(() => {
            focusPreviousActiveElement();
            resolve();
          }, RESTORE_FOCUS_TIMEOUT); // issues/900

          window.scrollTo(x, y);
        });
      };

      /**
       * If `timer` parameter is set, returns number of milliseconds of timer remained.
       * Otherwise, returns undefined.
       */

      const getTimerLeft = () => {
        return globalState.timeout && globalState.timeout.getTimerLeft();
      };
      /**
       * Stop timer. Returns number of milliseconds of timer remained.
       * If `timer` parameter isn't set, returns undefined.
       */

      const stopTimer = () => {
        if (globalState.timeout) {
          stopTimerProgressBar();
          return globalState.timeout.stop();
        }
      };
      /**
       * Resume timer. Returns number of milliseconds of timer remained.
       * If `timer` parameter isn't set, returns undefined.
       */

      const resumeTimer = () => {
        if (globalState.timeout) {
          const remaining = globalState.timeout.start();
          animateTimerProgressBar(remaining);
          return remaining;
        }
      };
      /**
       * Resume timer. Returns number of milliseconds of timer remained.
       * If `timer` parameter isn't set, returns undefined.
       */

      const toggleTimer = () => {
        const timer = globalState.timeout;
        return timer && (timer.running ? stopTimer() : resumeTimer());
      };
      /**
       * Increase timer. Returns number of milliseconds of an updated timer.
       * If `timer` parameter isn't set, returns undefined.
       */

      const increaseTimer = n => {
        if (globalState.timeout) {
          const remaining = globalState.timeout.increase(n);
          animateTimerProgressBar(remaining, true);
          return remaining;
        }
      };
      /**
       * Check if timer is running. Returns true if timer is running
       * or false if timer is paused or stopped.
       * If `timer` parameter isn't set, returns undefined
       */

      const isTimerRunning = () => {
        return globalState.timeout && globalState.timeout.isRunning();
      };

      let bodyClickListenerAdded = false;
      const clickHandlers = {};
      function bindClickHandler() {
        let attr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'data-swal-template';
        clickHandlers[attr] = this;

        if (!bodyClickListenerAdded) {
          document.body.addEventListener('click', bodyClickListener);
          bodyClickListenerAdded = true;
        }
      }

      const bodyClickListener = event => {
        for (let el = event.target; el && el !== document; el = el.parentNode) {
          for (const attr in clickHandlers) {
            const template = el.getAttribute(attr);

            if (template) {
              clickHandlers[attr].fire({
                template
              });
              return;
            }
          }
        }
      };

      const defaultParams = {
        title: '',
        titleText: '',
        text: '',
        html: '',
        footer: '',
        icon: undefined,
        iconColor: undefined,
        iconHtml: undefined,
        template: undefined,
        toast: false,
        showClass: {
          popup: 'swal2-show',
          backdrop: 'swal2-backdrop-show',
          icon: 'swal2-icon-show'
        },
        hideClass: {
          popup: 'swal2-hide',
          backdrop: 'swal2-backdrop-hide',
          icon: 'swal2-icon-hide'
        },
        customClass: {},
        target: 'body',
        color: undefined,
        backdrop: true,
        heightAuto: true,
        allowOutsideClick: true,
        allowEscapeKey: true,
        allowEnterKey: true,
        stopKeydownPropagation: true,
        keydownListenerCapture: false,
        showConfirmButton: true,
        showDenyButton: false,
        showCancelButton: false,
        preConfirm: undefined,
        preDeny: undefined,
        confirmButtonText: 'OK',
        confirmButtonAriaLabel: '',
        confirmButtonColor: undefined,
        denyButtonText: 'No',
        denyButtonAriaLabel: '',
        denyButtonColor: undefined,
        cancelButtonText: 'Cancel',
        cancelButtonAriaLabel: '',
        cancelButtonColor: undefined,
        buttonsStyling: true,
        reverseButtons: false,
        focusConfirm: true,
        focusDeny: false,
        focusCancel: false,
        returnFocus: true,
        showCloseButton: false,
        closeButtonHtml: '&times;',
        closeButtonAriaLabel: 'Close this dialog',
        loaderHtml: '',
        showLoaderOnConfirm: false,
        showLoaderOnDeny: false,
        imageUrl: undefined,
        imageWidth: undefined,
        imageHeight: undefined,
        imageAlt: '',
        timer: undefined,
        timerProgressBar: false,
        width: undefined,
        padding: undefined,
        background: undefined,
        input: undefined,
        inputPlaceholder: '',
        inputLabel: '',
        inputValue: '',
        inputOptions: {},
        inputAutoTrim: true,
        inputAttributes: {},
        inputValidator: undefined,
        returnInputValueOnDeny: false,
        validationMessage: undefined,
        grow: false,
        position: 'center',
        progressSteps: [],
        currentProgressStep: undefined,
        progressStepsDistance: undefined,
        willOpen: undefined,
        didOpen: undefined,
        didRender: undefined,
        willClose: undefined,
        didClose: undefined,
        didDestroy: undefined,
        scrollbarPadding: true
      };
      const updatableParams = ['allowEscapeKey', 'allowOutsideClick', 'background', 'buttonsStyling', 'cancelButtonAriaLabel', 'cancelButtonColor', 'cancelButtonText', 'closeButtonAriaLabel', 'closeButtonHtml', 'color', 'confirmButtonAriaLabel', 'confirmButtonColor', 'confirmButtonText', 'currentProgressStep', 'customClass', 'denyButtonAriaLabel', 'denyButtonColor', 'denyButtonText', 'didClose', 'didDestroy', 'footer', 'hideClass', 'html', 'icon', 'iconColor', 'iconHtml', 'imageAlt', 'imageHeight', 'imageUrl', 'imageWidth', 'preConfirm', 'preDeny', 'progressSteps', 'returnFocus', 'reverseButtons', 'showCancelButton', 'showCloseButton', 'showConfirmButton', 'showDenyButton', 'text', 'title', 'titleText', 'willClose'];
      const deprecatedParams = {};
      const toastIncompatibleParams = ['allowOutsideClick', 'allowEnterKey', 'backdrop', 'focusConfirm', 'focusDeny', 'focusCancel', 'returnFocus', 'heightAuto', 'keydownListenerCapture'];
      /**
       * Is valid parameter
       * @param {String} paramName
       */

      const isValidParameter = paramName => {
        return Object.prototype.hasOwnProperty.call(defaultParams, paramName);
      };
      /**
       * Is valid parameter for Swal.update() method
       * @param {String} paramName
       */

      const isUpdatableParameter = paramName => {
        return updatableParams.indexOf(paramName) !== -1;
      };
      /**
       * Is deprecated parameter
       * @param {String} paramName
       */

      const isDeprecatedParameter = paramName => {
        return deprecatedParams[paramName];
      };

      const checkIfParamIsValid = param => {
        if (!isValidParameter(param)) {
          warn("Unknown parameter \"".concat(param, "\""));
        }
      };

      const checkIfToastParamIsValid = param => {
        if (toastIncompatibleParams.includes(param)) {
          warn("The parameter \"".concat(param, "\" is incompatible with toasts"));
        }
      };

      const checkIfParamIsDeprecated = param => {
        if (isDeprecatedParameter(param)) {
          warnAboutDeprecation(param, isDeprecatedParameter(param));
        }
      };
      /**
       * Show relevant warnings for given params
       *
       * @param params
       */


      const showWarningsForParams = params => {
        if (!params.backdrop && params.allowOutsideClick) {
          warn('"allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`');
        }

        for (const param in params) {
          checkIfParamIsValid(param);

          if (params.toast) {
            checkIfToastParamIsValid(param);
          }

          checkIfParamIsDeprecated(param);
        }
      };



      var staticMethods = /*#__PURE__*/Object.freeze({
        isValidParameter: isValidParameter,
        isUpdatableParameter: isUpdatableParameter,
        isDeprecatedParameter: isDeprecatedParameter,
        argsToParams: argsToParams,
        isVisible: isVisible$1,
        clickConfirm: clickConfirm,
        clickDeny: clickDeny,
        clickCancel: clickCancel,
        getContainer: getContainer,
        getPopup: getPopup,
        getTitle: getTitle,
        getHtmlContainer: getHtmlContainer,
        getImage: getImage,
        getIcon: getIcon,
        getInputLabel: getInputLabel,
        getCloseButton: getCloseButton,
        getActions: getActions,
        getConfirmButton: getConfirmButton,
        getDenyButton: getDenyButton,
        getCancelButton: getCancelButton,
        getLoader: getLoader,
        getFooter: getFooter,
        getTimerProgressBar: getTimerProgressBar,
        getFocusableElements: getFocusableElements,
        getValidationMessage: getValidationMessage,
        isLoading: isLoading,
        fire: fire,
        mixin: mixin,
        showLoading: showLoading,
        enableLoading: showLoading,
        getTimerLeft: getTimerLeft,
        stopTimer: stopTimer,
        resumeTimer: resumeTimer,
        toggleTimer: toggleTimer,
        increaseTimer: increaseTimer,
        isTimerRunning: isTimerRunning,
        bindClickHandler: bindClickHandler
      });

      /**
       * Hides loader and shows back the button which was hidden by .showLoading()
       */

      function hideLoading() {
        // do nothing if popup is closed
        const innerParams = privateProps.innerParams.get(this);

        if (!innerParams) {
          return;
        }

        const domCache = privateProps.domCache.get(this);
        hide(domCache.loader);

        if (isToast()) {
          if (innerParams.icon) {
            show(getIcon());
          }
        } else {
          showRelatedButton(domCache);
        }

        removeClass([domCache.popup, domCache.actions], swalClasses.loading);
        domCache.popup.removeAttribute('aria-busy');
        domCache.popup.removeAttribute('data-loading');
        domCache.confirmButton.disabled = false;
        domCache.denyButton.disabled = false;
        domCache.cancelButton.disabled = false;
      }

      const showRelatedButton = domCache => {
        const buttonToReplace = domCache.popup.getElementsByClassName(domCache.loader.getAttribute('data-button-to-replace'));

        if (buttonToReplace.length) {
          show(buttonToReplace[0], 'inline-block');
        } else if (allButtonsAreHidden()) {
          hide(domCache.actions);
        }
      };

      function getInput$1(instance) {
        const innerParams = privateProps.innerParams.get(instance || this);
        const domCache = privateProps.domCache.get(instance || this);

        if (!domCache) {
          return null;
        }

        return getInput(domCache.popup, innerParams.input);
      }

      const fixScrollbar = () => {
        // for queues, do not do this more than once
        if (states.previousBodyPadding !== null) {
          return;
        } // if the body has overflow


        if (document.body.scrollHeight > window.innerHeight) {
          // add padding so the content doesn't shift after removal of scrollbar
          states.previousBodyPadding = parseInt(window.getComputedStyle(document.body).getPropertyValue('padding-right'));
          document.body.style.paddingRight = "".concat(states.previousBodyPadding + measureScrollbar(), "px");
        }
      };
      const undoScrollbar = () => {
        if (states.previousBodyPadding !== null) {
          document.body.style.paddingRight = "".concat(states.previousBodyPadding, "px");
          states.previousBodyPadding = null;
        }
      };

      /* istanbul ignore file */

      const iOSfix = () => {
        const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream || navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;

        if (iOS && !hasClass(document.body, swalClasses.iosfix)) {
          const offset = document.body.scrollTop;
          document.body.style.top = "".concat(offset * -1, "px");
          addClass(document.body, swalClasses.iosfix);
          lockBodyScroll();
          addBottomPaddingForTallPopups(); // #1948
        }
      };

      const addBottomPaddingForTallPopups = () => {
        const safari = !navigator.userAgent.match(/(CriOS|FxiOS|EdgiOS|YaBrowser|UCBrowser)/i);

        if (safari) {
          const bottomPanelHeight = 44;

          if (getPopup().scrollHeight > window.innerHeight - bottomPanelHeight) {
            getContainer().style.paddingBottom = "".concat(bottomPanelHeight, "px");
          }
        }
      };

      const lockBodyScroll = () => {
        // #1246
        const container = getContainer();
        let preventTouchMove;

        container.ontouchstart = e => {
          preventTouchMove = shouldPreventTouchMove(e);
        };

        container.ontouchmove = e => {
          if (preventTouchMove) {
            e.preventDefault();
            e.stopPropagation();
          }
        };
      };

      const shouldPreventTouchMove = event => {
        const target = event.target;
        const container = getContainer();

        if (isStylys(event) || isZoom(event)) {
          return false;
        }

        if (target === container) {
          return true;
        }

        if (!isScrollable(container) && target.tagName !== 'INPUT' && // #1603
        target.tagName !== 'TEXTAREA' && // #2266
        !(isScrollable(getHtmlContainer()) && // #1944
        getHtmlContainer().contains(target))) {
          return true;
        }

        return false;
      };

      const isStylys = event => {
        // #1786
        return event.touches && event.touches.length && event.touches[0].touchType === 'stylus';
      };

      const isZoom = event => {
        // #1891
        return event.touches && event.touches.length > 1;
      };

      const undoIOSfix = () => {
        if (hasClass(document.body, swalClasses.iosfix)) {
          const offset = parseInt(document.body.style.top, 10);
          removeClass(document.body, swalClasses.iosfix);
          document.body.style.top = '';
          document.body.scrollTop = offset * -1;
        }
      };

      // Adding aria-hidden="true" to elements outside of the active modal dialog ensures that
      // elements not within the active modal dialog will not be surfaced if a user opens a screen
      // reader’s list of elements (headings, form controls, landmarks, etc.) in the document.

      const setAriaHidden = () => {
        const bodyChildren = toArray(document.body.children);
        bodyChildren.forEach(el => {
          if (el === getContainer() || el.contains(getContainer())) {
            return;
          }

          if (el.hasAttribute('aria-hidden')) {
            el.setAttribute('data-previous-aria-hidden', el.getAttribute('aria-hidden'));
          }

          el.setAttribute('aria-hidden', 'true');
        });
      };
      const unsetAriaHidden = () => {
        const bodyChildren = toArray(document.body.children);
        bodyChildren.forEach(el => {
          if (el.hasAttribute('data-previous-aria-hidden')) {
            el.setAttribute('aria-hidden', el.getAttribute('data-previous-aria-hidden'));
            el.removeAttribute('data-previous-aria-hidden');
          } else {
            el.removeAttribute('aria-hidden');
          }
        });
      };

      /**
       * This module contains `WeakMap`s for each effectively-"private  property" that a `Swal` has.
       * For example, to set the private property "foo" of `this` to "bar", you can `privateProps.foo.set(this, 'bar')`
       * This is the approach that Babel will probably take to implement private methods/fields
       *   https://github.com/tc39/proposal-private-methods
       *   https://github.com/babel/babel/pull/7555
       * Once we have the changes from that PR in Babel, and our core class fits reasonable in *one module*
       *   then we can use that language feature.
       */
      var privateMethods = {
        swalPromiseResolve: new WeakMap(),
        swalPromiseReject: new WeakMap()
      };

      /*
       * Instance method to close sweetAlert
       */

      function removePopupAndResetState(instance, container, returnFocus, didClose) {
        if (isToast()) {
          triggerDidCloseAndDispose(instance, didClose);
        } else {
          restoreActiveElement(returnFocus).then(() => triggerDidCloseAndDispose(instance, didClose));
          globalState.keydownTarget.removeEventListener('keydown', globalState.keydownHandler, {
            capture: globalState.keydownListenerCapture
          });
          globalState.keydownHandlerAdded = false;
        }

        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent); // workaround for #2088
        // for some reason removing the container in Safari will scroll the document to bottom

        if (isSafari) {
          container.setAttribute('style', 'display:none !important');
          container.removeAttribute('class');
          container.innerHTML = '';
        } else {
          container.remove();
        }

        if (isModal()) {
          undoScrollbar();
          undoIOSfix();
          unsetAriaHidden();
        }

        removeBodyClasses();
      }

      function removeBodyClasses() {
        removeClass([document.documentElement, document.body], [swalClasses.shown, swalClasses['height-auto'], swalClasses['no-backdrop'], swalClasses['toast-shown']]);
      }

      function close(resolveValue) {
        resolveValue = prepareResolveValue(resolveValue);
        const swalPromiseResolve = privateMethods.swalPromiseResolve.get(this);
        const didClose = triggerClosePopup(this);

        if (this.isAwaitingPromise()) {
          // A swal awaiting for a promise (after a click on Confirm or Deny) cannot be dismissed anymore #2335
          if (!resolveValue.isDismissed) {
            handleAwaitingPromise(this);
            swalPromiseResolve(resolveValue);
          }
        } else if (didClose) {
          // Resolve Swal promise
          swalPromiseResolve(resolveValue);
        }
      }
      function isAwaitingPromise() {
        return !!privateProps.awaitingPromise.get(this);
      }

      const triggerClosePopup = instance => {
        const popup = getPopup();

        if (!popup) {
          return false;
        }

        const innerParams = privateProps.innerParams.get(instance);

        if (!innerParams || hasClass(popup, innerParams.hideClass.popup)) {
          return false;
        }

        removeClass(popup, innerParams.showClass.popup);
        addClass(popup, innerParams.hideClass.popup);
        const backdrop = getContainer();
        removeClass(backdrop, innerParams.showClass.backdrop);
        addClass(backdrop, innerParams.hideClass.backdrop);
        handlePopupAnimation(instance, popup, innerParams);
        return true;
      };

      function rejectPromise(error) {
        const rejectPromise = privateMethods.swalPromiseReject.get(this);
        handleAwaitingPromise(this);

        if (rejectPromise) {
          // Reject Swal promise
          rejectPromise(error);
        }
      }

      const handleAwaitingPromise = instance => {
        if (instance.isAwaitingPromise()) {
          privateProps.awaitingPromise.delete(instance); // The instance might have been previously partly destroyed, we must resume the destroy process in this case #2335

          if (!privateProps.innerParams.get(instance)) {
            instance._destroy();
          }
        }
      };

      const prepareResolveValue = resolveValue => {
        // When user calls Swal.close()
        if (typeof resolveValue === 'undefined') {
          return {
            isConfirmed: false,
            isDenied: false,
            isDismissed: true
          };
        }

        return Object.assign({
          isConfirmed: false,
          isDenied: false,
          isDismissed: false
        }, resolveValue);
      };

      const handlePopupAnimation = (instance, popup, innerParams) => {
        const container = getContainer(); // If animation is supported, animate

        const animationIsSupported = animationEndEvent && hasCssAnimation(popup);

        if (typeof innerParams.willClose === 'function') {
          innerParams.willClose(popup);
        }

        if (animationIsSupported) {
          animatePopup(instance, popup, container, innerParams.returnFocus, innerParams.didClose);
        } else {
          // Otherwise, remove immediately
          removePopupAndResetState(instance, container, innerParams.returnFocus, innerParams.didClose);
        }
      };

      const animatePopup = (instance, popup, container, returnFocus, didClose) => {
        globalState.swalCloseEventFinishedCallback = removePopupAndResetState.bind(null, instance, container, returnFocus, didClose);
        popup.addEventListener(animationEndEvent, function (e) {
          if (e.target === popup) {
            globalState.swalCloseEventFinishedCallback();
            delete globalState.swalCloseEventFinishedCallback;
          }
        });
      };

      const triggerDidCloseAndDispose = (instance, didClose) => {
        setTimeout(() => {
          if (typeof didClose === 'function') {
            didClose.bind(instance.params)();
          }

          instance._destroy();
        });
      };

      function setButtonsDisabled(instance, buttons, disabled) {
        const domCache = privateProps.domCache.get(instance);
        buttons.forEach(button => {
          domCache[button].disabled = disabled;
        });
      }

      function setInputDisabled(input, disabled) {
        if (!input) {
          return false;
        }

        if (input.type === 'radio') {
          const radiosContainer = input.parentNode.parentNode;
          const radios = radiosContainer.querySelectorAll('input');

          for (let i = 0; i < radios.length; i++) {
            radios[i].disabled = disabled;
          }
        } else {
          input.disabled = disabled;
        }
      }

      function enableButtons() {
        setButtonsDisabled(this, ['confirmButton', 'denyButton', 'cancelButton'], false);
      }
      function disableButtons() {
        setButtonsDisabled(this, ['confirmButton', 'denyButton', 'cancelButton'], true);
      }
      function enableInput() {
        return setInputDisabled(this.getInput(), false);
      }
      function disableInput() {
        return setInputDisabled(this.getInput(), true);
      }

      function showValidationMessage(error) {
        const domCache = privateProps.domCache.get(this);
        const params = privateProps.innerParams.get(this);
        setInnerHtml(domCache.validationMessage, error);
        domCache.validationMessage.className = swalClasses['validation-message'];

        if (params.customClass && params.customClass.validationMessage) {
          addClass(domCache.validationMessage, params.customClass.validationMessage);
        }

        show(domCache.validationMessage);
        const input = this.getInput();

        if (input) {
          input.setAttribute('aria-invalid', true);
          input.setAttribute('aria-describedby', swalClasses['validation-message']);
          focusInput(input);
          addClass(input, swalClasses.inputerror);
        }
      } // Hide block with validation message

      function resetValidationMessage$1() {
        const domCache = privateProps.domCache.get(this);

        if (domCache.validationMessage) {
          hide(domCache.validationMessage);
        }

        const input = this.getInput();

        if (input) {
          input.removeAttribute('aria-invalid');
          input.removeAttribute('aria-describedby');
          removeClass(input, swalClasses.inputerror);
        }
      }

      function getProgressSteps$1() {
        const domCache = privateProps.domCache.get(this);
        return domCache.progressSteps;
      }

      class Timer {
        constructor(callback, delay) {
          this.callback = callback;
          this.remaining = delay;
          this.running = false;
          this.start();
        }

        start() {
          if (!this.running) {
            this.running = true;
            this.started = new Date();
            this.id = setTimeout(this.callback, this.remaining);
          }

          return this.remaining;
        }

        stop() {
          if (this.running) {
            this.running = false;
            clearTimeout(this.id);
            this.remaining -= new Date() - this.started;
          }

          return this.remaining;
        }

        increase(n) {
          const running = this.running;

          if (running) {
            this.stop();
          }

          this.remaining += n;

          if (running) {
            this.start();
          }

          return this.remaining;
        }

        getTimerLeft() {
          if (this.running) {
            this.stop();
            this.start();
          }

          return this.remaining;
        }

        isRunning() {
          return this.running;
        }

      }

      var defaultInputValidators = {
        email: (string, validationMessage) => {
          return /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]{2,24}$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || 'Invalid email address');
        },
        url: (string, validationMessage) => {
          // taken from https://stackoverflow.com/a/3809435 with a small change from #1306 and #2013
          return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || 'Invalid URL');
        }
      };

      function setDefaultInputValidators(params) {
        // Use default `inputValidator` for supported input types if not provided
        if (!params.inputValidator) {
          Object.keys(defaultInputValidators).forEach(key => {
            if (params.input === key) {
              params.inputValidator = defaultInputValidators[key];
            }
          });
        }
      }

      function validateCustomTargetElement(params) {
        // Determine if the custom target element is valid
        if (!params.target || typeof params.target === 'string' && !document.querySelector(params.target) || typeof params.target !== 'string' && !params.target.appendChild) {
          warn('Target parameter is not valid, defaulting to "body"');
          params.target = 'body';
        }
      }
      /**
       * Set type, text and actions on popup
       *
       * @param params
       * @returns {boolean}
       */


      function setParameters(params) {
        setDefaultInputValidators(params); // showLoaderOnConfirm && preConfirm

        if (params.showLoaderOnConfirm && !params.preConfirm) {
          warn('showLoaderOnConfirm is set to true, but preConfirm is not defined.\n' + 'showLoaderOnConfirm should be used together with preConfirm, see usage example:\n' + 'https://sweetalert2.github.io/#ajax-request');
        }

        validateCustomTargetElement(params); // Replace newlines with <br> in title

        if (typeof params.title === 'string') {
          params.title = params.title.split('\n').join('<br />');
        }

        init(params);
      }

      const swalStringParams = ['swal-title', 'swal-html', 'swal-footer'];
      const getTemplateParams = params => {
        const template = typeof params.template === 'string' ? document.querySelector(params.template) : params.template;

        if (!template) {
          return {};
        }

        const templateContent = template.content;
        showWarningsForElements(templateContent);
        const result = Object.assign(getSwalParams(templateContent), getSwalButtons(templateContent), getSwalImage(templateContent), getSwalIcon(templateContent), getSwalInput(templateContent), getSwalStringParams(templateContent, swalStringParams));
        return result;
      };

      const getSwalParams = templateContent => {
        const result = {};
        toArray(templateContent.querySelectorAll('swal-param')).forEach(param => {
          showWarningsForAttributes(param, ['name', 'value']);
          const paramName = param.getAttribute('name');
          let value = param.getAttribute('value');

          if (typeof defaultParams[paramName] === 'boolean' && value === 'false') {
            value = false;
          }

          if (typeof defaultParams[paramName] === 'object') {
            value = JSON.parse(value);
          }

          result[paramName] = value;
        });
        return result;
      };

      const getSwalButtons = templateContent => {
        const result = {};
        toArray(templateContent.querySelectorAll('swal-button')).forEach(button => {
          showWarningsForAttributes(button, ['type', 'color', 'aria-label']);
          const type = button.getAttribute('type');
          result["".concat(type, "ButtonText")] = button.innerHTML;
          result["show".concat(capitalizeFirstLetter(type), "Button")] = true;

          if (button.hasAttribute('color')) {
            result["".concat(type, "ButtonColor")] = button.getAttribute('color');
          }

          if (button.hasAttribute('aria-label')) {
            result["".concat(type, "ButtonAriaLabel")] = button.getAttribute('aria-label');
          }
        });
        return result;
      };

      const getSwalImage = templateContent => {
        const result = {};
        const image = templateContent.querySelector('swal-image');

        if (image) {
          showWarningsForAttributes(image, ['src', 'width', 'height', 'alt']);

          if (image.hasAttribute('src')) {
            result.imageUrl = image.getAttribute('src');
          }

          if (image.hasAttribute('width')) {
            result.imageWidth = image.getAttribute('width');
          }

          if (image.hasAttribute('height')) {
            result.imageHeight = image.getAttribute('height');
          }

          if (image.hasAttribute('alt')) {
            result.imageAlt = image.getAttribute('alt');
          }
        }

        return result;
      };

      const getSwalIcon = templateContent => {
        const result = {};
        const icon = templateContent.querySelector('swal-icon');

        if (icon) {
          showWarningsForAttributes(icon, ['type', 'color']);

          if (icon.hasAttribute('type')) {
            result.icon = icon.getAttribute('type');
          }

          if (icon.hasAttribute('color')) {
            result.iconColor = icon.getAttribute('color');
          }

          result.iconHtml = icon.innerHTML;
        }

        return result;
      };

      const getSwalInput = templateContent => {
        const result = {};
        const input = templateContent.querySelector('swal-input');

        if (input) {
          showWarningsForAttributes(input, ['type', 'label', 'placeholder', 'value']);
          result.input = input.getAttribute('type') || 'text';

          if (input.hasAttribute('label')) {
            result.inputLabel = input.getAttribute('label');
          }

          if (input.hasAttribute('placeholder')) {
            result.inputPlaceholder = input.getAttribute('placeholder');
          }

          if (input.hasAttribute('value')) {
            result.inputValue = input.getAttribute('value');
          }
        }

        const inputOptions = templateContent.querySelectorAll('swal-input-option');

        if (inputOptions.length) {
          result.inputOptions = {};
          toArray(inputOptions).forEach(option => {
            showWarningsForAttributes(option, ['value']);
            const optionValue = option.getAttribute('value');
            const optionName = option.innerHTML;
            result.inputOptions[optionValue] = optionName;
          });
        }

        return result;
      };

      const getSwalStringParams = (templateContent, paramNames) => {
        const result = {};

        for (const i in paramNames) {
          const paramName = paramNames[i];
          const tag = templateContent.querySelector(paramName);

          if (tag) {
            showWarningsForAttributes(tag, []);
            result[paramName.replace(/^swal-/, '')] = tag.innerHTML.trim();
          }
        }

        return result;
      };

      const showWarningsForElements = template => {
        const allowedElements = swalStringParams.concat(['swal-param', 'swal-button', 'swal-image', 'swal-icon', 'swal-input', 'swal-input-option']);
        toArray(template.children).forEach(el => {
          const tagName = el.tagName.toLowerCase();

          if (allowedElements.indexOf(tagName) === -1) {
            warn("Unrecognized element <".concat(tagName, ">"));
          }
        });
      };

      const showWarningsForAttributes = (el, allowedAttributes) => {
        toArray(el.attributes).forEach(attribute => {
          if (allowedAttributes.indexOf(attribute.name) === -1) {
            warn(["Unrecognized attribute \"".concat(attribute.name, "\" on <").concat(el.tagName.toLowerCase(), ">."), "".concat(allowedAttributes.length ? "Allowed attributes are: ".concat(allowedAttributes.join(', ')) : 'To set the value, use HTML within the element.')]);
          }
        });
      };

      const SHOW_CLASS_TIMEOUT = 10;
      /**
       * Open popup, add necessary classes and styles, fix scrollbar
       *
       * @param params
       */

      const openPopup = params => {
        const container = getContainer();
        const popup = getPopup();

        if (typeof params.willOpen === 'function') {
          params.willOpen(popup);
        }

        const bodyStyles = window.getComputedStyle(document.body);
        const initialBodyOverflow = bodyStyles.overflowY;
        addClasses$1(container, popup, params); // scrolling is 'hidden' until animation is done, after that 'auto'

        setTimeout(() => {
          setScrollingVisibility(container, popup);
        }, SHOW_CLASS_TIMEOUT);

        if (isModal()) {
          fixScrollContainer(container, params.scrollbarPadding, initialBodyOverflow);
          setAriaHidden();
        }

        if (!isToast() && !globalState.previousActiveElement) {
          globalState.previousActiveElement = document.activeElement;
        }

        if (typeof params.didOpen === 'function') {
          setTimeout(() => params.didOpen(popup));
        }

        removeClass(container, swalClasses['no-transition']);
      };

      const swalOpenAnimationFinished = event => {
        const popup = getPopup();

        if (event.target !== popup) {
          return;
        }

        const container = getContainer();
        popup.removeEventListener(animationEndEvent, swalOpenAnimationFinished);
        container.style.overflowY = 'auto';
      };

      const setScrollingVisibility = (container, popup) => {
        if (animationEndEvent && hasCssAnimation(popup)) {
          container.style.overflowY = 'hidden';
          popup.addEventListener(animationEndEvent, swalOpenAnimationFinished);
        } else {
          container.style.overflowY = 'auto';
        }
      };

      const fixScrollContainer = (container, scrollbarPadding, initialBodyOverflow) => {
        iOSfix();

        if (scrollbarPadding && initialBodyOverflow !== 'hidden') {
          fixScrollbar();
        } // sweetalert2/issues/1247


        setTimeout(() => {
          container.scrollTop = 0;
        });
      };

      const addClasses$1 = (container, popup, params) => {
        addClass(container, params.showClass.backdrop); // the workaround with setting/unsetting opacity is needed for #2019 and 2059

        popup.style.setProperty('opacity', '0', 'important');
        show(popup, 'grid');
        setTimeout(() => {
          // Animate popup right after showing it
          addClass(popup, params.showClass.popup); // and remove the opacity workaround

          popup.style.removeProperty('opacity');
        }, SHOW_CLASS_TIMEOUT); // 10ms in order to fix #2062

        addClass([document.documentElement, document.body], swalClasses.shown);

        if (params.heightAuto && params.backdrop && !params.toast) {
          addClass([document.documentElement, document.body], swalClasses['height-auto']);
        }
      };

      const handleInputOptionsAndValue = (instance, params) => {
        if (params.input === 'select' || params.input === 'radio') {
          handleInputOptions(instance, params);
        } else if (['text', 'email', 'number', 'tel', 'textarea'].includes(params.input) && (hasToPromiseFn(params.inputValue) || isPromise(params.inputValue))) {
          showLoading(getConfirmButton());
          handleInputValue(instance, params);
        }
      };
      const getInputValue = (instance, innerParams) => {
        const input = instance.getInput();

        if (!input) {
          return null;
        }

        switch (innerParams.input) {
          case 'checkbox':
            return getCheckboxValue(input);

          case 'radio':
            return getRadioValue(input);

          case 'file':
            return getFileValue(input);

          default:
            return innerParams.inputAutoTrim ? input.value.trim() : input.value;
        }
      };

      const getCheckboxValue = input => input.checked ? 1 : 0;

      const getRadioValue = input => input.checked ? input.value : null;

      const getFileValue = input => input.files.length ? input.getAttribute('multiple') !== null ? input.files : input.files[0] : null;

      const handleInputOptions = (instance, params) => {
        const popup = getPopup();

        const processInputOptions = inputOptions => populateInputOptions[params.input](popup, formatInputOptions(inputOptions), params);

        if (hasToPromiseFn(params.inputOptions) || isPromise(params.inputOptions)) {
          showLoading(getConfirmButton());
          asPromise(params.inputOptions).then(inputOptions => {
            instance.hideLoading();
            processInputOptions(inputOptions);
          });
        } else if (typeof params.inputOptions === 'object') {
          processInputOptions(params.inputOptions);
        } else {
          error("Unexpected type of inputOptions! Expected object, Map or Promise, got ".concat(typeof params.inputOptions));
        }
      };

      const handleInputValue = (instance, params) => {
        const input = instance.getInput();
        hide(input);
        asPromise(params.inputValue).then(inputValue => {
          input.value = params.input === 'number' ? parseFloat(inputValue) || 0 : "".concat(inputValue);
          show(input);
          input.focus();
          instance.hideLoading();
        }).catch(err => {
          error("Error in inputValue promise: ".concat(err));
          input.value = '';
          show(input);
          input.focus();
          instance.hideLoading();
        });
      };

      const populateInputOptions = {
        select: (popup, inputOptions, params) => {
          const select = getChildByClass(popup, swalClasses.select);

          const renderOption = (parent, optionLabel, optionValue) => {
            const option = document.createElement('option');
            option.value = optionValue;
            setInnerHtml(option, optionLabel);
            option.selected = isSelected(optionValue, params.inputValue);
            parent.appendChild(option);
          };

          inputOptions.forEach(inputOption => {
            const optionValue = inputOption[0];
            const optionLabel = inputOption[1]; // <optgroup> spec:
            // https://www.w3.org/TR/html401/interact/forms.html#h-17.6
            // "...all OPTGROUP elements must be specified directly within a SELECT element (i.e., groups may not be nested)..."
            // check whether this is a <optgroup>

            if (Array.isArray(optionLabel)) {
              // if it is an array, then it is an <optgroup>
              const optgroup = document.createElement('optgroup');
              optgroup.label = optionValue;
              optgroup.disabled = false; // not configurable for now

              select.appendChild(optgroup);
              optionLabel.forEach(o => renderOption(optgroup, o[1], o[0]));
            } else {
              // case of <option>
              renderOption(select, optionLabel, optionValue);
            }
          });
          select.focus();
        },
        radio: (popup, inputOptions, params) => {
          const radio = getChildByClass(popup, swalClasses.radio);
          inputOptions.forEach(inputOption => {
            const radioValue = inputOption[0];
            const radioLabel = inputOption[1];
            const radioInput = document.createElement('input');
            const radioLabelElement = document.createElement('label');
            radioInput.type = 'radio';
            radioInput.name = swalClasses.radio;
            radioInput.value = radioValue;

            if (isSelected(radioValue, params.inputValue)) {
              radioInput.checked = true;
            }

            const label = document.createElement('span');
            setInnerHtml(label, radioLabel);
            label.className = swalClasses.label;
            radioLabelElement.appendChild(radioInput);
            radioLabelElement.appendChild(label);
            radio.appendChild(radioLabelElement);
          });
          const radios = radio.querySelectorAll('input');

          if (radios.length) {
            radios[0].focus();
          }
        }
      };
      /**
       * Converts `inputOptions` into an array of `[value, label]`s
       * @param inputOptions
       */

      const formatInputOptions = inputOptions => {
        const result = [];

        if (typeof Map !== 'undefined' && inputOptions instanceof Map) {
          inputOptions.forEach((value, key) => {
            let valueFormatted = value;

            if (typeof valueFormatted === 'object') {
              // case of <optgroup>
              valueFormatted = formatInputOptions(valueFormatted);
            }

            result.push([key, valueFormatted]);
          });
        } else {
          Object.keys(inputOptions).forEach(key => {
            let valueFormatted = inputOptions[key];

            if (typeof valueFormatted === 'object') {
              // case of <optgroup>
              valueFormatted = formatInputOptions(valueFormatted);
            }

            result.push([key, valueFormatted]);
          });
        }

        return result;
      };

      const isSelected = (optionValue, inputValue) => {
        return inputValue && inputValue.toString() === optionValue.toString();
      };

      const handleConfirmButtonClick = instance => {
        const innerParams = privateProps.innerParams.get(instance);
        instance.disableButtons();

        if (innerParams.input) {
          handleConfirmOrDenyWithInput(instance, 'confirm');
        } else {
          confirm(instance, true);
        }
      };
      const handleDenyButtonClick = instance => {
        const innerParams = privateProps.innerParams.get(instance);
        instance.disableButtons();

        if (innerParams.returnInputValueOnDeny) {
          handleConfirmOrDenyWithInput(instance, 'deny');
        } else {
          deny(instance, false);
        }
      };
      const handleCancelButtonClick = (instance, dismissWith) => {
        instance.disableButtons();
        dismissWith(DismissReason.cancel);
      };

      const handleConfirmOrDenyWithInput = (instance, type
      /* 'confirm' | 'deny' */
      ) => {
        const innerParams = privateProps.innerParams.get(instance);
        const inputValue = getInputValue(instance, innerParams);

        if (innerParams.inputValidator) {
          handleInputValidator(instance, inputValue, type);
        } else if (!instance.getInput().checkValidity()) {
          instance.enableButtons();
          instance.showValidationMessage(innerParams.validationMessage);
        } else if (type === 'deny') {
          deny(instance, inputValue);
        } else {
          confirm(instance, inputValue);
        }
      };

      const handleInputValidator = (instance, inputValue, type
      /* 'confirm' | 'deny' */
      ) => {
        const innerParams = privateProps.innerParams.get(instance);
        instance.disableInput();
        const validationPromise = Promise.resolve().then(() => asPromise(innerParams.inputValidator(inputValue, innerParams.validationMessage)));
        validationPromise.then(validationMessage => {
          instance.enableButtons();
          instance.enableInput();

          if (validationMessage) {
            instance.showValidationMessage(validationMessage);
          } else if (type === 'deny') {
            deny(instance, inputValue);
          } else {
            confirm(instance, inputValue);
          }
        });
      };

      const deny = (instance, value) => {
        const innerParams = privateProps.innerParams.get(instance || undefined);

        if (innerParams.showLoaderOnDeny) {
          showLoading(getDenyButton());
        }

        if (innerParams.preDeny) {
          privateProps.awaitingPromise.set(instance || undefined, true); // Flagging the instance as awaiting a promise so it's own promise's reject/resolve methods doesnt get destroyed until the result from this preDeny's promise is received

          const preDenyPromise = Promise.resolve().then(() => asPromise(innerParams.preDeny(value, innerParams.validationMessage)));
          preDenyPromise.then(preDenyValue => {
            if (preDenyValue === false) {
              instance.hideLoading();
            } else {
              instance.closePopup({
                isDenied: true,
                value: typeof preDenyValue === 'undefined' ? value : preDenyValue
              });
            }
          }).catch(error$$1 => rejectWith(instance || undefined, error$$1));
        } else {
          instance.closePopup({
            isDenied: true,
            value
          });
        }
      };

      const succeedWith = (instance, value) => {
        instance.closePopup({
          isConfirmed: true,
          value
        });
      };

      const rejectWith = (instance, error$$1) => {
        instance.rejectPromise(error$$1);
      };

      const confirm = (instance, value) => {
        const innerParams = privateProps.innerParams.get(instance || undefined);

        if (innerParams.showLoaderOnConfirm) {
          showLoading();
        }

        if (innerParams.preConfirm) {
          instance.resetValidationMessage();
          privateProps.awaitingPromise.set(instance || undefined, true); // Flagging the instance as awaiting a promise so it's own promise's reject/resolve methods doesnt get destroyed until the result from this preConfirm's promise is received

          const preConfirmPromise = Promise.resolve().then(() => asPromise(innerParams.preConfirm(value, innerParams.validationMessage)));
          preConfirmPromise.then(preConfirmValue => {
            if (isVisible(getValidationMessage()) || preConfirmValue === false) {
              instance.hideLoading();
            } else {
              succeedWith(instance, typeof preConfirmValue === 'undefined' ? value : preConfirmValue);
            }
          }).catch(error$$1 => rejectWith(instance || undefined, error$$1));
        } else {
          succeedWith(instance, value);
        }
      };

      const addKeydownHandler = (instance, globalState, innerParams, dismissWith) => {
        if (globalState.keydownTarget && globalState.keydownHandlerAdded) {
          globalState.keydownTarget.removeEventListener('keydown', globalState.keydownHandler, {
            capture: globalState.keydownListenerCapture
          });
          globalState.keydownHandlerAdded = false;
        }

        if (!innerParams.toast) {
          globalState.keydownHandler = e => keydownHandler(instance, e, dismissWith);

          globalState.keydownTarget = innerParams.keydownListenerCapture ? window : getPopup();
          globalState.keydownListenerCapture = innerParams.keydownListenerCapture;
          globalState.keydownTarget.addEventListener('keydown', globalState.keydownHandler, {
            capture: globalState.keydownListenerCapture
          });
          globalState.keydownHandlerAdded = true;
        }
      }; // Focus handling

      const setFocus = (innerParams, index, increment) => {
        const focusableElements = getFocusableElements(); // search for visible elements and select the next possible match

        if (focusableElements.length) {
          index = index + increment; // rollover to first item

          if (index === focusableElements.length) {
            index = 0; // go to last item
          } else if (index === -1) {
            index = focusableElements.length - 1;
          }

          return focusableElements[index].focus();
        } // no visible focusable elements, focus the popup


        getPopup().focus();
      };
      const arrowKeysNextButton = ['ArrowRight', 'ArrowDown'];
      const arrowKeysPreviousButton = ['ArrowLeft', 'ArrowUp'];

      const keydownHandler = (instance, e, dismissWith) => {
        const innerParams = privateProps.innerParams.get(instance);

        if (!innerParams) {
          return; // This instance has already been destroyed
        }

        if (innerParams.stopKeydownPropagation) {
          e.stopPropagation();
        } // ENTER


        if (e.key === 'Enter') {
          handleEnter(instance, e, innerParams); // TAB
        } else if (e.key === 'Tab') {
          handleTab(e, innerParams); // ARROWS - switch focus between buttons
        } else if ([...arrowKeysNextButton, ...arrowKeysPreviousButton].includes(e.key)) {
          handleArrows(e.key); // ESC
        } else if (e.key === 'Escape') {
          handleEsc(e, innerParams, dismissWith);
        }
      };

      const handleEnter = (instance, e, innerParams) => {
        // #720 #721
        if (e.isComposing) {
          return;
        }

        if (e.target && instance.getInput() && e.target.outerHTML === instance.getInput().outerHTML) {
          if (['textarea', 'file'].includes(innerParams.input)) {
            return; // do not submit
          }

          clickConfirm();
          e.preventDefault();
        }
      };

      const handleTab = (e, innerParams) => {
        const targetElement = e.target;
        const focusableElements = getFocusableElements();
        let btnIndex = -1;

        for (let i = 0; i < focusableElements.length; i++) {
          if (targetElement === focusableElements[i]) {
            btnIndex = i;
            break;
          }
        }

        if (!e.shiftKey) {
          // Cycle to the next button
          setFocus(innerParams, btnIndex, 1);
        } else {
          // Cycle to the prev button
          setFocus(innerParams, btnIndex, -1);
        }

        e.stopPropagation();
        e.preventDefault();
      };

      const handleArrows = key => {
        const confirmButton = getConfirmButton();
        const denyButton = getDenyButton();
        const cancelButton = getCancelButton();

        if (![confirmButton, denyButton, cancelButton].includes(document.activeElement)) {
          return;
        }

        const sibling = arrowKeysNextButton.includes(key) ? 'nextElementSibling' : 'previousElementSibling';
        const buttonToFocus = document.activeElement[sibling];

        if (buttonToFocus) {
          buttonToFocus.focus();
        }
      };

      const handleEsc = (e, innerParams, dismissWith) => {
        if (callIfFunction(innerParams.allowEscapeKey)) {
          e.preventDefault();
          dismissWith(DismissReason.esc);
        }
      };

      const handlePopupClick = (instance, domCache, dismissWith) => {
        const innerParams = privateProps.innerParams.get(instance);

        if (innerParams.toast) {
          handleToastClick(instance, domCache, dismissWith);
        } else {
          // Ignore click events that had mousedown on the popup but mouseup on the container
          // This can happen when the user drags a slider
          handleModalMousedown(domCache); // Ignore click events that had mousedown on the container but mouseup on the popup

          handleContainerMousedown(domCache);
          handleModalClick(instance, domCache, dismissWith);
        }
      };

      const handleToastClick = (instance, domCache, dismissWith) => {
        // Closing toast by internal click
        domCache.popup.onclick = () => {
          const innerParams = privateProps.innerParams.get(instance);

          if (innerParams.showConfirmButton || innerParams.showDenyButton || innerParams.showCancelButton || innerParams.showCloseButton || innerParams.timer || innerParams.input) {
            return;
          }

          dismissWith(DismissReason.close);
        };
      };

      let ignoreOutsideClick = false;

      const handleModalMousedown = domCache => {
        domCache.popup.onmousedown = () => {
          domCache.container.onmouseup = function (e) {
            domCache.container.onmouseup = undefined; // We only check if the mouseup target is the container because usually it doesn't
            // have any other direct children aside of the popup

            if (e.target === domCache.container) {
              ignoreOutsideClick = true;
            }
          };
        };
      };

      const handleContainerMousedown = domCache => {
        domCache.container.onmousedown = () => {
          domCache.popup.onmouseup = function (e) {
            domCache.popup.onmouseup = undefined; // We also need to check if the mouseup target is a child of the popup

            if (e.target === domCache.popup || domCache.popup.contains(e.target)) {
              ignoreOutsideClick = true;
            }
          };
        };
      };

      const handleModalClick = (instance, domCache, dismissWith) => {
        domCache.container.onclick = e => {
          const innerParams = privateProps.innerParams.get(instance);

          if (ignoreOutsideClick) {
            ignoreOutsideClick = false;
            return;
          }

          if (e.target === domCache.container && callIfFunction(innerParams.allowOutsideClick)) {
            dismissWith(DismissReason.backdrop);
          }
        };
      };

      function _main(userParams) {
        let mixinParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        showWarningsForParams(Object.assign({}, mixinParams, userParams));

        if (globalState.currentInstance) {
          globalState.currentInstance._destroy();

          if (isModal()) {
            unsetAriaHidden();
          }
        }

        globalState.currentInstance = this;
        const innerParams = prepareParams(userParams, mixinParams);
        setParameters(innerParams);
        Object.freeze(innerParams); // clear the previous timer

        if (globalState.timeout) {
          globalState.timeout.stop();
          delete globalState.timeout;
        } // clear the restore focus timeout


        clearTimeout(globalState.restoreFocusTimeout);
        const domCache = populateDomCache(this);
        render(this, innerParams);
        privateProps.innerParams.set(this, innerParams);
        return swalPromise(this, domCache, innerParams);
      }

      const prepareParams = (userParams, mixinParams) => {
        const templateParams = getTemplateParams(userParams);
        const params = Object.assign({}, defaultParams, mixinParams, templateParams, userParams); // precedence is described in #2131

        params.showClass = Object.assign({}, defaultParams.showClass, params.showClass);
        params.hideClass = Object.assign({}, defaultParams.hideClass, params.hideClass);
        return params;
      };

      const swalPromise = (instance, domCache, innerParams) => {
        return new Promise((resolve, reject) => {
          // functions to handle all closings/dismissals
          const dismissWith = dismiss => {
            instance.closePopup({
              isDismissed: true,
              dismiss
            });
          };

          privateMethods.swalPromiseResolve.set(instance, resolve);
          privateMethods.swalPromiseReject.set(instance, reject);

          domCache.confirmButton.onclick = () => handleConfirmButtonClick(instance);

          domCache.denyButton.onclick = () => handleDenyButtonClick(instance);

          domCache.cancelButton.onclick = () => handleCancelButtonClick(instance, dismissWith);

          domCache.closeButton.onclick = () => dismissWith(DismissReason.close);

          handlePopupClick(instance, domCache, dismissWith);
          addKeydownHandler(instance, globalState, innerParams, dismissWith);
          handleInputOptionsAndValue(instance, innerParams);
          openPopup(innerParams);
          setupTimer(globalState, innerParams, dismissWith);
          initFocus(domCache, innerParams); // Scroll container to top on open (#1247, #1946)

          setTimeout(() => {
            domCache.container.scrollTop = 0;
          });
        });
      };

      const populateDomCache = instance => {
        const domCache = {
          popup: getPopup(),
          container: getContainer(),
          actions: getActions(),
          confirmButton: getConfirmButton(),
          denyButton: getDenyButton(),
          cancelButton: getCancelButton(),
          loader: getLoader(),
          closeButton: getCloseButton(),
          validationMessage: getValidationMessage(),
          progressSteps: getProgressSteps()
        };
        privateProps.domCache.set(instance, domCache);
        return domCache;
      };

      const setupTimer = (globalState$$1, innerParams, dismissWith) => {
        const timerProgressBar = getTimerProgressBar();
        hide(timerProgressBar);

        if (innerParams.timer) {
          globalState$$1.timeout = new Timer(() => {
            dismissWith('timer');
            delete globalState$$1.timeout;
          }, innerParams.timer);

          if (innerParams.timerProgressBar) {
            show(timerProgressBar);
            setTimeout(() => {
              if (globalState$$1.timeout && globalState$$1.timeout.running) {
                // timer can be already stopped or unset at this point
                animateTimerProgressBar(innerParams.timer);
              }
            });
          }
        }
      };

      const initFocus = (domCache, innerParams) => {
        if (innerParams.toast) {
          return;
        }

        if (!callIfFunction(innerParams.allowEnterKey)) {
          return blurActiveElement();
        }

        if (!focusButton(domCache, innerParams)) {
          setFocus(innerParams, -1, 1);
        }
      };

      const focusButton = (domCache, innerParams) => {
        if (innerParams.focusDeny && isVisible(domCache.denyButton)) {
          domCache.denyButton.focus();
          return true;
        }

        if (innerParams.focusCancel && isVisible(domCache.cancelButton)) {
          domCache.cancelButton.focus();
          return true;
        }

        if (innerParams.focusConfirm && isVisible(domCache.confirmButton)) {
          domCache.confirmButton.focus();
          return true;
        }

        return false;
      };

      const blurActiveElement = () => {
        if (document.activeElement && typeof document.activeElement.blur === 'function') {
          document.activeElement.blur();
        }
      };

      /**
       * Updates popup parameters.
       */

      function update(params) {
        const popup = getPopup();
        const innerParams = privateProps.innerParams.get(this);

        if (!popup || hasClass(popup, innerParams.hideClass.popup)) {
          return warn("You're trying to update the closed or closing popup, that won't work. Use the update() method in preConfirm parameter or show a new popup.");
        }

        const validUpdatableParams = {}; // assign valid params from `params` to `defaults`

        Object.keys(params).forEach(param => {
          if (Swal.isUpdatableParameter(param)) {
            validUpdatableParams[param] = params[param];
          } else {
            warn("Invalid parameter to update: \"".concat(param, "\". Updatable params are listed here: https://github.com/sweetalert2/sweetalert2/blob/master/src/utils/params.js\n\nIf you think this parameter should be updatable, request it here: https://github.com/sweetalert2/sweetalert2/issues/new?template=02_feature_request.md"));
          }
        });
        const updatedParams = Object.assign({}, innerParams, validUpdatableParams);
        render(this, updatedParams);
        privateProps.innerParams.set(this, updatedParams);
        Object.defineProperties(this, {
          params: {
            value: Object.assign({}, this.params, params),
            writable: false,
            enumerable: true
          }
        });
      }

      function _destroy() {
        const domCache = privateProps.domCache.get(this);
        const innerParams = privateProps.innerParams.get(this);

        if (!innerParams) {
          disposeWeakMaps(this); // The WeakMaps might have been partly destroyed, we must recall it to dispose any remaining weakmaps #2335

          return; // This instance has already been destroyed
        } // Check if there is another Swal closing


        if (domCache.popup && globalState.swalCloseEventFinishedCallback) {
          globalState.swalCloseEventFinishedCallback();
          delete globalState.swalCloseEventFinishedCallback;
        } // Check if there is a swal disposal defer timer


        if (globalState.deferDisposalTimer) {
          clearTimeout(globalState.deferDisposalTimer);
          delete globalState.deferDisposalTimer;
        }

        if (typeof innerParams.didDestroy === 'function') {
          innerParams.didDestroy();
        }

        disposeSwal(this);
      }

      const disposeSwal = instance => {
        disposeWeakMaps(instance); // Unset this.params so GC will dispose it (#1569)

        delete instance.params; // Unset globalState props so GC will dispose globalState (#1569)

        delete globalState.keydownHandler;
        delete globalState.keydownTarget; // Unset currentInstance

        delete globalState.currentInstance;
      };

      const disposeWeakMaps = instance => {
        // If the current instance is awaiting a promise result, we keep the privateMethods to call them once the promise result is retrieved #2335
        if (instance.isAwaitingPromise()) {
          unsetWeakMaps(privateProps, instance);
          privateProps.awaitingPromise.set(instance, true);
        } else {
          unsetWeakMaps(privateMethods, instance);
          unsetWeakMaps(privateProps, instance);
        }
      };

      const unsetWeakMaps = (obj, instance) => {
        for (const i in obj) {
          obj[i].delete(instance);
        }
      };



      var instanceMethods = /*#__PURE__*/Object.freeze({
        hideLoading: hideLoading,
        disableLoading: hideLoading,
        getInput: getInput$1,
        close: close,
        isAwaitingPromise: isAwaitingPromise,
        rejectPromise: rejectPromise,
        closePopup: close,
        closeModal: close,
        closeToast: close,
        enableButtons: enableButtons,
        disableButtons: disableButtons,
        enableInput: enableInput,
        disableInput: disableInput,
        showValidationMessage: showValidationMessage,
        resetValidationMessage: resetValidationMessage$1,
        getProgressSteps: getProgressSteps$1,
        _main: _main,
        update: update,
        _destroy: _destroy
      });

      let currentInstance;

      class SweetAlert {
        constructor() {
          // Prevent run in Node env
          if (typeof window === 'undefined') {
            return;
          }

          currentInstance = this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          const outerParams = Object.freeze(this.constructor.argsToParams(args));
          Object.defineProperties(this, {
            params: {
              value: outerParams,
              writable: false,
              enumerable: true,
              configurable: true
            }
          });

          const promise = this._main(this.params);

          privateProps.promise.set(this, promise);
        } // `catch` cannot be the name of a module export, so we define our thenable methods here instead


        then(onFulfilled) {
          const promise = privateProps.promise.get(this);
          return promise.then(onFulfilled);
        }

        finally(onFinally) {
          const promise = privateProps.promise.get(this);
          return promise.finally(onFinally);
        }

      } // Assign instance methods from src/instanceMethods/*.js to prototype


      Object.assign(SweetAlert.prototype, instanceMethods); // Assign static methods from src/staticMethods/*.js to constructor

      Object.assign(SweetAlert, staticMethods); // Proxy to instance methods to constructor, for now, for backwards compatibility

      Object.keys(instanceMethods).forEach(key => {
        SweetAlert[key] = function () {
          if (currentInstance) {
            return currentInstance[key](...arguments);
          }
        };
      });
      SweetAlert.DismissReason = DismissReason;
      SweetAlert.version = '11.3.0';

      const Swal = SweetAlert;
      Swal.default = Swal;

      return Swal;

    }));
    if (typeof commonjsGlobal !== 'undefined' && commonjsGlobal.Sweetalert2){  commonjsGlobal.swal = commonjsGlobal.sweetAlert = commonjsGlobal.Swal = commonjsGlobal.SweetAlert = commonjsGlobal.Sweetalert2;}

    "undefined"!=typeof document&&function(e,t){var n=e.createElement("style");if(e.getElementsByTagName("head")[0].appendChild(n),n.styleSheet)n.styleSheet.disabled||(n.styleSheet.cssText=t);else try{n.innerHTML=t;}catch(e){n.innerText=t;}}(document,".swal2-popup.swal2-toast{box-sizing:border-box;grid-column:1/4!important;grid-row:1/4!important;grid-template-columns:1fr 99fr 1fr;padding:1em;overflow-y:hidden;background:#fff;box-shadow:0 0 1px rgba(0,0,0,.075),0 1px 2px rgba(0,0,0,.075),1px 2px 4px rgba(0,0,0,.075),1px 3px 8px rgba(0,0,0,.075),2px 4px 16px rgba(0,0,0,.075);pointer-events:all}.swal2-popup.swal2-toast>*{grid-column:2}.swal2-popup.swal2-toast .swal2-title{margin:.5em 1em;padding:0;font-size:1em;text-align:initial}.swal2-popup.swal2-toast .swal2-loading{justify-content:center}.swal2-popup.swal2-toast .swal2-input{height:2em;margin:.5em;font-size:1em}.swal2-popup.swal2-toast .swal2-validation-message{font-size:1em}.swal2-popup.swal2-toast .swal2-footer{margin:.5em 0 0;padding:.5em 0 0;font-size:.8em}.swal2-popup.swal2-toast .swal2-close{grid-column:3/3;grid-row:1/99;align-self:center;width:.8em;height:.8em;margin:0;font-size:2em}.swal2-popup.swal2-toast .swal2-html-container{margin:.5em 1em;padding:0;font-size:1em;text-align:initial}.swal2-popup.swal2-toast .swal2-html-container:empty{padding:0}.swal2-popup.swal2-toast .swal2-loader{grid-column:1;grid-row:1/99;align-self:center;width:2em;height:2em;margin:.25em}.swal2-popup.swal2-toast .swal2-icon{grid-column:1;grid-row:1/99;align-self:center;width:2em;min-width:2em;height:2em;margin:0 .5em 0 0}.swal2-popup.swal2-toast .swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:1.8em;font-weight:700}.swal2-popup.swal2-toast .swal2-icon.swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line]{top:.875em;width:1.375em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:.3125em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:.3125em}.swal2-popup.swal2-toast .swal2-actions{justify-content:flex-start;height:auto;margin:0;margin-top:.5em;padding:0 .5em}.swal2-popup.swal2-toast .swal2-styled{margin:.25em .5em;padding:.4em .6em;font-size:1em}.swal2-popup.swal2-toast .swal2-success{border-color:#a5dc86}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line]{position:absolute;width:1.6em;height:3em;transform:rotate(45deg);border-radius:50%}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=left]{top:-.8em;left:-.5em;transform:rotate(-45deg);transform-origin:2em 2em;border-radius:4em 0 0 4em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=right]{top:-.25em;left:.9375em;transform-origin:0 1.5em;border-radius:0 4em 4em 0}.swal2-popup.swal2-toast .swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-success .swal2-success-fix{top:0;left:.4375em;width:.4375em;height:2.6875em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line]{height:.3125em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=tip]{top:1.125em;left:.1875em;width:.75em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=long]{top:.9375em;right:.1875em;width:1.375em}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-tip{-webkit-animation:swal2-toast-animate-success-line-tip .75s;animation:swal2-toast-animate-success-line-tip .75s}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-long{-webkit-animation:swal2-toast-animate-success-line-long .75s;animation:swal2-toast-animate-success-line-long .75s}.swal2-popup.swal2-toast.swal2-show{-webkit-animation:swal2-toast-show .5s;animation:swal2-toast-show .5s}.swal2-popup.swal2-toast.swal2-hide{-webkit-animation:swal2-toast-hide .1s forwards;animation:swal2-toast-hide .1s forwards}.swal2-container{display:grid;position:fixed;z-index:1060;top:0;right:0;bottom:0;left:0;box-sizing:border-box;grid-template-areas:\"top-start     top            top-end\" \"center-start  center         center-end\" \"bottom-start  bottom-center  bottom-end\";grid-template-rows:minmax(-webkit-min-content,auto) minmax(-webkit-min-content,auto) minmax(-webkit-min-content,auto);grid-template-rows:minmax(min-content,auto) minmax(min-content,auto) minmax(min-content,auto);height:100%;padding:.625em;overflow-x:hidden;transition:background-color .1s;-webkit-overflow-scrolling:touch}.swal2-container.swal2-backdrop-show,.swal2-container.swal2-noanimation{background:rgba(0,0,0,.4)}.swal2-container.swal2-backdrop-hide{background:0 0!important}.swal2-container.swal2-bottom-start,.swal2-container.swal2-center-start,.swal2-container.swal2-top-start{grid-template-columns:minmax(0,1fr) auto auto}.swal2-container.swal2-bottom,.swal2-container.swal2-center,.swal2-container.swal2-top{grid-template-columns:auto minmax(0,1fr) auto}.swal2-container.swal2-bottom-end,.swal2-container.swal2-center-end,.swal2-container.swal2-top-end{grid-template-columns:auto auto minmax(0,1fr)}.swal2-container.swal2-top-start>.swal2-popup{align-self:start}.swal2-container.swal2-top>.swal2-popup{grid-column:2;align-self:start;justify-self:center}.swal2-container.swal2-top-end>.swal2-popup,.swal2-container.swal2-top-right>.swal2-popup{grid-column:3;align-self:start;justify-self:end}.swal2-container.swal2-center-left>.swal2-popup,.swal2-container.swal2-center-start>.swal2-popup{grid-row:2;align-self:center}.swal2-container.swal2-center>.swal2-popup{grid-column:2;grid-row:2;align-self:center;justify-self:center}.swal2-container.swal2-center-end>.swal2-popup,.swal2-container.swal2-center-right>.swal2-popup{grid-column:3;grid-row:2;align-self:center;justify-self:end}.swal2-container.swal2-bottom-left>.swal2-popup,.swal2-container.swal2-bottom-start>.swal2-popup{grid-column:1;grid-row:3;align-self:end}.swal2-container.swal2-bottom>.swal2-popup{grid-column:2;grid-row:3;justify-self:center;align-self:end}.swal2-container.swal2-bottom-end>.swal2-popup,.swal2-container.swal2-bottom-right>.swal2-popup{grid-column:3;grid-row:3;align-self:end;justify-self:end}.swal2-container.swal2-grow-fullscreen>.swal2-popup,.swal2-container.swal2-grow-row>.swal2-popup{grid-column:1/4;width:100%}.swal2-container.swal2-grow-column>.swal2-popup,.swal2-container.swal2-grow-fullscreen>.swal2-popup{grid-row:1/4;align-self:stretch}.swal2-container.swal2-no-transition{transition:none!important}.swal2-popup{display:none;position:relative;box-sizing:border-box;grid-template-columns:minmax(0,100%);width:32em;max-width:100%;padding:0 0 1.25em;border:none;border-radius:5px;background:#fff;color:#545454;font-family:inherit;font-size:1rem}.swal2-popup:focus{outline:0}.swal2-popup.swal2-loading{overflow-y:hidden}.swal2-title{position:relative;max-width:100%;margin:0;padding:.8em 1em 0;color:inherit;font-size:1.875em;font-weight:600;text-align:center;text-transform:none;word-wrap:break-word}.swal2-actions{display:flex;z-index:1;box-sizing:border-box;flex-wrap:wrap;align-items:center;justify-content:center;width:auto;margin:1.25em auto 0;padding:0}.swal2-actions:not(.swal2-loading) .swal2-styled[disabled]{opacity:.4}.swal2-actions:not(.swal2-loading) .swal2-styled:hover{background-image:linear-gradient(rgba(0,0,0,.1),rgba(0,0,0,.1))}.swal2-actions:not(.swal2-loading) .swal2-styled:active{background-image:linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,.2))}.swal2-loader{display:none;align-items:center;justify-content:center;width:2.2em;height:2.2em;margin:0 1.875em;-webkit-animation:swal2-rotate-loading 1.5s linear 0s infinite normal;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border-width:.25em;border-style:solid;border-radius:100%;border-color:#2778c4 transparent #2778c4 transparent}.swal2-styled{margin:.3125em;padding:.625em 1.1em;transition:box-shadow .1s;box-shadow:0 0 0 3px transparent;font-weight:500}.swal2-styled:not([disabled]){cursor:pointer}.swal2-styled.swal2-confirm{border:0;border-radius:.25em;background:initial;background-color:#7066e0;color:#fff;font-size:1em}.swal2-styled.swal2-confirm:focus{box-shadow:0 0 0 3px rgba(112,102,224,.5)}.swal2-styled.swal2-deny{border:0;border-radius:.25em;background:initial;background-color:#dc3741;color:#fff;font-size:1em}.swal2-styled.swal2-deny:focus{box-shadow:0 0 0 3px rgba(220,55,65,.5)}.swal2-styled.swal2-cancel{border:0;border-radius:.25em;background:initial;background-color:#6e7881;color:#fff;font-size:1em}.swal2-styled.swal2-cancel:focus{box-shadow:0 0 0 3px rgba(110,120,129,.5)}.swal2-styled.swal2-default-outline:focus{box-shadow:0 0 0 3px rgba(100,150,200,.5)}.swal2-styled:focus{outline:0}.swal2-styled::-moz-focus-inner{border:0}.swal2-footer{justify-content:center;margin:1em 0 0;padding:1em 1em 0;border-top:1px solid #eee;color:inherit;font-size:1em}.swal2-timer-progress-bar-container{position:absolute;right:0;bottom:0;left:0;grid-column:auto!important;height:.25em;overflow:hidden;border-bottom-right-radius:5px;border-bottom-left-radius:5px}.swal2-timer-progress-bar{width:100%;height:.25em;background:rgba(0,0,0,.2)}.swal2-image{max-width:100%;margin:2em auto 1em}.swal2-close{z-index:2;align-items:center;justify-content:center;width:1.2em;height:1.2em;margin-top:0;margin-right:0;margin-bottom:-1.2em;padding:0;overflow:hidden;transition:color .1s,box-shadow .1s;border:none;border-radius:5px;background:0 0;color:#ccc;font-family:serif;font-family:monospace;font-size:2.5em;cursor:pointer;justify-self:end}.swal2-close:hover{transform:none;background:0 0;color:#f27474}.swal2-close:focus{outline:0;box-shadow:inset 0 0 0 3px rgba(100,150,200,.5)}.swal2-close::-moz-focus-inner{border:0}.swal2-html-container{z-index:1;justify-content:center;margin:1em 1.6em .3em;padding:0;overflow:auto;color:inherit;font-size:1.125em;font-weight:400;line-height:normal;text-align:center;word-wrap:break-word;word-break:break-word}.swal2-checkbox,.swal2-file,.swal2-input,.swal2-radio,.swal2-select,.swal2-textarea{margin:1em 2em 0}.swal2-file,.swal2-input,.swal2-textarea{box-sizing:border-box;width:auto;transition:border-color .1s,box-shadow .1s;border:1px solid #d9d9d9;border-radius:.1875em;background:inherit;box-shadow:inset 0 1px 1px rgba(0,0,0,.06),0 0 0 3px transparent;color:inherit;font-size:1.125em}.swal2-file.swal2-inputerror,.swal2-input.swal2-inputerror,.swal2-textarea.swal2-inputerror{border-color:#f27474!important;box-shadow:0 0 2px #f27474!important}.swal2-file:focus,.swal2-input:focus,.swal2-textarea:focus{border:1px solid #b4dbed;outline:0;box-shadow:inset 0 1px 1px rgba(0,0,0,.06),0 0 0 3px rgba(100,150,200,.5)}.swal2-file::-moz-placeholder,.swal2-input::-moz-placeholder,.swal2-textarea::-moz-placeholder{color:#ccc}.swal2-file:-ms-input-placeholder,.swal2-input:-ms-input-placeholder,.swal2-textarea:-ms-input-placeholder{color:#ccc}.swal2-file::placeholder,.swal2-input::placeholder,.swal2-textarea::placeholder{color:#ccc}.swal2-range{margin:1em 2em 0;background:#fff}.swal2-range input{width:80%}.swal2-range output{width:20%;color:inherit;font-weight:600;text-align:center}.swal2-range input,.swal2-range output{height:2.625em;padding:0;font-size:1.125em;line-height:2.625em}.swal2-input{height:2.625em;padding:0 .75em}.swal2-file{width:75%;margin-right:auto;margin-left:auto;background:inherit;font-size:1.125em}.swal2-textarea{height:6.75em;padding:.75em}.swal2-select{min-width:50%;max-width:100%;padding:.375em .625em;background:inherit;color:inherit;font-size:1.125em}.swal2-checkbox,.swal2-radio{align-items:center;justify-content:center;background:#fff;color:inherit}.swal2-checkbox label,.swal2-radio label{margin:0 .6em;font-size:1.125em}.swal2-checkbox input,.swal2-radio input{flex-shrink:0;margin:0 .4em}.swal2-input-label{display:flex;justify-content:center;margin:1em auto 0}.swal2-validation-message{align-items:center;justify-content:center;margin:1em 0 0;padding:.625em;overflow:hidden;background:#f0f0f0;color:#666;font-size:1em;font-weight:300}.swal2-validation-message::before{content:\"!\";display:inline-block;width:1.5em;min-width:1.5em;height:1.5em;margin:0 .625em;border-radius:50%;background-color:#f27474;color:#fff;font-weight:600;line-height:1.5em;text-align:center}.swal2-icon{position:relative;box-sizing:content-box;justify-content:center;width:5em;height:5em;margin:2.5em auto .6em;border:.25em solid transparent;border-radius:50%;border-color:#000;font-family:inherit;line-height:5em;cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:3.75em}.swal2-icon.swal2-error{border-color:#f27474;color:#f27474}.swal2-icon.swal2-error .swal2-x-mark{position:relative;flex-grow:1}.swal2-icon.swal2-error [class^=swal2-x-mark-line]{display:block;position:absolute;top:2.3125em;width:2.9375em;height:.3125em;border-radius:.125em;background-color:#f27474}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:1.0625em;transform:rotate(45deg)}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:1em;transform:rotate(-45deg)}.swal2-icon.swal2-error.swal2-icon-show{-webkit-animation:swal2-animate-error-icon .5s;animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-error.swal2-icon-show .swal2-x-mark{-webkit-animation:swal2-animate-error-x-mark .5s;animation:swal2-animate-error-x-mark .5s}.swal2-icon.swal2-warning{border-color:#facea8;color:#f8bb86}.swal2-icon.swal2-warning.swal2-icon-show{-webkit-animation:swal2-animate-error-icon .5s;animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-warning.swal2-icon-show .swal2-icon-content{-webkit-animation:swal2-animate-i-mark .5s;animation:swal2-animate-i-mark .5s}.swal2-icon.swal2-info{border-color:#9de0f6;color:#3fc3ee}.swal2-icon.swal2-info.swal2-icon-show{-webkit-animation:swal2-animate-error-icon .5s;animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-info.swal2-icon-show .swal2-icon-content{-webkit-animation:swal2-animate-i-mark .8s;animation:swal2-animate-i-mark .8s}.swal2-icon.swal2-question{border-color:#c9dae1;color:#87adbd}.swal2-icon.swal2-question.swal2-icon-show{-webkit-animation:swal2-animate-error-icon .5s;animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-question.swal2-icon-show .swal2-icon-content{-webkit-animation:swal2-animate-question-mark .8s;animation:swal2-animate-question-mark .8s}.swal2-icon.swal2-success{border-color:#a5dc86;color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-circular-line]{position:absolute;width:3.75em;height:7.5em;transform:rotate(45deg);border-radius:50%}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=left]{top:-.4375em;left:-2.0635em;transform:rotate(-45deg);transform-origin:3.75em 3.75em;border-radius:7.5em 0 0 7.5em}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=right]{top:-.6875em;left:1.875em;transform:rotate(-45deg);transform-origin:0 3.75em;border-radius:0 7.5em 7.5em 0}.swal2-icon.swal2-success .swal2-success-ring{position:absolute;z-index:2;top:-.25em;left:-.25em;box-sizing:content-box;width:100%;height:100%;border:.25em solid rgba(165,220,134,.3);border-radius:50%}.swal2-icon.swal2-success .swal2-success-fix{position:absolute;z-index:1;top:.5em;left:1.625em;width:.4375em;height:5.625em;transform:rotate(-45deg)}.swal2-icon.swal2-success [class^=swal2-success-line]{display:block;position:absolute;z-index:2;height:.3125em;border-radius:.125em;background-color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-line][class$=tip]{top:2.875em;left:.8125em;width:1.5625em;transform:rotate(45deg)}.swal2-icon.swal2-success [class^=swal2-success-line][class$=long]{top:2.375em;right:.5em;width:2.9375em;transform:rotate(-45deg)}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-line-tip{-webkit-animation:swal2-animate-success-line-tip .75s;animation:swal2-animate-success-line-tip .75s}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-line-long{-webkit-animation:swal2-animate-success-line-long .75s;animation:swal2-animate-success-line-long .75s}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-circular-line-right{-webkit-animation:swal2-rotate-success-circular-line 4.25s ease-in;animation:swal2-rotate-success-circular-line 4.25s ease-in}.swal2-progress-steps{flex-wrap:wrap;align-items:center;max-width:100%;margin:1.25em auto;padding:0;background:inherit;font-weight:600}.swal2-progress-steps li{display:inline-block;position:relative}.swal2-progress-steps .swal2-progress-step{z-index:20;flex-shrink:0;width:2em;height:2em;border-radius:2em;background:#2778c4;color:#fff;line-height:2em;text-align:center}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:#2778c4}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step{background:#add8e6;color:#fff}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step-line{background:#add8e6}.swal2-progress-steps .swal2-progress-step-line{z-index:10;flex-shrink:0;width:2.5em;height:.4em;margin:0 -1px;background:#2778c4}[class^=swal2]{-webkit-tap-highlight-color:transparent}.swal2-show{-webkit-animation:swal2-show .3s;animation:swal2-show .3s}.swal2-hide{-webkit-animation:swal2-hide .15s forwards;animation:swal2-hide .15s forwards}.swal2-noanimation{transition:none}.swal2-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}.swal2-rtl .swal2-close{margin-right:initial;margin-left:0}.swal2-rtl .swal2-timer-progress-bar{right:0;left:auto}@-webkit-keyframes swal2-toast-show{0%{transform:translateY(-.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0)}}@keyframes swal2-toast-show{0%{transform:translateY(-.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0)}}@-webkit-keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@-webkit-keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@-webkit-keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}@keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}@-webkit-keyframes swal2-show{0%{transform:scale(.7)}45%{transform:scale(1.05)}80%{transform:scale(.95)}100%{transform:scale(1)}}@keyframes swal2-show{0%{transform:scale(.7)}45%{transform:scale(1.05)}80%{transform:scale(.95)}100%{transform:scale(1)}}@-webkit-keyframes swal2-hide{0%{transform:scale(1);opacity:1}100%{transform:scale(.5);opacity:0}}@keyframes swal2-hide{0%{transform:scale(1);opacity:1}100%{transform:scale(.5);opacity:0}}@-webkit-keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@-webkit-keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@-webkit-keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@-webkit-keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(.4);opacity:0}50%{margin-top:1.625em;transform:scale(.4);opacity:0}80%{margin-top:-.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(.4);opacity:0}50%{margin-top:1.625em;transform:scale(.4);opacity:0}80%{margin-top:-.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@-webkit-keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0);opacity:1}}@keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0);opacity:1}}@-webkit-keyframes swal2-rotate-loading{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes swal2-rotate-loading{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@-webkit-keyframes swal2-animate-question-mark{0%{transform:rotateY(-360deg)}100%{transform:rotateY(0)}}@keyframes swal2-animate-question-mark{0%{transform:rotateY(-360deg)}100%{transform:rotateY(0)}}@-webkit-keyframes swal2-animate-i-mark{0%{transform:rotateZ(45deg);opacity:0}25%{transform:rotateZ(-25deg);opacity:.4}50%{transform:rotateZ(15deg);opacity:.8}75%{transform:rotateZ(-5deg);opacity:1}100%{transform:rotateX(0);opacity:1}}@keyframes swal2-animate-i-mark{0%{transform:rotateZ(45deg);opacity:0}25%{transform:rotateZ(-25deg);opacity:.4}50%{transform:rotateZ(15deg);opacity:.8}75%{transform:rotateZ(-5deg);opacity:1}100%{transform:rotateX(0);opacity:1}}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow:hidden}body.swal2-height-auto{height:auto!important}body.swal2-no-backdrop .swal2-container{background-color:transparent!important;pointer-events:none}body.swal2-no-backdrop .swal2-container .swal2-popup{pointer-events:all}body.swal2-no-backdrop .swal2-container .swal2-modal{box-shadow:0 0 10px rgba(0,0,0,.4)}@media print{body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow-y:scroll!important}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown)>[aria-hidden=true]{display:none}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown) .swal2-container{position:static!important}}body.swal2-toast-shown .swal2-container{box-sizing:border-box;width:360px;max-width:100%;background-color:transparent;pointer-events:none}body.swal2-toast-shown .swal2-container.swal2-top{top:0;right:auto;bottom:auto;left:50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-top-end,body.swal2-toast-shown .swal2-container.swal2-top-right{top:0;right:0;bottom:auto;left:auto}body.swal2-toast-shown .swal2-container.swal2-top-left,body.swal2-toast-shown .swal2-container.swal2-top-start{top:0;right:auto;bottom:auto;left:0}body.swal2-toast-shown .swal2-container.swal2-center-left,body.swal2-toast-shown .swal2-container.swal2-center-start{top:50%;right:auto;bottom:auto;left:0;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-center{top:50%;right:auto;bottom:auto;left:50%;transform:translate(-50%,-50%)}body.swal2-toast-shown .swal2-container.swal2-center-end,body.swal2-toast-shown .swal2-container.swal2-center-right{top:50%;right:0;bottom:auto;left:auto;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-left,body.swal2-toast-shown .swal2-container.swal2-bottom-start{top:auto;right:auto;bottom:0;left:0}body.swal2-toast-shown .swal2-container.swal2-bottom{top:auto;right:auto;bottom:0;left:50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-end,body.swal2-toast-shown .swal2-container.swal2-bottom-right{top:auto;right:0;bottom:0;left:auto}");
    });

    /* src/pages/superAdmin/product/productView.svelte generated by Svelte v3.44.1 */

    const { console: console_1$8 } = globals;
    const file$v = "src/pages/superAdmin/product/productView.svelte";

    function get_each_context$n(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	return child_ctx;
    }

    // (155:40) {#each categories as item}
    function create_each_block_1$3(ctx) {
    	let option;
    	let t_value = /*item*/ ctx[22].category + "";
    	let t;
    	let option_key_value;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			attr_dev(option, "key", option_key_value = /*item*/ ctx[22]._id);
    			option.__value = option_value_value = /*item*/ ctx[22].category;
    			option.value = option.__value;
    			add_location(option, file$v, 155, 44, 4758);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*categories*/ 2 && t_value !== (t_value = /*item*/ ctx[22].category + "")) set_data_dev(t, t_value);

    			if (dirty & /*categories*/ 2 && option_key_value !== (option_key_value = /*item*/ ctx[22]._id)) {
    				attr_dev(option, "key", option_key_value);
    			}

    			if (dirty & /*categories*/ 2 && option_value_value !== (option_value_value = /*item*/ ctx[22].category)) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$3.name,
    		type: "each",
    		source: "(155:40) {#each categories as item}",
    		ctx
    	});

    	return block;
    }

    // (163:40) {#each sCate as item}
    function create_each_block$n(ctx) {
    	let option;
    	let t_value = /*item*/ ctx[22] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*item*/ ctx[22];
    			option.value = option.__value;
    			add_location(option, file$v, 163, 44, 5313);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*sCate*/ 4 && t_value !== (t_value = /*item*/ ctx[22] + "")) set_data_dev(t, t_value);

    			if (dirty & /*sCate*/ 4 && option_value_value !== (option_value_value = /*item*/ ctx[22])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$n.name,
    		type: "each",
    		source: "(163:40) {#each sCate as item}",
    		ctx
    	});

    	return block;
    }

    // (174:32) {:else}
    function create_else_block$4(ctx) {
    	let div;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = `${API_URL}/products/images/${/*product*/ ctx[5].image}`)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "pic");
    			attr_dev(img, "class", "img img-responsive svelte-o04um4");
    			add_location(img, file$v, 175, 36, 5942);
    			attr_dev(div, "class", "col-sm-6");
    			add_location(div, file$v, 174, 32, 5883);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*product, categories*/ 34 && !src_url_equal(img.src, img_src_value = `${API_URL}/products/images/${/*product*/ ctx[5].image}`)) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(174:32) {:else}",
    		ctx
    	});

    	return block;
    }

    // (170:32) {#if imageShow}
    function create_if_block$b(ctx) {
    	let div;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*imageShow*/ ctx[4])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "pic");
    			attr_dev(img, "class", "img img-responsive svelte-o04um4");
    			add_location(img, file$v, 171, 36, 5710);
    			attr_dev(div, "class", "col-sm-6");
    			add_location(div, file$v, 170, 32, 5651);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*imageShow*/ 16 && !src_url_equal(img.src, img_src_value = /*imageShow*/ ctx[4])) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(170:32) {#if imageShow}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$v(ctx) {
    	let main;
    	let div11;
    	let div10;
    	let h4;
    	let t1;
    	let form;
    	let div9;
    	let input0;
    	let t2;
    	let div2;
    	let div0;
    	let select0;
    	let option0;
    	let t4;
    	let div1;
    	let select1;
    	let option1;
    	let t6;
    	let div6;
    	let t7;
    	let div5;
    	let div4;
    	let div3;
    	let i0;
    	let t8;
    	let t9;
    	let input1;
    	let t10;
    	let button0;
    	let i1;
    	let t11;
    	let t12;
    	let div7;
    	let p;
    	let b;
    	let t13_value = /*message*/ ctx[3].msg + "";
    	let t13;
    	let p_class_value;
    	let t14;
    	let div8;
    	let button1;
    	let t16;
    	let button2;
    	let t18;
    	let a;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*categories*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$3(get_each_context_1$3(ctx, each_value_1, i));
    	}

    	let each_value = /*sCate*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$n(get_each_context$n(ctx, each_value, i));
    	}

    	function select_block_type(ctx, dirty) {
    		if (/*imageShow*/ ctx[4]) return create_if_block$b;
    		return create_else_block$4;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div11 = element("div");
    			div10 = element("div");
    			h4 = element("h4");
    			h4.textContent = "Manage Product:";
    			t1 = space();
    			form = element("form");
    			div9 = element("div");
    			input0 = element("input");
    			t2 = space();
    			div2 = element("div");
    			div0 = element("div");
    			select0 = element("select");
    			option0 = element("option");
    			option0.textContent = "Category.. ";

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t4 = space();
    			div1 = element("div");
    			select1 = element("select");
    			option1 = element("option");
    			option1.textContent = "Sub Category.. ";

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t6 = space();
    			div6 = element("div");
    			if_block.c();
    			t7 = space();
    			div5 = element("div");
    			div4 = element("div");
    			div3 = element("div");
    			i0 = element("i");
    			t8 = text(" Change Image");
    			t9 = space();
    			input1 = element("input");
    			t10 = space();
    			button0 = element("button");
    			i1 = element("i");
    			t11 = text(" Upload");
    			t12 = space();
    			div7 = element("div");
    			p = element("p");
    			b = element("b");
    			t13 = text(t13_value);
    			t14 = space();
    			div8 = element("div");
    			button1 = element("button");
    			button1.textContent = "Update";
    			t16 = space();
    			button2 = element("button");
    			button2.textContent = "Delete";
    			t18 = space();
    			a = element("a");
    			a.textContent = "Back";
    			attr_dev(h4, "class", "heading text-center  svelte-o04um4");
    			add_location(h4, file$v, 146, 20, 4080);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "form-control form-input svelte-o04um4");
    			add_location(input0, file$v, 149, 28, 4251);
    			option0.__value = "";
    			option0.value = option0.__value;
    			add_location(option0, file$v, 153, 40, 4609);
    			attr_dev(select0, "class", "form-control form-select svelte-o04um4");
    			if (/*product*/ ctx[5].category === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[14].call(select0));
    			add_location(select0, file$v, 152, 36, 4466);
    			attr_dev(div0, "class", "col-sm");
    			add_location(div0, file$v, 151, 32, 4409);
    			option1.__value = "";
    			option1.value = option1.__value;
    			add_location(option1, file$v, 161, 40, 5165);
    			attr_dev(select1, "class", "form-control form-select svelte-o04um4");
    			if (/*product*/ ctx[5].subCategory === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[15].call(select1));
    			add_location(select1, file$v, 160, 36, 5050);
    			attr_dev(div1, "class", "col-sm");
    			add_location(div1, file$v, 159, 32, 4993);
    			attr_dev(div2, "class", "row");
    			add_location(div2, file$v, 150, 28, 4359);
    			attr_dev(i0, "class", "fa fa-picture-o fa-lg");
    			add_location(i0, file$v, 181, 100, 6333);
    			attr_dev(div3, "class", "uploadBtn  svelte-o04um4");
    			add_location(div3, file$v, 181, 40, 6273);
    			set_style(input1, "display", "none");
    			attr_dev(input1, "type", "file");
    			add_location(input1, file$v, 182, 40, 6430);
    			attr_dev(i1, "class", "fa fa-upload fa-lg");
    			add_location(i1, file$v, 183, 85, 6610);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "svelte-o04um4");
    			add_location(button0, file$v, 183, 40, 6565);
    			attr_dev(div4, "class", "btnCon row svelte-o04um4");
    			add_location(div4, file$v, 180, 36, 6208);
    			attr_dev(div5, "class", "col-sm-6");
    			add_location(div5, file$v, 179, 32, 6149);
    			attr_dev(div6, "class", "row upload svelte-o04um4");
    			add_location(div6, file$v, 168, 28, 5546);
    			add_location(b, file$v, 188, 59, 6927);
    			attr_dev(p, "class", p_class_value = "" + (null_to_empty(/*message*/ ctx[3].style) + " svelte-o04um4"));
    			add_location(p, file$v, 188, 32, 6900);
    			attr_dev(div7, "class", "row m-auto justify-content-center border-bottom");
    			add_location(div7, file$v, 187, 28, 6806);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "btns btn btn-outline-info svelte-o04um4");
    			add_location(button1, file$v, 191, 32, 7092);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "btns btn btn-outline-danger svelte-o04um4");
    			add_location(button2, file$v, 192, 32, 7221);
    			attr_dev(a, "href", "/admin/produt_view");
    			attr_dev(a, "class", "btns btn btn-outline-secondary svelte-o04um4");
    			add_location(a, file$v, 193, 32, 7352);
    			attr_dev(div8, "class", "row m-auto justify-content-end");
    			add_location(div8, file$v, 190, 28, 7015);
    			attr_dev(div9, "class", "");
    			add_location(div9, file$v, 148, 24, 4208);
    			attr_dev(form, "class", "p-2 border-top");
    			add_location(form, file$v, 147, 20, 4154);
    			attr_dev(div10, "class", "container border p-4");
    			add_location(div10, file$v, 145, 16, 4025);
    			attr_dev(div11, "class", "row justify-content-center ml-2 ");
    			add_location(div11, file$v, 144, 8, 3961);
    			add_location(main, file$v, 143, 4, 3946);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div11);
    			append_dev(div11, div10);
    			append_dev(div10, h4);
    			append_dev(div10, t1);
    			append_dev(div10, form);
    			append_dev(form, div9);
    			append_dev(div9, input0);
    			set_input_value(input0, /*product*/ ctx[5].title);
    			append_dev(div9, t2);
    			append_dev(div9, div2);
    			append_dev(div2, div0);
    			append_dev(div0, select0);
    			append_dev(select0, option0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(select0, null);
    			}

    			select_option(select0, /*product*/ ctx[5].category);
    			append_dev(div2, t4);
    			append_dev(div2, div1);
    			append_dev(div1, select1);
    			append_dev(select1, option1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select1, null);
    			}

    			select_option(select1, /*product*/ ctx[5].subCategory);
    			append_dev(div9, t6);
    			append_dev(div9, div6);
    			if_block.m(div6, null);
    			append_dev(div6, t7);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, i0);
    			append_dev(div3, t8);
    			append_dev(div4, t9);
    			append_dev(div4, input1);
    			/*input1_binding*/ ctx[18](input1);
    			append_dev(div4, t10);
    			append_dev(div4, button0);
    			append_dev(button0, i1);
    			append_dev(button0, t11);
    			append_dev(div9, t12);
    			append_dev(div9, div7);
    			append_dev(div7, p);
    			append_dev(p, b);
    			append_dev(b, t13);
    			append_dev(div9, t14);
    			append_dev(div9, div8);
    			append_dev(div8, button1);
    			append_dev(div8, t16);
    			append_dev(div8, button2);
    			append_dev(div8, t18);
    			append_dev(div8, a);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[12]),
    					listen_dev(select0, "change", /*change_handler*/ ctx[13], false, false, false),
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[14]),
    					listen_dev(select1, "change", /*select1_change_handler*/ ctx[15]),
    					listen_dev(div3, "click", /*click_handler*/ ctx[16], false, false, false),
    					listen_dev(input1, "change", /*change_handler_1*/ ctx[17], false, false, false),
    					listen_dev(button0, "click", /*imageUpload*/ ctx[7], false, false, false),
    					listen_dev(button1, "click", /*updateProduct*/ ctx[9], false, false, false),
    					listen_dev(button2, "click", /*deleteConfirm*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*product, categories*/ 34 && input0.value !== /*product*/ ctx[5].title) {
    				set_input_value(input0, /*product*/ ctx[5].title);
    			}

    			if (dirty & /*categories*/ 2) {
    				each_value_1 = /*categories*/ ctx[1];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$3(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$3(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(select0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*product, categories*/ 34) {
    				select_option(select0, /*product*/ ctx[5].category);
    			}

    			if (dirty & /*sCate*/ 4) {
    				each_value = /*sCate*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$n(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$n(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*product, categories*/ 34) {
    				select_option(select1, /*product*/ ctx[5].subCategory);
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div6, t7);
    				}
    			}

    			if (dirty & /*message*/ 8 && t13_value !== (t13_value = /*message*/ ctx[3].msg + "")) set_data_dev(t13, t13_value);

    			if (dirty & /*message*/ 8 && p_class_value !== (p_class_value = "" + (null_to_empty(/*message*/ ctx[3].style) + " svelte-o04um4"))) {
    				attr_dev(p, "class", p_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			if_block.d();
    			/*input1_binding*/ ctx[18](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$v($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ProductView', slots, []);
    	let { id } = $$props;
    	let fileinput;
    	let categories = [];
    	let sCate = [];
    	let selectedCate;
    	let message = { msg: "", style: "" };
    	let imageShow;
    	let imageData;

    	let product = {
    		title: "",
    		category: "",
    		subCategory: "",
    		image: "",
    		_id: ""
    	};

    	onMount(async () => {
    		await fetch(`${API_URL}/products/category/list`, { method: 'POST' }).then(response => response.json()).then(datas => {
    			$$invalidate(1, categories = datas.data);
    		});

    		await fetch(`${API_URL}/products/list/${id}`, { method: 'POST' }).then(response => response.json()).then(datas => {
    			$$invalidate(5, product = datas.data);
    			let cate = categories.find(tmp => tmp.category === datas.data.category);
    			$$invalidate(2, sCate = cate.subCategory);
    		});
    	});

    	const cateChange = e => {
    		selectedCate = e.target.value;

    		if (selectedCate == "" || selectedCate == "undefined") {
    			$$invalidate(2, sCate = []);
    		} else {
    			let cate = categories.find(tmp => tmp.category === selectedCate);
    			$$invalidate(2, sCate = cate.subCategory);
    		}
    	};

    	const imageUpload = async () => {
    		const formData = new FormData();
    		formData.append("productimage", imageData);
    		formData.append('oldImage', product.image);

    		try {
    			const res = await fetch(`${API_URL}/products/updateimage`, {
    				method: "POST",
    				body: formData,
    				headers: { 'Accept': 'application/json' }
    			});

    			const json = await res.json();
    			console.log(json);
    			$$invalidate(3, message.style = 'text-primary', message);
    			$$invalidate(3, message.msg = json.message, message);

    			if (json.status === true) {
    				$$invalidate(5, product.image = json.data, product);
    			}
    		} catch(error) {
    			
    		}
    	};

    	const imageChange = event => {
    		let image = event.target.files[0];
    		imageData = image;
    		let reader = new FileReader();
    		reader.readAsDataURL(image);

    		reader.onload = e => {
    			$$invalidate(4, imageShow = e.target.result);
    		};
    	};

    	const updateProduct = async () => {
    		let validate = productValid(product);

    		if (validate.valid == true) {
    			$$invalidate(3, message.style = 'text-info', message);
    			$$invalidate(3, message.msg = validate.error, message);

    			try {
    				const res = await fetch(`${API_URL}/products/update`, {
    					method: 'post',
    					body: JSON.stringify(product),
    					headers: { 'Content-Type': 'application/json' }
    				});

    				const json = await res.json();
    				$$invalidate(3, message.style = 'text-primary', message);
    				$$invalidate(3, message.msg = json.message, message);
    			} catch(error) {
    				$$invalidate(3, message.style = 'text-warning', message);
    				$$invalidate(3, message.msg = "Network error !!", message);
    			}
    		} else {
    			$$invalidate(3, message.style = 'text-danger', message);
    			$$invalidate(3, message.msg = validate.error, message);
    		}
    	};

    	const deleteProduct = async () => {
    		try {
    			const res = await fetch(`${API_URL}/products/delete/${id}`, {
    				method: 'post',
    				headers: { 'Content-Type': 'application/json' }
    			});

    			const json = await res.json();

    			if (json.status === true) {
    				navigate('/admin/produt_view');
    			}
    		} catch(error) {
    			$$invalidate(3, message.style = 'text-warning', message);
    			$$invalidate(3, message.msg = "Network error !!", message);
    		}
    	};

    	const deleteConfirm = async () => {
    		sweetalert2_all.fire({
    			title: 'Are you sure?',
    			text: "Delete  " + product.title,
    			showCancelButton: true,
    			confirmButtonColor: '#3085d6',
    			cancelButtonColor: '#d33',
    			confirmButtonText: 'Yes, delete it!'
    		}).then(result => {
    			if (result.isConfirmed) {
    				deleteProduct();
    			}
    		});
    	};

    	const writable_props = ['id'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$8.warn(`<ProductView> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		product.title = this.value;
    		$$invalidate(5, product);
    		$$invalidate(1, categories);
    	}

    	const change_handler = e => cateChange(e);

    	function select0_change_handler() {
    		product.category = select_value(this);
    		$$invalidate(5, product);
    		$$invalidate(1, categories);
    	}

    	function select1_change_handler() {
    		product.subCategory = select_value(this);
    		$$invalidate(5, product);
    		$$invalidate(1, categories);
    	}

    	const click_handler = () => {
    		fileinput.click();
    	};

    	const change_handler_1 = e => imageChange(e);

    	function input1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			fileinput = $$value;
    			$$invalidate(0, fileinput);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(11, id = $$props.id);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		navigate,
    		Swal: sweetalert2_all,
    		API_URL,
    		productValid,
    		id,
    		fileinput,
    		categories,
    		sCate,
    		selectedCate,
    		message,
    		imageShow,
    		imageData,
    		product,
    		cateChange,
    		imageUpload,
    		imageChange,
    		updateProduct,
    		deleteProduct,
    		deleteConfirm
    	});

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(11, id = $$props.id);
    		if ('fileinput' in $$props) $$invalidate(0, fileinput = $$props.fileinput);
    		if ('categories' in $$props) $$invalidate(1, categories = $$props.categories);
    		if ('sCate' in $$props) $$invalidate(2, sCate = $$props.sCate);
    		if ('selectedCate' in $$props) selectedCate = $$props.selectedCate;
    		if ('message' in $$props) $$invalidate(3, message = $$props.message);
    		if ('imageShow' in $$props) $$invalidate(4, imageShow = $$props.imageShow);
    		if ('imageData' in $$props) imageData = $$props.imageData;
    		if ('product' in $$props) $$invalidate(5, product = $$props.product);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		fileinput,
    		categories,
    		sCate,
    		message,
    		imageShow,
    		product,
    		cateChange,
    		imageUpload,
    		imageChange,
    		updateProduct,
    		deleteConfirm,
    		id,
    		input0_input_handler,
    		change_handler,
    		select0_change_handler,
    		select1_change_handler,
    		click_handler,
    		change_handler_1,
    		input1_binding
    	];
    }

    class ProductView extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$v, create_fragment$v, safe_not_equal, { id: 11 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProductView",
    			options,
    			id: create_fragment$v.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*id*/ ctx[11] === undefined && !('id' in props)) {
    			console_1$8.warn("<ProductView> was created without expected prop 'id'");
    		}
    	}

    	get id() {
    		throw new Error("<ProductView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<ProductView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/pages/superAdmin/product/category.svelte generated by Svelte v3.44.1 */

    const { console: console_1$7 } = globals;
    const file$u = "src/pages/superAdmin/product/category.svelte";

    function get_each_context$m(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[29] = list[i];
    	child_ctx[31] = i;
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[29] = list[i];
    	return child_ctx;
    }

    // (156:32) {#if newSubCate}
    function create_if_block_1$8(ctx) {
    	let each_1_anchor;
    	let each_value_2 = /*newSubCate*/ ctx[2];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*newSubCate*/ 4) {
    				each_value_2 = /*newSubCate*/ ctx[2];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$1(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$8.name,
    		type: "if",
    		source: "(156:32) {#if newSubCate}",
    		ctx
    	});

    	return block;
    }

    // (157:36) {#each newSubCate as cate}
    function create_each_block_2$1(ctx) {
    	let input;
    	let input_value_value;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "class", "form-control form-input svelte-mkdb6z");
    			attr_dev(input, "placeholder", "Sub Category");
    			input.value = input_value_value = /*cate*/ ctx[29];
    			add_location(input, file$u, 157, 40, 5039);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*newSubCate*/ 4 && input_value_value !== (input_value_value = /*cate*/ ctx[29]) && input.value !== input_value_value) {
    				prop_dev(input, "value", input_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$1.name,
    		type: "each",
    		source: "(157:36) {#each newSubCate as cate}",
    		ctx
    	});

    	return block;
    }

    // (179:36) {#each categories as item}
    function create_each_block_1$2(ctx) {
    	let option;
    	let t_value = /*item*/ ctx[32].category + "";
    	let t;
    	let option_key_value;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			attr_dev(option, "key", option_key_value = /*item*/ ctx[32]._id);
    			option.__value = option_value_value = /*item*/ ctx[32].category;
    			option.value = option.__value;
    			add_location(option, file$u, 179, 36, 6218);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*categories*/ 1 && t_value !== (t_value = /*item*/ ctx[32].category + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*categories*/ 1 && option_key_value !== (option_key_value = /*item*/ ctx[32]._id)) {
    				attr_dev(option, "key", option_key_value);
    			}

    			if (dirty[0] & /*categories*/ 1 && option_value_value !== (option_value_value = /*item*/ ctx[32].category)) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(179:36) {#each categories as item}",
    		ctx
    	});

    	return block;
    }

    // (185:36) {#if sCate}
    function create_if_block$a(ctx) {
    	let each_1_anchor;
    	let each_value = /*sCate*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$m(get_each_context$m(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*deleteSCat, sCate, sCatChange*/ 20482) {
    				each_value = /*sCate*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$m(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$m(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(185:36) {#if sCate}",
    		ctx
    	});

    	return block;
    }

    // (186:40) {#each sCate as cate,i}
    function create_each_block$m(ctx) {
    	let div1;
    	let input;
    	let input_value_value;
    	let t0;
    	let div0;
    	let button;
    	let i_1;
    	let t1;
    	let mounted;
    	let dispose;

    	function change_handler_3(...args) {
    		return /*change_handler_3*/ ctx[19](/*i*/ ctx[31], ...args);
    	}

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[20](/*i*/ ctx[31], ...args);
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			input = element("input");
    			t0 = space();
    			div0 = element("div");
    			button = element("button");
    			i_1 = element("i");
    			t1 = space();
    			attr_dev(input, "class", "form-control form-input svelte-mkdb6z");
    			attr_dev(input, "placeholder", "Sub Category");
    			input.value = input_value_value = /*cate*/ ctx[29];
    			add_location(input, file$u, 187, 44, 6683);
    			attr_dev(i_1, "class", "fa fa-minus");
    			add_location(i_1, file$u, 189, 140, 7014);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-danger mt-2");
    			button.value = /*i*/ ctx[31];
    			add_location(button, file$u, 189, 48, 6922);
    			attr_dev(div0, "class", "input-group-append");
    			add_location(div0, file$u, 188, 44, 6841);
    			attr_dev(div1, "class", "row input-group");
    			add_location(div1, file$u, 186, 40, 6609);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, input);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, button);
    			append_dev(button, i_1);
    			append_dev(div1, t1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", change_handler_3, false, false, false),
    					listen_dev(button, "click", click_handler, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*sCate*/ 2 && input_value_value !== (input_value_value = /*cate*/ ctx[29]) && input.value !== input_value_value) {
    				prop_dev(input, "value", input_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$m.name,
    		type: "each",
    		source: "(186:40) {#each sCate as cate,i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$u(ctx) {
    	let main;
    	let div18;
    	let div17;
    	let h4;
    	let t1;
    	let form;
    	let h50;
    	let t3;
    	let div5;
    	let div0;
    	let input0;
    	let t4;
    	let div4;
    	let div2;
    	let input1;
    	let t5;
    	let div1;
    	let button0;
    	let i0;
    	let t6;
    	let div3;
    	let t7;
    	let div6;
    	let button1;
    	let t9;
    	let div7;
    	let p0;
    	let b0;
    	let t10;
    	let t11;
    	let div8;
    	let t12;
    	let div16;
    	let h51;
    	let t14;
    	let div13;
    	let div9;
    	let input2;
    	let t15;
    	let datalist;
    	let t16;
    	let div12;
    	let t17;
    	let div11;
    	let input3;
    	let t18;
    	let div10;
    	let button2;
    	let i1;
    	let t19;
    	let div14;
    	let button3;
    	let t21;
    	let button4;
    	let t23;
    	let a;
    	let t25;
    	let div15;
    	let p1;
    	let b1;
    	let t26;
    	let mounted;
    	let dispose;
    	let if_block0 = /*newSubCate*/ ctx[2] && create_if_block_1$8(ctx);
    	let each_value_1 = /*categories*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	let if_block1 = /*sCate*/ ctx[1] && create_if_block$a(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div18 = element("div");
    			div17 = element("div");
    			h4 = element("h4");
    			h4.textContent = "Categories";
    			t1 = space();
    			form = element("form");
    			h50 = element("h5");
    			h50.textContent = "Add Categories";
    			t3 = space();
    			div5 = element("div");
    			div0 = element("div");
    			input0 = element("input");
    			t4 = space();
    			div4 = element("div");
    			div2 = element("div");
    			input1 = element("input");
    			t5 = space();
    			div1 = element("div");
    			button0 = element("button");
    			i0 = element("i");
    			t6 = space();
    			div3 = element("div");
    			if (if_block0) if_block0.c();
    			t7 = space();
    			div6 = element("div");
    			button1 = element("button");
    			button1.textContent = "Save Category";
    			t9 = space();
    			div7 = element("div");
    			p0 = element("p");
    			b0 = element("b");
    			t10 = text(/*message*/ ctx[3]);
    			t11 = space();
    			div8 = element("div");
    			t12 = space();
    			div16 = element("div");
    			h51 = element("h5");
    			h51.textContent = "Manage Categories";
    			t14 = space();
    			div13 = element("div");
    			div9 = element("div");
    			input2 = element("input");
    			t15 = space();
    			datalist = element("datalist");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t16 = space();
    			div12 = element("div");
    			if (if_block1) if_block1.c();
    			t17 = space();
    			div11 = element("div");
    			input3 = element("input");
    			t18 = space();
    			div10 = element("div");
    			button2 = element("button");
    			i1 = element("i");
    			t19 = space();
    			div14 = element("div");
    			button3 = element("button");
    			button3.textContent = "Update";
    			t21 = space();
    			button4 = element("button");
    			button4.textContent = "Delete";
    			t23 = space();
    			a = element("a");
    			a.textContent = "Back";
    			t25 = space();
    			div15 = element("div");
    			p1 = element("p");
    			b1 = element("b");
    			t26 = text(/*message2*/ ctx[4]);
    			attr_dev(h4, "class", "heading text-center  svelte-mkdb6z");
    			add_location(h4, file$u, 140, 16, 3929);
    			attr_dev(h50, "class", "text-secondary");
    			add_location(h50, file$u, 142, 20, 4044);
    			attr_dev(input0, "class", "form-control form-input svelte-mkdb6z");
    			attr_dev(input0, "placeholder", "Category");
    			add_location(input0, file$u, 145, 28, 4199);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file$u, 144, 24, 4153);
    			attr_dev(input1, "class", "form-control form-input svelte-mkdb6z");
    			attr_dev(input1, "placeholder", "Sub Category");
    			add_location(input1, file$u, 149, 32, 4459);
    			attr_dev(i0, "class", "fa fa-plus");
    			add_location(i0, file$u, 151, 105, 4731);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "btn btn-info mt-2");
    			add_location(button0, file$u, 151, 36, 4662);
    			attr_dev(div1, "class", "input-group-append");
    			add_location(div1, file$u, 150, 32, 4593);
    			attr_dev(div2, "class", "row input-group");
    			add_location(div2, file$u, 148, 28, 4397);
    			attr_dev(div3, "class", "row");
    			add_location(div3, file$u, 154, 28, 4869);
    			attr_dev(div4, "class", "col");
    			add_location(div4, file$u, 147, 24, 4351);
    			attr_dev(div5, "class", "row");
    			add_location(div5, file$u, 143, 20, 4111);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "btn btn-create svelte-mkdb6z");
    			add_location(button1, file$u, 164, 24, 5387);
    			attr_dev(div6, "class", "row m-auto justify-content-center");
    			add_location(div6, file$u, 163, 20, 5315);
    			add_location(b0, file$u, 167, 48, 5620);
    			attr_dev(p0, "class", "text-primary");
    			add_location(p0, file$u, 167, 24, 5596);
    			attr_dev(div7, "class", "row m-auto justify-content-center");
    			add_location(div7, file$u, 166, 20, 5524);
    			attr_dev(div8, "class", "row m-2 p-2");
    			add_location(div8, file$u, 170, 20, 5689);
    			attr_dev(h51, "class", "text-secondary");
    			add_location(h51, file$u, 173, 24, 5772);
    			attr_dev(input2, "class", "form-control form-select svelte-mkdb6z");
    			attr_dev(input2, "placeholder", "Category");
    			attr_dev(input2, "list", "cate");
    			add_location(input2, file$u, 176, 32, 5958);
    			attr_dev(datalist, "id", "cate");
    			add_location(datalist, file$u, 177, 32, 6098);
    			attr_dev(div9, "class", "col");
    			add_location(div9, file$u, 175, 28, 5908);
    			attr_dev(input3, "class", "form-control form-input svelte-mkdb6z");
    			attr_dev(input3, "placeholder", "Sub Category");
    			add_location(input3, file$u, 195, 36, 7338);
    			attr_dev(i1, "class", "fa fa-plus");
    			add_location(i1, file$u, 197, 109, 7615);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "btn btn-info mt-2");
    			add_location(button2, file$u, 197, 40, 7546);
    			attr_dev(div10, "class", "input-group-append");
    			add_location(div10, file$u, 196, 36, 7473);
    			attr_dev(div11, "class", "row input-group");
    			add_location(div11, file$u, 194, 32, 7272);
    			attr_dev(div12, "class", "col");
    			add_location(div12, file$u, 183, 28, 6439);
    			attr_dev(div13, "class", "row border-top pt-2");
    			add_location(div13, file$u, 174, 24, 5846);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "btn btn-outline-success m-2");
    			add_location(button3, file$u, 203, 28, 7894);
    			attr_dev(button4, "type", "button");
    			attr_dev(button4, "class", "btn btn-outline-danger m-2");
    			add_location(button4, file$u, 204, 28, 8018);
    			attr_dev(a, "href", "/admin/produt_view");
    			attr_dev(a, "class", "btn btn-outline-secondary m-2");
    			add_location(a, file$u, 205, 28, 8141);
    			attr_dev(div14, "class", "row justify-content-end mt-3");
    			add_location(div14, file$u, 202, 24, 7823);
    			add_location(b1, file$u, 208, 52, 8372);
    			attr_dev(p1, "class", "text-primary");
    			add_location(p1, file$u, 208, 28, 8348);
    			attr_dev(div15, "class", "row m-auto justify-content-center");
    			add_location(div15, file$u, 207, 24, 8272);
    			add_location(div16, file$u, 172, 20, 5742);
    			attr_dev(form, "class", "p-3 border-top");
    			add_location(form, file$u, 141, 16, 3994);
    			attr_dev(div17, "class", "container ml-2 p-2 border");
    			add_location(div17, file$u, 139, 12, 3873);
    			attr_dev(div18, "class", "row justify-content-center");
    			add_location(div18, file$u, 138, 4, 3819);
    			add_location(main, file$u, 137, 0, 3808);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div18);
    			append_dev(div18, div17);
    			append_dev(div17, h4);
    			append_dev(div17, t1);
    			append_dev(div17, form);
    			append_dev(form, h50);
    			append_dev(form, t3);
    			append_dev(form, div5);
    			append_dev(div5, div0);
    			append_dev(div0, input0);
    			append_dev(div5, t4);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div2, input1);
    			append_dev(div2, t5);
    			append_dev(div2, div1);
    			append_dev(div1, button0);
    			append_dev(button0, i0);
    			append_dev(div4, t6);
    			append_dev(div4, div3);
    			if (if_block0) if_block0.m(div3, null);
    			append_dev(form, t7);
    			append_dev(form, div6);
    			append_dev(div6, button1);
    			append_dev(form, t9);
    			append_dev(form, div7);
    			append_dev(div7, p0);
    			append_dev(p0, b0);
    			append_dev(b0, t10);
    			append_dev(form, t11);
    			append_dev(form, div8);
    			append_dev(form, t12);
    			append_dev(form, div16);
    			append_dev(div16, h51);
    			append_dev(div16, t14);
    			append_dev(div16, div13);
    			append_dev(div13, div9);
    			append_dev(div9, input2);
    			append_dev(div9, t15);
    			append_dev(div9, datalist);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(datalist, null);
    			}

    			append_dev(div13, t16);
    			append_dev(div13, div12);
    			if (if_block1) if_block1.m(div12, null);
    			append_dev(div12, t17);
    			append_dev(div12, div11);
    			append_dev(div11, input3);
    			append_dev(div11, t18);
    			append_dev(div11, div10);
    			append_dev(div10, button2);
    			append_dev(button2, i1);
    			append_dev(div16, t19);
    			append_dev(div16, div14);
    			append_dev(div14, button3);
    			append_dev(div14, t21);
    			append_dev(div14, button4);
    			append_dev(div14, t23);
    			append_dev(div14, a);
    			append_dev(div16, t25);
    			append_dev(div16, div15);
    			append_dev(div15, p1);
    			append_dev(p1, b1);
    			append_dev(b1, t26);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "change", /*change_handler*/ ctx[16], false, false, false),
    					listen_dev(input1, "change", /*change_handler_1*/ ctx[17], false, false, false),
    					listen_dev(button0, "click", /*newSubcat*/ ctx[8], false, false, false),
    					listen_dev(button1, "click", /*addNewCate*/ ctx[9], false, false, false),
    					listen_dev(input2, "change", /*change_handler_2*/ ctx[18], false, false, false),
    					listen_dev(input3, "change", /*change_handler_4*/ ctx[21], false, false, false),
    					listen_dev(button2, "click", /*addSubCat*/ ctx[11], false, false, false),
    					listen_dev(button3, "click", /*updateCate*/ ctx[13], false, false, false),
    					listen_dev(button4, "click", /*deleteCate*/ ctx[15], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*newSubCate*/ ctx[2]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$8(ctx);
    					if_block0.c();
    					if_block0.m(div3, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty[0] & /*message*/ 8) set_data_dev(t10, /*message*/ ctx[3]);

    			if (dirty[0] & /*categories*/ 1) {
    				each_value_1 = /*categories*/ ctx[0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(datalist, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (/*sCate*/ ctx[1]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$a(ctx);
    					if_block1.c();
    					if_block1.m(div12, t17);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty[0] & /*message2*/ 16) set_data_dev(t26, /*message2*/ ctx[4]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block0) if_block0.d();
    			destroy_each(each_blocks, detaching);
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Category', slots, []);
    	let categories = [];
    	let newCategories = { category: "", subCategory: "" };
    	let sCate = [];
    	let newSubCate = [];
    	let newSubChange;
    	let newCate = 'null';
    	let message = "";
    	let message2 = "";
    	let catId;
    	let cateChange;
    	let addSChange;
    	let selCat;

    	onMount(async () => {
    		await fetch(`${API_URL}/products/category/list`, { method: 'POST' }).then(response => response.json()).then(datas => {
    			$$invalidate(0, categories = datas.data);
    		});
    	});

    	const changeCate = e => {
    		selCat = e.target.value;

    		try {
    			let cate = categories.find(tmp => tmp.category === selCat);
    			catId = cate._id;

    			if (cate == undefined || cate == 'undefined') {
    				cateChange = selCat;
    			} else {
    				$$invalidate(1, sCate = cate.subCategory);
    			}
    		} catch(error) {
    			
    		}
    	};

    	// ---Add new categories----
    	const changeNewCat = e => {
    		newCate = e.target.value;
    	};

    	const changeNewScat = e => {
    		newSubChange = e.target.value;
    	};

    	const newSubcat = () => {
    		$$invalidate(2, newSubCate = [...newSubCate, newSubChange]);
    	};

    	const addNewCate = async () => {
    		if (newCate === "null") {
    			$$invalidate(3, message = "** Category Field Empty");
    		} else {
    			newCategories = {
    				category: newCate,
    				subCategory: newSubCate
    			};

    			try {
    				$$invalidate(3, message = "Loading..");

    				const res = await fetch(`${API_URL}/products/category/create`, {
    					method: 'post',
    					body: JSON.stringify(newCategories),
    					headers: { 'Content-Type': 'application/json' }
    				});

    				const json = await res.json();
    				$$invalidate(3, message = json.message);

    				if (json.status === true) {
    					window.location.reload();
    				}
    			} catch(error) {
    				$$invalidate(3, message = "Network Error");
    			}
    		}
    	};

    	// ---Update categories----
    	const addNewScat = e => {
    		addSChange = e.target.value;
    	};

    	const addSubCat = () => {
    		$$invalidate(1, sCate = [...sCate, addSChange]);
    	};

    	const sCatChange = (e, i) => {
    		const item = sCate;
    		item.splice(i, 1, e.target.value);
    		$$invalidate(1, sCate = item);
    	};

    	const updateCate = async () => {
    		newCategories = {
    			_id: catId,
    			category: selCat,
    			subCategory: sCate
    		};

    		try {
    			$$invalidate(4, message2 = "Loading...");

    			const res = await fetch(`${API_URL}/products/category/update`, {
    				method: 'post',
    				body: JSON.stringify(newCategories),
    				headers: { 'Content-Type': 'application/json' }
    			});

    			const json = await res.json();
    			$$invalidate(4, message2 = json.message);

    			if (json.status === true) {
    				window.location.reload();
    			}
    		} catch(error) {
    			$$invalidate(4, message2 = "Network Error");
    		}
    	};

    	const deleteSCat = (i, e) => {
    		const item = sCate;
    		item.splice(i, 1);
    		$$invalidate(1, sCate = item);
    		console.log(item);
    	};

    	const deleteCate = async () => {
    		newCategories = {
    			_id: catId,
    			category: selCat,
    			subCategory: sCate
    		};

    		try {
    			$$invalidate(4, message2 = "Loading...");

    			const res = await fetch(`${API_URL}/products/category/delete`, {
    				method: 'post',
    				body: JSON.stringify(newCategories),
    				headers: { 'Content-Type': 'application/json' }
    			});

    			const json = await res.json();
    			$$invalidate(4, message2 = "Delete Success");
    			window.location.reload();

    			if (json.status === true) {
    				window.location.reload();
    			}
    		} catch(error) {
    			$$invalidate(4, message2 = "Network Error");
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$7.warn(`<Category> was created with unknown prop '${key}'`);
    	});

    	const change_handler = e => changeNewCat(e);
    	const change_handler_1 = e => changeNewScat(e);
    	const change_handler_2 = e => changeCate(e);
    	const change_handler_3 = (i, e) => sCatChange(e, i);
    	const click_handler = (i, e) => deleteSCat(i, e);
    	const change_handler_4 = e => addNewScat(e);

    	$$self.$capture_state = () => ({
    		onMount,
    		API_URL,
    		categories,
    		newCategories,
    		sCate,
    		newSubCate,
    		newSubChange,
    		newCate,
    		message,
    		message2,
    		catId,
    		cateChange,
    		addSChange,
    		selCat,
    		changeCate,
    		changeNewCat,
    		changeNewScat,
    		newSubcat,
    		addNewCate,
    		addNewScat,
    		addSubCat,
    		sCatChange,
    		updateCate,
    		deleteSCat,
    		deleteCate
    	});

    	$$self.$inject_state = $$props => {
    		if ('categories' in $$props) $$invalidate(0, categories = $$props.categories);
    		if ('newCategories' in $$props) newCategories = $$props.newCategories;
    		if ('sCate' in $$props) $$invalidate(1, sCate = $$props.sCate);
    		if ('newSubCate' in $$props) $$invalidate(2, newSubCate = $$props.newSubCate);
    		if ('newSubChange' in $$props) newSubChange = $$props.newSubChange;
    		if ('newCate' in $$props) newCate = $$props.newCate;
    		if ('message' in $$props) $$invalidate(3, message = $$props.message);
    		if ('message2' in $$props) $$invalidate(4, message2 = $$props.message2);
    		if ('catId' in $$props) catId = $$props.catId;
    		if ('cateChange' in $$props) cateChange = $$props.cateChange;
    		if ('addSChange' in $$props) addSChange = $$props.addSChange;
    		if ('selCat' in $$props) selCat = $$props.selCat;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		categories,
    		sCate,
    		newSubCate,
    		message,
    		message2,
    		changeCate,
    		changeNewCat,
    		changeNewScat,
    		newSubcat,
    		addNewCate,
    		addNewScat,
    		addSubCat,
    		sCatChange,
    		updateCate,
    		deleteSCat,
    		deleteCate,
    		change_handler,
    		change_handler_1,
    		change_handler_2,
    		change_handler_3,
    		click_handler,
    		change_handler_4
    	];
    }

    class Category extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$u, create_fragment$u, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Category",
    			options,
    			id: create_fragment$u.name
    		});
    	}
    }

    /* src/pages/superAdmin/marketer/clientCreate.svelte generated by Svelte v3.44.1 */
    const file$t = "src/pages/superAdmin/marketer/clientCreate.svelte";

    function create_fragment$t(ctx) {
    	let main;
    	let div0;
    	let t0;
    	let div18;
    	let h4;
    	let t2;
    	let form;
    	let div3;
    	let div1;
    	let p0;
    	let t4;
    	let div2;
    	let input0;
    	let t5;
    	let div6;
    	let div4;
    	let p1;
    	let t7;
    	let div5;
    	let input1;
    	let t8;
    	let div9;
    	let div7;
    	let p2;
    	let t10;
    	let div8;
    	let input2;
    	let t11;
    	let div12;
    	let div10;
    	let p3;
    	let t13;
    	let div11;
    	let input3;
    	let t14;
    	let div15;
    	let div13;
    	let p4;
    	let t16;
    	let div14;
    	let select;
    	let option0;
    	let option1;
    	let t19;
    	let div16;
    	let p5;
    	let b;
    	let t20_value = /*message*/ ctx[0].msg + "";
    	let t20;
    	let p5_class_value;
    	let t21;
    	let div17;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div0 = element("div");
    			t0 = space();
    			div18 = element("div");
    			h4 = element("h4");
    			h4.textContent = "Create Marketer";
    			t2 = space();
    			form = element("form");
    			div3 = element("div");
    			div1 = element("div");
    			p0 = element("p");
    			p0.textContent = "Name";
    			t4 = space();
    			div2 = element("div");
    			input0 = element("input");
    			t5 = space();
    			div6 = element("div");
    			div4 = element("div");
    			p1 = element("p");
    			p1.textContent = "E-mail";
    			t7 = space();
    			div5 = element("div");
    			input1 = element("input");
    			t8 = space();
    			div9 = element("div");
    			div7 = element("div");
    			p2 = element("p");
    			p2.textContent = "Phone";
    			t10 = space();
    			div8 = element("div");
    			input2 = element("input");
    			t11 = space();
    			div12 = element("div");
    			div10 = element("div");
    			p3 = element("p");
    			p3.textContent = "Password";
    			t13 = space();
    			div11 = element("div");
    			input3 = element("input");
    			t14 = space();
    			div15 = element("div");
    			div13 = element("div");
    			p4 = element("p");
    			p4.textContent = "Status";
    			t16 = space();
    			div14 = element("div");
    			select = element("select");
    			option0 = element("option");
    			option0.textContent = "True";
    			option1 = element("option");
    			option1.textContent = "False";
    			t19 = space();
    			div16 = element("div");
    			p5 = element("p");
    			b = element("b");
    			t20 = text(t20_value);
    			t21 = space();
    			div17 = element("div");
    			button = element("button");
    			button.textContent = "Create";
    			attr_dev(div0, "class", "pt-4 ");
    			add_location(div0, file$t, 43, 4, 1130);
    			attr_dev(h4, "class", "heading text-center p-2  svelte-1m9fs8l");
    			add_location(h4, file$t, 45, 8, 1200);
    			attr_dev(p0, "class", "svelte-1m9fs8l");
    			add_location(p0, file$t, 48, 38, 1360);
    			attr_dev(div1, "class", "col-sm-3");
    			add_location(div1, file$t, 48, 16, 1338);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "form-control form-input svelte-1m9fs8l");
    			attr_dev(input0, "placeholder", "Name");
    			add_location(input0, file$t, 50, 20, 1432);
    			attr_dev(div2, "class", "col");
    			add_location(div2, file$t, 49, 16, 1394);
    			attr_dev(div3, "class", "row");
    			add_location(div3, file$t, 47, 12, 1304);
    			attr_dev(p1, "class", "svelte-1m9fs8l");
    			add_location(p1, file$t, 54, 38, 1639);
    			attr_dev(div4, "class", "col-sm-3");
    			add_location(div4, file$t, 54, 16, 1617);
    			input1.required = true;
    			attr_dev(input1, "type", "email");
    			attr_dev(input1, "class", "form-control form-input text-lower svelte-1m9fs8l");
    			attr_dev(input1, "placeholder", "E-mail");
    			add_location(input1, file$t, 56, 20, 1713);
    			attr_dev(div5, "class", "col");
    			add_location(div5, file$t, 55, 16, 1675);
    			attr_dev(div6, "class", "row");
    			add_location(div6, file$t, 53, 12, 1583);
    			attr_dev(p2, "class", "svelte-1m9fs8l");
    			add_location(p2, file$t, 60, 38, 1944);
    			attr_dev(div7, "class", "col-sm-3");
    			add_location(div7, file$t, 60, 16, 1922);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "class", "form-control form-input svelte-1m9fs8l");
    			attr_dev(input2, "placeholder", "Phone Number");
    			add_location(input2, file$t, 62, 20, 2017);
    			attr_dev(div8, "class", "col");
    			add_location(div8, file$t, 61, 16, 1979);
    			attr_dev(div9, "class", "row");
    			add_location(div9, file$t, 59, 12, 1888);
    			attr_dev(p3, "class", "svelte-1m9fs8l");
    			add_location(p3, file$t, 66, 38, 2233);
    			attr_dev(div10, "class", "col-sm-3");
    			add_location(div10, file$t, 66, 16, 2211);
    			attr_dev(input3, "type", "password");
    			attr_dev(input3, "class", "form-control form-input svelte-1m9fs8l");
    			attr_dev(input3, "placeholder", "Password");
    			add_location(input3, file$t, 68, 20, 2309);
    			attr_dev(div11, "class", "col");
    			add_location(div11, file$t, 67, 16, 2271);
    			attr_dev(div12, "class", "row");
    			add_location(div12, file$t, 65, 12, 2177);
    			attr_dev(p4, "class", "svelte-1m9fs8l");
    			add_location(p4, file$t, 72, 38, 2528);
    			attr_dev(div13, "class", "col-sm-3");
    			add_location(div13, file$t, 72, 16, 2506);
    			option0.__value = "true";
    			option0.value = option0.__value;
    			add_location(option0, file$t, 75, 28, 2699);
    			option1.__value = "false";
    			option1.value = option1.__value;
    			add_location(option1, file$t, 76, 28, 2762);
    			attr_dev(select, "class", "form-control form-select svelte-1m9fs8l");
    			if (/*inputs*/ ctx[1].active === void 0) add_render_callback(() => /*select_change_handler*/ ctx[7].call(select));
    			add_location(select, file$t, 74, 20, 2602);
    			attr_dev(div14, "class", "col");
    			add_location(div14, file$t, 73, 16, 2564);
    			attr_dev(div15, "class", "row");
    			add_location(div15, file$t, 71, 12, 2472);
    			add_location(b, file$t, 81, 43, 2978);
    			attr_dev(p5, "class", p5_class_value = "" + (null_to_empty(/*message*/ ctx[0].style) + " svelte-1m9fs8l"));
    			add_location(p5, file$t, 81, 16, 2951);
    			attr_dev(div16, "class", "row m-auto justify-content-center p-1");
    			add_location(div16, file$t, 80, 12, 2883);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-create svelte-1m9fs8l");
    			add_location(button, file$t, 84, 16, 3095);
    			attr_dev(div17, "class", "row m-auto justify-content-end");
    			add_location(div17, file$t, 83, 12, 3034);
    			attr_dev(form, "class", "border-top");
    			add_location(form, file$t, 46, 8, 1266);
    			attr_dev(div18, "class", "container border");
    			add_location(div18, file$t, 44, 4, 1160);
    			add_location(main, file$t, 42, 0, 1119);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);
    			append_dev(main, t0);
    			append_dev(main, div18);
    			append_dev(div18, h4);
    			append_dev(div18, t2);
    			append_dev(div18, form);
    			append_dev(form, div3);
    			append_dev(div3, div1);
    			append_dev(div1, p0);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			append_dev(div2, input0);
    			set_input_value(input0, /*inputs*/ ctx[1].name);
    			append_dev(form, t5);
    			append_dev(form, div6);
    			append_dev(div6, div4);
    			append_dev(div4, p1);
    			append_dev(div6, t7);
    			append_dev(div6, div5);
    			append_dev(div5, input1);
    			set_input_value(input1, /*inputs*/ ctx[1].email);
    			append_dev(form, t8);
    			append_dev(form, div9);
    			append_dev(div9, div7);
    			append_dev(div7, p2);
    			append_dev(div9, t10);
    			append_dev(div9, div8);
    			append_dev(div8, input2);
    			set_input_value(input2, /*inputs*/ ctx[1].phone);
    			append_dev(form, t11);
    			append_dev(form, div12);
    			append_dev(div12, div10);
    			append_dev(div10, p3);
    			append_dev(div12, t13);
    			append_dev(div12, div11);
    			append_dev(div11, input3);
    			set_input_value(input3, /*inputs*/ ctx[1].password);
    			append_dev(form, t14);
    			append_dev(form, div15);
    			append_dev(div15, div13);
    			append_dev(div13, p4);
    			append_dev(div15, t16);
    			append_dev(div15, div14);
    			append_dev(div14, select);
    			append_dev(select, option0);
    			append_dev(select, option1);
    			select_option(select, /*inputs*/ ctx[1].active);
    			append_dev(form, t19);
    			append_dev(form, div16);
    			append_dev(div16, p5);
    			append_dev(p5, b);
    			append_dev(b, t20);
    			append_dev(form, t21);
    			append_dev(form, div17);
    			append_dev(div17, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[3]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[4]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[5]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[6]),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[7]),
    					listen_dev(button, "click", /*addMarketer*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*inputs*/ 2 && input0.value !== /*inputs*/ ctx[1].name) {
    				set_input_value(input0, /*inputs*/ ctx[1].name);
    			}

    			if (dirty & /*inputs*/ 2 && input1.value !== /*inputs*/ ctx[1].email) {
    				set_input_value(input1, /*inputs*/ ctx[1].email);
    			}

    			if (dirty & /*inputs*/ 2 && input2.value !== /*inputs*/ ctx[1].phone) {
    				set_input_value(input2, /*inputs*/ ctx[1].phone);
    			}

    			if (dirty & /*inputs*/ 2 && input3.value !== /*inputs*/ ctx[1].password) {
    				set_input_value(input3, /*inputs*/ ctx[1].password);
    			}

    			if (dirty & /*inputs*/ 2) {
    				select_option(select, /*inputs*/ ctx[1].active);
    			}

    			if (dirty & /*message*/ 1 && t20_value !== (t20_value = /*message*/ ctx[0].msg + "")) set_data_dev(t20, t20_value);

    			if (dirty & /*message*/ 1 && p5_class_value !== (p5_class_value = "" + (null_to_empty(/*message*/ ctx[0].style) + " svelte-1m9fs8l"))) {
    				attr_dev(p5, "class", p5_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ClientCreate', slots, []);
    	let message = { msg: "", style: "" };

    	let inputs = {
    		name: "",
    		phone: "",
    		email: "",
    		password: "",
    		active: 'false'
    	};

    	const addMarketer = async () => {
    		let validate = marketerValid(inputs);

    		if (validate.valid == true) {
    			$$invalidate(0, message.style = 'text-info', message);
    			$$invalidate(0, message.msg = validate.error, message);

    			try {
    				$$invalidate(0, message.msg = "Loading..", message);

    				const res = await fetch(`${API_URL}/admin/marketeer/create`, {
    					method: 'post',
    					body: JSON.stringify(inputs),
    					headers: { 'Content-Type': 'application/json' }
    				});

    				const json = await res.json();
    				$$invalidate(0, message.style = 'text-info', message);
    				$$invalidate(0, message.msg = json.message, message);

    				if (json.status === true) {
    					$$invalidate(1, inputs.image = "", inputs);
    				}
    			} catch(error) {
    				$$invalidate(0, message.style = 'text-warning', message);
    				$$invalidate(0, message.msg = "Network error !!", message);
    			}
    		} else {
    			$$invalidate(0, message.style = 'text-danger', message);
    			$$invalidate(0, message.msg = validate.error, message);
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ClientCreate> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		inputs.name = this.value;
    		$$invalidate(1, inputs);
    	}

    	function input1_input_handler() {
    		inputs.email = this.value;
    		$$invalidate(1, inputs);
    	}

    	function input2_input_handler() {
    		inputs.phone = this.value;
    		$$invalidate(1, inputs);
    	}

    	function input3_input_handler() {
    		inputs.password = this.value;
    		$$invalidate(1, inputs);
    	}

    	function select_change_handler() {
    		inputs.active = select_value(this);
    		$$invalidate(1, inputs);
    	}

    	$$self.$capture_state = () => ({
    		API_URL,
    		marketerValid,
    		message,
    		inputs,
    		addMarketer
    	});

    	$$self.$inject_state = $$props => {
    		if ('message' in $$props) $$invalidate(0, message = $$props.message);
    		if ('inputs' in $$props) $$invalidate(1, inputs = $$props.inputs);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		message,
    		inputs,
    		addMarketer,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		select_change_handler
    	];
    }

    class ClientCreate extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ClientCreate",
    			options,
    			id: create_fragment$t.name
    		});
    	}
    }

    /* src/pages/superAdmin/marketer/clients.svelte generated by Svelte v3.44.1 */
    const file$s = "src/pages/superAdmin/marketer/clients.svelte";

    function get_each_context$l(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (35:8) {#if marketers !== ""}
    function create_if_block_1$7(ctx) {
    	let div;
    	let each_value = /*marketers*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$l(get_each_context$l(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "row justify-content-center");
    			add_location(div, file$s, 35, 8, 768);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*marketers*/ 1) {
    				each_value = /*marketers*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$l(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$l(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(35:8) {#if marketers !== \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    // (37:12) {#each marketers as user}
    function create_each_block$l(ctx) {
    	let a;
    	let div;
    	let h4;
    	let t0_value = /*user*/ ctx[4].name + "";
    	let t0;
    	let t1;
    	let h60;
    	let t2;
    	let b0;
    	let t3_value = /*user*/ ctx[4].phone + "";
    	let t3;
    	let t4;
    	let h61;
    	let t5;
    	let b1;
    	let t6_value = /*user*/ ctx[4].active + "";
    	let t6;
    	let t7;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			div = element("div");
    			h4 = element("h4");
    			t0 = text(t0_value);
    			t1 = space();
    			h60 = element("h6");
    			t2 = text("Phone: ");
    			b0 = element("b");
    			t3 = text(t3_value);
    			t4 = space();
    			h61 = element("h6");
    			t5 = text("Status: ");
    			b1 = element("b");
    			t6 = text(t6_value);
    			t7 = space();
    			attr_dev(h4, "class", "svelte-19xgrgf");
    			add_location(h4, file$s, 39, 24, 1004);
    			add_location(b0, file$s, 40, 35, 1060);
    			attr_dev(h60, "class", "svelte-19xgrgf");
    			add_location(h60, file$s, 40, 24, 1049);
    			add_location(b1, file$s, 41, 36, 1121);
    			attr_dev(h61, "class", "svelte-19xgrgf");
    			add_location(h61, file$s, 41, 24, 1109);
    			attr_dev(div, "class", "card-info svelte-19xgrgf");
    			add_location(div, file$s, 38, 20, 956);
    			attr_dev(a, "class", "col-sm-3 card card-user svelte-19xgrgf");
    			attr_dev(a, "href", a_href_value = "/admin/client_view/" + /*user*/ ctx[4]._id);
    			add_location(a, file$s, 37, 16, 863);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, div);
    			append_dev(div, h4);
    			append_dev(h4, t0);
    			append_dev(div, t1);
    			append_dev(div, h60);
    			append_dev(h60, t2);
    			append_dev(h60, b0);
    			append_dev(b0, t3);
    			append_dev(div, t4);
    			append_dev(div, h61);
    			append_dev(h61, t5);
    			append_dev(h61, b1);
    			append_dev(b1, t6);
    			append_dev(a, t7);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*marketers*/ 1 && t0_value !== (t0_value = /*user*/ ctx[4].name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*marketers*/ 1 && t3_value !== (t3_value = /*user*/ ctx[4].phone + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*marketers*/ 1 && t6_value !== (t6_value = /*user*/ ctx[4].active + "")) set_data_dev(t6, t6_value);

    			if (dirty & /*marketers*/ 1 && a_href_value !== (a_href_value = "/admin/client_view/" + /*user*/ ctx[4]._id)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$l.name,
    		type: "each",
    		source: "(37:12) {#each marketers as user}",
    		ctx
    	});

    	return block;
    }

    // (49:8) {#if marketers == ""}
    function create_if_block$9(ctx) {
    	let div;
    	let h5;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h5 = element("h5");
    			h5.textContent = "No Marketers..";
    			attr_dev(h5, "class", "text-secondary p-2 ");
    			add_location(h5, file$s, 50, 16, 1418);
    			attr_dev(div, "class", "row justify-content-center");
    			add_location(div, file$s, 49, 12, 1361);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h5);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(49:8) {#if marketers == \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$s(ctx) {
    	let main;
    	let div1;
    	let div0;
    	let h4;
    	let t1;
    	let t2;
    	let if_block0 = /*marketers*/ ctx[0] !== "" && create_if_block_1$7(ctx);
    	let if_block1 = /*marketers*/ ctx[0] == "" && create_if_block$9(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div1 = element("div");
    			div0 = element("div");
    			h4 = element("h4");
    			h4.textContent = "Marketers List";
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(h4, "class", "heading text-center p-2 border-bottom svelte-19xgrgf");
    			add_location(h4, file$s, 33, 8, 659);
    			attr_dev(div0, "class", "border");
    			add_location(div0, file$s, 32, 4, 630);
    			attr_dev(div1, "class", "container pt-4");
    			add_location(div1, file$s, 31, 0, 597);
    			add_location(main, file$s, 30, 0, 590);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div1);
    			append_dev(div1, div0);
    			append_dev(div0, h4);
    			append_dev(div0, t1);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t2);
    			if (if_block1) if_block1.m(div0, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*marketers*/ ctx[0] !== "") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$7(ctx);
    					if_block0.c();
    					if_block0.m(div0, t2);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*marketers*/ ctx[0] == "") {
    				if (if_block1) ; else {
    					if_block1 = create_if_block$9(ctx);
    					if_block1.c();
    					if_block1.m(div0, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Clients', slots, []);
    	let marketers = [];
    	let inputs = { skip: '', limit: 10 };
    	let totalCount;

    	onMount(async () => {
    		fetchMarketer();
    	});

    	const fetchMarketer = async () => {
    		await fetch(`${API_URL}/admin/marketeer/read`, {
    			method: 'POST',
    			body: JSON.stringify(inputs),
    			headers: { 'Content-Type': 'application/json' }
    		}).then(response => response.json()).then(datas => {
    			$$invalidate(0, marketers = datas.data.marketeers);
    			totalCount = datas.data.count;
    		});
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Clients> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		API_URL,
    		onMount,
    		marketers,
    		inputs,
    		totalCount,
    		fetchMarketer
    	});

    	$$self.$inject_state = $$props => {
    		if ('marketers' in $$props) $$invalidate(0, marketers = $$props.marketers);
    		if ('inputs' in $$props) inputs = $$props.inputs;
    		if ('totalCount' in $$props) totalCount = $$props.totalCount;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [marketers];
    }

    class Clients extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Clients",
    			options,
    			id: create_fragment$s.name
    		});
    	}
    }

    /* src/pages/superAdmin/marketer/clientView.svelte generated by Svelte v3.44.1 */
    const file$r = "src/pages/superAdmin/marketer/clientView.svelte";

    function get_each_context$k(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    // (173:4) {#if inputs.name != ""}
    function create_if_block$8(ctx) {
    	let div10;
    	let h4;
    	let t0_value = /*inputs*/ ctx[0].name + "";
    	let t0;
    	let t1;
    	let t2;
    	let ul;
    	let li0;
    	let a0;
    	let t4;
    	let li1;
    	let a1;
    	let t6;
    	let div9;
    	let div3;
    	let div0;
    	let h60;
    	let t8;
    	let input0;
    	let t9;
    	let h61;
    	let t11;
    	let input1;
    	let t12;
    	let h62;
    	let t14;
    	let input2;
    	let t15;
    	let h63;
    	let t17;
    	let input3;
    	let t18;
    	let h64;
    	let t20;
    	let label;
    	let input4;
    	let input4_checked_value;
    	let t21;
    	let b0;
    	let t22_value = /*inputs*/ ctx[0].active + "";
    	let t22;
    	let t23;
    	let div1;
    	let p;
    	let b1;
    	let t24_value = /*message*/ ctx[2].msg + "";
    	let t24;
    	let p_class_value;
    	let t25;
    	let div2;
    	let button0;
    	let t27;
    	let button1;
    	let t29;
    	let a2;
    	let t31;
    	let div8;
    	let div7;
    	let h65;
    	let t33;
    	let div6;
    	let div5;
    	let div4;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t35;
    	let th1;
    	let t37;
    	let th2;
    	let t39;
    	let th3;
    	let t41;
    	let th4;
    	let t43;
    	let th5;
    	let t45;
    	let tbody;
    	let mounted;
    	let dispose;
    	let each_value = /*myJobs*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$k(get_each_context$k(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div10 = element("div");
    			h4 = element("h4");
    			t0 = text(t0_value);
    			t1 = text(" Details");
    			t2 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "Details";
    			t4 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "Works";
    			t6 = space();
    			div9 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			h60 = element("h6");
    			h60.textContent = "Name:";
    			t8 = space();
    			input0 = element("input");
    			t9 = space();
    			h61 = element("h6");
    			h61.textContent = "E Mail:";
    			t11 = space();
    			input1 = element("input");
    			t12 = space();
    			h62 = element("h6");
    			h62.textContent = "Mobile:";
    			t14 = space();
    			input2 = element("input");
    			t15 = space();
    			h63 = element("h6");
    			h63.textContent = "Change Password:";
    			t17 = space();
    			input3 = element("input");
    			t18 = space();
    			h64 = element("h6");
    			h64.textContent = "Status:";
    			t20 = space();
    			label = element("label");
    			input4 = element("input");
    			t21 = space();
    			b0 = element("b");
    			t22 = text(t22_value);
    			t23 = space();
    			div1 = element("div");
    			p = element("p");
    			b1 = element("b");
    			t24 = text(t24_value);
    			t25 = space();
    			div2 = element("div");
    			button0 = element("button");
    			button0.textContent = "Update";
    			t27 = space();
    			button1 = element("button");
    			button1.textContent = "Delete";
    			t29 = space();
    			a2 = element("a");
    			a2.textContent = "Back";
    			t31 = space();
    			div8 = element("div");
    			div7 = element("div");
    			h65 = element("h6");
    			h65.textContent = "Assigned Work:";
    			t33 = space();
    			div6 = element("div");
    			div5 = element("div");
    			div4 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Product";
    			t35 = space();
    			th1 = element("th");
    			th1.textContent = "Ordered";
    			t37 = space();
    			th2 = element("th");
    			th2.textContent = "Details";
    			t39 = space();
    			th3 = element("th");
    			th3.textContent = "Category";
    			t41 = space();
    			th4 = element("th");
    			th4.textContent = "Address";
    			t43 = space();
    			th5 = element("th");
    			th5.textContent = "Status";
    			t45 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h4, "id", "heading");
    			attr_dev(h4, "class", "text-center text-capitalize  svelte-rwm17a");
    			add_location(h4, file$r, 174, 8, 4885);
    			attr_dev(a0, "data-toggle", "tab");
    			attr_dev(a0, "href", "#detail");
    			attr_dev(a0, "role", "tab");
    			attr_dev(a0, "class", "nav-link active");
    			add_location(a0, file$r, 179, 12, 5118);
    			attr_dev(li0, "class", "nav-item flex-sm-fill");
    			add_location(li0, file$r, 178, 10, 5071);
    			attr_dev(a1, "data-toggle", "tab");
    			attr_dev(a1, "href", "#orders");
    			attr_dev(a1, "role", "tab");
    			attr_dev(a1, "class", "nav-link");
    			add_location(a1, file$r, 187, 12, 5343);
    			attr_dev(li1, "class", "nav-item flex-sm-fill");
    			add_location(li1, file$r, 186, 10, 5296);
    			attr_dev(ul, "role", "tablist");
    			attr_dev(ul, "class", "nav nav-tabs mt-3 mb-3 pt-4 border-top");
    			add_location(ul, file$r, 177, 8, 4994);
    			attr_dev(h60, "class", "");
    			add_location(h60, file$r, 195, 14, 5649);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "form-control form-ipt svelte-rwm17a");
    			attr_dev(input0, "placeholder", "Name");
    			add_location(input0, file$r, 196, 14, 5687);
    			attr_dev(h61, "class", "");
    			add_location(h61, file$r, 202, 14, 5875);
    			attr_dev(input1, "type", "email");
    			attr_dev(input1, "class", "form-control form-ipt text-lower svelte-rwm17a");
    			attr_dev(input1, "placeholder", "E-mail");
    			add_location(input1, file$r, 203, 14, 5915);
    			attr_dev(h62, "class", "");
    			add_location(h62, file$r, 209, 14, 6118);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "class", "form-control form-ipt svelte-rwm17a");
    			attr_dev(input2, "placeholder", "Mobile Number");
    			add_location(input2, file$r, 210, 14, 6158);
    			attr_dev(h63, "class", "");
    			add_location(h63, file$r, 216, 14, 6356);
    			attr_dev(input3, "type", "password");
    			attr_dev(input3, "class", "form-control form-ipt svelte-rwm17a");
    			attr_dev(input3, "placeholder", "Change Password");
    			add_location(input3, file$r, 217, 14, 6405);
    			attr_dev(h64, "class", "");
    			add_location(h64, file$r, 223, 14, 6612);
    			attr_dev(input4, "type", "checkbox");
    			input4.checked = input4_checked_value = /*inputs*/ ctx[0].active;
    			add_location(input4, file$r, 225, 16, 6711);
    			add_location(b0, file$r, 229, 19, 6851);
    			attr_dev(label, "class", "border p-2 text-uppercase ");
    			add_location(label, file$r, 224, 14, 6652);
    			attr_dev(div0, "class", "p-3");
    			add_location(div0, file$r, 194, 12, 5617);
    			add_location(b1, file$r, 233, 39, 7019);
    			attr_dev(p, "class", p_class_value = "" + (null_to_empty(/*message*/ ctx[2].style) + " svelte-rwm17a"));
    			add_location(p, file$r, 233, 14, 6994);
    			attr_dev(div1, "class", "row m-auto justify-content-center p-1");
    			add_location(div1, file$r, 232, 12, 6928);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "btns btn btn-outline-info svelte-rwm17a");
    			add_location(button0, file$r, 236, 14, 7141);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "btns btn btn-outline-danger svelte-rwm17a");
    			add_location(button1, file$r, 240, 14, 7299);
    			attr_dev(a2, "href", "/admin/client_view");
    			attr_dev(a2, "class", "btns btn btn-outline-secondary svelte-rwm17a");
    			add_location(a2, file$r, 244, 14, 7460);
    			attr_dev(div2, "class", "row ml-auto justify-content-end pr-5");
    			add_location(div2, file$r, 235, 12, 7075);
    			attr_dev(div3, "id", "detail");
    			attr_dev(div3, "role", "tabpanel");
    			attr_dev(div3, "class", "tab-pane fade show active");
    			add_location(div3, file$r, 193, 10, 5537);
    			attr_dev(h65, "class", "");
    			add_location(h65, file$r, 251, 14, 7716);
    			add_location(th0, file$r, 258, 26, 8019);
    			add_location(th1, file$r, 259, 26, 8062);
    			add_location(th2, file$r, 260, 26, 8105);
    			add_location(th3, file$r, 261, 26, 8148);
    			add_location(th4, file$r, 262, 26, 8192);
    			add_location(th5, file$r, 263, 26, 8235);
    			add_location(tr, file$r, 257, 24, 7988);
    			add_location(thead, file$r, 256, 22, 7956);
    			attr_dev(tbody, "class", "table-body");
    			add_location(tbody, file$r, 266, 22, 8334);
    			attr_dev(table, "class", "table table-fill");
    			add_location(table, file$r, 255, 20, 7901);
    			attr_dev(div4, "class", "table-responsive border");
    			add_location(div4, file$r, 254, 18, 7843);
    			attr_dev(div5, "class", "col container");
    			add_location(div5, file$r, 253, 16, 7797);
    			attr_dev(div6, "class", "row");
    			add_location(div6, file$r, 252, 14, 7763);
    			attr_dev(div7, "class", "p-2");
    			add_location(div7, file$r, 250, 12, 7683);
    			attr_dev(div8, "id", "orders");
    			attr_dev(div8, "role", "tabpanel");
    			attr_dev(div8, "class", "tab-pane fade");
    			add_location(div8, file$r, 249, 10, 7615);
    			attr_dev(div9, "id", "myTabContent");
    			attr_dev(div9, "class", "tab-content");
    			add_location(div9, file$r, 192, 8, 5483);
    			attr_dev(div10, "class", "container-fluid border p-2");
    			add_location(div10, file$r, 173, 6, 4836);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div10, anchor);
    			append_dev(div10, h4);
    			append_dev(h4, t0);
    			append_dev(h4, t1);
    			append_dev(div10, t2);
    			append_dev(div10, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(ul, t4);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(div10, t6);
    			append_dev(div10, div9);
    			append_dev(div9, div3);
    			append_dev(div3, div0);
    			append_dev(div0, h60);
    			append_dev(div0, t8);
    			append_dev(div0, input0);
    			set_input_value(input0, /*inputs*/ ctx[0].name);
    			append_dev(div0, t9);
    			append_dev(div0, h61);
    			append_dev(div0, t11);
    			append_dev(div0, input1);
    			set_input_value(input1, /*inputs*/ ctx[0].email);
    			append_dev(div0, t12);
    			append_dev(div0, h62);
    			append_dev(div0, t14);
    			append_dev(div0, input2);
    			set_input_value(input2, /*inputs*/ ctx[0].phone);
    			append_dev(div0, t15);
    			append_dev(div0, h63);
    			append_dev(div0, t17);
    			append_dev(div0, input3);
    			set_input_value(input3, /*inputs*/ ctx[0].password);
    			append_dev(div0, t18);
    			append_dev(div0, h64);
    			append_dev(div0, t20);
    			append_dev(div0, label);
    			append_dev(label, input4);
    			append_dev(label, t21);
    			append_dev(label, b0);
    			append_dev(b0, t22);
    			append_dev(div3, t23);
    			append_dev(div3, div1);
    			append_dev(div1, p);
    			append_dev(p, b1);
    			append_dev(b1, t24);
    			append_dev(div3, t25);
    			append_dev(div3, div2);
    			append_dev(div2, button0);
    			append_dev(div2, t27);
    			append_dev(div2, button1);
    			append_dev(div2, t29);
    			append_dev(div2, a2);
    			append_dev(div9, t31);
    			append_dev(div9, div8);
    			append_dev(div8, div7);
    			append_dev(div7, h65);
    			append_dev(div7, t33);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t35);
    			append_dev(tr, th1);
    			append_dev(tr, t37);
    			append_dev(tr, th2);
    			append_dev(tr, t39);
    			append_dev(tr, th3);
    			append_dev(tr, t41);
    			append_dev(tr, th4);
    			append_dev(tr, t43);
    			append_dev(tr, th5);
    			append_dev(table, t45);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[10]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[11]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[12]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[13]),
    					listen_dev(input4, "click", /*chekboxx*/ ctx[5], false, false, false),
    					listen_dev(button0, "click", /*updateHandle*/ ctx[3], false, false, false),
    					listen_dev(button1, "click", /*deleteConfirm*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*inputs*/ 1 && t0_value !== (t0_value = /*inputs*/ ctx[0].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*inputs*/ 1 && input0.value !== /*inputs*/ ctx[0].name) {
    				set_input_value(input0, /*inputs*/ ctx[0].name);
    			}

    			if (dirty & /*inputs*/ 1 && input1.value !== /*inputs*/ ctx[0].email) {
    				set_input_value(input1, /*inputs*/ ctx[0].email);
    			}

    			if (dirty & /*inputs*/ 1 && input2.value !== /*inputs*/ ctx[0].phone) {
    				set_input_value(input2, /*inputs*/ ctx[0].phone);
    			}

    			if (dirty & /*inputs*/ 1 && input3.value !== /*inputs*/ ctx[0].password) {
    				set_input_value(input3, /*inputs*/ ctx[0].password);
    			}

    			if (dirty & /*inputs*/ 1 && input4_checked_value !== (input4_checked_value = /*inputs*/ ctx[0].active)) {
    				prop_dev(input4, "checked", input4_checked_value);
    			}

    			if (dirty & /*inputs*/ 1 && t22_value !== (t22_value = /*inputs*/ ctx[0].active + "")) set_data_dev(t22, t22_value);
    			if (dirty & /*message*/ 4 && t24_value !== (t24_value = /*message*/ ctx[2].msg + "")) set_data_dev(t24, t24_value);

    			if (dirty & /*message*/ 4 && p_class_value !== (p_class_value = "" + (null_to_empty(/*message*/ ctx[2].style) + " svelte-rwm17a"))) {
    				attr_dev(p, "class", p_class_value);
    			}

    			if (dirty & /*myJobs, viewDetails, viewDistributer, viewItem*/ 450) {
    				each_value = /*myJobs*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$k(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$k(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div10);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(173:4) {#if inputs.name != \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    // (296:30) {:else}
    function create_else_block$3(ctx) {
    	let h6;

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			h6.textContent = "Mismached";
    			add_location(h6, file$r, 296, 32, 10238);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(296:30) {:else}",
    		ctx
    	});

    	return block;
    }

    // (294:58) 
    function create_if_block_7$2(ctx) {
    	let h6;

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			h6.textContent = "Completed";
    			attr_dev(h6, "class", "text-success");
    			add_location(h6, file$r, 294, 32, 10128);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7$2.name,
    		type: "if",
    		source: "(294:58) ",
    		ctx
    	});

    	return block;
    }

    // (292:58) 
    function create_if_block_6$3(ctx) {
    	let h6;

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			h6.textContent = "Second Pay";
    			attr_dev(h6, "class", "text-info");
    			add_location(h6, file$r, 292, 32, 9999);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$3.name,
    		type: "if",
    		source: "(292:58) ",
    		ctx
    	});

    	return block;
    }

    // (290:58) 
    function create_if_block_5$3(ctx) {
    	let h6;

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			h6.textContent = "Printing";
    			add_location(h6, file$r, 290, 32, 9889);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$3.name,
    		type: "if",
    		source: "(290:58) ",
    		ctx
    	});

    	return block;
    }

    // (288:58) 
    function create_if_block_4$3(ctx) {
    	let h6;

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			h6.textContent = "First Pay";
    			attr_dev(h6, "class", "text-info");
    			add_location(h6, file$r, 288, 32, 9761);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$3.name,
    		type: "if",
    		source: "(288:58) ",
    		ctx
    	});

    	return block;
    }

    // (286:58) 
    function create_if_block_3$3(ctx) {
    	let h6;

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			h6.textContent = "Confirmed";
    			attr_dev(h6, "class", "text-primary");
    			add_location(h6, file$r, 286, 32, 9630);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$3.name,
    		type: "if",
    		source: "(286:58) ",
    		ctx
    	});

    	return block;
    }

    // (284:58) 
    function create_if_block_2$3(ctx) {
    	let h6;

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			h6.textContent = "Assigned";
    			add_location(h6, file$r, 284, 32, 9521);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(284:58) ",
    		ctx
    	});

    	return block;
    }

    // (282:30) {#if item.status === 0}
    function create_if_block_1$6(ctx) {
    	let h6;

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			h6.textContent = "Not Assign";
    			attr_dev(h6, "class", "text-warning");
    			add_location(h6, file$r, 282, 32, 9389);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(282:30) {#if item.status === 0}",
    		ctx
    	});

    	return block;
    }

    // (268:24) {#each myJobs as item}
    function create_each_block$k(ctx) {
    	let tr;
    	let td0;
    	let button0;
    	let t1;
    	let td1;
    	let button1;
    	let t3;
    	let td2;
    	let button2;
    	let t5;
    	let td3;
    	let h60;
    	let t6_value = /*item*/ ctx[15].category + "";
    	let t6;
    	let t7;
    	let t8_value = /*item*/ ctx[15].subCategory + "";
    	let t8;
    	let t9;
    	let td4;
    	let h61;
    	let t10_value = /*item*/ ctx[15].shipping_address + "";
    	let t10;
    	let t11;
    	let td5;
    	let t12;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*item*/ ctx[15].status === 0) return create_if_block_1$6;
    		if (/*item*/ ctx[15].status === 1) return create_if_block_2$3;
    		if (/*item*/ ctx[15].status === 2) return create_if_block_3$3;
    		if (/*item*/ ctx[15].status === 3) return create_if_block_4$3;
    		if (/*item*/ ctx[15].status === 4) return create_if_block_5$3;
    		if (/*item*/ ctx[15].status === 5) return create_if_block_6$3;
    		if (/*item*/ ctx[15].status === 6) return create_if_block_7$2;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			button0 = element("button");
    			button0.textContent = "Product";
    			t1 = space();
    			td1 = element("td");
    			button1 = element("button");
    			button1.textContent = "Distributer";
    			t3 = space();
    			td2 = element("td");
    			button2 = element("button");
    			button2.textContent = "View";
    			t5 = space();
    			td3 = element("td");
    			h60 = element("h6");
    			t6 = text(t6_value);
    			t7 = text(", ");
    			t8 = text(t8_value);
    			t9 = space();
    			td4 = element("td");
    			h61 = element("h6");
    			t10 = text(t10_value);
    			t11 = space();
    			td5 = element("td");
    			if_block.c();
    			t12 = space();
    			attr_dev(button0, "class", "btn btn-link");
    			add_location(button0, file$r, 270, 30, 8502);
    			add_location(td0, file$r, 269, 28, 8467);
    			attr_dev(button1, "class", "btn btn-link");
    			add_location(button1, file$r, 273, 30, 8703);
    			attr_dev(td1, "class", "text-center");
    			add_location(td1, file$r, 272, 28, 8648);
    			attr_dev(button2, "class", "btn btn-link");
    			add_location(button2, file$r, 276, 30, 8920);
    			attr_dev(td2, "class", "text-center");
    			add_location(td2, file$r, 275, 28, 8865);
    			add_location(h60, file$r, 278, 52, 9093);
    			attr_dev(td3, "class", "text-center");
    			add_location(td3, file$r, 278, 28, 9069);
    			add_location(h61, file$r, 279, 52, 9195);
    			attr_dev(td4, "class", "text-center");
    			add_location(td4, file$r, 279, 28, 9171);
    			attr_dev(td5, "class", "text-center d-block d-inline");
    			add_location(td5, file$r, 280, 28, 9261);
    			add_location(tr, file$r, 268, 26, 8434);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, button0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, button1);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, button2);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, h60);
    			append_dev(h60, t6);
    			append_dev(h60, t7);
    			append_dev(h60, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td4);
    			append_dev(td4, h61);
    			append_dev(h61, t10);
    			append_dev(tr, t11);
    			append_dev(tr, td5);
    			if_block.m(td5, null);
    			append_dev(tr, t12);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						button0,
    						"click",
    						function () {
    							if (is_function(/*viewItem*/ ctx[6](/*item*/ ctx[15].product_id))) /*viewItem*/ ctx[6](/*item*/ ctx[15].product_id).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button1,
    						"click",
    						function () {
    							if (is_function(/*viewDistributer*/ ctx[8](/*item*/ ctx[15].order_placed_by))) /*viewDistributer*/ ctx[8](/*item*/ ctx[15].order_placed_by).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button2,
    						"click",
    						function () {
    							if (is_function(/*viewDetails*/ ctx[7](/*item*/ ctx[15].order_details))) /*viewDetails*/ ctx[7](/*item*/ ctx[15].order_details).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*myJobs*/ 2 && t6_value !== (t6_value = /*item*/ ctx[15].category + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*myJobs*/ 2 && t8_value !== (t8_value = /*item*/ ctx[15].subCategory + "")) set_data_dev(t8, t8_value);
    			if (dirty & /*myJobs*/ 2 && t10_value !== (t10_value = /*item*/ ctx[15].shipping_address + "")) set_data_dev(t10, t10_value);

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(td5, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$k.name,
    		type: "each",
    		source: "(268:24) {#each myJobs as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$r(ctx) {
    	let main;
    	let div;
    	let if_block = /*inputs*/ ctx[0].name != "" && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "row justify-content-center");
    			add_location(div, file$r, 171, 2, 4761);
    			add_location(main, file$r, 170, 0, 4752);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*inputs*/ ctx[0].name != "") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$8(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ClientView', slots, []);
    	let { id } = $$props;

    	let inputs = {
    		name: "",
    		phone: "",
    		email: "",
    		password: "",
    		active: false
    	};

    	let myJobs = [];
    	let message = { msg: "", style: "" };

    	onMount(async () => {
    		await fetch(`${API_URL}/admin/marketeer/read/${id}`, { method: "POST" }).then(response => response.json()).then(datas => {
    			$$invalidate(0, inputs = datas.data);
    		});

    		let bodyData = { _id: id };

    		const res = await fetch(`${API_URL}/marketeer/my_jobs`, {
    			method: 'post',
    			body: JSON.stringify(bodyData),
    			headers: { 'Content-Type': 'application/json' }
    		});

    		const json = await res.json();
    		$$invalidate(1, myJobs = json.data);
    	});

    	const updateHandle = async () => {
    		let validate = marketerValid(inputs);

    		if (validate.valid == true) {
    			$$invalidate(2, message.style = "text-info", message);
    			$$invalidate(2, message.msg = validate.error, message);

    			try {
    				$$invalidate(2, message.msg = "Loading..", message);

    				const res = await fetch(`${API_URL}/admin/marketeer/update`, {
    					method: "post",
    					body: JSON.stringify(inputs),
    					headers: { "Content-Type": "application/json" }
    				});

    				const json = await res.json();
    				$$invalidate(2, message.style = "text-info", message);
    				$$invalidate(2, message.msg = json.message, message);

    				if (json.status === true) {
    					$$invalidate(0, inputs.image = "", inputs);
    				}
    			} catch(error) {
    				$$invalidate(2, message.style = "text-warning", message);
    				$$invalidate(2, message.msg = "Network error !!", message);
    			}
    		} else {
    			$$invalidate(2, message.style = "text-danger", message);
    			$$invalidate(2, message.msg = validate.error, message);
    		}
    	};

    	const deleteConfirm = async () => {
    		sweetalert2_all.fire({
    			title: "Are you sure?",
    			text: "Delete  " + inputs.name,
    			showCancelButton: true,
    			confirmButtonColor: "#3085d6",
    			cancelButtonColor: "#d33",
    			confirmButtonText: "Yes, delete it!"
    		}).then(result => {
    			if (result.isConfirmed) {
    				deleteHandle();
    			}
    		});
    	};

    	const deleteHandle = async () => {
    		try {
    			let bodyIn = { _id: id };

    			const res = await fetch(`${API_URL}/admin/marketeer/delete`, {
    				method: "post",
    				body: JSON.stringify(bodyIn),
    				headers: { "Content-Type": "application/json" }
    			});

    			const json = await res.json();

    			if (json.status === true) {
    				navigate("/admin/client_view");
    			}
    		} catch(error) {
    			$$invalidate(2, message.style = "text-warning", message);
    			$$invalidate(2, message.msg = "Network error !!", message);
    		}
    	};

    	const chekboxx = e => {
    		const checked = e.target.checked;
    		$$invalidate(0, inputs.active = checked, inputs);
    	};

    	const viewItem = async e => {
    		await fetch(`${API_URL}/products/list/${e}`, { method: "POST" }).then(response => response.json()).then(datas => {
    			sweetalert2_all.fire({
    				title: datas.data.title,
    				text: datas.data.category + ", " + datas.data.subCategory,
    				imageUrl: datas.data.image,
    				imageWidth: 100,
    				imageHeight: 200,
    				imageAlt: "Custom image"
    			});
    		});
    	};

    	const viewDetails = e => {
    		sweetalert2_all.fire({
    			title: "Order Details",
    			html: "<div><tr><b>Width : </b><i>" + e.width + "</i></tr></br><tr><b>Height : </b><i>" + e.height + "</i></tr></br><tr><b>ArcTop : </b><i>" + e.arcTop + "</i></tr></br><tr><b>ArcBottom : </b><i>" + e.arcBottom + "</i></tr></br><tr><b>Sandwich : </b><i>" + e.sandwich + "</i></tr></br><tr><b>Varnish : </b><i>" + e.varnish + "</i></tr></br><tr><b>WhiteCoat : </b><i>" + e.whiteCoat + "</i></tr></br><tr><b>Message : </b><i>" + e.message + "</i></tr></div>"
    		});
    	};

    	const viewDistributer = async e => {
    		await fetch(`${API_URL}/admin/distributer/read/${e}`, { method: "POST" }).then(response => response.json()).then(datas => {
    			sweetalert2_all.fire({
    				title: "Distributer Details",
    				html: "<div><tr><b>Name : </b><i>" + datas.data.name + "</i></tr></br><tr><b>Phone : </b><i>" + datas.data.phone + "</i></tr></br><tr><b>E mail : </b><i>" + datas.data.email + "</i></tr></br><tr><b>Base Price : </b><i>" + datas.data.basePrice + "</i></tr></br><tr><b>Delivery Price : </b><i>" + datas.data.deliveryPrice + "</i></tr></br><tr><b>Status : </b><i>" + datas.data.active + "</i></tr></br></div>"
    			});
    		});
    	};

    	const writable_props = ['id'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ClientView> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		inputs.name = this.value;
    		$$invalidate(0, inputs);
    	}

    	function input1_input_handler() {
    		inputs.email = this.value;
    		$$invalidate(0, inputs);
    	}

    	function input2_input_handler() {
    		inputs.phone = this.value;
    		$$invalidate(0, inputs);
    	}

    	function input3_input_handler() {
    		inputs.password = this.value;
    		$$invalidate(0, inputs);
    	}

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(9, id = $$props.id);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		navigate,
    		Swal: sweetalert2_all,
    		API_URL,
    		marketerValid,
    		id,
    		inputs,
    		myJobs,
    		message,
    		updateHandle,
    		deleteConfirm,
    		deleteHandle,
    		chekboxx,
    		viewItem,
    		viewDetails,
    		viewDistributer
    	});

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(9, id = $$props.id);
    		if ('inputs' in $$props) $$invalidate(0, inputs = $$props.inputs);
    		if ('myJobs' in $$props) $$invalidate(1, myJobs = $$props.myJobs);
    		if ('message' in $$props) $$invalidate(2, message = $$props.message);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		inputs,
    		myJobs,
    		message,
    		updateHandle,
    		deleteConfirm,
    		chekboxx,
    		viewItem,
    		viewDetails,
    		viewDistributer,
    		id,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler
    	];
    }

    class ClientView extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, { id: 9 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ClientView",
    			options,
    			id: create_fragment$r.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*id*/ ctx[9] === undefined && !('id' in props)) {
    			console.warn("<ClientView> was created without expected prop 'id'");
    		}
    	}

    	get id() {
    		throw new Error("<ClientView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<ClientView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/pages/superAdmin/order/tabs/assigned.svelte generated by Svelte v3.44.1 */
    const file$q = "src/pages/superAdmin/order/tabs/assigned.svelte";

    function get_each_context$j(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (102:20) {#each orders as item}
    function create_each_block$j(ctx) {
    	let tr;
    	let td0;
    	let button0;
    	let t1;
    	let td1;
    	let button1;
    	let t3;
    	let td2;
    	let button2;
    	let t5;
    	let td3;
    	let a;
    	let t6;
    	let a_href_value;
    	let t7;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			button0 = element("button");
    			button0.textContent = "Product";
    			t1 = space();
    			td1 = element("td");
    			button1 = element("button");
    			button1.textContent = "Marketer";
    			t3 = space();
    			td2 = element("td");
    			button2 = element("button");
    			button2.textContent = "Distributer";
    			t5 = space();
    			td3 = element("td");
    			a = element("a");
    			t6 = text("View");
    			t7 = space();
    			attr_dev(button0, "class", "btn btn-link");
    			add_location(button0, file$q, 103, 28, 3206);
    			add_location(td0, file$q, 103, 24, 3202);
    			attr_dev(button1, "class", "btn btn-link");
    			add_location(button1, file$q, 104, 28, 3323);
    			add_location(td1, file$q, 104, 24, 3319);
    			attr_dev(button2, "class", "btn btn-link");
    			add_location(button2, file$q, 105, 48, 3474);
    			attr_dev(td2, "class", "text-center");
    			add_location(td2, file$q, 105, 24, 3450);
    			attr_dev(a, "class", "col-sm-3 btn btn-link");
    			attr_dev(a, "href", a_href_value = "/admin/orders/" + /*item*/ ctx[6]._id);
    			add_location(a, file$q, 106, 48, 3628);
    			attr_dev(td3, "class", "text-center");
    			add_location(td3, file$q, 106, 24, 3604);
    			add_location(tr, file$q, 102, 24, 3173);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, button0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, button1);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, button2);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, a);
    			append_dev(a, t6);
    			append_dev(tr, t7);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						button0,
    						"click",
    						function () {
    							if (is_function(/*viewItem*/ ctx[1](/*item*/ ctx[6].product_id))) /*viewItem*/ ctx[1](/*item*/ ctx[6].product_id).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button1,
    						"click",
    						function () {
    							if (is_function(/*viewMarketer*/ ctx[3](/*item*/ ctx[6].order_processed_by))) /*viewMarketer*/ ctx[3](/*item*/ ctx[6].order_processed_by).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button2,
    						"click",
    						function () {
    							if (is_function(/*viewDistributer*/ ctx[2](/*item*/ ctx[6].order_placed_by))) /*viewDistributer*/ ctx[2](/*item*/ ctx[6].order_placed_by).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*orders*/ 1 && a_href_value !== (a_href_value = "/admin/orders/" + /*item*/ ctx[6]._id)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$j.name,
    		type: "each",
    		source: "(102:20) {#each orders as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$q(ctx) {
    	let main;
    	let div3;
    	let div2;
    	let div1;
    	let div0;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let tbody;
    	let each_value = /*orders*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$j(get_each_context$j(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Product";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Marketer";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Ordered By";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Order Details";
    			t7 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$q, 94, 22, 2850);
    			add_location(th1, file$q, 95, 22, 2889);
    			add_location(th2, file$q, 96, 22, 2929);
    			add_location(th3, file$q, 97, 22, 2971);
    			add_location(tr, file$q, 93, 20, 2823);
    			add_location(thead, file$q, 92, 18, 2795);
    			attr_dev(tbody, "class", "m-auto align-item-center");
    			add_location(tbody, file$q, 100, 18, 3065);
    			attr_dev(table, "class", "table table-fill sortable");
    			add_location(table, file$q, 91, 16, 2735);
    			attr_dev(div0, "class", "table-responsive border");
    			add_location(div0, file$q, 90, 14, 2681);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$q, 89, 8, 2649);
    			attr_dev(div2, "class", "row");
    			add_location(div2, file$q, 88, 8, 2623);
    			attr_dev(div3, "class", "container-flex");
    			add_location(div3, file$q, 87, 4, 2586);
    			add_location(main, file$q, 86, 0, 2575);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    			append_dev(tr, t3);
    			append_dev(tr, th2);
    			append_dev(tr, t5);
    			append_dev(tr, th3);
    			append_dev(table, t7);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*orders, viewDistributer, viewMarketer, viewItem*/ 15) {
    				each_value = /*orders*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$j(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$j(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Assigned', slots, []);
    	let orders = [];
    	let inputs = { skip: "", limit: 200 };

    	onMount(() => {
    		fetchOrders();
    	});

    	const fetchOrders = async () => {
    		await fetch(`${API_URL}/order/read`, {
    			method: "POST",
    			body: JSON.stringify(inputs),
    			headers: { "Content-Type": "application/json" }
    		}).then(response => response.json()).then(datas => {
    			$$invalidate(0, orders = datas.data.filter(item => item.status === 1));
    		});
    	};

    	const viewItem = async e => {
    		await fetch(`${API_URL}/products/list/${e}`, { method: "POST" }).then(response => response.json()).then(datas => {
    			sweetalert2_all.fire({
    				title: datas.data.title,
    				text: datas.data.category + ", " + datas.data.subCategory,
    				imageUrl: datas.data.image,
    				imageWidth: 100,
    				imageHeight: 200,
    				imageAlt: "Custom image"
    			});
    		});
    	};

    	const viewDistributer = async e => {
    		await fetch(`${API_URL}/admin/distributer/read/${e}`, { method: "POST" }).then(response => response.json()).then(datas => {
    			sweetalert2_all.fire({
    				title: "Distributer Details",
    				html: "<div><tr><b>Name : </b><i>" + datas.data.name + "</i></tr></br><tr><b>Phone : </b><i>" + datas.data.phone + "</i></tr></br><tr><b>E mail : </b><i>" + datas.data.email + "</i></tr></br><tr><b>Base Price : </b><i>" + datas.data.basePrice + "</i></tr></br><tr><b>Delivery Price : </b><i>" + datas.data.deliveryPrice + "</i></tr></br><tr><b>Status : </b><i>" + datas.data.active + "</i></tr></br></div>"
    			});
    		});
    	};

    	const viewMarketer = async e => {
    		await fetch(`${API_URL}/admin/marketeer/read/${e}`, { method: "POST" }).then(response => response.json()).then(datas => {
    			sweetalert2_all.fire({
    				title: "Distributer Details",
    				html: "<div><tr><b>Name : </b><i>" + datas.data.name + "</i></tr></br><tr><b>Phone : </b><i>" + datas.data.phone + "</i></tr></br><tr><b>E mail : </b><i>" + datas.data.email + "</i></tr></br><tr><b>Status : </b><i>" + datas.data.active + "</i></tr></br></div>"
    			});
    		});
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Assigned> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		API_URL,
    		onMount,
    		Swal: sweetalert2_all,
    		orders,
    		inputs,
    		fetchOrders,
    		viewItem,
    		viewDistributer,
    		viewMarketer
    	});

    	$$self.$inject_state = $$props => {
    		if ('orders' in $$props) $$invalidate(0, orders = $$props.orders);
    		if ('inputs' in $$props) inputs = $$props.inputs;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [orders, viewItem, viewDistributer, viewMarketer];
    }

    class Assigned extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Assigned",
    			options,
    			id: create_fragment$q.name
    		});
    	}
    }

    /* src/pages/superAdmin/order/tabs/confirmed.svelte generated by Svelte v3.44.1 */
    const file$p = "src/pages/superAdmin/order/tabs/confirmed.svelte";

    function get_each_context$i(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (102:20) {#each orders as item}
    function create_each_block$i(ctx) {
    	let tr;
    	let td0;
    	let button0;
    	let t1;
    	let td1;
    	let button1;
    	let t3;
    	let td2;
    	let button2;
    	let t5;
    	let td3;
    	let a;
    	let t6;
    	let a_href_value;
    	let t7;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			button0 = element("button");
    			button0.textContent = "Product";
    			t1 = space();
    			td1 = element("td");
    			button1 = element("button");
    			button1.textContent = "Marketer";
    			t3 = space();
    			td2 = element("td");
    			button2 = element("button");
    			button2.textContent = "Distributer";
    			t5 = space();
    			td3 = element("td");
    			a = element("a");
    			t6 = text("View");
    			t7 = space();
    			attr_dev(button0, "class", "btn btn-link");
    			add_location(button0, file$p, 103, 28, 3206);
    			add_location(td0, file$p, 103, 24, 3202);
    			attr_dev(button1, "class", "btn btn-link");
    			add_location(button1, file$p, 104, 28, 3323);
    			add_location(td1, file$p, 104, 24, 3319);
    			attr_dev(button2, "class", "btn btn-link");
    			add_location(button2, file$p, 105, 48, 3474);
    			attr_dev(td2, "class", "text-center");
    			add_location(td2, file$p, 105, 24, 3450);
    			attr_dev(a, "class", "col-sm-3 btn btn-link");
    			attr_dev(a, "href", a_href_value = "/admin/orders/" + /*item*/ ctx[6]._id);
    			add_location(a, file$p, 106, 48, 3628);
    			attr_dev(td3, "class", "text-center");
    			add_location(td3, file$p, 106, 24, 3604);
    			add_location(tr, file$p, 102, 24, 3173);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, button0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, button1);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, button2);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, a);
    			append_dev(a, t6);
    			append_dev(tr, t7);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						button0,
    						"click",
    						function () {
    							if (is_function(/*viewItem*/ ctx[1](/*item*/ ctx[6].product_id))) /*viewItem*/ ctx[1](/*item*/ ctx[6].product_id).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button1,
    						"click",
    						function () {
    							if (is_function(/*viewMarketer*/ ctx[3](/*item*/ ctx[6].order_processed_by))) /*viewMarketer*/ ctx[3](/*item*/ ctx[6].order_processed_by).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button2,
    						"click",
    						function () {
    							if (is_function(/*viewDistributer*/ ctx[2](/*item*/ ctx[6].order_placed_by))) /*viewDistributer*/ ctx[2](/*item*/ ctx[6].order_placed_by).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*orders*/ 1 && a_href_value !== (a_href_value = "/admin/orders/" + /*item*/ ctx[6]._id)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$i.name,
    		type: "each",
    		source: "(102:20) {#each orders as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let main;
    	let div3;
    	let div2;
    	let div1;
    	let div0;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let tbody;
    	let each_value = /*orders*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$i(get_each_context$i(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Product";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Marketer";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Ordered By";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Order Details";
    			t7 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$p, 94, 22, 2850);
    			add_location(th1, file$p, 95, 22, 2889);
    			add_location(th2, file$p, 96, 22, 2929);
    			add_location(th3, file$p, 97, 22, 2971);
    			add_location(tr, file$p, 93, 20, 2823);
    			add_location(thead, file$p, 92, 18, 2795);
    			attr_dev(tbody, "class", "m-auto align-item-center");
    			add_location(tbody, file$p, 100, 18, 3065);
    			attr_dev(table, "class", "table table-fill sortable");
    			add_location(table, file$p, 91, 16, 2735);
    			attr_dev(div0, "class", "table-responsive border");
    			add_location(div0, file$p, 90, 14, 2681);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$p, 89, 8, 2649);
    			attr_dev(div2, "class", "row");
    			add_location(div2, file$p, 88, 8, 2623);
    			attr_dev(div3, "class", "container-flex");
    			add_location(div3, file$p, 87, 4, 2586);
    			add_location(main, file$p, 86, 0, 2575);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    			append_dev(tr, t3);
    			append_dev(tr, th2);
    			append_dev(tr, t5);
    			append_dev(tr, th3);
    			append_dev(table, t7);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*orders, viewDistributer, viewMarketer, viewItem*/ 15) {
    				each_value = /*orders*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$i(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$i(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Confirmed', slots, []);
    	let orders = [];
    	let inputs = { skip: "", limit: 200 };

    	onMount(() => {
    		fetchOrders();
    	});

    	const fetchOrders = async () => {
    		await fetch(`${API_URL}/order/read`, {
    			method: "POST",
    			body: JSON.stringify(inputs),
    			headers: { "Content-Type": "application/json" }
    		}).then(response => response.json()).then(datas => {
    			$$invalidate(0, orders = datas.data.filter(item => item.status === 2));
    		});
    	};

    	const viewItem = async e => {
    		await fetch(`${API_URL}/products/list/${e}`, { method: "POST" }).then(response => response.json()).then(datas => {
    			sweetalert2_all.fire({
    				title: datas.data.title,
    				text: datas.data.category + ", " + datas.data.subCategory,
    				imageUrl: datas.data.image,
    				imageWidth: 100,
    				imageHeight: 200,
    				imageAlt: "Custom image"
    			});
    		});
    	};

    	const viewDistributer = async e => {
    		await fetch(`${API_URL}/admin/distributer/read/${e}`, { method: "POST" }).then(response => response.json()).then(datas => {
    			sweetalert2_all.fire({
    				title: "Distributer Details",
    				html: "<div><tr><b>Name : </b><i>" + datas.data.name + "</i></tr></br><tr><b>Phone : </b><i>" + datas.data.phone + "</i></tr></br><tr><b>E mail : </b><i>" + datas.data.email + "</i></tr></br><tr><b>Base Price : </b><i>" + datas.data.basePrice + "</i></tr></br><tr><b>Delivery Price : </b><i>" + datas.data.deliveryPrice + "</i></tr></br><tr><b>Status : </b><i>" + datas.data.active + "</i></tr></br></div>"
    			});
    		});
    	};

    	const viewMarketer = async e => {
    		await fetch(`${API_URL}/admin/marketeer/read/${e}`, { method: "POST" }).then(response => response.json()).then(datas => {
    			sweetalert2_all.fire({
    				title: "Distributer Details",
    				html: "<div><tr><b>Name : </b><i>" + datas.data.name + "</i></tr></br><tr><b>Phone : </b><i>" + datas.data.phone + "</i></tr></br><tr><b>E mail : </b><i>" + datas.data.email + "</i></tr></br><tr><b>Status : </b><i>" + datas.data.active + "</i></tr></br></div>"
    			});
    		});
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Confirmed> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		API_URL,
    		onMount,
    		Swal: sweetalert2_all,
    		orders,
    		inputs,
    		fetchOrders,
    		viewItem,
    		viewDistributer,
    		viewMarketer
    	});

    	$$self.$inject_state = $$props => {
    		if ('orders' in $$props) $$invalidate(0, orders = $$props.orders);
    		if ('inputs' in $$props) inputs = $$props.inputs;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [orders, viewItem, viewDistributer, viewMarketer];
    }

    class Confirmed$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Confirmed",
    			options,
    			id: create_fragment$p.name
    		});
    	}
    }

    /* src/pages/superAdmin/order/tabs/first.svelte generated by Svelte v3.44.1 */
    const file$o = "src/pages/superAdmin/order/tabs/first.svelte";

    function get_each_context$h(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (102:20) {#each orders as item}
    function create_each_block$h(ctx) {
    	let tr;
    	let td0;
    	let button0;
    	let t1;
    	let td1;
    	let button1;
    	let t3;
    	let td2;
    	let button2;
    	let t5;
    	let td3;
    	let a;
    	let t6;
    	let a_href_value;
    	let t7;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			button0 = element("button");
    			button0.textContent = "Product";
    			t1 = space();
    			td1 = element("td");
    			button1 = element("button");
    			button1.textContent = "Marketer";
    			t3 = space();
    			td2 = element("td");
    			button2 = element("button");
    			button2.textContent = "Distributer";
    			t5 = space();
    			td3 = element("td");
    			a = element("a");
    			t6 = text("View");
    			t7 = space();
    			attr_dev(button0, "class", "btn btn-link");
    			add_location(button0, file$o, 103, 28, 3206);
    			add_location(td0, file$o, 103, 24, 3202);
    			attr_dev(button1, "class", "btn btn-link");
    			add_location(button1, file$o, 104, 28, 3323);
    			add_location(td1, file$o, 104, 24, 3319);
    			attr_dev(button2, "class", "btn btn-link");
    			add_location(button2, file$o, 105, 48, 3474);
    			attr_dev(td2, "class", "text-center");
    			add_location(td2, file$o, 105, 24, 3450);
    			attr_dev(a, "class", "col-sm-3 btn btn-link");
    			attr_dev(a, "href", a_href_value = "/admin/orders/" + /*item*/ ctx[6]._id);
    			add_location(a, file$o, 106, 48, 3628);
    			attr_dev(td3, "class", "text-center");
    			add_location(td3, file$o, 106, 24, 3604);
    			add_location(tr, file$o, 102, 24, 3173);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, button0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, button1);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, button2);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, a);
    			append_dev(a, t6);
    			append_dev(tr, t7);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						button0,
    						"click",
    						function () {
    							if (is_function(/*viewItem*/ ctx[1](/*item*/ ctx[6].product_id))) /*viewItem*/ ctx[1](/*item*/ ctx[6].product_id).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button1,
    						"click",
    						function () {
    							if (is_function(/*viewMarketer*/ ctx[3](/*item*/ ctx[6].order_processed_by))) /*viewMarketer*/ ctx[3](/*item*/ ctx[6].order_processed_by).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button2,
    						"click",
    						function () {
    							if (is_function(/*viewDistributer*/ ctx[2](/*item*/ ctx[6].order_placed_by))) /*viewDistributer*/ ctx[2](/*item*/ ctx[6].order_placed_by).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*orders*/ 1 && a_href_value !== (a_href_value = "/admin/orders/" + /*item*/ ctx[6]._id)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$h.name,
    		type: "each",
    		source: "(102:20) {#each orders as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let main;
    	let div3;
    	let div2;
    	let div1;
    	let div0;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let tbody;
    	let each_value = /*orders*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$h(get_each_context$h(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Product";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Marketer";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Ordered By";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Order Details";
    			t7 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$o, 94, 22, 2850);
    			add_location(th1, file$o, 95, 22, 2889);
    			add_location(th2, file$o, 96, 22, 2929);
    			add_location(th3, file$o, 97, 22, 2971);
    			add_location(tr, file$o, 93, 20, 2823);
    			add_location(thead, file$o, 92, 18, 2795);
    			attr_dev(tbody, "class", "m-auto align-item-center");
    			add_location(tbody, file$o, 100, 18, 3065);
    			attr_dev(table, "class", "table table-fill sortable");
    			add_location(table, file$o, 91, 16, 2735);
    			attr_dev(div0, "class", "table-responsive border");
    			add_location(div0, file$o, 90, 14, 2681);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$o, 89, 8, 2649);
    			attr_dev(div2, "class", "row");
    			add_location(div2, file$o, 88, 8, 2623);
    			attr_dev(div3, "class", "container-flex");
    			add_location(div3, file$o, 87, 4, 2586);
    			add_location(main, file$o, 86, 0, 2575);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    			append_dev(tr, t3);
    			append_dev(tr, th2);
    			append_dev(tr, t5);
    			append_dev(tr, th3);
    			append_dev(table, t7);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*orders, viewDistributer, viewMarketer, viewItem*/ 15) {
    				each_value = /*orders*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$h(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$h(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('First', slots, []);
    	let orders = [];
    	let inputs = { skip: "", limit: 200 };

    	onMount(() => {
    		fetchOrders();
    	});

    	const fetchOrders = async () => {
    		await fetch(`${API_URL}/order/read`, {
    			method: "POST",
    			body: JSON.stringify(inputs),
    			headers: { "Content-Type": "application/json" }
    		}).then(response => response.json()).then(datas => {
    			$$invalidate(0, orders = datas.data.filter(item => item.status === 3));
    		});
    	};

    	const viewItem = async e => {
    		await fetch(`${API_URL}/products/list/${e}`, { method: "POST" }).then(response => response.json()).then(datas => {
    			sweetalert2_all.fire({
    				title: datas.data.title,
    				text: datas.data.category + ", " + datas.data.subCategory,
    				imageUrl: datas.data.image,
    				imageWidth: 100,
    				imageHeight: 200,
    				imageAlt: "Custom image"
    			});
    		});
    	};

    	const viewDistributer = async e => {
    		await fetch(`${API_URL}/admin/distributer/read/${e}`, { method: "POST" }).then(response => response.json()).then(datas => {
    			sweetalert2_all.fire({
    				title: "Distributer Details",
    				html: "<div><tr><b>Name : </b><i>" + datas.data.name + "</i></tr></br><tr><b>Phone : </b><i>" + datas.data.phone + "</i></tr></br><tr><b>E mail : </b><i>" + datas.data.email + "</i></tr></br><tr><b>Base Price : </b><i>" + datas.data.basePrice + "</i></tr></br><tr><b>Delivery Price : </b><i>" + datas.data.deliveryPrice + "</i></tr></br><tr><b>Status : </b><i>" + datas.data.active + "</i></tr></br></div>"
    			});
    		});
    	};

    	const viewMarketer = async e => {
    		await fetch(`${API_URL}/admin/marketeer/read/${e}`, { method: "POST" }).then(response => response.json()).then(datas => {
    			sweetalert2_all.fire({
    				title: "Distributer Details",
    				html: "<div><tr><b>Name : </b><i>" + datas.data.name + "</i></tr></br><tr><b>Phone : </b><i>" + datas.data.phone + "</i></tr></br><tr><b>E mail : </b><i>" + datas.data.email + "</i></tr></br><tr><b>Status : </b><i>" + datas.data.active + "</i></tr></br></div>"
    			});
    		});
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<First> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		API_URL,
    		onMount,
    		Swal: sweetalert2_all,
    		orders,
    		inputs,
    		fetchOrders,
    		viewItem,
    		viewDistributer,
    		viewMarketer
    	});

    	$$self.$inject_state = $$props => {
    		if ('orders' in $$props) $$invalidate(0, orders = $$props.orders);
    		if ('inputs' in $$props) inputs = $$props.inputs;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [orders, viewItem, viewDistributer, viewMarketer];
    }

    class First extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "First",
    			options,
    			id: create_fragment$o.name
    		});
    	}
    }

    /* src/pages/superAdmin/order/tabs/print.svelte generated by Svelte v3.44.1 */
    const file$n = "src/pages/superAdmin/order/tabs/print.svelte";

    function get_each_context$g(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (102:20) {#each orders as item}
    function create_each_block$g(ctx) {
    	let tr;
    	let td0;
    	let button0;
    	let t1;
    	let td1;
    	let button1;
    	let t3;
    	let td2;
    	let button2;
    	let t5;
    	let td3;
    	let a;
    	let t6;
    	let a_href_value;
    	let t7;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			button0 = element("button");
    			button0.textContent = "Product";
    			t1 = space();
    			td1 = element("td");
    			button1 = element("button");
    			button1.textContent = "Marketer";
    			t3 = space();
    			td2 = element("td");
    			button2 = element("button");
    			button2.textContent = "Distributer";
    			t5 = space();
    			td3 = element("td");
    			a = element("a");
    			t6 = text("View");
    			t7 = space();
    			attr_dev(button0, "class", "btn btn-link");
    			add_location(button0, file$n, 103, 28, 3206);
    			add_location(td0, file$n, 103, 24, 3202);
    			attr_dev(button1, "class", "btn btn-link");
    			add_location(button1, file$n, 104, 28, 3323);
    			add_location(td1, file$n, 104, 24, 3319);
    			attr_dev(button2, "class", "btn btn-link");
    			add_location(button2, file$n, 105, 48, 3474);
    			attr_dev(td2, "class", "text-center");
    			add_location(td2, file$n, 105, 24, 3450);
    			attr_dev(a, "class", "col-sm-3 btn btn-link");
    			attr_dev(a, "href", a_href_value = "/admin/orders/" + /*item*/ ctx[6]._id);
    			add_location(a, file$n, 106, 48, 3628);
    			attr_dev(td3, "class", "text-center");
    			add_location(td3, file$n, 106, 24, 3604);
    			add_location(tr, file$n, 102, 24, 3173);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, button0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, button1);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, button2);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, a);
    			append_dev(a, t6);
    			append_dev(tr, t7);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						button0,
    						"click",
    						function () {
    							if (is_function(/*viewItem*/ ctx[1](/*item*/ ctx[6].product_id))) /*viewItem*/ ctx[1](/*item*/ ctx[6].product_id).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button1,
    						"click",
    						function () {
    							if (is_function(/*viewMarketer*/ ctx[3](/*item*/ ctx[6].order_processed_by))) /*viewMarketer*/ ctx[3](/*item*/ ctx[6].order_processed_by).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button2,
    						"click",
    						function () {
    							if (is_function(/*viewDistributer*/ ctx[2](/*item*/ ctx[6].order_placed_by))) /*viewDistributer*/ ctx[2](/*item*/ ctx[6].order_placed_by).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*orders*/ 1 && a_href_value !== (a_href_value = "/admin/orders/" + /*item*/ ctx[6]._id)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$g.name,
    		type: "each",
    		source: "(102:20) {#each orders as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
    	let main;
    	let div3;
    	let div2;
    	let div1;
    	let div0;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let tbody;
    	let each_value = /*orders*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$g(get_each_context$g(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Product";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Marketer";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Ordered By";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Order Details";
    			t7 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$n, 94, 22, 2850);
    			add_location(th1, file$n, 95, 22, 2889);
    			add_location(th2, file$n, 96, 22, 2929);
    			add_location(th3, file$n, 97, 22, 2971);
    			add_location(tr, file$n, 93, 20, 2823);
    			add_location(thead, file$n, 92, 18, 2795);
    			attr_dev(tbody, "class", "m-auto align-item-center");
    			add_location(tbody, file$n, 100, 18, 3065);
    			attr_dev(table, "class", "table table-fill sortable");
    			add_location(table, file$n, 91, 16, 2735);
    			attr_dev(div0, "class", "table-responsive border");
    			add_location(div0, file$n, 90, 14, 2681);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$n, 89, 8, 2649);
    			attr_dev(div2, "class", "row");
    			add_location(div2, file$n, 88, 8, 2623);
    			attr_dev(div3, "class", "container-flex");
    			add_location(div3, file$n, 87, 4, 2586);
    			add_location(main, file$n, 86, 0, 2575);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    			append_dev(tr, t3);
    			append_dev(tr, th2);
    			append_dev(tr, t5);
    			append_dev(tr, th3);
    			append_dev(table, t7);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*orders, viewDistributer, viewMarketer, viewItem*/ 15) {
    				each_value = /*orders*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$g(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$g(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Print', slots, []);
    	let orders = [];
    	let inputs = { skip: "", limit: 200 };

    	onMount(() => {
    		fetchOrders();
    	});

    	const fetchOrders = async () => {
    		await fetch(`${API_URL}/order/read`, {
    			method: "POST",
    			body: JSON.stringify(inputs),
    			headers: { "Content-Type": "application/json" }
    		}).then(response => response.json()).then(datas => {
    			$$invalidate(0, orders = datas.data.filter(item => item.status === 4));
    		});
    	};

    	const viewItem = async e => {
    		await fetch(`${API_URL}/products/list/${e}`, { method: "POST" }).then(response => response.json()).then(datas => {
    			sweetalert2_all.fire({
    				title: datas.data.title,
    				text: datas.data.category + ", " + datas.data.subCategory,
    				imageUrl: datas.data.image,
    				imageWidth: 100,
    				imageHeight: 200,
    				imageAlt: "Custom image"
    			});
    		});
    	};

    	const viewDistributer = async e => {
    		await fetch(`${API_URL}/admin/distributer/read/${e}`, { method: "POST" }).then(response => response.json()).then(datas => {
    			sweetalert2_all.fire({
    				title: "Distributer Details",
    				html: "<div><tr><b>Name : </b><i>" + datas.data.name + "</i></tr></br><tr><b>Phone : </b><i>" + datas.data.phone + "</i></tr></br><tr><b>E mail : </b><i>" + datas.data.email + "</i></tr></br><tr><b>Base Price : </b><i>" + datas.data.basePrice + "</i></tr></br><tr><b>Delivery Price : </b><i>" + datas.data.deliveryPrice + "</i></tr></br><tr><b>Status : </b><i>" + datas.data.active + "</i></tr></br></div>"
    			});
    		});
    	};

    	const viewMarketer = async e => {
    		await fetch(`${API_URL}/admin/marketeer/read/${e}`, { method: "POST" }).then(response => response.json()).then(datas => {
    			sweetalert2_all.fire({
    				title: "Distributer Details",
    				html: "<div><tr><b>Name : </b><i>" + datas.data.name + "</i></tr></br><tr><b>Phone : </b><i>" + datas.data.phone + "</i></tr></br><tr><b>E mail : </b><i>" + datas.data.email + "</i></tr></br><tr><b>Status : </b><i>" + datas.data.active + "</i></tr></br></div>"
    			});
    		});
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Print> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		API_URL,
    		onMount,
    		Swal: sweetalert2_all,
    		orders,
    		inputs,
    		fetchOrders,
    		viewItem,
    		viewDistributer,
    		viewMarketer
    	});

    	$$self.$inject_state = $$props => {
    		if ('orders' in $$props) $$invalidate(0, orders = $$props.orders);
    		if ('inputs' in $$props) inputs = $$props.inputs;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [orders, viewItem, viewDistributer, viewMarketer];
    }

    class Print$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Print",
    			options,
    			id: create_fragment$n.name
    		});
    	}
    }

    /* src/pages/superAdmin/order/tabs/second.svelte generated by Svelte v3.44.1 */
    const file$m = "src/pages/superAdmin/order/tabs/second.svelte";

    function get_each_context$f(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (102:20) {#each orders as item}
    function create_each_block$f(ctx) {
    	let tr;
    	let td0;
    	let button0;
    	let t1;
    	let td1;
    	let button1;
    	let t3;
    	let td2;
    	let button2;
    	let t5;
    	let td3;
    	let a;
    	let t6;
    	let a_href_value;
    	let t7;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			button0 = element("button");
    			button0.textContent = "Product";
    			t1 = space();
    			td1 = element("td");
    			button1 = element("button");
    			button1.textContent = "Marketer";
    			t3 = space();
    			td2 = element("td");
    			button2 = element("button");
    			button2.textContent = "Distributer";
    			t5 = space();
    			td3 = element("td");
    			a = element("a");
    			t6 = text("View");
    			t7 = space();
    			attr_dev(button0, "class", "btn btn-link");
    			add_location(button0, file$m, 103, 28, 3206);
    			add_location(td0, file$m, 103, 24, 3202);
    			attr_dev(button1, "class", "btn btn-link");
    			add_location(button1, file$m, 104, 28, 3323);
    			add_location(td1, file$m, 104, 24, 3319);
    			attr_dev(button2, "class", "btn btn-link");
    			add_location(button2, file$m, 105, 48, 3474);
    			attr_dev(td2, "class", "text-center");
    			add_location(td2, file$m, 105, 24, 3450);
    			attr_dev(a, "class", "col-sm-3 btn btn-link");
    			attr_dev(a, "href", a_href_value = "/admin/orders/" + /*item*/ ctx[6]._id);
    			add_location(a, file$m, 106, 48, 3628);
    			attr_dev(td3, "class", "text-center");
    			add_location(td3, file$m, 106, 24, 3604);
    			add_location(tr, file$m, 102, 24, 3173);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, button0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, button1);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, button2);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, a);
    			append_dev(a, t6);
    			append_dev(tr, t7);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						button0,
    						"click",
    						function () {
    							if (is_function(/*viewItem*/ ctx[1](/*item*/ ctx[6].product_id))) /*viewItem*/ ctx[1](/*item*/ ctx[6].product_id).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button1,
    						"click",
    						function () {
    							if (is_function(/*viewMarketer*/ ctx[3](/*item*/ ctx[6].order_processed_by))) /*viewMarketer*/ ctx[3](/*item*/ ctx[6].order_processed_by).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button2,
    						"click",
    						function () {
    							if (is_function(/*viewDistributer*/ ctx[2](/*item*/ ctx[6].order_placed_by))) /*viewDistributer*/ ctx[2](/*item*/ ctx[6].order_placed_by).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*orders*/ 1 && a_href_value !== (a_href_value = "/admin/orders/" + /*item*/ ctx[6]._id)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$f.name,
    		type: "each",
    		source: "(102:20) {#each orders as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let main;
    	let div3;
    	let div2;
    	let div1;
    	let div0;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let tbody;
    	let each_value = /*orders*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$f(get_each_context$f(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Product";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Marketer";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Ordered By";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Order Details";
    			t7 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$m, 94, 22, 2850);
    			add_location(th1, file$m, 95, 22, 2889);
    			add_location(th2, file$m, 96, 22, 2929);
    			add_location(th3, file$m, 97, 22, 2971);
    			add_location(tr, file$m, 93, 20, 2823);
    			add_location(thead, file$m, 92, 18, 2795);
    			attr_dev(tbody, "class", "m-auto align-item-center");
    			add_location(tbody, file$m, 100, 18, 3065);
    			attr_dev(table, "class", "table table-fill sortable");
    			add_location(table, file$m, 91, 16, 2735);
    			attr_dev(div0, "class", "table-responsive border");
    			add_location(div0, file$m, 90, 14, 2681);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$m, 89, 8, 2649);
    			attr_dev(div2, "class", "row");
    			add_location(div2, file$m, 88, 8, 2623);
    			attr_dev(div3, "class", "container-flex");
    			add_location(div3, file$m, 87, 4, 2586);
    			add_location(main, file$m, 86, 0, 2575);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    			append_dev(tr, t3);
    			append_dev(tr, th2);
    			append_dev(tr, t5);
    			append_dev(tr, th3);
    			append_dev(table, t7);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*orders, viewDistributer, viewMarketer, viewItem*/ 15) {
    				each_value = /*orders*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$f(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$f(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Second', slots, []);
    	let orders = [];
    	let inputs = { skip: "", limit: 200 };

    	onMount(() => {
    		fetchOrders();
    	});

    	const fetchOrders = async () => {
    		await fetch(`${API_URL}/order/read`, {
    			method: "POST",
    			body: JSON.stringify(inputs),
    			headers: { "Content-Type": "application/json" }
    		}).then(response => response.json()).then(datas => {
    			$$invalidate(0, orders = datas.data.filter(item => item.status === 5));
    		});
    	};

    	const viewItem = async e => {
    		await fetch(`${API_URL}/products/list/${e}`, { method: "POST" }).then(response => response.json()).then(datas => {
    			sweetalert2_all.fire({
    				title: datas.data.title,
    				text: datas.data.category + ", " + datas.data.subCategory,
    				imageUrl: datas.data.image,
    				imageWidth: 100,
    				imageHeight: 200,
    				imageAlt: "Custom image"
    			});
    		});
    	};

    	const viewDistributer = async e => {
    		await fetch(`${API_URL}/admin/distributer/read/${e}`, { method: "POST" }).then(response => response.json()).then(datas => {
    			sweetalert2_all.fire({
    				title: "Distributer Details",
    				html: "<div><tr><b>Name : </b><i>" + datas.data.name + "</i></tr></br><tr><b>Phone : </b><i>" + datas.data.phone + "</i></tr></br><tr><b>E mail : </b><i>" + datas.data.email + "</i></tr></br><tr><b>Base Price : </b><i>" + datas.data.basePrice + "</i></tr></br><tr><b>Delivery Price : </b><i>" + datas.data.deliveryPrice + "</i></tr></br><tr><b>Status : </b><i>" + datas.data.active + "</i></tr></br></div>"
    			});
    		});
    	};

    	const viewMarketer = async e => {
    		await fetch(`${API_URL}/admin/marketeer/read/${e}`, { method: "POST" }).then(response => response.json()).then(datas => {
    			sweetalert2_all.fire({
    				title: "Distributer Details",
    				html: "<div><tr><b>Name : </b><i>" + datas.data.name + "</i></tr></br><tr><b>Phone : </b><i>" + datas.data.phone + "</i></tr></br><tr><b>E mail : </b><i>" + datas.data.email + "</i></tr></br><tr><b>Status : </b><i>" + datas.data.active + "</i></tr></br></div>"
    			});
    		});
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Second> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		API_URL,
    		onMount,
    		Swal: sweetalert2_all,
    		orders,
    		inputs,
    		fetchOrders,
    		viewItem,
    		viewDistributer,
    		viewMarketer
    	});

    	$$self.$inject_state = $$props => {
    		if ('orders' in $$props) $$invalidate(0, orders = $$props.orders);
    		if ('inputs' in $$props) inputs = $$props.inputs;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [orders, viewItem, viewDistributer, viewMarketer];
    }

    class Second$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Second",
    			options,
    			id: create_fragment$m.name
    		});
    	}
    }

    /* src/pages/superAdmin/order/orderLander.svelte generated by Svelte v3.44.1 */
    const file$l = "src/pages/superAdmin/order/orderLander.svelte";

    function create_fragment$l(ctx) {
    	let main;
    	let div6;
    	let ul;
    	let li0;
    	let a0;
    	let t1;
    	let li1;
    	let a1;
    	let t3;
    	let li2;
    	let a2;
    	let t5;
    	let li3;
    	let a3;
    	let t7;
    	let li4;
    	let a4;
    	let t9;
    	let div5;
    	let div0;
    	let assigned;
    	let t10;
    	let div1;
    	let confirm;
    	let t11;
    	let div2;
    	let first;
    	let t12;
    	let div3;
    	let print;
    	let t13;
    	let div4;
    	let second;
    	let current;
    	assigned = new Assigned({ $$inline: true });
    	confirm = new Confirmed$1({ $$inline: true });
    	first = new First({ $$inline: true });
    	print = new Print$1({ $$inline: true });
    	second = new Second$1({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			div6 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "Assigned";
    			t1 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "Confirmed";
    			t3 = space();
    			li2 = element("li");
    			a2 = element("a");
    			a2.textContent = "First Pay";
    			t5 = space();
    			li3 = element("li");
    			a3 = element("a");
    			a3.textContent = "Print";
    			t7 = space();
    			li4 = element("li");
    			a4 = element("a");
    			a4.textContent = "Second Pay";
    			t9 = space();
    			div5 = element("div");
    			div0 = element("div");
    			create_component(assigned.$$.fragment);
    			t10 = space();
    			div1 = element("div");
    			create_component(confirm.$$.fragment);
    			t11 = space();
    			div2 = element("div");
    			create_component(first.$$.fragment);
    			t12 = space();
    			div3 = element("div");
    			create_component(print.$$.fragment);
    			t13 = space();
    			div4 = element("div");
    			create_component(second.$$.fragment);
    			attr_dev(a0, "data-toggle", "tab");
    			attr_dev(a0, "href", "#assigned");
    			attr_dev(a0, "role", "tab");
    			attr_dev(a0, "class", "nav-link active");
    			add_location(a0, file$l, 12, 12, 412);
    			attr_dev(li0, "class", "nav-item flex-sm-fill");
    			add_location(li0, file$l, 11, 10, 365);
    			attr_dev(a1, "data-toggle", "tab");
    			attr_dev(a1, "href", "#confirm");
    			attr_dev(a1, "role", "tab");
    			attr_dev(a1, "class", "nav-link");
    			add_location(a1, file$l, 15, 12, 571);
    			attr_dev(li1, "class", "nav-item flex-sm-fill");
    			add_location(li1, file$l, 14, 10, 524);
    			attr_dev(a2, "data-toggle", "tab");
    			attr_dev(a2, "href", "#first");
    			attr_dev(a2, "role", "tab");
    			attr_dev(a2, "class", "nav-link");
    			add_location(a2, file$l, 18, 12, 723);
    			attr_dev(li2, "class", "nav-item flex-sm-fill");
    			add_location(li2, file$l, 17, 10, 676);
    			attr_dev(a3, "data-toggle", "tab");
    			attr_dev(a3, "href", "#print");
    			attr_dev(a3, "role", "tab");
    			attr_dev(a3, "class", "nav-link");
    			add_location(a3, file$l, 21, 12, 873);
    			attr_dev(li3, "class", "nav-item flex-sm-fill");
    			add_location(li3, file$l, 20, 10, 826);
    			attr_dev(a4, "data-toggle", "tab");
    			attr_dev(a4, "href", "#second");
    			attr_dev(a4, "role", "tab");
    			attr_dev(a4, "class", "nav-link");
    			add_location(a4, file$l, 24, 12, 1019);
    			attr_dev(li4, "class", "nav-item flex-sm-fill");
    			add_location(li4, file$l, 23, 10, 972);
    			attr_dev(ul, "role", "tablist");
    			attr_dev(ul, "class", "nav nav-tabs mt-3 mb-3");
    			add_location(ul, file$l, 10, 8, 304);
    			attr_dev(div0, "id", "assigned");
    			attr_dev(div0, "role", "tabpanel");
    			attr_dev(div0, "class", "tab-pane fade show active");
    			add_location(div0, file$l, 28, 10, 1190);
    			attr_dev(div1, "id", "confirm");
    			attr_dev(div1, "role", "tabpanel");
    			attr_dev(div1, "class", "tab-pane fade ");
    			add_location(div1, file$l, 31, 10, 1311);
    			attr_dev(div2, "id", "first");
    			attr_dev(div2, "role", "tabpanel");
    			attr_dev(div2, "class", "tab-pane fade");
    			add_location(div2, file$l, 34, 10, 1419);
    			attr_dev(div3, "id", "print");
    			attr_dev(div3, "role", "tabpanel");
    			attr_dev(div3, "class", "tab-pane fade");
    			add_location(div3, file$l, 37, 10, 1522);
    			attr_dev(div4, "id", "second");
    			attr_dev(div4, "role", "tabpanel");
    			attr_dev(div4, "class", "tab-pane fade");
    			add_location(div4, file$l, 40, 10, 1625);
    			attr_dev(div5, "id", "myTabContent");
    			attr_dev(div5, "class", "tab-content");
    			add_location(div5, file$l, 27, 8, 1136);
    			attr_dev(div6, "class", "container-fluid");
    			add_location(div6, file$l, 9, 4, 266);
    			add_location(main, file$l, 8, 0, 255);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div6);
    			append_dev(div6, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(ul, t3);
    			append_dev(ul, li2);
    			append_dev(li2, a2);
    			append_dev(ul, t5);
    			append_dev(ul, li3);
    			append_dev(li3, a3);
    			append_dev(ul, t7);
    			append_dev(ul, li4);
    			append_dev(li4, a4);
    			append_dev(div6, t9);
    			append_dev(div6, div5);
    			append_dev(div5, div0);
    			mount_component(assigned, div0, null);
    			append_dev(div5, t10);
    			append_dev(div5, div1);
    			mount_component(confirm, div1, null);
    			append_dev(div5, t11);
    			append_dev(div5, div2);
    			mount_component(first, div2, null);
    			append_dev(div5, t12);
    			append_dev(div5, div3);
    			mount_component(print, div3, null);
    			append_dev(div5, t13);
    			append_dev(div5, div4);
    			mount_component(second, div4, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(assigned.$$.fragment, local);
    			transition_in(confirm.$$.fragment, local);
    			transition_in(first.$$.fragment, local);
    			transition_in(print.$$.fragment, local);
    			transition_in(second.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(assigned.$$.fragment, local);
    			transition_out(confirm.$$.fragment, local);
    			transition_out(first.$$.fragment, local);
    			transition_out(print.$$.fragment, local);
    			transition_out(second.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(assigned);
    			destroy_component(confirm);
    			destroy_component(first);
    			destroy_component(print);
    			destroy_component(second);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('OrderLander', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<OrderLander> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Assigned, Confirm: Confirmed$1, First, Print: Print$1, Second: Second$1 });
    	return [];
    }

    class OrderLander extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OrderLander",
    			options,
    			id: create_fragment$l.name
    		});
    	}
    }

    /* src/pages/superAdmin/order/newOrders.svelte generated by Svelte v3.44.1 */
    const file$k = "src/pages/superAdmin/order/newOrders.svelte";

    function get_each_context$e(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    // (180:22) {#each marketers as item}
    function create_each_block_1$1(ctx) {
    	let option;
    	let t_value = /*item*/ ctx[11].name + "";
    	let t;
    	let option_key_value;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			attr_dev(option, "key", option_key_value = /*item*/ ctx[11]._id);
    			option.__value = option_value_value = /*item*/ ctx[11]._id;
    			option.value = option.__value;
    			add_location(option, file$k, 180, 24, 5653);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*marketers*/ 2 && t_value !== (t_value = /*item*/ ctx[11].name + "")) set_data_dev(t, t_value);

    			if (dirty & /*marketers*/ 2 && option_key_value !== (option_key_value = /*item*/ ctx[11]._id)) {
    				attr_dev(option, "key", option_key_value);
    			}

    			if (dirty & /*marketers*/ 2 && option_value_value !== (option_value_value = /*item*/ ctx[11]._id)) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(180:22) {#each marketers as item}",
    		ctx
    	});

    	return block;
    }

    // (156:14) {#each orders as item}
    function create_each_block$e(ctx) {
    	let tr;
    	let td0;
    	let button0;
    	let t1;
    	let td1;
    	let button1;
    	let t3;
    	let td2;
    	let button2;
    	let t5;
    	let td3;
    	let h60;
    	let t6_value = /*item*/ ctx[11].category + "";
    	let t6;
    	let t7;
    	let t8_value = /*item*/ ctx[11].subCategory + "";
    	let t8;
    	let t9;
    	let td4;
    	let h61;
    	let t10_value = /*item*/ ctx[11].shipping_address + "";
    	let t10;
    	let t11;
    	let td5;
    	let select;
    	let option;
    	let t13;
    	let td6;
    	let button3;
    	let t15;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*marketers*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			button0 = element("button");
    			button0.textContent = "Product";
    			t1 = space();
    			td1 = element("td");
    			button1 = element("button");
    			button1.textContent = "Distributer";
    			t3 = space();
    			td2 = element("td");
    			button2 = element("button");
    			button2.textContent = "View";
    			t5 = space();
    			td3 = element("td");
    			h60 = element("h6");
    			t6 = text(t6_value);
    			t7 = text(", ");
    			t8 = text(t8_value);
    			t9 = space();
    			td4 = element("td");
    			h61 = element("h6");
    			t10 = text(t10_value);
    			t11 = space();
    			td5 = element("td");
    			select = element("select");
    			option = element("option");
    			option.textContent = "Select.. ";

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t13 = space();
    			td6 = element("td");
    			button3 = element("button");
    			button3.textContent = "Assign";
    			t15 = space();
    			attr_dev(button0, "class", "btn btn-link");
    			add_location(button0, file$k, 158, 20, 4495);
    			attr_dev(td0, "class", "svelte-gd7bqt");
    			add_location(td0, file$k, 157, 18, 4470);
    			attr_dev(button1, "class", "btn btn-link");
    			add_location(button1, file$k, 165, 20, 4866);
    			attr_dev(td1, "class", "text-center svelte-gd7bqt");
    			add_location(td1, file$k, 164, 18, 4821);
    			attr_dev(button2, "class", "btn btn-link");
    			add_location(button2, file$k, 169, 20, 5055);
    			attr_dev(td2, "class", "text-center svelte-gd7bqt");
    			add_location(td2, file$k, 168, 18, 5010);
    			add_location(h60, file$k, 172, 43, 5210);
    			attr_dev(td3, "class", "text-center svelte-gd7bqt");
    			add_location(td3, file$k, 172, 18, 5185);
    			add_location(h61, file$k, 173, 43, 5304);
    			attr_dev(td4, "class", "text-center svelte-gd7bqt");
    			add_location(td4, file$k, 173, 18, 5279);
    			option.__value = "";
    			option.value = option.__value;
    			option.selected = true;
    			add_location(option, file$k, 178, 22, 5536);
    			attr_dev(select, "class", "form-select svelte-gd7bqt");
    			add_location(select, file$k, 175, 20, 5386);
    			attr_dev(td5, "class", "svelte-gd7bqt");
    			add_location(td5, file$k, 174, 18, 5361);
    			attr_dev(button3, "class", "btn btn-outline-primary");
    			add_location(button3, file$k, 185, 20, 5880);
    			attr_dev(td6, "class", "text-center d-block d-inline svelte-gd7bqt");
    			add_location(td6, file$k, 184, 18, 5818);
    			add_location(tr, file$k, 156, 16, 4447);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, button0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, button1);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, button2);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, h60);
    			append_dev(h60, t6);
    			append_dev(h60, t7);
    			append_dev(h60, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td4);
    			append_dev(td4, h61);
    			append_dev(h61, t10);
    			append_dev(tr, t11);
    			append_dev(tr, td5);
    			append_dev(td5, select);
    			append_dev(select, option);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			append_dev(tr, t13);
    			append_dev(tr, td6);
    			append_dev(td6, button3);
    			append_dev(tr, t15);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						button0,
    						"click",
    						function () {
    							if (is_function(/*viewItem*/ ctx[3](/*item*/ ctx[11].product_id))) /*viewItem*/ ctx[3](/*item*/ ctx[11].product_id).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button1,
    						"click",
    						function () {
    							if (is_function(/*viewDistributer*/ ctx[5](/*item*/ ctx[11].order_placed_by))) /*viewDistributer*/ ctx[5](/*item*/ ctx[11].order_placed_by).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button2,
    						"click",
    						function () {
    							if (is_function(/*viewDetails*/ ctx[4](/*item*/ ctx[11].order_details))) /*viewDetails*/ ctx[4](/*item*/ ctx[11].order_details).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(select, "change", /*change_handler*/ ctx[7], false, false, false),
    					listen_dev(
    						button3,
    						"click",
    						function () {
    							if (is_function(/*assignOrder*/ ctx[6](/*item*/ ctx[11]._id))) /*assignOrder*/ ctx[6](/*item*/ ctx[11]._id).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*orders*/ 4 && t6_value !== (t6_value = /*item*/ ctx[11].category + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*orders*/ 4 && t8_value !== (t8_value = /*item*/ ctx[11].subCategory + "")) set_data_dev(t8, t8_value);
    			if (dirty & /*orders*/ 4 && t10_value !== (t10_value = /*item*/ ctx[11].shipping_address + "")) set_data_dev(t10, t10_value);

    			if (dirty & /*marketers*/ 2) {
    				each_value_1 = /*marketers*/ ctx[1];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$e.name,
    		type: "each",
    		source: "(156:14) {#each orders as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let main;
    	let div3;
    	let h4;
    	let t1;
    	let div2;
    	let div1;
    	let div0;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t3;
    	let th1;
    	let t5;
    	let th2;
    	let t7;
    	let th3;
    	let t9;
    	let th4;
    	let t11;
    	let th5;
    	let t13;
    	let th6;
    	let t15;
    	let tbody;
    	let each_value = /*orders*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$e(get_each_context$e(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			div3 = element("div");
    			h4 = element("h4");
    			h4.textContent = "New Order Request";
    			t1 = space();
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Product";
    			t3 = space();
    			th1 = element("th");
    			th1.textContent = "Ordered";
    			t5 = space();
    			th2 = element("th");
    			th2.textContent = "Details";
    			t7 = space();
    			th3 = element("th");
    			th3.textContent = "Category";
    			t9 = space();
    			th4 = element("th");
    			th4.textContent = "Address";
    			t11 = space();
    			th5 = element("th");
    			th5.textContent = "Marketer";
    			t13 = space();
    			th6 = element("th");
    			th6.textContent = "Action";
    			t15 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h4, "class", "text-secondary text-center p-2 m-2 border-bottom");
    			add_location(h4, file$k, 136, 4, 3802);
    			add_location(th0, file$k, 145, 16, 4098);
    			add_location(th1, file$k, 146, 16, 4131);
    			add_location(th2, file$k, 147, 16, 4164);
    			add_location(th3, file$k, 148, 16, 4197);
    			add_location(th4, file$k, 149, 16, 4231);
    			add_location(th5, file$k, 150, 16, 4264);
    			add_location(th6, file$k, 151, 16, 4298);
    			add_location(tr, file$k, 144, 14, 4077);
    			add_location(thead, file$k, 143, 12, 4055);
    			attr_dev(tbody, "class", "table-body svelte-gd7bqt");
    			add_location(tbody, file$k, 154, 12, 4367);
    			attr_dev(table, "class", "table table-fill");
    			add_location(table, file$k, 142, 10, 4010);
    			attr_dev(div0, "class", "table-responsive border");
    			add_location(div0, file$k, 141, 8, 3962);
    			attr_dev(div1, "class", "col container");
    			add_location(div1, file$k, 140, 6, 3926);
    			attr_dev(div2, "class", "row");
    			add_location(div2, file$k, 139, 4, 3902);
    			attr_dev(div3, "class", "container-fluid border p-2");
    			add_location(div3, file$k, 135, 2, 3757);
    			add_location(main, file$k, 134, 0, 3748);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div3);
    			append_dev(div3, h4);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t3);
    			append_dev(tr, th1);
    			append_dev(tr, t5);
    			append_dev(tr, th2);
    			append_dev(tr, t7);
    			append_dev(tr, th3);
    			append_dev(tr, t9);
    			append_dev(tr, th4);
    			append_dev(tr, t11);
    			append_dev(tr, th5);
    			append_dev(tr, t13);
    			append_dev(tr, th6);
    			append_dev(table, t15);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*assignOrder, orders, MarketerId, marketers, viewDetails, viewDistributer, viewItem*/ 127) {
    				each_value = /*orders*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$e(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$e(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NewOrders', slots, []);
    	let MarketerId = "";
    	let inputs = { skip: "", limit: 200 };
    	let marketers = [];
    	let orders = [];

    	onMount(async () => {
    		fetchMarketer();
    		fetchOrders();
    	});

    	const fetchMarketer = async () => {
    		await fetch(`${API_URL}/admin/marketeer/read`, {
    			method: "POST",
    			body: JSON.stringify(inputs),
    			headers: { "Content-Type": "application/json" }
    		}).then(response => response.json()).then(datas => {
    			$$invalidate(1, marketers = datas.data.marketeers);
    		});
    	};

    	const fetchOrders = async () => {
    		await fetch(`${API_URL}/order/read`, {
    			method: "POST",
    			body: JSON.stringify(inputs),
    			headers: { "Content-Type": "application/json" }
    		}).then(response => response.json()).then(datas => {
    			$$invalidate(2, orders = datas.data.filter(item => item.status === 0));
    		});
    	};

    	const viewItem = async e => {
    		await fetch(`${API_URL}/products/list/${e}`, { method: "POST" }).then(response => response.json()).then(datas => {
    			sweetalert2_all.fire({
    				title: datas.data.title,
    				text: datas.data.category + ", " + datas.data.subCategory,
    				imageUrl: datas.data.image,
    				imageWidth: 100,
    				imageHeight: 200,
    				imageAlt: "Custom image"
    			});
    		});
    	};

    	const viewDetails = e => {
    		sweetalert2_all.fire({
    			title: "Order Details",
    			html: "<div><tr><b>Width : </b><i>" + e.width + "</i></tr></br><tr><b>Height : </b><i>" + e.height + "</i></tr></br><tr><b>ArcTop : </b><i>" + e.arcTop + "</i></tr></br><tr><b>ArcBottom : </b><i>" + e.arcBottom + "</i></tr></br><tr><b>Sandwich : </b><i>" + e.sandwich + "</i></tr></br><tr><b>Varnish : </b><i>" + e.varnish + "</i></tr></br><tr><b>WhiteCoat : </b><i>" + e.whiteCoat + "</i></tr></br><tr><b>Message : </b><i>" + e.message + "</i></tr></div>"
    		});
    	};

    	const viewDistributer = async e => {
    		await fetch(`${API_URL}/admin/distributer/read/${e}`, { method: "POST" }).then(response => response.json()).then(datas => {
    			sweetalert2_all.fire({
    				title: "Distributer Details",
    				html: "<div><tr><b>Name : </b><i>" + datas.data.name + "</i></tr></br><tr><b>Phone : </b><i>" + datas.data.phone + "</i></tr></br><tr><b>E mail : </b><i>" + datas.data.email + "</i></tr></br><tr><b>Base Price : </b><i>" + datas.data.basePrice + "</i></tr></br><tr><b>Delivery Price : </b><i>" + datas.data.deliveryPrice + "</i></tr></br><tr><b>Status : </b><i>" + datas.data.active + "</i></tr></br></div>"
    			});
    		});
    	};

    	const assignOrder = async e => {
    		let bodyData = { order_id: e, marketeer_id: MarketerId };

    		if (MarketerId !== "") {
    			const res = await fetch(`${API_URL}/admin/marketeer/assign`, {
    				method: "post",
    				body: JSON.stringify(bodyData),
    				headers: { "Content-Type": "application/json" }
    			});

    			const json = await res.json();

    			if (json.status === true) {
    				sweetalert2_all.fire({
    					position: "top-end",
    					icon: "success",
    					title: "Order Assigned",
    					showConfirmButton: false,
    					timer: 500
    				});
    			}

    			fetchOrders();
    			$$invalidate(0, MarketerId = "");
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NewOrders> was created with unknown prop '${key}'`);
    	});

    	const change_handler = e => {
    		$$invalidate(0, MarketerId = e.target.value);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		Swal: sweetalert2_all,
    		API_URL,
    		MarketerId,
    		inputs,
    		marketers,
    		orders,
    		fetchMarketer,
    		fetchOrders,
    		viewItem,
    		viewDetails,
    		viewDistributer,
    		assignOrder
    	});

    	$$self.$inject_state = $$props => {
    		if ('MarketerId' in $$props) $$invalidate(0, MarketerId = $$props.MarketerId);
    		if ('inputs' in $$props) inputs = $$props.inputs;
    		if ('marketers' in $$props) $$invalidate(1, marketers = $$props.marketers);
    		if ('orders' in $$props) $$invalidate(2, orders = $$props.orders);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		MarketerId,
    		marketers,
    		orders,
    		viewItem,
    		viewDetails,
    		viewDistributer,
    		assignOrder,
    		change_handler
    	];
    }

    class NewOrders extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NewOrders",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    /* src/pages/superAdmin/product/search.svelte generated by Svelte v3.44.1 */
    const file$j = "src/pages/superAdmin/product/search.svelte";

    function get_each_context$d(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    // (92:16) {#if products !== ""}
    function create_if_block_1$5(ctx) {
    	let div;
    	let each_value = /*products*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$d(get_each_context$d(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "row justify-content-center");
    			add_location(div, file$j, 92, 20, 3481);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*products, API_URL*/ 1) {
    				each_value = /*products*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$d(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$d(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(92:16) {#if products !== \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    // (94:24) {#each products as datas}
    function create_each_block$d(ctx) {
    	let div3;
    	let a;
    	let div2;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let h5;
    	let t1;
    	let t2_value = /*datas*/ ctx[10].title + "";
    	let t2;
    	let t3;
    	let p0;
    	let t4;
    	let b0;
    	let t5_value = /*datas*/ ctx[10].category + "";
    	let t5;
    	let t6;
    	let p1;
    	let t7;
    	let b1;
    	let t8_value = /*datas*/ ctx[10].subCategory + "";
    	let t8;
    	let a_href_value;
    	let t9;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			a = element("a");
    			div2 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			h5 = element("h5");
    			t1 = text("Product: ");
    			t2 = text(t2_value);
    			t3 = space();
    			p0 = element("p");
    			t4 = text("Category: ");
    			b0 = element("b");
    			t5 = text(t5_value);
    			t6 = space();
    			p1 = element("p");
    			t7 = text("Sub-Category: ");
    			b1 = element("b");
    			t8 = text(t8_value);
    			t9 = space();
    			if (!src_url_equal(img.src, img_src_value = `${API_URL}/products/images/${/*datas*/ ctx[10].image}`)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "images");
    			attr_dev(img, "class", "svelte-1jas1w7");
    			add_location(img, file$j, 98, 36, 3843);
    			attr_dev(div0, "class", "col ");
    			add_location(div0, file$j, 97, 32, 3788);
    			attr_dev(h5, "class", "m-2 ");
    			add_location(h5, file$j, 101, 36, 4038);
    			add_location(b0, file$j, 102, 62, 4145);
    			attr_dev(p0, "class", "m-2 ");
    			add_location(p0, file$j, 102, 36, 4119);
    			add_location(b1, file$j, 103, 66, 4239);
    			attr_dev(p1, "class", "m-2 ");
    			add_location(p1, file$j, 103, 36, 4209);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$j, 100, 32, 3984);
    			attr_dev(div2, "class", "row p-2");
    			add_location(div2, file$j, 96, 28, 3734);
    			attr_dev(a, "href", a_href_value = "/admin/produt_view/" + /*datas*/ ctx[10]._id);
    			attr_dev(a, "class", "svelte-1jas1w7");
    			add_location(a, file$j, 95, 28, 3664);
    			attr_dev(div3, "class", "card rounded-lg col-sm-10 svelte-1jas1w7");
    			add_location(div3, file$j, 94, 24, 3596);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, a);
    			append_dev(a, div2);
    			append_dev(div2, div0);
    			append_dev(div0, img);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, h5);
    			append_dev(h5, t1);
    			append_dev(h5, t2);
    			append_dev(div1, t3);
    			append_dev(div1, p0);
    			append_dev(p0, t4);
    			append_dev(p0, b0);
    			append_dev(b0, t5);
    			append_dev(div1, t6);
    			append_dev(div1, p1);
    			append_dev(p1, t7);
    			append_dev(p1, b1);
    			append_dev(b1, t8);
    			append_dev(div3, t9);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*products*/ 1 && !src_url_equal(img.src, img_src_value = `${API_URL}/products/images/${/*datas*/ ctx[10].image}`)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*products*/ 1 && t2_value !== (t2_value = /*datas*/ ctx[10].title + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*products*/ 1 && t5_value !== (t5_value = /*datas*/ ctx[10].category + "")) set_data_dev(t5, t5_value);
    			if (dirty & /*products*/ 1 && t8_value !== (t8_value = /*datas*/ ctx[10].subCategory + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*products*/ 1 && a_href_value !== (a_href_value = "/admin/produt_view/" + /*datas*/ ctx[10]._id)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$d.name,
    		type: "each",
    		source: "(94:24) {#each products as datas}",
    		ctx
    	});

    	return block;
    }

    // (112:16) {#if products == ""}
    function create_if_block$7(ctx) {
    	let div;
    	let h5;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h5 = element("h5");
    			h5.textContent = "No Products..";
    			attr_dev(h5, "class", "text-secondary p-4 m-4 ");
    			add_location(h5, file$j, 113, 24, 4613);
    			attr_dev(div, "class", "row justify-content-center");
    			add_location(div, file$j, 112, 20, 4548);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h5);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(112:16) {#if products == \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let main;
    	let div5;
    	let h4;
    	let t1;
    	let div4;
    	let div2;
    	let div0;
    	let input;
    	let t2;
    	let div1;
    	let button;
    	let t4;
    	let div3;
    	let p;
    	let b;
    	let t5_value = /*message*/ ctx[2].msg + "";
    	let t5;
    	let p_class_value;
    	let t6;
    	let t7;
    	let mounted;
    	let dispose;
    	let if_block0 = /*products*/ ctx[0] !== "" && create_if_block_1$5(ctx);
    	let if_block1 = /*products*/ ctx[0] == "" && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div5 = element("div");
    			h4 = element("h4");
    			h4.textContent = "Product Search";
    			t1 = space();
    			div4 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			input = element("input");
    			t2 = space();
    			div1 = element("div");
    			button = element("button");
    			button.textContent = "Search";
    			t4 = space();
    			div3 = element("div");
    			p = element("p");
    			b = element("b");
    			t5 = text(t5_value);
    			t6 = space();
    			if (if_block0) if_block0.c();
    			t7 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(h4, "class", "heading text-center p-2  svelte-1jas1w7");
    			add_location(h4, file$j, 57, 12, 1580);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "form-control form-input svelte-1jas1w7");
    			attr_dev(input, "placeholder", "Product Name");
    			attr_dev(input, "id", "searchIn");
    			add_location(input, file$j, 61, 24, 1782);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file$j, 60, 20, 1740);
    			attr_dev(button, "class", "btn btn-create svelte-1jas1w7");
    			add_location(button, file$j, 64, 24, 1996);
    			attr_dev(div1, "class", "col-sm-3");
    			add_location(div1, file$j, 63, 20, 1949);
    			attr_dev(div2, "class", "row m-auto pt-2");
    			add_location(div2, file$j, 59, 16, 1690);
    			add_location(b, file$j, 89, 47, 3375);
    			attr_dev(p, "class", p_class_value = "" + (null_to_empty(/*message*/ ctx[2].style) + " svelte-1jas1w7"));
    			add_location(p, file$j, 89, 20, 3348);
    			attr_dev(div3, "class", "container row m-auto justify-content-center");
    			add_location(div3, file$j, 88, 16, 3270);
    			attr_dev(div4, "class", "border-top");
    			add_location(div4, file$j, 58, 12, 1649);
    			attr_dev(div5, "class", "container border");
    			add_location(div5, file$j, 56, 8, 1537);
    			add_location(main, file$j, 55, 4, 1522);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div5);
    			append_dev(div5, h4);
    			append_dev(div5, t1);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div2, div0);
    			append_dev(div0, input);
    			set_input_value(input, /*inputs*/ ctx[1].title);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, button);
    			append_dev(div4, t4);
    			append_dev(div4, div3);
    			append_dev(div3, p);
    			append_dev(p, b);
    			append_dev(b, t5);
    			append_dev(div4, t6);
    			if (if_block0) if_block0.m(div4, null);
    			append_dev(div4, t7);
    			if (if_block1) if_block1.m(div4, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[4]),
    					listen_dev(button, "click", /*search*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*inputs*/ 2 && input.value !== /*inputs*/ ctx[1].title) {
    				set_input_value(input, /*inputs*/ ctx[1].title);
    			}

    			if (dirty & /*message*/ 4 && t5_value !== (t5_value = /*message*/ ctx[2].msg + "")) set_data_dev(t5, t5_value);

    			if (dirty & /*message*/ 4 && p_class_value !== (p_class_value = "" + (null_to_empty(/*message*/ ctx[2].style) + " svelte-1jas1w7"))) {
    				attr_dev(p, "class", p_class_value);
    			}

    			if (/*products*/ ctx[0] !== "") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$5(ctx);
    					if_block0.c();
    					if_block0.m(div4, t7);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*products*/ ctx[0] == "") {
    				if (if_block1) ; else {
    					if_block1 = create_if_block$7(ctx);
    					if_block1.c();
    					if_block1.m(div4, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Search', slots, []);
    	let categories = [];
    	let products = [];
    	let sCate = [];
    	let selectedCate;
    	let inputs = { title: "" };
    	let message = { msg: "", style: "" };

    	onMount(async () => {
    		
    	}); // fetchCategory()

    	const fetchCategory = async () => {
    		await fetch(`${API_URL}/products/category/list`, { method: 'POST' }).then(response => response.json()).then(datas => {
    			categories = datas.data;
    		});
    	};

    	const cateChange = e => {
    		selectedCate = e.target.value;

    		if (selectedCate == "" || selectedCate == "undefined") {
    			sCate = [];
    		} else {
    			let cate = categories.find(tmp => tmp.category === selectedCate);
    			sCate = cate.subCategory;
    		}
    	};

    	const search = async () => {
    		if (inputs.title != '') {
    			$$invalidate(2, message.msg = '', message);

    			await fetch(`${API_URL}/products/search`, {
    				method: 'POST',
    				body: JSON.stringify(inputs),
    				headers: { 'Content-Type': 'application/json' }
    			}).then(response => response.json()).then(datas => {
    				$$invalidate(0, products = datas.data);
    			});
    		} else {
    			$$invalidate(2, message.style = 'text-danger', message);
    			$$invalidate(2, message.msg = 'Enter Product Name', message);
    			const val = document.getElementById('searchIn');
    			val.focus();
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Search> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		inputs.title = this.value;
    		$$invalidate(1, inputs);
    	}

    	$$self.$capture_state = () => ({
    		API_URL,
    		onMount,
    		categories,
    		products,
    		sCate,
    		selectedCate,
    		inputs,
    		message,
    		fetchCategory,
    		cateChange,
    		search
    	});

    	$$self.$inject_state = $$props => {
    		if ('categories' in $$props) categories = $$props.categories;
    		if ('products' in $$props) $$invalidate(0, products = $$props.products);
    		if ('sCate' in $$props) sCate = $$props.sCate;
    		if ('selectedCate' in $$props) selectedCate = $$props.selectedCate;
    		if ('inputs' in $$props) $$invalidate(1, inputs = $$props.inputs);
    		if ('message' in $$props) $$invalidate(2, message = $$props.message);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [products, inputs, message, search, input_input_handler];
    }

    class Search$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Search",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    /* src/pages/superAdmin/order/tabs/orderView.svelte generated by Svelte v3.44.1 */
    const file$i = "src/pages/superAdmin/order/tabs/orderView.svelte";

    function create_fragment$i(ctx) {
    	let main;
    	let div3;
    	let h4;
    	let t1;
    	let div2;
    	let div1;
    	let div0;
    	let table1;
    	let tbody;
    	let tr0;
    	let th0;
    	let t3;
    	let td0;
    	let t4_value = /*Order*/ ctx[0].category + "";
    	let t4;
    	let t5;
    	let tr1;
    	let th1;
    	let t7;
    	let td1;
    	let t8_value = /*Order*/ ctx[0].subCategory + "";
    	let t8;
    	let t9;
    	let tr2;
    	let th2;
    	let t11;
    	let td2;
    	let t12_value = /*Order*/ ctx[0].shipping_address + "";
    	let t12;
    	let t13;
    	let tr10;
    	let th3;
    	let t15;
    	let table0;
    	let tr3;
    	let td3;
    	let t16;
    	let t17_value = /*details*/ ctx[1].width + "";
    	let t17;
    	let t18;
    	let tr4;
    	let td4;
    	let t19;
    	let t20_value = /*details*/ ctx[1].height + "";
    	let t20;
    	let t21;
    	let tr5;
    	let td5;
    	let t22;
    	let t23_value = /*details*/ ctx[1].arcTop + "";
    	let t23;
    	let t24;
    	let tr6;
    	let td6;
    	let t25;
    	let t26_value = /*details*/ ctx[1].arcBottom + "";
    	let t26;
    	let t27;
    	let tr7;
    	let td7;
    	let t28;
    	let t29_value = /*details*/ ctx[1].varnish + "";
    	let t29;
    	let t30;
    	let tr8;
    	let td8;
    	let t31;
    	let t32_value = /*details*/ ctx[1].whiteCoat + "";
    	let t32;
    	let t33;
    	let tr9;
    	let td9;
    	let t34;
    	let t35_value = /*details*/ ctx[1].sandwich + "";
    	let t35;
    	let t36;
    	let tr11;
    	let th4;
    	let t38;
    	let td10;
    	let t39_value = /*details*/ ctx[1].message + "";
    	let t39;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div3 = element("div");
    			h4 = element("h4");
    			h4.textContent = "Order Details";
    			t1 = space();
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			table1 = element("table");
    			tbody = element("tbody");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Category Name:";
    			t3 = space();
    			td0 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			tr1 = element("tr");
    			th1 = element("th");
    			th1.textContent = "SubCategory:";
    			t7 = space();
    			td1 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			tr2 = element("tr");
    			th2 = element("th");
    			th2.textContent = "Shipping Address:";
    			t11 = space();
    			td2 = element("td");
    			t12 = text(t12_value);
    			t13 = space();
    			tr10 = element("tr");
    			th3 = element("th");
    			th3.textContent = "Order Details:";
    			t15 = space();
    			table0 = element("table");
    			tr3 = element("tr");
    			td3 = element("td");
    			t16 = text("Width: ");
    			t17 = text(t17_value);
    			t18 = space();
    			tr4 = element("tr");
    			td4 = element("td");
    			t19 = text("Height: ");
    			t20 = text(t20_value);
    			t21 = space();
    			tr5 = element("tr");
    			td5 = element("td");
    			t22 = text("Arc Top: ");
    			t23 = text(t23_value);
    			t24 = space();
    			tr6 = element("tr");
    			td6 = element("td");
    			t25 = text("Arc Bottom: ");
    			t26 = text(t26_value);
    			t27 = space();
    			tr7 = element("tr");
    			td7 = element("td");
    			t28 = text("Varnish: ");
    			t29 = text(t29_value);
    			t30 = space();
    			tr8 = element("tr");
    			td8 = element("td");
    			t31 = text("White-Coat: ");
    			t32 = text(t32_value);
    			t33 = space();
    			tr9 = element("tr");
    			td9 = element("td");
    			t34 = text("Sandwich: ");
    			t35 = text(t35_value);
    			t36 = space();
    			tr11 = element("tr");
    			th4 = element("th");
    			th4.textContent = "Message:";
    			t38 = space();
    			td10 = element("td");
    			t39 = text(t39_value);
    			attr_dev(h4, "class", "text-secondary text-center p-2 m-2 border-bottom");
    			add_location(h4, file$i, 30, 8, 738);
    			attr_dev(th0, "scope", "row");
    			add_location(th0, file$i, 37, 32, 1113);
    			add_location(td0, file$i, 38, 32, 1181);
    			add_location(tr0, file$i, 36, 28, 1076);
    			attr_dev(th1, "scope", "row");
    			add_location(th1, file$i, 41, 32, 1306);
    			add_location(td1, file$i, 42, 32, 1372);
    			add_location(tr1, file$i, 40, 28, 1269);
    			attr_dev(th2, "scope", "row");
    			add_location(th2, file$i, 45, 32, 1500);
    			add_location(td2, file$i, 46, 32, 1571);
    			add_location(tr2, file$i, 44, 28, 1463);
    			attr_dev(th3, "scope", "row");
    			add_location(th3, file$i, 49, 32, 1704);
    			add_location(td3, file$i, 52, 40, 1861);
    			add_location(tr3, file$i, 51, 36, 1816);
    			add_location(td4, file$i, 55, 40, 2016);
    			add_location(tr4, file$i, 54, 36, 1971);
    			add_location(td5, file$i, 58, 40, 2173);
    			add_location(tr5, file$i, 57, 36, 2128);
    			add_location(td6, file$i, 61, 40, 2331);
    			add_location(tr6, file$i, 60, 36, 2286);
    			add_location(td7, file$i, 64, 40, 2495);
    			add_location(tr7, file$i, 63, 36, 2450);
    			add_location(td8, file$i, 67, 40, 2654);
    			add_location(tr8, file$i, 66, 36, 2609);
    			add_location(td9, file$i, 70, 40, 2818);
    			add_location(tr9, file$i, 69, 36, 2773);
    			add_location(table0, file$i, 50, 32, 1772);
    			add_location(tr10, file$i, 48, 28, 1667);
    			attr_dev(th4, "scope", "row");
    			add_location(th4, file$i, 75, 32, 3038);
    			add_location(td10, file$i, 76, 32, 3100);
    			add_location(tr11, file$i, 74, 28, 3001);
    			add_location(tbody, file$i, 35, 24, 1040);
    			attr_dev(table1, "class", "border bg-light");
    			add_location(table1, file$i, 34, 20, 984);
    			attr_dev(div0, "class", "table table-responsive");
    			add_location(div0, file$i, 33, 16, 927);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$i, 32, 12, 893);
    			attr_dev(div2, "class", "container row justify-content-center p-4");
    			add_location(div2, file$i, 31, 8, 826);
    			attr_dev(div3, "class", "container-fluid border p-2");
    			add_location(div3, file$i, 29, 4, 689);
    			add_location(main, file$i, 28, 0, 678);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div3);
    			append_dev(div3, h4);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, table1);
    			append_dev(table1, tbody);
    			append_dev(tbody, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t3);
    			append_dev(tr0, td0);
    			append_dev(td0, t4);
    			append_dev(tbody, t5);
    			append_dev(tbody, tr1);
    			append_dev(tr1, th1);
    			append_dev(tr1, t7);
    			append_dev(tr1, td1);
    			append_dev(td1, t8);
    			append_dev(tbody, t9);
    			append_dev(tbody, tr2);
    			append_dev(tr2, th2);
    			append_dev(tr2, t11);
    			append_dev(tr2, td2);
    			append_dev(td2, t12);
    			append_dev(tbody, t13);
    			append_dev(tbody, tr10);
    			append_dev(tr10, th3);
    			append_dev(tr10, t15);
    			append_dev(tr10, table0);
    			append_dev(table0, tr3);
    			append_dev(tr3, td3);
    			append_dev(td3, t16);
    			append_dev(td3, t17);
    			append_dev(table0, t18);
    			append_dev(table0, tr4);
    			append_dev(tr4, td4);
    			append_dev(td4, t19);
    			append_dev(td4, t20);
    			append_dev(table0, t21);
    			append_dev(table0, tr5);
    			append_dev(tr5, td5);
    			append_dev(td5, t22);
    			append_dev(td5, t23);
    			append_dev(table0, t24);
    			append_dev(table0, tr6);
    			append_dev(tr6, td6);
    			append_dev(td6, t25);
    			append_dev(td6, t26);
    			append_dev(table0, t27);
    			append_dev(table0, tr7);
    			append_dev(tr7, td7);
    			append_dev(td7, t28);
    			append_dev(td7, t29);
    			append_dev(table0, t30);
    			append_dev(table0, tr8);
    			append_dev(tr8, td8);
    			append_dev(td8, t31);
    			append_dev(td8, t32);
    			append_dev(table0, t33);
    			append_dev(table0, tr9);
    			append_dev(tr9, td9);
    			append_dev(td9, t34);
    			append_dev(td9, t35);
    			append_dev(tbody, t36);
    			append_dev(tbody, tr11);
    			append_dev(tr11, th4);
    			append_dev(tr11, t38);
    			append_dev(tr11, td10);
    			append_dev(td10, t39);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*Order*/ 1 && t4_value !== (t4_value = /*Order*/ ctx[0].category + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*Order*/ 1 && t8_value !== (t8_value = /*Order*/ ctx[0].subCategory + "")) set_data_dev(t8, t8_value);
    			if (dirty & /*Order*/ 1 && t12_value !== (t12_value = /*Order*/ ctx[0].shipping_address + "")) set_data_dev(t12, t12_value);
    			if (dirty & /*details*/ 2 && t17_value !== (t17_value = /*details*/ ctx[1].width + "")) set_data_dev(t17, t17_value);
    			if (dirty & /*details*/ 2 && t20_value !== (t20_value = /*details*/ ctx[1].height + "")) set_data_dev(t20, t20_value);
    			if (dirty & /*details*/ 2 && t23_value !== (t23_value = /*details*/ ctx[1].arcTop + "")) set_data_dev(t23, t23_value);
    			if (dirty & /*details*/ 2 && t26_value !== (t26_value = /*details*/ ctx[1].arcBottom + "")) set_data_dev(t26, t26_value);
    			if (dirty & /*details*/ 2 && t29_value !== (t29_value = /*details*/ ctx[1].varnish + "")) set_data_dev(t29, t29_value);
    			if (dirty & /*details*/ 2 && t32_value !== (t32_value = /*details*/ ctx[1].whiteCoat + "")) set_data_dev(t32, t32_value);
    			if (dirty & /*details*/ 2 && t35_value !== (t35_value = /*details*/ ctx[1].sandwich + "")) set_data_dev(t35, t35_value);
    			if (dirty & /*details*/ 2 && t39_value !== (t39_value = /*details*/ ctx[1].message + "")) set_data_dev(t39, t39_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('OrderView', slots, []);
    	let { id } = $$props;
    	let Order = [];
    	let details = [];

    	onMount(() => {
    		fetchOrder();
    	});

    	const fetchOrder = async () => {
    		let bodyData = { order_id: id };

    		const res = await fetch(`${API_URL}/order/single_order_view`, {
    			method: "post",
    			body: JSON.stringify(bodyData),
    			headers: { "Content-Type": "application/json" }
    		});

    		const json = await res.json();
    		$$invalidate(0, Order = json.data);
    		$$invalidate(1, details = json.data.order_details);
    	};

    	const writable_props = ['id'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<OrderView> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(2, id = $$props.id);
    	};

    	$$self.$capture_state = () => ({
    		API_URL,
    		onMount,
    		Login,
    		id,
    		Order,
    		details,
    		fetchOrder
    	});

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(2, id = $$props.id);
    		if ('Order' in $$props) $$invalidate(0, Order = $$props.Order);
    		if ('details' in $$props) $$invalidate(1, details = $$props.details);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [Order, details, id];
    }

    class OrderView extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { id: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OrderView",
    			options,
    			id: create_fragment$i.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*id*/ ctx[2] === undefined && !('id' in props)) {
    			console.warn("<OrderView> was created without expected prop 'id'");
    		}
    	}

    	get id() {
    		throw new Error("<OrderView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<OrderView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/pages/superAdmin/user/userCreate.svelte generated by Svelte v3.44.1 */

    const { console: console_1$6 } = globals;
    const file$h = "src/pages/superAdmin/user/userCreate.svelte";

    function create_fragment$h(ctx) {
    	let main;
    	let div3;
    	let div2;
    	let h4;
    	let t1;
    	let form;
    	let input0;
    	let t2;
    	let input1;
    	let t3;
    	let input2;
    	let t4;
    	let input3;
    	let t5;
    	let input4;
    	let t6;
    	let input5;
    	let t7;
    	let textarea;
    	let t8;
    	let div0;
    	let p;
    	let b;
    	let t9_value = /*message*/ ctx[0].msg + "";
    	let t9;
    	let p_class_value;
    	let t10;
    	let div1;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div3 = element("div");
    			div2 = element("div");
    			h4 = element("h4");
    			h4.textContent = "Create Distributer";
    			t1 = space();
    			form = element("form");
    			input0 = element("input");
    			t2 = space();
    			input1 = element("input");
    			t3 = space();
    			input2 = element("input");
    			t4 = space();
    			input3 = element("input");
    			t5 = space();
    			input4 = element("input");
    			t6 = space();
    			input5 = element("input");
    			t7 = space();
    			textarea = element("textarea");
    			t8 = space();
    			div0 = element("div");
    			p = element("p");
    			b = element("b");
    			t9 = text(t9_value);
    			t10 = space();
    			div1 = element("div");
    			button = element("button");
    			button.textContent = "Create";
    			attr_dev(h4, "class", "heading text-center p-2 svelte-zh4vk7");
    			add_location(h4, file$h, 48, 16, 1320);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "form-control form-input svelte-zh4vk7");
    			attr_dev(input0, "placeholder", "Name");
    			add_location(input0, file$h, 50, 20, 1459);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "class", "form-control form-input svelte-zh4vk7");
    			attr_dev(input1, "placeholder", "Mobile Number");
    			attr_dev(input1, "maxlength", "10");
    			add_location(input1, file$h, 51, 20, 1576);
    			attr_dev(input2, "type", "email");
    			attr_dev(input2, "class", "form-control form-input text-lower svelte-zh4vk7");
    			attr_dev(input2, "placeholder", "E-mail");
    			add_location(input2, file$h, 52, 20, 1718);
    			attr_dev(input3, "type", "password");
    			attr_dev(input3, "class", "form-control form-input svelte-zh4vk7");
    			attr_dev(input3, "placeholder", "Password");
    			add_location(input3, file$h, 53, 20, 1850);
    			attr_dev(input4, "type", "text");
    			attr_dev(input4, "class", "form-control form-input svelte-zh4vk7");
    			attr_dev(input4, "placeholder", "Base Price");
    			add_location(input4, file$h, 54, 20, 1983);
    			attr_dev(input5, "type", "text");
    			attr_dev(input5, "class", "form-control form-input svelte-zh4vk7");
    			attr_dev(input5, "placeholder", "Delivery Price");
    			add_location(input5, file$h, 55, 20, 2111);
    			attr_dev(textarea, "type", "text");
    			attr_dev(textarea, "class", "form-control form-input svelte-zh4vk7");
    			attr_dev(textarea, "placeholder", "Address");
    			attr_dev(textarea, "row", "3");
    			add_location(textarea, file$h, 56, 20, 2260);
    			add_location(b, file$h, 58, 51, 2495);
    			attr_dev(p, "class", p_class_value = "" + (null_to_empty(/*message*/ ctx[0].style) + " svelte-zh4vk7"));
    			add_location(p, file$h, 58, 24, 2468);
    			attr_dev(div0, "class", "row m-auto justify-content-center p-1");
    			add_location(div0, file$h, 57, 20, 2392);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-create svelte-zh4vk7");
    			add_location(button, file$h, 61, 24, 2636);
    			attr_dev(div1, "class", "row m-auto justify-content-end");
    			add_location(div1, file$h, 60, 20, 2567);
    			attr_dev(form, "class", "border-top col-md-10 m-auto");
    			add_location(form, file$h, 49, 16, 1396);
    			attr_dev(div2, "class", "container mt-2 border");
    			add_location(div2, file$h, 47, 12, 1268);
    			attr_dev(div3, "class", "row justify-content-center");
    			add_location(div3, file$h, 46, 4, 1214);
    			add_location(main, file$h, 45, 0, 1203);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div3);
    			append_dev(div3, div2);
    			append_dev(div2, h4);
    			append_dev(div2, t1);
    			append_dev(div2, form);
    			append_dev(form, input0);
    			set_input_value(input0, /*inputs*/ ctx[1].name);
    			append_dev(form, t2);
    			append_dev(form, input1);
    			set_input_value(input1, /*inputs*/ ctx[1].phone);
    			append_dev(form, t3);
    			append_dev(form, input2);
    			set_input_value(input2, /*inputs*/ ctx[1].email);
    			append_dev(form, t4);
    			append_dev(form, input3);
    			set_input_value(input3, /*inputs*/ ctx[1].password);
    			append_dev(form, t5);
    			append_dev(form, input4);
    			set_input_value(input4, /*inputs*/ ctx[1].basePrice);
    			append_dev(form, t6);
    			append_dev(form, input5);
    			set_input_value(input5, /*inputs*/ ctx[1].deliveryPrice);
    			append_dev(form, t7);
    			append_dev(form, textarea);
    			set_input_value(textarea, /*inputs*/ ctx[1].address);
    			append_dev(form, t8);
    			append_dev(form, div0);
    			append_dev(div0, p);
    			append_dev(p, b);
    			append_dev(b, t9);
    			append_dev(form, t10);
    			append_dev(form, div1);
    			append_dev(div1, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[3]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[4]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[5]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[6]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[7]),
    					listen_dev(input5, "input", /*input5_input_handler*/ ctx[8]),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[9]),
    					listen_dev(button, "click", /*addDistributer*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*inputs*/ 2 && input0.value !== /*inputs*/ ctx[1].name) {
    				set_input_value(input0, /*inputs*/ ctx[1].name);
    			}

    			if (dirty & /*inputs*/ 2 && input1.value !== /*inputs*/ ctx[1].phone) {
    				set_input_value(input1, /*inputs*/ ctx[1].phone);
    			}

    			if (dirty & /*inputs*/ 2 && input2.value !== /*inputs*/ ctx[1].email) {
    				set_input_value(input2, /*inputs*/ ctx[1].email);
    			}

    			if (dirty & /*inputs*/ 2 && input3.value !== /*inputs*/ ctx[1].password) {
    				set_input_value(input3, /*inputs*/ ctx[1].password);
    			}

    			if (dirty & /*inputs*/ 2 && input4.value !== /*inputs*/ ctx[1].basePrice) {
    				set_input_value(input4, /*inputs*/ ctx[1].basePrice);
    			}

    			if (dirty & /*inputs*/ 2 && input5.value !== /*inputs*/ ctx[1].deliveryPrice) {
    				set_input_value(input5, /*inputs*/ ctx[1].deliveryPrice);
    			}

    			if (dirty & /*inputs*/ 2) {
    				set_input_value(textarea, /*inputs*/ ctx[1].address);
    			}

    			if (dirty & /*message*/ 1 && t9_value !== (t9_value = /*message*/ ctx[0].msg + "")) set_data_dev(t9, t9_value);

    			if (dirty & /*message*/ 1 && p_class_value !== (p_class_value = "" + (null_to_empty(/*message*/ ctx[0].style) + " svelte-zh4vk7"))) {
    				attr_dev(p, "class", p_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UserCreate', slots, []);
    	let message = { msg: "", style: "" };

    	let inputs = {
    		name: '',
    		phone: '',
    		email: '',
    		password: '',
    		basePrice: '',
    		deliveryPrice: '',
    		address: ''
    	};

    	const addDistributer = async () => {
    		let validate = distributerValid(inputs);

    		if (validate.valid == true) {
    			$$invalidate(0, message.style = 'text-info', message);
    			$$invalidate(0, message.msg = validate.error, message);

    			try {
    				$$invalidate(0, message.msg = "Loading..", message);

    				const res = await fetch(`${API_URL}/admin/distributer/create`, {
    					method: 'post',
    					body: JSON.stringify(inputs),
    					headers: { 'Content-Type': 'application/json' }
    				});

    				const json = await res.json();
    				console.log(json);
    				$$invalidate(0, message.style = 'text-info', message);
    				$$invalidate(0, message.msg = json.message, message);

    				if (json.status === true) {
    					$$invalidate(1, inputs.image = "", inputs);
    				}
    			} catch(error) {
    				$$invalidate(0, message.style = 'text-warning', message);
    				$$invalidate(0, message.msg = "Network error !!", message);
    			}
    		} else {
    			$$invalidate(0, message.style = 'text-danger', message);
    			$$invalidate(0, message.msg = validate.error, message);
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$6.warn(`<UserCreate> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		inputs.name = this.value;
    		$$invalidate(1, inputs);
    	}

    	function input1_input_handler() {
    		inputs.phone = this.value;
    		$$invalidate(1, inputs);
    	}

    	function input2_input_handler() {
    		inputs.email = this.value;
    		$$invalidate(1, inputs);
    	}

    	function input3_input_handler() {
    		inputs.password = this.value;
    		$$invalidate(1, inputs);
    	}

    	function input4_input_handler() {
    		inputs.basePrice = this.value;
    		$$invalidate(1, inputs);
    	}

    	function input5_input_handler() {
    		inputs.deliveryPrice = this.value;
    		$$invalidate(1, inputs);
    	}

    	function textarea_input_handler() {
    		inputs.address = this.value;
    		$$invalidate(1, inputs);
    	}

    	$$self.$capture_state = () => ({
    		API_URL,
    		distributerValid,
    		message,
    		inputs,
    		addDistributer
    	});

    	$$self.$inject_state = $$props => {
    		if ('message' in $$props) $$invalidate(0, message = $$props.message);
    		if ('inputs' in $$props) $$invalidate(1, inputs = $$props.inputs);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		message,
    		inputs,
    		addDistributer,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		input5_input_handler,
    		textarea_input_handler
    	];
    }

    class UserCreate extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UserCreate",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* src/pages/superAdmin/user/users.svelte generated by Svelte v3.44.1 */
    const file$g = "src/pages/superAdmin/user/users.svelte";

    function get_each_context$c(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (36:12) {#each distributers as user}
    function create_each_block$c(ctx) {
    	let a;
    	let div;
    	let h4;
    	let t0_value = /*user*/ ctx[4].name + "";
    	let t0;
    	let t1;
    	let h6;
    	let t2;
    	let b0;
    	let t3_value = /*user*/ ctx[4].phone + "";
    	let t3;
    	let t4;
    	let p;
    	let t5;
    	let b1;
    	let t6_value = /*user*/ ctx[4].active + "";
    	let t6;
    	let t7;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			div = element("div");
    			h4 = element("h4");
    			t0 = text(t0_value);
    			t1 = space();
    			h6 = element("h6");
    			t2 = text("Phone: ");
    			b0 = element("b");
    			t3 = text(t3_value);
    			t4 = space();
    			p = element("p");
    			t5 = text("Status: ");
    			b1 = element("b");
    			t6 = text(t6_value);
    			t7 = space();
    			add_location(h4, file$g, 38, 24, 981);
    			add_location(b0, file$g, 39, 35, 1037);
    			add_location(h6, file$g, 39, 24, 1026);
    			add_location(b1, file$g, 40, 35, 1097);
    			attr_dev(p, "class", "svelte-268xi9");
    			add_location(p, file$g, 40, 24, 1086);
    			attr_dev(div, "class", "card-info svelte-268xi9");
    			add_location(div, file$g, 37, 20, 933);
    			attr_dev(a, "class", "col-sm-3 card card-user svelte-268xi9");
    			attr_dev(a, "href", a_href_value = "/admin/user_view/" + /*user*/ ctx[4]._id);
    			add_location(a, file$g, 36, 16, 842);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, div);
    			append_dev(div, h4);
    			append_dev(h4, t0);
    			append_dev(div, t1);
    			append_dev(div, h6);
    			append_dev(h6, t2);
    			append_dev(h6, b0);
    			append_dev(b0, t3);
    			append_dev(div, t4);
    			append_dev(div, p);
    			append_dev(p, t5);
    			append_dev(p, b1);
    			append_dev(b1, t6);
    			append_dev(a, t7);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*distributers*/ 1 && t0_value !== (t0_value = /*user*/ ctx[4].name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*distributers*/ 1 && t3_value !== (t3_value = /*user*/ ctx[4].phone + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*distributers*/ 1 && t6_value !== (t6_value = /*user*/ ctx[4].active + "")) set_data_dev(t6, t6_value);

    			if (dirty & /*distributers*/ 1 && a_href_value !== (a_href_value = "/admin/user_view/" + /*user*/ ctx[4]._id)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$c.name,
    		type: "each",
    		source: "(36:12) {#each distributers as user}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let main;
    	let div2;
    	let div1;
    	let h4;
    	let t1;
    	let div0;
    	let each_value = /*distributers*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$c(get_each_context$c(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			div2 = element("div");
    			div1 = element("div");
    			h4 = element("h4");
    			h4.textContent = "Distributers";
    			t1 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h4, "class", "heading text-center p-2 border-bottom svelte-268xi9");
    			add_location(h4, file$g, 33, 8, 668);
    			attr_dev(div0, "class", "row justify-content-center");
    			add_location(div0, file$g, 34, 8, 744);
    			attr_dev(div1, "class", "border");
    			add_location(div1, file$g, 32, 4, 639);
    			attr_dev(div2, "class", "container pt-4");
    			add_location(div2, file$g, 31, 0, 606);
    			add_location(main, file$g, 30, 0, 599);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div2);
    			append_dev(div2, div1);
    			append_dev(div1, h4);
    			append_dev(div1, t1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*distributers*/ 1) {
    				each_value = /*distributers*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$c(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$c(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Users', slots, []);
    	let distributers = [];
    	let inputs = { skip: '', limit: 10 };
    	let totalCount;

    	onMount(async () => {
    		fetchMarketer();
    	});

    	const fetchMarketer = async () => {
    		await fetch(`${API_URL}/admin/distributer/read`, {
    			method: 'POST',
    			body: JSON.stringify(inputs),
    			headers: { 'Content-Type': 'application/json' }
    		}).then(response => response.json()).then(datas => {
    			$$invalidate(0, distributers = datas.data.distributer);
    			totalCount = datas.data.count;
    		});
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Users> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		API_URL,
    		onMount,
    		distributers,
    		inputs,
    		totalCount,
    		fetchMarketer
    	});

    	$$self.$inject_state = $$props => {
    		if ('distributers' in $$props) $$invalidate(0, distributers = $$props.distributers);
    		if ('inputs' in $$props) inputs = $$props.inputs;
    		if ('totalCount' in $$props) totalCount = $$props.totalCount;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [distributers];
    }

    class Users$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Users",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src/pages/superAdmin/user/userView.svelte generated by Svelte v3.44.1 */
    const file$f = "src/pages/superAdmin/user/userView.svelte";

    function get_each_context$b(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	return child_ctx;
    }

    // (170:4) {#if inputs.name != ''}
    function create_if_block$6(ctx) {
    	let div10;
    	let h4;
    	let t0_value = /*inputs*/ ctx[1].name + "";
    	let t0;
    	let t1;
    	let t2;
    	let ul;
    	let li0;
    	let a0;
    	let t4;
    	let li1;
    	let a1;
    	let t6;
    	let div9;
    	let div3;
    	let div0;
    	let h60;
    	let t8;
    	let input0;
    	let t9;
    	let h61;
    	let t11;
    	let input1;
    	let t12;
    	let h62;
    	let t14;
    	let input2;
    	let t15;
    	let h63;
    	let t17;
    	let input3;
    	let t18;
    	let h64;
    	let t20;
    	let input4;
    	let t21;
    	let h65;
    	let t23;
    	let input5;
    	let t24;
    	let h66;
    	let t26;
    	let input6;
    	let t27;
    	let h67;
    	let t29;
    	let label;
    	let input7;
    	let input7_checked_value;
    	let t30;
    	let b0;
    	let t31_value = /*inputs*/ ctx[1].active + "";
    	let t31;
    	let t32;
    	let div1;
    	let p;
    	let b1;
    	let t33_value = /*message*/ ctx[0].msg + "";
    	let t33;
    	let p_class_value;
    	let t34;
    	let div2;
    	let button0;
    	let t36;
    	let button1;
    	let t38;
    	let a2;
    	let t40;
    	let div8;
    	let div7;
    	let h68;
    	let t42;
    	let div6;
    	let div5;
    	let div4;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t44;
    	let th1;
    	let t46;
    	let th2;
    	let t48;
    	let th3;
    	let t50;
    	let th4;
    	let t52;
    	let th5;
    	let t54;
    	let tbody;
    	let mounted;
    	let dispose;
    	let each_value = /*myJobs*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$b(get_each_context$b(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div10 = element("div");
    			h4 = element("h4");
    			t0 = text(t0_value);
    			t1 = text(" Details");
    			t2 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "Details";
    			t4 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "Orders";
    			t6 = space();
    			div9 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			h60 = element("h6");
    			h60.textContent = "Name:";
    			t8 = space();
    			input0 = element("input");
    			t9 = space();
    			h61 = element("h6");
    			h61.textContent = "E Mail:";
    			t11 = space();
    			input1 = element("input");
    			t12 = space();
    			h62 = element("h6");
    			h62.textContent = "Mobile:";
    			t14 = space();
    			input2 = element("input");
    			t15 = space();
    			h63 = element("h6");
    			h63.textContent = "Change Password:";
    			t17 = space();
    			input3 = element("input");
    			t18 = space();
    			h64 = element("h6");
    			h64.textContent = "Base Price:";
    			t20 = space();
    			input4 = element("input");
    			t21 = space();
    			h65 = element("h6");
    			h65.textContent = "Delivery Price:";
    			t23 = space();
    			input5 = element("input");
    			t24 = space();
    			h66 = element("h6");
    			h66.textContent = "Address:";
    			t26 = space();
    			input6 = element("input");
    			t27 = space();
    			h67 = element("h6");
    			h67.textContent = "Status:";
    			t29 = space();
    			label = element("label");
    			input7 = element("input");
    			t30 = space();
    			b0 = element("b");
    			t31 = text(t31_value);
    			t32 = space();
    			div1 = element("div");
    			p = element("p");
    			b1 = element("b");
    			t33 = text(t33_value);
    			t34 = space();
    			div2 = element("div");
    			button0 = element("button");
    			button0.textContent = "Update";
    			t36 = space();
    			button1 = element("button");
    			button1.textContent = "Delete";
    			t38 = space();
    			a2 = element("a");
    			a2.textContent = "Back";
    			t40 = space();
    			div8 = element("div");
    			div7 = element("div");
    			h68 = element("h6");
    			h68.textContent = "Ordered List:";
    			t42 = space();
    			div6 = element("div");
    			div5 = element("div");
    			div4 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Product";
    			t44 = space();
    			th1 = element("th");
    			th1.textContent = "Marketer";
    			t46 = space();
    			th2 = element("th");
    			th2.textContent = "Details";
    			t48 = space();
    			th3 = element("th");
    			th3.textContent = "Category";
    			t50 = space();
    			th4 = element("th");
    			th4.textContent = "Address";
    			t52 = space();
    			th5 = element("th");
    			th5.textContent = "Status";
    			t54 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h4, "id", "heading");
    			attr_dev(h4, "class", "text-center text-capitalize  svelte-1xqwy6n");
    			add_location(h4, file$f, 171, 8, 4651);
    			attr_dev(a0, "data-toggle", "tab");
    			attr_dev(a0, "href", "#detail");
    			attr_dev(a0, "role", "tab");
    			attr_dev(a0, "class", "nav-link active");
    			add_location(a0, file$f, 174, 12, 4864);
    			attr_dev(li0, "class", "nav-item flex-sm-fill");
    			add_location(li0, file$f, 173, 10, 4817);
    			attr_dev(a1, "data-toggle", "tab");
    			attr_dev(a1, "href", "#orders");
    			attr_dev(a1, "role", "tab");
    			attr_dev(a1, "class", "nav-link");
    			add_location(a1, file$f, 177, 12, 5020);
    			attr_dev(li1, "class", "nav-item flex-sm-fill");
    			add_location(li1, file$f, 176, 10, 4973);
    			attr_dev(ul, "role", "tablist");
    			attr_dev(ul, "class", "nav nav-tabs mt-3 mb-3 pt-4 border-top");
    			add_location(ul, file$f, 172, 8, 4740);
    			attr_dev(h60, "class", "");
    			add_location(h60, file$f, 183, 16, 5301);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "form-control form-ipt svelte-1xqwy6n");
    			attr_dev(input0, "placeholder", "Name");
    			add_location(input0, file$f, 184, 16, 5341);
    			attr_dev(h61, "class", "");
    			add_location(h61, file$f, 185, 16, 5452);
    			attr_dev(input1, "type", "email");
    			attr_dev(input1, "class", "form-control form-ipt text-lower svelte-1xqwy6n");
    			attr_dev(input1, "placeholder", "E-mail");
    			add_location(input1, file$f, 186, 16, 5494);
    			attr_dev(h62, "class", "");
    			add_location(h62, file$f, 187, 16, 5620);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "class", "form-control form-ipt svelte-1xqwy6n");
    			attr_dev(input2, "placeholder", "Mobile Number");
    			add_location(input2, file$f, 188, 16, 5662);
    			attr_dev(h63, "class", "");
    			add_location(h63, file$f, 189, 16, 5783);
    			attr_dev(input3, "type", "password");
    			attr_dev(input3, "class", "form-control form-ipt svelte-1xqwy6n");
    			attr_dev(input3, "placeholder", "Change Password");
    			add_location(input3, file$f, 190, 16, 5834);
    			attr_dev(h64, "class", "");
    			add_location(h64, file$f, 191, 16, 5964);
    			attr_dev(input4, "type", "text");
    			attr_dev(input4, "class", "form-control form-ipt svelte-1xqwy6n");
    			attr_dev(input4, "placeholder", "Mobile Number");
    			add_location(input4, file$f, 192, 16, 6010);
    			attr_dev(h65, "class", "");
    			add_location(h65, file$f, 193, 16, 6135);
    			attr_dev(input5, "type", "text");
    			attr_dev(input5, "class", "form-control form-ipt svelte-1xqwy6n");
    			attr_dev(input5, "placeholder", "Mobile Number");
    			add_location(input5, file$f, 194, 16, 6185);
    			attr_dev(h66, "class", "");
    			add_location(h66, file$f, 195, 16, 6314);
    			attr_dev(input6, "type", "text");
    			attr_dev(input6, "class", "form-control form-ipt svelte-1xqwy6n");
    			attr_dev(input6, "placeholder", "Mobile Number");
    			add_location(input6, file$f, 196, 16, 6357);
    			attr_dev(h67, "class", "");
    			add_location(h67, file$f, 197, 16, 6480);
    			attr_dev(input7, "type", "checkbox");
    			input7.checked = input7_checked_value = /*inputs*/ ctx[1].active;
    			add_location(input7, file$f, 199, 20, 6587);
    			add_location(b0, file$f, 199, 89, 6656);
    			attr_dev(label, "class", "border p-2 text-uppercase ");
    			add_location(label, file$f, 198, 18, 6524);
    			attr_dev(div0, "class", "p-3");
    			add_location(div0, file$f, 182, 12, 5267);
    			add_location(b1, file$f, 203, 41, 6830);
    			attr_dev(p, "class", p_class_value = "" + (null_to_empty(/*message*/ ctx[0].style) + " svelte-1xqwy6n"));
    			add_location(p, file$f, 203, 14, 6803);
    			attr_dev(div1, "class", "row m-auto justify-content-center p-1");
    			add_location(div1, file$f, 202, 12, 6737);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "btns btn btn-outline-info svelte-1xqwy6n");
    			add_location(button0, file$f, 206, 16, 6949);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "btns btn btn-outline-danger svelte-1xqwy6n");
    			add_location(button1, file$f, 207, 16, 7061);
    			attr_dev(a2, "href", "/admin/user_view");
    			attr_dev(a2, "class", "btns btn btn-outline-secondary svelte-1xqwy6n");
    			add_location(a2, file$f, 208, 16, 7176);
    			attr_dev(div2, "class", "row ml-auto justify-content-center");
    			add_location(div2, file$f, 205, 12, 6884);
    			attr_dev(div3, "id", "detail");
    			attr_dev(div3, "role", "tabpanel");
    			attr_dev(div3, "class", "tab-pane fade show active");
    			add_location(div3, file$f, 181, 10, 5187);
    			attr_dev(h68, "class", "");
    			add_location(h68, file$f, 213, 16, 7400);
    			add_location(th0, file$f, 220, 28, 7716);
    			add_location(th1, file$f, 221, 28, 7761);
    			add_location(th2, file$f, 222, 28, 7807);
    			add_location(th3, file$f, 223, 28, 7852);
    			add_location(th4, file$f, 224, 28, 7898);
    			add_location(th5, file$f, 225, 28, 7943);
    			add_location(tr, file$f, 219, 26, 7683);
    			add_location(thead, file$f, 218, 24, 7649);
    			attr_dev(tbody, "class", "table-body");
    			add_location(tbody, file$f, 228, 24, 8048);
    			attr_dev(table, "class", "table table-fill");
    			add_location(table, file$f, 217, 22, 7592);
    			attr_dev(div4, "class", "table-responsive border");
    			add_location(div4, file$f, 216, 20, 7532);
    			attr_dev(div5, "class", "col container");
    			add_location(div5, file$f, 215, 18, 7484);
    			attr_dev(div6, "class", "row");
    			add_location(div6, file$f, 214, 16, 7448);
    			attr_dev(div7, "class", "p-2");
    			add_location(div7, file$f, 212, 12, 7365);
    			attr_dev(div8, "id", "orders");
    			attr_dev(div8, "role", "tabpanel");
    			attr_dev(div8, "class", "tab-pane fade");
    			add_location(div8, file$f, 211, 10, 7297);
    			attr_dev(div9, "id", "myTabContent");
    			attr_dev(div9, "class", "tab-content");
    			add_location(div9, file$f, 180, 8, 5133);
    			attr_dev(div10, "class", "container-fluid border p-2");
    			add_location(div10, file$f, 170, 4, 4602);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div10, anchor);
    			append_dev(div10, h4);
    			append_dev(h4, t0);
    			append_dev(h4, t1);
    			append_dev(div10, t2);
    			append_dev(div10, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(ul, t4);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(div10, t6);
    			append_dev(div10, div9);
    			append_dev(div9, div3);
    			append_dev(div3, div0);
    			append_dev(div0, h60);
    			append_dev(div0, t8);
    			append_dev(div0, input0);
    			set_input_value(input0, /*inputs*/ ctx[1].name);
    			append_dev(div0, t9);
    			append_dev(div0, h61);
    			append_dev(div0, t11);
    			append_dev(div0, input1);
    			set_input_value(input1, /*inputs*/ ctx[1].email);
    			append_dev(div0, t12);
    			append_dev(div0, h62);
    			append_dev(div0, t14);
    			append_dev(div0, input2);
    			set_input_value(input2, /*inputs*/ ctx[1].phone);
    			append_dev(div0, t15);
    			append_dev(div0, h63);
    			append_dev(div0, t17);
    			append_dev(div0, input3);
    			set_input_value(input3, /*inputs*/ ctx[1].password);
    			append_dev(div0, t18);
    			append_dev(div0, h64);
    			append_dev(div0, t20);
    			append_dev(div0, input4);
    			set_input_value(input4, /*inputs*/ ctx[1].basePrice);
    			append_dev(div0, t21);
    			append_dev(div0, h65);
    			append_dev(div0, t23);
    			append_dev(div0, input5);
    			set_input_value(input5, /*inputs*/ ctx[1].deliveryPrice);
    			append_dev(div0, t24);
    			append_dev(div0, h66);
    			append_dev(div0, t26);
    			append_dev(div0, input6);
    			set_input_value(input6, /*inputs*/ ctx[1].address);
    			append_dev(div0, t27);
    			append_dev(div0, h67);
    			append_dev(div0, t29);
    			append_dev(div0, label);
    			append_dev(label, input7);
    			append_dev(label, t30);
    			append_dev(label, b0);
    			append_dev(b0, t31);
    			append_dev(div3, t32);
    			append_dev(div3, div1);
    			append_dev(div1, p);
    			append_dev(p, b1);
    			append_dev(b1, t33);
    			append_dev(div3, t34);
    			append_dev(div3, div2);
    			append_dev(div2, button0);
    			append_dev(div2, t36);
    			append_dev(div2, button1);
    			append_dev(div2, t38);
    			append_dev(div2, a2);
    			append_dev(div9, t40);
    			append_dev(div9, div8);
    			append_dev(div8, div7);
    			append_dev(div7, h68);
    			append_dev(div7, t42);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t44);
    			append_dev(tr, th1);
    			append_dev(tr, t46);
    			append_dev(tr, th2);
    			append_dev(tr, t48);
    			append_dev(tr, th3);
    			append_dev(tr, t50);
    			append_dev(tr, th4);
    			append_dev(tr, t52);
    			append_dev(tr, th5);
    			append_dev(table, t54);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[10]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[11]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[12]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[13]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[14]),
    					listen_dev(input5, "input", /*input5_input_handler*/ ctx[15]),
    					listen_dev(input6, "input", /*input6_input_handler*/ ctx[16]),
    					listen_dev(input7, "click", /*chekboxx*/ ctx[5], false, false, false),
    					listen_dev(button0, "click", /*updateHandle*/ ctx[3], false, false, false),
    					listen_dev(button1, "click", /*deleteConfirm*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*inputs*/ 2 && t0_value !== (t0_value = /*inputs*/ ctx[1].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*inputs*/ 2 && input0.value !== /*inputs*/ ctx[1].name) {
    				set_input_value(input0, /*inputs*/ ctx[1].name);
    			}

    			if (dirty & /*inputs*/ 2 && input1.value !== /*inputs*/ ctx[1].email) {
    				set_input_value(input1, /*inputs*/ ctx[1].email);
    			}

    			if (dirty & /*inputs*/ 2 && input2.value !== /*inputs*/ ctx[1].phone) {
    				set_input_value(input2, /*inputs*/ ctx[1].phone);
    			}

    			if (dirty & /*inputs*/ 2 && input3.value !== /*inputs*/ ctx[1].password) {
    				set_input_value(input3, /*inputs*/ ctx[1].password);
    			}

    			if (dirty & /*inputs*/ 2 && input4.value !== /*inputs*/ ctx[1].basePrice) {
    				set_input_value(input4, /*inputs*/ ctx[1].basePrice);
    			}

    			if (dirty & /*inputs*/ 2 && input5.value !== /*inputs*/ ctx[1].deliveryPrice) {
    				set_input_value(input5, /*inputs*/ ctx[1].deliveryPrice);
    			}

    			if (dirty & /*inputs*/ 2 && input6.value !== /*inputs*/ ctx[1].address) {
    				set_input_value(input6, /*inputs*/ ctx[1].address);
    			}

    			if (dirty & /*inputs*/ 2 && input7_checked_value !== (input7_checked_value = /*inputs*/ ctx[1].active)) {
    				prop_dev(input7, "checked", input7_checked_value);
    			}

    			if (dirty & /*inputs*/ 2 && t31_value !== (t31_value = /*inputs*/ ctx[1].active + "")) set_data_dev(t31, t31_value);
    			if (dirty & /*message*/ 1 && t33_value !== (t33_value = /*message*/ ctx[0].msg + "")) set_data_dev(t33, t33_value);

    			if (dirty & /*message*/ 1 && p_class_value !== (p_class_value = "" + (null_to_empty(/*message*/ ctx[0].style) + " svelte-1xqwy6n"))) {
    				attr_dev(p, "class", p_class_value);
    			}

    			if (dirty & /*myJobs, viewDetails, viewMarketer, viewItem*/ 452) {
    				each_value = /*myJobs*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$b(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$b(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div10);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(170:4) {#if inputs.name != ''}",
    		ctx
    	});

    	return block;
    }

    // (238:32) {:else}
    function create_else_block_1(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Marketer";
    			attr_dev(button, "class", "btn btn-link");
    			add_location(button, file$f, 238, 34, 8583);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*viewMarketer*/ ctx[8](/*item*/ ctx[18].order_processed_by))) /*viewMarketer*/ ctx[8](/*item*/ ctx[18].order_processed_by).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(238:32) {:else}",
    		ctx
    	});

    	return block;
    }

    // (236:32) {#if item.status === 0}
    function create_if_block_8(ctx) {
    	let h6;

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			h6.textContent = "Not Assign";
    			add_location(h6, file$f, 236, 34, 8489);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(236:32) {#if item.status === 0}",
    		ctx
    	});

    	return block;
    }

    // (262:32) {:else}
    function create_else_block$2(ctx) {
    	let h6;

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			h6.textContent = "Mismached";
    			add_location(h6, file$f, 262, 34, 10199);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(262:32) {:else}",
    		ctx
    	});

    	return block;
    }

    // (260:60) 
    function create_if_block_7$1(ctx) {
    	let h6;

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			h6.textContent = "Completed";
    			attr_dev(h6, "class", "text-success");
    			add_location(h6, file$f, 260, 34, 10085);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7$1.name,
    		type: "if",
    		source: "(260:60) ",
    		ctx
    	});

    	return block;
    }

    // (258:60) 
    function create_if_block_6$2(ctx) {
    	let h6;

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			h6.textContent = "Second Pay";
    			attr_dev(h6, "class", "text-info");
    			add_location(h6, file$f, 258, 34, 9952);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$2.name,
    		type: "if",
    		source: "(258:60) ",
    		ctx
    	});

    	return block;
    }

    // (256:60) 
    function create_if_block_5$2(ctx) {
    	let h6;

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			h6.textContent = "Printing";
    			add_location(h6, file$f, 256, 34, 9838);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$2.name,
    		type: "if",
    		source: "(256:60) ",
    		ctx
    	});

    	return block;
    }

    // (254:60) 
    function create_if_block_4$2(ctx) {
    	let h6;

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			h6.textContent = "First Pay";
    			attr_dev(h6, "class", "text-info");
    			add_location(h6, file$f, 254, 34, 9706);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$2.name,
    		type: "if",
    		source: "(254:60) ",
    		ctx
    	});

    	return block;
    }

    // (252:60) 
    function create_if_block_3$2(ctx) {
    	let h6;

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			h6.textContent = "Confirmed";
    			attr_dev(h6, "class", "text-primary");
    			add_location(h6, file$f, 252, 34, 9571);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(252:60) ",
    		ctx
    	});

    	return block;
    }

    // (250:60) 
    function create_if_block_2$2(ctx) {
    	let h6;

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			h6.textContent = "Assigned";
    			add_location(h6, file$f, 250, 34, 9458);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(250:60) ",
    		ctx
    	});

    	return block;
    }

    // (248:32) {#if item.status === 0}
    function create_if_block_1$4(ctx) {
    	let h6;

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			h6.textContent = "Not Assign";
    			attr_dev(h6, "class", "text-warning");
    			add_location(h6, file$f, 248, 34, 9322);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(248:32) {#if item.status === 0}",
    		ctx
    	});

    	return block;
    }

    // (230:26) {#each myJobs as item}
    function create_each_block$b(ctx) {
    	let tr;
    	let td0;
    	let button0;
    	let t1;
    	let td1;
    	let t2;
    	let td2;
    	let button1;
    	let t4;
    	let td3;
    	let h60;
    	let t5_value = /*item*/ ctx[18].category + "";
    	let t5;
    	let t6;
    	let t7_value = /*item*/ ctx[18].subCategory + "";
    	let t7;
    	let t8;
    	let td4;
    	let h61;
    	let t9_value = /*item*/ ctx[18].shipping_address + "";
    	let t9;
    	let t10;
    	let td5;
    	let t11;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*item*/ ctx[18].status === 0) return create_if_block_8;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (/*item*/ ctx[18].status === 0) return create_if_block_1$4;
    		if (/*item*/ ctx[18].status === 1) return create_if_block_2$2;
    		if (/*item*/ ctx[18].status === 2) return create_if_block_3$2;
    		if (/*item*/ ctx[18].status === 3) return create_if_block_4$2;
    		if (/*item*/ ctx[18].status === 4) return create_if_block_5$2;
    		if (/*item*/ ctx[18].status === 5) return create_if_block_6$2;
    		if (/*item*/ ctx[18].status === 6) return create_if_block_7$1;
    		return create_else_block$2;
    	}

    	let current_block_type_1 = select_block_type_1(ctx);
    	let if_block1 = current_block_type_1(ctx);

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			button0 = element("button");
    			button0.textContent = "Product";
    			t1 = space();
    			td1 = element("td");
    			if_block0.c();
    			t2 = space();
    			td2 = element("td");
    			button1 = element("button");
    			button1.textContent = "View";
    			t4 = space();
    			td3 = element("td");
    			h60 = element("h6");
    			t5 = text(t5_value);
    			t6 = text(", ");
    			t7 = text(t7_value);
    			t8 = space();
    			td4 = element("td");
    			h61 = element("h6");
    			t9 = text(t9_value);
    			t10 = space();
    			td5 = element("td");
    			if_block1.c();
    			t11 = space();
    			attr_dev(button0, "class", "btn btn-link");
    			add_location(button0, file$f, 232, 32, 8224);
    			add_location(td0, file$f, 231, 30, 8187);
    			attr_dev(td1, "class", "text-center");
    			add_location(td1, file$f, 234, 30, 8374);
    			attr_dev(button1, "class", "btn btn-link");
    			add_location(button1, file$f, 242, 32, 8841);
    			attr_dev(td2, "class", "text-center");
    			add_location(td2, file$f, 241, 30, 8784);
    			add_location(h60, file$f, 244, 54, 9018);
    			attr_dev(td3, "class", "text-center");
    			add_location(td3, file$f, 244, 30, 8994);
    			add_location(h61, file$f, 245, 54, 9122);
    			attr_dev(td4, "class", "text-center");
    			add_location(td4, file$f, 245, 30, 9098);
    			attr_dev(td5, "class", "text-center d-block d-inline");
    			add_location(td5, file$f, 246, 30, 9190);
    			add_location(tr, file$f, 230, 28, 8152);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, button0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			if_block0.m(td1, null);
    			append_dev(tr, t2);
    			append_dev(tr, td2);
    			append_dev(td2, button1);
    			append_dev(tr, t4);
    			append_dev(tr, td3);
    			append_dev(td3, h60);
    			append_dev(h60, t5);
    			append_dev(h60, t6);
    			append_dev(h60, t7);
    			append_dev(tr, t8);
    			append_dev(tr, td4);
    			append_dev(td4, h61);
    			append_dev(h61, t9);
    			append_dev(tr, t10);
    			append_dev(tr, td5);
    			if_block1.m(td5, null);
    			append_dev(tr, t11);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						button0,
    						"click",
    						function () {
    							if (is_function(/*viewItem*/ ctx[6](/*item*/ ctx[18].product_id))) /*viewItem*/ ctx[6](/*item*/ ctx[18].product_id).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button1,
    						"click",
    						function () {
    							if (is_function(/*viewDetails*/ ctx[7](/*item*/ ctx[18].order_details))) /*viewDetails*/ ctx[7](/*item*/ ctx[18].order_details).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(td1, null);
    				}
    			}

    			if (dirty & /*myJobs*/ 4 && t5_value !== (t5_value = /*item*/ ctx[18].category + "")) set_data_dev(t5, t5_value);
    			if (dirty & /*myJobs*/ 4 && t7_value !== (t7_value = /*item*/ ctx[18].subCategory + "")) set_data_dev(t7, t7_value);
    			if (dirty & /*myJobs*/ 4 && t9_value !== (t9_value = /*item*/ ctx[18].shipping_address + "")) set_data_dev(t9, t9_value);

    			if (current_block_type_1 !== (current_block_type_1 = select_block_type_1(ctx))) {
    				if_block1.d(1);
    				if_block1 = current_block_type_1(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(td5, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if_block0.d();
    			if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$b.name,
    		type: "each",
    		source: "(230:26) {#each myJobs as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let main;
    	let div;
    	let if_block = /*inputs*/ ctx[1].name != '' && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "row justify-content-center");
    			add_location(div, file$f, 168, 2, 4517);
    			add_location(main, file$f, 167, 0, 4508);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*inputs*/ ctx[1].name != '') {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UserView', slots, []);
    	let { id } = $$props;
    	let message = { msg: "", style: "" };

    	let inputs = {
    		name: '',
    		phone: '',
    		email: '',
    		password: '',
    		basePrice: '',
    		deliveryPrice: '',
    		address: '',
    		active: false
    	};

    	let myJobs = [];

    	onMount(async () => {
    		await fetch(`${API_URL}/admin/distributer/read/${id}`, { method: 'POST' }).then(response => response.json()).then(datas => {
    			$$invalidate(1, inputs = datas.data);
    		});

    		let bodyData = { _id: id };

    		const res = await fetch(`${API_URL}/distributer/my_orders`, {
    			method: 'post',
    			body: JSON.stringify(bodyData),
    			headers: { 'Content-Type': 'application/json' }
    		});

    		const json = await res.json();
    		$$invalidate(2, myJobs = json.data);
    	});

    	const updateHandle = async () => {
    		let validate = distributerValid(inputs);

    		if (validate.valid == true) {
    			$$invalidate(0, message.style = 'text-info', message);
    			$$invalidate(0, message.msg = validate.error, message);

    			try {
    				$$invalidate(0, message.msg = "Loading..", message);

    				const res = await fetch(`${API_URL}/admin/distributer/update`, {
    					method: 'post',
    					body: JSON.stringify(inputs),
    					headers: { 'Content-Type': 'application/json' }
    				});

    				const json = await res.json();
    				$$invalidate(0, message.style = 'text-info', message);
    				$$invalidate(0, message.msg = json.message, message);

    				if (json.status === true) {
    					$$invalidate(1, inputs.image = "", inputs);
    				}
    			} catch(error) {
    				$$invalidate(0, message.style = 'text-warning', message);
    				$$invalidate(0, message.msg = "Network error !!", message);
    			}
    		} else {
    			$$invalidate(0, message.style = 'text-danger', message);
    			$$invalidate(0, message.msg = validate.error, message);
    		}
    	};

    	const deleteConfirm = async () => {
    		sweetalert2_all.fire({
    			title: 'Are you sure?',
    			text: "Delete  " + inputs.name,
    			showCancelButton: true,
    			confirmButtonColor: '#3085d6',
    			cancelButtonColor: '#d33',
    			confirmButtonText: 'Yes, delete it!'
    		}).then(result => {
    			if (result.isConfirmed) {
    				deleteHandle();
    			}
    		});
    	};

    	const deleteHandle = async () => {
    		try {
    			let bodyIn = { _id: id };

    			const res = await fetch(`${API_URL}/admin/distributer/delete`, {
    				method: 'post',
    				body: JSON.stringify(bodyIn),
    				headers: { 'Content-Type': 'application/json' }
    			});

    			const json = await res.json();

    			if (json.status === true) {
    				navigate('/admin/user_view');
    			}
    		} catch(error) {
    			$$invalidate(0, message.style = 'text-warning', message);
    			$$invalidate(0, message.msg = "Network error !!", message);
    		}
    	};

    	const chekboxx = e => {
    		const checked = e.target.checked;
    		$$invalidate(1, inputs.active = checked, inputs);
    	};

    	const viewItem = async e => {
    		await fetch(`${API_URL}/products/list/${e}`, { method: "POST" }).then(response => response.json()).then(datas => {
    			sweetalert2_all.fire({
    				title: datas.data.title,
    				text: datas.data.category + ", " + datas.data.subCategory,
    				imageUrl: datas.data.image,
    				imageWidth: 100,
    				imageHeight: 200,
    				imageAlt: "Custom image"
    			});
    		});
    	};

    	const viewDetails = e => {
    		sweetalert2_all.fire({
    			title: "Order Details",
    			html: "<div><tr><b>Width : </b><i>" + e.width + "</i></tr></br><tr><b>Height : </b><i>" + e.height + "</i></tr></br><tr><b>ArcTop : </b><i>" + e.arcTop + "</i></tr></br><tr><b>ArcBottom : </b><i>" + e.arcBottom + "</i></tr></br><tr><b>Sandwich : </b><i>" + e.sandwich + "</i></tr></br><tr><b>Varnish : </b><i>" + e.varnish + "</i></tr></br><tr><b>WhiteCoat : </b><i>" + e.whiteCoat + "</i></tr></br><tr><b>Message : </b><i>" + e.message + "</i></tr></div>"
    		});
    	};

    	const viewMarketer = async e => {
    		await fetch(`${API_URL}/admin/marketeer/read/${e}`, { method: "POST" }).then(response => response.json()).then(datas => {
    			sweetalert2_all.fire({
    				title: "Distributer Details",
    				html: "<div><tr><b>Name : </b><i>" + datas.data.name + "</i></tr></br><tr><b>Phone : </b><i>" + datas.data.phone + "</i></tr></br><tr><b>E mail : </b><i>" + datas.data.email + "</i></tr></br><tr><b>Status : </b><i>" + datas.data.active + "</i></tr></br></div>"
    			});
    		});
    	};

    	const writable_props = ['id'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UserView> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		inputs.name = this.value;
    		$$invalidate(1, inputs);
    	}

    	function input1_input_handler() {
    		inputs.email = this.value;
    		$$invalidate(1, inputs);
    	}

    	function input2_input_handler() {
    		inputs.phone = this.value;
    		$$invalidate(1, inputs);
    	}

    	function input3_input_handler() {
    		inputs.password = this.value;
    		$$invalidate(1, inputs);
    	}

    	function input4_input_handler() {
    		inputs.basePrice = this.value;
    		$$invalidate(1, inputs);
    	}

    	function input5_input_handler() {
    		inputs.deliveryPrice = this.value;
    		$$invalidate(1, inputs);
    	}

    	function input6_input_handler() {
    		inputs.address = this.value;
    		$$invalidate(1, inputs);
    	}

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(9, id = $$props.id);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		navigate,
    		Swal: sweetalert2_all,
    		API_URL,
    		distributerValid,
    		id,
    		message,
    		inputs,
    		myJobs,
    		updateHandle,
    		deleteConfirm,
    		deleteHandle,
    		chekboxx,
    		viewItem,
    		viewDetails,
    		viewMarketer
    	});

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(9, id = $$props.id);
    		if ('message' in $$props) $$invalidate(0, message = $$props.message);
    		if ('inputs' in $$props) $$invalidate(1, inputs = $$props.inputs);
    		if ('myJobs' in $$props) $$invalidate(2, myJobs = $$props.myJobs);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		message,
    		inputs,
    		myJobs,
    		updateHandle,
    		deleteConfirm,
    		chekboxx,
    		viewItem,
    		viewDetails,
    		viewMarketer,
    		id,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		input5_input_handler,
    		input6_input_handler
    	];
    }

    class UserView$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { id: 9 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UserView",
    			options,
    			id: create_fragment$f.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*id*/ ctx[9] === undefined && !('id' in props)) {
    			console.warn("<UserView> was created without expected prop 'id'");
    		}
    	}

    	get id() {
    		throw new Error("<UserView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<UserView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/pages/superAdmin/adminLander.svelte generated by Svelte v3.44.1 */
    const file$e = "src/pages/superAdmin/adminLander.svelte";

    // (46:12) {#if isSuper == true}
    function create_if_block$5(ctx) {
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				basepath: "admin/",
    				primary: false,
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const router_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(46:12) {#if isSuper == true}",
    		ctx
    	});

    	return block;
    }

    // (56:54) <Link to=" " class='nav-link active'>
    function create_default_slot_11(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text("New Orders");
    			attr_dev(i, "class", "fa fa-desktop fa-lg text-primary m-2 svelte-1e1sd63");
    			add_location(i, file$e, 55, 91, 2254);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(56:54) <Link to=\\\" \\\" class='nav-link active'>",
    		ctx
    	});

    	return block;
    }

    // (57:54) <Link to="orders" class='nav-link'>
    function create_default_slot_10$1(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text("Progress");
    			attr_dev(i, "class", "fa fa-tasks fa-lg text-success m-2 svelte-1e1sd63");
    			add_location(i, file$e, 56, 89, 2419);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10$1.name,
    		type: "slot",
    		source: "(57:54) <Link to=\\\"orders\\\" class='nav-link'>",
    		ctx
    	});

    	return block;
    }

    // (58:54) <Link to="completed" class='nav-link'>
    function create_default_slot_9$1(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text("Completed");
    			attr_dev(i, "class", "fa fa-list fa-lg text-secondary m-2 svelte-1e1sd63");
    			add_location(i, file$e, 57, 92, 2583);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9$1.name,
    		type: "slot",
    		source: "(58:54) <Link to=\\\"completed\\\" class='nav-link'>",
    		ctx
    	});

    	return block;
    }

    // (62:58) <Link to="category" class='nav-link'>
    function create_default_slot_8$1(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text("Category");
    			attr_dev(i, "class", "fa fa-puzzle-piece fa-lg text-info m-2 svelte-1e1sd63");
    			add_location(i, file$e, 61, 95, 2988);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$1.name,
    		type: "slot",
    		source: "(62:58) <Link to=\\\"category\\\" class='nav-link'>",
    		ctx
    	});

    	return block;
    }

    // (63:58) <Link to="product" class='nav-link'>
    function create_default_slot_7$1(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text("Product");
    			attr_dev(i, "class", "fa fa-plus fa-lg text-success m-2 svelte-1e1sd63");
    			add_location(i, file$e, 62, 94, 3158);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$1.name,
    		type: "slot",
    		source: "(63:58) <Link to=\\\"product\\\" class='nav-link'>",
    		ctx
    	});

    	return block;
    }

    // (64:58) <Link to="produt_view" class='nav-link'>
    function create_default_slot_6$1(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text("View All");
    			attr_dev(i, "class", "fa fa-cog fa-lg text-secondary m-2 svelte-1e1sd63");
    			add_location(i, file$e, 63, 98, 3326);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$1.name,
    		type: "slot",
    		source: "(64:58) <Link to=\\\"produt_view\\\" class='nav-link'>",
    		ctx
    	});

    	return block;
    }

    // (65:58) <Link to="produt_search" class='nav-link'>
    function create_default_slot_5$1(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text("Search");
    			attr_dev(i, "class", "fa fa-search fa-lg text-primary m-2 svelte-1e1sd63");
    			add_location(i, file$e, 64, 100, 3498);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$1.name,
    		type: "slot",
    		source: "(65:58) <Link to=\\\"produt_search\\\" class='nav-link'>",
    		ctx
    	});

    	return block;
    }

    // (70:58) <Link to="client" class='nav-link'>
    function create_default_slot_4$1(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text("Create");
    			attr_dev(i, "class", "fa fa-user-plus fa-lg text-success m-2 svelte-1e1sd63");
    			add_location(i, file$e, 69, 93, 3943);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(70:58) <Link to=\\\"client\\\" class='nav-link'>",
    		ctx
    	});

    	return block;
    }

    // (71:58) <Link to="client_view" class='nav-link'>
    function create_default_slot_3$1(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text("View All");
    			attr_dev(i, "class", "fa fa-users fa-lg text-primary m-2 svelte-1e1sd63");
    			add_location(i, file$e, 70, 98, 4115);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(71:58) <Link to=\\\"client_view\\\" class='nav-link'>",
    		ctx
    	});

    	return block;
    }

    // (76:58) <Link to="user" class='nav-link'>
    function create_default_slot_2$1(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text("Create");
    			attr_dev(i, "class", "fa fa-user-plus fa-lg text-success m-2 svelte-1e1sd63");
    			add_location(i, file$e, 75, 91, 4550);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(76:58) <Link to=\\\"user\\\" class='nav-link'>",
    		ctx
    	});

    	return block;
    }

    // (77:58) <Link to="user_view" class='nav-link'>
    function create_default_slot_1$1(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text("View All");
    			attr_dev(i, "class", "fa fa-users fa-lg text-primary m-2 svelte-1e1sd63");
    			add_location(i, file$e, 76, 96, 4720);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(77:58) <Link to=\\\"user_view\\\" class='nav-link'>",
    		ctx
    	});

    	return block;
    }

    // (47:12) <Router basepath='admin/' primary={false}>
    function create_default_slot$2(ctx) {
    	let div18;
    	let div17;
    	let div16;
    	let div15;
    	let nav;
    	let div0;
    	let t0;
    	let p0;
    	let t2;
    	let div1;
    	let link0;
    	let t3;
    	let div2;
    	let link1;
    	let t4;
    	let div3;
    	let link2;
    	let t5;
    	let a0;
    	let t6;
    	let span0;
    	let t7;
    	let div8;
    	let div4;
    	let link3;
    	let t8;
    	let div5;
    	let link4;
    	let t9;
    	let div6;
    	let link5;
    	let t10;
    	let div7;
    	let link6;
    	let t11;
    	let a1;
    	let t12;
    	let span1;
    	let t13;
    	let div11;
    	let div9;
    	let link7;
    	let t14;
    	let div10;
    	let link8;
    	let t15;
    	let a2;
    	let t16;
    	let span2;
    	let t17;
    	let div14;
    	let div12;
    	let link9;
    	let t18;
    	let div13;
    	let link10;
    	let t19;
    	let p1;
    	let t20;
    	let button;
    	let i;
    	let t21;
    	let t22;
    	let div20;
    	let div19;
    	let route0;
    	let t23;
    	let route1;
    	let t24;
    	let route2;
    	let t25;
    	let route3;
    	let t26;
    	let route4;
    	let t27;
    	let route5;
    	let t28;
    	let route6;
    	let t29;
    	let route7;
    	let t30;
    	let route8;
    	let t31;
    	let route9;
    	let t32;
    	let route10;
    	let t33;
    	let route11;
    	let t34;
    	let route12;
    	let t35;
    	let route13;
    	let t36;
    	let route14;
    	let current;
    	let mounted;
    	let dispose;

    	link0 = new Link$1({
    			props: {
    				to: " ",
    				class: "nav-link active",
    				$$slots: { default: [create_default_slot_11] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link$1({
    			props: {
    				to: "orders",
    				class: "nav-link",
    				$$slots: { default: [create_default_slot_10$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link2 = new Link$1({
    			props: {
    				to: "completed",
    				class: "nav-link",
    				$$slots: { default: [create_default_slot_9$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link3 = new Link$1({
    			props: {
    				to: "category",
    				class: "nav-link",
    				$$slots: { default: [create_default_slot_8$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link4 = new Link$1({
    			props: {
    				to: "product",
    				class: "nav-link",
    				$$slots: { default: [create_default_slot_7$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link5 = new Link$1({
    			props: {
    				to: "produt_view",
    				class: "nav-link",
    				$$slots: { default: [create_default_slot_6$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link6 = new Link$1({
    			props: {
    				to: "produt_search",
    				class: "nav-link",
    				$$slots: { default: [create_default_slot_5$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link7 = new Link$1({
    			props: {
    				to: "client",
    				class: "nav-link",
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link8 = new Link$1({
    			props: {
    				to: "client_view",
    				class: "nav-link",
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link9 = new Link$1({
    			props: {
    				to: "user",
    				class: "nav-link",
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link10 = new Link$1({
    			props: {
    				to: "user_view",
    				class: "nav-link",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route0 = new Route$1({
    			props: { path: "/", component: NewOrders },
    			$$inline: true
    		});

    	route1 = new Route$1({
    			props: { path: "/completed", component: Confirmed$1 },
    			$$inline: true
    		});

    	route2 = new Route$1({
    			props: { path: "/orders", component: OrderLander },
    			$$inline: true
    		});

    	route3 = new Route$1({
    			props: {
    				path: "/orders/:id",
    				component: OrderView
    			},
    			$$inline: true
    		});

    	route4 = new Route$1({
    			props: { path: "/category", component: Category },
    			$$inline: true
    		});

    	route5 = new Route$1({
    			props: { path: "/product", component: ProductAdd },
    			$$inline: true
    		});

    	route6 = new Route$1({
    			props: {
    				path: "/produt_view",
    				component: Products$1
    			},
    			$$inline: true
    		});

    	route7 = new Route$1({
    			props: {
    				path: "/produt_view/:id",
    				component: ProductView
    			},
    			$$inline: true
    		});

    	route8 = new Route$1({
    			props: {
    				path: "/produt_search",
    				component: Search$1
    			},
    			$$inline: true
    		});

    	route9 = new Route$1({
    			props: { path: "/client", component: ClientCreate },
    			$$inline: true
    		});

    	route10 = new Route$1({
    			props: { path: "/client_view", component: Clients },
    			$$inline: true
    		});

    	route11 = new Route$1({
    			props: {
    				path: "/client_view/:id",
    				component: ClientView
    			},
    			$$inline: true
    		});

    	route12 = new Route$1({
    			props: { path: "/user", component: UserCreate },
    			$$inline: true
    		});

    	route13 = new Route$1({
    			props: { path: "/user_view", component: Users$1 },
    			$$inline: true
    		});

    	route14 = new Route$1({
    			props: {
    				path: "/user_view/:id",
    				component: UserView$1
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div18 = element("div");
    			div17 = element("div");
    			div16 = element("div");
    			div15 = element("div");
    			nav = element("nav");
    			div0 = element("div");
    			t0 = space();
    			p0 = element("p");
    			p0.textContent = "Manage Orders";
    			t2 = space();
    			div1 = element("div");
    			create_component(link0.$$.fragment);
    			t3 = space();
    			div2 = element("div");
    			create_component(link1.$$.fragment);
    			t4 = space();
    			div3 = element("div");
    			create_component(link2.$$.fragment);
    			t5 = space();
    			a0 = element("a");
    			t6 = text("Product ");
    			span0 = element("span");
    			t7 = space();
    			div8 = element("div");
    			div4 = element("div");
    			create_component(link3.$$.fragment);
    			t8 = space();
    			div5 = element("div");
    			create_component(link4.$$.fragment);
    			t9 = space();
    			div6 = element("div");
    			create_component(link5.$$.fragment);
    			t10 = space();
    			div7 = element("div");
    			create_component(link6.$$.fragment);
    			t11 = space();
    			a1 = element("a");
    			t12 = text("Marketer");
    			span1 = element("span");
    			t13 = space();
    			div11 = element("div");
    			div9 = element("div");
    			create_component(link7.$$.fragment);
    			t14 = space();
    			div10 = element("div");
    			create_component(link8.$$.fragment);
    			t15 = space();
    			a2 = element("a");
    			t16 = text("Distributor");
    			span2 = element("span");
    			t17 = space();
    			div14 = element("div");
    			div12 = element("div");
    			create_component(link9.$$.fragment);
    			t18 = space();
    			div13 = element("div");
    			create_component(link10.$$.fragment);
    			t19 = space();
    			p1 = element("p");
    			t20 = space();
    			button = element("button");
    			i = element("i");
    			t21 = text(" Logout");
    			t22 = space();
    			div20 = element("div");
    			div19 = element("div");
    			create_component(route0.$$.fragment);
    			t23 = space();
    			create_component(route1.$$.fragment);
    			t24 = space();
    			create_component(route2.$$.fragment);
    			t25 = space();
    			create_component(route3.$$.fragment);
    			t26 = space();
    			create_component(route4.$$.fragment);
    			t27 = space();
    			create_component(route5.$$.fragment);
    			t28 = space();
    			create_component(route6.$$.fragment);
    			t29 = space();
    			create_component(route7.$$.fragment);
    			t30 = space();
    			create_component(route8.$$.fragment);
    			t31 = space();
    			create_component(route9.$$.fragment);
    			t32 = space();
    			create_component(route10.$$.fragment);
    			t33 = space();
    			create_component(route11.$$.fragment);
    			t34 = space();
    			create_component(route12.$$.fragment);
    			t35 = space();
    			create_component(route13.$$.fragment);
    			t36 = space();
    			create_component(route14.$$.fragment);
    			attr_dev(div0, "class", "m-3");
    			add_location(div0, file$e, 53, 36, 2060);
    			attr_dev(p0, "disabled", "");
    			attr_dev(p0, "class", "head svelte-1e1sd63");
    			add_location(p0, file$e, 54, 36, 2120);
    			attr_dev(div1, "class", "pill svelte-1e1sd63");
    			add_location(div1, file$e, 55, 36, 2199);
    			attr_dev(div2, "class", "pill svelte-1e1sd63");
    			add_location(div2, file$e, 56, 36, 2366);
    			attr_dev(div3, "class", "pill svelte-1e1sd63");
    			add_location(div3, file$e, 57, 36, 2527);
    			attr_dev(span0, "class", "fa fa-caret-right ml-2 svelte-1e1sd63");
    			add_location(span0, file$e, 59, 100, 2770);
    			attr_dev(a0, "class", "head svelte-1e1sd63");
    			attr_dev(a0, "href", "#sub-menu");
    			attr_dev(a0, "data-toggle", "collapse");
    			add_location(a0, file$e, 59, 36, 2706);
    			attr_dev(div4, "class", "pill svelte-1e1sd63");
    			add_location(div4, file$e, 61, 40, 2933);
    			attr_dev(div5, "class", "pill svelte-1e1sd63");
    			add_location(div5, file$e, 62, 40, 3104);
    			attr_dev(div6, "class", "pill svelte-1e1sd63");
    			add_location(div6, file$e, 63, 40, 3268);
    			attr_dev(div7, "class", "pill svelte-1e1sd63");
    			add_location(div7, file$e, 64, 40, 3438);
    			attr_dev(div8, "class", "collapse ");
    			attr_dev(div8, "id", "sub-menu");
    			add_location(div8, file$e, 60, 36, 2855);
    			attr_dev(span1, "class", "fa fa-caret-right ml-2 svelte-1e1sd63");
    			add_location(span1, file$e, 67, 101, 3726);
    			attr_dev(a1, "class", "head svelte-1e1sd63");
    			attr_dev(a1, "href", "#sub-menu2");
    			attr_dev(a1, "data-toggle", "collapse");
    			add_location(a1, file$e, 67, 36, 3661);
    			attr_dev(div9, "class", "pill svelte-1e1sd63");
    			add_location(div9, file$e, 69, 40, 3890);
    			attr_dev(div10, "class", "pill svelte-1e1sd63");
    			add_location(div10, file$e, 70, 40, 4057);
    			attr_dev(div11, "class", "collapse ");
    			attr_dev(div11, "id", "sub-menu2");
    			add_location(div11, file$e, 68, 36, 3811);
    			attr_dev(span2, "class", "fa fa-caret-right ml-2 svelte-1e1sd63");
    			add_location(span2, file$e, 73, 104, 4335);
    			attr_dev(a2, "class", "head svelte-1e1sd63");
    			attr_dev(a2, "href", "#sub-menu3");
    			attr_dev(a2, "data-toggle", "collapse");
    			add_location(a2, file$e, 73, 36, 4267);
    			attr_dev(div12, "class", "pill svelte-1e1sd63");
    			add_location(div12, file$e, 75, 40, 4499);
    			attr_dev(div13, "class", "pill svelte-1e1sd63");
    			add_location(div13, file$e, 76, 40, 4664);
    			attr_dev(div14, "class", "collapse ");
    			attr_dev(div14, "id", "sub-menu3");
    			add_location(div14, file$e, 74, 36, 4420);
    			attr_dev(p1, "disabled", "");
    			attr_dev(p1, "class", "");
    			add_location(p1, file$e, 79, 36, 4884);
    			attr_dev(i, "class", "fa fa-sign-out fa-lg text-danger");
    			add_location(i, file$e, 81, 80, 5160);
    			attr_dev(button, "class", "btn svelte-1e1sd63");
    			add_location(button, file$e, 81, 36, 5116);
    			attr_dev(nav, "class", "m-auto flex-column nav nav-sidebar svelte-1e1sd63");
    			attr_dev(nav, "role", "tablist");
    			attr_dev(nav, "activekey", window.location.pathname);
    			add_location(nav, file$e, 52, 32, 1923);
    			attr_dev(div15, "id", "navbarToggler");
    			add_location(div15, file$e, 51, 28, 1865);
    			attr_dev(div16, "expand", "lg");
    			attr_dev(div16, "class", "border-bottom ");
    			add_location(div16, file$e, 50, 20, 1796);
    			attr_dev(div17, "id", "sidebar");
    			attr_dev(div17, "class", "shadow col-sm-3 svelte-1e1sd63");
    			add_location(div17, file$e, 49, 16, 1733);
    			add_location(div18, file$e, 47, 12, 1666);
    			add_location(div19, file$e, 89, 17, 5508);
    			attr_dev(div20, "class", "tab-content p-2 col col-offset-sm-3 svelte-1e1sd63");
    			add_location(div20, file$e, 88, 16, 5441);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div18, anchor);
    			append_dev(div18, div17);
    			append_dev(div17, div16);
    			append_dev(div16, div15);
    			append_dev(div15, nav);
    			append_dev(nav, div0);
    			append_dev(nav, t0);
    			append_dev(nav, p0);
    			append_dev(nav, t2);
    			append_dev(nav, div1);
    			mount_component(link0, div1, null);
    			append_dev(nav, t3);
    			append_dev(nav, div2);
    			mount_component(link1, div2, null);
    			append_dev(nav, t4);
    			append_dev(nav, div3);
    			mount_component(link2, div3, null);
    			append_dev(nav, t5);
    			append_dev(nav, a0);
    			append_dev(a0, t6);
    			append_dev(a0, span0);
    			append_dev(nav, t7);
    			append_dev(nav, div8);
    			append_dev(div8, div4);
    			mount_component(link3, div4, null);
    			append_dev(div8, t8);
    			append_dev(div8, div5);
    			mount_component(link4, div5, null);
    			append_dev(div8, t9);
    			append_dev(div8, div6);
    			mount_component(link5, div6, null);
    			append_dev(div8, t10);
    			append_dev(div8, div7);
    			mount_component(link6, div7, null);
    			append_dev(nav, t11);
    			append_dev(nav, a1);
    			append_dev(a1, t12);
    			append_dev(a1, span1);
    			append_dev(nav, t13);
    			append_dev(nav, div11);
    			append_dev(div11, div9);
    			mount_component(link7, div9, null);
    			append_dev(div11, t14);
    			append_dev(div11, div10);
    			mount_component(link8, div10, null);
    			append_dev(nav, t15);
    			append_dev(nav, a2);
    			append_dev(a2, t16);
    			append_dev(a2, span2);
    			append_dev(nav, t17);
    			append_dev(nav, div14);
    			append_dev(div14, div12);
    			mount_component(link9, div12, null);
    			append_dev(div14, t18);
    			append_dev(div14, div13);
    			mount_component(link10, div13, null);
    			append_dev(nav, t19);
    			append_dev(nav, p1);
    			append_dev(nav, t20);
    			append_dev(nav, button);
    			append_dev(button, i);
    			append_dev(button, t21);
    			insert_dev(target, t22, anchor);
    			insert_dev(target, div20, anchor);
    			append_dev(div20, div19);
    			mount_component(route0, div19, null);
    			append_dev(div19, t23);
    			mount_component(route1, div19, null);
    			append_dev(div19, t24);
    			mount_component(route2, div19, null);
    			append_dev(div19, t25);
    			mount_component(route3, div19, null);
    			append_dev(div19, t26);
    			mount_component(route4, div19, null);
    			append_dev(div19, t27);
    			mount_component(route5, div19, null);
    			append_dev(div19, t28);
    			mount_component(route6, div19, null);
    			append_dev(div19, t29);
    			mount_component(route7, div19, null);
    			append_dev(div19, t30);
    			mount_component(route8, div19, null);
    			append_dev(div19, t31);
    			mount_component(route9, div19, null);
    			append_dev(div19, t32);
    			mount_component(route10, div19, null);
    			append_dev(div19, t33);
    			mount_component(route11, div19, null);
    			append_dev(div19, t34);
    			mount_component(route12, div19, null);
    			append_dev(div19, t35);
    			mount_component(route13, div19, null);
    			append_dev(div19, t36);
    			mount_component(route14, div19, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*logouthandle*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    			const link2_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				link2_changes.$$scope = { dirty, ctx };
    			}

    			link2.$set(link2_changes);
    			const link3_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				link3_changes.$$scope = { dirty, ctx };
    			}

    			link3.$set(link3_changes);
    			const link4_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				link4_changes.$$scope = { dirty, ctx };
    			}

    			link4.$set(link4_changes);
    			const link5_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				link5_changes.$$scope = { dirty, ctx };
    			}

    			link5.$set(link5_changes);
    			const link6_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				link6_changes.$$scope = { dirty, ctx };
    			}

    			link6.$set(link6_changes);
    			const link7_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				link7_changes.$$scope = { dirty, ctx };
    			}

    			link7.$set(link7_changes);
    			const link8_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				link8_changes.$$scope = { dirty, ctx };
    			}

    			link8.$set(link8_changes);
    			const link9_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				link9_changes.$$scope = { dirty, ctx };
    			}

    			link9.$set(link9_changes);
    			const link10_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				link10_changes.$$scope = { dirty, ctx };
    			}

    			link10.$set(link10_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			transition_in(link2.$$.fragment, local);
    			transition_in(link3.$$.fragment, local);
    			transition_in(link4.$$.fragment, local);
    			transition_in(link5.$$.fragment, local);
    			transition_in(link6.$$.fragment, local);
    			transition_in(link7.$$.fragment, local);
    			transition_in(link8.$$.fragment, local);
    			transition_in(link9.$$.fragment, local);
    			transition_in(link10.$$.fragment, local);
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			transition_in(route3.$$.fragment, local);
    			transition_in(route4.$$.fragment, local);
    			transition_in(route5.$$.fragment, local);
    			transition_in(route6.$$.fragment, local);
    			transition_in(route7.$$.fragment, local);
    			transition_in(route8.$$.fragment, local);
    			transition_in(route9.$$.fragment, local);
    			transition_in(route10.$$.fragment, local);
    			transition_in(route11.$$.fragment, local);
    			transition_in(route12.$$.fragment, local);
    			transition_in(route13.$$.fragment, local);
    			transition_in(route14.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			transition_out(link2.$$.fragment, local);
    			transition_out(link3.$$.fragment, local);
    			transition_out(link4.$$.fragment, local);
    			transition_out(link5.$$.fragment, local);
    			transition_out(link6.$$.fragment, local);
    			transition_out(link7.$$.fragment, local);
    			transition_out(link8.$$.fragment, local);
    			transition_out(link9.$$.fragment, local);
    			transition_out(link10.$$.fragment, local);
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			transition_out(route3.$$.fragment, local);
    			transition_out(route4.$$.fragment, local);
    			transition_out(route5.$$.fragment, local);
    			transition_out(route6.$$.fragment, local);
    			transition_out(route7.$$.fragment, local);
    			transition_out(route8.$$.fragment, local);
    			transition_out(route9.$$.fragment, local);
    			transition_out(route10.$$.fragment, local);
    			transition_out(route11.$$.fragment, local);
    			transition_out(route12.$$.fragment, local);
    			transition_out(route13.$$.fragment, local);
    			transition_out(route14.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div18);
    			destroy_component(link0);
    			destroy_component(link1);
    			destroy_component(link2);
    			destroy_component(link3);
    			destroy_component(link4);
    			destroy_component(link5);
    			destroy_component(link6);
    			destroy_component(link7);
    			destroy_component(link8);
    			destroy_component(link9);
    			destroy_component(link10);
    			if (detaching) detach_dev(t22);
    			if (detaching) detach_dev(div20);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(route2);
    			destroy_component(route3);
    			destroy_component(route4);
    			destroy_component(route5);
    			destroy_component(route6);
    			destroy_component(route7);
    			destroy_component(route8);
    			destroy_component(route9);
    			destroy_component(route10);
    			destroy_component(route11);
    			destroy_component(route12);
    			destroy_component(route13);
    			destroy_component(route14);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(47:12) <Router basepath='admin/' primary={false}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let main;
    	let navbar;
    	let t;
    	let div;
    	let current;
    	navbar = new AdminNav({ $$inline: true });
    	let if_block = /*isSuper*/ ctx[0] == true && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(navbar.$$.fragment);
    			t = space();
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "row container-flex justify-content-center m-auto");
    			add_location(div, file$e, 44, 8, 1502);
    			add_location(main, file$e, 42, 0, 1473);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(navbar, main, null);
    			append_dev(main, t);
    			append_dev(main, div);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isSuper*/ ctx[0] == true) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isSuper*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(navbar);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AdminLander', slots, []);
    	let isSuper = false;
    	const userDetail = JSON.parse(localStorage.getItem('admin_details'));

    	onMount(() => {
    		if (userDetail == null || userDetail == 'null') {
    			navigate('/');
    		} else if (userDetail.type == 'superAdmin') {
    			$$invalidate(0, isSuper = true);
    		} else if (userDetail.type == 'marketer') {
    			$$invalidate(0, isSuper = false);
    		}
    	});

    	function logouthandle() {
    		localStorage.removeItem('admin_details');
    		navigate('/');
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AdminLander> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Router: Router$1,
    		Route: Route$1,
    		Link: Link$1,
    		navigate,
    		NavBar: AdminNav,
    		Product: ProductAdd,
    		ProductList: Products$1,
    		ProductView,
    		Category,
    		Client: ClientCreate,
    		Clients,
    		ClientView,
    		OrderList: OrderLander,
    		NewOrders,
    		Completed: Confirmed$1,
    		ProdSearch: Search$1,
    		OrderView,
    		User: UserCreate,
    		Users: Users$1,
    		UserView: UserView$1,
    		isSuper,
    		userDetail,
    		logouthandle
    	});

    	$$self.$inject_state = $$props => {
    		if ('isSuper' in $$props) $$invalidate(0, isSuper = $$props.isSuper);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isSuper, logouthandle];
    }

    class AdminLander extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AdminLander",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src/component/navBar.svelte generated by Svelte v3.44.1 */
    const file$d = "src/component/navBar.svelte";

    function create_fragment$d(ctx) {
    	let main;
    	let nav;
    	let a0;
    	let img;
    	let img_src_value;
    	let t0;
    	let button0;
    	let span;
    	let t1;
    	let div3;
    	let li0;
    	let div0;
    	let t3;
    	let div2;
    	let a1;
    	let i0;
    	let t4;
    	let t5;
    	let a2;
    	let i1;
    	let t6;
    	let t7;
    	let a3;
    	let i2;
    	let t8;
    	let t9;
    	let a4;
    	let i3;
    	let t10;
    	let t11;
    	let div1;
    	let t12;
    	let a5;
    	let i4;
    	let t13;
    	let t14;
    	let li1;
    	let button1;
    	let i5;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			main = element("main");
    			nav = element("nav");
    			a0 = element("a");
    			img = element("img");
    			t0 = space();
    			button0 = element("button");
    			span = element("span");
    			t1 = space();
    			div3 = element("div");
    			li0 = element("li");
    			div0 = element("div");
    			div0.textContent = "Profile";
    			t3 = space();
    			div2 = element("div");
    			a1 = element("a");
    			i0 = element("i");
    			t4 = text("Orders");
    			t5 = space();
    			a2 = element("a");
    			i1 = element("i");
    			t6 = text("Confirmed");
    			t7 = space();
    			a3 = element("a");
    			i2 = element("i");
    			t8 = text("Completed");
    			t9 = space();
    			a4 = element("a");
    			i3 = element("i");
    			t10 = text("Products");
    			t11 = space();
    			div1 = element("div");
    			t12 = space();
    			a5 = element("a");
    			i4 = element("i");
    			t13 = text("Settings");
    			t14 = space();
    			li1 = element("li");
    			button1 = element("button");
    			i5 = element("i");
    			attr_dev(img, "alt", "logo");
    			if (!src_url_equal(img.src, img_src_value = "/assert/artLogo.PNG")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-1cakmch");
    			add_location(img, file$d, 10, 41, 262);
    			attr_dev(a0, "class", "navbar-brand svelte-1cakmch");
    			attr_dev(a0, "href", "/");
    			add_location(a0, file$d, 10, 8, 229);
    			attr_dev(span, "class", "navbar-toggler-icon");
    			add_location(span, file$d, 12, 10, 521);
    			attr_dev(button0, "class", "navbar-toggler");
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "data-toggle", "collapse");
    			attr_dev(button0, "data-target", "#navbarTogglerDemo01");
    			attr_dev(button0, "aria-controls", "navbarTogglerDemo01");
    			attr_dev(button0, "aria-expanded", "false");
    			attr_dev(button0, "aria-label", "Toggle navigation");
    			add_location(button0, file$d, 11, 8, 318);
    			attr_dev(div0, "class", "btn nav-item dropdown-toggle svelte-1cakmch");
    			attr_dev(div0, "type", "button");
    			attr_dev(div0, "id", "dropdownMenuButton");
    			attr_dev(div0, "data-toggle", "dropdown");
    			attr_dev(div0, "aria-haspopup", "true");
    			attr_dev(div0, "aria-expanded", "false");
    			add_location(div0, file$d, 16, 14, 713);
    			attr_dev(i0, "class", "fa fa-arrow-right m-2 text-info");
    			add_location(i0, file$d, 19, 61, 1032);
    			attr_dev(a1, "class", "dropdown-item svelte-1cakmch");
    			attr_dev(a1, "href", "/marketer/");
    			add_location(a1, file$d, 19, 18, 989);
    			attr_dev(i1, "class", "fa fa-arrow-right m-2 text-info");
    			add_location(i1, file$d, 20, 68, 1158);
    			attr_dev(a2, "class", "dropdown-item svelte-1cakmch");
    			attr_dev(a2, "href", "/marketer/confirm");
    			add_location(a2, file$d, 20, 18, 1108);
    			attr_dev(i2, "class", "fa fa-arrow-right m-2 text-info");
    			add_location(i2, file$d, 21, 70, 1289);
    			attr_dev(a3, "class", "dropdown-item svelte-1cakmch");
    			attr_dev(a3, "href", "/marketer/completed");
    			add_location(a3, file$d, 21, 18, 1237);
    			attr_dev(i3, "class", "fa fa-search m-2 text-info");
    			add_location(i3, file$d, 22, 75, 1425);
    			attr_dev(a4, "class", "dropdown-item svelte-1cakmch");
    			attr_dev(a4, "href", "/marketer/search_product");
    			add_location(a4, file$d, 22, 18, 1368);
    			attr_dev(div1, "class", "dropdown-divider text-primary");
    			add_location(div1, file$d, 23, 18, 1498);
    			attr_dev(i4, "class", "fa fa-cogs m-2 text-info");
    			add_location(i4, file$d, 24, 68, 1616);
    			attr_dev(a5, "class", "dropdown-item svelte-1cakmch");
    			attr_dev(a5, "href", "/marketer/profile");
    			add_location(a5, file$d, 24, 18, 1566);
    			attr_dev(div2, "class", "dropdown-menu svelte-1cakmch");
    			attr_dev(div2, "aria-labelledby", "dropdownMenuButton");
    			add_location(div2, file$d, 18, 16, 906);
    			attr_dev(li0, "class", "nav dropdown ml-auto svelte-1cakmch");
    			add_location(li0, file$d, 15, 12, 665);
    			attr_dev(i5, "class", "text-danger fa fa-sign-out fa-lg");
    			add_location(i5, file$d, 28, 69, 1822);
    			attr_dev(button1, "class", "nav-link btn svelte-1cakmch");
    			add_location(button1, file$d, 28, 16, 1769);
    			attr_dev(li1, "class", "nav nav-item ml-4 svelte-1cakmch");
    			add_location(li1, file$d, 27, 12, 1722);
    			attr_dev(div3, "class", "collapse navbar-collapse");
    			attr_dev(div3, "id", "navbarTogglerDemo01");
    			add_location(div3, file$d, 14, 8, 589);
    			attr_dev(nav, "class", "navbar navbar-expand-lg svelte-1cakmch");
    			add_location(nav, file$d, 9, 4, 183);
    			attr_dev(main, "class", "body svelte-1cakmch");
    			add_location(main, file$d, 8, 0, 159);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, nav);
    			append_dev(nav, a0);
    			append_dev(a0, img);
    			append_dev(nav, t0);
    			append_dev(nav, button0);
    			append_dev(button0, span);
    			append_dev(nav, t1);
    			append_dev(nav, div3);
    			append_dev(div3, li0);
    			append_dev(li0, div0);
    			append_dev(li0, t3);
    			append_dev(li0, div2);
    			append_dev(div2, a1);
    			append_dev(a1, i0);
    			append_dev(a1, t4);
    			append_dev(div2, t5);
    			append_dev(div2, a2);
    			append_dev(a2, i1);
    			append_dev(a2, t6);
    			append_dev(div2, t7);
    			append_dev(div2, a3);
    			append_dev(a3, i2);
    			append_dev(a3, t8);
    			append_dev(div2, t9);
    			append_dev(div2, a4);
    			append_dev(a4, i3);
    			append_dev(a4, t10);
    			append_dev(div2, t11);
    			append_dev(div2, div1);
    			append_dev(div2, t12);
    			append_dev(div2, a5);
    			append_dev(a5, i4);
    			append_dev(a5, t13);
    			append_dev(div3, t14);
    			append_dev(div3, li1);
    			append_dev(li1, button1);
    			append_dev(button1, i5);

    			if (!mounted) {
    				dispose = listen_dev(button1, "click", /*logouthandle*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NavBar', slots, []);

    	function logouthandle() {
    		localStorage.removeItem('admin_details');
    		navigate('/');
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NavBar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ navigate, logouthandle });
    	return [logouthandle];
    }

    class NavBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavBar",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src/pages/marketer/orders/order.svelte generated by Svelte v3.44.1 */

    const { console: console_1$5 } = globals;
    const file$c = "src/pages/marketer/orders/order.svelte";

    function get_each_context$a(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (134:14) {#each orders as item}
    function create_each_block$a(ctx) {
    	let tr;
    	let td0;
    	let button0;
    	let t1;
    	let td1;
    	let button1;
    	let t3;
    	let td2;
    	let button2;
    	let t5;
    	let td3;
    	let h6;
    	let t6_value = /*item*/ ctx[6].shipping_address + "";
    	let t6;
    	let t7;
    	let td4;
    	let button3;
    	let t9;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			button0 = element("button");
    			button0.textContent = "Distributer";
    			t1 = space();
    			td1 = element("td");
    			button1 = element("button");
    			button1.textContent = "View";
    			t3 = space();
    			td2 = element("td");
    			button2 = element("button");
    			button2.textContent = "Order Details";
    			t5 = space();
    			td3 = element("td");
    			h6 = element("h6");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			button3 = element("button");
    			button3.textContent = "Confirm";
    			t9 = space();
    			attr_dev(button0, "class", "btn btn-link");
    			add_location(button0, file$c, 136, 20, 4062);
    			add_location(td0, file$c, 135, 18, 4037);
    			attr_dev(button1, "class", "btn btn-link");
    			add_location(button1, file$c, 143, 20, 4316);
    			add_location(td1, file$c, 142, 18, 4291);
    			attr_dev(button2, "class", "btn btn-link");
    			add_location(button2, file$c, 149, 20, 4548);
    			attr_dev(td2, "class", "text-center");
    			add_location(td2, file$c, 148, 18, 4503);
    			add_location(h6, file$c, 155, 42, 4797);
    			attr_dev(td3, "class", "text-center");
    			add_location(td3, file$c, 155, 18, 4773);
    			attr_dev(button3, "class", "btn btn-outline-success");
    			add_location(button3, file$c, 157, 20, 4898);
    			attr_dev(td4, "class", "text-center");
    			add_location(td4, file$c, 156, 18, 4853);
    			add_location(tr, file$c, 134, 16, 4014);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, button0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, button1);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, button2);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, h6);
    			append_dev(h6, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, button3);
    			append_dev(tr, t9);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						button0,
    						"click",
    						function () {
    							if (is_function(/*viewDistributer*/ ctx[3](/*item*/ ctx[6].order_placed_by))) /*viewDistributer*/ ctx[3](/*item*/ ctx[6].order_placed_by).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button1,
    						"click",
    						function () {
    							if (is_function(/*viewItem*/ ctx[1](/*item*/ ctx[6].product_id))) /*viewItem*/ ctx[1](/*item*/ ctx[6].product_id).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button2,
    						"click",
    						function () {
    							if (is_function(/*viewDetails*/ ctx[2](/*item*/ ctx[6].order_details))) /*viewDetails*/ ctx[2](/*item*/ ctx[6].order_details).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button3,
    						"click",
    						function () {
    							if (is_function(/*confirmOrder*/ ctx[4](/*item*/ ctx[6]._id))) /*confirmOrder*/ ctx[4](/*item*/ ctx[6]._id).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*orders*/ 1 && t6_value !== (t6_value = /*item*/ ctx[6].shipping_address + "")) set_data_dev(t6, t6_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$a.name,
    		type: "each",
    		source: "(134:14) {#each orders as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let main;
    	let div3;
    	let h4;
    	let t1;
    	let div2;
    	let div1;
    	let div0;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t3;
    	let th1;
    	let t5;
    	let th2;
    	let t7;
    	let th3;
    	let t9;
    	let th4;
    	let t11;
    	let tbody;
    	let each_value = /*orders*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$a(get_each_context$a(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			div3 = element("div");
    			h4 = element("h4");
    			h4.textContent = "Assigned Orders";
    			t1 = space();
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Order By";
    			t3 = space();
    			th1 = element("th");
    			th1.textContent = "Product";
    			t5 = space();
    			th2 = element("th");
    			th2.textContent = "Details";
    			t7 = space();
    			th3 = element("th");
    			th3.textContent = "Address";
    			t9 = space();
    			th4 = element("th");
    			th4.textContent = "Action";
    			t11 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h4, "class", "text-secondary text-center p-2 m-2 border-bottom");
    			add_location(h4, file$c, 116, 4, 3425);
    			add_location(th0, file$c, 125, 16, 3718);
    			add_location(th1, file$c, 126, 16, 3752);
    			add_location(th2, file$c, 127, 16, 3785);
    			add_location(th3, file$c, 128, 16, 3818);
    			add_location(th4, file$c, 129, 16, 3851);
    			add_location(tr, file$c, 124, 14, 3697);
    			add_location(thead, file$c, 123, 12, 3675);
    			attr_dev(tbody, "class", "m-auto align-item-center");
    			add_location(tbody, file$c, 132, 12, 3920);
    			attr_dev(table, "class", "table table-fill sortable");
    			add_location(table, file$c, 122, 10, 3621);
    			attr_dev(div0, "class", "table-responsive border");
    			add_location(div0, file$c, 121, 8, 3573);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$c, 120, 6, 3547);
    			attr_dev(div2, "class", "row");
    			add_location(div2, file$c, 119, 4, 3523);
    			attr_dev(div3, "class", "container-flex");
    			add_location(div3, file$c, 115, 2, 3392);
    			add_location(main, file$c, 114, 0, 3383);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div3);
    			append_dev(div3, h4);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t3);
    			append_dev(tr, th1);
    			append_dev(tr, t5);
    			append_dev(tr, th2);
    			append_dev(tr, t7);
    			append_dev(tr, th3);
    			append_dev(tr, t9);
    			append_dev(tr, th4);
    			append_dev(table, t11);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*confirmOrder, orders, viewDetails, viewItem, viewDistributer*/ 31) {
    				each_value = /*orders*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$a(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$a(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Order', slots, []);
    	let orders = [];

    	onMount(() => {
    		fetchOrders();
    	});

    	const fetchOrders = async ids => {
    		const userDetils = JSON.parse(localStorage.getItem("admin_details"));

    		if (userDetils) {
    			const decodeToken = JSON.parse(atob(userDetils.token.split(".")[1]));
    			let inputs = { _id: decodeToken._id };

    			await fetch(`${API_URL}/marketeer/my_jobs`, {
    				method: "POST",
    				body: JSON.stringify(inputs),
    				headers: { "Content-Type": "application/json" }
    			}).then(response => response.json()).then(datas => {
    				$$invalidate(0, orders = datas.data.filter(item => item.status === 1));
    			});
    		}
    	};

    	const viewItem = async e => {
    		await fetch(`${API_URL}/products/list/${e}`, { method: "POST" }).then(response => response.json()).then(datas => {
    			sweetalert2_all.fire({
    				title: datas.data.title,
    				text: datas.data.category + ", " + datas.data.subCategory,
    				imageUrl: datas.data.image,
    				imageWidth: 100,
    				imageHeight: 200,
    				imageAlt: "Custom image"
    			});
    		});
    	};

    	const viewDetails = e => {
    		sweetalert2_all.fire({
    			title: "Order Details",
    			html: "<div><tr><b>Width : </b><i>" + e.width + "</i></tr></br><tr><b>Height : </b><i>" + e.height + "</i></tr></br><tr><b>ArcTop : </b><i>" + e.arcTop + "</i></tr></br><tr><b>ArcBottom : </b><i>" + e.arcBottom + "</i></tr></br><tr><b>Sandwich : </b><i>" + e.sandwich + "</i></tr></br><tr><b>Varnish : </b><i>" + e.varnish + "</i></tr></br><tr><b>WhiteCoat : </b><i>" + e.whiteCoat + "</i></tr></br><tr><b>Message : </b><i>" + e.message + "</i></tr></div>"
    		});
    	};

    	const viewDistributer = async e => {
    		await fetch(`${API_URL}/admin/distributer/read/${e}`, { method: "POST" }).then(response => response.json()).then(datas => {
    			sweetalert2_all.fire({
    				title: "Distributer Details",
    				html: "<div><tr><b>Name : </b><i>" + datas.data.name + "</i></tr></br><tr><b>Phone : </b><i>" + datas.data.phone + "</i></tr></br><tr><b>E mail : </b><i>" + datas.data.email + "</i></tr></br><tr><b>Base Price : </b><i>" + datas.data.basePrice + "</i></tr></br><tr><b>Delivery Price : </b><i>" + datas.data.deliveryPrice + "</i></tr></br><tr><b>Status : </b><i>" + datas.data.active + "</i></tr></br></div>"
    			});
    		});
    	};

    	const confirmOrder = async e => {
    		let bodyData = { _id: e, status: 2 };

    		const res = await fetch(`${API_URL}/order/order_status`, {
    			method: "post",
    			body: JSON.stringify(bodyData),
    			headers: { "Content-Type": "application/json" }
    		});

    		const json = await res.json();
    		console.log(json);

    		if (json.status === true) {
    			sweetalert2_all.fire({
    				position: "top-end",
    				icon: "success",
    				title: "Order Confirmed",
    				showConfirmButton: false,
    				timer: 500
    			});
    		}

    		fetchOrders();
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$5.warn(`<Order> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Swal: sweetalert2_all,
    		API_URL,
    		orders,
    		fetchOrders,
    		viewItem,
    		viewDetails,
    		viewDistributer,
    		confirmOrder
    	});

    	$$self.$inject_state = $$props => {
    		if ('orders' in $$props) $$invalidate(0, orders = $$props.orders);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [orders, viewItem, viewDetails, viewDistributer, confirmOrder];
    }

    class Order extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Order",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src/pages/marketer/orders/print.svelte generated by Svelte v3.44.1 */

    const { console: console_1$4 } = globals;
    const file$b = "src/pages/marketer/orders/print.svelte";

    function get_each_context$9(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (134:14) {#each orders as item}
    function create_each_block$9(ctx) {
    	let tr;
    	let td0;
    	let button0;
    	let t1;
    	let td1;
    	let button1;
    	let t3;
    	let td2;
    	let button2;
    	let t5;
    	let td3;
    	let h6;
    	let t6_value = /*item*/ ctx[6].shipping_address + "";
    	let t6;
    	let t7;
    	let td4;
    	let button3;
    	let t9;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			button0 = element("button");
    			button0.textContent = "Distributer";
    			t1 = space();
    			td1 = element("td");
    			button1 = element("button");
    			button1.textContent = "View";
    			t3 = space();
    			td2 = element("td");
    			button2 = element("button");
    			button2.textContent = "Order Details";
    			t5 = space();
    			td3 = element("td");
    			h6 = element("h6");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			button3 = element("button");
    			button3.textContent = "Second Payment";
    			t9 = space();
    			attr_dev(button0, "class", "btn btn-link");
    			add_location(button0, file$b, 136, 20, 4073);
    			add_location(td0, file$b, 135, 18, 4048);
    			attr_dev(button1, "class", "btn btn-link");
    			add_location(button1, file$b, 143, 20, 4327);
    			add_location(td1, file$b, 142, 18, 4302);
    			attr_dev(button2, "class", "btn btn-link");
    			add_location(button2, file$b, 149, 20, 4559);
    			attr_dev(td2, "class", "text-center");
    			add_location(td2, file$b, 148, 18, 4514);
    			add_location(h6, file$b, 155, 42, 4808);
    			attr_dev(td3, "class", "text-center");
    			add_location(td3, file$b, 155, 18, 4784);
    			attr_dev(button3, "class", "btn btn-outline-success");
    			add_location(button3, file$b, 157, 20, 4909);
    			attr_dev(td4, "class", "text-center");
    			add_location(td4, file$b, 156, 18, 4864);
    			add_location(tr, file$b, 134, 16, 4025);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, button0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, button1);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, button2);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, h6);
    			append_dev(h6, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, button3);
    			append_dev(tr, t9);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						button0,
    						"click",
    						function () {
    							if (is_function(/*viewDistributer*/ ctx[3](/*item*/ ctx[6].order_placed_by))) /*viewDistributer*/ ctx[3](/*item*/ ctx[6].order_placed_by).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button1,
    						"click",
    						function () {
    							if (is_function(/*viewItem*/ ctx[1](/*item*/ ctx[6].product_id))) /*viewItem*/ ctx[1](/*item*/ ctx[6].product_id).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button2,
    						"click",
    						function () {
    							if (is_function(/*viewDetails*/ ctx[2](/*item*/ ctx[6].order_details))) /*viewDetails*/ ctx[2](/*item*/ ctx[6].order_details).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button3,
    						"click",
    						function () {
    							if (is_function(/*confirmOrder*/ ctx[4](/*item*/ ctx[6]._id))) /*confirmOrder*/ ctx[4](/*item*/ ctx[6]._id).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*orders*/ 1 && t6_value !== (t6_value = /*item*/ ctx[6].shipping_address + "")) set_data_dev(t6, t6_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$9.name,
    		type: "each",
    		source: "(134:14) {#each orders as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let main;
    	let div3;
    	let h4;
    	let t1;
    	let div2;
    	let div1;
    	let div0;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t3;
    	let th1;
    	let t5;
    	let th2;
    	let t7;
    	let th3;
    	let t9;
    	let th4;
    	let t11;
    	let tbody;
    	let each_value = /*orders*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$9(get_each_context$9(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			div3 = element("div");
    			h4 = element("h4");
    			h4.textContent = "Orders on Printing";
    			t1 = space();
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Order By";
    			t3 = space();
    			th1 = element("th");
    			th1.textContent = "Product";
    			t5 = space();
    			th2 = element("th");
    			th2.textContent = "Details";
    			t7 = space();
    			th3 = element("th");
    			th3.textContent = "Address";
    			t9 = space();
    			th4 = element("th");
    			th4.textContent = "Action";
    			t11 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h4, "class", "text-secondary text-center p-2 m-2 border-bottom");
    			add_location(h4, file$b, 116, 4, 3433);
    			add_location(th0, file$b, 125, 16, 3729);
    			add_location(th1, file$b, 126, 16, 3763);
    			add_location(th2, file$b, 127, 16, 3796);
    			add_location(th3, file$b, 128, 16, 3829);
    			add_location(th4, file$b, 129, 16, 3862);
    			add_location(tr, file$b, 124, 14, 3708);
    			add_location(thead, file$b, 123, 12, 3686);
    			attr_dev(tbody, "class", "m-auto align-item-center");
    			add_location(tbody, file$b, 132, 12, 3931);
    			attr_dev(table, "class", "table table-fill sortable");
    			add_location(table, file$b, 122, 10, 3632);
    			attr_dev(div0, "class", "table-responsive border");
    			add_location(div0, file$b, 121, 8, 3584);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$b, 120, 6, 3558);
    			attr_dev(div2, "class", "row");
    			add_location(div2, file$b, 119, 4, 3534);
    			attr_dev(div3, "class", "container-flex");
    			add_location(div3, file$b, 115, 2, 3400);
    			add_location(main, file$b, 114, 0, 3391);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div3);
    			append_dev(div3, h4);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t3);
    			append_dev(tr, th1);
    			append_dev(tr, t5);
    			append_dev(tr, th2);
    			append_dev(tr, t7);
    			append_dev(tr, th3);
    			append_dev(tr, t9);
    			append_dev(tr, th4);
    			append_dev(table, t11);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*confirmOrder, orders, viewDetails, viewItem, viewDistributer*/ 31) {
    				each_value = /*orders*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$9(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$9(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Print', slots, []);
    	let orders = [];

    	onMount(() => {
    		fetchOrders();
    	});

    	const fetchOrders = async ids => {
    		const userDetils = JSON.parse(localStorage.getItem("admin_details"));

    		if (userDetils) {
    			const decodeToken = JSON.parse(atob(userDetils.token.split(".")[1]));
    			let inputs = { _id: decodeToken._id };

    			await fetch(`${API_URL}/marketeer/my_jobs`, {
    				method: "POST",
    				body: JSON.stringify(inputs),
    				headers: { "Content-Type": "application/json" }
    			}).then(response => response.json()).then(datas => {
    				$$invalidate(0, orders = datas.data.filter(item => item.status === 4));
    			});
    		}
    	};

    	const viewItem = async e => {
    		await fetch(`${API_URL}/products/list/${e}`, { method: "POST" }).then(response => response.json()).then(datas => {
    			sweetalert2_all.fire({
    				title: datas.data.title,
    				text: datas.data.category + ", " + datas.data.subCategory,
    				imageUrl: datas.data.image,
    				imageWidth: 100,
    				imageHeight: 200,
    				imageAlt: "Custom image"
    			});
    		});
    	};

    	const viewDetails = e => {
    		sweetalert2_all.fire({
    			title: "Order Details",
    			html: "<div><tr><b>Width : </b><i>" + e.width + "</i></tr></br><tr><b>Height : </b><i>" + e.height + "</i></tr></br><tr><b>ArcTop : </b><i>" + e.arcTop + "</i></tr></br><tr><b>ArcBottom : </b><i>" + e.arcBottom + "</i></tr></br><tr><b>Sandwich : </b><i>" + e.sandwich + "</i></tr></br><tr><b>Varnish : </b><i>" + e.varnish + "</i></tr></br><tr><b>WhiteCoat : </b><i>" + e.whiteCoat + "</i></tr></br><tr><b>Message : </b><i>" + e.message + "</i></tr></div>"
    		});
    	};

    	const viewDistributer = async e => {
    		await fetch(`${API_URL}/admin/distributer/read/${e}`, { method: "POST" }).then(response => response.json()).then(datas => {
    			sweetalert2_all.fire({
    				title: "Distributer Details",
    				html: "<div><tr><b>Name : </b><i>" + datas.data.name + "</i></tr></br><tr><b>Phone : </b><i>" + datas.data.phone + "</i></tr></br><tr><b>E mail : </b><i>" + datas.data.email + "</i></tr></br><tr><b>Base Price : </b><i>" + datas.data.basePrice + "</i></tr></br><tr><b>Delivery Price : </b><i>" + datas.data.deliveryPrice + "</i></tr></br><tr><b>Status : </b><i>" + datas.data.active + "</i></tr></br></div>"
    			});
    		});
    	};

    	const confirmOrder = async e => {
    		let bodyData = { _id: e, status: 5 };

    		const res = await fetch(`${API_URL}/order/order_status`, {
    			method: "post",
    			body: JSON.stringify(bodyData),
    			headers: { "Content-Type": "application/json" }
    		});

    		const json = await res.json();
    		console.log(json);

    		if (json.status === true) {
    			sweetalert2_all.fire({
    				position: "top-end",
    				icon: "success",
    				title: "Second Payment Received",
    				showConfirmButton: false,
    				timer: 500
    			});
    		}

    		fetchOrders();
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$4.warn(`<Print> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Swal: sweetalert2_all,
    		API_URL,
    		orders,
    		fetchOrders,
    		viewItem,
    		viewDetails,
    		viewDistributer,
    		confirmOrder
    	});

    	$$self.$inject_state = $$props => {
    		if ('orders' in $$props) $$invalidate(0, orders = $$props.orders);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [orders, viewItem, viewDetails, viewDistributer, confirmOrder];
    }

    class Print extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Print",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src/pages/marketer/orders/firstpay.svelte generated by Svelte v3.44.1 */

    const { console: console_1$3 } = globals;
    const file$a = "src/pages/marketer/orders/firstpay.svelte";

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (134:14) {#each orders as item}
    function create_each_block$8(ctx) {
    	let tr;
    	let td0;
    	let button0;
    	let t1;
    	let td1;
    	let button1;
    	let t3;
    	let td2;
    	let button2;
    	let t5;
    	let td3;
    	let h6;
    	let t6_value = /*item*/ ctx[6].shipping_address + "";
    	let t6;
    	let t7;
    	let td4;
    	let button3;
    	let t9;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			button0 = element("button");
    			button0.textContent = "Distributer";
    			t1 = space();
    			td1 = element("td");
    			button1 = element("button");
    			button1.textContent = "View";
    			t3 = space();
    			td2 = element("td");
    			button2 = element("button");
    			button2.textContent = "Order Details";
    			t5 = space();
    			td3 = element("td");
    			h6 = element("h6");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			button3 = element("button");
    			button3.textContent = "To Print";
    			t9 = space();
    			attr_dev(button0, "class", "btn btn-link");
    			add_location(button0, file$a, 136, 20, 4083);
    			add_location(td0, file$a, 135, 18, 4058);
    			attr_dev(button1, "class", "btn btn-link");
    			add_location(button1, file$a, 143, 20, 4337);
    			add_location(td1, file$a, 142, 18, 4312);
    			attr_dev(button2, "class", "btn btn-link");
    			add_location(button2, file$a, 149, 20, 4569);
    			attr_dev(td2, "class", "text-center");
    			add_location(td2, file$a, 148, 18, 4524);
    			add_location(h6, file$a, 155, 42, 4818);
    			attr_dev(td3, "class", "text-center");
    			add_location(td3, file$a, 155, 18, 4794);
    			attr_dev(button3, "class", "btn btn-outline-success");
    			add_location(button3, file$a, 157, 20, 4919);
    			attr_dev(td4, "class", "text-center");
    			add_location(td4, file$a, 156, 18, 4874);
    			add_location(tr, file$a, 134, 16, 4035);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, button0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, button1);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, button2);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, h6);
    			append_dev(h6, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, button3);
    			append_dev(tr, t9);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						button0,
    						"click",
    						function () {
    							if (is_function(/*viewDistributer*/ ctx[3](/*item*/ ctx[6].order_placed_by))) /*viewDistributer*/ ctx[3](/*item*/ ctx[6].order_placed_by).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button1,
    						"click",
    						function () {
    							if (is_function(/*viewItem*/ ctx[1](/*item*/ ctx[6].product_id))) /*viewItem*/ ctx[1](/*item*/ ctx[6].product_id).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button2,
    						"click",
    						function () {
    							if (is_function(/*viewDetails*/ ctx[2](/*item*/ ctx[6].order_details))) /*viewDetails*/ ctx[2](/*item*/ ctx[6].order_details).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button3,
    						"click",
    						function () {
    							if (is_function(/*confirmOrder*/ ctx[4](/*item*/ ctx[6]._id))) /*confirmOrder*/ ctx[4](/*item*/ ctx[6]._id).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*orders*/ 1 && t6_value !== (t6_value = /*item*/ ctx[6].shipping_address + "")) set_data_dev(t6, t6_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$8.name,
    		type: "each",
    		source: "(134:14) {#each orders as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let main;
    	let div3;
    	let h4;
    	let t1;
    	let div2;
    	let div1;
    	let div0;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t3;
    	let th1;
    	let t5;
    	let th2;
    	let t7;
    	let th3;
    	let t9;
    	let th4;
    	let t11;
    	let tbody;
    	let each_value = /*orders*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			div3 = element("div");
    			h4 = element("h4");
    			h4.textContent = "First Payment Received Orders";
    			t1 = space();
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Order By";
    			t3 = space();
    			th1 = element("th");
    			th1.textContent = "Product";
    			t5 = space();
    			th2 = element("th");
    			th2.textContent = "Details";
    			t7 = space();
    			th3 = element("th");
    			th3.textContent = "Address";
    			t9 = space();
    			th4 = element("th");
    			th4.textContent = "Action";
    			t11 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h4, "class", "text-secondary text-center p-2 m-2 border-bottom");
    			add_location(h4, file$a, 116, 4, 3432);
    			add_location(th0, file$a, 125, 16, 3739);
    			add_location(th1, file$a, 126, 16, 3773);
    			add_location(th2, file$a, 127, 16, 3806);
    			add_location(th3, file$a, 128, 16, 3839);
    			add_location(th4, file$a, 129, 16, 3872);
    			add_location(tr, file$a, 124, 14, 3718);
    			add_location(thead, file$a, 123, 12, 3696);
    			attr_dev(tbody, "class", "m-auto align-item-center");
    			add_location(tbody, file$a, 132, 12, 3941);
    			attr_dev(table, "class", "table table-fill sortable");
    			add_location(table, file$a, 122, 10, 3642);
    			attr_dev(div0, "class", "table-responsive border");
    			add_location(div0, file$a, 121, 8, 3594);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$a, 120, 6, 3568);
    			attr_dev(div2, "class", "row");
    			add_location(div2, file$a, 119, 4, 3544);
    			attr_dev(div3, "class", "container-flex");
    			add_location(div3, file$a, 115, 2, 3399);
    			add_location(main, file$a, 114, 0, 3390);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div3);
    			append_dev(div3, h4);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t3);
    			append_dev(tr, th1);
    			append_dev(tr, t5);
    			append_dev(tr, th2);
    			append_dev(tr, t7);
    			append_dev(tr, th3);
    			append_dev(tr, t9);
    			append_dev(tr, th4);
    			append_dev(table, t11);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*confirmOrder, orders, viewDetails, viewItem, viewDistributer*/ 31) {
    				each_value = /*orders*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$8(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$8(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Firstpay', slots, []);
    	let orders = [];

    	onMount(() => {
    		fetchOrders();
    	});

    	const fetchOrders = async ids => {
    		const userDetils = JSON.parse(localStorage.getItem("admin_details"));

    		if (userDetils) {
    			const decodeToken = JSON.parse(atob(userDetils.token.split(".")[1]));
    			let inputs = { _id: decodeToken._id };

    			await fetch(`${API_URL}/marketeer/my_jobs`, {
    				method: "POST",
    				body: JSON.stringify(inputs),
    				headers: { "Content-Type": "application/json" }
    			}).then(response => response.json()).then(datas => {
    				$$invalidate(0, orders = datas.data.filter(item => item.status === 3));
    			});
    		}
    	};

    	const viewItem = async e => {
    		await fetch(`${API_URL}/products/list/${e}`, { method: "POST" }).then(response => response.json()).then(datas => {
    			sweetalert2_all.fire({
    				title: datas.data.title,
    				text: datas.data.category + ", " + datas.data.subCategory,
    				imageUrl: datas.data.image,
    				imageWidth: 100,
    				imageHeight: 200,
    				imageAlt: "Custom image"
    			});
    		});
    	};

    	const viewDetails = e => {
    		sweetalert2_all.fire({
    			title: "Order Details",
    			html: "<div><tr><b>Width : </b><i>" + e.width + "</i></tr></br><tr><b>Height : </b><i>" + e.height + "</i></tr></br><tr><b>ArcTop : </b><i>" + e.arcTop + "</i></tr></br><tr><b>ArcBottom : </b><i>" + e.arcBottom + "</i></tr></br><tr><b>Sandwich : </b><i>" + e.sandwich + "</i></tr></br><tr><b>Varnish : </b><i>" + e.varnish + "</i></tr></br><tr><b>WhiteCoat : </b><i>" + e.whiteCoat + "</i></tr></br><tr><b>Message : </b><i>" + e.message + "</i></tr></div>"
    		});
    	};

    	const viewDistributer = async e => {
    		await fetch(`${API_URL}/admin/distributer/read/${e}`, { method: "POST" }).then(response => response.json()).then(datas => {
    			sweetalert2_all.fire({
    				title: "Distributer Details",
    				html: "<div><tr><b>Name : </b><i>" + datas.data.name + "</i></tr></br><tr><b>Phone : </b><i>" + datas.data.phone + "</i></tr></br><tr><b>E mail : </b><i>" + datas.data.email + "</i></tr></br><tr><b>Base Price : </b><i>" + datas.data.basePrice + "</i></tr></br><tr><b>Delivery Price : </b><i>" + datas.data.deliveryPrice + "</i></tr></br><tr><b>Status : </b><i>" + datas.data.active + "</i></tr></br></div>"
    			});
    		});
    	};

    	const confirmOrder = async e => {
    		let bodyData = { _id: e, status: 4 };

    		const res = await fetch(`${API_URL}/order/order_status`, {
    			method: "post",
    			body: JSON.stringify(bodyData),
    			headers: { "Content-Type": "application/json" }
    		});

    		const json = await res.json();
    		console.log(json);

    		if (json.status === true) {
    			sweetalert2_all.fire({
    				position: "top-end",
    				icon: "success",
    				title: "Order sent to Printing",
    				showConfirmButton: false,
    				timer: 500
    			});
    		}

    		fetchOrders();
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<Firstpay> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Swal: sweetalert2_all,
    		API_URL,
    		orders,
    		fetchOrders,
    		viewItem,
    		viewDetails,
    		viewDistributer,
    		confirmOrder
    	});

    	$$self.$inject_state = $$props => {
    		if ('orders' in $$props) $$invalidate(0, orders = $$props.orders);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [orders, viewItem, viewDetails, viewDistributer, confirmOrder];
    }

    class Firstpay extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Firstpay",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src/pages/marketer/orders/confirmed.svelte generated by Svelte v3.44.1 */

    const { console: console_1$2 } = globals;
    const file$9 = "src/pages/marketer/orders/confirmed.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (134:14) {#each orders as item}
    function create_each_block$7(ctx) {
    	let tr;
    	let td0;
    	let button0;
    	let t1;
    	let td1;
    	let button1;
    	let t3;
    	let td2;
    	let button2;
    	let t5;
    	let td3;
    	let h6;
    	let t6_value = /*item*/ ctx[6].shipping_address + "";
    	let t6;
    	let t7;
    	let td4;
    	let button3;
    	let t9;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			button0 = element("button");
    			button0.textContent = "Distributer";
    			t1 = space();
    			td1 = element("td");
    			button1 = element("button");
    			button1.textContent = "View";
    			t3 = space();
    			td2 = element("td");
    			button2 = element("button");
    			button2.textContent = "Order Details";
    			t5 = space();
    			td3 = element("td");
    			h6 = element("h6");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			button3 = element("button");
    			button3.textContent = "First Payment";
    			t9 = space();
    			attr_dev(button0, "class", "btn btn-link");
    			add_location(button0, file$9, 136, 20, 4070);
    			add_location(td0, file$9, 135, 18, 4045);
    			attr_dev(button1, "class", "btn btn-link");
    			add_location(button1, file$9, 143, 20, 4324);
    			add_location(td1, file$9, 142, 18, 4299);
    			attr_dev(button2, "class", "btn btn-link");
    			add_location(button2, file$9, 149, 20, 4556);
    			attr_dev(td2, "class", "text-center");
    			add_location(td2, file$9, 148, 18, 4511);
    			add_location(h6, file$9, 155, 42, 4805);
    			attr_dev(td3, "class", "text-center");
    			add_location(td3, file$9, 155, 18, 4781);
    			attr_dev(button3, "class", "btn btn-outline-success");
    			add_location(button3, file$9, 157, 20, 4906);
    			attr_dev(td4, "class", "text-center");
    			add_location(td4, file$9, 156, 18, 4861);
    			add_location(tr, file$9, 134, 16, 4022);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, button0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, button1);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, button2);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, h6);
    			append_dev(h6, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, button3);
    			append_dev(tr, t9);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						button0,
    						"click",
    						function () {
    							if (is_function(/*viewDistributer*/ ctx[3](/*item*/ ctx[6].order_placed_by))) /*viewDistributer*/ ctx[3](/*item*/ ctx[6].order_placed_by).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button1,
    						"click",
    						function () {
    							if (is_function(/*viewItem*/ ctx[1](/*item*/ ctx[6].product_id))) /*viewItem*/ ctx[1](/*item*/ ctx[6].product_id).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button2,
    						"click",
    						function () {
    							if (is_function(/*viewDetails*/ ctx[2](/*item*/ ctx[6].order_details))) /*viewDetails*/ ctx[2](/*item*/ ctx[6].order_details).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button3,
    						"click",
    						function () {
    							if (is_function(/*confirmOrder*/ ctx[4](/*item*/ ctx[6]._id))) /*confirmOrder*/ ctx[4](/*item*/ ctx[6]._id).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*orders*/ 1 && t6_value !== (t6_value = /*item*/ ctx[6].shipping_address + "")) set_data_dev(t6, t6_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(134:14) {#each orders as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let main;
    	let div3;
    	let h4;
    	let t1;
    	let div2;
    	let div1;
    	let div0;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t3;
    	let th1;
    	let t5;
    	let th2;
    	let t7;
    	let th3;
    	let t9;
    	let th4;
    	let t11;
    	let tbody;
    	let each_value = /*orders*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			div3 = element("div");
    			h4 = element("h4");
    			h4.textContent = "Confirmed Orders";
    			t1 = space();
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Order By";
    			t3 = space();
    			th1 = element("th");
    			th1.textContent = "Product";
    			t5 = space();
    			th2 = element("th");
    			th2.textContent = "Details";
    			t7 = space();
    			th3 = element("th");
    			th3.textContent = "Address";
    			t9 = space();
    			th4 = element("th");
    			th4.textContent = "Action";
    			t11 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h4, "class", "text-secondary text-center p-2 m-2 border-bottom");
    			add_location(h4, file$9, 116, 4, 3432);
    			add_location(th0, file$9, 125, 16, 3726);
    			add_location(th1, file$9, 126, 16, 3760);
    			add_location(th2, file$9, 127, 16, 3793);
    			add_location(th3, file$9, 128, 16, 3826);
    			add_location(th4, file$9, 129, 16, 3859);
    			add_location(tr, file$9, 124, 14, 3705);
    			add_location(thead, file$9, 123, 12, 3683);
    			attr_dev(tbody, "class", "m-auto align-item-center");
    			add_location(tbody, file$9, 132, 12, 3928);
    			attr_dev(table, "class", "table table-fill sortable");
    			add_location(table, file$9, 122, 10, 3629);
    			attr_dev(div0, "class", "table-responsive border");
    			add_location(div0, file$9, 121, 8, 3581);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$9, 120, 6, 3555);
    			attr_dev(div2, "class", "row");
    			add_location(div2, file$9, 119, 4, 3531);
    			attr_dev(div3, "class", "container-flex");
    			add_location(div3, file$9, 115, 2, 3399);
    			add_location(main, file$9, 114, 0, 3390);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div3);
    			append_dev(div3, h4);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t3);
    			append_dev(tr, th1);
    			append_dev(tr, t5);
    			append_dev(tr, th2);
    			append_dev(tr, t7);
    			append_dev(tr, th3);
    			append_dev(tr, t9);
    			append_dev(tr, th4);
    			append_dev(table, t11);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*confirmOrder, orders, viewDetails, viewItem, viewDistributer*/ 31) {
    				each_value = /*orders*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Confirmed', slots, []);
    	let orders = [];

    	onMount(() => {
    		fetchOrders();
    	});

    	const fetchOrders = async ids => {
    		const userDetils = JSON.parse(localStorage.getItem("admin_details"));

    		if (userDetils) {
    			const decodeToken = JSON.parse(atob(userDetils.token.split(".")[1]));
    			let inputs = { _id: decodeToken._id };

    			await fetch(`${API_URL}/marketeer/my_jobs`, {
    				method: "POST",
    				body: JSON.stringify(inputs),
    				headers: { "Content-Type": "application/json" }
    			}).then(response => response.json()).then(datas => {
    				$$invalidate(0, orders = datas.data.filter(item => item.status === 2));
    			});
    		}
    	};

    	const viewItem = async e => {
    		await fetch(`${API_URL}/products/list/${e}`, { method: "POST" }).then(response => response.json()).then(datas => {
    			sweetalert2_all.fire({
    				title: datas.data.title,
    				text: datas.data.category + ", " + datas.data.subCategory,
    				imageUrl: datas.data.image,
    				imageWidth: 100,
    				imageHeight: 200,
    				imageAlt: "Custom image"
    			});
    		});
    	};

    	const viewDetails = e => {
    		sweetalert2_all.fire({
    			title: "Order Details",
    			html: "<div><tr><b>Width : </b><i>" + e.width + "</i></tr></br><tr><b>Height : </b><i>" + e.height + "</i></tr></br><tr><b>ArcTop : </b><i>" + e.arcTop + "</i></tr></br><tr><b>ArcBottom : </b><i>" + e.arcBottom + "</i></tr></br><tr><b>Sandwich : </b><i>" + e.sandwich + "</i></tr></br><tr><b>Varnish : </b><i>" + e.varnish + "</i></tr></br><tr><b>WhiteCoat : </b><i>" + e.whiteCoat + "</i></tr></br><tr><b>Message : </b><i>" + e.message + "</i></tr></div>"
    		});
    	};

    	const viewDistributer = async e => {
    		await fetch(`${API_URL}/admin/distributer/read/${e}`, { method: "POST" }).then(response => response.json()).then(datas => {
    			sweetalert2_all.fire({
    				title: "Distributer Details",
    				html: "<div><tr><b>Name : </b><i>" + datas.data.name + "</i></tr></br><tr><b>Phone : </b><i>" + datas.data.phone + "</i></tr></br><tr><b>E mail : </b><i>" + datas.data.email + "</i></tr></br><tr><b>Base Price : </b><i>" + datas.data.basePrice + "</i></tr></br><tr><b>Delivery Price : </b><i>" + datas.data.deliveryPrice + "</i></tr></br><tr><b>Status : </b><i>" + datas.data.active + "</i></tr></br></div>"
    			});
    		});
    	};

    	const confirmOrder = async e => {
    		let bodyData = { _id: e, status: 3 };

    		const res = await fetch(`${API_URL}/order/order_status`, {
    			method: "post",
    			body: JSON.stringify(bodyData),
    			headers: { "Content-Type": "application/json" }
    		});

    		const json = await res.json();
    		console.log(json);

    		if (json.status === true) {
    			sweetalert2_all.fire({
    				position: "top-end",
    				icon: "success",
    				title: "First Payment Received",
    				showConfirmButton: false,
    				timer: 500
    			});
    		}

    		fetchOrders();
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Confirmed> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Swal: sweetalert2_all,
    		API_URL,
    		orders,
    		fetchOrders,
    		viewItem,
    		viewDetails,
    		viewDistributer,
    		confirmOrder
    	});

    	$$self.$inject_state = $$props => {
    		if ('orders' in $$props) $$invalidate(0, orders = $$props.orders);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [orders, viewItem, viewDetails, viewDistributer, confirmOrder];
    }

    class Confirmed extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Confirmed",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src/pages/marketer/orders/second.svelte generated by Svelte v3.44.1 */

    const { console: console_1$1 } = globals;
    const file$8 = "src/pages/marketer/orders/second.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (134:14) {#each orders as item}
    function create_each_block$6(ctx) {
    	let tr;
    	let td0;
    	let button0;
    	let t1;
    	let td1;
    	let button1;
    	let t3;
    	let td2;
    	let button2;
    	let t5;
    	let td3;
    	let h6;
    	let t6_value = /*item*/ ctx[6].shipping_address + "";
    	let t6;
    	let t7;
    	let td4;
    	let button3;
    	let t9;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			button0 = element("button");
    			button0.textContent = "Distributer";
    			t1 = space();
    			td1 = element("td");
    			button1 = element("button");
    			button1.textContent = "View";
    			t3 = space();
    			td2 = element("td");
    			button2 = element("button");
    			button2.textContent = "Order Details";
    			t5 = space();
    			td3 = element("td");
    			h6 = element("h6");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			button3 = element("button");
    			button3.textContent = "Complete";
    			t9 = space();
    			attr_dev(button0, "class", "btn btn-link");
    			add_location(button0, file$8, 136, 20, 4068);
    			add_location(td0, file$8, 135, 18, 4043);
    			attr_dev(button1, "class", "btn btn-link");
    			add_location(button1, file$8, 143, 20, 4322);
    			add_location(td1, file$8, 142, 18, 4297);
    			attr_dev(button2, "class", "btn btn-link");
    			add_location(button2, file$8, 149, 20, 4554);
    			attr_dev(td2, "class", "text-center");
    			add_location(td2, file$8, 148, 18, 4509);
    			add_location(h6, file$8, 155, 42, 4803);
    			attr_dev(td3, "class", "text-center");
    			add_location(td3, file$8, 155, 18, 4779);
    			attr_dev(button3, "class", "btn btn-outline-success");
    			add_location(button3, file$8, 157, 20, 4904);
    			attr_dev(td4, "class", "text-center");
    			add_location(td4, file$8, 156, 18, 4859);
    			add_location(tr, file$8, 134, 16, 4020);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, button0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, button1);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, button2);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, h6);
    			append_dev(h6, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, button3);
    			append_dev(tr, t9);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						button0,
    						"click",
    						function () {
    							if (is_function(/*viewDistributer*/ ctx[3](/*item*/ ctx[6].order_placed_by))) /*viewDistributer*/ ctx[3](/*item*/ ctx[6].order_placed_by).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button1,
    						"click",
    						function () {
    							if (is_function(/*viewItem*/ ctx[1](/*item*/ ctx[6].product_id))) /*viewItem*/ ctx[1](/*item*/ ctx[6].product_id).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button2,
    						"click",
    						function () {
    							if (is_function(/*viewDetails*/ ctx[2](/*item*/ ctx[6].order_details))) /*viewDetails*/ ctx[2](/*item*/ ctx[6].order_details).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button3,
    						"click",
    						function () {
    							if (is_function(/*confirmOrder*/ ctx[4](/*item*/ ctx[6]._id))) /*confirmOrder*/ ctx[4](/*item*/ ctx[6]._id).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*orders*/ 1 && t6_value !== (t6_value = /*item*/ ctx[6].shipping_address + "")) set_data_dev(t6, t6_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(134:14) {#each orders as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let main;
    	let div3;
    	let h4;
    	let t1;
    	let div2;
    	let div1;
    	let div0;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t3;
    	let th1;
    	let t5;
    	let th2;
    	let t7;
    	let th3;
    	let t9;
    	let th4;
    	let t11;
    	let tbody;
    	let each_value = /*orders*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			div3 = element("div");
    			h4 = element("h4");
    			h4.textContent = "Second Payment Orders";
    			t1 = space();
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Order By";
    			t3 = space();
    			th1 = element("th");
    			th1.textContent = "Product";
    			t5 = space();
    			th2 = element("th");
    			th2.textContent = "Details";
    			t7 = space();
    			th3 = element("th");
    			th3.textContent = "Address";
    			t9 = space();
    			th4 = element("th");
    			th4.textContent = "Action";
    			t11 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h4, "class", "text-secondary text-center p-2 m-2 border-bottom");
    			add_location(h4, file$8, 116, 4, 3425);
    			add_location(th0, file$8, 125, 16, 3724);
    			add_location(th1, file$8, 126, 16, 3758);
    			add_location(th2, file$8, 127, 16, 3791);
    			add_location(th3, file$8, 128, 16, 3824);
    			add_location(th4, file$8, 129, 16, 3857);
    			add_location(tr, file$8, 124, 14, 3703);
    			add_location(thead, file$8, 123, 12, 3681);
    			attr_dev(tbody, "class", "m-auto align-item-center");
    			add_location(tbody, file$8, 132, 12, 3926);
    			attr_dev(table, "class", "table table-fill sortable");
    			add_location(table, file$8, 122, 10, 3627);
    			attr_dev(div0, "class", "table-responsive border");
    			add_location(div0, file$8, 121, 8, 3579);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$8, 120, 6, 3553);
    			attr_dev(div2, "class", "row");
    			add_location(div2, file$8, 119, 4, 3529);
    			attr_dev(div3, "class", "container-flex");
    			add_location(div3, file$8, 115, 2, 3392);
    			add_location(main, file$8, 114, 0, 3383);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div3);
    			append_dev(div3, h4);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t3);
    			append_dev(tr, th1);
    			append_dev(tr, t5);
    			append_dev(tr, th2);
    			append_dev(tr, t7);
    			append_dev(tr, th3);
    			append_dev(tr, t9);
    			append_dev(tr, th4);
    			append_dev(table, t11);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*confirmOrder, orders, viewDetails, viewItem, viewDistributer*/ 31) {
    				each_value = /*orders*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Second', slots, []);
    	let orders = [];

    	onMount(() => {
    		fetchOrders();
    	});

    	const fetchOrders = async ids => {
    		const userDetils = JSON.parse(localStorage.getItem("admin_details"));

    		if (userDetils) {
    			const decodeToken = JSON.parse(atob(userDetils.token.split(".")[1]));
    			let inputs = { _id: decodeToken._id };

    			await fetch(`${API_URL}/marketeer/my_jobs`, {
    				method: "POST",
    				body: JSON.stringify(inputs),
    				headers: { "Content-Type": "application/json" }
    			}).then(response => response.json()).then(datas => {
    				$$invalidate(0, orders = datas.data.filter(item => item.status === 5));
    			});
    		}
    	};

    	const viewItem = async e => {
    		await fetch(`${API_URL}/products/list/${e}`, { method: "POST" }).then(response => response.json()).then(datas => {
    			sweetalert2_all.fire({
    				title: datas.data.title,
    				text: datas.data.category + ", " + datas.data.subCategory,
    				imageUrl: datas.data.image,
    				imageWidth: 100,
    				imageHeight: 200,
    				imageAlt: "Custom image"
    			});
    		});
    	};

    	const viewDetails = e => {
    		sweetalert2_all.fire({
    			title: "Order Details",
    			html: "<div><tr><b>Width : </b><i>" + e.width + "</i></tr></br><tr><b>Height : </b><i>" + e.height + "</i></tr></br><tr><b>ArcTop : </b><i>" + e.arcTop + "</i></tr></br><tr><b>ArcBottom : </b><i>" + e.arcBottom + "</i></tr></br><tr><b>Sandwich : </b><i>" + e.sandwich + "</i></tr></br><tr><b>Varnish : </b><i>" + e.varnish + "</i></tr></br><tr><b>WhiteCoat : </b><i>" + e.whiteCoat + "</i></tr></br><tr><b>Message : </b><i>" + e.message + "</i></tr></div>"
    		});
    	};

    	const viewDistributer = async e => {
    		await fetch(`${API_URL}/admin/distributer/read/${e}`, { method: "POST" }).then(response => response.json()).then(datas => {
    			sweetalert2_all.fire({
    				title: "Distributer Details",
    				html: "<div><tr><b>Name : </b><i>" + datas.data.name + "</i></tr></br><tr><b>Phone : </b><i>" + datas.data.phone + "</i></tr></br><tr><b>E mail : </b><i>" + datas.data.email + "</i></tr></br><tr><b>Base Price : </b><i>" + datas.data.basePrice + "</i></tr></br><tr><b>Delivery Price : </b><i>" + datas.data.deliveryPrice + "</i></tr></br><tr><b>Status : </b><i>" + datas.data.active + "</i></tr></br></div>"
    			});
    		});
    	};

    	const confirmOrder = async e => {
    		let bodyData = { _id: e, status: 6 };

    		const res = await fetch(`${API_URL}/order/order_status`, {
    			method: "post",
    			body: JSON.stringify(bodyData),
    			headers: { "Content-Type": "application/json" }
    		});

    		const json = await res.json();
    		console.log(json);

    		if (json.status === true) {
    			sweetalert2_all.fire({
    				position: "top-end",
    				icon: "success",
    				title: "Order Completed",
    				showConfirmButton: false,
    				timer: 500
    			});
    		}

    		fetchOrders();
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Second> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Swal: sweetalert2_all,
    		API_URL,
    		orders,
    		fetchOrders,
    		viewItem,
    		viewDetails,
    		viewDistributer,
    		confirmOrder
    	});

    	$$self.$inject_state = $$props => {
    		if ('orders' in $$props) $$invalidate(0, orders = $$props.orders);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [orders, viewItem, viewDetails, viewDistributer, confirmOrder];
    }

    class Second extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Second",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/pages/marketer/orders/completed.svelte generated by Svelte v3.44.1 */
    const file$7 = "src/pages/marketer/orders/completed.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (114:14) {#each orders as item}
    function create_each_block$5(ctx) {
    	let tr;
    	let td0;
    	let button0;
    	let t1;
    	let td1;
    	let button1;
    	let t3;
    	let td2;
    	let button2;
    	let t5;
    	let td3;
    	let h6;
    	let t6_value = /*item*/ ctx[5].shipping_address + "";
    	let t6;
    	let t7;
    	let td4;
    	let h5;
    	let t9;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			button0 = element("button");
    			button0.textContent = "Distributer";
    			t1 = space();
    			td1 = element("td");
    			button1 = element("button");
    			button1.textContent = "View";
    			t3 = space();
    			td2 = element("td");
    			button2 = element("button");
    			button2.textContent = "Order Details";
    			t5 = space();
    			td3 = element("td");
    			h6 = element("h6");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			h5 = element("h5");
    			h5.textContent = "Completed";
    			t9 = space();
    			attr_dev(button0, "class", "btn btn-link");
    			add_location(button0, file$7, 116, 20, 3506);
    			add_location(td0, file$7, 115, 18, 3481);
    			attr_dev(button1, "class", "btn btn-link");
    			add_location(button1, file$7, 123, 20, 3760);
    			add_location(td1, file$7, 122, 18, 3735);
    			attr_dev(button2, "class", "btn btn-link");
    			add_location(button2, file$7, 129, 20, 3992);
    			attr_dev(td2, "class", "text-center");
    			add_location(td2, file$7, 128, 18, 3947);
    			add_location(h6, file$7, 135, 42, 4241);
    			attr_dev(td3, "class", "text-center");
    			add_location(td3, file$7, 135, 18, 4217);
    			attr_dev(h5, "class", "text-success");
    			add_location(h5, file$7, 137, 20, 4342);
    			attr_dev(td4, "class", "text-center");
    			add_location(td4, file$7, 136, 18, 4297);
    			add_location(tr, file$7, 114, 16, 3458);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, button0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, button1);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, button2);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, h6);
    			append_dev(h6, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, h5);
    			append_dev(tr, t9);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						button0,
    						"click",
    						function () {
    							if (is_function(/*viewDistributer*/ ctx[3](/*item*/ ctx[5].order_placed_by))) /*viewDistributer*/ ctx[3](/*item*/ ctx[5].order_placed_by).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button1,
    						"click",
    						function () {
    							if (is_function(/*viewItem*/ ctx[1](/*item*/ ctx[5].product_id))) /*viewItem*/ ctx[1](/*item*/ ctx[5].product_id).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button2,
    						"click",
    						function () {
    							if (is_function(/*viewDetails*/ ctx[2](/*item*/ ctx[5].order_details))) /*viewDetails*/ ctx[2](/*item*/ ctx[5].order_details).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*orders*/ 1 && t6_value !== (t6_value = /*item*/ ctx[5].shipping_address + "")) set_data_dev(t6, t6_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(114:14) {#each orders as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let main;
    	let div3;
    	let h4;
    	let t1;
    	let div2;
    	let div1;
    	let div0;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t3;
    	let th1;
    	let t5;
    	let th2;
    	let t7;
    	let th3;
    	let t9;
    	let th4;
    	let t11;
    	let tbody;
    	let each_value = /*orders*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			div3 = element("div");
    			h4 = element("h4");
    			h4.textContent = "Completed List";
    			t1 = space();
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Order By";
    			t3 = space();
    			th1 = element("th");
    			th1.textContent = "Product";
    			t5 = space();
    			th2 = element("th");
    			th2.textContent = "Details";
    			t7 = space();
    			th3 = element("th");
    			th3.textContent = "Address";
    			t9 = space();
    			th4 = element("th");
    			th4.textContent = "Action";
    			t11 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h4, "class", "text-secondary text-center p-2 m-2 border-bottom");
    			add_location(h4, file$7, 96, 4, 2870);
    			add_location(th0, file$7, 105, 16, 3162);
    			add_location(th1, file$7, 106, 16, 3196);
    			add_location(th2, file$7, 107, 16, 3229);
    			add_location(th3, file$7, 108, 16, 3262);
    			add_location(th4, file$7, 109, 16, 3295);
    			add_location(tr, file$7, 104, 14, 3141);
    			add_location(thead, file$7, 103, 12, 3119);
    			attr_dev(tbody, "class", "m-auto align-item-center");
    			add_location(tbody, file$7, 112, 12, 3364);
    			attr_dev(table, "class", "table table-fill sortable");
    			add_location(table, file$7, 102, 10, 3065);
    			attr_dev(div0, "class", "table-responsive border");
    			add_location(div0, file$7, 101, 8, 3017);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$7, 100, 6, 2991);
    			attr_dev(div2, "class", "row");
    			add_location(div2, file$7, 99, 4, 2967);
    			attr_dev(div3, "class", "container-flex");
    			add_location(div3, file$7, 95, 2, 2837);
    			add_location(main, file$7, 94, 0, 2828);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div3);
    			append_dev(div3, h4);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t3);
    			append_dev(tr, th1);
    			append_dev(tr, t5);
    			append_dev(tr, th2);
    			append_dev(tr, t7);
    			append_dev(tr, th3);
    			append_dev(tr, t9);
    			append_dev(tr, th4);
    			append_dev(table, t11);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*orders, viewDetails, viewItem, viewDistributer*/ 15) {
    				each_value = /*orders*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Completed', slots, []);
    	let orders = [];

    	onMount(() => {
    		fetchOrders();
    	});

    	const fetchOrders = async ids => {
    		const userDetils = JSON.parse(localStorage.getItem("admin_details"));

    		if (userDetils) {
    			const decodeToken = JSON.parse(atob(userDetils.token.split(".")[1]));
    			let inputs = { _id: decodeToken._id };

    			await fetch(`${API_URL}/marketeer/my_jobs`, {
    				method: "POST",
    				body: JSON.stringify(inputs),
    				headers: { "Content-Type": "application/json" }
    			}).then(response => response.json()).then(datas => {
    				$$invalidate(0, orders = datas.data.filter(item => item.status === 6));
    			});
    		}
    	};

    	const viewItem = async e => {
    		await fetch(`${API_URL}/products/list/${e}`, { method: "POST" }).then(response => response.json()).then(datas => {
    			sweetalert2_all.fire({
    				title: datas.data.title,
    				text: datas.data.category + ", " + datas.data.subCategory,
    				imageUrl: datas.data.image,
    				imageWidth: 100,
    				imageHeight: 200,
    				imageAlt: "Custom image"
    			});
    		});
    	};

    	const viewDetails = e => {
    		sweetalert2_all.fire({
    			title: "Order Details",
    			html: "<div><tr><b>Width : </b><i>" + e.width + "</i></tr></br><tr><b>Height : </b><i>" + e.height + "</i></tr></br><tr><b>ArcTop : </b><i>" + e.arcTop + "</i></tr></br><tr><b>ArcBottom : </b><i>" + e.arcBottom + "</i></tr></br><tr><b>Sandwich : </b><i>" + e.sandwich + "</i></tr></br><tr><b>Varnish : </b><i>" + e.varnish + "</i></tr></br><tr><b>WhiteCoat : </b><i>" + e.whiteCoat + "</i></tr></br><tr><b>Message : </b><i>" + e.message + "</i></tr></div>"
    		});
    	};

    	const viewDistributer = async e => {
    		await fetch(`${API_URL}/admin/distributer/read/${e}`, { method: "POST" }).then(response => response.json()).then(datas => {
    			sweetalert2_all.fire({
    				title: "Distributer Details",
    				html: "<div><tr><b>Name : </b><i>" + datas.data.name + "</i></tr></br><tr><b>Phone : </b><i>" + datas.data.phone + "</i></tr></br><tr><b>E mail : </b><i>" + datas.data.email + "</i></tr></br><tr><b>Base Price : </b><i>" + datas.data.basePrice + "</i></tr></br><tr><b>Delivery Price : </b><i>" + datas.data.deliveryPrice + "</i></tr></br><tr><b>Status : </b><i>" + datas.data.active + "</i></tr></br></div>"
    			});
    		});
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Completed> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Swal: sweetalert2_all,
    		API_URL,
    		orders,
    		fetchOrders,
    		viewItem,
    		viewDetails,
    		viewDistributer
    	});

    	$$self.$inject_state = $$props => {
    		if ('orders' in $$props) $$invalidate(0, orders = $$props.orders);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [orders, viewItem, viewDetails, viewDistributer];
    }

    class Completed extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Completed",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/pages/marketer/product/products.svelte generated by Svelte v3.44.1 */
    const file$6 = "src/pages/marketer/product/products.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	return child_ctx;
    }

    // (76:24) {#each categories as item}
    function create_each_block_2(ctx) {
    	let option;
    	let t_value = /*item*/ ctx[16].category + "";
    	let t;
    	let option_key_value;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			attr_dev(option, "key", option_key_value = /*item*/ ctx[16]._id);
    			option.__value = option_value_value = /*item*/ ctx[16].category;
    			option.value = option.__value;
    			add_location(option, file$6, 76, 28, 1946);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*categories*/ 1 && t_value !== (t_value = /*item*/ ctx[16].category + "")) set_data_dev(t, t_value);

    			if (dirty & /*categories*/ 1 && option_key_value !== (option_key_value = /*item*/ ctx[16]._id)) {
    				attr_dev(option, "key", option_key_value);
    			}

    			if (dirty & /*categories*/ 1 && option_value_value !== (option_value_value = /*item*/ ctx[16].category)) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(76:24) {#each categories as item}",
    		ctx
    	});

    	return block;
    }

    // (84:24) {#each sCate as item}
    function create_each_block_1(ctx) {
    	let option;
    	let t_value = /*item*/ ctx[16] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*item*/ ctx[16];
    			option.value = option.__value;
    			add_location(option, file$6, 84, 28, 2374);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*sCate*/ 4 && t_value !== (t_value = /*item*/ ctx[16] + "")) set_data_dev(t, t_value);

    			if (dirty & /*sCate*/ 4 && option_value_value !== (option_value_value = /*item*/ ctx[16])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(84:24) {#each sCate as item}",
    		ctx
    	});

    	return block;
    }

    // (93:12) {#if products !== ""}
    function create_if_block_1$3(ctx) {
    	let div;
    	let each_value = /*products*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "row justify-content-center");
    			add_location(div, file$6, 93, 16, 2712);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*viewItem, products, API_URL*/ 66) {
    				each_value = /*products*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(93:12) {#if products !== \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    // (95:20) {#each products as datas}
    function create_each_block$4(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let h5;
    	let t1_value = /*datas*/ ctx[13].title + "";
    	let t1;
    	let t2;
    	let p0;
    	let t3_value = /*datas*/ ctx[13].category + "";
    	let t3;
    	let t4;
    	let p1;
    	let i;
    	let t5_value = /*datas*/ ctx[13].subCategory + "";
    	let t5;
    	let t6;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			h5 = element("h5");
    			t1 = text(t1_value);
    			t2 = space();
    			p0 = element("p");
    			t3 = text(t3_value);
    			t4 = space();
    			p1 = element("p");
    			i = element("i");
    			t5 = text(t5_value);
    			t6 = space();
    			if (!src_url_equal(img.src, img_src_value = `${API_URL}/products/images/${/*datas*/ ctx[13].image}`)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "images");
    			attr_dev(img, "class", "svelte-140ybzt");
    			add_location(img, file$6, 98, 32, 3009);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file$6, 97, 28, 2959);
    			attr_dev(h5, "class", "m-2 ");
    			add_location(h5, file$6, 101, 32, 3192);
    			attr_dev(p0, "class", "m-2 ");
    			add_location(p0, file$6, 102, 32, 3260);
    			add_location(i, file$6, 103, 48, 3345);
    			attr_dev(p1, "class", "m-2 ");
    			add_location(p1, file$6, 103, 32, 3329);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$6, 100, 28, 3142);
    			attr_dev(div2, "class", "row p-3");
    			add_location(div2, file$6, 96, 24, 2909);
    			attr_dev(div3, "class", "card rounded-lg col-sm-5 svelte-140ybzt");
    			add_location(div3, file$6, 95, 20, 2819);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, img);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, h5);
    			append_dev(h5, t1);
    			append_dev(div1, t2);
    			append_dev(div1, p0);
    			append_dev(p0, t3);
    			append_dev(div1, t4);
    			append_dev(div1, p1);
    			append_dev(p1, i);
    			append_dev(i, t5);
    			append_dev(div3, t6);

    			if (!mounted) {
    				dispose = listen_dev(
    					div3,
    					"click",
    					function () {
    						if (is_function(/*viewItem*/ ctx[6](/*datas*/ ctx[13]))) /*viewItem*/ ctx[6](/*datas*/ ctx[13]).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*products*/ 2 && !src_url_equal(img.src, img_src_value = `${API_URL}/products/images/${/*datas*/ ctx[13].image}`)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*products*/ 2 && t1_value !== (t1_value = /*datas*/ ctx[13].title + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*products*/ 2 && t3_value !== (t3_value = /*datas*/ ctx[13].category + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*products*/ 2 && t5_value !== (t5_value = /*datas*/ ctx[13].subCategory + "")) set_data_dev(t5, t5_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(95:20) {#each products as datas}",
    		ctx
    	});

    	return block;
    }

    // (111:12) {#if products == ""}
    function create_if_block$4(ctx) {
    	let div;
    	let h5;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h5 = element("h5");
    			h5.textContent = "Select Category to list Products..";
    			attr_dev(h5, "class", "text-secondary p-2 ");
    			add_location(h5, file$6, 112, 20, 3650);
    			attr_dev(div, "class", "row justify-content-center");
    			add_location(div, file$6, 111, 16, 3589);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h5);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(111:12) {#if products == \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let main;
    	let div5;
    	let h4;
    	let t1;
    	let div4;
    	let div3;
    	let div0;
    	let select0;
    	let option0;
    	let t3;
    	let div1;
    	let select1;
    	let option1;
    	let t5;
    	let div2;
    	let button;
    	let t7;
    	let t8;
    	let mounted;
    	let dispose;
    	let each_value_2 = /*categories*/ ctx[0];
    	validate_each_argument(each_value_2);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value_1 = /*sCate*/ ctx[2];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let if_block0 = /*products*/ ctx[1] !== "" && create_if_block_1$3(ctx);
    	let if_block1 = /*products*/ ctx[1] == "" && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div5 = element("div");
    			h4 = element("h4");
    			h4.textContent = "Product Listing";
    			t1 = space();
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			select0 = element("select");
    			option0 = element("option");
    			option0.textContent = "Category.. ";

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t3 = space();
    			div1 = element("div");
    			select1 = element("select");
    			option1 = element("option");
    			option1.textContent = "Sub Category.. ";

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t5 = space();
    			div2 = element("div");
    			button = element("button");
    			button.textContent = "Search";
    			t7 = space();
    			if (if_block0) if_block0.c();
    			t8 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(h4, "class", "heading text-center p-2  svelte-140ybzt");
    			add_location(h4, file$6, 69, 8, 1493);
    			option0.__value = "";
    			option0.value = option0.__value;
    			add_location(option0, file$6, 74, 24, 1829);
    			attr_dev(select0, "class", "form-control form-select svelte-140ybzt");
    			if (/*inputs*/ ctx[3].category === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[8].call(select0));
    			add_location(select0, file$6, 73, 20, 1703);
    			attr_dev(div0, "class", "col-sm-4");
    			add_location(div0, file$6, 72, 16, 1660);
    			option1.__value = "";
    			option1.value = option1.__value;
    			add_location(option1, file$6, 82, 24, 2258);
    			attr_dev(select1, "class", "form-control form-select svelte-140ybzt");
    			if (/*inputs*/ ctx[3].subCategory === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[9].call(select1));
    			add_location(select1, file$6, 81, 20, 2160);
    			attr_dev(div1, "class", "col-sm-4");
    			add_location(div1, file$6, 80, 16, 2117);
    			attr_dev(button, "class", "btn btn-create svelte-140ybzt");
    			add_location(button, file$6, 89, 20, 2555);
    			attr_dev(div2, "class", "col-sm-2");
    			add_location(div2, file$6, 88, 16, 2512);
    			attr_dev(div3, "class", "row justify-content-center m-auto");
    			add_location(div3, file$6, 71, 12, 1596);
    			attr_dev(div4, "class", "border-top");
    			add_location(div4, file$6, 70, 8, 1559);
    			attr_dev(div5, "class", "container border");
    			add_location(div5, file$6, 68, 4, 1454);
    			add_location(main, file$6, 67, 0, 1443);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div5);
    			append_dev(div5, h4);
    			append_dev(div5, t1);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div0, select0);
    			append_dev(select0, option0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(select0, null);
    			}

    			select_option(select0, /*inputs*/ ctx[3].category);
    			append_dev(div3, t3);
    			append_dev(div3, div1);
    			append_dev(div1, select1);
    			append_dev(select1, option1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select1, null);
    			}

    			select_option(select1, /*inputs*/ ctx[3].subCategory);
    			append_dev(div3, t5);
    			append_dev(div3, div2);
    			append_dev(div2, button);
    			append_dev(div4, t7);
    			if (if_block0) if_block0.m(div4, null);
    			append_dev(div4, t8);
    			if (if_block1) if_block1.m(div4, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select0, "change", /*change_handler*/ ctx[7], false, false, false),
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[8]),
    					listen_dev(select1, "change", /*select1_change_handler*/ ctx[9]),
    					listen_dev(button, "click", /*search*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*categories*/ 1) {
    				each_value_2 = /*categories*/ ctx[0];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(select0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_2.length;
    			}

    			if (dirty & /*inputs, categories*/ 9) {
    				select_option(select0, /*inputs*/ ctx[3].category);
    			}

    			if (dirty & /*sCate*/ 4) {
    				each_value_1 = /*sCate*/ ctx[2];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (dirty & /*inputs, categories*/ 9) {
    				select_option(select1, /*inputs*/ ctx[3].subCategory);
    			}

    			if (/*products*/ ctx[1] !== "") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$3(ctx);
    					if_block0.c();
    					if_block0.m(div4, t8);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*products*/ ctx[1] == "") {
    				if (if_block1) ; else {
    					if_block1 = create_if_block$4(ctx);
    					if_block1.c();
    					if_block1.m(div4, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Products', slots, []);
    	let categories = [];
    	let products = [];
    	let sCate = [];
    	let selectedCate;

    	let inputs = {
    		skip: "",
    		limit: "",
    		category: "",
    		subCategory: ""
    	};

    	onMount(async () => {
    		fetchCategory();
    	}); // fetchProduct()

    	const fetchCategory = async () => {
    		await fetch(`${API_URL}/products/category/list`, { method: 'POST' }).then(response => response.json()).then(datas => {
    			$$invalidate(0, categories = datas.data);
    		});
    	};

    	const cateChange = e => {
    		selectedCate = e.target.value;

    		if (selectedCate == "" || selectedCate == "undefined") {
    			$$invalidate(2, sCate = []);
    		} else {
    			let cate = categories.find(tmp => tmp.category === selectedCate);
    			$$invalidate(2, sCate = cate.subCategory);
    		}
    	};

    	const fetchProduct = async () => {
    		await fetch(`${API_URL}/products/list`, {
    			method: 'POST',
    			body: JSON.stringify(inputs),
    			headers: { 'Content-Type': 'application/json' }
    		}).then(response => response.json()).then(datas => {
    			$$invalidate(1, products = datas.data);
    		});
    	};

    	const search = async () => {
    		fetchProduct();
    	};

    	const viewItem = e => {
    		sweetalert2_all.fire({
    			title: e.title,
    			text: e.category + ' ' + e.subCategory,
    			imageUrl: `${API_URL}/products/images/${e.image}`,
    			imageWidth: 100,
    			imageHeight: 200,
    			imageAlt: 'Custom image',
    			showConfirmButton: false
    		});
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Products> was created with unknown prop '${key}'`);
    	});

    	const change_handler = e => cateChange(e);

    	function select0_change_handler() {
    		inputs.category = select_value(this);
    		$$invalidate(3, inputs);
    		$$invalidate(0, categories);
    	}

    	function select1_change_handler() {
    		inputs.subCategory = select_value(this);
    		$$invalidate(3, inputs);
    		$$invalidate(0, categories);
    	}

    	$$self.$capture_state = () => ({
    		API_URL,
    		onMount,
    		Swal: sweetalert2_all,
    		categories,
    		products,
    		sCate,
    		selectedCate,
    		inputs,
    		fetchCategory,
    		cateChange,
    		fetchProduct,
    		search,
    		viewItem
    	});

    	$$self.$inject_state = $$props => {
    		if ('categories' in $$props) $$invalidate(0, categories = $$props.categories);
    		if ('products' in $$props) $$invalidate(1, products = $$props.products);
    		if ('sCate' in $$props) $$invalidate(2, sCate = $$props.sCate);
    		if ('selectedCate' in $$props) selectedCate = $$props.selectedCate;
    		if ('inputs' in $$props) $$invalidate(3, inputs = $$props.inputs);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		categories,
    		products,
    		sCate,
    		inputs,
    		cateChange,
    		search,
    		viewItem,
    		change_handler,
    		select0_change_handler,
    		select1_change_handler
    	];
    }

    class Products extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Products",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/pages/marketer/product/search.svelte generated by Svelte v3.44.1 */
    const file$5 = "src/pages/marketer/product/search.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    // (90:16) {#if products !== ""}
    function create_if_block_1$2(ctx) {
    	let div;
    	let each_value = /*products*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "row justify-content-center");
    			add_location(div, file$5, 90, 20, 3338);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*products, API_URL*/ 1) {
    				each_value = /*products*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(90:16) {#if products !== \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    // (92:24) {#each products as datas}
    function create_each_block$3(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let h5;
    	let t1;
    	let t2_value = /*datas*/ ctx[10].title + "";
    	let t2;
    	let t3;
    	let p0;
    	let t4;
    	let b0;
    	let t5_value = /*datas*/ ctx[10].category + "";
    	let t5;
    	let t6;
    	let p1;
    	let t7;
    	let b1;
    	let t8_value = /*datas*/ ctx[10].subCategory + "";
    	let t8;
    	let t9;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			h5 = element("h5");
    			t1 = text("Name: ");
    			t2 = text(t2_value);
    			t3 = space();
    			p0 = element("p");
    			t4 = text("Category: ");
    			b0 = element("b");
    			t5 = text(t5_value);
    			t6 = space();
    			p1 = element("p");
    			t7 = text("Sub-Category: ");
    			b1 = element("b");
    			t8 = text(t8_value);
    			t9 = space();
    			if (!src_url_equal(img.src, img_src_value = `${API_URL}/products/images/${/*datas*/ ctx[10].image}`)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "images");
    			attr_dev(img, "class", "svelte-gz5uls");
    			add_location(img, file$5, 95, 36, 3635);
    			attr_dev(div0, "class", "col-sm-4 ");
    			add_location(div0, file$5, 94, 32, 3575);
    			attr_dev(h5, "class", "m-2 ");
    			add_location(h5, file$5, 98, 36, 3830);
    			add_location(b0, file$5, 99, 62, 3934);
    			attr_dev(p0, "class", "m-2 ");
    			add_location(p0, file$5, 99, 36, 3908);
    			add_location(b1, file$5, 100, 66, 4028);
    			attr_dev(p1, "class", "m-2 ");
    			add_location(p1, file$5, 100, 36, 3998);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$5, 97, 32, 3776);
    			attr_dev(div2, "class", "row p-3");
    			add_location(div2, file$5, 93, 28, 3521);
    			attr_dev(div3, "class", "card rounded-lg col-sm-10 svelte-gz5uls");
    			add_location(div3, file$5, 92, 24, 3453);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, img);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, h5);
    			append_dev(h5, t1);
    			append_dev(h5, t2);
    			append_dev(div1, t3);
    			append_dev(div1, p0);
    			append_dev(p0, t4);
    			append_dev(p0, b0);
    			append_dev(b0, t5);
    			append_dev(div1, t6);
    			append_dev(div1, p1);
    			append_dev(p1, t7);
    			append_dev(p1, b1);
    			append_dev(b1, t8);
    			append_dev(div3, t9);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*products*/ 1 && !src_url_equal(img.src, img_src_value = `${API_URL}/products/images/${/*datas*/ ctx[10].image}`)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*products*/ 1 && t2_value !== (t2_value = /*datas*/ ctx[10].title + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*products*/ 1 && t5_value !== (t5_value = /*datas*/ ctx[10].category + "")) set_data_dev(t5, t5_value);
    			if (dirty & /*products*/ 1 && t8_value !== (t8_value = /*datas*/ ctx[10].subCategory + "")) set_data_dev(t8, t8_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(92:24) {#each products as datas}",
    		ctx
    	});

    	return block;
    }

    // (108:16) {#if products == ""}
    function create_if_block$3(ctx) {
    	let div;
    	let h5;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h5 = element("h5");
    			h5.textContent = "No Products..";
    			attr_dev(h5, "class", "text-secondary p-4 m-4 ");
    			add_location(h5, file$5, 109, 24, 4369);
    			attr_dev(div, "class", "row justify-content-center");
    			add_location(div, file$5, 108, 20, 4304);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h5);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(108:16) {#if products == \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let main;
    	let div5;
    	let h4;
    	let t1;
    	let div4;
    	let div2;
    	let div0;
    	let input;
    	let t2;
    	let div1;
    	let button;
    	let t4;
    	let div3;
    	let p;
    	let b;
    	let t5_value = /*message*/ ctx[2].msg + "";
    	let t5;
    	let p_class_value;
    	let t6;
    	let t7;
    	let mounted;
    	let dispose;
    	let if_block0 = /*products*/ ctx[0] !== "" && create_if_block_1$2(ctx);
    	let if_block1 = /*products*/ ctx[0] == "" && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div5 = element("div");
    			h4 = element("h4");
    			h4.textContent = "Product Search";
    			t1 = space();
    			div4 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			input = element("input");
    			t2 = space();
    			div1 = element("div");
    			button = element("button");
    			button.textContent = "Search";
    			t4 = space();
    			div3 = element("div");
    			p = element("p");
    			b = element("b");
    			t5 = text(t5_value);
    			t6 = space();
    			if (if_block0) if_block0.c();
    			t7 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(h4, "class", "heading text-center p-2  svelte-gz5uls");
    			add_location(h4, file$5, 58, 12, 1596);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "form-control form-input svelte-gz5uls");
    			attr_dev(input, "placeholder", "Product Name");
    			attr_dev(input, "id", "searchIn");
    			add_location(input, file$5, 62, 24, 1798);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file$5, 61, 20, 1756);
    			attr_dev(button, "class", "btn btn-create svelte-gz5uls");
    			add_location(button, file$5, 65, 24, 2012);
    			attr_dev(div1, "class", "col-sm-3");
    			add_location(div1, file$5, 64, 20, 1965);
    			attr_dev(div2, "class", "row m-auto pt-2");
    			add_location(div2, file$5, 60, 16, 1706);
    			add_location(b, file$5, 87, 47, 3232);
    			attr_dev(p, "class", p_class_value = "" + (null_to_empty(/*message*/ ctx[2].style) + " svelte-gz5uls"));
    			add_location(p, file$5, 87, 20, 3205);
    			attr_dev(div3, "class", "container row m-auto justify-content-center");
    			add_location(div3, file$5, 86, 16, 3127);
    			attr_dev(div4, "class", "border-top");
    			add_location(div4, file$5, 59, 12, 1665);
    			attr_dev(div5, "class", "container border");
    			add_location(div5, file$5, 57, 8, 1553);
    			add_location(main, file$5, 56, 4, 1538);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div5);
    			append_dev(div5, h4);
    			append_dev(div5, t1);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div2, div0);
    			append_dev(div0, input);
    			set_input_value(input, /*inputs*/ ctx[1].title);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, button);
    			append_dev(div4, t4);
    			append_dev(div4, div3);
    			append_dev(div3, p);
    			append_dev(p, b);
    			append_dev(b, t5);
    			append_dev(div4, t6);
    			if (if_block0) if_block0.m(div4, null);
    			append_dev(div4, t7);
    			if (if_block1) if_block1.m(div4, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[4]),
    					listen_dev(button, "click", /*search*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*inputs*/ 2 && input.value !== /*inputs*/ ctx[1].title) {
    				set_input_value(input, /*inputs*/ ctx[1].title);
    			}

    			if (dirty & /*message*/ 4 && t5_value !== (t5_value = /*message*/ ctx[2].msg + "")) set_data_dev(t5, t5_value);

    			if (dirty & /*message*/ 4 && p_class_value !== (p_class_value = "" + (null_to_empty(/*message*/ ctx[2].style) + " svelte-gz5uls"))) {
    				attr_dev(p, "class", p_class_value);
    			}

    			if (/*products*/ ctx[0] !== "") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$2(ctx);
    					if_block0.c();
    					if_block0.m(div4, t7);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*products*/ ctx[0] == "") {
    				if (if_block1) ; else {
    					if_block1 = create_if_block$3(ctx);
    					if_block1.c();
    					if_block1.m(div4, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Search', slots, []);
    	let categories = [];
    	let products = [];
    	let sCate = [];
    	let selectedCate;
    	let inputs = { title: "", category: "", subCategory: "" };
    	let message = { msg: "", style: "" };

    	onMount(async () => {
    		
    	}); // fetchCategory()

    	const fetchCategory = async () => {
    		await fetch(`${API_URL}/products/category/list`, { method: 'POST' }).then(response => response.json()).then(datas => {
    			categories = datas.data;
    		});
    	};

    	const cateChange = e => {
    		selectedCate = e.target.value;

    		if (selectedCate == "" || selectedCate == "undefined") {
    			sCate = [];
    		} else {
    			let cate = categories.find(tmp => tmp.category === selectedCate);
    			sCate = cate.subCategory;
    		}
    	};

    	const search = async () => {
    		if (inputs.title != '') {
    			await fetch(`${API_URL}/products/search`, {
    				method: 'POST',
    				body: JSON.stringify(inputs),
    				headers: { 'Content-Type': 'application/json' }
    			}).then(response => response.json()).then(datas => {
    				$$invalidate(0, products = datas.data);
    			});
    		} else {
    			$$invalidate(2, message.style = 'text-danger', message);
    			$$invalidate(2, message.msg = 'Enter Product Name', message);
    			const val = document.getElementById('searchIn');
    			val.focus();
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Search> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		inputs.title = this.value;
    		$$invalidate(1, inputs);
    	}

    	$$self.$capture_state = () => ({
    		API_URL,
    		onMount,
    		categories,
    		products,
    		sCate,
    		selectedCate,
    		inputs,
    		message,
    		fetchCategory,
    		cateChange,
    		search
    	});

    	$$self.$inject_state = $$props => {
    		if ('categories' in $$props) categories = $$props.categories;
    		if ('products' in $$props) $$invalidate(0, products = $$props.products);
    		if ('sCate' in $$props) sCate = $$props.sCate;
    		if ('selectedCate' in $$props) selectedCate = $$props.selectedCate;
    		if ('inputs' in $$props) $$invalidate(1, inputs = $$props.inputs);
    		if ('message' in $$props) $$invalidate(2, message = $$props.message);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [products, inputs, message, search, input_input_handler];
    }

    class Search extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Search",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/pages/marketer/user/users.svelte generated by Svelte v3.44.1 */
    const file$4 = "src/pages/marketer/user/users.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (37:12) {#each distributers as user}
    function create_each_block$2(ctx) {
    	let a;
    	let div;
    	let h4;
    	let t0_value = /*user*/ ctx[4].name + "";
    	let t0;
    	let t1;
    	let h6;
    	let t2;
    	let b0;
    	let t3_value = /*user*/ ctx[4].phone + "";
    	let t3;
    	let t4;
    	let p;
    	let t5;
    	let b1;
    	let t6_value = /*user*/ ctx[4].active + "";
    	let t6;
    	let t7;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			div = element("div");
    			h4 = element("h4");
    			t0 = text(t0_value);
    			t1 = space();
    			h6 = element("h6");
    			t2 = text("Phone: ");
    			b0 = element("b");
    			t3 = text(t3_value);
    			t4 = space();
    			p = element("p");
    			t5 = text("Status: ");
    			b1 = element("b");
    			t6 = text(t6_value);
    			t7 = space();
    			add_location(h4, file$4, 39, 24, 1009);
    			add_location(b0, file$4, 40, 35, 1065);
    			add_location(h6, file$4, 40, 24, 1054);
    			add_location(b1, file$4, 41, 35, 1125);
    			attr_dev(p, "class", "svelte-268xi9");
    			add_location(p, file$4, 41, 24, 1114);
    			attr_dev(div, "class", "card-info svelte-268xi9");
    			add_location(div, file$4, 38, 20, 961);
    			attr_dev(a, "class", "col-sm-3 card card-user svelte-268xi9");
    			attr_dev(a, "href", a_href_value = "/marketer/user_list/" + /*user*/ ctx[4]._id);
    			add_location(a, file$4, 37, 16, 867);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, div);
    			append_dev(div, h4);
    			append_dev(h4, t0);
    			append_dev(div, t1);
    			append_dev(div, h6);
    			append_dev(h6, t2);
    			append_dev(h6, b0);
    			append_dev(b0, t3);
    			append_dev(div, t4);
    			append_dev(div, p);
    			append_dev(p, t5);
    			append_dev(p, b1);
    			append_dev(b1, t6);
    			append_dev(a, t7);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*distributers*/ 1 && t0_value !== (t0_value = /*user*/ ctx[4].name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*distributers*/ 1 && t3_value !== (t3_value = /*user*/ ctx[4].phone + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*distributers*/ 1 && t6_value !== (t6_value = /*user*/ ctx[4].active + "")) set_data_dev(t6, t6_value);

    			if (dirty & /*distributers*/ 1 && a_href_value !== (a_href_value = "/marketer/user_list/" + /*user*/ ctx[4]._id)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(37:12) {#each distributers as user}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let main;
    	let div2;
    	let div1;
    	let h4;
    	let t1;
    	let div0;
    	let each_value = /*distributers*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			div2 = element("div");
    			div1 = element("div");
    			h4 = element("h4");
    			h4.textContent = "Distributers";
    			t1 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h4, "class", "heading text-center p-2 border-bottom svelte-268xi9");
    			add_location(h4, file$4, 34, 8, 693);
    			attr_dev(div0, "class", "row justify-content-center");
    			add_location(div0, file$4, 35, 8, 769);
    			attr_dev(div1, "class", "border");
    			add_location(div1, file$4, 33, 4, 664);
    			attr_dev(div2, "class", "container pt-4");
    			add_location(div2, file$4, 32, 0, 631);
    			add_location(main, file$4, 31, 0, 624);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div2);
    			append_dev(div2, div1);
    			append_dev(div1, h4);
    			append_dev(div1, t1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*distributers*/ 1) {
    				each_value = /*distributers*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Users', slots, []);
    	let distributers = [];
    	let inputs = { skip: '', limit: 10 };
    	let totalCount;

    	onMount(async () => {
    		fetchMarketer();
    	});

    	const fetchMarketer = async () => {
    		await fetch(`${API_URL}/admin/distributer/read`, {
    			method: 'POST',
    			body: JSON.stringify(inputs),
    			headers: { 'Content-Type': 'application/json' }
    		}).then(response => response.json()).then(datas => {
    			$$invalidate(0, distributers = datas.data.distributer);
    			totalCount = datas.data.count;
    		});
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Users> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		API_URL,
    		distributers,
    		inputs,
    		totalCount,
    		fetchMarketer
    	});

    	$$self.$inject_state = $$props => {
    		if ('distributers' in $$props) $$invalidate(0, distributers = $$props.distributers);
    		if ('inputs' in $$props) inputs = $$props.inputs;
    		if ('totalCount' in $$props) totalCount = $$props.totalCount;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [distributers];
    }

    class Users extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Users",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/pages/marketer/user/userView.svelte generated by Svelte v3.44.1 */
    const file$3 = "src/pages/marketer/user/userView.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (84:4) {#if inputs.name != ""}
    function create_if_block$2(ctx) {
    	let div9;
    	let h4;
    	let t0_value = /*inputs*/ ctx[0].name + "";
    	let t0;
    	let t1;
    	let t2;
    	let ul;
    	let li0;
    	let a0;
    	let t4;
    	let li1;
    	let a1;
    	let t6;
    	let div8;
    	let div2;
    	let div0;
    	let table0;
    	let tbody0;
    	let tr0;
    	let td0;
    	let t8;
    	let th0;
    	let t9_value = /*inputs*/ ctx[0].name + "";
    	let t9;
    	let t10;
    	let tr1;
    	let td1;
    	let t12;
    	let th1;
    	let t13_value = /*inputs*/ ctx[0].email + "";
    	let t13;
    	let t14;
    	let tr2;
    	let td2;
    	let t16;
    	let th2;
    	let t17_value = /*inputs*/ ctx[0].phone + "";
    	let t17;
    	let t18;
    	let tr3;
    	let td3;
    	let t20;
    	let th3;
    	let t21_value = /*inputs*/ ctx[0].basePrice + "";
    	let t21;
    	let t22;
    	let tr4;
    	let td4;
    	let t24;
    	let th4;
    	let t25_value = /*inputs*/ ctx[0].deliveryPrice + "";
    	let t25;
    	let t26;
    	let tr5;
    	let td5;
    	let t28;
    	let th5;
    	let t29_value = /*inputs*/ ctx[0].address + "";
    	let t29;
    	let t30;
    	let tr6;
    	let td6;
    	let t32;
    	let th6;
    	let t33_value = /*inputs*/ ctx[0].active + "";
    	let t33;
    	let t34;
    	let div1;
    	let a2;
    	let t36;
    	let div7;
    	let div6;
    	let h6;
    	let t38;
    	let div5;
    	let div4;
    	let div3;
    	let table1;
    	let thead;
    	let tr7;
    	let th7;
    	let t40;
    	let th8;
    	let t42;
    	let th9;
    	let t44;
    	let th10;
    	let t46;
    	let th11;
    	let t48;
    	let tbody1;
    	let each_value = /*myJobs*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			h4 = element("h4");
    			t0 = text(t0_value);
    			t1 = text(" Details");
    			t2 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "Details";
    			t4 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "Orders";
    			t6 = space();
    			div8 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			table0 = element("table");
    			tbody0 = element("tbody");
    			tr0 = element("tr");
    			td0 = element("td");
    			td0.textContent = "Name:";
    			t8 = space();
    			th0 = element("th");
    			t9 = text(t9_value);
    			t10 = space();
    			tr1 = element("tr");
    			td1 = element("td");
    			td1.textContent = "E-Mail:";
    			t12 = space();
    			th1 = element("th");
    			t13 = text(t13_value);
    			t14 = space();
    			tr2 = element("tr");
    			td2 = element("td");
    			td2.textContent = "Mobile:";
    			t16 = space();
    			th2 = element("th");
    			t17 = text(t17_value);
    			t18 = space();
    			tr3 = element("tr");
    			td3 = element("td");
    			td3.textContent = "Base Price:";
    			t20 = space();
    			th3 = element("th");
    			t21 = text(t21_value);
    			t22 = space();
    			tr4 = element("tr");
    			td4 = element("td");
    			td4.textContent = "Delivery Price:";
    			t24 = space();
    			th4 = element("th");
    			t25 = text(t25_value);
    			t26 = space();
    			tr5 = element("tr");
    			td5 = element("td");
    			td5.textContent = "Address:";
    			t28 = space();
    			th5 = element("th");
    			t29 = text(t29_value);
    			t30 = space();
    			tr6 = element("tr");
    			td6 = element("td");
    			td6.textContent = "Status:";
    			t32 = space();
    			th6 = element("th");
    			t33 = text(t33_value);
    			t34 = space();
    			div1 = element("div");
    			a2 = element("a");
    			a2.textContent = "Back";
    			t36 = space();
    			div7 = element("div");
    			div6 = element("div");
    			h6 = element("h6");
    			h6.textContent = "Ordered List:";
    			t38 = space();
    			div5 = element("div");
    			div4 = element("div");
    			div3 = element("div");
    			table1 = element("table");
    			thead = element("thead");
    			tr7 = element("tr");
    			th7 = element("th");
    			th7.textContent = "Product";
    			t40 = space();
    			th8 = element("th");
    			th8.textContent = "Details";
    			t42 = space();
    			th9 = element("th");
    			th9.textContent = "Category";
    			t44 = space();
    			th10 = element("th");
    			th10.textContent = "Address";
    			t46 = space();
    			th11 = element("th");
    			th11.textContent = "Status";
    			t48 = space();
    			tbody1 = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h4, "id", "heading");
    			attr_dev(h4, "class", "text-center text-capitalize  svelte-1ovm4ti");
    			add_location(h4, file$3, 85, 8, 2398);
    			attr_dev(a0, "data-toggle", "tab");
    			attr_dev(a0, "href", "#detail");
    			attr_dev(a0, "role", "tab");
    			attr_dev(a0, "class", "nav-link active");
    			add_location(a0, file$3, 90, 12, 2631);
    			attr_dev(li0, "class", "nav-item flex-sm-fill");
    			add_location(li0, file$3, 89, 10, 2584);
    			attr_dev(a1, "data-toggle", "tab");
    			attr_dev(a1, "href", "#orders");
    			attr_dev(a1, "role", "tab");
    			attr_dev(a1, "class", "nav-link");
    			add_location(a1, file$3, 98, 12, 2856);
    			attr_dev(li1, "class", "nav-item flex-sm-fill");
    			add_location(li1, file$3, 97, 10, 2809);
    			attr_dev(ul, "role", "tablist");
    			attr_dev(ul, "class", "nav nav-tabs mt-3 mb-3 pt-4 border-top");
    			add_location(ul, file$3, 88, 8, 2507);
    			add_location(td0, file$3, 109, 20, 3270);
    			attr_dev(th0, "class", "svelte-1ovm4ti");
    			add_location(th0, file$3, 110, 20, 3305);
    			add_location(tr0, file$3, 108, 18, 3245);
    			add_location(td1, file$3, 113, 20, 3395);
    			attr_dev(th1, "class", "svelte-1ovm4ti");
    			add_location(th1, file$3, 114, 20, 3432);
    			add_location(tr1, file$3, 112, 18, 3370);
    			add_location(td2, file$3, 117, 20, 3523);
    			attr_dev(th2, "class", "svelte-1ovm4ti");
    			add_location(th2, file$3, 118, 20, 3560);
    			add_location(tr2, file$3, 116, 18, 3498);
    			add_location(td3, file$3, 121, 20, 3651);
    			attr_dev(th3, "class", "svelte-1ovm4ti");
    			add_location(th3, file$3, 122, 20, 3692);
    			add_location(tr3, file$3, 120, 18, 3626);
    			add_location(td4, file$3, 125, 20, 3787);
    			attr_dev(th4, "class", "svelte-1ovm4ti");
    			add_location(th4, file$3, 126, 20, 3832);
    			add_location(tr4, file$3, 124, 18, 3762);
    			add_location(td5, file$3, 129, 20, 3931);
    			attr_dev(th5, "class", "svelte-1ovm4ti");
    			add_location(th5, file$3, 130, 20, 3969);
    			add_location(tr5, file$3, 128, 18, 3906);
    			add_location(td6, file$3, 133, 20, 4062);
    			attr_dev(th6, "class", "svelte-1ovm4ti");
    			add_location(th6, file$3, 134, 20, 4099);
    			add_location(tr6, file$3, 132, 18, 4037);
    			add_location(tbody0, file$3, 107, 16, 3219);
    			attr_dev(table0, "class", "table  svelte-1ovm4ti");
    			add_location(table0, file$3, 106, 14, 3180);
    			attr_dev(div0, "class", "p-3 table-responsive");
    			add_location(div0, file$3, 105, 12, 3131);
    			attr_dev(a2, "href", "/marketer/user_list");
    			attr_dev(a2, "class", "btns btn btn-outline-secondary svelte-1ovm4ti");
    			add_location(a2, file$3, 140, 14, 4284);
    			attr_dev(div1, "class", "row justify-content-end mr-5");
    			add_location(div1, file$3, 139, 12, 4227);
    			attr_dev(div2, "id", "detail");
    			attr_dev(div2, "role", "tabpanel");
    			attr_dev(div2, "class", "tab-pane fade show active");
    			add_location(div2, file$3, 104, 10, 3051);
    			attr_dev(h6, "class", "");
    			add_location(h6, file$3, 148, 14, 4556);
    			attr_dev(th7, "class", "svelte-1ovm4ti");
    			add_location(th7, file$3, 155, 26, 4858);
    			attr_dev(th8, "class", "svelte-1ovm4ti");
    			add_location(th8, file$3, 156, 26, 4901);
    			attr_dev(th9, "class", "svelte-1ovm4ti");
    			add_location(th9, file$3, 157, 26, 4944);
    			attr_dev(th10, "class", "svelte-1ovm4ti");
    			add_location(th10, file$3, 158, 26, 4988);
    			attr_dev(th11, "class", "svelte-1ovm4ti");
    			add_location(th11, file$3, 159, 26, 5031);
    			add_location(tr7, file$3, 154, 24, 4827);
    			add_location(thead, file$3, 153, 22, 4795);
    			attr_dev(tbody1, "class", "table-body");
    			add_location(tbody1, file$3, 162, 22, 5130);
    			attr_dev(table1, "class", "table table-fill svelte-1ovm4ti");
    			add_location(table1, file$3, 152, 20, 4740);
    			attr_dev(div3, "class", "table-responsive border");
    			add_location(div3, file$3, 151, 18, 4682);
    			attr_dev(div4, "class", "col container");
    			add_location(div4, file$3, 150, 16, 4636);
    			attr_dev(div5, "class", "row");
    			add_location(div5, file$3, 149, 14, 4602);
    			attr_dev(div6, "class", "p-2");
    			add_location(div6, file$3, 147, 12, 4523);
    			attr_dev(div7, "id", "orders");
    			attr_dev(div7, "role", "tabpanel");
    			attr_dev(div7, "class", "tab-pane fade");
    			add_location(div7, file$3, 146, 10, 4455);
    			attr_dev(div8, "id", "myTabContent");
    			attr_dev(div8, "class", "tab-content");
    			add_location(div8, file$3, 103, 8, 2997);
    			attr_dev(div9, "class", "container-fluid border p-2");
    			add_location(div9, file$3, 84, 6, 2349);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, h4);
    			append_dev(h4, t0);
    			append_dev(h4, t1);
    			append_dev(div9, t2);
    			append_dev(div9, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(ul, t4);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(div9, t6);
    			append_dev(div9, div8);
    			append_dev(div8, div2);
    			append_dev(div2, div0);
    			append_dev(div0, table0);
    			append_dev(table0, tbody0);
    			append_dev(tbody0, tr0);
    			append_dev(tr0, td0);
    			append_dev(tr0, t8);
    			append_dev(tr0, th0);
    			append_dev(th0, t9);
    			append_dev(tbody0, t10);
    			append_dev(tbody0, tr1);
    			append_dev(tr1, td1);
    			append_dev(tr1, t12);
    			append_dev(tr1, th1);
    			append_dev(th1, t13);
    			append_dev(tbody0, t14);
    			append_dev(tbody0, tr2);
    			append_dev(tr2, td2);
    			append_dev(tr2, t16);
    			append_dev(tr2, th2);
    			append_dev(th2, t17);
    			append_dev(tbody0, t18);
    			append_dev(tbody0, tr3);
    			append_dev(tr3, td3);
    			append_dev(tr3, t20);
    			append_dev(tr3, th3);
    			append_dev(th3, t21);
    			append_dev(tbody0, t22);
    			append_dev(tbody0, tr4);
    			append_dev(tr4, td4);
    			append_dev(tr4, t24);
    			append_dev(tr4, th4);
    			append_dev(th4, t25);
    			append_dev(tbody0, t26);
    			append_dev(tbody0, tr5);
    			append_dev(tr5, td5);
    			append_dev(tr5, t28);
    			append_dev(tr5, th5);
    			append_dev(th5, t29);
    			append_dev(tbody0, t30);
    			append_dev(tbody0, tr6);
    			append_dev(tr6, td6);
    			append_dev(tr6, t32);
    			append_dev(tr6, th6);
    			append_dev(th6, t33);
    			append_dev(div2, t34);
    			append_dev(div2, div1);
    			append_dev(div1, a2);
    			append_dev(div8, t36);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div6, h6);
    			append_dev(div6, t38);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, table1);
    			append_dev(table1, thead);
    			append_dev(thead, tr7);
    			append_dev(tr7, th7);
    			append_dev(tr7, t40);
    			append_dev(tr7, th8);
    			append_dev(tr7, t42);
    			append_dev(tr7, th9);
    			append_dev(tr7, t44);
    			append_dev(tr7, th10);
    			append_dev(tr7, t46);
    			append_dev(tr7, th11);
    			append_dev(table1, t48);
    			append_dev(table1, tbody1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody1, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*inputs*/ 1 && t0_value !== (t0_value = /*inputs*/ ctx[0].name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*inputs*/ 1 && t9_value !== (t9_value = /*inputs*/ ctx[0].name + "")) set_data_dev(t9, t9_value);
    			if (dirty & /*inputs*/ 1 && t13_value !== (t13_value = /*inputs*/ ctx[0].email + "")) set_data_dev(t13, t13_value);
    			if (dirty & /*inputs*/ 1 && t17_value !== (t17_value = /*inputs*/ ctx[0].phone + "")) set_data_dev(t17, t17_value);
    			if (dirty & /*inputs*/ 1 && t21_value !== (t21_value = /*inputs*/ ctx[0].basePrice + "")) set_data_dev(t21, t21_value);
    			if (dirty & /*inputs*/ 1 && t25_value !== (t25_value = /*inputs*/ ctx[0].deliveryPrice + "")) set_data_dev(t25, t25_value);
    			if (dirty & /*inputs*/ 1 && t29_value !== (t29_value = /*inputs*/ ctx[0].address + "")) set_data_dev(t29, t29_value);
    			if (dirty & /*inputs*/ 1 && t33_value !== (t33_value = /*inputs*/ ctx[0].active + "")) set_data_dev(t33, t33_value);

    			if (dirty & /*myJobs, viewDetails, viewItem*/ 14) {
    				each_value = /*myJobs*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(84:4) {#if inputs.name != \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    // (201:30) {:else}
    function create_else_block$1(ctx) {
    	let h6;

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			h6.textContent = "Mismached";
    			add_location(h6, file$3, 201, 32, 7190);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(201:30) {:else}",
    		ctx
    	});

    	return block;
    }

    // (199:58) 
    function create_if_block_7(ctx) {
    	let h6;

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			h6.textContent = "Completed";
    			attr_dev(h6, "class", "text-success");
    			add_location(h6, file$3, 199, 32, 7080);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(199:58) ",
    		ctx
    	});

    	return block;
    }

    // (197:58) 
    function create_if_block_6$1(ctx) {
    	let h6;

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			h6.textContent = "Second Pay";
    			attr_dev(h6, "class", "text-info");
    			add_location(h6, file$3, 197, 32, 6951);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$1.name,
    		type: "if",
    		source: "(197:58) ",
    		ctx
    	});

    	return block;
    }

    // (195:58) 
    function create_if_block_5$1(ctx) {
    	let h6;

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			h6.textContent = "Printing";
    			add_location(h6, file$3, 195, 32, 6842);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(195:58) ",
    		ctx
    	});

    	return block;
    }

    // (193:58) 
    function create_if_block_4$1(ctx) {
    	let h6;

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			h6.textContent = "First Pay";
    			attr_dev(h6, "class", "text-info");
    			add_location(h6, file$3, 193, 32, 6714);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(193:58) ",
    		ctx
    	});

    	return block;
    }

    // (191:58) 
    function create_if_block_3$1(ctx) {
    	let h6;

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			h6.textContent = "Confirmed";
    			attr_dev(h6, "class", "text-primary");
    			add_location(h6, file$3, 191, 32, 6583);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(191:58) ",
    		ctx
    	});

    	return block;
    }

    // (189:58) 
    function create_if_block_2$1(ctx) {
    	let h6;

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			h6.textContent = "Assigned";
    			add_location(h6, file$3, 189, 32, 6474);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(189:58) ",
    		ctx
    	});

    	return block;
    }

    // (187:30) {#if item.status === 0}
    function create_if_block_1$1(ctx) {
    	let h6;

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			h6.textContent = "Not Assign";
    			attr_dev(h6, "class", "text-warning");
    			add_location(h6, file$3, 187, 32, 6342);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(187:30) {#if item.status === 0}",
    		ctx
    	});

    	return block;
    }

    // (164:24) {#each myJobs as item}
    function create_each_block$1(ctx) {
    	let tr;
    	let td0;
    	let button0;
    	let t1;
    	let td1;
    	let button1;
    	let t3;
    	let td2;
    	let h60;
    	let t4_value = /*item*/ ctx[6].category + "";
    	let t4;
    	let t5;
    	let t6_value = /*item*/ ctx[6].subCategory + "";
    	let t6;
    	let t7;
    	let td3;
    	let h61;
    	let t8_value = /*item*/ ctx[6].shipping_address + "";
    	let t8;
    	let t9;
    	let td4;
    	let t10;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*item*/ ctx[6].status === 0) return create_if_block_1$1;
    		if (/*item*/ ctx[6].status === 1) return create_if_block_2$1;
    		if (/*item*/ ctx[6].status === 2) return create_if_block_3$1;
    		if (/*item*/ ctx[6].status === 3) return create_if_block_4$1;
    		if (/*item*/ ctx[6].status === 4) return create_if_block_5$1;
    		if (/*item*/ ctx[6].status === 5) return create_if_block_6$1;
    		if (/*item*/ ctx[6].status === 6) return create_if_block_7;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			button0 = element("button");
    			button0.textContent = "Product";
    			t1 = space();
    			td1 = element("td");
    			button1 = element("button");
    			button1.textContent = "View";
    			t3 = space();
    			td2 = element("td");
    			h60 = element("h6");
    			t4 = text(t4_value);
    			t5 = text(", ");
    			t6 = text(t6_value);
    			t7 = space();
    			td3 = element("td");
    			h61 = element("h6");
    			t8 = text(t8_value);
    			t9 = space();
    			td4 = element("td");
    			if_block.c();
    			t10 = space();
    			attr_dev(button0, "class", "btn btn-link");
    			add_location(button0, file$3, 166, 30, 5298);
    			add_location(td0, file$3, 165, 28, 5263);
    			attr_dev(button1, "class", "btn btn-link");
    			add_location(button1, file$3, 173, 30, 5626);
    			attr_dev(td1, "class", "text-center");
    			add_location(td1, file$3, 172, 28, 5571);
    			add_location(h60, file$3, 180, 31, 5957);
    			attr_dev(td2, "class", "text-center");
    			add_location(td2, file$3, 179, 28, 5902);
    			add_location(h61, file$3, 183, 31, 6119);
    			attr_dev(td3, "class", "text-center");
    			add_location(td3, file$3, 182, 28, 6064);
    			attr_dev(td4, "class", "text-center d-block d-inline");
    			add_location(td4, file$3, 185, 28, 6214);
    			add_location(tr, file$3, 164, 26, 5230);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, button0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, button1);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, h60);
    			append_dev(h60, t4);
    			append_dev(h60, t5);
    			append_dev(h60, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td3);
    			append_dev(td3, h61);
    			append_dev(h61, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td4);
    			if_block.m(td4, null);
    			append_dev(tr, t10);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						button0,
    						"click",
    						function () {
    							if (is_function(/*viewItem*/ ctx[2](/*item*/ ctx[6].product_id))) /*viewItem*/ ctx[2](/*item*/ ctx[6].product_id).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button1,
    						"click",
    						function () {
    							if (is_function(/*viewDetails*/ ctx[3](/*item*/ ctx[6].order_details))) /*viewDetails*/ ctx[3](/*item*/ ctx[6].order_details).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*myJobs*/ 2 && t4_value !== (t4_value = /*item*/ ctx[6].category + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*myJobs*/ 2 && t6_value !== (t6_value = /*item*/ ctx[6].subCategory + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*myJobs*/ 2 && t8_value !== (t8_value = /*item*/ ctx[6].shipping_address + "")) set_data_dev(t8, t8_value);

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(td4, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(164:24) {#each myJobs as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let main;
    	let div;
    	let if_block = /*inputs*/ ctx[0].name != "" && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "row justify-content-center m-2");
    			add_location(div, file$3, 82, 2, 2270);
    			add_location(main, file$3, 81, 0, 2261);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*inputs*/ ctx[0].name != "") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UserView', slots, []);
    	let { id } = $$props;
    	let message = { msg: "", style: "" };

    	let inputs = {
    		name: "",
    		phone: "",
    		email: "",
    		password: "",
    		basePrice: "",
    		deliveryPrice: "",
    		active: false
    	};

    	let myJobs = [];

    	onMount(async () => {
    		await fetch(`${API_URL}/admin/distributer/read/${id}`, { method: "POST" }).then(response => response.json()).then(datas => {
    			$$invalidate(0, inputs = datas.data);
    		});

    		const userDetils = JSON.parse(localStorage.getItem("admin_details"));

    		if (userDetils) {
    			const decodeToken = JSON.parse(atob(userDetils.token.split(".")[1]));
    			let bodyData = { _id: id };

    			const res = await fetch(`${API_URL}/distributer/my_orders`, {
    				method: "post",
    				body: JSON.stringify(bodyData),
    				headers: { "Content-Type": "application/json" }
    			});

    			const json = await res.json();
    			$$invalidate(1, myJobs = json.data.filter(item => item.order_processed_by === decodeToken._id));
    		}
    	});

    	const viewItem = async e => {
    		await fetch(`${API_URL}/products/list/${e}`, { method: "POST" }).then(response => response.json()).then(datas => {
    			sweetalert2_all.fire({
    				title: datas.data.title,
    				text: datas.data.category + ", " + datas.data.subCategory,
    				imageUrl: datas.data.image,
    				imageWidth: 100,
    				imageHeight: 200,
    				imageAlt: "Custom image"
    			});
    		});
    	};

    	const viewDetails = e => {
    		sweetalert2_all.fire({
    			title: "Order Details",
    			html: "<div><tr><b>Width : </b><i>" + e.width + "</i></tr></br><tr><b>Height : </b><i>" + e.height + "</i></tr></br><tr><b>ArcTop : </b><i>" + e.arcTop + "</i></tr></br><tr><b>ArcBottom : </b><i>" + e.arcBottom + "</i></tr></br><tr><b>Sandwich : </b><i>" + e.sandwich + "</i></tr></br><tr><b>Varnish : </b><i>" + e.varnish + "</i></tr></br><tr><b>WhiteCoat : </b><i>" + e.whiteCoat + "</i></tr></br><tr><b>Message : </b><i>" + e.message + "</i></tr></div>"
    		});
    	};

    	const writable_props = ['id'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UserView> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(4, id = $$props.id);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		Swal: sweetalert2_all,
    		API_URL,
    		id,
    		message,
    		inputs,
    		myJobs,
    		viewItem,
    		viewDetails
    	});

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(4, id = $$props.id);
    		if ('message' in $$props) message = $$props.message;
    		if ('inputs' in $$props) $$invalidate(0, inputs = $$props.inputs);
    		if ('myJobs' in $$props) $$invalidate(1, myJobs = $$props.myJobs);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [inputs, myJobs, viewItem, viewDetails, id];
    }

    class UserView extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { id: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UserView",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*id*/ ctx[4] === undefined && !('id' in props)) {
    			console.warn("<UserView> was created without expected prop 'id'");
    		}
    	}

    	get id() {
    		throw new Error("<UserView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<UserView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/pages/marketer/profile.svelte generated by Svelte v3.44.1 */

    const { console: console_1 } = globals;
    const file$2 = "src/pages/marketer/profile.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	return child_ctx;
    }

    // (294:28) {:else}
    function create_else_block(ctx) {
    	let h6;

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			h6.textContent = "Mismached";
    			add_location(h6, file$2, 294, 30, 10166);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(294:28) {:else}",
    		ctx
    	});

    	return block;
    }

    // (292:56) 
    function create_if_block_6(ctx) {
    	let h6;

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			h6.textContent = "Completed";
    			attr_dev(h6, "class", "text-success");
    			add_location(h6, file$2, 292, 30, 10060);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(292:56) ",
    		ctx
    	});

    	return block;
    }

    // (290:56) 
    function create_if_block_5(ctx) {
    	let h6;

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			h6.textContent = "Second Pay";
    			attr_dev(h6, "class", "text-info");
    			add_location(h6, file$2, 290, 30, 9935);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(290:56) ",
    		ctx
    	});

    	return block;
    }

    // (288:56) 
    function create_if_block_4(ctx) {
    	let h6;

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			h6.textContent = "Printing";
    			add_location(h6, file$2, 288, 30, 9829);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(288:56) ",
    		ctx
    	});

    	return block;
    }

    // (286:56) 
    function create_if_block_3(ctx) {
    	let h6;

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			h6.textContent = "First Pay";
    			attr_dev(h6, "class", "text-info");
    			add_location(h6, file$2, 286, 30, 9705);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(286:56) ",
    		ctx
    	});

    	return block;
    }

    // (284:56) 
    function create_if_block_2(ctx) {
    	let h6;

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			h6.textContent = "Confirmed";
    			attr_dev(h6, "class", "text-primary");
    			add_location(h6, file$2, 284, 30, 9578);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(284:56) ",
    		ctx
    	});

    	return block;
    }

    // (282:56) 
    function create_if_block_1(ctx) {
    	let h6;

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			h6.textContent = "Assigned";
    			add_location(h6, file$2, 282, 30, 9473);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(282:56) ",
    		ctx
    	});

    	return block;
    }

    // (280:28) {#if item.status === 0}
    function create_if_block$1(ctx) {
    	let h6;

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			h6.textContent = "Not Assign";
    			attr_dev(h6, "class", "text-warning");
    			add_location(h6, file$2, 280, 30, 9345);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(280:28) {#if item.status === 0}",
    		ctx
    	});

    	return block;
    }

    // (266:22) {#each myJobs as item}
    function create_each_block(ctx) {
    	let tr;
    	let td0;
    	let button0;
    	let t1;
    	let td1;
    	let button1;
    	let t3;
    	let td2;
    	let button2;
    	let t5;
    	let td3;
    	let h60;
    	let t6_value = /*item*/ ctx[16].category + "";
    	let t6;
    	let t7;
    	let t8_value = /*item*/ ctx[16].subCategory + "";
    	let t8;
    	let t9;
    	let td4;
    	let h61;
    	let t10_value = /*item*/ ctx[16].shipping_address + "";
    	let t10;
    	let t11;
    	let td5;
    	let t12;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*item*/ ctx[16].status === 0) return create_if_block$1;
    		if (/*item*/ ctx[16].status === 1) return create_if_block_1;
    		if (/*item*/ ctx[16].status === 2) return create_if_block_2;
    		if (/*item*/ ctx[16].status === 3) return create_if_block_3;
    		if (/*item*/ ctx[16].status === 4) return create_if_block_4;
    		if (/*item*/ ctx[16].status === 5) return create_if_block_5;
    		if (/*item*/ ctx[16].status === 6) return create_if_block_6;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			button0 = element("button");
    			button0.textContent = "Product";
    			t1 = space();
    			td1 = element("td");
    			button1 = element("button");
    			button1.textContent = "Distributer";
    			t3 = space();
    			td2 = element("td");
    			button2 = element("button");
    			button2.textContent = "View";
    			t5 = space();
    			td3 = element("td");
    			h60 = element("h6");
    			t6 = text(t6_value);
    			t7 = text(", ");
    			t8 = text(t8_value);
    			t9 = space();
    			td4 = element("td");
    			h61 = element("h6");
    			t10 = text(t10_value);
    			t11 = space();
    			td5 = element("td");
    			if_block.c();
    			t12 = space();
    			attr_dev(button0, "class", "btn btn-link");
    			add_location(button0, file$2, 268, 28, 8482);
    			add_location(td0, file$2, 267, 26, 8449);
    			attr_dev(button1, "class", "btn btn-link");
    			add_location(button1, file$2, 271, 28, 8677);
    			attr_dev(td1, "class", "text-center");
    			add_location(td1, file$2, 270, 26, 8624);
    			attr_dev(button2, "class", "btn btn-link");
    			add_location(button2, file$2, 274, 28, 8888);
    			attr_dev(td2, "class", "text-center");
    			add_location(td2, file$2, 273, 26, 8835);
    			add_location(h60, file$2, 276, 50, 9057);
    			attr_dev(td3, "class", "text-center");
    			add_location(td3, file$2, 276, 26, 9033);
    			add_location(h61, file$2, 277, 50, 9157);
    			attr_dev(td4, "class", "text-center");
    			add_location(td4, file$2, 277, 26, 9133);
    			attr_dev(td5, "class", "text-center d-block d-inline");
    			add_location(td5, file$2, 278, 26, 9221);
    			add_location(tr, file$2, 266, 24, 8418);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, button0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, button1);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, button2);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, h60);
    			append_dev(h60, t6);
    			append_dev(h60, t7);
    			append_dev(h60, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td4);
    			append_dev(td4, h61);
    			append_dev(h61, t10);
    			append_dev(tr, t11);
    			append_dev(tr, td5);
    			if_block.m(td5, null);
    			append_dev(tr, t12);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						button0,
    						"click",
    						function () {
    							if (is_function(/*viewItem*/ ctx[7](/*item*/ ctx[16].product_id))) /*viewItem*/ ctx[7](/*item*/ ctx[16].product_id).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button1,
    						"click",
    						function () {
    							if (is_function(/*viewDistributer*/ ctx[9](/*item*/ ctx[16].order_placed_by))) /*viewDistributer*/ ctx[9](/*item*/ ctx[16].order_placed_by).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button2,
    						"click",
    						function () {
    							if (is_function(/*viewDetails*/ ctx[8](/*item*/ ctx[16].order_details))) /*viewDetails*/ ctx[8](/*item*/ ctx[16].order_details).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*myJobs*/ 16 && t6_value !== (t6_value = /*item*/ ctx[16].category + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*myJobs*/ 16 && t8_value !== (t8_value = /*item*/ ctx[16].subCategory + "")) set_data_dev(t8, t8_value);
    			if (dirty & /*myJobs*/ 16 && t10_value !== (t10_value = /*item*/ ctx[16].shipping_address + "")) set_data_dev(t10, t10_value);

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(td5, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(266:22) {#each myJobs as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let main;
    	let div16;
    	let div15;
    	let h4;
    	let t1;
    	let ul;
    	let li0;
    	let a0;
    	let t3;
    	let li1;
    	let a1;
    	let t5;
    	let li2;
    	let a2;
    	let t7;
    	let div14;
    	let div3;
    	let div0;
    	let h60;
    	let t9;
    	let input0;
    	let t10;
    	let h61;
    	let t12;
    	let input1;
    	let t13;
    	let h62;
    	let t15;
    	let input2;
    	let t16;
    	let div1;
    	let p0;
    	let b0;
    	let t17_value = /*message*/ ctx[0].msg + "";
    	let t17;
    	let p0_class_value;
    	let t18;
    	let div2;
    	let button0;
    	let t20;
    	let a3;
    	let t22;
    	let div8;
    	let div7;
    	let div4;
    	let h63;
    	let t24;
    	let input3;
    	let t25;
    	let h64;
    	let t27;
    	let input4;
    	let t28;
    	let div5;
    	let p1;
    	let b1;
    	let t29_value = /*pwd*/ ctx[1].msg + "";
    	let t29;
    	let p1_class_value;
    	let t30;
    	let div6;
    	let button1;
    	let t32;
    	let a4;
    	let t34;
    	let div13;
    	let div12;
    	let div11;
    	let div10;
    	let div9;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t36;
    	let th1;
    	let t38;
    	let th2;
    	let t40;
    	let th3;
    	let t42;
    	let th4;
    	let t44;
    	let th5;
    	let t46;
    	let tbody;
    	let mounted;
    	let dispose;
    	let each_value = /*myJobs*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			div16 = element("div");
    			div15 = element("div");
    			h4 = element("h4");
    			h4.textContent = "Profile Details";
    			t1 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "Personal";
    			t3 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "Password";
    			t5 = space();
    			li2 = element("li");
    			a2 = element("a");
    			a2.textContent = "My Jobs";
    			t7 = space();
    			div14 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			h60 = element("h6");
    			h60.textContent = "Name:";
    			t9 = space();
    			input0 = element("input");
    			t10 = space();
    			h61 = element("h6");
    			h61.textContent = "E Mail:";
    			t12 = space();
    			input1 = element("input");
    			t13 = space();
    			h62 = element("h6");
    			h62.textContent = "Mobile:";
    			t15 = space();
    			input2 = element("input");
    			t16 = space();
    			div1 = element("div");
    			p0 = element("p");
    			b0 = element("b");
    			t17 = text(t17_value);
    			t18 = space();
    			div2 = element("div");
    			button0 = element("button");
    			button0.textContent = "Update";
    			t20 = space();
    			a3 = element("a");
    			a3.textContent = "Back";
    			t22 = space();
    			div8 = element("div");
    			div7 = element("div");
    			div4 = element("div");
    			h63 = element("h6");
    			h63.textContent = "Old Password:";
    			t24 = space();
    			input3 = element("input");
    			t25 = space();
    			h64 = element("h6");
    			h64.textContent = "New Password:";
    			t27 = space();
    			input4 = element("input");
    			t28 = space();
    			div5 = element("div");
    			p1 = element("p");
    			b1 = element("b");
    			t29 = text(t29_value);
    			t30 = space();
    			div6 = element("div");
    			button1 = element("button");
    			button1.textContent = "Change Password";
    			t32 = space();
    			a4 = element("a");
    			a4.textContent = "Back";
    			t34 = space();
    			div13 = element("div");
    			div12 = element("div");
    			div11 = element("div");
    			div10 = element("div");
    			div9 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Product";
    			t36 = space();
    			th1 = element("th");
    			th1.textContent = "Ordered";
    			t38 = space();
    			th2 = element("th");
    			th2.textContent = "Details";
    			t40 = space();
    			th3 = element("th");
    			th3.textContent = "Category";
    			t42 = space();
    			th4 = element("th");
    			th4.textContent = "Address";
    			t44 = space();
    			th5 = element("th");
    			th5.textContent = "Status";
    			t46 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h4, "id", "heading");
    			attr_dev(h4, "class", "text-center text-capitalize  svelte-crd01t");
    			add_location(h4, file$2, 155, 6, 4409);
    			attr_dev(a0, "data-toggle", "tab");
    			attr_dev(a0, "href", "#detail");
    			attr_dev(a0, "role", "tab");
    			attr_dev(a0, "class", "nav-link active");
    			add_location(a0, file$2, 160, 10, 4626);
    			attr_dev(li0, "class", "nav-item flex-sm-fill");
    			add_location(li0, file$2, 159, 8, 4581);
    			attr_dev(a1, "data-toggle", "tab");
    			attr_dev(a1, "href", "#password");
    			attr_dev(a1, "role", "tab");
    			attr_dev(a1, "class", "nav-link");
    			add_location(a1, file$2, 165, 10, 4801);
    			attr_dev(li1, "class", "nav-item flex-sm-fill");
    			add_location(li1, file$2, 164, 8, 4756);
    			attr_dev(a2, "data-toggle", "tab");
    			attr_dev(a2, "href", "#orders");
    			attr_dev(a2, "role", "tab");
    			attr_dev(a2, "class", "nav-link");
    			add_location(a2, file$2, 170, 10, 4971);
    			attr_dev(li2, "class", "nav-item flex-sm-fill");
    			add_location(li2, file$2, 169, 8, 4926);
    			attr_dev(ul, "role", "tablist");
    			attr_dev(ul, "class", "nav nav-tabs mt-3 mb-3 pt-4 border-top");
    			add_location(ul, file$2, 158, 6, 4506);
    			attr_dev(h60, "class", "");
    			add_location(h60, file$2, 178, 12, 5263);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "form-control form-ipt svelte-crd01t");
    			attr_dev(input0, "placeholder", "Name");
    			add_location(input0, file$2, 179, 12, 5299);
    			attr_dev(h61, "class", "");
    			add_location(h61, file$2, 185, 12, 5475);
    			attr_dev(input1, "type", "email");
    			attr_dev(input1, "class", "form-control form-ipt text-lower svelte-crd01t");
    			attr_dev(input1, "placeholder", "E-mail");
    			add_location(input1, file$2, 186, 12, 5513);
    			attr_dev(h62, "class", "");
    			add_location(h62, file$2, 192, 12, 5704);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "class", "form-control form-ipt svelte-crd01t");
    			attr_dev(input2, "placeholder", "Mobile Number");
    			add_location(input2, file$2, 193, 12, 5742);
    			attr_dev(div0, "class", "p-3");
    			add_location(div0, file$2, 177, 10, 5233);
    			add_location(b0, file$2, 201, 37, 6032);
    			attr_dev(p0, "class", p0_class_value = "" + (null_to_empty(/*message*/ ctx[0].style) + " svelte-crd01t"));
    			add_location(p0, file$2, 201, 12, 6007);
    			attr_dev(div1, "class", "row m-auto justify-content-center p-1");
    			add_location(div1, file$2, 200, 10, 5943);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "btns btn btn-outline-info svelte-crd01t");
    			add_location(button0, file$2, 204, 12, 6145);
    			attr_dev(a3, "href", "/marketer/");
    			attr_dev(a3, "class", "btns btn btn-outline-secondary svelte-crd01t");
    			add_location(a3, file$2, 209, 12, 6308);
    			attr_dev(div2, "class", "row ml-auto justify-content-center");
    			add_location(div2, file$2, 203, 10, 6084);
    			attr_dev(div3, "id", "detail");
    			attr_dev(div3, "role", "tabpanel");
    			attr_dev(div3, "class", "tab-pane fade show active");
    			add_location(div3, file$2, 176, 8, 5155);
    			attr_dev(h63, "class", "");
    			add_location(h63, file$2, 217, 14, 6576);
    			attr_dev(input3, "type", "password");
    			attr_dev(input3, "class", "form-control form-ipt svelte-crd01t");
    			attr_dev(input3, "placeholder", "Old Password");
    			add_location(input3, file$2, 218, 14, 6622);
    			attr_dev(h64, "class", "");
    			add_location(h64, file$2, 224, 14, 6828);
    			attr_dev(input4, "type", "password");
    			attr_dev(input4, "class", "form-control form-ipt svelte-crd01t");
    			attr_dev(input4, "placeholder", "Old Password");
    			add_location(input4, file$2, 225, 14, 6874);
    			attr_dev(div4, "class", "p-3");
    			add_location(div4, file$2, 216, 12, 6544);
    			add_location(b1, file$2, 233, 35, 7184);
    			attr_dev(p1, "class", p1_class_value = "" + (null_to_empty(/*pwd*/ ctx[1].style) + " svelte-crd01t"));
    			add_location(p1, file$2, 233, 14, 7163);
    			attr_dev(div5, "class", "row m-auto justify-content-center p-1");
    			add_location(div5, file$2, 232, 12, 7097);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "btns btn btn-outline-info svelte-crd01t");
    			add_location(button1, file$2, 236, 14, 7299);
    			attr_dev(a4, "href", "/marketer/");
    			attr_dev(a4, "class", "btns btn btn-outline-secondary svelte-crd01t");
    			add_location(a4, file$2, 241, 14, 7482);
    			attr_dev(div6, "class", "row ml-auto justify-content-center");
    			add_location(div6, file$2, 235, 12, 7236);
    			attr_dev(div7, "class", "p-2");
    			add_location(div7, file$2, 215, 10, 6513);
    			attr_dev(div8, "id", "password");
    			attr_dev(div8, "role", "tabpanel");
    			attr_dev(div8, "class", "tab-pane fade");
    			add_location(div8, file$2, 214, 8, 6445);
    			add_location(th0, file$2, 256, 24, 8023);
    			add_location(th1, file$2, 257, 24, 8064);
    			add_location(th2, file$2, 258, 24, 8105);
    			add_location(th3, file$2, 259, 24, 8146);
    			add_location(th4, file$2, 260, 24, 8188);
    			add_location(th5, file$2, 261, 24, 8229);
    			add_location(tr, file$2, 255, 22, 7994);
    			add_location(thead, file$2, 254, 20, 7964);
    			attr_dev(tbody, "class", "table-body");
    			add_location(tbody, file$2, 264, 20, 8322);
    			attr_dev(table, "class", "table table-fill");
    			add_location(table, file$2, 253, 18, 7911);
    			attr_dev(div9, "class", "table-responsive border");
    			add_location(div9, file$2, 252, 16, 7855);
    			attr_dev(div10, "class", "col container");
    			add_location(div10, file$2, 251, 14, 7811);
    			attr_dev(div11, "class", "row");
    			add_location(div11, file$2, 250, 12, 7779);
    			attr_dev(div12, "class", "p-2");
    			add_location(div12, file$2, 248, 10, 7708);
    			attr_dev(div13, "id", "orders");
    			attr_dev(div13, "role", "tabpanel");
    			attr_dev(div13, "class", "tab-pane fade");
    			add_location(div13, file$2, 247, 8, 7642);
    			attr_dev(div14, "id", "myTabContent");
    			attr_dev(div14, "class", "tab-content");
    			add_location(div14, file$2, 175, 6, 5103);
    			attr_dev(div15, "class", "container-fluid border p-2");
    			add_location(div15, file$2, 154, 4, 4362);
    			attr_dev(div16, "class", "row justify-content-center");
    			add_location(div16, file$2, 153, 2, 4317);
    			add_location(main, file$2, 152, 0, 4308);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div16);
    			append_dev(div16, div15);
    			append_dev(div15, h4);
    			append_dev(div15, t1);
    			append_dev(div15, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(ul, t3);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(ul, t5);
    			append_dev(ul, li2);
    			append_dev(li2, a2);
    			append_dev(div15, t7);
    			append_dev(div15, div14);
    			append_dev(div14, div3);
    			append_dev(div3, div0);
    			append_dev(div0, h60);
    			append_dev(div0, t9);
    			append_dev(div0, input0);
    			set_input_value(input0, /*inputs*/ ctx[2].name);
    			append_dev(div0, t10);
    			append_dev(div0, h61);
    			append_dev(div0, t12);
    			append_dev(div0, input1);
    			set_input_value(input1, /*inputs*/ ctx[2].email);
    			append_dev(div0, t13);
    			append_dev(div0, h62);
    			append_dev(div0, t15);
    			append_dev(div0, input2);
    			set_input_value(input2, /*inputs*/ ctx[2].phone);
    			append_dev(div3, t16);
    			append_dev(div3, div1);
    			append_dev(div1, p0);
    			append_dev(p0, b0);
    			append_dev(b0, t17);
    			append_dev(div3, t18);
    			append_dev(div3, div2);
    			append_dev(div2, button0);
    			append_dev(div2, t20);
    			append_dev(div2, a3);
    			append_dev(div14, t22);
    			append_dev(div14, div8);
    			append_dev(div8, div7);
    			append_dev(div7, div4);
    			append_dev(div4, h63);
    			append_dev(div4, t24);
    			append_dev(div4, input3);
    			set_input_value(input3, /*pswd*/ ctx[3].old_password);
    			append_dev(div4, t25);
    			append_dev(div4, h64);
    			append_dev(div4, t27);
    			append_dev(div4, input4);
    			set_input_value(input4, /*pswd*/ ctx[3].new_password);
    			append_dev(div7, t28);
    			append_dev(div7, div5);
    			append_dev(div5, p1);
    			append_dev(p1, b1);
    			append_dev(b1, t29);
    			append_dev(div7, t30);
    			append_dev(div7, div6);
    			append_dev(div6, button1);
    			append_dev(div6, t32);
    			append_dev(div6, a4);
    			append_dev(div14, t34);
    			append_dev(div14, div13);
    			append_dev(div13, div12);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			append_dev(div10, div9);
    			append_dev(div9, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t36);
    			append_dev(tr, th1);
    			append_dev(tr, t38);
    			append_dev(tr, th2);
    			append_dev(tr, t40);
    			append_dev(tr, th3);
    			append_dev(tr, t42);
    			append_dev(tr, th4);
    			append_dev(tr, t44);
    			append_dev(tr, th5);
    			append_dev(table, t46);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[10]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[11]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[12]),
    					listen_dev(button0, "click", /*updateHandle*/ ctx[5], false, false, false),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[13]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[14]),
    					listen_dev(button1, "click", /*updatePassord*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*inputs*/ 4 && input0.value !== /*inputs*/ ctx[2].name) {
    				set_input_value(input0, /*inputs*/ ctx[2].name);
    			}

    			if (dirty & /*inputs*/ 4 && input1.value !== /*inputs*/ ctx[2].email) {
    				set_input_value(input1, /*inputs*/ ctx[2].email);
    			}

    			if (dirty & /*inputs*/ 4 && input2.value !== /*inputs*/ ctx[2].phone) {
    				set_input_value(input2, /*inputs*/ ctx[2].phone);
    			}

    			if (dirty & /*message*/ 1 && t17_value !== (t17_value = /*message*/ ctx[0].msg + "")) set_data_dev(t17, t17_value);

    			if (dirty & /*message*/ 1 && p0_class_value !== (p0_class_value = "" + (null_to_empty(/*message*/ ctx[0].style) + " svelte-crd01t"))) {
    				attr_dev(p0, "class", p0_class_value);
    			}

    			if (dirty & /*pswd*/ 8 && input3.value !== /*pswd*/ ctx[3].old_password) {
    				set_input_value(input3, /*pswd*/ ctx[3].old_password);
    			}

    			if (dirty & /*pswd*/ 8 && input4.value !== /*pswd*/ ctx[3].new_password) {
    				set_input_value(input4, /*pswd*/ ctx[3].new_password);
    			}

    			if (dirty & /*pwd*/ 2 && t29_value !== (t29_value = /*pwd*/ ctx[1].msg + "")) set_data_dev(t29, t29_value);

    			if (dirty & /*pwd*/ 2 && p1_class_value !== (p1_class_value = "" + (null_to_empty(/*pwd*/ ctx[1].style) + " svelte-crd01t"))) {
    				attr_dev(p1, "class", p1_class_value);
    			}

    			if (dirty & /*myJobs, viewDetails, viewDistributer, viewItem*/ 912) {
    				each_value = /*myJobs*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Profile', slots, []);
    	let message = { msg: "", style: "" };
    	let pwd = { msg: "", style: "" };
    	let inputs = { _id: '', name: "", phone: "", email: "" };

    	let pswd = {
    		_id: '',
    		old_password: "",
    		new_password: ""
    	};

    	let myJobs = [];

    	onMount(async () => {
    		const userDetils = JSON.parse(localStorage.getItem("admin_details"));

    		if (userDetils) {
    			const decodeToken = JSON.parse(atob(userDetils.token.split(".")[1]));
    			$$invalidate(2, inputs._id = decodeToken._id, inputs);
    			$$invalidate(2, inputs.name = decodeToken.name, inputs);
    			$$invalidate(2, inputs.phone = decodeToken.phone, inputs);
    			$$invalidate(2, inputs.email = decodeToken.email, inputs);
    			$$invalidate(3, pswd._id = decodeToken._id, pswd);
    			fetchJobs(decodeToken._id);
    		}
    	});

    	const fetchJobs = async ids => {
    		let bodyData = { _id: ids };

    		const res = await fetch(`${API_URL}/marketeer/my_jobs`, {
    			method: 'post',
    			body: JSON.stringify(bodyData),
    			headers: { 'Content-Type': 'application/json' }
    		});

    		const json = await res.json();
    		$$invalidate(4, myJobs = json.data);
    	};

    	const updateHandle = async () => {
    		try {
    			$$invalidate(0, message.msg = "Loading..", message);

    			const res = await fetch(`${API_URL}/marketeer/update`, {
    				method: "post",
    				body: JSON.stringify(inputs),
    				headers: { "Content-Type": "application/json" }
    			});

    			const json = await res.json();
    			$$invalidate(0, message.style = "text-info", message);
    			$$invalidate(0, message.msg = json.message, message);

    			if (json.status === true) {
    				$$invalidate(2, inputs.image = "", inputs);
    			}
    		} catch(error) {
    			$$invalidate(0, message.style = "text-warning", message);
    			$$invalidate(0, message.msg = "Network error !!", message);
    		}
    	};

    	const updatePassord = async () => {
    		try {
    			$$invalidate(1, pwd.msg = "Loading..", pwd);

    			const res = await fetch(`${API_URL}/marketeer/update_password`, {
    				method: "post",
    				body: JSON.stringify(pswd),
    				headers: { "Content-Type": "application/json" }
    			});

    			const json = await res.json();
    			console.log(json);
    			$$invalidate(1, pwd.style = "text-info", pwd);
    			$$invalidate(1, pwd.msg = json.message, pwd);

    			if (json.status === true) {
    				$$invalidate(2, inputs.image = "", inputs);
    			}
    		} catch(error) {
    			$$invalidate(1, pwd.style = "text-warning", pwd);
    			$$invalidate(1, pwd.msg = "Network error !!", pwd);
    		}
    	};

    	const viewItem = async e => {
    		await fetch(`${API_URL}/products/list/${e}`, { method: "POST" }).then(response => response.json()).then(datas => {
    			sweetalert2_all.fire({
    				title: datas.data.title,
    				text: datas.data.category + ", " + datas.data.subCategory,
    				imageUrl: datas.data.image,
    				imageWidth: 100,
    				imageHeight: 200,
    				imageAlt: "Custom image"
    			});
    		});
    	};

    	const viewDetails = e => {
    		sweetalert2_all.fire({
    			title: "Order Details",
    			html: "<div><tr><b>Width : </b><i>" + e.width + "</i></tr></br><tr><b>Height : </b><i>" + e.height + "</i></tr></br><tr><b>ArcTop : </b><i>" + e.arcTop + "</i></tr></br><tr><b>ArcBottom : </b><i>" + e.arcBottom + "</i></tr></br><tr><b>Sandwich : </b><i>" + e.sandwich + "</i></tr></br><tr><b>Varnish : </b><i>" + e.varnish + "</i></tr></br><tr><b>WhiteCoat : </b><i>" + e.whiteCoat + "</i></tr></br><tr><b>Message : </b><i>" + e.message + "</i></tr></div>"
    		});
    	};

    	const viewDistributer = async e => {
    		await fetch(`${API_URL}/admin/distributer/read/${e}`, { method: "POST" }).then(response => response.json()).then(datas => {
    			sweetalert2_all.fire({
    				title: "Distributer Details",
    				html: "<div><tr><b>Name : </b><i>" + datas.data.name + "</i></tr></br><tr><b>Phone : </b><i>" + datas.data.phone + "</i></tr></br><tr><b>E mail : </b><i>" + datas.data.email + "</i></tr></br><tr><b>Base Price : </b><i>" + datas.data.basePrice + "</i></tr></br><tr><b>Delivery Price : </b><i>" + datas.data.deliveryPrice + "</i></tr></br><tr><b>Status : </b><i>" + datas.data.active + "</i></tr></br></div>"
    			});
    		});
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Profile> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		inputs.name = this.value;
    		$$invalidate(2, inputs);
    	}

    	function input1_input_handler() {
    		inputs.email = this.value;
    		$$invalidate(2, inputs);
    	}

    	function input2_input_handler() {
    		inputs.phone = this.value;
    		$$invalidate(2, inputs);
    	}

    	function input3_input_handler() {
    		pswd.old_password = this.value;
    		$$invalidate(3, pswd);
    	}

    	function input4_input_handler() {
    		pswd.new_password = this.value;
    		$$invalidate(3, pswd);
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		navigate,
    		Swal: sweetalert2_all,
    		API_URL,
    		message,
    		pwd,
    		inputs,
    		pswd,
    		myJobs,
    		fetchJobs,
    		updateHandle,
    		updatePassord,
    		viewItem,
    		viewDetails,
    		viewDistributer
    	});

    	$$self.$inject_state = $$props => {
    		if ('message' in $$props) $$invalidate(0, message = $$props.message);
    		if ('pwd' in $$props) $$invalidate(1, pwd = $$props.pwd);
    		if ('inputs' in $$props) $$invalidate(2, inputs = $$props.inputs);
    		if ('pswd' in $$props) $$invalidate(3, pswd = $$props.pswd);
    		if ('myJobs' in $$props) $$invalidate(4, myJobs = $$props.myJobs);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		message,
    		pwd,
    		inputs,
    		pswd,
    		myJobs,
    		updateHandle,
    		updatePassord,
    		viewItem,
    		viewDetails,
    		viewDistributer,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler
    	];
    }

    class Profile extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Profile",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/pages/marketer/mainLander.svelte generated by Svelte v3.44.1 */
    const file$1 = "src/pages/marketer/mainLander.svelte";

    // (50:8) {#if isMarketer == true}
    function create_if_block(ctx) {
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				basepath: "marketer/",
    				primary: false,
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const router_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(50:8) {#if isMarketer == true}",
    		ctx
    	});

    	return block;
    }

    // (60:42) <Link to=" " class='nav-link active'>
    function create_default_slot_10(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text("Home");
    			attr_dev(i, "class", "fa fa-desktop fa-lg text-info m-2 svelte-1t9jjm5");
    			add_location(i, file$1, 59, 79, 2412);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(60:42) <Link to=\\\" \\\" class='nav-link active'>",
    		ctx
    	});

    	return block;
    }

    // (64:46) <Link to="confirm" class='nav-link'>
    function create_default_slot_9(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text("Confirmed");
    			attr_dev(i, "class", "fa fa-check-square-o fa-lg text-success m-2 svelte-1t9jjm5");
    			add_location(i, file$1, 63, 82, 2759);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(64:46) <Link to=\\\"confirm\\\" class='nav-link'>",
    		ctx
    	});

    	return block;
    }

    // (65:46) <Link to="first" class='nav-link'>
    function create_default_slot_8(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text("First Pay");
    			attr_dev(i, "class", "fa fa-money fa-lg text-warning m-2 svelte-1t9jjm5");
    			add_location(i, file$1, 64, 80, 2921);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(65:46) <Link to=\\\"first\\\" class='nav-link'>",
    		ctx
    	});

    	return block;
    }

    // (66:46) <Link to="printing" class='nav-link'>
    function create_default_slot_7(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text("Printing");
    			attr_dev(i, "class", "fa fa-print fa-lg text-primary m-2 svelte-1t9jjm5");
    			add_location(i, file$1, 65, 83, 3077);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(66:46) <Link to=\\\"printing\\\" class='nav-link'>",
    		ctx
    	});

    	return block;
    }

    // (67:46) <Link to="second" class='nav-link'>
    function create_default_slot_6(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text("Second Pay");
    			attr_dev(i, "class", "fa fa-money fa-lg text-success m-2 svelte-1t9jjm5");
    			add_location(i, file$1, 66, 81, 3230);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(67:46) <Link to=\\\"second\\\" class='nav-link'>",
    		ctx
    	});

    	return block;
    }

    // (68:46) <Link to="completed" class='nav-link'>
    function create_default_slot_5(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text("Completed");
    			attr_dev(i, "class", "fa fa-list fa-lg text-info m-2 svelte-1t9jjm5");
    			add_location(i, file$1, 67, 84, 3388);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(68:46) <Link to=\\\"completed\\\" class='nav-link'>",
    		ctx
    	});

    	return block;
    }

    // (72:42) <Link to="product" class='nav-link'>
    function create_default_slot_4(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text("View");
    			attr_dev(i, "class", "fa fa-list fa-lg text-secondary m-2 svelte-1t9jjm5");
    			add_location(i, file$1, 71, 78, 3629);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(72:42) <Link to=\\\"product\\\" class='nav-link'>",
    		ctx
    	});

    	return block;
    }

    // (73:42) <Link to="search_product" class='nav-link'>
    function create_default_slot_3(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text("Search");
    			attr_dev(i, "class", "fa fa-search fa-lg text-primary m-2 svelte-1t9jjm5");
    			add_location(i, file$1, 72, 85, 3783);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(73:42) <Link to=\\\"search_product\\\" class='nav-link'>",
    		ctx
    	});

    	return block;
    }

    // (76:42) <Link to="user_list" class='nav-link'>
    function create_default_slot_2(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text("View");
    			attr_dev(i, "class", "fa fa-list fa-lg text-info m-2 svelte-1t9jjm5");
    			add_location(i, file$1, 75, 80, 4001);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(76:42) <Link to=\\\"user_list\\\" class='nav-link'>",
    		ctx
    	});

    	return block;
    }

    // (79:42) <Link to="profile" class='nav-link'>
    function create_default_slot_1(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text("Settings");
    			attr_dev(i, "class", "fa fa-cogs fa-lg text-warning m-2 svelte-1t9jjm5");
    			add_location(i, file$1, 78, 78, 4198);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(79:42) <Link to=\\\"profile\\\" class='nav-link'>",
    		ctx
    	});

    	return block;
    }

    // (51:8) <Router basepath='marketer/' primary={false}>
    function create_default_slot$1(ctx) {
    	let div13;
    	let nav;
    	let button0;
    	let span0;
    	let t0;
    	let div12;
    	let div0;
    	let t1;
    	let div1;
    	let link0;
    	let t2;
    	let a;
    	let t3;
    	let span1;
    	let t4;
    	let div7;
    	let div2;
    	let link1;
    	let t5;
    	let div3;
    	let link2;
    	let t6;
    	let div4;
    	let link3;
    	let t7;
    	let div5;
    	let link4;
    	let t8;
    	let div6;
    	let link5;
    	let t9;
    	let p0;
    	let t11;
    	let div8;
    	let link6;
    	let t12;
    	let div9;
    	let link7;
    	let t13;
    	let p1;
    	let t15;
    	let div10;
    	let link8;
    	let t16;
    	let p2;
    	let t17;
    	let div11;
    	let link9;
    	let t18;
    	let button1;
    	let i;
    	let t19;
    	let t20;
    	let div14;
    	let route0;
    	let t21;
    	let route1;
    	let t22;
    	let route2;
    	let t23;
    	let route3;
    	let t24;
    	let route4;
    	let t25;
    	let route5;
    	let t26;
    	let route6;
    	let t27;
    	let route7;
    	let t28;
    	let route8;
    	let t29;
    	let route9;
    	let t30;
    	let route10;
    	let current;
    	let mounted;
    	let dispose;

    	link0 = new Link$1({
    			props: {
    				to: " ",
    				class: "nav-link active",
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link$1({
    			props: {
    				to: "confirm",
    				class: "nav-link",
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link2 = new Link$1({
    			props: {
    				to: "first",
    				class: "nav-link",
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link3 = new Link$1({
    			props: {
    				to: "printing",
    				class: "nav-link",
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link4 = new Link$1({
    			props: {
    				to: "second",
    				class: "nav-link",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link5 = new Link$1({
    			props: {
    				to: "completed",
    				class: "nav-link",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link6 = new Link$1({
    			props: {
    				to: "product",
    				class: "nav-link",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link7 = new Link$1({
    			props: {
    				to: "search_product",
    				class: "nav-link",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link8 = new Link$1({
    			props: {
    				to: "user_list",
    				class: "nav-link",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link9 = new Link$1({
    			props: {
    				to: "profile",
    				class: "nav-link",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route0 = new Route$1({
    			props: { path: "/", component: Order },
    			$$inline: true
    		});

    	route1 = new Route$1({
    			props: { path: "/confirm", component: Confirmed },
    			$$inline: true
    		});

    	route2 = new Route$1({
    			props: { path: "/first", component: Firstpay },
    			$$inline: true
    		});

    	route3 = new Route$1({
    			props: { path: "/printing", component: Print },
    			$$inline: true
    		});

    	route4 = new Route$1({
    			props: { path: "/second", component: Second },
    			$$inline: true
    		});

    	route5 = new Route$1({
    			props: { path: "/completed", component: Completed },
    			$$inline: true
    		});

    	route6 = new Route$1({
    			props: { path: "/product", component: Products },
    			$$inline: true
    		});

    	route7 = new Route$1({
    			props: {
    				path: "/search_product",
    				component: Search
    			},
    			$$inline: true
    		});

    	route8 = new Route$1({
    			props: { path: "/user_list", component: Users },
    			$$inline: true
    		});

    	route9 = new Route$1({
    			props: {
    				path: "/user_list/:id",
    				component: UserView
    			},
    			$$inline: true
    		});

    	route10 = new Route$1({
    			props: { path: "/profile", component: Profile },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div13 = element("div");
    			nav = element("nav");
    			button0 = element("button");
    			span0 = element("span");
    			t0 = space();
    			div12 = element("div");
    			div0 = element("div");
    			t1 = space();
    			div1 = element("div");
    			create_component(link0.$$.fragment);
    			t2 = space();
    			a = element("a");
    			t3 = text("Orders");
    			span1 = element("span");
    			t4 = space();
    			div7 = element("div");
    			div2 = element("div");
    			create_component(link1.$$.fragment);
    			t5 = space();
    			div3 = element("div");
    			create_component(link2.$$.fragment);
    			t6 = space();
    			div4 = element("div");
    			create_component(link3.$$.fragment);
    			t7 = space();
    			div5 = element("div");
    			create_component(link4.$$.fragment);
    			t8 = space();
    			div6 = element("div");
    			create_component(link5.$$.fragment);
    			t9 = space();
    			p0 = element("p");
    			p0.textContent = "Products";
    			t11 = space();
    			div8 = element("div");
    			create_component(link6.$$.fragment);
    			t12 = space();
    			div9 = element("div");
    			create_component(link7.$$.fragment);
    			t13 = space();
    			p1 = element("p");
    			p1.textContent = "Distributers";
    			t15 = space();
    			div10 = element("div");
    			create_component(link8.$$.fragment);
    			t16 = space();
    			p2 = element("p");
    			t17 = space();
    			div11 = element("div");
    			create_component(link9.$$.fragment);
    			t18 = space();
    			button1 = element("button");
    			i = element("i");
    			t19 = text(" Logout");
    			t20 = space();
    			div14 = element("div");
    			create_component(route0.$$.fragment);
    			t21 = space();
    			create_component(route1.$$.fragment);
    			t22 = space();
    			create_component(route2.$$.fragment);
    			t23 = space();
    			create_component(route3.$$.fragment);
    			t24 = space();
    			create_component(route4.$$.fragment);
    			t25 = space();
    			create_component(route5.$$.fragment);
    			t26 = space();
    			create_component(route6.$$.fragment);
    			t27 = space();
    			create_component(route7.$$.fragment);
    			t28 = space();
    			create_component(route8.$$.fragment);
    			t29 = space();
    			create_component(route9.$$.fragment);
    			t30 = space();
    			create_component(route10.$$.fragment);
    			attr_dev(span0, "class", "navbar-toggler-icon");
    			add_location(span0, file$1, 55, 24, 2099);
    			attr_dev(button0, "class", "navbar-toggler");
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "data-toggle", "collapse");
    			attr_dev(button0, "data-target", "#sideBarToggle");
    			attr_dev(button0, "aria-controls", "sideBarToggle");
    			attr_dev(button0, "aria-expanded", "false");
    			attr_dev(button0, "aria-label", "Toggle navigation");
    			add_location(button0, file$1, 54, 20, 1894);
    			attr_dev(div0, "class", "m-3");
    			add_location(div0, file$1, 58, 24, 2309);
    			attr_dev(div1, "class", "pill svelte-1t9jjm5");
    			add_location(div1, file$1, 59, 24, 2357);
    			attr_dev(span1, "class", "fa fa-caret-right ml-2 svelte-1t9jjm5");
    			add_location(span1, file$1, 61, 86, 2566);
    			attr_dev(a, "class", "head svelte-1t9jjm5");
    			attr_dev(a, "href", "#sub-menu");
    			attr_dev(a, "data-toggle", "collapse");
    			add_location(a, file$1, 61, 24, 2504);
    			attr_dev(div2, "class", "pill svelte-1t9jjm5");
    			add_location(div2, file$1, 63, 28, 2705);
    			attr_dev(div3, "class", "pill svelte-1t9jjm5");
    			add_location(div3, file$1, 64, 28, 2869);
    			attr_dev(div4, "class", "pill svelte-1t9jjm5");
    			add_location(div4, file$1, 65, 28, 3022);
    			attr_dev(div5, "class", "pill svelte-1t9jjm5");
    			add_location(div5, file$1, 66, 28, 3177);
    			attr_dev(div6, "class", "pill svelte-1t9jjm5");
    			add_location(div6, file$1, 67, 28, 3332);
    			attr_dev(div7, "class", "collapse ");
    			attr_dev(div7, "id", "sub-menu");
    			add_location(div7, file$1, 62, 24, 2639);
    			attr_dev(p0, "disabled", "");
    			attr_dev(p0, "class", "head svelte-1t9jjm5");
    			add_location(p0, file$1, 70, 24, 3513);
    			attr_dev(div8, "class", "pill svelte-1t9jjm5");
    			add_location(div8, file$1, 71, 24, 3575);
    			attr_dev(div9, "class", "pill svelte-1t9jjm5");
    			add_location(div9, file$1, 72, 24, 3722);
    			attr_dev(p1, "disabled", "");
    			attr_dev(p1, "class", "head svelte-1t9jjm5");
    			add_location(p1, file$1, 74, 24, 3879);
    			attr_dev(div10, "class", "pill svelte-1t9jjm5");
    			add_location(div10, file$1, 75, 24, 3945);
    			attr_dev(p2, "disabled", "");
    			attr_dev(p2, "class", "head svelte-1t9jjm5");
    			add_location(p2, file$1, 77, 24, 4090);
    			attr_dev(div11, "class", "pill svelte-1t9jjm5");
    			add_location(div11, file$1, 78, 24, 4144);
    			attr_dev(i, "class", "fa fa-sign-out fa-lg text-danger m-2 svelte-1t9jjm5");
    			add_location(i, file$1, 80, 68, 4458);
    			attr_dev(button1, "class", "btn svelte-1t9jjm5");
    			add_location(button1, file$1, 80, 24, 4414);
    			attr_dev(div12, "class", "flex-column nav-sidebar svelte-1t9jjm5");
    			attr_dev(div12, "id", "sideBarToggle");
    			attr_dev(div12, "activekey", window.location.pathname);
    			add_location(div12, file$1, 57, 20, 2191);
    			attr_dev(nav, "class", "border-bottom navbar-expand-lg");
    			add_location(nav, file$1, 53, 16, 1829);
    			attr_dev(div13, "id", "sidebar");
    			attr_dev(div13, "class", "shadow col-sm-3 svelte-1t9jjm5");
    			add_location(div13, file$1, 52, 12, 1770);
    			attr_dev(div14, "class", "tab-content p-2 col col-offset-sm-3 svelte-1t9jjm5");
    			add_location(div14, file$1, 85, 12, 4649);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div13, anchor);
    			append_dev(div13, nav);
    			append_dev(nav, button0);
    			append_dev(button0, span0);
    			append_dev(nav, t0);
    			append_dev(nav, div12);
    			append_dev(div12, div0);
    			append_dev(div12, t1);
    			append_dev(div12, div1);
    			mount_component(link0, div1, null);
    			append_dev(div12, t2);
    			append_dev(div12, a);
    			append_dev(a, t3);
    			append_dev(a, span1);
    			append_dev(div12, t4);
    			append_dev(div12, div7);
    			append_dev(div7, div2);
    			mount_component(link1, div2, null);
    			append_dev(div7, t5);
    			append_dev(div7, div3);
    			mount_component(link2, div3, null);
    			append_dev(div7, t6);
    			append_dev(div7, div4);
    			mount_component(link3, div4, null);
    			append_dev(div7, t7);
    			append_dev(div7, div5);
    			mount_component(link4, div5, null);
    			append_dev(div7, t8);
    			append_dev(div7, div6);
    			mount_component(link5, div6, null);
    			append_dev(div12, t9);
    			append_dev(div12, p0);
    			append_dev(div12, t11);
    			append_dev(div12, div8);
    			mount_component(link6, div8, null);
    			append_dev(div12, t12);
    			append_dev(div12, div9);
    			mount_component(link7, div9, null);
    			append_dev(div12, t13);
    			append_dev(div12, p1);
    			append_dev(div12, t15);
    			append_dev(div12, div10);
    			mount_component(link8, div10, null);
    			append_dev(div12, t16);
    			append_dev(div12, p2);
    			append_dev(div12, t17);
    			append_dev(div12, div11);
    			mount_component(link9, div11, null);
    			append_dev(div12, t18);
    			append_dev(div12, button1);
    			append_dev(button1, i);
    			append_dev(button1, t19);
    			insert_dev(target, t20, anchor);
    			insert_dev(target, div14, anchor);
    			mount_component(route0, div14, null);
    			append_dev(div14, t21);
    			mount_component(route1, div14, null);
    			append_dev(div14, t22);
    			mount_component(route2, div14, null);
    			append_dev(div14, t23);
    			mount_component(route3, div14, null);
    			append_dev(div14, t24);
    			mount_component(route4, div14, null);
    			append_dev(div14, t25);
    			mount_component(route5, div14, null);
    			append_dev(div14, t26);
    			mount_component(route6, div14, null);
    			append_dev(div14, t27);
    			mount_component(route7, div14, null);
    			append_dev(div14, t28);
    			mount_component(route8, div14, null);
    			append_dev(div14, t29);
    			mount_component(route9, div14, null);
    			append_dev(div14, t30);
    			mount_component(route10, div14, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button1, "click", /*logouthandle*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    			const link2_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				link2_changes.$$scope = { dirty, ctx };
    			}

    			link2.$set(link2_changes);
    			const link3_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				link3_changes.$$scope = { dirty, ctx };
    			}

    			link3.$set(link3_changes);
    			const link4_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				link4_changes.$$scope = { dirty, ctx };
    			}

    			link4.$set(link4_changes);
    			const link5_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				link5_changes.$$scope = { dirty, ctx };
    			}

    			link5.$set(link5_changes);
    			const link6_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				link6_changes.$$scope = { dirty, ctx };
    			}

    			link6.$set(link6_changes);
    			const link7_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				link7_changes.$$scope = { dirty, ctx };
    			}

    			link7.$set(link7_changes);
    			const link8_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				link8_changes.$$scope = { dirty, ctx };
    			}

    			link8.$set(link8_changes);
    			const link9_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				link9_changes.$$scope = { dirty, ctx };
    			}

    			link9.$set(link9_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			transition_in(link2.$$.fragment, local);
    			transition_in(link3.$$.fragment, local);
    			transition_in(link4.$$.fragment, local);
    			transition_in(link5.$$.fragment, local);
    			transition_in(link6.$$.fragment, local);
    			transition_in(link7.$$.fragment, local);
    			transition_in(link8.$$.fragment, local);
    			transition_in(link9.$$.fragment, local);
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			transition_in(route3.$$.fragment, local);
    			transition_in(route4.$$.fragment, local);
    			transition_in(route5.$$.fragment, local);
    			transition_in(route6.$$.fragment, local);
    			transition_in(route7.$$.fragment, local);
    			transition_in(route8.$$.fragment, local);
    			transition_in(route9.$$.fragment, local);
    			transition_in(route10.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			transition_out(link2.$$.fragment, local);
    			transition_out(link3.$$.fragment, local);
    			transition_out(link4.$$.fragment, local);
    			transition_out(link5.$$.fragment, local);
    			transition_out(link6.$$.fragment, local);
    			transition_out(link7.$$.fragment, local);
    			transition_out(link8.$$.fragment, local);
    			transition_out(link9.$$.fragment, local);
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			transition_out(route3.$$.fragment, local);
    			transition_out(route4.$$.fragment, local);
    			transition_out(route5.$$.fragment, local);
    			transition_out(route6.$$.fragment, local);
    			transition_out(route7.$$.fragment, local);
    			transition_out(route8.$$.fragment, local);
    			transition_out(route9.$$.fragment, local);
    			transition_out(route10.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div13);
    			destroy_component(link0);
    			destroy_component(link1);
    			destroy_component(link2);
    			destroy_component(link3);
    			destroy_component(link4);
    			destroy_component(link5);
    			destroy_component(link6);
    			destroy_component(link7);
    			destroy_component(link8);
    			destroy_component(link9);
    			if (detaching) detach_dev(t20);
    			if (detaching) detach_dev(div14);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(route2);
    			destroy_component(route3);
    			destroy_component(route4);
    			destroy_component(route5);
    			destroy_component(route6);
    			destroy_component(route7);
    			destroy_component(route8);
    			destroy_component(route9);
    			destroy_component(route10);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(51:8) <Router basepath='marketer/' primary={false}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let main;
    	let navbar;
    	let t;
    	let div;
    	let current;
    	navbar = new NavBar({ $$inline: true });
    	let if_block = /*isMarketer*/ ctx[0] == true && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(navbar.$$.fragment);
    			t = space();
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "bg-white row container justify-content-center m-auto");
    			add_location(div, file$1, 48, 4, 1563);
    			add_location(main, file$1, 46, 0, 1538);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(navbar, main, null);
    			append_dev(main, t);
    			append_dev(main, div);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isMarketer*/ ctx[0] == true) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isMarketer*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(navbar);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MainLander', slots, []);
    	let isMarketer = false;
    	const userDetail = JSON.parse(localStorage.getItem('admin_details'));
    	const timeNow = Math.floor(Date.now() / 1000);

    	onMount(() => {
    		const decodeToken = JSON.parse(atob(userDetail.token.split(".")[1]));

    		if (decodeToken.exp > timeNow) {
    			$$invalidate(0, isMarketer = true);
    		} else {
    			navigate('/');
    			localStorage.removeItem('admin_details');
    		}
    	}); // if(userDetail == null || userDetail == 'null'){
    	//     navigate('/')
    	// }else if(userDetail.type== 'superAdmin'){
    	//     isMarketer = false

    	// }else if(userDetail.type== 'marketer'){
    	//     isMarketer = true
    	// }
    	function logouthandle() {
    		localStorage.removeItem('admin_details');
    		navigate('/');
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MainLander> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Router: Router$1,
    		Route: Route$1,
    		Link: Link$1,
    		navigate,
    		NavBar,
    		Home: Order,
    		Print,
    		First: Firstpay,
    		Confirm: Confirmed,
    		Second,
    		Completed,
    		ProductView: Products,
    		ProductSearch: Search,
    		UserList: Users,
    		UserView,
    		Profile,
    		isMarketer,
    		userDetail,
    		timeNow,
    		logouthandle
    	});

    	$$self.$inject_state = $$props => {
    		if ('isMarketer' in $$props) $$invalidate(0, isMarketer = $$props.isMarketer);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isMarketer, logouthandle];
    }

    class MainLander extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MainLander",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.44.1 */
    const file = "src/App.svelte";

    // (11:1) <Router>
    function create_default_slot(ctx) {
    	let div;
    	let route0;
    	let t0;
    	let route1;
    	let t1;
    	let route2;
    	let current;

    	route0 = new Route$1({
    			props: { path: "/", component: Login },
    			$$inline: true
    		});

    	route1 = new Route$1({
    			props: {
    				path: "admin/*",
    				component: AdminLander,
    				primary: false
    			},
    			$$inline: true
    		});

    	route2 = new Route$1({
    			props: {
    				path: "marketer/*",
    				component: MainLander,
    				primary: false
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(route0.$$.fragment);
    			t0 = space();
    			create_component(route1.$$.fragment);
    			t1 = space();
    			create_component(route2.$$.fragment);
    			add_location(div, file, 11, 2, 318);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(route0, div, null);
    			append_dev(div, t0);
    			mount_component(route1, div, null);
    			append_dev(div, t1);
    			mount_component(route2, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(route2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(11:1) <Router>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(router.$$.fragment);
    			attr_dev(main, "class", "body svelte-1tulgmi");
    			add_location(main, file, 9, 0, 286);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(router, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(router);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Router: Router$1, Route: Route$1, Login, Admin: AdminLander, Marketer: MainLander });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
