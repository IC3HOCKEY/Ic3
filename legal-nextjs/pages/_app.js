import '../styles/globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CookieConsent from '../components/CookieConsent';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>IC3 - Hockeykultur</title>
        <meta name="description" content="IC3 är klädmärket för dig som lever för hockeykulturen." />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "IC3",
              "url": "https://ic3brand.se",
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "ic3.kontakt@outlook.com",
              },
            }),
          }}
        />
      </Head>
      <Header />
      <Component {...pageProps} />
      <Footer />
      <CookieConsent />
    </>
  );
}

export default MyApp;
