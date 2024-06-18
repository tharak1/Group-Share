import React, { useEffect, useRef, useState } from 'react'
import { CiMenuKebab } from "react-icons/ci";
import { Group, GroupContent, UserModel } from '../models/AllModel';
import axios from 'axios';
import { serverString } from '../models/ServerString';
import { FaFileUpload } from "react-icons/fa";
import UploadFileModal from './UploadFileModal';
import { LuTimerReset } from "react-icons/lu";
import TimeFIleUploadModal from './TimeFIleUploadModal';
import FileCard from './FileCard';
import { useAppDispatch } from '../redux/PersistanceStorage';
import { fetchUserData } from '../redux/UserSlice';
import FileCard2 from './FileCard2';
import { Socket } from 'socket.io-client';
import { format } from 'date-fns';
import { IoMdArrowRoundBack } from "react-icons/io";
import { toggleDrawer } from '../redux/DrawerSlice';

interface ChatDispayProps{
    user:UserModel;
    groupId:string;
    socket:Socket;
}

const ChatDispay:React.FC<ChatDispayProps> = ({user,groupId,socket}) => {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [isAddGroupOpen, setAddGroupOpen] = useState<boolean>(false);
    const [isTimeGroupOpen, setTimeGroupOpen] = useState<boolean>(false);
    const [showDropdown, setShowDropDown] = useState<boolean>(false);
    const [showUsers, setShowUsers] = useState<boolean>(false);
    const [showScheduled, setShowScheduled] = useState<boolean>(false);
    const [groupData, setGroupData] = useState<Group>({
        _id: '',
        groupAdminID: '',
        groupName: '',
        groupProfile: '',
        groupMembers: [],
        groupContent: [],
        timedGroupContent: []
    });
    const [fileData,setFileData] = useState<GroupContent>({  
        title: '',
        sentBy: user._id!,
        fileAddress: '',
        otherData:'',
        dateSent: '',
      });
      const contentRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
          // Scroll to the bottom when groupData or showScheduled changes
          if (contentRef.current) {
              contentRef.current.scrollTop = contentRef.current.scrollHeight;
          }
      }, [groupData, showScheduled]);


    const handleCreateNewGroup = () => {
        setAddGroupOpen(true);
    }

    const addGroupClose = () => {
        setAddGroupOpen(false);
        getGroupData();
        socket.emit("message", { message:fileData.otherData, room: groupId });
    }

    const handleCreateTimeGroup = () => {
        setTimeGroupOpen(true);
    }

    const addTimeClose = () => {
        setTimeGroupOpen(false);
        getGroupData();
    }

    useEffect(() => {
        getGroupData();
        joinRoomHandler();
    }, [groupId]);

    const getGroupData = async () => {
        setLoading(true);
        const url = `${serverString}/api/user/getGroupData?groupId=${groupId}`;
        const response = await axios.get(url);
        if (response.status === 200) {
            setGroupData(response.data);
        } else {
            setError("something went wrong");
        }
        setLoading(false);
    }

    const deleteGroup = async () => {
        const url = `${serverString}/api/user/deleteGroup?groupId=${groupId}`;
        const response = await axios.get(url);
        if (response.status === 200) {
            dispatch(fetchUserData());
        }
    }

    const leaveGroup = async () => {
        const url = `${serverString}/api/user/leaveGroup?userId=${user._id}&groupId=${groupId}`;
        const response = await axios.get(url);
        if (response.status === 200) {
            dispatch(fetchUserData());
        }
    }


    const removeFromGroup = async (id:string) => {
        const url = `${serverString}/api/user/leaveGroup?userId=${id}&groupId=${groupId}`;
        const response = await axios.get(url);
        if (response.status === 200) {
            dispatch(fetchUserData());
            getGroupData();
        }

    }

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formattedDate = format(new Date(), 'dd-MM-yyyy, EEEE - HH:mm');
        const url = `${serverString}/api/user/createFileUploadNow?groupId=${groupId}`;
      
        const response = await axios.post(url,{...fileData,dateSent:formattedDate,title:' ',fileAddress:"none"});

        if(response.status === 200){
            socket.emit("message", { message:fileData.otherData, room: groupId });
            setFileData({
                title: '',
                sentBy: user._id!,
                fileAddress: '',
                otherData:'',
                dateSent: '',
            });
        getGroupData();

        }
    };

    const joinRoomHandler = () => {
        socket.emit("join-room", groupId);
    };

    useEffect(() => {
        const handleConnect = () => {
            console.log("connected", socket.id);
        };

        const handleReceiveMessage = (data: any) => {
            console.log(data);
            getGroupData();
        };

        socket.on("connect", handleConnect);
        socket.on("receive-message", handleReceiveMessage);

        return () => {
            socket.off("connect", handleConnect);
            socket.off("receive-message", handleReceiveMessage);
        };
    }, [socket]);

    const handleToggle = () => {
        dispatch(toggleDrawer());
      };

  return (
    <>

    {
        error === ''?loading?(
            <div className='col-span-2 lg:row-span-10 lg:h-full max-lg:h-screen w-full flex justify-center items-center bg-gray-200 shadow-sm dark:bg-gray-600 dark:text-gray-200  rounded-md'>
                <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
            </div>
        ):(
            <>
                <div className='col-span-2 row-span-1 w-full rounded-t-md bg-gray-100 shadow-sm dark:bg-slate-600 flex flex-row justify-between lg:p-3'>
                    <div className='flex flex-row items-center'>
                        <div className='lg:hidden relative flex items-center justify-center h-10 w-10 rounded-full mr-3 hover:cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-500'onClick={handleToggle} >
                            <IoMdArrowRoundBack size={24}/>
                        </div>
                        <img className="w-12 h-12 rounded-full" src={groupData?.groupProfile} alt="Rounded avatar"/>
                        <div className='flex flex-col'>
                            <h2 className='ml-2 dark:text-white'>{groupData?.groupName}</h2>
                            <p className='ml-2 text-gray-400 text-sm hover:cursor-pointer' onClick={()=>{setShowUsers(!showUsers)}}>{showUsers?"Tab to go Chat":"Tap to show Users"} </p>
                        </div>
                    </div>
                    <div className='flex flex-row justify-center items-center'>


                    <div className='relative flex items-center justify-center h-10 w-10 rounded-full mr-3 hover:cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-500' onClick={()=>{setShowDropDown(!showDropdown)}}>
                        <CiMenuKebab size={20}/>
                        <div id="dropdown" className={`absolute z-10 lg:bottom-[-100px] max-lg:bottom-[-110px]  lg:right-[-20px] max-lg:right-[-6px] ${showDropdown?"":"hidden"} bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}>
                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                                {
                                    user.isAdmin?(
                                        <>
                                            <li>
                                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-400 text-gray-400 dark:hover:text-gray-600" onClick={()=>{setShowScheduled(!showScheduled)}}>{showScheduled?"Show sent":"Show Scheduled"}</a>
                                            </li>
                                            <li>
                                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-red-400 text-red-400 dark:hover:text-gray-600" onClick={deleteGroup}>Delete group</a>
                                            </li>
                                        </>
                                    ):(
                                        
                                        <li>
                                            <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-red-400 dark:hover:text-red-600"onClick={leaveGroup} >Exit Group</a>
                                        </li>
                                    )
                                }
                            </ul>
                        </div>
                    </div>
                    </div>
                </div>
                {
                    showUsers?(
                        <div className={`row-start-2 row-span-9 rounded-b-md col-span-2 bg-white h-full overflow-auto dark:bg-slate-500`}>
                            {
                                groupData?.groupMembers.map((obj)=>(
                                    <div className='w-full border-b-2 flex flex-row justify-between items-center p-5 dark:text-white'>
                                    
                                        <div>
                                            <h2>Name : {obj.name}</h2>
                                            <h2>Ph.No : {obj.phoneNo}</h2>
                                            <h2>email : {obj.email}</h2>
                                        </div>

                                        {
                                            user.isAdmin &&(
                                                <div>
                                                <button className='py-1 px-4 bg-red-500 rounded-md ' onClick={()=>{removeFromGroup(obj.userID)}} >Delete</button>
                                            </div>
                                            )
                                        }
                                        
                                    </div>
                                ))
                            }
                        </div>
                    ):(        
                <>
<div
            ref={contentRef}
            className={`row-start-2 ${
                user.isAdmin ? 'row-span-8 max-lg:row-span-10' : 'row-span-9 max-lg:row-span-11 rounded-b-md'
            } col-span-2 bg-white h-full overflow-auto dark:bg-slate-500`}
        >
            {showScheduled
                ? groupData?.timedGroupContent.map((obj, index) => (
                      <div className="h-fit w-full flex flex-row justify-end items-end p-4" key={index}>
                          <FileCard2 chat={obj} />
                      </div>
                  ))
                : groupData?.groupContent.map((obj, index) => (
                      <div className="h-fit w-full flex flex-row justify-end items-end p-4" key={index}>
                          <FileCard chat={obj} />
                      </div>
                  ))}
        </div>

                       
                    <div className='row-start-10 row-span-1 h-full max-lg:row-start-12 col-span-2 '>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="chat" className="sr-only">Your message</label>
                            <div className="flex items-center py-2.5 px-3 bg-gray-100 rounded-lg dark:bg-slate-600">
                                <button type="button" className="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600" onClick={handleCreateNewGroup} >
                                    <FaFileUpload size={24}/>
                                </button>

                                <button type="button" className="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600" onClick={handleCreateTimeGroup} >
                                    <LuTimerReset size={24}/>
                                </button>

                                <textarea id="chat" rows={1} className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your message..." value={fileData.otherData} onChange={(e)=>{setFileData({...fileData,otherData:e.target.value})}}></textarea>
                                    <button type="submit" className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
                                    <svg className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                                </button>
                            </div>
                        </form>
                    </div>
                
                </>
            )
        }
            </>
        ):
        (
            <>
                <div className='col-span-2 row-span-10 h-full w-full flex justify-center items-center bg-gray-100 shadow-sm dark:bg-slate-500 dark:text-gray-200  rounded-md'>
                    <h1 className='text-2xl font-semibold'>Something went wrong</h1>
                </div>
            </>
        )
    }
    <UploadFileModal isOpen = {isAddGroupOpen} onClose={addGroupClose} groupId={groupId}/>
    <TimeFIleUploadModal isOpen = {isTimeGroupOpen} onClose={addTimeClose} groupId={groupId}/>
    </>
  )
}

export default ChatDispay
