'use client';

interface Props {
  params: {
    name: string;
  };
}

export default function Page({ params }: Props) {
  return (
    <div>
      <h1>NFT Detail Page - {params.name}</h1>
    </div>
  );
}
