import Layout from '../components/Layout';
import ProductItem from '../components/ProductItem';
import axios from 'axios';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import Product from '../models/Product';
import db from '../utils/db';
import { Store } from '../utils/Store';

export default function Home({ products }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantite = existItem ? existItem.quantite + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantite) {
      return toast.error('Produit indisponible');
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantite } });

    toast.success('Produit ajouté au panier');
  };
  return (
    <Layout title="Home Page">
      <div className="grid grid-cols-1 gap-8 p-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductItem
            product={product}
            key={product.slug}
            addToCartHandler={addToCartHandler}
          ></ProductItem>
        ))}
      </div>
    </Layout>
  );
}
export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}
