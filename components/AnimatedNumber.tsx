import React, { useState, useEffect, useRef, useMemo } from 'react';

const easeOutCubic = (t: number) => (--t) * t * t + 1;

interface AnimatedNumberProps {
    value: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value }) => {
    // Extract prefix and the clean numeric value
    const numericValue = parseFloat(value.replace(/[^0-9.-]+/g, ""));
    const prefix = value.match(/^[^0-9]*/)?.[0] || '';
    const hasDecimals = (value.split('.')[1] || '').length > 0;
    
    const [displayValue, setDisplayValue] = useState(numericValue);
    const frameRef = useRef<number>();
    const prevValueRef = useRef<number>(numericValue);

    useEffect(() => {
        const startValue = prevValueRef.current;
        const endValue = numericValue;

        if (startValue === endValue || isNaN(endValue)) {
            setDisplayValue(endValue);
            return;
        }

        const duration = 1500; // Animation duration in ms
        let startTime: number | null = null;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const easedProgress = easeOutCubic(progress);

            const currentVal = startValue + (endValue - startValue) * easedProgress;
            setDisplayValue(currentVal);

            if (progress < 1) {
                frameRef.current = requestAnimationFrame(animate);
            } else {
                setDisplayValue(endValue); // Ensure it lands on the exact final value
                prevValueRef.current = endValue;
            }
        };

        frameRef.current = requestAnimationFrame(animate);

        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
        };
    }, [numericValue]);

    const formattedValue = useMemo(() => {
        if (isNaN(displayValue)) return '...';
        if (hasDecimals) {
            return displayValue.toFixed(2);
        }
        return Math.round(displayValue).toLocaleString();
    }, [displayValue, hasDecimals]);

    return <>{prefix}{formattedValue}</>;
};