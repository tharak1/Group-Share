import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase_config";
import { v4 as uuidv4 } from 'uuid';

const uploadImage = async (image: File, name: string, folder: string) => {
    if (!image) return '';
    const imageRef = ref(storage, `${folder}/${name + uuidv4()}`);
    const snapshot = await uploadBytes(imageRef, image);
    return await getDownloadURL(snapshot.ref);
};

export default uploadImage;