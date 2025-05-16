import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function uploadImage(file: File, path: string): Promise<string> {
  const storage = getStorage();
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}
