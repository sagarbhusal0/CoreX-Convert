import { removeBackground } from 'rembg-webgpu';

export default async function removeBg(
  file: File,
): Promise<{ url: string; output: string }> {
  const url = URL.createObjectURL(file);

  try {
    const result = await removeBackground(url);

    // result.blobUrl is a blob: URL of the full-resolution transparent PNG
    const outputName = file.name.replace(/\.[^.]+$/, '') + '.png';

    return { url: result.blobUrl, output: outputName };
  } finally {
    // revoke the input object URL (not the output one)
    URL.revokeObjectURL(url);
  }
}
