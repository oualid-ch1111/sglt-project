import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import { getError } from '../utils/error';
import { Store } from '../utils/Store';
import {
  Button,
  Card,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Container,
} from 'react-bootstrap';

export default function EcranCommande() {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { cartItems, shippingAddress, paymentMethod } = cart;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.quantite * c.price, 0)
  );
  const shippingPrice = itemsPrice > 200 ? 0 : 15;
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  const router = useRouter();
  useEffect(() => {
    if (!paymentMethod) {
      router.push('/payment');
    }
  }, [paymentMethod, router]);

  const [loading, setLoading] = useState(false);

  const confirmerCommande = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/orders', {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });
      setLoading(false);
      dispatch({ type: 'CART_CLEAR_ITEMS' });
      Cookies.set(
        'cart',
        JSON.stringify({
          ...cart,
          cartItems: [],
        })
      );
      router.push(`/order/${data._id}`);
    } catch (err) {
      setLoading(false);
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="Passer commande">
      <CheckoutWizard activeStep={3} />
      <Container className="py-5">
        <h1 className="mb-5 text-center">Finalisez votre commande</h1>

        <Row>
          {/* Adresse de livraison & Méthode de paiement */}
          <Col md={8}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title className="mb-4">Adresse de livraison</Card.Title>
                <Card.Text>
                  {shippingAddress.fullName}
                  <br />
                  {shippingAddress.address}
                  <br />
                  {`${shippingAddress.city}, ${shippingAddress.postalCode}, ${shippingAddress.country}`}
                </Card.Text>
              </Card.Body>
            </Card>

            <Card className="mb-4">
              <Card.Body>
                <Card.Title className="mb-4">Méthode de paiement</Card.Title>
                <Card.Text>{paymentMethod}</Card.Text>
              </Card.Body>
            </Card>

            <Card className="mb-4">
              <Card.Body>
                <Card.Title className="mb-4">Articles commandés</Card.Title>
                <table className="styled-table">
                  <thead>
                    <tr>
                      <th>Produit</th>
                      <th>Prix unitaire</th>
                      <th>Quantité</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                              className="rounded mr-3"
                            />
                            <Link href={`/product/${item.slug}`}>
                              {item.name}
                            </Link>
                          </div>
                        </td>
                        <td>{item.price}MAD</td>
                        <td>{item.quantite}</td>
                        <td>{item.quantite * item.price}MAD</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card.Body>
            </Card>
          </Col>

          {/* Résumé de la commande */}
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title className="mb-4">Résumé de la commande</Card.Title>
                <ListGroup variant="flush">
                  <ListGroupItem>
                    <div className="d-flex justify-content-between">
                      <div>Articles</div>
                      <div>{itemsPrice}MAD</div>
                    </div>
                  </ListGroupItem>
                  <ListGroupItem>
                    <div className="d-flex justify-content-between">
                      <div>Taxe</div>
                      <div>{taxPrice}MAD</div>
                    </div>
                  </ListGroupItem>
                  <ListGroupItem>
                    <div className="d-flex justify-content-between">
                      <div>Livraison</div>
                      <div>{shippingPrice}MAD</div>
                    </div>
                  </ListGroupItem>
                  <ListGroupItem className="font-weight-bold">
                    <div className="d-flex justify-content-between">
                      <div>Total</div>
                      <div>{totalPrice}MAD</div>
                    </div>
                  </ListGroupItem>
                </ListGroup>
              </Card.Body>
              <Card.Footer className="d-flex justify-content-center">
                <Button
                  variant="primary"
                  disabled={loading}
                  onClick={confirmerCommande}
                >
                  {loading ? 'Traitement...' : 'Confirmer la commande'}
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

EcranCommande.auth = true;
