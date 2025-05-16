import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { LogOut } from 'lucide-react';
import React from 'react';

interface AvatarMenuProps {
    userName?: string;
    imageUrl?: string;
}

export const AvatarMenu: React.FC<AvatarMenuProps> = ({
    userName = 'luan',
    imageUrl = './src/assets/logo.jpg',
}) => {
    return (
        <Popover className="relative">
            <PopoverButton className="flex items-center gap-2 group">
                <img
                    src={imageUrl}
                    alt="Avatar"
                    className="w-15 h-15 rounded-full group-hover:scale-110 transition-transform duration-200"
                />
                <span className="text-sm font-medium">{userName}</span>
            </PopoverButton>

            <PopoverPanel
                anchor="bottom"
                className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-md p-2 z-10"
            >
                <a
                    href="/analytics"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                >
                    Analytics
                </a>
                <a
                    href="/engagement"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                >
                    Engagement
                </a>
                <a
                    href="/security"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                >
                    Security
                </a>
                <a
                    href="/logout"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                >
                    <LogOut size={16} />
                    Logout
                </a>
            </PopoverPanel>
        </Popover>
    );
};
