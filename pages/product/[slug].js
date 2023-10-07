import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import { toast } from 'react-toastify';
import Product from '../../models/Product';
import db from '../../utils/db';
import { Store } from '../../utils/Store';

export default function ProductScreen(props) {
  const { product } = props;
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  if (!product) {
    return <Layout title="Produt Not Found">Produt Not Found</Layout>;
  }

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantite = existItem ? existItem.quantite + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantite) {
      return toast.error('Sorry. Product is out of stock');
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantite } });
    router.push('/cart');
  };
  return (
    <Layout title={product.name}>
      <div className="pt-20 max-w-6xl mx-auto">
        <div className="mt-8">
          <Link href="/" className="text-blue-600 hover:underline">
            Retour
          </Link>
        </div>
        <h1 className="mb-8 text-3xl font-semibold tracking-wide">
          {product.name}
        </h1>

        <div className="p-6 shadow-xl rounded-xl bg-gradient-to-r from-gray-600 to-gray-800 border-2 border-gray-500">
          <div className="flex items-center mb-4">
            <Image
              src={product.image}
              alt={product.name}
              width={200}
              height={200}
              className="mr-8"
            />
            <div>
              <h2 className="text-2xl font-bold text-white">{product.name}</h2>
              <p className="text-white">Categorie: {product.category}</p>
              <p className="text-white">Marque: {product.brand}</p>
              <p className="text-white">
                {product.rating} of {product.numReviews} notes
              </p>
              <p className="text-white">Description: {product.description}</p>
            </div>
          </div>

          <div className="mt-4">
            <span className="text-xl text-white">Prix:</span>
            <span className="text-xl font-semibold text-yellow-500 ml-2">
              {product.price}MAD
            </span>
          </div>
          <div className="mt-4">
            <span className="text-xl text-white">Etat:</span>
            <span className="text-xl ml-2">
              {product.countInStock > 0 ? (
                <span className="font-semibold text-success">En stock</span>
              ) : (
                <span className="font-semibold text-danger">Indisponible</span>
              )}
            </span>
          </div>
          <div className="mt-8">
            <button
              className="btn btn-primary w-100 py-3 px-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 transition duration-150 ease-in-out"
              onClick={addToCartHandler}
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}
