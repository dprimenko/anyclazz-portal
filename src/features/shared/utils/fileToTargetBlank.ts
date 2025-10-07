export function fileToTargetBlank(blob: Blob, type: string, filename?: string) {
    const windowUrl = window.URL.createObjectURL(new Blob([blob], { type }));
    const link = document.createElement('a');
    link.href = windowUrl;
    link.setAttribute('target', '_blank');
    if (filename) {
        link.download = filename;
    }
    document.body.appendChild(link);
    link.click();

    setTimeout(() => { window.URL.revokeObjectURL(windowUrl); }, 250);
}