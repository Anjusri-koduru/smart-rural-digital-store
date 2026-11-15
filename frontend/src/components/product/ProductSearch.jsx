import { Search } from "lucide-react";

const ProductSearch = ({
  search,
  setSearch,
}) => {
  return (
    <div className="product-search">
      <Search size={20} />

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
};

export default ProductSearch;