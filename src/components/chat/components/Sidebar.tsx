import { useState, useEffect, useRef } from 'react';
import IconNewChat from '@public/images/chat/new-chat.svg';
import IconHistory from '@public/images/chat/history.svg';
import IconMore from '@public/images/chat/more.svg';
import IconEdit from '@public/images/chat/edit.svg';
import IconDelete from '@public/images/chat/delete.svg';
import { useChatContext } from '../context/chat-context';
import { fetchChatHistory, fetchChatHistoryList, editChatHistoryItemName, deleteChatHistoryItem } from '../utils/chat-service';
import { useAccount } from 'wagmi';
import { ChatHistory } from '../context/chat-context';
import { useScroll } from '@/components/chat/hooks/useScroll';
import Popover, { PopoverPlacement } from '@/components/popover';
import clsx from 'clsx';

const Sidebar = () => {
  const { containerRef } = useScroll();
  const editPopoverRef = useRef<any>();

  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [showPopover, setShowPopover] = useState(false);
  const [hoverChat, setHoverChat] = useState<string | null>(null);
  const [popoverChat, setPopoverChat] = useState<string | null>(null);
  const [localChatHistories, setLocalChatHistories] = useState<ChatHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");
  const editInputRef = useRef<HTMLInputElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { address } = useAccount();
  
  const { 
    setIsFromHistory,
    setChatMode, 
    setCurrentChatId, 
    updateMessages,
    sessionId,
    setSessionId,
    setChatHistories,
    chatHistories,
    chatMode
  } = useChatContext();

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setShowPopover(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (editingChatId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingChatId]);

useEffect(() => {
  const loadChatHistories = async () => {
    if (address) {
      setIsLoading(true);
      try {
        const response = await fetchChatHistoryList(address);
        if (response && response.data && response.data.length > 0) {
          const sortedHistories = [...response.data].sort((a, b) => {
            return b.timestamp - a.timestamp;
          });
          setLocalChatHistories(sortedHistories);
          setChatHistories(sortedHistories);
        }
      } catch (error) {
        console.error("Get history failed:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setLocalChatHistories([]);
      setActiveChat(null);
      setEditingChatId(null);
      setShowPopover(false);
      setHoverChat(null);
      setPopoverChat(null);
    }
  };

  loadChatHistories();
}, [address, setChatHistories]);
  
useEffect(() => {
  if (chatHistories && chatHistories.length > 0) {
    setLocalChatHistories(chatHistories);
    setActiveChat(sessionId);
  } else if (chatHistories && chatHistories.length === 0) {
    setLocalChatHistories([]);
    setActiveChat(null);
    setEditingChatId(null);
    setShowPopover(false);
    setHoverChat(null);
    setPopoverChat(null);
  }
}, [chatHistories, sessionId]);
  
  const handleNewChat = () => {
    setChatMode('initial');
    setCurrentChatId(null);
    setActiveChat(null);
    setShowPopover(false);
    setIsFromHistory(false);
  };
  
  const handleLoadChat = async (sessionId: string, address: string) => {
    try {
      const messages = await fetchChatHistory(address, sessionId);
      updateMessages(messages);
      setCurrentChatId(sessionId);
      setSessionId(sessionId);
      setChatMode('chat');
      setIsFromHistory(true);
    } catch (error) {
      console.error("load chat history failed:", error);
    }
  };
  
  const decodeTitle = (title: string) => {
    try {
      return decodeURIComponent(title);
    } catch (e) {
      return title; 
    }
  };

  const handleEditChatName = (e: React.MouseEvent, chat: ChatHistory) => {
    e.stopPropagation();
    setShowPopover(false);
    editPopoverRef.current?.onClose();
    setActiveChat(chat.session_id);
    setCurrentChatId(chat.session_id);
    setSessionId(chat.session_id);
    setEditingChatId(chat.session_id);
    setEditTitle(decodeTitle(chat.title));
  };

  const handleSaveChatName = async (sessionId: string) => {
    if (!editTitle.trim()) return;
    
    try {
      await editChatHistoryItemName(sessionId, encodeURIComponent(editTitle.trim()));
      setLocalChatHistories(prevHistories => 
        prevHistories.map(chat => 
          chat.session_id === sessionId 
            ? { ...chat, title: encodeURIComponent(editTitle.trim()) } 
            : chat
        )
      );

      setChatHistories(localChatHistories.map(chat => 
        chat.session_id === sessionId 
          ? { ...chat, title: encodeURIComponent(editTitle.trim()) } 
          : chat
      ));
    } catch (error) {
      console.error("Failed to update chat name:", error);
    } finally {
      setEditingChatId(null);
    }
  };

  const handleTitleInputKeyDown = (e: React.KeyboardEvent, sessionId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveChatName(sessionId);
    }
  };

const handleDeleteChat = async (e: React.MouseEvent, chat: ChatHistory) => {
  e.stopPropagation();
  setShowPopover(false);
  editPopoverRef.current?.onClose();
  
  try {
    await deleteChatHistoryItem(chat.session_id);
    
    const updatedHistories = localChatHistories.filter(
      item => item.session_id !== chat.session_id
    );
    setLocalChatHistories(updatedHistories);
    setChatHistories(updatedHistories);
    
    if (chat.session_id === activeChat) {
      handleNewChat();
    }
  } catch (error) {
    console.error("Delete chat failed:", error);
  }
};


  return (
    <div className="flex h-[566px]" ref={sidebarRef}>
      <div className="w-[260px] flex flex-col h-full px-2">
        <button 
          className={clsx(
            "mt-6 w-full h-[34px] px-2 flex items-center gap-2 py-2 mb-6 rounded-[10px] hover:border border-[#DAD9CD] hover:bg-[#DAD9CD]/30",
            chatMode === 'initial' && "border bg-[#DAD9CD]/30",
          )}
          onClick={handleNewChat}
        >
            <IconNewChat />
            <span className="font-Montserrat font-[700] leading-[13px] text-[13px] text-black/50">New Chat</span>
        </button>

        <div className="flex items-center gap-2 mb-3 px-2">
          <IconHistory />
          <span className="font-Montserrat font-[700] leading-[13px] text-[13px] text-black/50">History</span>
        </div>

        <div ref={containerRef} className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-20">
              <span className="text-sm text-black/50">Loading...</span>
            </div>
          ) : localChatHistories.length > 0 ? (
            localChatHistories.map((chat) => {
              const decodedTitle = decodeTitle(chat.title);
              return (
                <div 
                  key={chat.session_id}
                  className={`relative h-[32px] flex items-center py-1.5 px-[30px] text-sm rounded-lg mb-1 cursor-pointer ${activeChat === chat.session_id  ? 'bg-[#DAD9CD]/30 border border-[#DAD9CD]' : 'hover:bg-[#DAD9CD]/30'}`}
                  onMouseEnter={() => setHoverChat(chat.session_id)}
                  onMouseLeave={() => setHoverChat(null)}
                  onClick={() => {
                    setActiveChat(chat.session_id);
                    if (popoverChat !== chat.session_id) {
                      setShowPopover(false);
                    }
                    if (editingChatId !== chat.session_id) {
                      handleLoadChat(chat.session_id, chat.address);
                    }
                  }}
                >
                  {editingChatId === chat.session_id ? (
                    <input
                      ref={editInputRef}
                      className="w-full max-w-[210px] bg-transparent outline-none font-Montserrat font-[500] leading-[13px] text-[13px] text-black/70"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={() => handleSaveChatName(chat.session_id)}
                      onKeyDown={(e) => handleTitleInputKeyDown(e, chat.session_id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <div className="max-w-[210px] truncate font-Montserrat font-[500] leading-[13px] text-[13px] text-black/50">{decodedTitle}</div>
                  )}

                  {hoverChat === chat.session_id && editingChatId !== chat.session_id && (
                    <Popover
                      ref={editPopoverRef}
                      content={(
                        <div className="w-[174px] bg-white rounded-[10px] border border-[#C7C7C7] shadow-[4px_4px_4px_rgba(0,0,0,0.25)]">
                          <div className="p-[8px_5px]">
                            <button
                              className="font-Montserrat flex items-center gap-2 w-full p-[9px_12px] text-[#471C1C] font-[500] leading-[14px] text-[14px] hover:bg-[#000]/[0.06] rounded-md transition-colors"
                              onClick={(e) => handleEditChatName(e, chat)}
                            >
                              <IconEdit />
                              <span>Edit chat name</span>
                            </button>
                            <button
                              className="font-Montserrat flex items-center gap-2 w-full p-[9px_12px] leading-[14px] font-[500] text-[14px] text-[#FF888A] hover:bg-[#000]/[0.06] rounded-md transition-colors"
                              onClick={(e) => handleDeleteChat(e, chat)}
                            >
                              <IconDelete />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      )}
                      placement={PopoverPlacement.TopRight}
                      contentClassName="!z-[151]"
                      triggerContainerClassName="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClickBefore={async (e) => {
                        e.stopPropagation();
                        setPopoverChat(chat.session_id);
                        return true;
                      }}
                    >
                      <button type="button" className="">
                        <IconMore />
                      </button>
                    </Popover>
                  )}

                  {showPopover && popoverChat === chat.session_id && (
                    <div className="absolute right-[4px] top-[36px] w-[174px] bg-white rounded-[10px] z-10 border border-[#C7C7C7] shadow-[4px_4px_4px_rgba(0,0,0,0.25)]">
                      <div className="p-[8px_5px]">
                        <button 
                          className="font-Montserrat flex items-center gap-2 w-full p-[9px_12px] text-[#471C1C] font-[500] leading-[14px] text-[14px] hover:bg-[#000]/[0.06] rounded-md transition-colors"
                          onClick={(e) => handleEditChatName(e, chat)}
                        >
                          <IconEdit />
                          <span>Edit chat name</span>
                        </button>
                        <button 
                          className="font-Montserrat flex items-center gap-2 w-full p-[9px_12px] leading-[14px] font-[500] text-[14px] text-[#FF888A] hover:bg-[#000]/[0.06] rounded-md transition-colors"
                          onClick={(e) => handleDeleteChat(e, chat)}
                        >
                          <IconDelete />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="flex justify-center items-center h-20"></div>
          )}
        </div>
      </div>
      <div className="w-px h-full mt-[20px] bg-[#392C1D]/10"></div>
    </div>
  );
};

export default Sidebar;