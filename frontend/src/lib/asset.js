// Resolve a file in public/ against the deploy base path.
//
// A bare "/assets/..." is only correct when the site is served from a domain
// root. On GitHub Pages the site lives under /Snowkap-Website/, so absolute
// paths escape the project and 404. PUBLIC_URL carries that prefix at build
// time and is empty locally, so this is a no-op in development.
export const asset = (path) => `${process.env.PUBLIC_URL}${path}`;

export default asset;
