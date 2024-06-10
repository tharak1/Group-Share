import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Theme, toggleTheme } from '../redux/ThemeSlice';
import { useNavigate } from 'react-router-dom';
import { UserModel } from '../models/AllModel';
import { removeUser } from '../redux/UserSlice';
import { toggleDrawer } from '../redux/DrawerSlice';
import UpdateUserModal from './UpdateUserDetailsModal';
interface NavbarProps{
    user:UserModel;
}

function formatDate(date:Date) {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    const ordinalSuffix = (n:number) => {
        const s = ["th", "st", "nd", "rd"],
            v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }

    return `${ordinalSuffix(day)} ${month} ${year}`;
}

const Navbar:React.FC<NavbarProps> = ({user}) => {
    const [openm,setOpenm] = useState<boolean>(false);
    const theme = useSelector(Theme);
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const handleToggleTheme = () => {
        dispatch(toggleTheme());
    };

    const handleToggle = () => {
        dispatch(toggleDrawer());
      };
    
    const handleLogout = () =>{
        dispatch(removeUser());
        localStorage.clear();
        navigate('/')
    }

    const [isDeleteAdminOpen, setDeleteAdminOpen] = useState<boolean>(false);

    const handleCreateNewAdmin = () => {
        setDeleteAdminOpen(true);
    }

    const addAdminClose = () => {
        setDeleteAdminOpen(false);
    }

  return (
<>
<div className="w-full flex flex-row justify-between items-center bg-gray-100 dark:bg-slate-600 shadow-md p-3">
        <div>
            <div className="flex items-center text-2xl font-semibold text-gray-900 dark:text-white hover:cursor-pointer " onClick={handleToggle}>
                <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo"/>
                AutoDS    
            </div>
            <p className="text-sm dark:text-white">Automation data delivery system</p>
            <p className='dark:text-white'>
                {formatDate(new Date())}
            </p>
        </div>
        <div className="flex flex-row dark:text-white">
            
            <label className="inline-flex items-center cursor-pointer ">
            <input type="checkbox" value="" className="sr-only peer" checked={theme === 'dark'} onChange={handleToggleTheme}/>
            <div className="mr-4 relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>

            <div className="relative flex justify-between items-center hover:cursor-pointer" onClick={()=>{setOpenm(!openm)}}>
                <img src="https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png" alt="user image" className="h-10 w-10 rounded-full bg-slate-50 border-2 mr-2"/>
                <div className='max-lg:hidden flex flex-col items-end'>
                    <h1>{user.name}</h1>
                    <h1>{user.email}</h1>
                </div>

                <div className={`absolute top-[65px] right-[-10px] ${openm?"":"hidden"} w-[300px] z-10 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-5`}>
                    <div className="w-full flex flex-col items-center justify-center pb-10">
                        <img className="w-fit h-24 mb-3 rounded-full shadow-lg" src="https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png" alt="Bonnie image"/>
                        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{user.name}</h5>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{user.email}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{user.phoneNo}</span>

                        <div className="flex justify-center items-center mt-4 md:mt-6">
                            {
                                user.isAdmin&&(
                                    <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" disabled={true}>Admin</button>

                                )
                            }
                            <button className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-blue-400 rounded-lg border border-gray-200 hover:bg-red-600 hover:text-black-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-blue-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-red-700" onClick={handleCreateNewAdmin}>Edit</button>
                            
                            <button className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-red-400 rounded-lg border border-gray-200 hover:bg-red-600 hover:text-black-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-red-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-red-700" onClick={handleLogout}>LogOut</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <UpdateUserModal isOpen={isDeleteAdminOpen} onClose={addAdminClose}/>
</>
  )
}

export default Navbar;
