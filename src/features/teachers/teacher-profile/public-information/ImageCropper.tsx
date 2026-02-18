import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/ui-library/components/ssr/button/Button";
import { Icon } from "@/ui-library/components/ssr/icon/Icon";
import { useTranslations } from "@/i18n";

const CROP_HEIGHT = 170; // Altura fija del crop en píxeles

interface ImageCropperProps {
    imageSrc: string;
    onCrop: (croppedFile: File) => void;
    onCancel: () => void;
}

export function ImageCropper({ imageSrc, onCrop, onCancel }: ImageCropperProps) {
    const t = useTranslations();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Cargar imagen
    useEffect(() => {
        const img = new Image();
        img.onload = () => {
            setImage(img);

            // Calcular crop inicial - ancho completo, altura proporcional a 170px
            const containerWidth = containerRef.current?.offsetWidth || 400;
            
            // El aspect ratio se calcula dinámicamente basado en el ancho del contenedor
            const aspectRatio = containerWidth / CROP_HEIGHT;
            
            // Usar el ancho completo de la imagen
            const cropWidth = img.width;
            const cropHeight = cropWidth / aspectRatio;
            
            // Centrar verticalmente
            const cropY = Math.max(0, (img.height - cropHeight) / 2);
            
            setCrop({
                x: 0,
                y: cropY,
                width: cropWidth,
                height: Math.min(cropHeight, img.height),
            });
        };
        img.src = imageSrc;
    }, [imageSrc]);

    // Dibujar preview
    useEffect(() => {
        if (!image || !canvasRef.current || !containerRef.current) return;

        const container = containerRef.current;
        const containerWidth = container.offsetWidth;
        
        // Calcular escala para que la altura del crop sea 170px
        const cropDisplayHeight = CROP_HEIGHT;
        const scale = cropDisplayHeight / crop.height;
        const displayWidth = crop.width * scale;
        const displayHeight = cropDisplayHeight;

        canvasRef.current.width = containerWidth;
        canvasRef.current.height = CROP_HEIGHT;

        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        // Limpiar canvas
        ctx.clearRect(0, 0, containerWidth, CROP_HEIGHT);

        // Dibujar solo la parte de la imagen que está en el crop
        // Centrar horizontalmente si el displayWidth es menor que containerWidth
        const offsetX = (containerWidth - displayWidth) / 2;
        
        ctx.drawImage(
            image,
            crop.x,
            crop.y,
            crop.width,
            crop.height,
            offsetX,
            0,
            displayWidth,
            displayHeight
        );

        // Dibujar overlay oscuro a los lados si es necesario
        if (offsetX > 0) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            ctx.fillRect(0, 0, offsetX, CROP_HEIGHT);
            ctx.fillRect(offsetX + displayWidth, 0, containerWidth - offsetX - displayWidth, CROP_HEIGHT);
        }

        // Dibujar borde
        ctx.strokeStyle = "#F4A43A";
        ctx.lineWidth = 2;
        ctx.strokeRect(Math.max(0, offsetX), 0, Math.min(displayWidth, containerWidth), CROP_HEIGHT);

        // Dibujar grid
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 1;
        const gridLeft = Math.max(0, offsetX);
        const gridWidth = Math.min(displayWidth, containerWidth);
        
        for (let i = 1; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(gridLeft + (gridWidth / 3) * i, 0);
            ctx.lineTo(gridLeft + (gridWidth / 3) * i, CROP_HEIGHT);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(gridLeft, (CROP_HEIGHT / 3) * i);
            ctx.lineTo(gridLeft + gridWidth, (CROP_HEIGHT / 3) * i);
            ctx.stroke();
        }
    }, [image, crop]);

    const handleMouseDown = useCallback(
        (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
            if (!canvasRef.current || !image || !containerRef.current) return;

            const rect = canvasRef.current.getBoundingClientRect();
            
            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
            const y = clientY - rect.top;

            // Cualquier click dentro del canvas iniciará el arrastre vertical
            if (y >= 0 && y <= CROP_HEIGHT) {
                setIsDragging(true);
                setDragStart({ x: 0, y: y });
            }
        },
        [image]
    );

    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
            if (!isDragging || !canvasRef.current || !image || !containerRef.current) return;

            const rect = canvasRef.current.getBoundingClientRect();
            const containerWidth = containerRef.current.offsetWidth;
            
            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
            const y = clientY - rect.top;

            // Calcular movimiento vertical en coordenadas de la imagen
            const deltaY = y - dragStart.y;
            const scale = CROP_HEIGHT / crop.height;
            const imageY = crop.y - (deltaY / scale);

            // Límites verticales
            const newY = Math.max(0, Math.min(imageY, image.height - crop.height));

            setCrop({
                ...crop,
                y: newY,
            });

            setDragStart({ x: 0, y });

            // Prevenir scroll en mobile
            e.preventDefault?.();
        },
        [isDragging, crop, image, dragStart]
    );

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleCrop = useCallback(async () => {
        if (!image || !containerRef.current) return;

        const offscreenCanvas = document.createElement("canvas");
        
        // Calcular dimensiones de salida manteniendo proporciones del crop
        // Usamos el ancho de la imagen original y calculamos la altura proporcionalmente
        const outputWidth = crop.width;
        const outputHeight = crop.height;
        
        offscreenCanvas.width = outputWidth;
        offscreenCanvas.height = outputHeight;

        const ctx = offscreenCanvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(
            image,
            crop.x,
            crop.y,
            crop.width,
            crop.height,
            0,
            0,
            outputWidth,
            outputHeight
        );

        offscreenCanvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], "portrait.jpg", { type: "image/jpeg" });
                onCrop(file);
            }
        }, "image/jpeg", 0.95);
    }, [image, crop, onCrop]);

    return (
        <div className="flex flex-col gap-4">
            <div className="text-sm text-[var(--color-neutral-600)]">
                {t("teacher-profile.portrait_crop_instruction")}
            </div>

            <div
                ref={containerRef}
                className="w-full rounded-lg overflow-hidden bg-neutral-900"
                style={{ height: `${CROP_HEIGHT}px` }}
            >
                <canvas
                    ref={canvasRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleMouseDown}
                    onTouchMove={handleMouseMove}
                    onTouchEnd={handleMouseUp}
                    className="w-full cursor-move touch-none"
                    style={{ height: `${CROP_HEIGHT}px` }}
                />
            </div>

            <div className="flex gap-3 self-end">
                <Button
                    type="button"
                    colorType="secondary"
                    label={t("common.cancel")}
                    onClick={onCancel}
                />
                <Button
                    type="button"
                    colorType="primary"
                    label={t("common.crop")}
                    onClick={handleCrop}
                />
            </div>
        </div>
    );
}
