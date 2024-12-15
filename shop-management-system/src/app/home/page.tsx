import Head from 'next/head';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { ProductList } from '../../components/products';

export default function Home({ products }: { products: any }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Head>
                <title>My Store</title>
            </Head>
            <main className="flex-grow">
                <ProductList />
            </main>
            <Footer />
        </div>
    );
}


