import React from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import LendingButton from '@/components/button';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary';
  requiredChainId?: number;
  style?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
  variant = 'primary',
  requiredChainId,
  style,
}) => {
  const { address, chainId } = useAccount();
  const { isPending, switchChain } = useSwitchChain();
  const modal = useAppKit();

  const baseClasses = 'px-4 py-2 rounded-full font-Montserrat text-sm font-medium !leading-[17.07px] text-center';
  
  const variantClasses: Record<string, string> = {
    primary: 'bg-[#FFDC50] border border-black text-black hover:bg-[#FFD700]',
    secondary: 'bg-white border border-black text-black hover:bg-gray-100',
    // Add more variants as needed
  };

  const disabledClasses = 'opacity-30 cursor-not-allowed';
  const loadingClasses = 'opacity-50 cursor-wait';

  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${disabled || loading ? disabledClasses : ''}
    ${loading ? loadingClasses : ''}
    ${className}
  `.trim();

  if (!address) {
    return (
      <button
        type={type}
        className={buttonClasses}
        onClick={() => modal.open()}
        style={style}
      >
        Connect Wallet
      </button>
    );
  }

  if (requiredChainId && chainId !== requiredChainId) {
    return (
      <button
        type={type}
        className={buttonClasses}
        onClick={() => switchChain({ chainId: requiredChainId })}
        disabled={isPending || loading}
        style={style}
      >
        Switch Network
      </button>
    );
  }

  return (
    <LendingButton
      type='primary'
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      style={style}
      loading={loading}
    >
      {children}
    </LendingButton>
  );
};

export default Button;