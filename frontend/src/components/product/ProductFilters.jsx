const ProductFilters = ({
  category,
  setCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  sort,
  setSort,
}) => {
  return (
    <div className="product-filters">

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">All Categories</option>
        <option value="Vegetables">Vegetables</option>
        <option value="Fruits">Fruits</option>
        <option value="Handicrafts">Handicrafts</option>
        <option value="Clothing">Clothing</option>
        <option value="Food">Food</option>
        <option value="Other">Other</option>
      </select>

      <input
        type="number"
        placeholder="Min Price"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
      />

      <input
        type="number"
        placeholder="Max Price"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
      />

      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
      >
        <option value="">Latest</option>
        <option value="price_low">
          Price: Low to High
        </option>
        <option value="price_high">
          Price: High to Low
        </option>
        <option value="rating">
          Top Rated
        </option>
      </select>

    </div>
  );
};

export default ProductFilters;