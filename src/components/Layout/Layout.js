import Head from 'next/head';
import { CldOgImage } from 'next-cloudinary'

import Header from '@/components/Header';
import Footer from '@/components/Footer';

import styles from './Layout.module.scss';

const Layout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Head>
      <title>Image Carbon - Optimize Images, Save the Planet</title>
        <meta name="description" content="Reduce your carbon footprint with Image Carbon! Learn how image optimization can lower carbon emissions and make a sustainable web." />
        <meta name="og:title" content="Optimize Images, Save the Planet with Image Carbon" />
        <meta name="og:description" content="Reduce your carbon footprint with Image Carbon! Learn how image optimization can lower carbon emissions and make a sustainable web." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#333533" />
        <meta name="msapplication-TileColor" content="#333533" />
        <meta name="theme-color" content="#ffffff" />
      </Head>

      <CldOgImage
        src="imagecarbon-assets/og-default-2400x1200_f9irn4"
        alt="How much carbon are you producing with your website images? ImageCarbon.com"
        twitterTitle="Optimize Images, Save the Planet with Image Carbon"
      />

      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
