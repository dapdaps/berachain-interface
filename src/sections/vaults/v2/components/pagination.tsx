import clsx from 'clsx';
import { useVaultsV2Context } from '@/sections/vaults/v2/context';
import { PAGINATION_ACTION } from '@/sections/vaults/v2/config';

const Pagination = (props: any) => {
  const { className } = props;

  const {
    listPageTotal,
    listPageIndex,
    toggleListPageIndex,
    listLoading,
  } = useVaultsV2Context();

  return (
    <div className={clsx("flex justify-end items-center gap-[5px] px-[14px] pt-[10px] mt-auto", className)}>
      <PaginationItem
        icon="/images/vaults/v2/page-first.svg"
        disabled={listLoading || listPageIndex <= 1}
        onClick={() => {
          toggleListPageIndex(PAGINATION_ACTION.FIRST);
        }}
      />
      <PaginationItem
        icon="/images/vaults/v2/page-prev.svg"
        disabled={listLoading || listPageIndex <= 1}
        onClick={() => {
          toggleListPageIndex(PAGINATION_ACTION.PREV);
        }}
      />
      <div className="flex items-center gap-[3px] text-[#000] text-center font-Montserrat text-[12px] not-italic font-medium leading-[12px]">
        <div className="">{listPageIndex}</div>
        <div className="">/</div>
        <div className="">{listPageTotal}</div>
      </div>
      <PaginationItem
        icon="/images/vaults/v2/page-next.svg"
        disabled={listLoading || listPageIndex >= listPageTotal}
        onClick={() => {
          toggleListPageIndex(PAGINATION_ACTION.NEXT);
        }}
      />
      <PaginationItem
        icon="/images/vaults/v2/page-last.svg"
        disabled={listLoading || listPageIndex >= listPageTotal}
        onClick={() => {
          toggleListPageIndex(PAGINATION_ACTION.LAST);
        }}
      />
    </div>
  );
};

export default Pagination;

const PaginationItem = (props: any) => {
  const { className, icon, onClick, disabled } = props;

  return (
    <button
      type="button"
      className={clsx("w-[20px] h-[10px] bg-center bg-contain bg-no-repeat disabled:opacity-30 disabled:!cursor-not-allowed", className)}
      disabled={disabled}
      style={{
        backgroundImage: `url('${icon}')`
      }}
      onClick={onClick}
    />
  )
}
