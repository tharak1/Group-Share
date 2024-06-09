import React from 'react'
import { TimedGroupContent } from '../models/AllModel';
import { saveAs } from 'file-saver';


interface FileCard2Props{
    chat:TimedGroupContent;
}
const FileCard2:React.FC<FileCard2Props> = ({chat}) => {
    const handleDownload = () => {
        const url = chat.fileAddress;
        saveAs(url, 'downloaded_file'); // Set the desired file name
        };
      return (
    <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">  
            <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">Scheduled on : {chat.dateToBeSentOn}</h5>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{chat.otherData}</p>
        {
            chat.fileAddress !== ""?(
                <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={handleDownload}>
                Download
            </button>
            ):
            (
                <span></span>
            )
        }
    
    </div>
      )
}

export default FileCard2
