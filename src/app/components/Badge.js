export default function Badge({ value }) {
  return (
    <>
      <div className="inline-flex">
        <p className="text-red-800 text-sm font-light p-1 bg-yellow-50 rounded-full px-2 border border-yellow-300 tracking-normal">
          {value}
        </p>
      </div>
    </>
  );
}
