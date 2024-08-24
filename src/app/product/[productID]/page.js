"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Badge from "@/app/components/Badge";

export default function ProductPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const productID = params.productID;
  const color = searchParams.get("color");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(null);
  const [colorImages, setColorImages] = useState([]);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(
          `https://www.greatfrontend.com/api/projects/challenges/e-commerce/products/${productID}`
        );
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productID]);

  useEffect(() => {
    if (product && color) {
      const images = product.images.filter((el) => el.color === color);
      setColorImages(images);
      if (images.length > 0) {
        setCurrentImage(images[0]);
      }
    }
  }, [product, color]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const inventory = product.inventory.find((el) => el.color === color);

  return (
    <section className="flex flex-col rounded gap-8 bg-white m-4 p-4 py-12">
      <div className="flex flex-col items-center">
        {currentImage && (
          <Image
            src={currentImage.image_url}
            alt={product.name}
            width={500}
            height={500}
            className="object-cover rounded-md mb-4"
          />
        )}
        <div className="flex gap-4 overflow-x-auto w-full pb-4">
          {colorImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(img)}
              className="focus:outline-none"
            >
              <div
                className={`w-[80px] h-[120px] overflow-hidden rounded-md ${
                  currentImage === img ? "border-2 border-blue-600" : ""
                }`}
              >
                <Image
                  src={img.image_url}
                  alt={`${product.name} - Thumbnail ${index + 1}`}
                  width={100}
                  height={150}
                  className="object-cover w-full h-full"
                />
              </div>
            </button>
          ))}
        </div>
      </div>
      <h1 className="text-3xl font-medium tracking-wider">{product.name}</h1>
      <div className="flex flex-col gap-2">
        {inventory && (
          <div className="">
            {inventory.list_price === inventory.sale_price ? (
              <p className="">{inventory.sale_price}</p>
            ) : (
              <div className="flex gap-2 items-center tracking-widest">
                <p className="text-3xl text-neutral-700">
                  ${inventory.sale_price}
                </p>
                <p className="text-xl text-neutral-400 line-through font-light">
                  ${inventory.list_price}
                </p>
              </div>
            )}
          </div>
        )}
        <Badge value={"20% OFF"} />
        <div className="">
          <p className="text-xl font-light">{product.rating.toFixed(1)}</p>
        </div>
      </div>
    </section>
  );
}
