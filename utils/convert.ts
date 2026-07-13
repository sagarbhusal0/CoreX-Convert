// imports
import { Action } from '@/types';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

function getFileExtension(file_name: string) {
  const regex = /(?:\.([^.]+))?$/; // Matches the last dot and everything after it
  const match = regex.exec(file_name);
  if (match && match[1]) {
    return match[1];
  }
  return ''; // No file extension found
}

function removeFileExtension(file_name: string) {
  const lastDotIndex = file_name.lastIndexOf('.');
  if (lastDotIndex !== -1) {
    return file_name.slice(0, lastDotIndex);
  }
  return file_name; // No file extension found
}

async function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function convertToSvg(file: File, file_name: string): Promise<{ url: string; output: string }> {
  const dataUrl = await fileToDataURL(file);
  const img = await createImageBitmap(file);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${img.width}" height="${img.height}">
  <image href="${dataUrl}" width="${img.width}" height="${img.height}" />
</svg>`;
  img.close();
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const output = removeFileExtension(file_name) + '.svg';
  return { url, output };
}

// MIME types for common image output formats
const outputMime: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
  bmp: 'image/bmp',
};

async function convertViaCanvas(file: File, to: string, file_name: string): Promise<{ url: string; output: string }> {
  const img = await createImageBitmap(file);
  const canvas = new OffscreenCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);
  img.close();
  const blob = await canvas.convertToBlob({ type: outputMime[to] || 'image/png' });
  const url = URL.createObjectURL(blob);
  const output = removeFileExtension(file_name) + '.' + to;
  return { url, output };
}

export default async function convert(
  ffmpeg: FFmpeg,
  action: Action,
): Promise<any> {
  const { file, to, file_name, file_type } = action;
  if (!to) throw new Error('No target format selected');

  const from = getFileExtension(file_name);

  // SVG output — FFmpeg can't encode SVG, embed image in SVG wrapper
  if (to === 'svg') {
    return convertToSvg(file, file_name);
  }

  // SVG input — FFmpeg WASM can't decode SVG (no librsvg)
  if (from === 'svg' && outputMime[to]) {
    return convertViaCanvas(file, to, file_name);
  }

  const input = from;
  const output = removeFileExtension(file_name) + '.' + to;
  ffmpeg.writeFile(input, await fetchFile(file));

  // FFMEG COMMANDS
  let ffmpeg_cmd: any = [];
  // 3gp video
  if (to === '3gp')
    ffmpeg_cmd = [
      '-i',
      input,
      '-r',
      '20',
      '-s',
      '352x288',
      '-vb',
      '400k',
      '-acodec',
      'aac',
      '-strict',
      'experimental',
      '-ac',
      '1',
      '-ar',
      '8000',
      '-ab',
      '24k',
      output,
    ];
  else ffmpeg_cmd = ['-i', input, output];

  // execute cmd
  await ffmpeg.exec(ffmpeg_cmd);

  const data = (await ffmpeg.readFile(output)) as any;
  const blob = new Blob([data], { type: file_type.split('/')[0] });
  const url = URL.createObjectURL(blob);
  return { url, output };
}
