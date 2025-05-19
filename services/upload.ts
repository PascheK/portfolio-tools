import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export async function uploadImage(file: File, path: string): Promise<string> {
  const storage = getStorage();
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

export async function deleteImage(path: string) {
    const storage = getStorage();
  const imageRef = ref(storage, path);
  await deleteObject(imageRef);
}
