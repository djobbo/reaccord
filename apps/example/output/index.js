'use strict';

var node_crypto = require('node:crypto');
var discord_js = require('discord.js');
var dotenv = require('dotenv');

const isNodeType = type => value => {
  return value.type === type;
};
class BaseNode {
  children = [];
  parent = null; //@ts-expect-error

  attr = {};

  constructor(type) {
    this.uuid = node_crypto.randomUUID();
    this.type = type;
    this.children = [];
  }

  setParent(node) {
    this.parent = node;
    this.onNodeRender();
  }

  insertBefore(node, anchor) {
    if (!node) throw new Error("Wrong child type");

    if (anchor) {
      const anchorIndex = this.children.findIndex(child => anchor === child);
      this.children.splice(anchorIndex, 0, node);
    } else this.children.push(node);

    node.setParent(this);
  }

  setAttribute(name, value) {
    //@ts-expect-error
    this.attr[name] = value;
    this.onNodeRender();
  }

  get rootNode() {
    // Could be slow if element is deeply nested, maybe cache this in local variable
    return this.parent?.rootNode;
  }

  get parentNode() {
    if (!this.parent) throw new TypeError(`Couldn't find parent of ${this}`);
    return this.parent;
  }

  get firstChild() {
    return this.children[0];
  }

  get nextSibling() {
    const parent = this.parentNode;
    if (!parent) throw new TypeError(`Couldn't find parent of ${this}`);
    const nodeIndex = parent.children.findIndex(child => child === this);
    if (nodeIndex < 0) throw new TypeError(`Bad node ${this}`);
    return parent.children[nodeIndex + 1];
  }

  removeChild(node) {
    this.children = this.children.filter(child => child !== node);
  }

  onNodeRender() {
    if (!(this.rootNode instanceof RootNode)) return;
    this.rootNode.onNodeRender();
  }

  get display() {
    return {
      uuid: this.uuid,
      type: this.type,
      props: this.attr,
      children: this.children.map(child => child.display)
    };
  }

  toString() {
    return JSON.stringify(this.display, null, 2);
  }

}

class TextNode extends BaseNode {
  textContent = "";

  constructor(textContent) {
    super("textnode");
    this.textContent = textContent;
  }

  setTextContent(textContent) {
    this.textContent = textContent;
    this.onNodeRender();
  }

  get display() {
    return { ...super.display,
      textContent: this.textContent
    };
  }

  render() {
    return this.textContent;
  }

}

const renderTextNode = node => {
  if (!node) return "";
  if (Array.isArray(node)) return node.map(n => renderTextNode(n)).join("");
  if (typeof node === "function") return renderTextNode(node());
  if (!(node instanceof BaseNode)) return node.toString();
  if (node instanceof TextNode) return node.textContent; // if (isNodeType("a")(node)) return `[${renderTextNode(node.children)}](${node.attr.href})`
  // if (isNodeType("code")(node)) return `\`${renderTextNode(node.children)}\``
  // if (isNodeType("codeblock")(node))
  //     return `\`\`\`${node.attr.lang}\n${renderTextNode(node.children)}\n\`\`\``

  if (isNodeType("span")(node)) {
    let str = renderTextNode(node.children);
    if (node.attr.italic) str = `_${str}_`;
    if (node.attr.bold) str = `**${str}**`;
    return str;
  }

  if (isNodeType("br")(node)) return "\n";
  return "";
};

class ContentNode extends BaseNode {
  constructor() {
    super("content");
  }

  render() {
    return renderTextNode(this.children);
  }

}
const isContentNode = node => node instanceof ContentNode;

class EmbedNode extends BaseNode {
  constructor() {
    super("embed");
  }

  render() {
    const newEmbed = new discord_js.Embed();
    this.children.forEach(child => child.render(newEmbed));
    return newEmbed;
  }

}
const isEmbedNode = node => node instanceof EmbedNode;

class ButtonNode extends BaseNode {
  constructor() {
    super("button");
  }

  get customId() {
    return this.attr.id ? `${this.attr.id}-${this.uuid}` : this.uuid;
  }

  dispose() {
    this.disposer?.();
  }

