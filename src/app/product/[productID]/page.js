"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Badge from "@/app/components/Badge";
import "../../components/accordion.css";
import {
  StarIcon,
  StarFilledIcon,
  MinusCircledIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import "../../components/Product.css";

export default function ProductPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const productID = params.productID;
  const color = searchParams.get("color");
  const size = searchParams.get("size");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(null);
  const [colorImages, setColorImages] = useState([]);
  const [selectedColor, setSelectedColor] = useState(
    color || product.colors[0]
  );
  const [selectedSize, setSelectedSize] = useState(size);
  const [qty, setQty] = useState(1);
  const [openSections, setOpenSections] = useState({
    0: true,
    1: true,
    2: true,
  });

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

  const calculatePercentageOff = () => {
    const percentageOff =
      ((inventory.list_price - inventory.sale_price) / inventory.list_price) *
      100;
    return percentageOff;
  };

  const percentageOff = calculatePercentageOff();

  const DisplayStars = () => {
    const rating = Math.round(product.rating);
    const maxStars = 5;

    return (
      <div className="text-yellow-500 flex">
        {[...Array(maxStars)].map((_, index) =>
          index < rating ? (
            <StarFilledIcon key={index} />
          ) : (
            <StarIcon key={index} />
          )
        )}
      </div>
    );
  };

  const handleColorChange = (newColor) => {
    setSelectedColor(newColor);
    const params = new URLSearchParams(window.location.search);
    params.set("color", newColor);
    window.history.pushState({}, "", `${window.location.pathname}?${params}`);
  };

  const handleSizeChange = (newSize) => {
    setSelectedSize(newSize);
    const params = new URLSearchParams(window.location.search);
    params.set("size", newSize);
    window.history.pushState({}, "", `${window.location.pathname}?${params}`);
  };

  const incrementQty = () => {
    setQty(qty + 1);
  };

  const decrementQty = () => {
    setQty(qty - 1);
  };

  const handleSectionToggle = (index) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  return (
    <section className="flex flex-col lg:flex-row rounded gap-8 bg-white m-4 p-4 py-12">
      <div className="flex flex-col items-center lg:w-1/2 h-screen">
        {currentImage && (
          <Image
            src={currentImage.image_url}
            alt={product.name}
            width={500}
            height={500}
            className="object-cover rounded-md mb-4 h-[400px] md:h-[800px] md:w-[100%]"
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
                className={`w-[80px] h-[120px] md:w-[190px] md:h-[180px] overflow-hidden rounded-md ${
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

      <div className="flex flex-col gap-5">
        <h1 className="text-3xl md:text-5xl font-medium tracking-wider">
          {product.name}
        </h1>
        {inventory && (
          <div className="">
            {inventory.list_price === inventory.sale_price ? (
              <p className="text-3xl text-neutral-700">
                ${inventory.sale_price}
              </p>
            ) : (
              <div className="flex flex-col gap-2 tracking-widest">
                <div className="flex gap-2 items-end">
                  <p className="text-3xl text-neutral-700">
                    ${inventory.sale_price}
                  </p>
                  <p className="text-xl text-neutral-400 line-through font-light">
                    ${inventory.list_price}
                  </p>
                </div>

                <Badge value={`${percentageOff}% OFF`} />
              </div>
            )}
          </div>
        )}
        <div className="flex items-center gap-3">
          <p className="text-xl font-light">{product.rating.toFixed(1)}</p>
          {DisplayStars()}
          <a href="" className="text-indigo-600">
            See all {product.reviews} reviews
          </a>
        </div>
        <p className="text-neutral-500 font-light">{product.description}</p>
        <div className="">
          <p className="text-neutral-500 font-light tracking-wide text-sm">
            Available Colors
          </p>
          <div className="flex gap-8 m-3">
            {product.colors.map((colour, index) => (
              <button
                className=""
                key={index}
                onClick={() => {
                  handleColorChange(colour);
                }}
              >
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    color == colour ? "border border-indigo-700" : "border-none"
                  }`}
                >
                  <div
                    className={`h-8 w-8 rounded-full color-${colour} border border-gray-300`}
                  ></div>
                </div>
              </button>
            ))}
          </div>
        </div>
        {product.sizes.length > 0 && (
          <div className="">
            <p className="text-neutral-500 font-light tracking-wide text-sm pb-4">
              Available Sizes
            </p>
            <div className="flex gap-5 flex-wrap">
              {product.sizes.map((sizeEl, index) => (
                <button
                  className=""
                  key={index}
                  onClick={() => handleSizeChange(sizeEl)}
                >
                  <p
                    className={`border rounded w-[68px] h-[50px] flex justify-center items-center ${
                      sizeEl == size
                        ? "border-indigo-700"
                        : "border-neutral-200"
                    }`}
                  >
                    {typeof sizeEl === "string" ? sizeEl.toUpperCase() : sizeEl}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="">
          <p className="text-neutral-500 font-light tracking-wide text-sm pb-4">
            Quantity
          </p>
          <div className="bg-[#fafafa] gap-9 p-2 inline-flex justify-between rounded border border-neutral-402">
            <button
              className="w-5 disabled:text-neutral-300 disabled:cursor-not-allowed"
              onClick={decrementQty}
              disabled={qty === 1}
            >
              -
            </button>
            <p className="w-3">{qty}</p>
            <button className="w-5" onClick={incrementQty}>
              +
            </button>
          </div>
        </div>
        <button className="bg-indigo-700 text-white py-3 rounded md:py-4 md:text-lg hover:bg-indigo-800">
          Add to Cart
        </button>
        <div className="flex flex-col gap-5">
          {product.info.map((infoSec, index) => (
            <div key={index}>
              <div className="flex justify-between">
                <p className="text-lg tracking-wide pb-5">{infoSec.title}</p>
                <button
                  className="text-neutral-400"
                  onClick={() => handleSectionToggle(index)}
                >
                  {openSections[index] ? (
                    <MinusCircledIcon width={20} height={20} />
                  ) : (
                    <PlusCircledIcon width={20} height={20} />
                  )}
                </button>
              </div>
              <ul
                className={`list-disc mx-8 accordion ${
                  openSections[index] ? "open" : ""
                }`}
              >
                {infoSec.description.map((bulletPoint, bulletIndex) => (
                  <li className="text-neutral-500" key={bulletIndex}>
                    {bulletPoint}
                  </li>
                ))}
              </ul>
              {index < product.info.length - 1 && <hr className="mt-8"></hr>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
