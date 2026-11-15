import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import ProductGrid from "../../components/product/ProductGrid";
import Loader from "../../components/common/Loader";
import { getForYouRecommendations } from "../../services/recommendationService";

const Recommendations = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getForYouRecommendations();

        if (response.success) {
          const recommendedProducts =
            response.recommendations ??
            response.products ??
            [];

          setProducts(recommendedProducts);
        } else {
          setError(
            response.message ||
              "Unable to load recommendations."
          );
        }
      } catch (err) {
        console.error("Recommendation error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load recommendations."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="recommendations-page">
      <div className="recommendations-header">
        <div className="recommendations-title">
          <div className="recommendations-icon">
            <Sparkles size={24} />
          </div>

          <div>
            <h1>Recommended For You</h1>
            <p>
              Products selected specially for your interests
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="recommendation-error">
          {error}
        </div>
      )}

      {!error && products.length > 0 && (
        <ProductGrid products={products} />
      )}

      {!error && products.length === 0 && (
        <div className="recommendation-empty">
          <Sparkles size={42} />
          <h2>No recommendations yet</h2>
          <p>
            Browse products, add favorites, or place orders
            to get personalized recommendations.
          </p>
        </div>
      )}
    </div>
  );
};

export default Recommendations;