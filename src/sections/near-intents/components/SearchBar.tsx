import { Cross1Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons"

type Props = {
  query: string
  setQuery: (value: string) => void
  placeholder?: string
  handleOverrideCancel?: () => void
}

export const SearchBar = ({
  query,
  setQuery,
  handleOverrideCancel,
  placeholder = "Search name or paste address",
}: Props) => {
  return (
    <div className="flex mt-3 justify-between items-center gap-2 border-b border-black">
      <MagnifyingGlassIcon width={18} height={18} />
      <input
        className="flex-1 border-transparent focus:border-transparent focus:ring-0 bg-[#FFFDEB]"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {/* <button
        type="button"
        onClick={() => {
          handleOverrideCancel ? handleOverrideCancel() : setQuery("")
        }}
      >
        <Cross1Icon width={14} height={14} />
      </button> */}
    </div>
  )
}
