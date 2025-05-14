import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getFriendRequests, LogOut } from '../lib/api';
import { BellIcon, LogOutIcon, Radar, X } from 'lucide-react';
import ThemeSelector from '../Components/ThemeSelector';
import useAuthUser from '../hooks/useAuthUser.js';

const Navbar = () => {
    const { authUser } = useAuthUser();
    const location = useLocation();
    const isChatPage = location.pathname?.startsWith("/chat");
    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: LogOut,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
    });

    const [showProfilePreview, setShowProfilePreview] = useState(false);
    const previewRef = useRef(null);

    // Close preview when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (previewRef.current && !previewRef.current.contains(event.target)) {
                setShowProfilePreview(false);
            };
        };

        if (showProfilePreview) {
            document.addEventListener('mousedown', handleClickOutside);
        };

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showProfilePreview]);

    const { data: friendRequests, isLoading } = useQuery({
        queryKey: ["friendRequests"],
        queryFn: getFriendRequests,
    });
    const incomingRequests = friendRequests?.incomingReqs || [];


    return (
        <>
            <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-end w-full gap-2">
                        {/* LOGO - ONLY IN THE CHAT PAGE */}
                        {isChatPage && (
                            <div className="pl-5">
                                <Link to="/" className="flex items-center gap-2.5">
                                    <Radar className="size-9 text-primary" />
                                    <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
                                        Flockly
                                    </span>
                                </Link>
                            </div>
                        )}
                        <div className="flex items-center gap-3 sm:gap-4 ml-auto">
                            <Link to={"/notifications"}>
                                <button className="btn btn-ghost btn-circle">
                                    <BellIcon className="h-6 w-6 text-base-content opacity-70" />
                                </button>
                                <div className='absolute top-2.5'>
                                    <div className='relative left-2.5'>
                                        {incomingRequests.length > 0 && (
                                            <span className="badge badge-primary badge-xs ml-2">
                                                {incomingRequests.length}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <ThemeSelector />

                        <div className='avatar'>
                            <div
                                className='w-9 rounded-full cursor-pointer hover:opacity-80 transition-opacity'
                                onClick={() => setShowProfilePreview(true)}
                            >
                                <img src={authUser?.profilePic} alt="Profile" />
                            </div>
                        </div>
                        <div className=''>
                            <button className='btn btn-ghost btn-circle' onClick={mutate}>
                                <LogOutIcon className='h-6 w-6 text-base-content opacity-70' />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Profile Picture Preview */}
            {showProfilePreview && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-[5px] bg-opacity-0 z-50 flex items-center justify-center transition-opacity duration-300">
                    <div
                        ref={previewRef}
                        className="relative animate-scale-up"
                    >
                        <button
                            className="absolute -top-[22vh] -right-[37vw] cursor-pointer btn btn-ghost btn-circle hover:btn-secondary p-1 z-10  transition-colors"
                            onClick={() => setShowProfilePreview(false)}
                        >
                            <X className="h-5 w-5 text-white" />
                        </button>
                        <div className="rounded-full p-1 overflow-hidden shadow-2xl"
                            style={{
                                background: 'linear-gradient(135deg, #1FD854 0%, #2DD96B 100%)'
                            }}>
                            <div className="rounded-full overflow-hidden">
                                <img
                                    src={authUser?.profilePic}
                                    alt="Profile Preview"
                                    className="w-80 h-80 object-cover"
                                />
                            </div>
                        </div>
                        {authUser?.fullName && (
                            <div className="text-center mt-4 text-white text-xl font-semibold">
                                {authUser.fullName}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export default Navbar