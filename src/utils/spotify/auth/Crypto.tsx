export class Crypto {
    public static get current() {
        return this.hasSubtleCrypto ? window.crypto : this.tryLoadNodeWebCrypto();
    }

    private static get hasSubtleCrypto() {
        return typeof window !== 'undefined' && typeof window.crypto !== 'undefined' && typeof window.crypto.subtle !== 'undefined';
    }

    private static tryLoadNodeWebCrypto() {
        // eslint-disable-next-line no-useless-catch
        try {
            // Deliberately avoid bundling for browsers depending
            // on node by doing this require during execution.
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { webcrypto } = require('crypto');
            return webcrypto;
        } catch (e) {
            throw e;
        }
    }
}
