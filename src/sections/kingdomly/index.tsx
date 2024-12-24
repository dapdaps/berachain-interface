import { mockNFTs } from './mock/nft';
import { NFTCard } from './components/NFTCard';
import Link from 'next/link';
import { usePartnerCollections } from './hooks/usePartnerCollections';

const Kingdomly = () => {
    const { collections, isLoading, error } = usePartnerCollections();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    console.log(collections, 'collections')

    return (
        <div className="min-w-[1200px] p-6">
            <div className="flex flex-row justify-between items-center w-full">
                <h2 className="text-white text-2xl font-Montserrat font-semibold">
                    PARTNER COLLECTIONS
                </h2>
                <Link 
                    className="flex justify-center items-center font-semibold text-center text-xs md:text-sm lg:text-base text-white py-2.5 px-4 gap-4 bg-tertiary-white-4 hover:bg-tertiary-white-6 rounded-lg cursor-pointer"
                    href="/partner-collections"
                >
                    View all
                </Link>
            </div>
            
            <div className="lg:grid xl:hidden grid-cols-4 gap-4 mt-4">
                {collections.map(collection => (
                    <NFTCard key={collection.contract_address} item={collection} />
                ))}
            </div>
        </div>
    );
}

export default Kingdomly;