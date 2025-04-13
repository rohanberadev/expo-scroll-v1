import { ImagePickerAsset } from "expo-image-picker";

export const prepareNativeFile = (
  asset: ImagePickerAsset
): { name: string; type: string; size: number; uri: string } => {
  if (!asset) throw new Error("Inavlid asset");
  if (!asset.uri || !asset.mimeType || !asset.fileSize || !asset.fileName) {
    throw new Error(
      "Invalid asset: missing required fields (uri, mimeType, fileSize)"
    );
  }

  return {
    name: asset.fileName,
    type: asset.mimeType,
    size: asset.fileSize,
    uri: asset.uri,
  };
};
