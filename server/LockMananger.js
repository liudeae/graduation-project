class LockManager {
    constructor() {
        this.locks = new Map();
    }

    async acquire(lockName, timeout = 5000) {
        if (!this.locks.has(lockName)) {
            this.locks.set(lockName, {
                isHeld: false,
                currentToken: null,
                queue: []
            });
        }

        const lock = this.locks.get(lockName);

        if (!lock.isHeld) {
            const token = Symbol();
            lock.isHeld = true;
            lock.currentToken = token;
            return { release: () => this.release(lockName, token) };
        }

        return new Promise((resolve, reject) => {
            const entry = {
                resolve: (token) => {
                    clearTimeout(entry.timer);
                    resolve({ release: () => this.release(lockName, token) });
                }
            };

            entry.timer = setTimeout(() => {
                const index = lock.queue.indexOf(entry);
                if (index >= 0) lock.queue.splice(index, 1);
                reject(new Error(`Lock ${lockName} acquisition timed out`));
            }, timeout);

            lock.queue.push(entry);
        });
    }

    release(lockName, token) {
        const lock = this.locks.get(lockName);

        if (!lock || !lock.isHeld || lock.currentToken !== token) {
            throw new Error('Lock not held by the caller');
        }

        if (lock.queue.length > 0) {
            const newToken = Symbol();
            const next = lock.queue.shift();
            lock.currentToken = newToken;
            next.resolve(newToken);
        } else {
            lock.isHeld = false;
            lock.currentToken = null;
            this.locks.delete(lockName); // 释放内存
        }
    }
}
module.exports = LockManager;