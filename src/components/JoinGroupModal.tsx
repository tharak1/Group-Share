import React, { Fragment, useEffect, useState } from 'react'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { Group, UserModel } from '../models/AllModel';
import { serverString } from '../models/ServerString';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { GetUser } from '../redux/UserSlice';

interface JoinGroupModalProps{
    isOpen: boolean;
    onClose: () => void;
}


const JoinGroupModal:React.FC<JoinGroupModalProps> = ({isOpen,onClose}) => {
    const [loading,setLoading] = useState<boolean>(false);
    const [groupData,setGroupData] = useState<Group[] | null>(null);
    const [error,setError] = useState<string>('');
    const user = useSelector(GetUser) as UserModel;
    useEffect(() => {
        if (isOpen) {
            setLoading(false);
            getGroupData();
        }
    }, [isOpen]);



    const getGroupData = async() =>{
        setLoading(true);
        const url = `${serverString}/api/user/getAllGroups`;
        const response = await axios.get(url);
        if(response.status === 200){
            setGroupData(response.data);
        setLoading(false);

        }
        else{
            setError("something went wrong");
        }
    }

    const handleJoin = async(id:string)=>{
        setLoading(true);
        const url = `${serverString}/api/user/joinGroup?userId=${user._id}&groupId=${id}`;
        const response = await axios.get(url);
        if(response.status === 200){
            setLoading(false);
        onClose();
        }
        else{
            setError("something went wrong");
        }
    }
    
  return (
<Transition appear show={isOpen} as={Fragment}>
    <Dialog as="div" className="relative z-10" onClose={onClose}>
        <TransitionChild
            as={Fragment}
            enter="ease-out duration-300" 
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
            <div className="flex h-screen items-center justify-center p-4 text-center dark:bg-slate-600">
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl p-2 text-left align-middle shadow-xl transition-all bg-gray-50 dark:bg-slate-600">
                        <section>
                            {
                                loading?(
                                    <div className='w-full h-full flex justify-center items-center'>
                                        <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                        </svg>
                                    </div>
                                ):error === ""?(
                                    <>
                                    {
                                        groupData?.map((group) => (
                                            <div className='w-full rounded-md bg-slate-100 dark:bg-slate-700 flex flex-row items-center justify-between p-3 my-2 hover:cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-500' key={group._id}>
                                                <div className='flex flex-row justify-start items-center'>
                                                    <img className="w-12 h-12 rounded-full" src={group.groupProfile} alt="group avatar"/>
                                                    <h2 className='ml-2 dark:text-white'>{group.groupName}</h2>
                                                </div>
                                                <div>
                                                    {user.joinedGroups?.some(joinedGroup => joinedGroup.groupId === group._id) ? (
                                                        <button className='py-1 px-4 bg-gray-500 rounded-md cursor-not-allowed' disabled>Joined</button>
                                                    ) : (
                                                        <button className='py-1 px-4 bg-green-500 hover:bg-green-400 rounded-md' onClick={() => { handleJoin(group._id!) }}>Join</button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    }
                                    </>
                                ):(
                                    <div className='w-full h-full flex justify-center items-center'>
                                        <h2>{error}</h2>
                                    </div>                                   
                                )
                            }

                        </section>
                    </DialogPanel>
                </TransitionChild>
            </div>
        </div>
    </Dialog>
</Transition>
  )
}

export default JoinGroupModal
