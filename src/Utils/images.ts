const convertImagesToBase64 = async (images: File[]) => {
    const promises = images.map(async (image) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          resolve(reader.result as string);
        };

        reader.onerror = reject;

        reader.readAsDataURL(image);
      });
    });

    return await Promise.all(promises);
};

export {convertImagesToBase64}