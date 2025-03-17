import { defineStore } from 'pinia';
import {LockState, LockOptions, LockRequest} from "../js/models";


export const useLockStore = defineStore('ock', {
    state: () => ({
        locks: new Map<string, LockState>() // Map<lockName, LockState>
    }),
    actions: {
        async acquireLock(lockName: string, options: LockOptions = {}): Promise<void> {
            // 初始化锁（如果不存在）
            if (!this.locks.has(lockName)) {
                this.locks.set(lockName, {
                    isLocked: false,
                    queue: []
                });
            }
            const lock = this.locks.get(lockName)!;

            return new Promise((resolve, reject) => {
                const cleanup = () => {
                    if (options.timeout && request.timeoutId) {
                        clearTimeout(request.timeoutId);
                    }
                    const index = lock.queue.findIndex(item => item.resolve === resolve);
                    if (index !== -1) lock.queue.splice(index, 1);
                }
                // 设置超时（如果提供了超时时间）
                let timeoutId: number | undefined;
                if (options.timeout) {
                    timeoutId = window.setTimeout(() => {
                        cleanup();
                        reject(new Error(`[${lockName}] Lock acquisition timeout after ${options.timeout}ms`));
                    }, options.timeout);
                }

                const request: LockRequest = {
                    resolve: () => {
                        cleanup();
                        resolve();
                    },
                    reject,
                    timeoutId,
                    priority: options.priority || false // 是否插队
                };

                if (!lock.isLocked) {
                    lock.isLocked = true;
                    request.resolve();
                } else {
                    if (options.priority) {
                        // 插队到队列最前面
                        lock.queue.unshift(request);
                    } else {
                        // 正常排队
                        lock.queue.push(request);
                    }
                }
            });
        },

        releaseLock(lockName: string): void {
            if (!this.locks.has(lockName)) return;

            const lock = this.locks.get(lockName)!;
            if (lock.queue.length > 0) {
                const nextRequest = lock.queue.shift()!;
                nextRequest.resolve();
            } else {
                lock.isLocked = false;
            }
        }
    }
});