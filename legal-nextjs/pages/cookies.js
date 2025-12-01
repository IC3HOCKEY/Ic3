import Head from 'next/head';
import { COOKIES_CONTENT } from '../constants/legal';

export default function Cookies() {
  return (
    <>
      <Head>
        <title>Cookiepolicy - IC3</title>
        <meta name="description" content="Läs vår cookiepolicy för IC3." />
      </Head>
      <main className="legal-content">
        <div className="container">
          <div dangerouslySetInnerHTML={{ __html: COOKIES_CONTENT }} />
        </div>
      </main>
    </>
  );
}