  render() {
    const customId = this.customId;
    const button = new discord_js.ButtonComponent().setCustomId(customId).setDisabled(this.attr.disabled ?? false).setStyle(discord_js.ButtonStyle[this.attr.style ?? "Primary"]).setLabel(renderTextNode(this.children));
    this.dispose();
    if (!this.rootNode) throw new Error('Root element not found for button');
    const client = this.rootNode.client;

    const listener = interaction => {
      if (!interaction.isButton()) return;
      if (interaction.customId !== customId) return;
      if (!this.attr.onClick?.(interaction)) interaction.deferUpdate();
    };

    client.on("interactionCreate", listener);

    this.disposer = () => {
      client.removeListener("interactionCreate", listener);
    };

    return button;
  }

}
const isButtonNode = node => node instanceof ButtonNode;

class ActionRowNode extends BaseNode {
  constructor() {
    super("action-row");
  }

  render() {
    const actionRow = new discord_js.ActionRow();
    actionRow.setComponents(...this.children.filter(isButtonNode).map(child => child.render()));
    return actionRow;
  }

}
const isActionRowNode = node => node instanceof ActionRowNode;

class RootNode extends BaseNode {
  constructor(client, onRender) {
    super("root");
    this.client = client;
    this.onRender = onRender;
  }

  onNodeRender() {
    this.onRender?.(this);
  }

  get rootNode() {
    return this;
  }

  render() {
    return {
      content: this.children.filter(isContentNode).map(child => child.render()).at(-1) || "​",
      embeds: this.children.filter(isEmbedNode).map(child => child.render()),
      components: this.children.filter(isActionRowNode).map(child => child.render())
    };
  }

}

