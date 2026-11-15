import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import ProductGrid from "./ProductGrid";
import {
  getSimilarProducts,
} from "../../services/recommendationService";

const RecommendationSection = ({ productId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        setLoading(true);

        const response = await getSimilarProducts(productId);

        if (response.success) {
          setProducts(response.products || []);
        }
      } catch (error) {
        console.error(
          "Similar products error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchSimilarProducts();
    }
  }, [productId]);

  if (loading || products.length === 0) {
    return null;
  }

  return (
    <section className="recommendation-section">
      <div className="recommendation-section-header">
        <div className="recommendation-heading">
          <div className="recommendation-sparkle">
            <Sparkles size={22} />
          </div>

          <div>
            <h2>You May Also Like</h2>
            <p>Similar products you may be interested in</p>
          </div>
        </div>
      </div>

      <ProductGrid products={products} />
    </section>
  );
};

export default RecommendationSection;