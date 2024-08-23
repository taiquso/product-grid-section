import products from "../data/products.json";
import productImages from "../data/product-images.json";
import inventory from "../data/inventory.json";
import Image from "next/image";
import "./Product.css";

export default function Product() {
  const uniqueColors = {};

  inventory.forEach((item) => {
    if (!uniqueColors[item.product_id]) {
      uniqueColors[item.product_id] = new Set();
    }
    uniqueColors[item.product_id].add(item.color);
  });

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 grid-rows-* gap-8">
        {products.slice(0, 8).map((product) => {
          const productImage = productImages.find(
            (image) => image.product_id === product.product_id
          );
          const inv = inventory.find(
            (invEl) => invEl.product_id === product.product_id
          );

          const productColors = Array.from(
            uniqueColors[product.product_id] || []
          );

          return (
            <div className="font-medium leading-7" key={product.id}>
              {productImage && (
                <Image
                  src={productImage.image_url}
                  alt={product.name}
                  width={500}
                  height={0}
                  className="h-[300px] object-cover rounded-lg"
                />
              )}
              <div className="flex flex-col gap-2 py-2">
                <p className="text-sm text-neutral-600 font-light">
                  {productImage.color.toUpperCase()[0] +
                    productImage.color.slice(1)}
                </p>
                <p className="text-lg tracking-wide">{product.name}</p>
                {inv && (
                  <div className="">
                    {inv.list_price === inv.sale_price ? (
                      <p className="text-neutral-500 text-lg font-light tracking-widest">
                        ${inv.sale_price}
                      </p>
                    ) : (
                      <div className="flex gap-3 items-center">
                        <p className="text-neutral-500 text-lg font-light tracking-widest">
                          ${inv.sale_price}
                        </p>
                        <p className="text-neutral-500 text-sm line-through">
                          ${inv.list_price}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex gap-4">
                  {productColors.map((color) => (
                    <span
                      key={color}
                      className={`inline-flex h-4 w-4 outline outline-gray-300 outline-1 rounded-full color-${color}`}
                    ></span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
