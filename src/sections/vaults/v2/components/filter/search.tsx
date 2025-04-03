import clsx from "clsx";
import { motion } from "framer-motion";
import { useVaultsV2Context } from "@/sections/vaults/v2/context";
import { useEffect, useRef } from "react";
import { trim } from "lodash";
import useIsMobile from "@/hooks/use-isMobile";
import useClickTracking from "@/hooks/use-click-tracking";

const Search = (props: any) => {
  const { className } = props;

  const {
    listSearchOpen,
    toggleListSearchOpen,
    listSearchValue,
    handleListSearchValue
  } = useVaultsV2Context();
  const isMobile = useIsMobile();

  const { handleReport } = useClickTracking();

  const hasValue = !!listSearchValue && !!trim(listSearchValue);

  const inputRef = useRef<any>();

  const handleSearch = () => {
    if (hasValue) {
      handleListSearchValue("");
      toggleListSearchOpen(false);
      return;
    }
    toggleListSearchOpen();
  };

  const handleChange = (e: any) => {
    const val = e.target.value;
    handleListSearchValue(val);
    handleReport("1022-001-014", val);
  };

  const handleBlur = (e: any) => {
    const val = e.target.value;
    if (!trim(val)) {
      handleListSearchValue("");
      toggleListSearchOpen(false);
    }
  };

  useEffect(() => {
    if (listSearchOpen && !isMobile) {
      inputRef.current?.focus?.();
      return;
    }
  }, [listSearchOpen, isMobile]);

  return (
    <motion.div
      className={clsx(
        "flex items-center justify-end gap-[5px] p-[5px]",
        className
      )}
      animate={{
        flexGrow: isMobile || listSearchOpen ? 1 : 0,
        width: isMobile || listSearchOpen ? 0 : 30,
        borderBottom: isMobile || listSearchOpen ? "1px solid #000" : 0
      }}
    >
      {(isMobile || listSearchOpen) && (
        <input
          ref={inputRef}
          value={listSearchValue}
          type="text"
          className="flex-1 w-0 bg-[unset] text-black font-Montserrat text-[16px] font-semibold leading-[90%]"
          placeholder="Search vaults"
          onChange={handleChange}
          onBlur={handleBlur}
        />
      )}
      <button
        type="button"
        className="w-[20px] h-[20px] bg-[url('/images/vaults/v2/search.svg')] bg-no-repeat bg-center bg-[length:17px_17px] shrink-0"
        style={{
          backgroundImage: `url("${
            hasValue
              ? "/images/vaults/v2/clear.png"
              : "/images/vaults/v2/search.svg"
          }")`
        }}
        onClick={handleSearch}
      />
    </motion.div>
  );
};

export default Search;
