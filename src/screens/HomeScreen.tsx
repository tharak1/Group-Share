import React, { useState, useEffect, useMemo } from 'react'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux';
import { Theme } from '../redux/ThemeSlice';
import { IoMdAdd } from "react-icons/io";
import ChatDispay from '../components/ChatDispay';
import { GetUser, fetchUserData } from '../redux/UserSlice';
import { UserModel, joinedGroupsModel } from '../models/AllModel';
import CreateGroupModal from '../components/CreateGroupModal';
import JoinGroupModal from '../components/JoinGroupModal';
import { RootState, useAppDispatch } from '../redux/PersistanceStorage';
import { io } from "socket.io-client";
import { toggleDrawer } from '../redux/DrawerSlice';
import { serverString } from '../models/ServerString';
import AddAdminMOdal from '../components/AddAdminMOdal';
import { MdDelete } from "react-icons/md";
import DeleteAdminModal from '../components/DeleteAdmin';

const HomeScreen:React.FC = () => {
    const dispatch = useAppDispatch();
    const theme = useSelector(Theme);
    const user = useSelector(GetUser) as UserModel;
    const [selectedGroupIndex, setSelectedGroupIndex] = useState<number | null>(null);
    const [isAddGroupOpen, setAddGroupOpen] = useState<boolean>(false);
    const [isOpen, setIsopen] = useState<boolean>(false);
    const [isAddAdminOpen, setAddAdminOpen] = useState<boolean>(false);
    const [filteredGroups, setFilteredGroups] = useState<joinedGroupsModel[]>(user.joinedGroups || []);
    const [searchInput, setSearchInput] = useState<string>('');
    const [isDeleteAdminOpen, setDeleteAdminOpen] = useState<boolean>(false);

    useEffect(() => {
        setFilteredGroups(user.joinedGroups || []);
    }, [user.joinedGroups]);

    useEffect(()=>{
        dispatch(fetchUserData());
    },[])

    const funOpen = () => {
        setIsopen(true);
    }
    const funColose = async () => {
        await dispatch(fetchUserData());
        setIsopen(false);
    }

    const handleCreateNewGroup = () => {
        setAddGroupOpen(true);
    }

    const addGroupClose = () => {
        setAddGroupOpen(false);
    }

    const handleCreateNewAdmin = () => {
        setAddAdminOpen(true);
    }

    const addAdminClose = () => {
        setAddAdminOpen(false);
    }

    
    const handleDeleteAdmin = () => {
        setDeleteAdminOpen(true);
    }

    const deleteAdminClose = () => {
        setDeleteAdminOpen(false);
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchInput(value);
        if (user.joinedGroups) {
            const filtered = user.joinedGroups.filter(ftt =>
                ftt.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredGroups(filtered);
        }
    };


    const socket = useMemo(
        () =>
          io(serverString, {
            
            path: '/socket',
            reconnection: true,
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
          }),
        []
      );


      const isDrawerOpen = useSelector((state: RootState) => state.drawer.isOpen);

      const handleToggle = () => {
        dispatch(toggleDrawer());
      };
    






    return (
        <div className={theme}>
            <div className='lg:grid grid-cols-1 w-full h-screen max-lg:h-fit lg:grid-rows-8 bg-slate-300 dark:bg-slate-700'>
                <div className={` col-span-1 lg:row-span-1  w-full`}>
                    <Navbar user={user} />
                </div>

                <div className=' col-span-1 lg:row-span-7 grid lg:grid-cols-4 lg:grid-rows-7  w-full gap-3 bg-slate-300 dark:bg-slate-700 lg:p-2.5'>
                    <div className={`${isDrawerOpen?"max-lg:hidden":""} col-span-1 max-lg:h-screen max-lg:w-full lg:row-span-7 max-lg:p-5 dark:bg-slate-600 h-full w-full rounded-md p-2 overflow-auto bg-white`}>
                        <div>
                            <form className="max-lg:w-full lg:max-w-md mx-auto">
                                <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                                <div className="relative max-lg:w-full">
                                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                        </svg>
                                    </div>
                                    <input type="search" value={searchInput} onChange={handleSearch} id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Groups ..." required />
                                    <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                                </div>
                            </form>
                        </div>

                        {
                            user.isAdmin ? (
                                <>
                                    <div className='w-full rounded-md bg-slate-200 dark:bg-slate-700 flex flex-row items-center p-2 my-2 hover:cursor-pointer' onClick={handleCreateNewGroup} >
                                        <div className='h-10 w-10 rounded-full bg-green-300 flex justify-center items-center '>
                                            <IoMdAdd />
                                        </div>
                                        <h2 className='ml-2 dark:text-white'>Create new Group</h2>
                                    </div>
                                    <div className='w-full rounded-md bg-slate-200 dark:bg-slate-700 flex flex-row items-center p-2 my-2 hover:cursor-pointer' onClick={handleCreateNewAdmin} >
                                        <div className='h-10 w-10 rounded-full bg-blue-300 flex justify-center items-center '>
                                            <IoMdAdd />
                                        </div>
                                        <h2 className='ml-2 dark:text-white'>Create new Admin</h2>
                                    </div>
                                    <div className='w-full rounded-md bg-slate-200 dark:bg-slate-700 flex flex-row items-center p-2 my-2 hover:cursor-pointer' onClick={handleDeleteAdmin} >
                                        <div className='h-10 w-10 rounded-full bg-blue-300 flex justify-center items-center '>
                                            <MdDelete />
                                        </div>
                                        <h2 className='ml-2 dark:text-white'>Delete Admins</h2>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className='w-full rounded-md bg-slate-200 dark:bg-slate-700 flex flex-row items-center p-2 my-2 hover:cursor-pointer' onClick={funOpen} >
                                        <div className='h-10 w-10 rounded-full bg-green-300 flex justify-center items-center '>
                                            <IoMdAdd />
                                        </div>
                                        <h2 className='ml-2 dark:text-white'>Join new Group</h2>
                                    </div>
                                </>
                            )
                        }

                        {
                            filteredGroups.map((group, index) => (
                                <div className='w-full rounded-md bg-slate-100 dark:bg-slate-700 flex flex-row items-center p-2 my-2 hover:cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-500' key={group.groupId} onClick={() => { setSelectedGroupIndex(index); handleToggle() }} >
                                    <img className="w-12 h-12 rounded-full" src={group.groupProfile} alt="group avatar" />
                                    <h2 className='ml-2 dark:text-white'>{group.name}</h2>
                                </div>
                            ))
                        }

                    </div>

                    <div className={ `${isDrawerOpen?"":"max-lg:hidden"} col-span-3 lg:row-span-7 grid grid-cols-2 lg:grid-rows-10 max-lg:grid-rows-12 w-full h-full max-lg:h-screen bg-white dark:bg-slate-600 rounded-md`}>
                        {
                            selectedGroupIndex !== null ? (
                                <ChatDispay user={user} groupId={user.joinedGroups![selectedGroupIndex].groupId} socket={socket}/>
                            ) : (
                                <div className='col-span-2 row-span-10 max-lg:h-screen lg:h-full w-full flex justify-center items-center bg-gray-100 shadow-sm dark:bg-slate-500 dark:text-gray-200  rounded-md'>
                                    <h1 className='text-2xl font-semibold'>Select to view group</h1>
                                </div>
                            )
                        }
                    </div>
                </div>

            </div>
            <CreateGroupModal isOpen={isAddGroupOpen} onClose={addGroupClose} />
            <JoinGroupModal isOpen={isOpen} onClose={funColose} />
            <AddAdminMOdal isOpen={isAddAdminOpen} onClose={addAdminClose} />
            <DeleteAdminModal isOpen={isDeleteAdminOpen} onClose={deleteAdminClose}/>
        </div>
    )
}

export default HomeScreen