const equalFn = (a, b) => a === b;
const $PROXY = Symbol("solid-proxy");
const signalOptions = {
  equals: equalFn
};
let runEffects = runQueue;
const NOTPENDING = {};
const STALE = 1;
const PENDING = 2;
const UNOWNED = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var Owner = null;
let Transition = null;
let Listener = null;
let Pending = null;
let Updates = null;
let Effects = null;
let ExecCount = 0;
function createRoot(fn, detachedOwner) {
  const listener = Listener,
        owner = Owner,
        root = fn.length === 0 && !false ? UNOWNED : {
    owned: null,
    cleanups: null,
    context: null,
    owner: detachedOwner || owner
  };
  Owner = root;
  Listener = null;
  try {
    return runUpdates(() => fn(() => cleanNode(root)), true);
  } finally {
    Listener = listener;
    Owner = owner;
  }
}
function createSignal(value, options) {
  options = options ? Object.assign({}, signalOptions, options) : signalOptions;
  const s = {
    value,
    observers: null,
    observerSlots: null,
    pending: NOTPENDING,
    comparator: options.equals || undefined
  };
  const setter = value => {
    if (typeof value === "function") {
      value = value(s.pending !== NOTPENDING ? s.pending : s.value);
    }
    return writeSignal(s, value);
  };
  return [readSignal.bind(s), setter];
}
function createRenderEffect(fn, value, options) {
  const c = createComputation(fn, value, false, STALE);
  updateComputation(c);
}
function createMemo(fn, value, options) {
  options = options ? Object.assign({}, signalOptions, options) : signalOptions;
  const c = createComputation(fn, value, true, 0);
  c.pending = NOTPENDING;
  c.observers = null;
  c.observerSlots = null;
  c.comparator = options.equals || undefined;
  updateComputation(c);
  return readSignal.bind(c);
}
function batch(fn) {
  if (Pending) return fn();
  let result;
  const q = Pending = [];
  try {
    result = fn();
  } finally {
    Pending = null;
  }
  runUpdates(() => {
    for (let i = 0; i < q.length; i += 1) {
      const data = q[i];
      if (data.pending !== NOTPENDING) {
        const pending = data.pending;
        data.pending = NOTPENDING;
        writeSignal(data, pending);
      }
    }
  }, false);
  return result;
}
function untrack(fn) {
  let result,
      listener = Listener;
  Listener = null;
  result = fn();
  Listener = listener;
  return result;
}
function readSignal() {
  const runningTransition = Transition ;
  if (this.sources && (this.state || runningTransition )) {
    const updates = Updates;
    Updates = null;
    this.state === STALE || runningTransition  ? updateComputation(this) : lookDownstream(this);
    Updates = updates;
  }
  if (Listener) {
    const sSlot = this.observers ? this.observers.length : 0;
    if (!Listener.sources) {
      Listener.sources = [this];
      Listener.sourceSlots = [sSlot];
    } else {
      Listener.sources.push(this);
      Listener.sourceSlots.push(sSlot);
    }
    if (!this.observers) {
      this.observers = [Listener];
      this.observerSlots = [Listener.sources.length - 1];
    } else {
      this.observers.push(Listener);
      this.observerSlots.push(Listener.sources.length - 1);
    }
  }
  return this.value;
}
function writeSignal(node, value, isComp) {
  if (node.comparator) {
    if (node.comparator(node.value, value)) return value;
  }
  if (Pending) {
    if (node.pending === NOTPENDING) Pending.push(node);
    node.pending = value;
    return value;
  }
  let TransitionRunning = false;
  node.value = value;
  if (node.observers && node.observers.length) {
    runUpdates(() => {
      for (let i = 0; i < node.observers.length; i += 1) {
        const o = node.observers[i];
        if (TransitionRunning && Transition.disposed.has(o)) ;
        if (o.pure) Updates.push(o);else Effects.push(o);
        if (o.observers && (TransitionRunning && !o.tState || !TransitionRunning && !o.state)) markUpstream(o);
        if (TransitionRunning) ;else o.state = STALE;
      }
      if (Updates.length > 10e5) {
        Updates = [];
        if (false) ;
        throw new Error();
      }
    }, false);
  }
  return value;
}
function updateComputation(node) {
  if (!node.fn) return;
  cleanNode(node);
  const owner = Owner,
        listener = Listener,
        time = ExecCount;
  Listener = Owner = node;
  runComputation(node, node.value, time);
  Listener = listener;
  Owner = owner;
}
function runComputation(node, value, time) {
  let nextValue;
  try {
    nextValue = node.fn(value);
  } catch (err) {
    handleError(err);
  }
  if (!node.updatedAt || node.updatedAt <= time) {
    if (node.observers && node.observers.length) {
      writeSignal(node, nextValue);
    } else node.value = nextValue;
    node.updatedAt = time;
  }
}
function createComputation(fn, init, pure, state = STALE, options) {
  const c = {
    fn,
    state: state,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: init,
    owner: Owner,
    context: null,
    pure
  };
  if (Owner === null) ;else if (Owner !== UNOWNED) {
    {
      if (!Owner.owned) Owner.owned = [c];else Owner.owned.push(c);
    }
  }
  return c;
}
function runTop(node) {
  const runningTransition = Transition ;
  if (node.state !== STALE) return node.state = 0;
  if (node.suspense && untrack(node.suspense.inFallback)) return node.suspense.effects.push(node);
  const ancestors = [node];
  while ((node = node.owner) && (!node.updatedAt || node.updatedAt < ExecCount)) {
    if (node.state || runningTransition ) ancestors.push(node);
  }
  for (let i = ancestors.length - 1; i >= 0; i--) {
    node = ancestors[i];
    if (node.state === STALE || runningTransition ) {
      updateComputation(node);
    } else if (node.state === PENDING || runningTransition ) {
      const updates = Updates;
      Updates = null;
      lookDownstream(node, ancestors[0]);
      Updates = updates;
    }
  }
}
function runUpdates(fn, init) {
  if (Updates) return fn();
  let wait = false;
  if (!init) Updates = [];
  if (Effects) wait = true;else Effects = [];
  ExecCount++;
  try {
    return fn();
  } catch (err) {
    handleError(err);
  } finally {
    completeUpdates(wait);
  }
}
function completeUpdates(wait) {
  if (Updates) {
    runQueue(Updates);
    Updates = null;
  }
  if (wait) return;
  if (Effects.length) batch(() => {
    runEffects(Effects);
    Effects = null;
  });else {
    Effects = null;
  }
}
function runQueue(queue) {
  for (let i = 0; i < queue.length; i++) runTop(queue[i]);
}
function lookDownstream(node, ignore) {
  node.state = 0;
  const runningTransition = Transition ;
  for (let i = 0; i < node.sources.length; i += 1) {
    const source = node.sources[i];
    if (source.sources) {
      if (source.state === STALE || runningTransition ) {
        if (source !== ignore) runTop(source);
      } else if (source.state === PENDING || runningTransition ) lookDownstream(source, ignore);
    }
  }
}
function markUpstream(node) {
  const runningTransition = Transition ;
  for (let i = 0; i < node.observers.length; i += 1) {
    const o = node.observers[i];
    if (!o.state || runningTransition ) {
      o.state = PENDING;
      if (o.pure) Updates.push(o);else Effects.push(o);
      o.observers && markUpstream(o);
    }
  }
}
function cleanNode(node) {
  let i;
  if (node.sources) {
    while (node.sources.length) {
      const source = node.sources.pop(),
            index = node.sourceSlots.pop(),
            obs = source.observers;
      if (obs && obs.length) {
        const n = obs.pop(),
              s = source.observerSlots.pop();
        if (index < obs.length) {
          n.sourceSlots[s] = index;
          obs[index] = n;
          source.observerSlots[index] = s;
        }
      }
    }
  }
  if (node.owned) {
    for (i = 0; i < node.owned.length; i++) cleanNode(node.owned[i]);
    node.owned = null;
  }
  if (node.cleanups) {
    for (i = 0; i < node.cleanups.length; i++) node.cleanups[i]();
    node.cleanups = null;
  }
  node.state = 0;
  node.context = null;
}
function handleError(err) {
  throw err;
}
function createComponent$1(Comp, props) {
  return untrack(() => Comp(props));
}
function trueFn() {
  return true;
}
const propTraps = {
  get(_, property, receiver) {
    if (property === $PROXY) return receiver;
    return _.get(property);
  },
  has(_, property) {
    return _.has(property);
  },
  set: trueFn,
  deleteProperty: trueFn,
  getOwnPropertyDescriptor(_, property) {
    return {
      configurable: true,
      enumerable: true,
      get() {
        return _.get(property);
      },
      set: trueFn,
      deleteProperty: trueFn
    };
  },
  ownKeys(_) {
    return _.keys();
  }
};
function resolveSource(s) {
  return typeof s === "function" ? s() : s;
}
function mergeProps$2(...sources) {
  return new Proxy({
    get(property) {
      for (let i = sources.length - 1; i >= 0; i--) {
        const v = resolveSource(sources[i])[property];
        if (v !== undefined) return v;
      }
    },
    has(property) {
      for (let i = sources.length - 1; i >= 0; i--) {
        if (property in resolveSource(sources[i])) return true;
      }
      return false;
    },
    keys() {
      const keys = [];
      for (let i = 0; i < sources.length; i++) keys.push(...Object.keys(resolveSource(sources[i])));
      return [...new Set(keys)];
    }
  }, propTraps);
}

