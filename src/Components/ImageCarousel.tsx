import { useState } from "react";
import { Carousel } from "react-responsive-carousel";

const ImageCarousel = ({images}: {images: string[]}) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    
    return <Carousel
        className="w-[100vw] md:w-[300px] mt-6"
        selectedItem={selectedImageIndex}
        onChange={(index) => setSelectedImageIndex(index)}
      >
        {images.map((image, index) => (
          <div key={index}>
            <img src={image} height={200} width={200} alt={`Image ${index}`} />
          </div>
        ))}
      </Carousel>

}

export default ImageCarousel