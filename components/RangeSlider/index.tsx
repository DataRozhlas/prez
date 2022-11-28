import React from "react";

const RangeSlider = (props: any) => {
  const handleSliderChange = (event: any) => {
    props.setPopLimit(event.target.value);
  };

  return (
    <div>
      <label
        htmlFor="range"
        className="block text-sm font-medium text-gray-700"
      >
        {`Obce od ${props.popLimit} registrovaných voličů`}
      </label>
      <div className="mt-1">
        <input
          type="range"
          name="range"
          min="0"
          max="20000"
          step="100"
          value={props.popLimit}
          onChange={handleSliderChange}
          className="cursor-pointer block w-full rounded-md border-gray-300 shadow-sm focus:border-red-700 focus:ring-red-700 sm:text-sm"
        />
      </div>
    </div>
  );
};

export { RangeSlider };
