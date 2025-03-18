import Laptop from "./laptop";
import Mobile from "./mobile";
import useIsMobile from "@/hooks/use-isMobile";
import useUserInfo from "../hooks/use-user-info";

export default function Detail(props: any) {
  const { id, farmAddress, pool, token0, token1, price } = props.data;
  const isMobile = useIsMobile();

  console.log('111111222222222222')
  const { loading, info, queryInfo } = useUserInfo({
    islandContract: id,
    farmContract: farmAddress,
    token0,
    token1,
    pool,
    price
  });

  return (
    <>
      {isMobile ? (
        <Mobile
          {...props}
          info={info}
          loading={loading}
          onSuccess={queryInfo}
        />
      ) : (
        <Laptop
          {...props}
          info={info}
          loading={loading}
          onSuccess={queryInfo}
        />
      )}
    </>
  );
}
