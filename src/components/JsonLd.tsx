import Script from "next/script";

interface JsonLdProps {
  data: any;
}

export default function JsonLd({ data }: JsonLdProps) {
  if (!data) return null;

  return <Script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
