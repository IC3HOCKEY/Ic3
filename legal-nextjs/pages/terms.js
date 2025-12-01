import Head from 'next/head';
import { TERMS_CONTENT } from '../constants/legal';

export default function Terms() {
  return (
    <>
      <Head>
        <title>Användarvillkor - IC3</title>
        <meta name="description" content="Läs våra användarvillkor för IC3." />
      </Head>
      <main className="legal-content">
        <div className="container">
          <div dangerouslySetInnerHTML={{ __html: TERMS_CONTENT }} />
        </div>
      </main>
    </>
  );
}