function memo$1(fn, equals) {
  return createMemo(fn, undefined, !equals ? {
    equals
  } : undefined);
}

function createRenderer$1({
  createElement,
  createTextNode,
  isTextNode,
  replaceText,
  insertNode,
  removeNode,
  setProperty,
  getParentNode,
  getFirstChild,
  getNextSibling
}) {
  function insert(parent, accessor, marker, initial) {
    if (marker !== undefined && !initial) initial = [];
    if (typeof accessor !== "function") return insertExpression(parent, accessor, initial, marker);
    createRenderEffect(current => insertExpression(parent, accessor(), current, marker), initial);
  }
  function insertExpression(parent, value, current, marker, unwrapArray) {
    while (typeof current === "function") current = current();
    if (value === current) return current;
    const t = typeof value,
          multi = marker !== undefined;
    if (t === "string" || t === "number") {
      if (t === "number") value = value.toString();
      if (multi) {
        let node = current[0];
        if (node && isTextNode(node)) {
          replaceText(node, value);
        } else node = createTextNode(value);
        current = cleanChildren(parent, current, marker, node);
      } else {
        if (current !== "" && typeof current === "string") {
          replaceText(getFirstChild(parent), current = value);
        } else {
          cleanChildren(parent, current, marker, createTextNode(value));
          current = value;
        }
      }
    } else if (value == null || t === "boolean") {
      current = cleanChildren(parent, current, marker);
    } else if (t === "function") {
      createRenderEffect(() => {
        let v = value();
        while (typeof v === "function") v = v();
        current = insertExpression(parent, v, current, marker);
      });
      return () => current;
    } else if (Array.isArray(value)) {
      const array = [];
      if (normalizeIncomingArray(array, value, unwrapArray)) {
        createRenderEffect(() => current = insertExpression(parent, array, current, marker, true));
        return () => current;
      }
      if (array.length === 0) {
        const replacement = cleanChildren(parent, current, marker);
        if (multi) return current = replacement;
      } else {
        if (Array.isArray(current)) {
          if (current.length === 0) {
            appendNodes(parent, array, marker);
          } else reconcileArrays(parent, current, array);
        } else if (current == null || current === "") {
          appendNodes(parent, array);
        } else {
          reconcileArrays(parent, multi && current || [getFirstChild(parent)], array);
        }
      }
      current = array;
    } else {
      if (Array.isArray(current)) {
        if (multi) return current = cleanChildren(parent, current, marker, value);
        cleanChildren(parent, current, null, value);
      } else if (current == null || current === "" || !getFirstChild(parent)) {
        insertNode(parent, value);
      } else replaceNode(parent, value, getFirstChild(parent));
      current = value;
    }
    return current;
  }
  function normalizeIncomingArray(normalized, array, unwrap) {
    let dynamic = false;
    for (let i = 0, len = array.length; i < len; i++) {
      let item = array[i],
          t;
      if (item == null || item === true || item === false) ; else if (Array.isArray(item)) {
        dynamic = normalizeIncomingArray(normalized, item) || dynamic;
      } else if ((t = typeof item) === "string" || t === "number") {
        normalized.push(createTextNode(item));
      } else if (t === "function") {
        if (unwrap) {
          while (typeof item === "function") item = item();
          dynamic = normalizeIncomingArray(normalized, Array.isArray(item) ? item : [item]) || dynamic;
        } else {
          normalized.push(item);
          dynamic = true;
        }
      } else normalized.push(item);
    }
    return dynamic;
  }
  function reconcileArrays(parentNode, a, b) {
    let bLength = b.length,
        aEnd = a.length,
        bEnd = bLength,
        aStart = 0,
        bStart = 0,
        after = getNextSibling(a[aEnd - 1]),
        map = null;
    while (aStart < aEnd || bStart < bEnd) {
      if (a[aStart] === b[bStart]) {
        aStart++;
        bStart++;
        continue;
      }
      while (a[aEnd - 1] === b[bEnd - 1]) {
        aEnd--;
        bEnd--;
      }
      if (aEnd === aStart) {
        const node = bEnd < bLength ? bStart ? getNextSibling(b[bStart - 1]) : b[bEnd - bStart] : after;
        while (bStart < bEnd) insertNode(parentNode, b[bStart++], node);
      } else if (bEnd === bStart) {
        while (aStart < aEnd) {
          if (!map || !map.has(a[aStart])) removeNode(parentNode, a[aStart]);
          aStart++;
        }
      } else if (a[aStart] === b[bEnd - 1] && b[bStart] === a[aEnd - 1]) {
        const node = getNextSibling(a[--aEnd]);
        insertNode(parentNode, b[bStart++], getNextSibling(a[aStart++]));
        insertNode(parentNode, b[--bEnd], node);
        a[aEnd] = b[bEnd];
      } else {
        if (!map) {
          map = new Map();
          let i = bStart;
          while (i < bEnd) map.set(b[i], i++);
        }
        const index = map.get(a[aStart]);
        if (index != null) {
          if (bStart < index && index < bEnd) {
            let i = aStart,
                sequence = 1,
                t;
            while (++i < aEnd && i < bEnd) {
              if ((t = map.get(a[i])) == null || t !== index + sequence) break;
              sequence++;
            }
            if (sequence > index - bStart) {
              const node = a[aStart];
              while (bStart < index) insertNode(parentNode, b[bStart++], node);
            } else replaceNode(parentNode, b[bStart++], a[aStart++]);
          } else aStart++;
        } else removeNode(parentNode, a[aStart++]);
      }
    }
  }
  function cleanChildren(parent, current, marker, replacement) {
    if (marker === undefined) {
      let removed;
      while (removed = getFirstChild(parent)) removeNode(parent, removed);
      replacement && insertNode(parent, replacement);
      return "";
    }
    const node = replacement || createTextNode("");
    if (current.length) {
      let inserted = false;
      for (let i = current.length - 1; i >= 0; i--) {
        const el = current[i];
        if (node !== el) {
          const isParent = getParentNode(el) === parent;
          if (!inserted && !i) isParent ? replaceNode(parent, node, el) : insertNode(parent, node, marker);else isParent && removeNode(parent, el);
        } else inserted = true;
      }
    } else insertNode(parent, node, marker);
    return [node];
  }
  function appendNodes(parent, array, marker) {
    for (let i = 0, len = array.length; i < len; i++) insertNode(parent, array[i], marker);
  }
  function replaceNode(parent, newNode, oldNode) {
    insertNode(parent, newNode, oldNode);
    removeNode(parent, oldNode);
  }
  function spreadExpression(node, props, prevProps = {}, skipChildren) {
    if (!skipChildren && "children" in props) {
      createRenderEffect(() => prevProps.children = insertExpression(node, props.children, prevProps.children));
    }
    createRenderEffect(() => {
      for (const prop in props) {
        if (prop === "children") continue;
        const value = props[prop];
        if (value === prevProps[prop]) continue;
        if (prop === "ref") value(node);else {
          setProperty(node, prop, value, prevProps[prop]);
          prevProps[prop] = value;
        }
      }
    });
    return prevProps;
  }
  return {
    render(code, element) {
      let disposer;
      createRoot(dispose => {
        disposer = dispose;
        insert(element, code());
      });
      return disposer;
    },
    insert,
    spread(node, accessor, skipChildren) {
      if (typeof accessor === "function") {
        createRenderEffect(current => spreadExpression(node, accessor(), current, skipChildren));
      } else spreadExpression(node, accessor, undefined, skipChildren);
    },
    createElement,
    createTextNode,
    insertNode,
    setProp(node, name, value, prev) {
      setProperty(node, name, value, prev);
      return value;
    },
    mergeProps: mergeProps$1,
    effect: createRenderEffect,
    memo: memo$1,
    createComponent: createComponent$1
  };
}
function mergeProps$1(...sources) {
  const target = {};
  for (let i = 0; i < sources.length; i++) {
    let source = sources[i];
    if (typeof source === "function") source = source();
    const descriptors = Object.getOwnPropertyDescriptors(source);
    Object.defineProperties(target, descriptors);
  }
  return target;
}

