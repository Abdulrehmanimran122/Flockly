import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { BellIcon, HomeIcon, Radar, UserIcon } from 'lucide-react';
import { getFriendRequests } from '../lib/api';
import { useQuery } from '@tanstack/react-query';
import useAuthUser from '../hooks/useAuthUser';


const Sidebar = () => {
    const { authUser } = useAuthUser();
    const location = useLocation();
    const currentPath = location.pathname;
    const [hasViewedNotifications, setHasViewedNotifications] = useState(false);
    const [prevNotificationCount, setPrevNotificationCount] = useState(0);

    const { data: friendRequests } = useQuery({
        queryKey: ["friendRequests"],
        queryFn: getFriendRequests,
        onSuccess: (data) => {
            const newCount = data.incomingReqs.length;

            if (newCount > prevNotificationCount) {
                setHasViewedNotifications(false);
            };
            setPrevNotificationCount(newCount);
        },
    });
    useEffect(() => {
        if (location.pathname !== '/notifications') {
            setHasViewedNotifications(false);
        };
    }, [location.pathname]);
    const incomingRequests = friendRequests?.incomingReqs || [];

    return <aside className='w-64 bg-base-200 broder-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0'>

        <div className='p-5 border-b border-base-300'>
            <Link to="/" className='flex items-center gap-2.5'>
                <div className='mb-4 flex items-center justify-start gap-2 '>
                    <Radar className="size-9 text-primary" />
                    <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                        Flockly
                    </span>
                </div>
            </Link>
        </div>

        <nav className='flex-1 p-4 space-y-1'>
            <Link to="/"
                className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentPath === "/" ? "btn-active" : ""}`}
            >
                <HomeIcon className='size-5 text-base-content opacity-70' />
                <span>Home</span>
            </Link>
            <Link to="/friends"
                className={`btn btn-ghost justify-start w-full gap-3 mt-4 px-3 normal-case ${currentPath === "/friends" ? "btn-active" : ""}`}
            >
                <UserIcon className='size-5 text-base-content opacity-70' />
                <span>Friends</span>
            </Link>


            <Link
                to="/notifications"
                className={`btn btn-ghost justify-start w-full gap-3 mt-4 px-3 normal-case ${currentPath === "/notifications" ? "btn-active" : ""}`}
                onClick={() => setHasViewedNotifications(true)}
            >
                <div>
                    <BellIcon className='size-5 text-base-content opacity-70' />
                    <div className='absolute'>
                        <div className='relative bottom-[35px] -left-0.5'>
                            {incomingRequests.length > 0 && !hasViewedNotifications && (
                                <span className="badge badge-primary badge-xs ml-2">
                                    {incomingRequests.length}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <span>Notifications</span>
            </Link>

        </nav>


        {/* User Profile Section */}

        <div className='p-4 border-t border-base-300 mt-auto'>
            <div className='flex items-center gap-3'>
                <div className='avatar'>
                    <div className='w-10 rounded-full'>
                        <img src={authUser?.profilePic} alt="User image" />
                    </div>
                </div>
                <div className='flex-1'>
                    <p className='font-semibold text-sm'>{authUser?.fullName}</p>
                    <p className='text-sm text-success flex items-center gap-1'>
                        <span className='size-2 rounded-full bg-success inline-block' />
                        Online
                    </p>
                </div>
            </div>
        </div>
    </aside>
}

export default Sidebar