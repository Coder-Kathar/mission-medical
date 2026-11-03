import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function PageTitle() {
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;

        const titles = {
            "/": "Makkal Marunthagam - Home",
            "/products": "Products - Makkal Marunthagam",
            "/cart": "My Cart - Makkal Marunthagam",
            "/checkout": "Checkout - Makkal Marunthagam",
            "/orders": "My Orders - Makkal Marunthagam",
            "/login": "Login - Makkal Marunthagam",
            "/request": "Request - Makkal Marunthagam",
            "/request-preview": "Request Preview - Makkal Marunthagam",
            "/admin": "Admin Dashboard - Makkal Marunthagam",
            "/admin/products": "Manage Products - Makkal Marunthagam",
            "/worker": "Worker Portal - Makkal Marunthagam",
        };

        let title = titles[path];

        if (path.startsWith("/product/")) {
            title = "Product Details - Makkal Marunthagam";
        }

        document.title = title || "Makkal Marunthagam";
    }, [location.pathname]);

    return null;
}

export default PageTitle;