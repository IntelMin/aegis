import React from 'react';

const SecurityScale = ({ value }: { value: number }) => {
  const bgRed = [
    '#dc2626', // red-600
    '#ef4444', // red-500
    '#f87171', // red-400
    '#fca5a5', // red-300
    '#fecaca', // red-200
  ];

  const bgOrange = [
    '#ea580c', // orange-600
    '#f97316', // orange-500
    '#fb923c', // orange-400
    '#fdba74', // orange-300
    '#fed7aa', // orange-200
  ];

  const bgYellow = [
    '#ca8a04', // yellow-600
    '#eab308', // yellow-500
    '#facc15', // yellow-400
    '#fde047', // yellow-300
    '#fde68a', // yellow-200
  ];

  const bgGreen = [
    '#059669', // green-600
    '#10b981', // green-500
    '#34d399', // green-400
    '#6ee7b7', // green-300
    '#a7f3d0', // green-200
  ];

  const getColor = (score: number) => {
    const colorRanges: { [key: string]: number } = {
      red: 25,
      orange: 50,
      yellow: 75,
      green: 100,
    };

    const colorKey =
      Object.keys(colorRanges).find(
        (key: keyof typeof colorRanges) => score <= colorRanges[key]
      ) || 'green';

    let colorArray;
    switch (colorKey) {
      case 'red':
        colorArray = bgRed;
        break;
      case 'orange':
        colorArray = bgOrange;
        break;
      case 'yellow':
        colorArray = bgYellow;
        break;
      case 'green':
        colorArray = bgGreen;
        break;
      default:
        colorArray = bgGreen; // default color
        break;
    }

    return colorArray.map(colorCode => ({ backgroundColor: colorCode }));
  };

  return (
    <div className="flex flex-row">
      <div className="w-[80px] flex flex-row-reverse">
        {getColor(value)
          .reverse()
          .map((color, circleIndex) => (
            <div
              key={circleIndex}
              style={color}
              className={`w-6 h-6 rounded-full border border-zinc-900 border-[2px] ml-[-0.8rem] z-1${circleIndex}`}
            />
          ))}
      </div>

      <div className="ml-2 w-[30px] font-bold text-lg text-right text-zinc-200 font-mono">
        {Math.round(value)}%
      </div>
    </div>
  );
};

export default SecurityScale;
