import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { Product, Stock } from "../types";

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem("@RocketShoes:cart");

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      // TODO
      const products = [...cart];
      const { data: product } = await api.get<Product>(`products/${productId}`);

      const {
        data: { amount: remaining },
      } = await api.get<Stock>(`stock/${productId}`);

      const foundProductIndex = products.findIndex(
        (currentProduct) => currentProduct.id === productId
      );

      const outOfStock = products[foundProductIndex]?.amount >= remaining;

      if (outOfStock) {
        toast.error("Quantidade solicitada fora de estoque");
      } else {
        if (products.length && foundProductIndex > -1) {
          products[foundProductIndex].amount++;
        } else {
          products.push({ ...product, amount: 1 });
        }

        localStorage.setItem("@RocketShoes:cart", JSON.stringify(products));

        setCart(products);
      }
    } catch {
      // TODO
      toast.error("Erro na adição do produto");
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const products = cart.filter((product) => product.id !== productId);

      if (products.length === cart.length) {
        toast.error("Erro na remoção do produto");
        return;
      }

      localStorage.setItem("@RocketShoes:cart", JSON.stringify(products));

      setCart(products);
      // TODO
    } catch {
      // TODO
      toast.error("Erro na remoção do produto");
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
      if (!amount) return;

      const {
        data: { amount: remaining },
      } = await api.get<Stock>(`stock/${productId}`);

      if (amount > remaining) {
        toast.error("Quantidade solicitada fora de estoque");
      } else {
        const products = cart.map((product) => {
          if (product.id === productId) product.amount = amount;
          return product;
        });

        localStorage.setItem("@RocketShoes:cart", JSON.stringify(products));

        setCart([...products]);
      }
    } catch {
      // TODO
      toast.error("Erro na alteração de quantidade do produto");
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