function createRenderer(options) {
  const renderer = createRenderer$1(options);
  renderer.mergeProps = mergeProps$2;
  return renderer;
}

class FieldNode extends BaseNode {
  constructor() {
    super("field");
  }

  render(embed) {
    embed.addFields({
      name: renderTextNode(this.attr.title),
      value: renderTextNode(this.children),
      inline: this.attr.inline
    });
    return;
  }

}

class InputNode extends BaseNode {
  constructor() {
    super("input");
  }

  get customId() {
    return this.attr.id ? `${this.attr.id}-${this.uuid}` : this.uuid;
  }

  render() {
    const customId = this.customId;
    const input = new discord_js.TextInputComponent().setCustomId(customId).setLabel(this.attr.label ?? "").setValue(this.attr.value ?? "").setPlaceholder(this.attr.placeholder ?? "").setRequired(this.attr.required ?? false).setStyle(this.attr.large ? discord_js.TextInputStyle.Paragraph : discord_js.TextInputStyle.Short);
    return input;
  }

}
const isInputNode = node => node instanceof InputNode;

class ModalRowNode extends BaseNode {
  constructor() {
    super("modal-row");
  }

  render() {
    const actionRow = new discord_js.ActionRow();
    actionRow.setComponents(...this.children.filter(isInputNode).map(child => child.render()));
    return actionRow;
  }

}
const isModalRowNode = node => node instanceof ModalRowNode;

