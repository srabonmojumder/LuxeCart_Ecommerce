'use client';

import { motion } from 'framer-motion';

interface PriceSliderProps {
    min: number;
    max: number;
    value: [number, number];
    onChange: (value: [number, number]) => void;
}

export default function PriceSlider({ min, max, value, onChange }: PriceSliderProps) {
    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMin = parseInt(e.target.value);
        if (newMin < value[1]) {
            onChange([newMin, value[1]]);
        }
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMax = parseInt(e.target.value);
        if (newMax > value[0]) {
            onChange([value[0], newMax]);
        }
    };

    const minPercent = ((value[0] - min) / (max - min)) * 100;
    const maxPercent = ((value[1] - min) / (max - min)) * 100;

    return (
        <div className="space-y-4">
            <div className="relative h-2">
                {/* Track */}
                <div className="absolute w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full" />

                {/* Active Range */}
                <motion.div
                    className="absolute h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                    style={{
                        left: `${minPercent}%`,
                        right: `${100 - maxPercent}%`,
                    }}
                />

                {/* Min Slider */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={value[0]}
                    onChange={handleMinChange}
                    className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
                />

                {/* Max Slider */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={value[1]}
                    onChange={handleMaxChange}
                    className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-pink-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
                />
            </div>

            {/* Value Display */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Min:</span>
                    <span className="text-lg font-bold text-purple-600">${value[0]}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Max:</span>
                    <span className="text-lg font-bold text-pink-600">${value[1]}</span>
                </div>
            </div>
        </div>
    );
}
