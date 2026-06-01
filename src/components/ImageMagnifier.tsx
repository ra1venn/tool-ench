import React, { useState, useRef } from "react";

interface ImageMagnifierProps {
    src: string;
    alt: string;
    className?: string;
    zoomLevel?: number;     // Zoom multiplier (default 2.5x)
    magnifierSize?: number; // Magnifier diameter in pixels
}

export function ImageMagnifier({
    src,
    alt,
    className = "",
    zoomLevel = 2.5,
    magnifierSize = 160,
}: ImageMagnifierProps) {
    const [showMagnifier, setShowMagnifier] = useState(false);
    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const imgRef = useRef<HTMLImageElement>(null);

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        const elem = imgRef.current;
        if (!elem) return;

        const { top, left, width, height } = elem.getBoundingClientRect();

        // Calculate cursor/touch coordinates relative to the image
        const x = e.clientX - left;
        const y = e.clientY - top;

        // Hide magnifier when cursor leaves the image
        if (x < 0 || y < 0 || x > width || y > height) {
            setShowMagnifier(false);
            return;
        }

        setCoords({ x, y });
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        // Capture pointer to handle drag events correctly
        e.currentTarget.setPointerCapture(e.pointerId);
        setShowMagnifier(true);
        handlePointerMove(e);
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        e.currentTarget.releasePointerCapture(e.pointerId);
        setShowMagnifier(false);
    };

    // Calculate background image dimensions for the magnifier
    const imgWidth = imgRef.current?.offsetWidth || 0;
    const imgHeight = imgRef.current?.offsetHeight || 0;

    return (
        <div
            className="relative overflow-hidden inline-block select-none touch-none cursor-zoom-in"
            onPointerDown={handlePointerDown}
            onPointerMove={showMagnifier ? handlePointerMove : undefined}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
        >
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                className={className}
                draggable={false} // Disable default browser drag behavior
            />

            {showMagnifier && (
                <div
                    className="absolute rounded-full border-2 border-emerald-500 shadow-2xl pointer-events-none"
                    style={{
                        width: `${magnifierSize}px`,
                        height: `${magnifierSize}px`,
                        // Position magnifier so cursor is at the center
                        left: `${coords.x - magnifierSize / 2}px`,
                        top: `${coords.y - magnifierSize / 2}px`,
                        backgroundImage: `url(${src})`,
                        backgroundRepeat: "no-repeat",
                        // Scale background image proportionally to zoom level
                        backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
                        // Offset the background within the magnifier, centering the zoomed area
                        backgroundPosition: `${-coords.x * zoomLevel + magnifierSize / 2}px ${-coords.y * zoomLevel + magnifierSize / 2}px`,
                    }}
                />
            )}
        </div>
    );
}