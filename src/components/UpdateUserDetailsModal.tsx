import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { UserModel } from '../models/AllModel';
import { serverString } from '../models/ServerString';
import axios from 'axios';
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { useSelector } from 'react-redux';
import { GetUser } from '../redux/UserSlice';

interface UpdateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const UpdateUserModal: React.FC<UpdateUserModalProps> = ({ isOpen, onClose }) => {
    const [visible, setVisible] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [p1, setP1] = useState<string>("");
    const [p2, setP2] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [userData, setUserData] = useState<UserModel>({
        _id: '',
        name: '',
        email: '',
        phoneNo: '',
        password: '',
        isAdmin: true,
        joinedGroups: []
    });
    const user = useSelector(GetUser);

    useEffect(() => {
        setUserData(user);
        setP1(user.password);
        setP2(user.password);
        setError('')
    }, [user]);

    const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (p1 === p2) {
            setLoading(true);
            const Url = `${serverString}/api/user/updateUserDetails?id=${user._id}`
            try {
                const response = await axios.post(Url, { ...userData, password: p1 });
                if (response.status === 200) {
                    setLoading(false);
                    onClose();
                } else {
                    setError('Something went wrong');
                }
            } catch (error: any) {
                setError(error.toString());
            }
        } else {
            setError("Passwords don't match!!");
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
                    <div className="flex min-h-full items-center justify-center p-4 text-center dark:bg-slate-600">
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
                                    <div className="flex flex-col items-center justify-center py-8 mx-auto lg:py-0 dark:bg-slate-600">
                                        <div className="w-full rounded-lg md:mt-0 sm:max-w-md xl:p-0 dark:bg-slate-600">
                                            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                                                <form className="space-y-4 md:space-y-6" onSubmit={handleCreateUser}>
                                                    <div>
                                                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your name</label>
                                                        <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your Name" required value={userData.name} onChange={(e) => { setUserData({ ...userData, name: e.target.value }) }} />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                                        <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required value={userData.email} onChange={(e) => { setUserData({ ...userData, email: e.target.value }) }} />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="contactNo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contact Number</label>
                                                        <input type="tel" name="contactNo" id="contactNo" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="123-456-7890" required value={userData.phoneNo} onChange={(e) => { setUserData({ ...userData, phoneNo: e.target.value }) }} />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                                        <div className='relative'>
                                                            <input type={visible ? "text" : "password"} name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required value={p1} onChange={(e) => { setP1(e.target.value) }} />
                                                            <button
                                                                type="button"
                                                                className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-600"
                                                                onClick={() => { setVisible(!visible) }}
                                                            >
                                                                {visible ? (
                                                                    <IoIosEye size={24} />
                                                                ) : (
                                                                    <IoIosEyeOff size={24} />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                                                        <div className='relative'>
                                                            <input type={confirmVisible ? "text" : "password"} name="confirmPassword" id="confirmPassword" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required value={p2} onChange={(e) => { setP2(e.target.value) }} />
                                                            <button
                                                                type="button"
                                                                className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-600"
                                                                onClick={() => { setConfirmVisible(!confirmVisible) }}
                                                            >
                                                                {confirmVisible ? (
                                                                    <IoIosEye size={24} />
                                                                ) : (
                                                                    <IoIosEyeOff size={24} />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    {
                                                        !loading && error !== '' ? (<p className="text-center text-red-500"> {error}</p>) : (
                                                            <p></p>
                                                        )
                                                    }
                                                    <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" >
                                                        {
                                                            loading ? (
                                                                <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                                </svg>
                                                            ) : (
                                                                "Update"
                                                            )
                                                        }
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

export default UpdateUserModal;
