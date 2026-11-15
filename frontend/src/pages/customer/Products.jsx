import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import ProductSearch from "../../components/product/ProductSearch";
import ProductFilters from "../../components/product/ProductFilters";
import ProductGrid from "../../components/product/ProductGrid";
import Loader from "../../components/common/Loader";

import {
  getCustomerProducts,
} from "../../services/productService";

import {
  trackSearch,
} from "../../services/recommendationInteractionService";

const Products = () => {
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");

  const [loading, setLoading] = useState(true);

  // ================= FETCH PRODUCTS =================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response =
        await getCustomerProducts({
          search,
          category,
          minPrice,
          maxPrice,
          sort,
        });

      if (response.success) {
        setProducts(
          response.products || []
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [
    search,
    category,
    minPrice,
    maxPrice,
    sort,
  ]);

  // ================= TRACK SEARCH =================

  useEffect(() => {
    const trimmedSearch =
      search.trim();

    if (trimmedSearch.length < 2) {
      return;
    }

    const timer = setTimeout(() => {
      trackSearch(trimmedSearch).catch(
        (error) => {
          console.error(
            "Search tracking error:",
            error
          );
        }
      );
    }, 700);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  return (
    <div className="products-page">
      <div className="products-header">
        <div>
          <h1>Products</h1>

          <p>
            Explore products from rural sellers
          </p>
        </div>

        <ProductSearch
          search={search}
          setSearch={setSearch}
        />
      </div>

      <ProductFilters
        category={category}
        setCategory={setCategory}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        sort={sort}
        setSort={setSort}
      />

      {loading ? (
        <Loader />
      ) : (
        <ProductGrid
          products={products}
        />
      )}
    </div>
  );
};

export default Products;