import Product from "./components/Product";

export default function Home() {
  return (
    <>
      <section className="flex flex-col gap-8 bg-white rounded m-4 p-3 py-12 lg:py-32 lg:px-24">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold text-2xl md:text-3xl lg:text-4xl">
            Latest Arrivals
          </h1>
          <button className="shadow outline-none border border-[#e6e6e6] p-2 rounded font-medium px-3.5 py-2.5 hover:bg-[#fafafa] lg:text-lg">
            View All
          </button>
        </div>

        <Product />
      </section>
    </>
  );
}
