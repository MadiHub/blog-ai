import React, { useState, useEffect } from 'react';

const ResizeImageModal = ({ isOpen, onClose, currentWidth, currentHeight, originalWidth, originalHeight, onSave }) => {
    const [width, setWidth] = useState(currentWidth || originalWidth || 0);
    const [height, setHeight] = useState(currentHeight || originalHeight || 0);
    const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);

    useEffect(() => {
        if (isOpen) {
            // Set state saat modal dibuka dengan nilai dari props
            setWidth(currentWidth || originalWidth || 0);
            setHeight(currentHeight || originalHeight || 0);
        }
    }, [isOpen, currentWidth, currentHeight, originalWidth, originalHeight]);

    const handleWidthChange = (e) => {
        const newWidth = parseInt(e.target.value, 10);
        if (!isNaN(newWidth)) {
            setWidth(newWidth);
            if (maintainAspectRatio && originalWidth && originalHeight) {
                setHeight(Math.round(newWidth * (originalHeight / originalWidth)));
            }
        }
    };

    const handleHeightChange = (e) => {
        const newHeight = parseInt(e.target.value, 10);
        if (!isNaN(newHeight)) {
            setHeight(newHeight);
            if (maintainAspectRatio && originalWidth && originalHeight) {
                setWidth(Math.round(newHeight * (originalWidth / originalHeight)));
            }
        }
    };

    const handleSave = () => {
        if (width > 0 && height > 0) {
            onSave(width, height);
            onClose();
        } else {
            alert('Width and Height must be positive numbers.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Resize Image</h2>
                <div className="modal-body">
                    <label>
                        Width (px):
                        <input type="number" value={width} onChange={handleWidthChange} />
                    </label>
                    <label>
                        Height (px):
                        <input type="number" value={height} onChange={handleHeightChange} />
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={maintainAspectRatio}
                            onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                        />
                        Maintain Aspect Ratio
                    </label>
                    {originalWidth && originalHeight && (
                        <p className="text-sm text-gray-500">Original: {originalWidth}x{originalHeight} px</p>
                    )}
                </div>
                <div className="modal-footer">
                    <button onClick={handleSave}>Save</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ResizeImageModal;