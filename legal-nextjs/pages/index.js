import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>IC3 - Hockeykultur</title>
        <meta name="description" content="IC3 är klädmärket för dig som lever för hockeykulturen – på och utanför isen." />
      </Head>
      <main>
        <section className="hero">
          <h1>IC3</h1>
          <p>Cold days. Hot drops.</p>
        </section>
        <div className="container legal-content">
          <p>IC3 är klädmärket för dig som lever för hockeykulturen – på och utanför isen. Vi är tre unga entreprenörer som ville skapa något eget: ett märke som speglar passionen, gemenskapen och attityden som finns i hockeylivet. Välkommen till IC3 – där stil möter is.</p>
        </div>
      </main>
    </>
  );
}
