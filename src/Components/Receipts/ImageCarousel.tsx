import React, { useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import { Carousel } from "react-responsive-carousel";
import Button from "../Button";

const MAX_AMOUNT_OF_IMAGES = 4

const ImageCarousel = ({images, setImages}: {images: File[], setImages: React.Dispatch<React.SetStateAction<File[]>>}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files![0];
    if (selectedFile && images.length < 5) {
      setImages([...images, selectedFile]);
    }
}

  const handleRemoveImage = () => {
    const updatedImages = images.filter((_image, index) => index !== selectedImageIndex);
    setImages(updatedImages);
  };

  return (
    <div className="flex items-center flex-col">
      <div className="flex justify-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={images.length >= MAX_AMOUNT_OF_IMAGES}
        />
        {images.length >= MAX_AMOUNT_OF_IMAGES ?
          <p>Maximum of {MAX_AMOUNT_OF_IMAGES} images reached.</p>
          :
          null
        }
      </div>
      <Carousel
        className="w-[100%] md:w-[300px] max-w-[300px] mt-6"
        selectedItem={selectedImageIndex}
        onChange={(index) => setSelectedImageIndex(index)}
      >
        {images.map((image, index) => (
          <div key={index}>
            <img src={URL.createObjectURL(image)} alt={`Image ${index}`} />
          </div>
        ))}
      </Carousel>
      {images.length > 0 ?
        <div className="flex justify-end">
          <Button color="black" onClick={() => handleRemoveImage()}>Remove</Button>
        </div>
        :
        null
      }
    </div>
  );
};

export default ImageCarousel;