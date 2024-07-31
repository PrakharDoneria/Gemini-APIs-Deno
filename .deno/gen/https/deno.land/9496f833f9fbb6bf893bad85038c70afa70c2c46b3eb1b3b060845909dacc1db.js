// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
import { concat } from "../bytes/concat.ts";
/** Generate longest proper prefix which is also suffix array. */ function createLPS(pat) {
    const lps = new Uint8Array(pat.length);
    lps[0] = 0;
    let prefixEnd = 0;
    let i = 1;
    while(i < lps.length){
        if (pat[i] === pat[prefixEnd]) {
            prefixEnd++;
            lps[i] = prefixEnd;
            i++;
        } else if (prefixEnd === 0) {
            lps[i] = 0;
            i++;
        } else {
            prefixEnd = lps[prefixEnd - 1];
        }
    }
    return lps;
}
/**
 * Read delimited bytes from a Reader.
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */ export async function* readDelim(reader, delim) {
    // Avoid unicode problems
    const delimLen = delim.length;
    const delimLPS = createLPS(delim);
    let chunks = new Uint8Array();
    const bufSize = Math.max(1024, delimLen + 1);
    // Modified KMP
    let inspectIndex = 0;
    let matchIndex = 0;
    while(true){
        const inspectArr = new Uint8Array(bufSize);
        const result = await reader.read(inspectArr);
        if (result === null) {
            // Yield last chunk.
            yield chunks;
            return;
        } else if (result < 0) {
            // Discard all remaining and silently fail.
            return;
        }
        chunks = concat([
            chunks,
            inspectArr.slice(0, result)
        ]);
        let localIndex = 0;
        while(inspectIndex < chunks.length){
            if (inspectArr[localIndex] === delim[matchIndex]) {
                inspectIndex++;
                localIndex++;
                matchIndex++;
                if (matchIndex === delimLen) {
                    // Full match
                    const matchEnd = inspectIndex - delimLen;
                    const readyBytes = chunks.slice(0, matchEnd);
                    yield readyBytes;
                    // Reset match, different from KMP.
                    chunks = chunks.slice(inspectIndex);
                    inspectIndex = 0;
                    matchIndex = 0;
                }
            } else {
                if (matchIndex === 0) {
                    inspectIndex++;
                    localIndex++;
                } else {
                    matchIndex = delimLPS[matchIndex - 1];
                }
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjIyNC4wL2lvL3JlYWRfZGVsaW0udHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IDIwMTgtMjAyNCB0aGUgRGVubyBhdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLiBNSVQgbGljZW5zZS5cbi8vIFRoaXMgbW9kdWxlIGlzIGJyb3dzZXIgY29tcGF0aWJsZS5cblxuaW1wb3J0IHsgY29uY2F0IH0gZnJvbSBcIi4uL2J5dGVzL2NvbmNhdC50c1wiO1xuaW1wb3J0IHR5cGUgeyBSZWFkZXIgfSBmcm9tIFwiLi90eXBlcy50c1wiO1xuXG4vKiogR2VuZXJhdGUgbG9uZ2VzdCBwcm9wZXIgcHJlZml4IHdoaWNoIGlzIGFsc28gc3VmZml4IGFycmF5LiAqL1xuZnVuY3Rpb24gY3JlYXRlTFBTKHBhdDogVWludDhBcnJheSk6IFVpbnQ4QXJyYXkge1xuICBjb25zdCBscHMgPSBuZXcgVWludDhBcnJheShwYXQubGVuZ3RoKTtcbiAgbHBzWzBdID0gMDtcbiAgbGV0IHByZWZpeEVuZCA9IDA7XG4gIGxldCBpID0gMTtcbiAgd2hpbGUgKGkgPCBscHMubGVuZ3RoKSB7XG4gICAgaWYgKHBhdFtpXSA9PT0gcGF0W3ByZWZpeEVuZF0pIHtcbiAgICAgIHByZWZpeEVuZCsrO1xuICAgICAgbHBzW2ldID0gcHJlZml4RW5kO1xuICAgICAgaSsrO1xuICAgIH0gZWxzZSBpZiAocHJlZml4RW5kID09PSAwKSB7XG4gICAgICBscHNbaV0gPSAwO1xuICAgICAgaSsrO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcmVmaXhFbmQgPSBscHNbcHJlZml4RW5kIC0gMV0hO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbHBzO1xufVxuXG4vKipcbiAqIFJlYWQgZGVsaW1pdGVkIGJ5dGVzIGZyb20gYSBSZWFkZXIuXG4gKlxuICogQGRlcHJlY2F0ZWQgVGhpcyB3aWxsIGJlIHJlbW92ZWQgaW4gMS4wLjAuIFVzZSB0aGUge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9TdHJlYW1zX0FQSSB8IFdlYiBTdHJlYW1zIEFQSX0gaW5zdGVhZC5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uKiByZWFkRGVsaW0oXG4gIHJlYWRlcjogUmVhZGVyLFxuICBkZWxpbTogVWludDhBcnJheSxcbik6IEFzeW5jSXRlcmFibGVJdGVyYXRvcjxVaW50OEFycmF5PiB7XG4gIC8vIEF2b2lkIHVuaWNvZGUgcHJvYmxlbXNcbiAgY29uc3QgZGVsaW1MZW4gPSBkZWxpbS5sZW5ndGg7XG4gIGNvbnN0IGRlbGltTFBTID0gY3JlYXRlTFBTKGRlbGltKTtcbiAgbGV0IGNodW5rcyA9IG5ldyBVaW50OEFycmF5KCk7XG4gIGNvbnN0IGJ1ZlNpemUgPSBNYXRoLm1heCgxMDI0LCBkZWxpbUxlbiArIDEpO1xuXG4gIC8vIE1vZGlmaWVkIEtNUFxuICBsZXQgaW5zcGVjdEluZGV4ID0gMDtcbiAgbGV0IG1hdGNoSW5kZXggPSAwO1xuICB3aGlsZSAodHJ1ZSkge1xuICAgIGNvbnN0IGluc3BlY3RBcnIgPSBuZXcgVWludDhBcnJheShidWZTaXplKTtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZWFkZXIucmVhZChpbnNwZWN0QXJyKTtcbiAgICBpZiAocmVzdWx0ID09PSBudWxsKSB7XG4gICAgICAvLyBZaWVsZCBsYXN0IGNodW5rLlxuICAgICAgeWllbGQgY2h1bmtzO1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSBpZiAocmVzdWx0IDwgMCkge1xuICAgICAgLy8gRGlzY2FyZCBhbGwgcmVtYWluaW5nIGFuZCBzaWxlbnRseSBmYWlsLlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjaHVua3MgPSBjb25jYXQoW2NodW5rcywgaW5zcGVjdEFyci5zbGljZSgwLCByZXN1bHQpXSk7XG4gICAgbGV0IGxvY2FsSW5kZXggPSAwO1xuICAgIHdoaWxlIChpbnNwZWN0SW5kZXggPCBjaHVua3MubGVuZ3RoKSB7XG4gICAgICBpZiAoaW5zcGVjdEFycltsb2NhbEluZGV4XSA9PT0gZGVsaW1bbWF0Y2hJbmRleF0pIHtcbiAgICAgICAgaW5zcGVjdEluZGV4Kys7XG4gICAgICAgIGxvY2FsSW5kZXgrKztcbiAgICAgICAgbWF0Y2hJbmRleCsrO1xuICAgICAgICBpZiAobWF0Y2hJbmRleCA9PT0gZGVsaW1MZW4pIHtcbiAgICAgICAgICAvLyBGdWxsIG1hdGNoXG4gICAgICAgICAgY29uc3QgbWF0Y2hFbmQgPSBpbnNwZWN0SW5kZXggLSBkZWxpbUxlbjtcbiAgICAgICAgICBjb25zdCByZWFkeUJ5dGVzID0gY2h1bmtzLnNsaWNlKDAsIG1hdGNoRW5kKTtcbiAgICAgICAgICB5aWVsZCByZWFkeUJ5dGVzO1xuICAgICAgICAgIC8vIFJlc2V0IG1hdGNoLCBkaWZmZXJlbnQgZnJvbSBLTVAuXG4gICAgICAgICAgY2h1bmtzID0gY2h1bmtzLnNsaWNlKGluc3BlY3RJbmRleCk7XG4gICAgICAgICAgaW5zcGVjdEluZGV4ID0gMDtcbiAgICAgICAgICBtYXRjaEluZGV4ID0gMDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKG1hdGNoSW5kZXggPT09IDApIHtcbiAgICAgICAgICBpbnNwZWN0SW5kZXgrKztcbiAgICAgICAgICBsb2NhbEluZGV4Kys7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWF0Y2hJbmRleCA9IGRlbGltTFBTW21hdGNoSW5kZXggLSAxXSE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwwRUFBMEU7QUFDMUUscUNBQXFDO0FBRXJDLFNBQVMsTUFBTSxRQUFRLHFCQUFxQjtBQUc1QywrREFBK0QsR0FDL0QsU0FBUyxVQUFVLEdBQWUsRUFBYztJQUM5QyxNQUFNLE1BQU0sSUFBSSxXQUFXLElBQUksTUFBTTtJQUNyQyxHQUFHLENBQUMsRUFBRSxHQUFHO0lBQ1QsSUFBSSxZQUFZO0lBQ2hCLElBQUksSUFBSTtJQUNSLE1BQU8sSUFBSSxJQUFJLE1BQU0sQ0FBRTtRQUNyQixJQUFJLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLFVBQVUsRUFBRTtZQUM3QjtZQUNBLEdBQUcsQ0FBQyxFQUFFLEdBQUc7WUFDVDtRQUNGLE9BQU8sSUFBSSxjQUFjLEdBQUc7WUFDMUIsR0FBRyxDQUFDLEVBQUUsR0FBRztZQUNUO1FBQ0YsT0FBTztZQUNMLFlBQVksR0FBRyxDQUFDLFlBQVksRUFBRTtRQUNoQyxDQUFDO0lBQ0g7SUFDQSxPQUFPO0FBQ1Q7QUFFQTs7OztDQUlDLEdBQ0QsT0FBTyxnQkFBZ0IsVUFDckIsTUFBYyxFQUNkLEtBQWlCLEVBQ2tCO0lBQ25DLHlCQUF5QjtJQUN6QixNQUFNLFdBQVcsTUFBTSxNQUFNO0lBQzdCLE1BQU0sV0FBVyxVQUFVO0lBQzNCLElBQUksU0FBUyxJQUFJO0lBQ2pCLE1BQU0sVUFBVSxLQUFLLEdBQUcsQ0FBQyxNQUFNLFdBQVc7SUFFMUMsZUFBZTtJQUNmLElBQUksZUFBZTtJQUNuQixJQUFJLGFBQWE7SUFDakIsTUFBTyxJQUFJLENBQUU7UUFDWCxNQUFNLGFBQWEsSUFBSSxXQUFXO1FBQ2xDLE1BQU0sU0FBUyxNQUFNLE9BQU8sSUFBSSxDQUFDO1FBQ2pDLElBQUksV0FBVyxJQUFJLEVBQUU7WUFDbkIsb0JBQW9CO1lBQ3BCLE1BQU07WUFDTjtRQUNGLE9BQU8sSUFBSSxTQUFTLEdBQUc7WUFDckIsMkNBQTJDO1lBQzNDO1FBQ0YsQ0FBQztRQUNELFNBQVMsT0FBTztZQUFDO1lBQVEsV0FBVyxLQUFLLENBQUMsR0FBRztTQUFRO1FBQ3JELElBQUksYUFBYTtRQUNqQixNQUFPLGVBQWUsT0FBTyxNQUFNLENBQUU7WUFDbkMsSUFBSSxVQUFVLENBQUMsV0FBVyxLQUFLLEtBQUssQ0FBQyxXQUFXLEVBQUU7Z0JBQ2hEO2dCQUNBO2dCQUNBO2dCQUNBLElBQUksZUFBZSxVQUFVO29CQUMzQixhQUFhO29CQUNiLE1BQU0sV0FBVyxlQUFlO29CQUNoQyxNQUFNLGFBQWEsT0FBTyxLQUFLLENBQUMsR0FBRztvQkFDbkMsTUFBTTtvQkFDTixtQ0FBbUM7b0JBQ25DLFNBQVMsT0FBTyxLQUFLLENBQUM7b0JBQ3RCLGVBQWU7b0JBQ2YsYUFBYTtnQkFDZixDQUFDO1lBQ0gsT0FBTztnQkFDTCxJQUFJLGVBQWUsR0FBRztvQkFDcEI7b0JBQ0E7Z0JBQ0YsT0FBTztvQkFDTCxhQUFhLFFBQVEsQ0FBQyxhQUFhLEVBQUU7Z0JBQ3ZDLENBQUM7WUFDSCxDQUFDO1FBQ0g7SUFDRjtBQUNGLENBQUMifQ==