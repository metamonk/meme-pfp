import React, { useState, useEffect, useRef } from 'react';
import {
  Carousel,
  CarouselProvider,
  Counter,
  DotsGroup,
  NextButton,
  PrevButton,
  Slide,
} from 'react-simple-headless-carousel';
import { PiCaretRight, PiCaretLeft } from "react-icons/pi";


interface Option {
  src: string;
  alt: string;
}

interface Layer {
  option: Option;
  offsetX: number;
  offsetY: number;
  scale: number;
  rotation: number;
}

const blankOption: Option = { src: '/layers/blank.png', alt: 'Blank' };

const baseOptions: Option[] = [
  { src: '/layers/base/1.png', alt: 'Base 1' },
  { src: '/layers/base/2.png', alt: 'Base 2' },
  { src: '/layers/base/3.png', alt: 'Base 3' },
  { src: '/layers/base/4.png', alt: 'Base 4' },
];

const clothesOptions: Option[] = [
  blankOption,
  { src: '/layers/clothes/1.png', alt: 'Clothes 1' },
  { src: '/layers/clothes/2.png', alt: 'Clothes 2' },
  { src: '/layers/clothes/3.png', alt: 'Clothes 3' },
  { src: '/layers/clothes/4.png', alt: 'Clothes 4' },
  { src: '/layers/clothes/5.png', alt: 'Clothes 5' },
  { src: '/layers/clothes/6.png', alt: 'Clothes 6' },
  { src: '/layers/clothes/7.png', alt: 'Clothes 7' },
  { src: '/layers/clothes/8.png', alt: 'Clothes 8' },
];

const hatOptions: Option[] = [
  blankOption,
  { src: '/layers/hat/1.png', alt: 'Hat 1' },
  { src: '/layers/hat/2.png', alt: 'Hat 2' },
  { src: '/layers/hat/3.png', alt: 'Hat 3' },
  { src: '/layers/hat/4.png', alt: 'Hat 4' },
  { src: '/layers/hat/5.png', alt: 'Hat 5' },
  { src: '/layers/hat/6.png', alt: 'Hat 6' },
  { src: '/layers/hat/7.png', alt: 'Hat 7' },
  { src: '/layers/hat/8.png', alt: 'Hat 8' },
  { src: '/layers/hat/9.png', alt: 'Hat 9' },
  { src: '/layers/hat/10.png', alt: 'Hat 10' },
  { src: '/layers/hat/11.png', alt: 'Hat 11' },
];

const accessoryOptions: Option[] = [
  blankOption,
  { src: '/layers/accessory/1.png', alt: 'Accessory 1' },
  { src: '/layers/accessory/2.png', alt: 'Accessory 2' },
  { src: '/layers/accessory/3.png', alt: 'Accessory 3' },
  { src: '/layers/accessory/4.png', alt: 'Accessory 4' },
  { src: '/layers/accessory/5.png', alt: 'Accessory 5' },
  { src: '/layers/accessory/6.png', alt: 'Accessory 6' },
  { src: '/layers/accessory/7.png', alt: 'Accessory 7' },
  { src: '/layers/accessory/8.png', alt: 'Accessory 8' },
  { src: '/layers/accessory/9.png', alt: 'Accessory 9' },
];

const accessory2Options: Option[] = [
  blankOption,
  { src: '/layers/accessory2/1.png', alt: 'Accessory 2-1' },
  { src: '/layers/accessory2/2.png', alt: 'Accessory 2-2' },
  { src: '/layers/accessory2/3.png', alt: 'Accessory 2-3' },
  { src: '/layers/accessory2/4.png', alt: 'Accessory 2-4' },
  { src: '/layers/accessory2/5.png', alt: 'Accessory 2-5' },
  { src: '/layers/accessory2/6.png', alt: 'Accessory 2-6' },
  { src: '/layers/accessory2/7.png', alt: 'Accessory 2-7' },
  { src: '/layers/accessory2/8.png', alt: 'Accessory 2-8' },
  { src: '/layers/accessory2/9.png', alt: 'Accessory 2-9' },
];

