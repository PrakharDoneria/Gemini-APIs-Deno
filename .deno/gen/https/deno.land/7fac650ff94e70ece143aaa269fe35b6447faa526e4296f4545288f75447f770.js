// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
// Utility for representing n-tuple
class Queue {
    #source;
    #queue;
    head;
    done;
    constructor(iterable){
        this.#source = iterable[Symbol.asyncIterator]();
        this.#queue = {
            value: undefined,
            next: undefined
        };
        this.head = this.#queue;
        this.done = false;
    }
    async next() {
        const result = await this.#source.next();
        if (!result.done) {
            const nextNode = {
                value: result.value,
                next: undefined
            };
            this.#queue.next = nextNode;
            this.#queue = nextNode;
        } else {
            this.done = true;
        }
    }
}
/**
 * Branches the given async iterable into the n branches.
 *
 * Example:
 *
 * ```ts
 *     import { tee } from "./tee.ts";
 *
 *     const gen = async function* gen() {
 *       yield 1;
 *       yield 2;
 *       yield 3;
 *     }
 *
 *     const [branch1, branch2] = tee(gen());
 *
 *     for await (const n of branch1) {
 *       console.log(n); // => 1, 2, 3
 *     }
 *
 *     for await (const n of branch2) {
 *       console.log(n); // => 1, 2, 3
 *     }
 * ```
 */ export function tee(iterable, n = 2) {
    const queue = new Queue(iterable);
    async function* generator() {
        let buffer = queue.head;
        while(true){
            if (buffer.next) {
                buffer = buffer.next;
                yield buffer.value;
            } else if (queue.done) {
                return;
            } else {
                await queue.next();
            }
        }
    }
    const branches = Array.from({
        length: n
    }).map(()=>generator());
    return branches;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjE1NS4wL2FzeW5jL3RlZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxOC0yMDIyIHRoZSBEZW5vIGF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuIE1JVCBsaWNlbnNlLlxuLy8gVGhpcyBtb2R1bGUgaXMgYnJvd3NlciBjb21wYXRpYmxlLlxuXG4vLyBVdGlsaXR5IGZvciByZXByZXNlbnRpbmcgbi10dXBsZVxudHlwZSBUdXBsZTxULCBOIGV4dGVuZHMgbnVtYmVyPiA9IE4gZXh0ZW5kcyBOXG4gID8gbnVtYmVyIGV4dGVuZHMgTiA/IFRbXSA6IFR1cGxlT2Y8VCwgTiwgW10+XG4gIDogbmV2ZXI7XG50eXBlIFR1cGxlT2Y8VCwgTiBleHRlbmRzIG51bWJlciwgUiBleHRlbmRzIHVua25vd25bXT4gPSBSW1wibGVuZ3RoXCJdIGV4dGVuZHMgTlxuICA/IFJcbiAgOiBUdXBsZU9mPFQsIE4sIFtULCAuLi5SXT47XG5cbmludGVyZmFjZSBRdWV1ZU5vZGU8VD4ge1xuICB2YWx1ZTogVDtcbiAgbmV4dDogUXVldWVOb2RlPFQ+IHwgdW5kZWZpbmVkO1xufVxuXG5jbGFzcyBRdWV1ZTxUPiB7XG4gICNzb3VyY2U6IEFzeW5jSXRlcmF0b3I8VD47XG4gICNxdWV1ZTogUXVldWVOb2RlPFQ+O1xuICBoZWFkOiBRdWV1ZU5vZGU8VD47XG5cbiAgZG9uZTogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihpdGVyYWJsZTogQXN5bmNJdGVyYWJsZTxUPikge1xuICAgIHRoaXMuI3NvdXJjZSA9IGl0ZXJhYmxlW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSgpO1xuICAgIHRoaXMuI3F1ZXVlID0ge1xuICAgICAgdmFsdWU6IHVuZGVmaW5lZCEsXG4gICAgICBuZXh0OiB1bmRlZmluZWQsXG4gICAgfTtcbiAgICB0aGlzLmhlYWQgPSB0aGlzLiNxdWV1ZTtcbiAgICB0aGlzLmRvbmUgPSBmYWxzZTtcbiAgfVxuXG4gIGFzeW5jIG5leHQoKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy4jc291cmNlLm5leHQoKTtcbiAgICBpZiAoIXJlc3VsdC5kb25lKSB7XG4gICAgICBjb25zdCBuZXh0Tm9kZTogUXVldWVOb2RlPFQ+ID0ge1xuICAgICAgICB2YWx1ZTogcmVzdWx0LnZhbHVlLFxuICAgICAgICBuZXh0OiB1bmRlZmluZWQsXG4gICAgICB9O1xuICAgICAgdGhpcy4jcXVldWUubmV4dCA9IG5leHROb2RlO1xuICAgICAgdGhpcy4jcXVldWUgPSBuZXh0Tm9kZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBCcmFuY2hlcyB0aGUgZ2l2ZW4gYXN5bmMgaXRlcmFibGUgaW50byB0aGUgbiBicmFuY2hlcy5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqIGBgYHRzXG4gKiAgICAgaW1wb3J0IHsgdGVlIH0gZnJvbSBcIi4vdGVlLnRzXCI7XG4gKlxuICogICAgIGNvbnN0IGdlbiA9IGFzeW5jIGZ1bmN0aW9uKiBnZW4oKSB7XG4gKiAgICAgICB5aWVsZCAxO1xuICogICAgICAgeWllbGQgMjtcbiAqICAgICAgIHlpZWxkIDM7XG4gKiAgICAgfVxuICpcbiAqICAgICBjb25zdCBbYnJhbmNoMSwgYnJhbmNoMl0gPSB0ZWUoZ2VuKCkpO1xuICpcbiAqICAgICBmb3IgYXdhaXQgKGNvbnN0IG4gb2YgYnJhbmNoMSkge1xuICogICAgICAgY29uc29sZS5sb2cobik7IC8vID0+IDEsIDIsIDNcbiAqICAgICB9XG4gKlxuICogICAgIGZvciBhd2FpdCAoY29uc3QgbiBvZiBicmFuY2gyKSB7XG4gKiAgICAgICBjb25zb2xlLmxvZyhuKTsgLy8gPT4gMSwgMiwgM1xuICogICAgIH1cbiAqIGBgYFxuICovXG5leHBvcnQgZnVuY3Rpb24gdGVlPFQsIE4gZXh0ZW5kcyBudW1iZXIgPSAyPihcbiAgaXRlcmFibGU6IEFzeW5jSXRlcmFibGU8VD4sXG4gIG46IE4gPSAyIGFzIE4sXG4pOiBUdXBsZTxBc3luY0l0ZXJhYmxlPFQ+LCBOPiB7XG4gIGNvbnN0IHF1ZXVlID0gbmV3IFF1ZXVlPFQ+KGl0ZXJhYmxlKTtcblxuICBhc3luYyBmdW5jdGlvbiogZ2VuZXJhdG9yKCk6IEFzeW5jR2VuZXJhdG9yPFQ+IHtcbiAgICBsZXQgYnVmZmVyID0gcXVldWUuaGVhZDtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgaWYgKGJ1ZmZlci5uZXh0KSB7XG4gICAgICAgIGJ1ZmZlciA9IGJ1ZmZlci5uZXh0O1xuICAgICAgICB5aWVsZCBidWZmZXIudmFsdWU7XG4gICAgICB9IGVsc2UgaWYgKHF1ZXVlLmRvbmUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXdhaXQgcXVldWUubmV4dCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGJyYW5jaGVzID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogbiB9KS5tYXAoXG4gICAgKCkgPT4gZ2VuZXJhdG9yKCksXG4gICkgYXMgVHVwbGU8XG4gICAgQXN5bmNJdGVyYWJsZTxUPixcbiAgICBOXG4gID47XG4gIHJldHVybiBicmFuY2hlcztcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwwRUFBMEU7QUFDMUUscUNBQXFDO0FBRXJDLG1DQUFtQztBQWFuQyxNQUFNO0lBQ0osQ0FBQyxNQUFNLENBQW1CO0lBQzFCLENBQUMsS0FBSyxDQUFlO0lBQ3JCLEtBQW1CO0lBRW5CLEtBQWM7SUFFZCxZQUFZLFFBQTBCLENBQUU7UUFDdEMsSUFBSSxDQUFDLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxPQUFPLGFBQWEsQ0FBQztRQUM3QyxJQUFJLENBQUMsQ0FBQyxLQUFLLEdBQUc7WUFDWixPQUFPO1lBQ1AsTUFBTTtRQUNSO1FBQ0EsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxLQUFLO1FBQ3ZCLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSztJQUNuQjtJQUVBLE1BQU0sT0FBTztRQUNYLE1BQU0sU0FBUyxNQUFNLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJO1FBQ3RDLElBQUksQ0FBQyxPQUFPLElBQUksRUFBRTtZQUNoQixNQUFNLFdBQXlCO2dCQUM3QixPQUFPLE9BQU8sS0FBSztnQkFDbkIsTUFBTTtZQUNSO1lBQ0EsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRztZQUNuQixJQUFJLENBQUMsQ0FBQyxLQUFLLEdBQUc7UUFDaEIsT0FBTztZQUNMLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSTtRQUNsQixDQUFDO0lBQ0g7QUFDRjtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0F3QkMsR0FDRCxPQUFPLFNBQVMsSUFDZCxRQUEwQixFQUMxQixJQUFPLENBQU0sRUFDZTtJQUM1QixNQUFNLFFBQVEsSUFBSSxNQUFTO0lBRTNCLGdCQUFnQixZQUErQjtRQUM3QyxJQUFJLFNBQVMsTUFBTSxJQUFJO1FBQ3ZCLE1BQU8sSUFBSSxDQUFFO1lBQ1gsSUFBSSxPQUFPLElBQUksRUFBRTtnQkFDZixTQUFTLE9BQU8sSUFBSTtnQkFDcEIsTUFBTSxPQUFPLEtBQUs7WUFDcEIsT0FBTyxJQUFJLE1BQU0sSUFBSSxFQUFFO2dCQUNyQjtZQUNGLE9BQU87Z0JBQ0wsTUFBTSxNQUFNLElBQUk7WUFDbEIsQ0FBQztRQUNIO0lBQ0Y7SUFFQSxNQUFNLFdBQVcsTUFBTSxJQUFJLENBQUM7UUFBRSxRQUFRO0lBQUUsR0FBRyxHQUFHLENBQzVDLElBQU07SUFLUixPQUFPO0FBQ1QsQ0FBQyJ9