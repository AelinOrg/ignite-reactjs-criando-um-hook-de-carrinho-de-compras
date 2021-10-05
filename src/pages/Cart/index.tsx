import React from "react";
import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from "react-icons/md";

import { useCart } from "../../hooks/useCart";
import { formatPrice } from "../../util/format";
import { Container, ProductTable, Total } from "./styles";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}

interface cartProduct {
  details: Product;
  priceFormatted: string;
}

const Cart = (): JSX.Element => {
  const { cart, removeProduct, updateProductAmount } = useCart();

  const cartFormatted = cart.reduce((products, product) => {
    const productIndex = products.findIndex(
      (innerProduct) => innerProduct.details.id === product.id
    );

    if (productIndex === -1) {
      return products.concat({
        details: { ...product, amount: 1 },
        priceFormatted: formatPrice(product.price),
      });
    }

    products[productIndex].details.amount++;

    return products;
  }, [] as cartProduct[]);

  const total = formatPrice(
    cart.reduce((sumTotal, product) => {
      // TODO
      return sumTotal + product.price;
    }, 0)
  );

  function handleProductIncrement(product: Product) {
    // TODO
    updateProductAmount({
      productId: product.id,
      amount: product.amount + 1,
    });
  }

  function handleProductDecrement(product: Product) {
    // TODO
    updateProductAmount({
      productId: product.id,
      amount: product.amount - 1,
    });
  }

  function handleRemoveProduct(productId: number) {
    // TODO
    removeProduct(productId);
  }

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>
        <tbody>
          {cartFormatted.map((product) => (
            <tr key={product.details.id} data-testid="product">
              <td>
                <img src={product.details.image} alt={product.details.title} />
              </td>
              <td>
                <strong>{product.details.title}</strong>
                <span>{product.priceFormatted}</span>
              </td>
              <td>
                <div>
                  <button
                    type="button"
                    data-testid="decrement-product"
                    disabled={product.details.amount <= 1}
                    onClick={() => handleProductDecrement(product.details)}
                  >
                    <MdRemoveCircleOutline size={20} />
                  </button>
                  <input
                    type="text"
                    data-testid="product-amount"
                    readOnly
                    value={product.details.amount}
                  />
                  <button
                    type="button"
                    data-testid="increment-product"
                    onClick={() => handleProductIncrement(product.details)}
                  >
                    <MdAddCircleOutline size={20} />
                  </button>
                </div>
              </td>
              <td>
                <strong>
                  {formatPrice(product.details.amount * product.details.price)}
                </strong>
              </td>
              <td>
                <button
                  type="button"
                  data-testid="remove-product"
                  // onClick={() => handleRemoveProduct(product.details)}
                >
                  <MdDelete size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </ProductTable>

      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>{total}</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;
