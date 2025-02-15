// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
export const ERROR_WHILE_MAPPING_MESSAGE = "Threw while mapping.";
/**
 * pooledMap transforms values from an (async) iterable into another async
 * iterable. The transforms are done concurrently, with a max concurrency
 * defined by the poolLimit.
 *
 * If an error is thrown from `iterableFn`, no new transformations will begin.
 * All currently executing transformations are allowed to finish and still
 * yielded on success. After that, the rejections among them are gathered and
 * thrown by the iterator in an `AggregateError`.
 *
 * @param poolLimit The maximum count of items being processed concurrently.
 * @param array The input array for mapping.
 * @param iteratorFn The function to call for every item of the array.
 */ export function pooledMap(poolLimit, array, iteratorFn) {
    // Create the async iterable that is returned from this function.
    const res = new TransformStream({
        async transform (p, controller) {
            try {
                const s = await p;
                controller.enqueue(s);
            } catch (e) {
                if (e instanceof AggregateError && e.message == ERROR_WHILE_MAPPING_MESSAGE) {
                    controller.error(e);
                }
            }
        }
    });
    // Start processing items from the iterator
    (async ()=>{
        const writer = res.writable.getWriter();
        const executing = [];
        try {
            for await (const item of array){
                const p = Promise.resolve().then(()=>iteratorFn(item));
                // Only write on success. If we `writer.write()` a rejected promise,
                // that will end the iteration. We don't want that yet. Instead let it
                // fail the race, taking us to the catch block where all currently
                // executing jobs are allowed to finish and all rejections among them
                // can be reported together.
                writer.write(p);
                const e = p.then(()=>executing.splice(executing.indexOf(e), 1));
                executing.push(e);
                if (executing.length >= poolLimit) {
                    await Promise.race(executing);
                }
            }
            // Wait until all ongoing events have processed, then close the writer.
            await Promise.all(executing);
            writer.close();
        } catch  {
            const errors = [];
            for (const result of (await Promise.allSettled(executing))){
                if (result.status == "rejected") {
                    errors.push(result.reason);
                }
            }
            writer.write(Promise.reject(new AggregateError(errors, ERROR_WHILE_MAPPING_MESSAGE))).catch(()=>{});
        }
    })();
    return res.readable[Symbol.asyncIterator]();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjE1NS4wL2FzeW5jL3Bvb2wudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IDIwMTgtMjAyMiB0aGUgRGVubyBhdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLiBNSVQgbGljZW5zZS5cblxuZXhwb3J0IGNvbnN0IEVSUk9SX1dISUxFX01BUFBJTkdfTUVTU0FHRSA9IFwiVGhyZXcgd2hpbGUgbWFwcGluZy5cIjtcblxuLyoqXG4gKiBwb29sZWRNYXAgdHJhbnNmb3JtcyB2YWx1ZXMgZnJvbSBhbiAoYXN5bmMpIGl0ZXJhYmxlIGludG8gYW5vdGhlciBhc3luY1xuICogaXRlcmFibGUuIFRoZSB0cmFuc2Zvcm1zIGFyZSBkb25lIGNvbmN1cnJlbnRseSwgd2l0aCBhIG1heCBjb25jdXJyZW5jeVxuICogZGVmaW5lZCBieSB0aGUgcG9vbExpbWl0LlxuICpcbiAqIElmIGFuIGVycm9yIGlzIHRocm93biBmcm9tIGBpdGVyYWJsZUZuYCwgbm8gbmV3IHRyYW5zZm9ybWF0aW9ucyB3aWxsIGJlZ2luLlxuICogQWxsIGN1cnJlbnRseSBleGVjdXRpbmcgdHJhbnNmb3JtYXRpb25zIGFyZSBhbGxvd2VkIHRvIGZpbmlzaCBhbmQgc3RpbGxcbiAqIHlpZWxkZWQgb24gc3VjY2Vzcy4gQWZ0ZXIgdGhhdCwgdGhlIHJlamVjdGlvbnMgYW1vbmcgdGhlbSBhcmUgZ2F0aGVyZWQgYW5kXG4gKiB0aHJvd24gYnkgdGhlIGl0ZXJhdG9yIGluIGFuIGBBZ2dyZWdhdGVFcnJvcmAuXG4gKlxuICogQHBhcmFtIHBvb2xMaW1pdCBUaGUgbWF4aW11bSBjb3VudCBvZiBpdGVtcyBiZWluZyBwcm9jZXNzZWQgY29uY3VycmVudGx5LlxuICogQHBhcmFtIGFycmF5IFRoZSBpbnB1dCBhcnJheSBmb3IgbWFwcGluZy5cbiAqIEBwYXJhbSBpdGVyYXRvckZuIFRoZSBmdW5jdGlvbiB0byBjYWxsIGZvciBldmVyeSBpdGVtIG9mIHRoZSBhcnJheS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBvb2xlZE1hcDxULCBSPihcbiAgcG9vbExpbWl0OiBudW1iZXIsXG4gIGFycmF5OiBJdGVyYWJsZTxUPiB8IEFzeW5jSXRlcmFibGU8VD4sXG4gIGl0ZXJhdG9yRm46IChkYXRhOiBUKSA9PiBQcm9taXNlPFI+LFxuKTogQXN5bmNJdGVyYWJsZUl0ZXJhdG9yPFI+IHtcbiAgLy8gQ3JlYXRlIHRoZSBhc3luYyBpdGVyYWJsZSB0aGF0IGlzIHJldHVybmVkIGZyb20gdGhpcyBmdW5jdGlvbi5cbiAgY29uc3QgcmVzID0gbmV3IFRyYW5zZm9ybVN0cmVhbTxQcm9taXNlPFI+LCBSPih7XG4gICAgYXN5bmMgdHJhbnNmb3JtKFxuICAgICAgcDogUHJvbWlzZTxSPixcbiAgICAgIGNvbnRyb2xsZXI6IFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyPFI+LFxuICAgICkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcyA9IGF3YWl0IHA7XG4gICAgICAgIGNvbnRyb2xsZXIuZW5xdWV1ZShzKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGUgaW5zdGFuY2VvZiBBZ2dyZWdhdGVFcnJvciAmJlxuICAgICAgICAgIGUubWVzc2FnZSA9PSBFUlJPUl9XSElMRV9NQVBQSU5HX01FU1NBR0VcbiAgICAgICAgKSB7XG4gICAgICAgICAgY29udHJvbGxlci5lcnJvcihlIGFzIHVua25vd24pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgfSk7XG4gIC8vIFN0YXJ0IHByb2Nlc3NpbmcgaXRlbXMgZnJvbSB0aGUgaXRlcmF0b3JcbiAgKGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB3cml0ZXIgPSByZXMud3JpdGFibGUuZ2V0V3JpdGVyKCk7XG4gICAgY29uc3QgZXhlY3V0aW5nOiBBcnJheTxQcm9taXNlPHVua25vd24+PiA9IFtdO1xuICAgIHRyeSB7XG4gICAgICBmb3IgYXdhaXQgKGNvbnN0IGl0ZW0gb2YgYXJyYXkpIHtcbiAgICAgICAgY29uc3QgcCA9IFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4gaXRlcmF0b3JGbihpdGVtKSk7XG4gICAgICAgIC8vIE9ubHkgd3JpdGUgb24gc3VjY2Vzcy4gSWYgd2UgYHdyaXRlci53cml0ZSgpYCBhIHJlamVjdGVkIHByb21pc2UsXG4gICAgICAgIC8vIHRoYXQgd2lsbCBlbmQgdGhlIGl0ZXJhdGlvbi4gV2UgZG9uJ3Qgd2FudCB0aGF0IHlldC4gSW5zdGVhZCBsZXQgaXRcbiAgICAgICAgLy8gZmFpbCB0aGUgcmFjZSwgdGFraW5nIHVzIHRvIHRoZSBjYXRjaCBibG9jayB3aGVyZSBhbGwgY3VycmVudGx5XG4gICAgICAgIC8vIGV4ZWN1dGluZyBqb2JzIGFyZSBhbGxvd2VkIHRvIGZpbmlzaCBhbmQgYWxsIHJlamVjdGlvbnMgYW1vbmcgdGhlbVxuICAgICAgICAvLyBjYW4gYmUgcmVwb3J0ZWQgdG9nZXRoZXIuXG4gICAgICAgIHdyaXRlci53cml0ZShwKTtcbiAgICAgICAgY29uc3QgZTogUHJvbWlzZTx1bmtub3duPiA9IHAudGhlbigoKSA9PlxuICAgICAgICAgIGV4ZWN1dGluZy5zcGxpY2UoZXhlY3V0aW5nLmluZGV4T2YoZSksIDEpXG4gICAgICAgICk7XG4gICAgICAgIGV4ZWN1dGluZy5wdXNoKGUpO1xuICAgICAgICBpZiAoZXhlY3V0aW5nLmxlbmd0aCA+PSBwb29sTGltaXQpIHtcbiAgICAgICAgICBhd2FpdCBQcm9taXNlLnJhY2UoZXhlY3V0aW5nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gV2FpdCB1bnRpbCBhbGwgb25nb2luZyBldmVudHMgaGF2ZSBwcm9jZXNzZWQsIHRoZW4gY2xvc2UgdGhlIHdyaXRlci5cbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKGV4ZWN1dGluZyk7XG4gICAgICB3cml0ZXIuY2xvc2UoKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIGNvbnN0IGVycm9ycyA9IFtdO1xuICAgICAgZm9yIChjb25zdCByZXN1bHQgb2YgYXdhaXQgUHJvbWlzZS5hbGxTZXR0bGVkKGV4ZWN1dGluZykpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdGF0dXMgPT0gXCJyZWplY3RlZFwiKSB7XG4gICAgICAgICAgZXJyb3JzLnB1c2gocmVzdWx0LnJlYXNvbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHdyaXRlci53cml0ZShQcm9taXNlLnJlamVjdChcbiAgICAgICAgbmV3IEFnZ3JlZ2F0ZUVycm9yKGVycm9ycywgRVJST1JfV0hJTEVfTUFQUElOR19NRVNTQUdFKSxcbiAgICAgICkpLmNhdGNoKCgpID0+IHt9KTtcbiAgICB9XG4gIH0pKCk7XG4gIHJldHVybiByZXMucmVhZGFibGVbU3ltYm9sLmFzeW5jSXRlcmF0b3JdKCk7XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsMEVBQTBFO0FBRTFFLE9BQU8sTUFBTSw4QkFBOEIsdUJBQXVCO0FBRWxFOzs7Ozs7Ozs7Ozs7O0NBYUMsR0FDRCxPQUFPLFNBQVMsVUFDZCxTQUFpQixFQUNqQixLQUFxQyxFQUNyQyxVQUFtQyxFQUNUO0lBQzFCLGlFQUFpRTtJQUNqRSxNQUFNLE1BQU0sSUFBSSxnQkFBK0I7UUFDN0MsTUFBTSxXQUNKLENBQWEsRUFDYixVQUErQyxFQUMvQztZQUNBLElBQUk7Z0JBQ0YsTUFBTSxJQUFJLE1BQU07Z0JBQ2hCLFdBQVcsT0FBTyxDQUFDO1lBQ3JCLEVBQUUsT0FBTyxHQUFHO2dCQUNWLElBQ0UsYUFBYSxrQkFDYixFQUFFLE9BQU8sSUFBSSw2QkFDYjtvQkFDQSxXQUFXLEtBQUssQ0FBQztnQkFDbkIsQ0FBQztZQUNIO1FBQ0Y7SUFDRjtJQUNBLDJDQUEyQztJQUMxQyxDQUFBLFVBQVk7UUFDWCxNQUFNLFNBQVMsSUFBSSxRQUFRLENBQUMsU0FBUztRQUNyQyxNQUFNLFlBQXFDLEVBQUU7UUFDN0MsSUFBSTtZQUNGLFdBQVcsTUFBTSxRQUFRLE1BQU87Z0JBQzlCLE1BQU0sSUFBSSxRQUFRLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBTSxXQUFXO2dCQUNsRCxvRUFBb0U7Z0JBQ3BFLHNFQUFzRTtnQkFDdEUsa0VBQWtFO2dCQUNsRSxxRUFBcUU7Z0JBQ3JFLDRCQUE0QjtnQkFDNUIsT0FBTyxLQUFLLENBQUM7Z0JBQ2IsTUFBTSxJQUFzQixFQUFFLElBQUksQ0FBQyxJQUNqQyxVQUFVLE1BQU0sQ0FBQyxVQUFVLE9BQU8sQ0FBQyxJQUFJO2dCQUV6QyxVQUFVLElBQUksQ0FBQztnQkFDZixJQUFJLFVBQVUsTUFBTSxJQUFJLFdBQVc7b0JBQ2pDLE1BQU0sUUFBUSxJQUFJLENBQUM7Z0JBQ3JCLENBQUM7WUFDSDtZQUNBLHVFQUF1RTtZQUN2RSxNQUFNLFFBQVEsR0FBRyxDQUFDO1lBQ2xCLE9BQU8sS0FBSztRQUNkLEVBQUUsT0FBTTtZQUNOLE1BQU0sU0FBUyxFQUFFO1lBQ2pCLEtBQUssTUFBTSxVQUFVLENBQUEsTUFBTSxRQUFRLFVBQVUsQ0FBQyxVQUFTLEVBQUc7Z0JBQ3hELElBQUksT0FBTyxNQUFNLElBQUksWUFBWTtvQkFDL0IsT0FBTyxJQUFJLENBQUMsT0FBTyxNQUFNO2dCQUMzQixDQUFDO1lBQ0g7WUFDQSxPQUFPLEtBQUssQ0FBQyxRQUFRLE1BQU0sQ0FDekIsSUFBSSxlQUFlLFFBQVEsK0JBQzFCLEtBQUssQ0FBQyxJQUFNLENBQUM7UUFDbEI7SUFDRixDQUFBO0lBQ0EsT0FBTyxJQUFJLFFBQVEsQ0FBQyxPQUFPLGFBQWEsQ0FBQztBQUMzQyxDQUFDIn0=