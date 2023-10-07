import Image from 'next/image';
import Link from 'next/link';
import React, { useContext } from 'react';
import { XCircleIcon } from '@heroicons/react/outline';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { toast } from 'react-toastify';

function CartScreen() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
    userInfo,
  } = state;

  const removeItemHandler = (item) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };
  const updateCartHandler = async (item, qty) => {
    const quantite = Number(qty);
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantite) {
      return toast.error('Sorry. Product is out of stock');
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantite } });
  };
  toast.success('Produit mis à jour dans le panier');

  return (
    <Layout title="Shopping Cart">
      <div className="pt-20 max-w-6xl mx-auto">
        <h1 className="mb-8 text-3xl font-semibold tracking-wide">
          Panier d&apos;achat
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-xl">
            Panier est vide.{' '}
            <Link href="/" className="text-blue-600 hover:underline">
              Aller faire des achats
            </Link>
          </div>
        ) : (
          <div className="mt-8 w-full mx-auto">
            <div className="p-6 shadow-xl rounded-xl bg-gradient-to-r from-gray-600 to-gray-800 border-2 border-gray-500">
              <table className="min-w-full divide-y divide-gray-400 text-white">
                <thead>
                  <tr>
                    <th className="py-3 px-6 text-left font-bold">Article</th>
                    <th className="py-3 px-6 text-right font-bold">Quantite</th>
                    <th className="py-3 px-6 text-right font-bold">Prix</th>
                    <th className="py-3 px-6 font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-400">
                  {cartItems.map((item) => (
                    <tr key={item.slug}>
                      <td className="py-4 px-6 flex items-center">
                        <Link
                          href={`/product/${item.slug}`}
                          className="flex items-center"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          />
                          <span className="ml-4 text-white">{item.name}</span>
                        </Link>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <select
                          value={item.quantite}
                          onChange={(e) =>
                            updateCartHandler(item, e.target.value)
                          }
                          className=" border rounded px-3 py-2 text-black"
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-4 px-6 text-right text-yellow-500">
                        {item.price}MAD
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => removeItemHandler(item)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <XCircleIcon className="h-6 w-6" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-8 w-96 mx-auto">
          <div className="p-6 shadow-xl rounded-xl bg-gradient-to-r from-gray-600 to-gray-800 border-2 border-gray-500 transform hover:scale-105 transition-transform duration-200">
            <div className="flex justify-between mb-4">
              <span className="text-2xl font-bold text-white">Sous-total:</span>
              <span className="text-2xl font-semibold text-green-400">
                {cartItems.reduce((a, c) => a + c.quantite, 0)} articles
              </span>
            </div>

            <div className="flex justify-between mb-4">
              <span className="text-xl text-white">Montant:</span>
              <span className="text-xl font-semibold text-yellow-500">
                {cartItems.reduce((a, c) => a + c.quantite * c.price, 0)}MAD
              </span>
            </div>

            <button
              onClick={() => router.push('login?redirect=/shipping')}
              className="w-full py-3 px-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 transition duration-150 ease-in-out"
            >
              Passer à la caisse
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
