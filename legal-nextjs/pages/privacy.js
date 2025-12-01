import Head from 'next/head';
import { PRIVACY_CONTENT } from '../constants/legal';

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Integritetspolicy - IC3</title>
        <meta name="description" content="Läs vår integritetspolicy för IC3 enligt GDPR." />
      </Head>
      <main className="legal-content">
        <div className="container">
          <div dangerouslySetInnerHTML={{ __html: PRIVACY_CONTENT }} />
        </div>
      </main>
    </>
  );
}
