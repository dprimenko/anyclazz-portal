import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/ui-library/components/ssr/button/Button";
import { Icon } from "@/ui-library/components/ssr/icon/Icon";
import { useTranslations } from "@/i18n";

const ASPECT_RATIO = 1; // 1:1 square

interface AvatarCropperProps {
    imageSrc: string;
    onCrop: (croppedFile: File) => void;
    onCancel: () => void;
}

export function AvatarCropper({ imageSrc, onCrop, onCancel }: AvatarCropperProps) {
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

            // Calcular crop inicial (centrado) - cuadrado
            const containerWidth = containerRef.current?.offsetWidth || 400;

            if (img.width > img.height) {
                // Imagen más ancha que alta
                const cropSize = img.height;
                const cropX = (img.width - cropSize) / 2;
                setCrop({
                    x: cropX,
                    y: 0,
                    width: cropSize,
                    height: cropSize,
                });
            } else {
                // Imagen más alta que ancha o cuadrada
                const cropSize = img.width;
                const cropY = (img.height - cropSize) / 2;
                setCrop({
                    x: 0,
                    y: cropY,
                    width: cropSize,
                    height: cropSize,
                });
            }
        };
        img.src = imageSrc;
    }, [imageSrc]);

    // Dibujar preview
    useEffect(() => {
        if (!image || !canvasRef.current || !containerRef.current) return;

        const container = containerRef.current;
        const scale = container.offsetWidth / image.width;
        const displayHeight = image.height * scale;

        canvasRef.current.width = container.offsetWidth;
        canvasRef.current.height = displayHeight;

        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        // Dibujar imagen
        ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, container.offsetWidth, displayHeight);

        // Dibujar overlay oscuro fuera del crop
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";

        const cropX = crop.x * scale;
        const cropY = crop.y * scale;
        const cropW = crop.width * scale;
        const cropH = crop.height * scale;

        // Arriba
        if (cropY > 0) {
            ctx.fillRect(0, 0, container.offsetWidth, cropY);
        }
        // Abajo
        if (cropY + cropH < displayHeight) {
            ctx.fillRect(0, cropY + cropH, container.offsetWidth, displayHeight - cropY - cropH);
        }
        // Izquierda
        if (cropX > 0) {
            ctx.fillRect(0, cropY, cropX, cropH);
        }
        // Derecha
        if (cropX + cropW < container.offsetWidth) {
            ctx.fillRect(cropX + cropW, cropY, container.offsetWidth - cropX - cropW, cropH);
        }

        // Dibujar borde y grid
        ctx.strokeStyle = "#ff8800";
        ctx.lineWidth = 2;
        ctx.strokeRect(cropX, cropY, cropW, cropH);

        // Grid lines
        ctx.strokeStyle = "rgba(255, 136, 0, 0.3)";
        ctx.lineWidth = 1;
        for (let i = 1; i < 3; i++) {
            const x = cropX + (cropW / 3) * i;
            ctx.beginPath();
            ctx.moveTo(x, cropY);
            ctx.lineTo(x, cropY + cropH);
            ctx.stroke();

            const y = cropY + (cropH / 3) * i;
            ctx.beginPath();
            ctx.moveTo(cropX, y);
            ctx.lineTo(cropX + cropW, y);
            ctx.stroke();
        }
    }, [image, crop]);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current || !image || !containerRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const containerWidth = containerRef.current.offsetWidth;
        const scale = image.width / containerWidth;

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        const x = (clientX - rect.left) * scale;
        const y = (clientY - rect.top) * scale;

        // Verificar si el click está dentro del área de crop
        if (
            x >= crop.x &&
            x <= crop.x + crop.width &&
            y >= crop.y &&
            y <= crop.y + crop.height
        ) {
            setIsDragging(true);
            setDragStart({ x: x - crop.x, y: y - crop.y });
        }
    }, [crop, image]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDragging || !canvasRef.current || !image) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const scale = containerRef.current?.offsetWidth ? containerRef.current.offsetWidth / image.width : 1;
        
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        
        const currentX = (clientX - rect.left) / scale;
        const currentY = (clientY - rect.top) / scale;

        const deltaX = currentX - dragStart.x;
        const deltaY = currentY - dragStart.y;

        const newCrop = { ...crop };
        newCrop.x = Math.max(0, Math.min(crop.x + deltaX, image.width - crop.width));
        newCrop.y = Math.max(0, Math.min(crop.y + deltaY, image.height - crop.height));

        setCrop(newCrop);
        setDragStart({ x: currentX, y: currentY });
        
        // Prevenir scroll en mobile
        e.preventDefault?.();
    }, [isDragging, crop, dragStart, image]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleCrop = useCallback(() => {
        if (!image || !canvasRef.current) return;

        const offscreenCanvas = document.createElement("canvas");
        const offscreenCtx = offscreenCanvas.getContext("2d");

        if (!offscreenCtx) return;

        // Dimensión final: 256x256px para avatar
        offscreenCanvas.width = 256;
        offscreenCanvas.height = 256;

        offscreenCtx.drawImage(
            image,
            crop.x,
            crop.y,
            crop.width,
            crop.height,
            0,
            0,
            256,
            256
        );

        offscreenCanvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
                onCrop(file);
            }
        }, "image/jpeg", 0.95);
    }, [image, crop, onCrop]);

    return (
        <div className="flex flex-col gap-4">
            <div className="text-sm text-[var(--color-neutral-600)]">
                {t("teacher-profile.avatar_crop_instruction")}
            </div>

            <div
                ref={containerRef}
                className="w-full max-w-[512px] rounded-lg overflow-hidden bg-neutral-900"
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
