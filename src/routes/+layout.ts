// Prerender every page at build time so search engines (and the user's
// first paint) get fully-formed HTML, not an empty <script> shell.
// `ssr` is left at the default (true) — required for prerender to actually
// emit content; setting it to false produces empty pages.
export const prerender = true;
