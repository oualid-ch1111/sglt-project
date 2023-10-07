/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import React, { useContext } from 'react';

export default function ProductItem({ product, addToCartHandler }) {
  return (
    <div className="card shadow-sm flex flex-col">
      <div className="relative h-72">
        <Link href={`/product/${product.slug}`}>
          <img
            src={product.image}
            alt={product.name}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </Link>
      </div>
      <div className="card-body flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/product/${product.slug}`}>
            <h5 className="card-title text-truncate text-dark cursor-pointer hover:text-success">
              {product.name}
            </h5>
          </Link>
          <p className="">{product.brand}</p>
          <h6 className="card-subtitle mb-3 text-muted">{product.price}MAD</h6>
        </div>
        <button
          className="btn btn-primary w-100  "
          type="button"
          onClick={() => addToCartHandler(product)}
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  );
}