class ModalNode extends BaseNode {
  constructor() {
    super("modal");
  }

  get customId() {
    return this.attr.id ? `${this.attr.id}-${this.uuid}` : this.uuid;
  }

  render() {
    if (!this.rootNode) throw new Error('Root element not found for modal');
    const client = this.rootNode.client;
    const customId = this.customId;
    const modal = new discord_js.Modal().setCustomId(customId).setTitle(this.attr.title ?? "").setComponents(...this.children.filter(isModalRowNode).map(child => child.render()));

    const listener = interaction => {
      if (!interaction.isModalSubmit()) return;
      if (interaction.customId !== customId) return;
      if (!this.attr.onSubmit?.(interaction)) interaction.reply({
        content: "ok",
        ephemeral: true
      });
      this.children.filter(isModalRowNode).forEach(row => row.children.filter(isInputNode).forEach(input => {
        const customId = input.attr.id ? `${input.attr.id}-${input.uuid}` : input.uuid;
        input.attr.onChange?.(interaction.fields.getTextInputValue(customId), interaction);
      }));
    };

    client.on("interactionCreate", listener);

    this.disposer = () => {
      client.removeListener("interactionCreate", listener);
    };

    return modal;
  }

}
const isModalNode = node => node instanceof ModalNode;

class TitleNode extends BaseNode {
  constructor() {
    super("title");
  }

  render(embed) {
    embed.setTitle(this.children.map(child => renderTextNode(child)).join(""));
  }

}

class TextContainerNode extends BaseNode {
  constructor(type) {
    super(type);
  }

  get innerText() {
    return this.children.map(child => child.render()).join("");
  }

}

class AnchorNode extends TextContainerNode {
  constructor() {
    super("a");
  }

  render() {
    return `[${this.innerText}](${this.attr.href})`;
  }

}

class CodeNode extends TextContainerNode {
  constructor() {
    super("code");
  }

