import React from "react";

const ButtonSwitch = (props: any) => {
  const handleButtonClick = (event: any) => {
    props.setSelected(Number(event.target.value));
  };

  return (
    <span className="isolate inline-flex rounded-md shadow-sm">
      <button
        type="button"
        className={`${
          props.selected === 1
            ? "z-10 border-red-700 outline-none ring-1 ring-red-700"
            : "border-gray-300"
        } relative inline-flex items-center rounded-l-md border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50`}
        value={1}
        onClick={handleButtonClick}
      >
        1. kolo
      </button>
      <button
        type="button"
        className={`${
          props.selected === 2
            ? "z-10 border-red-700 outline-none ring-1 ring-red-700"
            : "border-gray-300"
        } relative inline-flex items-center rounded-r-md border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50`}
        value={2}
        onClick={handleButtonClick}
      >
        2. kolo
      </button>
    </span>
  );
};

export { ButtonSwitch };
