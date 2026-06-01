import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageMagnifier } from './ImageMagnifier'; // Import the magnifier component

interface VillagerTradesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function VillagerTradesModal({ isOpen, onClose }: VillagerTradesModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="relative max-w-[90vw] max-h-[90vh] mx-4 rounded-2xl overflow-hidden bg-gray-900 border border-gray-700 shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                            <h2 className="text-xl font-bold text-white">Villager Trades</h2>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="flex-1 p-0 overflow-hidden flex items-center justify-center">
                                {/* USE MAGNIFIER COMPONENT INSTEAD OF STANDARD IMG */}
                                <ImageMagnifier
                                    src="https://i.imgur.com/cmXw3Lv.png"
                                    alt="Villager trades"
                                    className="max-h-[80vh] w-auto object-contain"
                                    zoomLevel={2.5}      // Zoom level setting
                                    magnifierSize={360}   // Magnifier size setting
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}