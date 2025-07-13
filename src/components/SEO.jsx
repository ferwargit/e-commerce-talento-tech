// src/components/SEO.jsx (versión React 19 nativa)

function SEO({ title, description }) {
  const defaultTitle = "TechStore";
  const defaultDescription =
    "La mejor tienda para comprar productos increíbles.";

  const pageTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
  const pageDescription = description || defaultDescription;

  return (
    <>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
    </>
  );
}

export default SEO;