const Generator: React.FC = () => {
  const [layers, setLayers] = useState<Layer[]>([
    { option: baseOptions[0], offsetX: 0, offsetY: 0, scale: 1, rotation: 0 },
    { option: blankOption, offsetX: 0, offsetY: 0, scale: 1, rotation: 0 },
    { option: blankOption, offsetX: 0, offsetY: 0, scale: 1, rotation: 0 },
    { option: blankOption, offsetX: 0, offsetY: 0, scale: 1, rotation: 0 },
    { option: blankOption, offsetX: 0, offsetY: 0, scale: 1, rotation: 0 }, // New accessory layer
  ]);
  const [background, setBackground] = useState<Option | null>(null);
  const [slidesVisible, setSlidesVisible] = useState(2);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [caption, setCaption] = useState('');
  const [captionStyle, setCaptionStyle] = useState({
    fontSize: 20,
    verticalPosition: 70,
  });

  useEffect(() => {
    const handleResize = () => {
      setSlidesVisible(calculateSlidesVisible());
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const drawImage = (src: string, layer: Layer) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(canvas.width / img.width, canvas.height / img.height) * layer.scale;
          const x = canvas.width / 2 + layer.offsetX;
          const y = canvas.height / 2 + layer.offsetY;

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate((layer.rotation * Math.PI) / 180);
          ctx.scale(scale, scale);
          ctx.drawImage(img, -img.width / 2, -img.height / 2);
          ctx.restore();
          resolve();
        };
        img.src = src;
      });
    };

    const drawLayers = async () => {
      // Draw default white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw custom background if it exists
      if (background) {
        await drawImage(background.src, { option: background, offsetX: 0, offsetY: 0, scale: 1, rotation: 0 });
      }

      // Then draw the other layers
      for (const layer of layers) {
        if (layer.option.src && layer.option.src !== '/layers/blank.png') {
          await drawImage(layer.option.src, layer);
        }
      }

      // Draw caption with background band
      if (caption) {
        const bandHeight = captionStyle.fontSize * 1.5;
        const bandY = (canvas.height * captionStyle.verticalPosition) / 100 - bandHeight / 2;

        // Draw semi-transparent black band
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, bandY, canvas.width, bandHeight);

        // Draw caption text in white (fixed color)
        ctx.font = `${captionStyle.fontSize}px Arial`;
        ctx.fillStyle = '#FFFFFF'; // White color (fixed)
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(caption, canvas.width / 2, bandY + bandHeight / 2);
      }
    };

    drawLayers();
  }, [background, layers, caption, captionStyle]);

  const updateLayer = (index: number, updates: Partial<Layer>) => {
    setLayers(prevLayers => 
      prevLayers.map((layer, i) => 
        i === index ? { ...layer, ...updates } : layer
      )
    );
  };

  const calculateSlidesVisible = () => {
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  };

  const renderControlCategory = (
    label: string,
    options: Option[],
    layerIndex: number
  ) => (
    <div className="control-category mb-4 w-full">
      <div className="p-2 bg-gray-100">
        <label className='text-xl font-bold'>{label}</label>
      </div>
      <div className="control-options-container">
        <CarouselProvider total={options.length} infinite={true} slidesVisible={slidesVisible} slideHeight={100}>
          <div className="flex flex-row items-stretch">
            <PrevButton className="bg-black p-2">
              <PiCaretLeft size={24} className="text-white"/>
            </PrevButton>
            <div className="flex-grow overflow-hidden">
              <Carousel wrapperClassName="h-auto w-full bg-gray-100">
                {options.map((option, index) => (
                  <Slide index={index} key={`${option.src}-${index}`}>
                    <div className="h-full flex items-center justify-center p-2 bg-white">
                      <img
                        src={option.src}
                        alt={option.alt}
                        className={`max-w-full max-h-full object-contain cursor-pointer ${
                          layers[layerIndex].option.src === option.src ? 'border-2 border-blue-500' : ''
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Image clicked:', option);
                          updateLayer(layerIndex, { option });
                        }}
                      />
                    </div>
                  </Slide>
                ))}
              </Carousel>
            </div>
            <NextButton className="bg-black p-2">
              <PiCaretRight size={24} className="text-white"/>
            </NextButton>
          </div>
        </CarouselProvider>
      </div>
      {layerIndex !== 0 && (
        <div className="layer-controls p-2 border bg-gray-100">
          <div className="flex flex-col mb-2">
            <label htmlFor={`offsetX-${layerIndex}`}>Horizontal Position:</label>
            <input
              id={`offsetX-${layerIndex}`}
              type="range"
              min={-100}
              max={100}
              value={layers[layerIndex].offsetX}
              onChange={(e) => updateLayer(layerIndex, { offsetX: Number(e.target.value) })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor={`offsetY-${layerIndex}`}>Vertical Position:</label>
            <input
              id={`offsetY-${layerIndex}`}
              type="range"
              min={-100}
              max={100}
              value={layers[layerIndex].offsetY}
              onChange={(e) => updateLayer(layerIndex, { offsetY: Number(e.target.value) })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor={`scale-${layerIndex}`}>Size:</label>
            <input
              id={`scale-${layerIndex}`}
              type="range"
              min={0.1}
              max={2}
              step={0.1}
              value={layers[layerIndex].scale}
              onChange={(e) => updateLayer(layerIndex, { scale: Number(e.target.value) })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor={`rotation-${layerIndex}`}>Rotation:</label>
            <input
              id={`rotation-${layerIndex}`}
              type="range"
              min={-180}
              max={180}
              value={layers[layerIndex].rotation}
              onChange={(e) => updateLayer(layerIndex, { rotation: Number(e.target.value) })}
            />
          </div>
        </div>
      )}
    </div>
  );

  const handleSaveImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const drawImage = (src: string, layer: Layer) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(canvas.width / img.width, canvas.height / img.height) * layer.scale;
          const x = canvas.width / 2 + layer.offsetX;
          const y = canvas.height / 2 + layer.offsetY;

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate((layer.rotation * Math.PI) / 180);
          ctx.scale(scale, scale);
          ctx.drawImage(img, -img.width / 2, -img.height / 2);
          ctx.restore();
          resolve();
        };
        img.src = src;
      });
    };

    Promise.all([
      background ? drawImage(background.src, { option: background, offsetX: 0, offsetY: 0, scale: 1, rotation: 0 }) : Promise.resolve(),
      ...layers.map(layer => drawImage(layer.option.src, layer)),
    ]).then(() => {
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'pfp.png';
          a.click();
          URL.revokeObjectURL(url);
        }
      });
    });
  };

  const handleBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        setBackground({ src, alt: 'Uploaded background' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCaption(e.target.value);
  };

  return (
    <div className="mx-auto mt-16 flex flex-col lg:flex-row gap-8 relative z-10">
      <div className="lg:w-1/2 flex flex-col items-center">
        <canvas ref={canvasRef} width="600" height="600" className="w-full max-w-[600px] aspect-square mb-4 border-2 border-gray-300"></canvas>
        <div className="w-full p-2 bg-gray-100">
          <div className="control-category mb-4">
            <div className="p-2 bg-gray-100">
              <label className='text-xl font-bold'>Background</label>
            </div>
            <label className="block w-full py-4 px-6 text-center text-lg font-semibold text-white bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
              Upload Background
              <input
                type="file"
                accept="image/*"
                onChange={handleBackgroundUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="control-category mb-4">
            <label className="block mb-2">Caption:</label>
            <input
              type="text"
              value={caption}
              onChange={handleCaptionChange}
              placeholder="Enter caption"
              className="w-full p-2 border rounded mb-2"
            />
            <div className="flex items-center mb-2">
              <label className="mr-2">Size:</label>
              <input
                type="number"
                value={captionStyle.fontSize}
                onChange={(e) => setCaptionStyle(prev => ({ ...prev, fontSize: Number(e.target.value) }))}
                placeholder="Font size"
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="captionPosition">Position:</label>
              <input
                id="captionPosition"
                type="range"
                min={0}
                max={100}
                value={captionStyle.verticalPosition}
                onChange={(e) => setCaptionStyle(prev => ({ ...prev, verticalPosition: Number(e.target.value) }))}
                className="w-full"
              />
            </div>
          </div>

          <button onClick={handleSaveImage} className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">Save Image</button>
        </div>
      </div>

      <div className="lg:w-1/2 flex flex-col items-start w-full">
        {renderControlCategory('Base Layer', baseOptions, 0)}
        {renderControlCategory('Right Clothes', clothesOptions, 1)}
        {renderControlCategory('Right Hat', hatOptions, 2)}
        {renderControlCategory('Accessory 1', accessoryOptions, 3)}
        {renderControlCategory('Accessory 2', accessory2Options, 4)}
      </div>
    </div>
  );
};

export default Generator;