/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  images: {
    formats: ["image/webp"],
  },

  // Απαιτείται από το Dockerfile: παράγει .next/standalone με δικό του
  // server.js και μόνο τα node_modules που χρειάζονται.
  output: "standalone",

  // Παλιά URL που άλλαξαν. 308 (permanent) ώστε το Google να μεταφέρει
  // την αξία του παλιού link στο νέο, και να μη σπάνε links που έχουν
  // ήδη μοιραστεί.
  async redirects() {
    return [
      {
        source: "/:locale(el|en)/articles/cv-me-ai-5-lepta",
        destination: "/:locale/articles/cv-with-ai-5-minutes",
        permanent: true,
      },
    ];
  },

  experimental: {
    // Το opengraph-image διαβάζει τα .mdx σε RUNTIME με δυναμικό path,
    // που το file tracing του Next δεν μπορεί να εντοπίσει μόνο του.
    // Χωρίς αυτό, κάθε OG image έβγαινε με τον εφεδρικό τίτλο.
    outputFileTracingIncludes: {
      "/[locale]/articles/[slug]/opengraph-image": ["./content/articles/**/*"],
    },
  },
};

module.exports = nextConfig;
