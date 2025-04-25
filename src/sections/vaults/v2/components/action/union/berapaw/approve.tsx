import clsx from 'clsx';
import Button from '@/components/button';

const BerapawApprove = (props: any) => {
  const { className, onApprove, approving, approved, approvedLoading, disabled } = props;

  return (
    <div className={clsx("", className)}>
      <div className="text-[18px] font-Montserrat font-bold leading-[90%] text-black">
        <div className="flex-1">Step 2. Approve in BeraPaw</div>
        <Button
          type="primary"
          onClick={onApprove}
          disabled={approving || approved || disabled}
          className="shrink-0 !h-[50px] mt-[20px] w-full"
          loading={approving || approvedLoading}
        >
          {approved ? "Approved" : "Approve"}
        </Button>
      </div>
    </div>
  );
};

export default BerapawApprove;