  render() {
    return `\`${this.innerText}\``;
  }

}

class CodeblockNode extends TextContainerNode {
  constructor() {
    super("codeblock");
  }

  render() {
    return `\`\`\`${this.attr.lang}\n${this.innerText}\n\`\`\``;
  }

}

class SpanNode extends TextContainerNode {
  constructor() {
    super("span");
  }

  render() {
    let str = this.innerText;
    if (this.attr.italic) str = `_${str}_`;
    if (this.attr.bold) str = `**${str}**`;
    return str;
  }

}

class LineBreakNode extends TextContainerNode {
  constructor() {
    super("code");
  }

  render() {
    return `\n`;
  }

}

const {
  //@ts-expect-error
  render,
  effect,
  memo,
  createComponent,
  createElement,
  createTextNode,
  insertNode,
  insert,
  spread,
  setProp,
  mergeProps
} = createRenderer({
  createElement(tag) {
    switch (tag) {
      case "action-row":
        return new ActionRowNode();

      case "a":
        return new AnchorNode();

      case "button":
        return new ButtonNode();

      case "code":
        return new CodeNode();

      case "codeblock":
        return new CodeblockNode();

      case "content":
        return new ContentNode();

      case "embed":
        return new EmbedNode();

      case "field":
        return new FieldNode();

      case "input":
        return new InputNode();

      case "br":
        return new LineBreakNode();

      case "modal":
        return new ModalNode();

      case "modal-row":
        return new ModalRowNode();

      case "span":
        return new SpanNode();

      case "title":
        return new TitleNode();

      default:
        throw new Error(`<${tag}/> is not yet implemented :(`);
    }
  },

  createTextNode(textContent) {
    return new TextNode(textContent);
  },

  replaceText(textNode, textContent) {
    textNode.setTextContent(textContent);
  },

  setProperty(node, property, value) {
    node.setAttribute(property, value);
  },

  insertNode(parent, node, anchor) {
    parent.insertBefore(node, anchor);
  },

  isTextNode(node) {
    return node instanceof TextNode;
  },

  removeNode(parent, node) {
    parent.removeChild(node);
  },

  getParentNode(node) {
    return node.parentNode;
  },

  getFirstChild(node) {
    return node.firstChild;
  },

  getNextSibling(node) {
    return node.nextSibling;
  }

});

class ModalRootNode extends BaseNode {
  constructor(client) {
    super("modal-root");
    this.client = client;
  }

  get rootNode() {
    return this;
  }

  render() {
    const modalNode = this.firstChild;
    if (this.children.length !== 1 || !modalNode || !isModalNode(modalNode)) throw new Error("modal should only have one child, a <modal> node");
    return modalNode.render();
  }

}

const debounce = (fn, ms = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  };
};

const createModal = (client, code) => {
  const modal = new ModalRootNode(client);
  render(() => code, modal);
  return modal.render();
}; // If used directly inside button (<button onClick={openModal(Modal)}/>),
// will prevent the app from defering update, because opening a modal is
// already an interaction response.


const openModal$1 = client => modal => interaction => {
  interaction.showModal(createModal(client, modal));
  return true;
};

const renderMessage$1 = client => (channel, message) => {
  let msg = undefined;

  const cb = async root => {
    const rendered = root.render();
    if (msg) await msg.edit(rendered);else msg = await channel.send(rendered);
  };

  const root = new RootNode(client, debounce(cb, 50));
  render(message, root);
};

const solicord = client => {
  return {
    openModal: openModal$1(client),
    renderMessage: renderMessage$1(client)
  };
};

dotenv.config();
const client = new discord_js.Client({
  intents: ["Guilds", "GuildMessages"]
});
const {
  renderMessage,
  openModal
} = solicord(client);

const MyModal = ({
  myAwesomeFn
}) => {
  const [text, setText] = createSignal("");
  return (() => {
    const _el$ = createElement("modal"),
          _el$2 = createElement("modal-row"),
          _el$3 = createElement("input"),
          _el$4 = createElement("modal-row"),
          _el$5 = createElement("input");

    insertNode(_el$, _el$2);

    insertNode(_el$, _el$4);

    setProp(_el$, "title", "My Modal");

    setProp(_el$, "onSubmit", () => console.log("submit xd"));

    insertNode(_el$2, _el$3);

    setProp(_el$3, "onChange", myAwesomeFn);

    setProp(_el$3, "label", "BRUH");

    insertNode(_el$4, _el$5);

    setProp(_el$5, "onChange", newText => setText(newText));

    setProp(_el$5, "large", true);

    effect(_p$ => {
      const _v$ = text(),
            _v$2 = text() || "Enter text lol";

      _v$ !== _p$._v$ && (_p$._v$ = setProp(_el$5, "value", _v$, _p$._v$));
      _v$2 !== _p$._v$2 && (_p$._v$2 = setProp(_el$5, "label", _v$2, _p$._v$2));
      return _p$;
    }, {
      _v$: undefined,
      _v$2: undefined
    });

    return _el$;
  })();
};

