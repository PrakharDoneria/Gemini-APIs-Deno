// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
/**
 * Utilities for working with Deno's readers, writers, and web streams.
 *
 * `Reader` and `Writer` interfaces are deprecated in Deno, and so many of these
 * utilities are also deprecated. Consider using web streams instead.
 *
 * @module
 */ export * from "./buf_reader.ts";
export * from "./buf_writer.ts";
export * from "./buffer.ts";
export * from "./copy.ts";
export * from "./copy_n.ts";
export * from "./iterate_reader.ts";
export * from "./limited_reader.ts";
export * from "./multi_reader.ts";
export * from "./read_all.ts";
export * from "./read_delim.ts";
export * from "./read_int.ts";
export * from "./read_lines.ts";
export * from "./read_long.ts";
export * from "./read_range.ts";
export * from "./read_short.ts";
export * from "./read_string_delim.ts";
export * from "./reader_from_stream_reader.ts";
export * from "./slice_long_to_bytes.ts";
export * from "./string_reader.ts";
export * from "./string_writer.ts";
export * from "./to_readable_stream.ts";
export * from "./to_writable_stream.ts";
export * from "./types.ts";
export * from "./write_all.ts";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjIyNC4wL2lvL21vZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxOC0yMDI0IHRoZSBEZW5vIGF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuIE1JVCBsaWNlbnNlLlxuXG4vKipcbiAqIFV0aWxpdGllcyBmb3Igd29ya2luZyB3aXRoIERlbm8ncyByZWFkZXJzLCB3cml0ZXJzLCBhbmQgd2ViIHN0cmVhbXMuXG4gKlxuICogYFJlYWRlcmAgYW5kIGBXcml0ZXJgIGludGVyZmFjZXMgYXJlIGRlcHJlY2F0ZWQgaW4gRGVubywgYW5kIHNvIG1hbnkgb2YgdGhlc2VcbiAqIHV0aWxpdGllcyBhcmUgYWxzbyBkZXByZWNhdGVkLiBDb25zaWRlciB1c2luZyB3ZWIgc3RyZWFtcyBpbnN0ZWFkLlxuICpcbiAqIEBtb2R1bGVcbiAqL1xuXG5leHBvcnQgKiBmcm9tIFwiLi9idWZfcmVhZGVyLnRzXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9idWZfd3JpdGVyLnRzXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9idWZmZXIudHNcIjtcbmV4cG9ydCAqIGZyb20gXCIuL2NvcHkudHNcIjtcbmV4cG9ydCAqIGZyb20gXCIuL2NvcHlfbi50c1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vaXRlcmF0ZV9yZWFkZXIudHNcIjtcbmV4cG9ydCAqIGZyb20gXCIuL2xpbWl0ZWRfcmVhZGVyLnRzXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9tdWx0aV9yZWFkZXIudHNcIjtcbmV4cG9ydCAqIGZyb20gXCIuL3JlYWRfYWxsLnRzXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9yZWFkX2RlbGltLnRzXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9yZWFkX2ludC50c1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vcmVhZF9saW5lcy50c1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vcmVhZF9sb25nLnRzXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9yZWFkX3JhbmdlLnRzXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9yZWFkX3Nob3J0LnRzXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9yZWFkX3N0cmluZ19kZWxpbS50c1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vcmVhZGVyX2Zyb21fc3RyZWFtX3JlYWRlci50c1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vc2xpY2VfbG9uZ190b19ieXRlcy50c1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vc3RyaW5nX3JlYWRlci50c1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vc3RyaW5nX3dyaXRlci50c1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vdG9fcmVhZGFibGVfc3RyZWFtLnRzXCI7XG5leHBvcnQgKiBmcm9tIFwiLi90b193cml0YWJsZV9zdHJlYW0udHNcIjtcbmV4cG9ydCAqIGZyb20gXCIuL3R5cGVzLnRzXCI7XG5leHBvcnQgKiBmcm9tIFwiLi93cml0ZV9hbGwudHNcIjtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwwRUFBMEU7QUFFMUU7Ozs7Ozs7Q0FPQyxHQUVELGNBQWMsa0JBQWtCO0FBQ2hDLGNBQWMsa0JBQWtCO0FBQ2hDLGNBQWMsY0FBYztBQUM1QixjQUFjLFlBQVk7QUFDMUIsY0FBYyxjQUFjO0FBQzVCLGNBQWMsc0JBQXNCO0FBQ3BDLGNBQWMsc0JBQXNCO0FBQ3BDLGNBQWMsb0JBQW9CO0FBQ2xDLGNBQWMsZ0JBQWdCO0FBQzlCLGNBQWMsa0JBQWtCO0FBQ2hDLGNBQWMsZ0JBQWdCO0FBQzlCLGNBQWMsa0JBQWtCO0FBQ2hDLGNBQWMsaUJBQWlCO0FBQy9CLGNBQWMsa0JBQWtCO0FBQ2hDLGNBQWMsa0JBQWtCO0FBQ2hDLGNBQWMseUJBQXlCO0FBQ3ZDLGNBQWMsaUNBQWlDO0FBQy9DLGNBQWMsMkJBQTJCO0FBQ3pDLGNBQWMscUJBQXFCO0FBQ25DLGNBQWMscUJBQXFCO0FBQ25DLGNBQWMsMEJBQTBCO0FBQ3hDLGNBQWMsMEJBQTBCO0FBQ3hDLGNBQWMsYUFBYTtBQUMzQixjQUFjLGlCQUFpQiJ9