import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { CartItem } from "../types/cart/Cart.res.type";
import { CartService } from "../services/cart/cart.service";
import { useAuth } from "./Auth.context";
import { helpers } from "../utils";
import { HttpException } from "../app/exceptions/http.exception";

interface CartContextType {
    cartItems: CartItem[];
    cartCount: number;
    loading: boolean;
    addToCart: (courseId: string) => Promise<void>;
    removeFromCart: (cartId: string) => Promise<void>;
    fetchCartItems: () => Promise<void>;
    clearCart: () => void;
    selectedIds: string[];
    setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const { userInfo, token } = useAuth();

    // Calculate cart count
    const cartCount = cartItems.length;

    // Calculate total price for selected items
    const totalPrice = cartItems.reduce((acc, item) => {
        return selectedIds.includes(item.cartId)
            ? acc + item.price * (1 - item.discount)
            : acc;
    }, 0);

    // Fetch cart items from API
    const fetchCartItems = async () => {
        if (!userInfo?.id || !token) {
            setCartItems([]);
            return;
        }

        setLoading(true);
        try {
            const response = await CartService.getCartItems({ userId: userInfo.id });
            if (response?.data?.success && Array.isArray(response.data.data)) {
                setCartItems(response.data.data);
            } else {
                setCartItems([]);
            }
        } catch (error) {
            /*
             * Backend returns 404 in case the user has no existing cart. This is not really an
             * exceptional situation from the UX perspective, so we silently treat it as an empty
             * cart without confusing the user with an error toast or console noise.
             */
            if (error instanceof HttpException && error.status === 404) {
                setCartItems([]);
                return; // Exit early – nothing else to handle
            }

            console.error("Lỗi lấy giỏ hàng:", error);
            helpers.notificationMessage("Không thể tải thông tin giỏ hàng", "error");
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    };

    // Add item to cart
    const addToCart = async (courseId: string) => {
        if (!userInfo?.id || !token) {
            helpers.notificationMessage("Vui lòng đăng nhập để thêm vào giỏ hàng", "warning");
            return;
        }

        try {
            setLoading(true);
            const response = await CartService.addCartItem({
                courseId: courseId,
            });

            if (response?.data?.success) {
                helpers.notificationMessage("Đã thêm khóa học vào giỏ hàng", "success");
                await fetchCartItems(); // Refresh cart items
            } else {
                helpers.notificationMessage("Không thể thêm vào giỏ hàng", "error");
            }
        } catch (error) {
            console.error("Lỗi thêm vào giỏ hàng:", error);
            helpers.notificationMessage("Không thể thêm vào giỏ hàng", "error");
        } finally {
            setLoading(false);
        }
    };

    // Remove item from cart (placeholder implementation since API method doesn't exist)
    const removeFromCart = async (cartId: string) => {
        try {
            setLoading(true);
            // Since removeFromCart API doesn't exist, we'll simulate it
            setCartItems(prev => prev.filter(item => item.cartId !== cartId));
            setSelectedIds(prev => prev.filter(id => id !== cartId));
            helpers.notificationMessage("Đã xóa khóa học khỏi giỏ hàng", "success");
        } catch (error) {
            console.error("Lỗi xóa khỏi giỏ hàng:", error);
            helpers.notificationMessage("Không thể xóa khỏi giỏ hàng", "error");
        } finally {
            setLoading(false);
        }
    };

    // Clear cart
    const clearCart = () => {
        setCartItems([]);
        setSelectedIds([]);
    };

    // Fetch cart items when user info changes
    useEffect(() => {
        if (userInfo?.id && token) {
            fetchCartItems();
        } else {
            clearCart();
        }
    }, [userInfo?.id, token]);

    const value: CartContextType = {
        cartItems,
        cartCount,
        loading,
        addToCart,
        removeFromCart,
        fetchCartItems,
        clearCart,
        selectedIds,
        setSelectedIds,
        totalPrice,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