const App = ({
  username
}) => {
  const [count, setCount] = createSignal(0);
  const [name, setName] = createSignal(username);
  return [(() => {
    const _el$6 = createElement("embed"),
          _el$7 = createElement("title"),
          _el$8 = createTextNode("Hi "),
          _el$9 = createElement("field"),
          _el$10 = createTextNode("Field"),
          _el$11 = createElement("a");

    insertNode(_el$6, _el$7);

    insertNode(_el$6, _el$9);

    insertNode(_el$7, _el$8);

    insert(_el$7, name, null);

    insertNode(_el$9, _el$10);

    insertNode(_el$9, _el$11);

    setProp(_el$9, "title", "Field");

    insertNode(_el$11, createTextNode("Google"));

    setProp(_el$11, "href", "https://google.com");

    return _el$6;
  })(), (() => {
    const _el$13 = createElement("content"),
          _el$14 = createTextNode("Hello"),
          _el$15 = createElement("codeblock"),
          _el$16 = createTextNode("console.log('"),
          _el$17 = createTextNode("')"),
          _el$18 = createElement("code"),
          _el$20 = createElement("span"),
          _el$22 = createElement("span"),
          _el$24 = createElement("br"),
          _el$25 = createElement("span");

    insertNode(_el$13, _el$14);

    insertNode(_el$13, _el$15);

    insertNode(_el$13, _el$18);

    insertNode(_el$13, _el$20);

    insertNode(_el$13, _el$22);

    insertNode(_el$13, _el$24);

    insertNode(_el$13, _el$25);

    insertNode(_el$15, _el$16);

    insertNode(_el$15, _el$17);

    setProp(_el$15, "lang", "js");

    insert(_el$15, count, _el$17);

    insertNode(_el$18, createTextNode("xd"));

    insertNode(_el$20, createTextNode("Bold"));

    setProp(_el$20, "bold", true);

    insertNode(_el$22, createTextNode("Italic"));

    setProp(_el$22, "italic", true);

    insertNode(_el$25, createTextNode("BoldItalic"));

    setProp(_el$25, "bold", true);

    setProp(_el$25, "italic", true);

    return _el$13;
  })(), (() => {
    const _el$27 = createElement("action-row"),
          _el$28 = createElement("button"),
          _el$30 = createElement("button"),
          _el$31 = createElement("button");

    insertNode(_el$27, _el$28);

    insertNode(_el$27, _el$30);

    insertNode(_el$27, _el$31);

    insertNode(_el$28, createTextNode("-"));

    setProp(_el$28, "id", "add");

    setProp(_el$28, "style", "Danger");

    setProp(_el$28, "onClick", () => {
      setCount(count => count - 1);
    });

    setProp(_el$30, "style", "Secondary");

    setProp(_el$30, "disabled", true);

    insert(_el$30, count);

    insertNode(_el$31, createTextNode("+"));

    setProp(_el$31, "id", "substract");

    setProp(_el$31, "style", "Success");

    setProp(_el$31, "onClick", () => {
      setCount(count => count + 1);
    });

    return _el$27;
  })(), (() => {
    const _el$33 = createElement("action-row"),
          _el$34 = createElement("button");

    insertNode(_el$33, _el$34);

    insertNode(_el$34, createTextNode("Open Modal"));

    setProp(_el$34, "id", "add");

    setProp(_el$34, "style", "Secondary");

    effect(_$p => setProp(_el$34, "onClick", openModal(createComponent(MyModal, {
      myAwesomeFn: newName => setName(newName)
    })), _$p));

    return _el$33;
  })()];
};

client.on("ready", () => console.log("Bot Started!"));
client.on("messageCreate", message => {
  const {
    content,
    channel
  } = message;
  if (content !== "a") return;
  renderMessage(channel, () => createComponent(App, {
    get username() {
      return message.author.username;
    }

  }));
});
client.login(process.env.DISCORD_TOKEN);
