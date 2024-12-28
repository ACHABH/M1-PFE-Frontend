export async function readFile(file: File) {
  return new Promise<ArrayBuffer | string>((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = (e) => {
      const result = e.target?.result ?? "";
      resolve(result);
    };

    fileReader.onerror = reject;
    fileReader.readAsArrayBuffer(file);
  });
}
