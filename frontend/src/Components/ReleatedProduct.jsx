import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../Context/ShopContext";
import Tittle from "./Tittle";
import ProductItem from "./ProductItem";
import SlideInLeft from "./SlideInLeft";

const ReleatedProduct = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext);
  const [releated, setReleated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      let productcopy = products.slice();
      productcopy = productcopy.filter((item) => category === item.category);
      productcopy = productcopy.filter(
        (item) => subCategory === item.subCategory,
      );
      setReleated(productcopy.slice(0, 5));
    }
  }, [products, category, subCategory]);

  return (
    <SlideInLeft>
      <div className="my-24 rounded-[28px] border border-white/10 bg-white/[0.05] px-4 py-8 backdrop-blur sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <div className="mb-8 text-center text-3xl text-[#f8fafc]">
          <Tittle text1="Related" text2="Products" />
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {releated.map((item, index) => (
            <ProductItem
              key={index}
              id={item._id}
              name={item.name}
              price={item.price}
              image={item.image}
              averageRating={item.averageRating}
              reviewCount={item.reviewCount}
              totalStock={item.totalStock}
            />
          ))}
        </div>
      </div>
    </SlideInLeft>
  );
};

export default ReleatedProduct;
