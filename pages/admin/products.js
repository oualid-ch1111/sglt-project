import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useReducer } from 'react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreate: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      state;
  }
}

export default function AdminProductsScreen() {
  const router = useRouter();

  const [
    { loading, error, products, loadingCreate, successDelete, loadingDelete },
    dispatch,
  ] = useReducer(reducer, { loading: true, products: [], error: '' });
  const createHandler = async () => {
    if (!window.confirm('Are you sure?')) {
      return;
    }
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      const { data } = await axios.post(`/api/admin/products`);
      dispatch({ type: 'CREATE_SUCCESS' });
      toast.success('Product created successfully');
      router.push(`/admin/product/${data.product._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/products`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [successDelete]);

  const deleteHandler = async (productId) => {
    if (!window.confirm('Are you sure?')) {
      return;
    }
    try {
      dispatch({ type: 'DELETE_REQUEST' });
      await axios.delete(`/api/admin/products/${productId}`);
      dispatch({ type: 'DELETE_SUCCESS' });
      toast.success('Product deleted successfully');
    } catch (err) {
      dispatch({ type: 'DELETE_FAIL' });
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="Admin Products">
      <div className="grid md:grid-cols-4 md:gap-5">
        <div className="bg-gray-800 p-5 rounded-md shadow-lg">
          <ul className="text-white">
            <li className="mb-2">
              <Link href="/admin/dashboard" className="hover:text-blue-500">
                Dashboard
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/admin/orders" className="hover:text-blue-500">
                Les commandes
              </Link>
            </li>
            <li className="mb-2 font-bold">
              <Link href="/admin/products" className="hover:text-blue-500">
                Les produits
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/admin/users" className="hover:text-blue-500">
                Les utilisateurs
              </Link>
            </li>
          </ul>
        </div>
        <div className="overflow-x-auto md:col-span-3">
          <div className="flex justify-between">
            <h1 className="mb-4 text-xl">Products</h1>
            {loadingDelete && <div>Deleting item...</div>}
            <button
              disabled={loadingCreate}
              onClick={createHandler}
              className="primary-button"
            >
              {loadingCreate ? 'Loading' : 'Creer'}
            </button>
          </div>{' '}
          {loading ? (
            <div className="text-blue-600 font-semibold">Loading...</div>
          ) : error ? (
            <div className="bg-red-600 text-white p-3 rounded-md">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-md shadow-lg">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 text-left text-gray-600">ID</th>
                    <th className="px-5 py-3 text-left text-gray-600">NAME</th>
                    <th className="px-5 py-3 text-left text-gray-600">PRICE</th>
                    <th className="px-5 py-3 text-left text-gray-600">
                      CATEGORY
                    </th>
                    <th className="px-5 py-3 text-left text-gray-600">COUNT</th>
                    <th className="px-5 py-3 text-left text-gray-600">
                      RATING
                    </th>
                    <th className="px-5 py-3 text-left text-gray-600">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b text-gray-700">
                      <td className="px-5 py-3">
                        {product._id.substring(20, 24)}
                      </td>
                      <td className="px-5 py-3">{product.name}</td>
                      <td className="px-5 py-3">{product.price}MAD</td>
                      <td className="px-5 py-3">{product.category}</td>
                      <td className="px-5 py-3">{product.countInStock}</td>
                      <td className="px-5 py-3">{product.rating}</td>
                      <td className="px-5 py-3 flex space-x-2 items-center">
                        <Link
                          href={`/admin/product/${product._id}`}
                          passHref
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => deleteHandler(product._id)}
                          className="default-button"
                          type="button"
                        >
                          {' '}
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

AdminProductsScreen.auth = { adminOnly: true };
