export default function Page({ params }: { params: { readonly poolAddress: string } }) {
  return (
    <>
      <h1>Pool page for {params.poolAddress}</h1>
    </>
  );
}
