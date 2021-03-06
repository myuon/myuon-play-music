import {
  getBlob,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
  uploadString,
} from "firebase/storage";
import useSWR from "swr";
import { storage } from "./firebase";
import { Metadata, parseMetadataFromFile } from "../model/Metadata";
import { MusicFile } from "../model/MusicFile";

export const useDownloadUrl = (key: string | undefined) => {
  return useSWR(key ? ["downloadUrl", key] : null, async () => {
    const storageKey = ref(storage, key);
    return await getDownloadURL(storageKey);
  });
};

export const useListAll = (key: string) => {
  return useSWR<MusicFile[]>(["listAll", key], async () => {
    const storageKey = ref(storage, key);
    return await (await listAll(storageKey)).items
      .map((item) => ({ fullPath: item.fullPath, name: item.name }))
      .filter((item) => !item.fullPath.endsWith(".metadata"));
  });
};

export const useFetchMetadata = (key: string | undefined) => {
  return useSWR(key ? ["fetchMetadata", key] : null, async () => {
    const storageKey = ref(storage, `${key}.metadata`);
    const blob = await getBlob(storageKey);
    return JSON.parse(await blob.text()) as Metadata;
  });
};

export const uploadMusicFile = async (userId: string, file: File) => {
  const snapshot = await uploadBytes(
    ref(storage, `/user/${userId}/${file.name}`),
    file
  );
  console.log(`File uploaded`, snapshot);

  const metadata = await parseMetadataFromFile(file);
  const snapshotMetadata = await uploadString(
    ref(storage, `/user/${userId}/${file.name}.metadata`),
    JSON.stringify(metadata)
  );
  console.log(`Metadata uploaded`, snapshotMetadata);
};
