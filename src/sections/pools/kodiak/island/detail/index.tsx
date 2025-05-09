import Laptop from "./laptop";
import Mobile from "./mobile";
import useIsMobile from "@/hooks/use-isMobile";
import useUserInfo from "../hooks/use-user-info";

export default function Detail(props: any) {

  const isMobile = useIsMobile();

  const { loading, info, queryInfo } = useUserInfo(props.data);

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
