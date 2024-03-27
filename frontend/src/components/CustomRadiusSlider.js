import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

const radii = [1000, 5000, 10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000];

function valuetext(value) {
  if (value < 10000) {
    return `${value.toString().substring(0, 1)}`;
  } else if (value < 100000) {
    return `${value.toString().substring(0, 2)}`;
  } else {
    return 'Invalid';
  }
}

const CustomRadiusSlider = ({ setRadius }) => {
  const [sliderValue, setSliderValue] = useState(1000);
  const [radiusInput, setRadiusInput] = useState('1000'); 

  const handleSliderChange = (event, newValue) => {
    if (typeof newValue === 'number') {
      setSliderValue(newValue);
      setRadius(newValue);
      setRadiusInput(newValue.toString()); 
    }
  };

  const handleInputChange = (event) => {
    const { value } = event.target;
    setRadiusInput(value); 
    if (/^\d*$/.test(value) && parseInt(value) >= 500 && parseInt(value) <= 50000) {
      setSliderValue(parseInt(value));
      setRadius(parseInt(value));
    }
  };

  return (
      <div className='w-full flex flex-col justify-between items-start space-y-2'>
        <input
            id="radius"
            className='border border-black w-16 h-8 rounded text-sm p-2'
            type="text"
            placeholder="Radius"
            value={radiusInput}
            onChange={handleInputChange}
        />
        <Box sx={{ width: 250 }}>
            <Slider
                aria-label="Custom marks"
                value={sliderValue}
                getAriaValueText={valuetext}
                step={5000}
                min={0}
                max={50000}
                valueLabelDisplay="auto"
                marks={radii.map(value => ({ value, label: valuetext(value) }))}
                onChange={handleSliderChange}
            />
        </Box>
    </div>
  );
};

export default CustomRadiusSlider;
