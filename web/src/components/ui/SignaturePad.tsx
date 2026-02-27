import React, { useRef, useEffect, useState } from 'react';
import { Button } from './Button';
import { Eraser, Undo2, Check } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SignaturePadProps {
    onSave: (signatureDataUrl: string) => void;
    className?: string;
}

export const SignaturePad = ({ onSave, className }: SignaturePadProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true);
    const [history, setHistory] = useState<string[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set high DPI scale
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }, []);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const { offsetX, offsetY } = getCoordinates(e, canvas);
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const { offsetX, offsetY } = getCoordinates(e, canvas);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
        setIsEmpty(false);
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        saveToHistory();
    };

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
        const rect = canvas.getBoundingClientRect();
        if ('touches' in e) {
            return {
                offsetX: e.touches[0].clientX - rect.left,
                offsetY: e.touches[0].clientY - rect.top
            };
        }
        return {
            offsetX: e.nativeEvent.offsetX,
            offsetY: e.nativeEvent.offsetY
        };
    };

    const clear = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setIsEmpty(true);
        setHistory([]);
    };

    const saveToHistory = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            setHistory(prev => [...prev, canvas.toDataURL()]);
        }
    };

    const handleSave = () => {
        const canvas = canvasRef.current;
        if (canvas && !isEmpty) {
            onSave(canvas.toDataURL());
        }
    };

    return (
        <div className={cn("flex flex-col gap-4", className)}>
            <div className="relative group">
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-48 bg-white border-2 border-dashed border-border rounded-2xl cursor-crosshair touch-none shadow-inner"
                />
                {isEmpty && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-muted-foreground/40 font-medium italic">
                        Sign here...
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clear}
                        className="rounded-xl text-muted-foreground hover:text-destructive"
                    >
                        <Eraser className="h-4 w-4 mr-2" />
                        Clear
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        disabled={history.length === 0}
                        onClick={() => {
                            // Simple undo logic could be implemented here by re-drawing previous history state
                        }}
                        className="rounded-xl"
                    >
                        <Undo2 className="h-4 w-4 mr-2" />
                        Undo
                    </Button>
                </div>

                <Button
                    variant="primary"
                    size="sm"
                    disabled={isEmpty}
                    onClick={handleSave}
                    className="rounded-xl shadow-lg shadow-primary/20"
                >
                    <Check className="h-4 w-4 mr-2" />
                    Confirm Signature
                </Button>
            </div>
        </div>
    );
};
