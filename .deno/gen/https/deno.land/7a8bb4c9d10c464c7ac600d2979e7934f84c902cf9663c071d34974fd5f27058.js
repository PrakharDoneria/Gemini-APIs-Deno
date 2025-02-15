// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
import { deferred } from "./deferred.ts";
export function abortable(p, signal) {
    if (p instanceof Promise) {
        return abortablePromise(p, signal);
    } else {
        return abortableAsyncIterable(p, signal);
    }
}
/** Make Promise abortable with the given signal. */ export function abortablePromise(p, signal) {
    if (signal.aborted) {
        return Promise.reject(createAbortError(signal.reason));
    }
    const waiter = deferred();
    const abort = ()=>waiter.reject(createAbortError(signal.reason));
    signal.addEventListener("abort", abort, {
        once: true
    });
    return Promise.race([
        waiter,
        p.finally(()=>{
            signal.removeEventListener("abort", abort);
        })
    ]);
}
/** Make AsyncIterable abortable with the given signal. */ export async function* abortableAsyncIterable(p, signal) {
    if (signal.aborted) {
        throw createAbortError(signal.reason);
    }
    const waiter = deferred();
    const abort = ()=>waiter.reject(createAbortError(signal.reason));
    signal.addEventListener("abort", abort, {
        once: true
    });
    const it = p[Symbol.asyncIterator]();
    while(true){
        const { done , value  } = await Promise.race([
            waiter,
            it.next()
        ]);
        if (done) {
            signal.removeEventListener("abort", abort);
            return;
        }
        yield value;
    }
}
// This `reason` comes from `AbortSignal` thus must be `any`.
// deno-lint-ignore no-explicit-any
function createAbortError(reason) {
    return new DOMException(reason ? `Aborted: ${reason}` : "Aborted", "AbortError");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjE1NS4wL2FzeW5jL2Fib3J0YWJsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxOC0yMDIyIHRoZSBEZW5vIGF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuIE1JVCBsaWNlbnNlLlxuaW1wb3J0IHsgZGVmZXJyZWQgfSBmcm9tIFwiLi9kZWZlcnJlZC50c1wiO1xuXG4vKiogTWFrZSBQcm9taXNlIG9yIEFzeW5jSXRlcmFibGUgYWJvcnRhYmxlIHdpdGggdGhlIGdpdmVuIHNpZ25hbC4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhYm9ydGFibGU8VD4ocDogUHJvbWlzZTxUPiwgc2lnbmFsOiBBYm9ydFNpZ25hbCk6IFByb21pc2U8VD47XG5leHBvcnQgZnVuY3Rpb24gYWJvcnRhYmxlPFQ+KFxuICBwOiBBc3luY0l0ZXJhYmxlPFQ+LFxuICBzaWduYWw6IEFib3J0U2lnbmFsLFxuKTogQXN5bmNHZW5lcmF0b3I8VD47XG5leHBvcnQgZnVuY3Rpb24gYWJvcnRhYmxlPFQ+KFxuICBwOiBQcm9taXNlPFQ+IHwgQXN5bmNJdGVyYWJsZTxUPixcbiAgc2lnbmFsOiBBYm9ydFNpZ25hbCxcbik6IFByb21pc2U8VD4gfCBBc3luY0l0ZXJhYmxlPFQ+IHtcbiAgaWYgKHAgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgcmV0dXJuIGFib3J0YWJsZVByb21pc2UocCwgc2lnbmFsKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYWJvcnRhYmxlQXN5bmNJdGVyYWJsZShwLCBzaWduYWwpO1xuICB9XG59XG5cbi8qKiBNYWtlIFByb21pc2UgYWJvcnRhYmxlIHdpdGggdGhlIGdpdmVuIHNpZ25hbC4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhYm9ydGFibGVQcm9taXNlPFQ+KFxuICBwOiBQcm9taXNlPFQ+LFxuICBzaWduYWw6IEFib3J0U2lnbmFsLFxuKTogUHJvbWlzZTxUPiB7XG4gIGlmIChzaWduYWwuYWJvcnRlZCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChjcmVhdGVBYm9ydEVycm9yKHNpZ25hbC5yZWFzb24pKTtcbiAgfVxuICBjb25zdCB3YWl0ZXIgPSBkZWZlcnJlZDxuZXZlcj4oKTtcbiAgY29uc3QgYWJvcnQgPSAoKSA9PiB3YWl0ZXIucmVqZWN0KGNyZWF0ZUFib3J0RXJyb3Ioc2lnbmFsLnJlYXNvbikpO1xuICBzaWduYWwuYWRkRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsIGFib3J0LCB7IG9uY2U6IHRydWUgfSk7XG4gIHJldHVybiBQcm9taXNlLnJhY2UoW1xuICAgIHdhaXRlcixcbiAgICBwLmZpbmFsbHkoKCkgPT4ge1xuICAgICAgc2lnbmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJhYm9ydFwiLCBhYm9ydCk7XG4gICAgfSksXG4gIF0pO1xufVxuXG4vKiogTWFrZSBBc3luY0l0ZXJhYmxlIGFib3J0YWJsZSB3aXRoIHRoZSBnaXZlbiBzaWduYWwuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24qIGFib3J0YWJsZUFzeW5jSXRlcmFibGU8VD4oXG4gIHA6IEFzeW5jSXRlcmFibGU8VD4sXG4gIHNpZ25hbDogQWJvcnRTaWduYWwsXG4pOiBBc3luY0dlbmVyYXRvcjxUPiB7XG4gIGlmIChzaWduYWwuYWJvcnRlZCkge1xuICAgIHRocm93IGNyZWF0ZUFib3J0RXJyb3Ioc2lnbmFsLnJlYXNvbik7XG4gIH1cbiAgY29uc3Qgd2FpdGVyID0gZGVmZXJyZWQ8bmV2ZXI+KCk7XG4gIGNvbnN0IGFib3J0ID0gKCkgPT4gd2FpdGVyLnJlamVjdChjcmVhdGVBYm9ydEVycm9yKHNpZ25hbC5yZWFzb24pKTtcbiAgc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoXCJhYm9ydFwiLCBhYm9ydCwgeyBvbmNlOiB0cnVlIH0pO1xuXG4gIGNvbnN0IGl0ID0gcFtTeW1ib2wuYXN5bmNJdGVyYXRvcl0oKTtcbiAgd2hpbGUgKHRydWUpIHtcbiAgICBjb25zdCB7IGRvbmUsIHZhbHVlIH0gPSBhd2FpdCBQcm9taXNlLnJhY2UoW3dhaXRlciwgaXQubmV4dCgpXSk7XG4gICAgaWYgKGRvbmUpIHtcbiAgICAgIHNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKFwiYWJvcnRcIiwgYWJvcnQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB5aWVsZCB2YWx1ZTtcbiAgfVxufVxuXG4vLyBUaGlzIGByZWFzb25gIGNvbWVzIGZyb20gYEFib3J0U2lnbmFsYCB0aHVzIG11c3QgYmUgYGFueWAuXG4vLyBkZW5vLWxpbnQtaWdub3JlIG5vLWV4cGxpY2l0LWFueVxuZnVuY3Rpb24gY3JlYXRlQWJvcnRFcnJvcihyZWFzb24/OiBhbnkpOiBET01FeGNlcHRpb24ge1xuICByZXR1cm4gbmV3IERPTUV4Y2VwdGlvbihcbiAgICByZWFzb24gPyBgQWJvcnRlZDogJHtyZWFzb259YCA6IFwiQWJvcnRlZFwiLFxuICAgIFwiQWJvcnRFcnJvclwiLFxuICApO1xufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDBFQUEwRTtBQUMxRSxTQUFTLFFBQVEsUUFBUSxnQkFBZ0I7QUFRekMsT0FBTyxTQUFTLFVBQ2QsQ0FBZ0MsRUFDaEMsTUFBbUIsRUFDWTtJQUMvQixJQUFJLGFBQWEsU0FBUztRQUN4QixPQUFPLGlCQUFpQixHQUFHO0lBQzdCLE9BQU87UUFDTCxPQUFPLHVCQUF1QixHQUFHO0lBQ25DLENBQUM7QUFDSCxDQUFDO0FBRUQsa0RBQWtELEdBQ2xELE9BQU8sU0FBUyxpQkFDZCxDQUFhLEVBQ2IsTUFBbUIsRUFDUDtJQUNaLElBQUksT0FBTyxPQUFPLEVBQUU7UUFDbEIsT0FBTyxRQUFRLE1BQU0sQ0FBQyxpQkFBaUIsT0FBTyxNQUFNO0lBQ3RELENBQUM7SUFDRCxNQUFNLFNBQVM7SUFDZixNQUFNLFFBQVEsSUFBTSxPQUFPLE1BQU0sQ0FBQyxpQkFBaUIsT0FBTyxNQUFNO0lBQ2hFLE9BQU8sZ0JBQWdCLENBQUMsU0FBUyxPQUFPO1FBQUUsTUFBTSxJQUFJO0lBQUM7SUFDckQsT0FBTyxRQUFRLElBQUksQ0FBQztRQUNsQjtRQUNBLEVBQUUsT0FBTyxDQUFDLElBQU07WUFDZCxPQUFPLG1CQUFtQixDQUFDLFNBQVM7UUFDdEM7S0FDRDtBQUNILENBQUM7QUFFRCx3REFBd0QsR0FDeEQsT0FBTyxnQkFBZ0IsdUJBQ3JCLENBQW1CLEVBQ25CLE1BQW1CLEVBQ0E7SUFDbkIsSUFBSSxPQUFPLE9BQU8sRUFBRTtRQUNsQixNQUFNLGlCQUFpQixPQUFPLE1BQU0sRUFBRTtJQUN4QyxDQUFDO0lBQ0QsTUFBTSxTQUFTO0lBQ2YsTUFBTSxRQUFRLElBQU0sT0FBTyxNQUFNLENBQUMsaUJBQWlCLE9BQU8sTUFBTTtJQUNoRSxPQUFPLGdCQUFnQixDQUFDLFNBQVMsT0FBTztRQUFFLE1BQU0sSUFBSTtJQUFDO0lBRXJELE1BQU0sS0FBSyxDQUFDLENBQUMsT0FBTyxhQUFhLENBQUM7SUFDbEMsTUFBTyxJQUFJLENBQUU7UUFDWCxNQUFNLEVBQUUsS0FBSSxFQUFFLE1BQUssRUFBRSxHQUFHLE1BQU0sUUFBUSxJQUFJLENBQUM7WUFBQztZQUFRLEdBQUcsSUFBSTtTQUFHO1FBQzlELElBQUksTUFBTTtZQUNSLE9BQU8sbUJBQW1CLENBQUMsU0FBUztZQUNwQztRQUNGLENBQUM7UUFDRCxNQUFNO0lBQ1I7QUFDRixDQUFDO0FBRUQsNkRBQTZEO0FBQzdELG1DQUFtQztBQUNuQyxTQUFTLGlCQUFpQixNQUFZLEVBQWdCO0lBQ3BELE9BQU8sSUFBSSxhQUNULFNBQVMsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUcsU0FBUyxFQUN6QztBQUVKIn0=