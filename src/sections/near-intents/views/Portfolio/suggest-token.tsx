"use client";
import { useState } from 'react';
import Modal from '@/components/modal';
import { post } from '@/utils/http';
import useUser from '@/hooks/use-user';
import useToast from '@/hooks/use-toast';
import Loading from '@/components/loading';

interface SuggestTokenModalProps {
    open: boolean;
    onClose: () => void;
}

export default function SuggestTokenModal({ open, onClose }: SuggestTokenModalProps) {
    const [formData, setFormData] = useState({
        tokenName: '',
        chain: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);
    const { userInfo } = useUser();
    const toast = useToast();

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        if (!formData.tokenName || !formData.chain || !formData.address) {
            console.log('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const res = await post('/api/go/bintent/suggestToken', {
                token_address: formData.address,
                chain: formData.chain,
                token_name: formData.tokenName,
                address: userInfo.address
            });

            if (res.code === 200) {
                toast.success({
                    title: 'Suggest token successful',
                });
            } else {
                toast.fail({
                    title: 'Suggest token failed',
                    text: res.message,
                });
            }

            setFormData({
                tokenName: '',
                chain: '',
                address: ''
            });
            onClose();
        } catch (error) {
            toast.fail({
                title: 'Suggest token failed',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            tokenName: '',
            chain: '',
            address: ''
        });
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            isShowCloseIcon={false}
            className="flex items-center justify-center"
            innerClassName="w-[480px] bg-[#FFFDEB] rounded-[40px] shadow-lg border border-black"
        >
            <div className="p-[30px] relative">
                <button
                    onClick={handleClose}
                    className="absolute top-[-5px] right-[-5px] w-[32px] h-[32px] flex items-center justify-center cursor-pointer"
                >
                    <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_d_25578_8829)">
                            <circle cx="15" cy="15" r="13" fill="#E9E3B5" />
                            <circle cx="15" cy="15" r="14" stroke="black" stroke-width="2" stroke-linejoin="round" />
                        </g>
                        <path d="M16.444 15L19.7799 11.6642C20.0307 11.4133 20.0735 11.0494 19.8756 10.8516L19.1482 10.1242C18.9503 9.92632 18.5869 9.96974 18.3356 10.2204L15.0001 13.5561L11.6643 10.2205C11.4135 9.96941 11.0496 9.92632 10.8517 10.1245L10.1243 10.8519C9.92648 11.0495 9.96931 11.4134 10.2205 11.6642L13.5563 15L10.2205 18.336C9.96973 18.5866 9.92631 18.9503 10.1243 19.1482L10.8517 19.8756C11.0496 20.0735 11.4135 20.0306 11.6643 19.7799L15.0003 16.4439L18.3357 19.7794C18.587 20.0307 18.9504 20.0735 19.1483 19.8756L19.8757 19.1482C20.0735 18.9503 20.0307 18.5866 19.78 18.3356L16.444 15Z" fill="black" />
                        <defs>
                            <filter id="filter0_d_25578_8829" x="0" y="0" width="33" height="33" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dx="3" dy="3" />
                                <feComposite in2="hardAlpha" operator="out" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_25578_8829" />
                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_25578_8829" result="shape" />
                            </filter>
                        </defs>
                    </svg>

                </button>

                <div className="text-center mb-[20px]">
                    <h2 className="text-black font-bold text-[24px] mb-[15px]">Suggest a Token</h2>

                    <div className="bg-[#FFDC50] rounded-[12px] px-[20px] py-[12px]">
                        <p className="text-black text-[14px] font-medium">
                            Your favorite token isn't here yet? Suggest it now
                        </p>
                    </div>
                </div>

                <div className="space-y-[20px]">
                    {/* Token Name */}
                    <div>
                        <label className="block text-black font-medium text-[16px] mb-[8px]">
                            Token name
                        </label>
                        <input
                            type="text"
                            value={formData.tokenName}
                            onChange={(e) => handleInputChange('tokenName', e.target.value)}
                            placeholder="Enter token name"
                            className="w-full px-[16px] py-[12px] bg-white border border-black rounded-[12px] text-[14px] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Chain */}
                    <div>
                        <label className="block text-black font-medium text-[16px] mb-[8px]">
                            Chain
                        </label>
                        <input
                            type="text"
                            value={formData.chain}
                            onChange={(e) => handleInputChange('chain', e.target.value)}
                            placeholder="Enter chain name"
                            className="w-full px-[16px] py-[12px] bg-white border border-black rounded-[12px] text-[14px] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-black font-medium text-[16px] mb-[8px]">
                            Address
                        </label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            placeholder="Enter token contract address"
                            className="w-full px-[16px] py-[12px] bg-white border border-black rounded-[12px] text-[14px] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                <div className="mt-[30px] text-center">
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !formData.chain || !formData.address}
                        className="bg-[#FFD700] hover:bg-[#FFC700] w-full border border-black disabled:cursor-not-allowed text-black font-bold text-[18px] px-[40px] py-[12px] rounded-[12px] shadow-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none"
                    >
                        {loading ? (
                            <>
                                <Loading size={18}/>
                                 Submitting...
                            </>
                        ) : (
                            'Submit'
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
} 