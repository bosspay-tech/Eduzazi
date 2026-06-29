import {
  createBossPayBridge,
  createEasebuzzHandlers,
  createWebFetchHandler,
  MemoryTxnStore,
  type BossPayBridge,
  type BridgeHandlers,
  type EasebuzzEnv,
} from '@dpx/bridge-node';

type BridgeGlobals = typeof globalThis & {
  __educaziBossPayBridge?: BossPayBridge;
  __educaziBossPayTxnStore?: MemoryTxnStore;
  __educaziBossPayFetchHandler?: ReturnType<typeof createWebFetchHandler>;
};

const g = globalThis as BridgeGlobals;

function trimEnv(value: string | undefined): string {
  return (value ?? '').trim().replace(/^["']|["']$/g, '');
}

function getEasebuzzEnv(): EasebuzzEnv {
  return trimEnv(process.env.EASEBUZZ_ENV) === 'test' ? 'test' : 'prod';
}

function getEasebuzzCredentials() {
  const key = trimEnv(process.env.EASEBUZZ_KEY);
  const salt = trimEnv(process.env.EASEBUZZ_SALT);
  if (!key || !salt) {
    throw new Error('EASEBUZZ_KEY and EASEBUZZ_SALT must be set in environment variables');
  }
  return { key, salt, env: getEasebuzzEnv() };
}

function getBridgeSecret(): string {
  const secret = trimEnv(process.env.BOSSPAY_BRIDGE_SECRET);
  if (!secret) {
    throw new Error('BOSSPAY_BRIDGE_SECRET must be set for the DollerpayX bridge');
  }
  return secret;
}

function getBosspayApiBase(): string {
  return trimEnv(process.env.BOSSPAY_API_BASE) || 'https://api.dpxreal.com';
}

function getHandlers(): BridgeHandlers {
  const { key, salt, env } = getEasebuzzCredentials();
  return {
    easebuzz: createEasebuzzHandlers({
      key,
      salt,
      env,
      productinfo: 'Educazi Counseling Fee',
    }),
  };
}

function getTxnStore(): MemoryTxnStore {
  if (!g.__educaziBossPayTxnStore) {
    g.__educaziBossPayTxnStore = new MemoryTxnStore();
  }
  return g.__educaziBossPayTxnStore;
}

function getHandlerContext() {
  return {
    handlers: getHandlers(),
    txnStore: getTxnStore(),
    bosspayApiBase: getBosspayApiBase(),
    version: '1.0.0',
  };
}

/** DollerpayX bridge instance — webhook forwarding + txn store. */
export function getBossPayBridge(): BossPayBridge {
  if (!g.__educaziBossPayBridge) {
    g.__educaziBossPayBridge = createBossPayBridge({
      bridgeSecret: getBridgeSecret(),
      bosspayApiBase: getBosspayApiBase(),
      handlers: getHandlers(),
      txnStore: getTxnStore(),
      version: '1.0.0',
    });
  }
  return g.__educaziBossPayBridge;
}

/** Web Fetch handler for `/wp-json/bosspay/v1/*` (WordPress-compatible path). */
export function getBridgeFetchHandler() {
  if (!g.__educaziBossPayFetchHandler) {
    g.__educaziBossPayFetchHandler = createWebFetchHandler({
      ctx: getHandlerContext(),
      bridgeSecret: getBridgeSecret(),
    });
  }
  return g.__educaziBossPayFetchHandler;
}
