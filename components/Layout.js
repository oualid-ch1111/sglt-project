import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { Menu } from '@headlessui/react';
import DropdownLink from './DropdownLink';
import React, { useContext, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Store } from '../utils/Store';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import { FaShoppingCart } from 'react-icons/fa';
import { FaChevronDown } from 'react-icons/fa'; /* Import de l'icône */
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { SearchIcon } from '@heroicons/react/outline';

export default function Layout({ title, children }) {
  const { status, data: session } = useSession();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);
  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantite, 0));
  }, [cart.cartItems]);

  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        document.body.classList.add('scrolling');
      } else {
        document.body.classList.remove('scrolling');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const logoutClickHandler = () => {
    Cookies.remove('cart');
    dispatch({ type: 'CART_RESET' });
    signOut({ callbackUrl: '/login' });
  };
  const buttonVariants = {
    hover: {
      scale: 1.1,
      transition: {
        yoyo: Infinity, // animation infinie
      },
    },
    press: {
      scale: 0.9,
    },
  };
  const [query, setQuery] = useState('');

  const router = useRouter();
  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  return (
    <>
      <Head>
        <title>{title ? `${title} - SGLT` : 'SGLT'}</title>
        <meta name="description" content="Ecommerce Website" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          integrity="sha384-k6RqeWeci5ZR/Lv4MR0sA0FfDOMt23cez/5paNdF+TmFE5Mg5l5l5g5eFZ5egwO5"
          crossorigin="anonymous"
        />
      </Head>
      <ToastContainer position="bottom-center" limit={1} />

      <div className="flex flex-col min-h-screen bg-light">
        <header
          className={`fixed w-full z-10 ${
            scrolling
              ? 'bg-gradient-to-r from-purple-400 via-pink-500 to-red-500'
              : 'bg-black'
          } text-red-900 shadow-sm transition-all duration-300`}
        >
          <nav className="container d-flex justify-content-between py-2 px-6 animate__animated animate__fadeInDown">
            <Link
              href="/"
              className="text-white text-decoration-none display-4 font-weight-bold transform transition-transform hover:scale-105  animate-pulse"
            >
              SGLT
            </Link>
            <form
              onSubmit={submitHandler}
              className="mx-auto hidden md:flex w-full md:w-1/3 justify-center items-center space-x-2 space-y--1"
            >
              <input
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                className="input-field w-full md:w-auto flex-grow rounded-r-none"
                placeholder="Rechercher un produit "
              />
              <button
                className="bg-blue-500  text-white w-12 h-12 flex items-center justify-center rounded-l-none rounded-r-md border border-blue-500 hover:bg-blue-600 active:bg-blue-700 focus:outline-none transition-all duration-300"
                type="submit"
                id="button-addon2"
              >
                <SearchIcon className=" h-6 w-6"></SearchIcon>
              </button>
            </form>

            <div className="space-x-7 d-flex align-items-center ">
              <Link
                href="/cart"
                className="flex items-center space-x-2 p-2 text-orange-500 text-decoration-none hover:bg-gray-200 rounded transition-colors duration-300"
              >
                <FaShoppingCart className="text-xl" /> {/* Icône de panier */}
                <span className="font-semibold text-lg">Panier</span>
                {cartItemsCount > 0 && (
                  <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white animate__animated animate__tada">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              {status === 'loading' ? (
                'Loading'
              ) : session?.user ? (
                <Menu as="div" className="relative inline-block">
                  <Menu.Button
                    as={motion.div}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="press"
                    className="menu-button text-white"
                  >
                    {session.user.name}
                    <FaChevronDown className="menu-icon" />
                  </Menu.Button>

                  <Menu.Items className="absolute right-0 w-56 origin-top-right bg-white shadow-lg ">
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href="/profile">
                        Profile
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <DropdownLink
                        className="dropdown-link"
                        href="/order-history"
                      >
                        Order History
                      </DropdownLink>
                    </Menu.Item>
                    {session.user.isAdmin && (
                      <Menu.Item>
                        <DropdownLink
                          className="dropdown-link"
                          href="/admin/dashboard"
                        >
                          Admin Dashboard
                        </DropdownLink>
                      </Menu.Item>
                    )}
                    <Menu.Item>
                      <a
                        className="dropdown-link"
                        href="#"
                        onClick={logoutClickHandler}
                      >
                        Logout
                      </a>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link
                  href="/login"
                  className="text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md shadow-md text-decoration-none"
                >
                  Se connecter
                </Link>
              )}
            </div>
          </nav>
        </header>
        <main className=" flex-grow container mx-auto my-8 p-6 bg-light rounded mt-20 animate__animated animate__fadeInUp">
          {children}
        </main>
        <footer className="bg-dark text-white animate__animated animate__fadeIn">
          <div className="container py-4 text-center">
            <p className="mb-0">
              Copyright © 2023 <b>SGLT</b>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
