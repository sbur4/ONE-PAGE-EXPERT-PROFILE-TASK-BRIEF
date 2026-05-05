// Enhanced function that preserves radar chart and other canvas elements
async function downloadPDF() {
    try {
        // Ensure assets directory exists (this is just for the filename)
        const filename = 'assets/cv.pdf';

        // Create a clone of the document for manipulation
        const clone = document.cloneNode(true);
        const cloneBody = clone.body;

        // Remove non-essential elements from clone
        const elementsToRemove = [
            '.particle-canvas',
            '.animation-element',
            'script',
            '.scroll-reveal'
        ];

        elementsToRemove.forEach(selector => {
            const elements = cloneBody.querySelectorAll(selector);
            elements.forEach(el => el.remove());
        });

        // Preserve radar chart and other important canvas elements
        await preserveCanvasElements(clone);

        // Apply ultra-compact styles to clone
        const compactStyles = `
            body {
                font-size: 9px !important;
                line-height: 1.1 !important;
                transform: scale(0.75) !important;
                transform-origin: top left !important;
                width: 133% !important;
            }
            .section { margin: 4px 0 !important; padding: 4px 0 !important; }
            h1 { font-size: 16px !important; }
            h2 { font-size: 12px !important; }
            h3 { font-size: 10px !important; }
            p, li { font-size: 8px !important; line-height: 1.0 !important; }
            .radar-chart { max-height: 120px !important; max-width: 120px !important; }
            .radar-chart canvas { max-height: 120px !important; max-width: 120px !important; }
        `;

        const styleElement = clone.createElement('style');
        styleElement.textContent = compactStyles;
        clone.head.appendChild(styleElement);

        const options = {
            margin: 0.1,
            filename: filename,
            image: { type: 'jpeg', quality: 1 },
            html2canvas: {
                scale: 1.1,
                useCORS: true,
                backgroundColor: '#ffffff',
                allowTaint: true,
                onclone: function(clonedDoc) {
                    // Additional canvas preservation in the cloned document
                    preserveCanvasInClone(clonedDoc);
                }
            },
            jsPDF: {
                unit: 'in',
                format: 'A3',
                orientation: 'portrait',
                compress: true
            },
            pagebreak: { mode: 'avoid-all' }
        };

        return html2pdf().set(options).from(cloneBody).save();

    } catch (error) {
        console.error('PDF generation failed:', error);
        throw error;
    }
}

// Function to preserve canvas elements (like radar chart)
async function preserveCanvasElements(cloneDoc) {
    // Find all canvas elements in original document
    const originalCanvases = document.querySelectorAll('canvas');
    const cloneCanvases = cloneDoc.querySelectorAll('canvas');

    for (let i = 0; i < originalCanvases.length; i++) {
        const originalCanvas = originalCanvases[i];
        const cloneCanvas = cloneCanvases[i];

        if (originalCanvas && cloneCanvas) {
            try {
                // Convert original canvas to image data
                const imageData = originalCanvas.toDataURL('image/png');

                // Create an img element to replace the canvas
                const img = cloneDoc.createElement('img');
                img.src = imageData;
                img.style.cssText = originalCanvas.style.cssText;
                img.style.maxWidth = originalCanvas.width + 'px';
                img.style.maxHeight = originalCanvas.height + 'px';

                // Copy classes and attributes
                img.className = originalCanvas.className;
                if (originalCanvas.id) img.id = originalCanvas.id;

                // Replace canvas with image in clone
                cloneCanvas.parentNode.replaceChild(img, cloneCanvas);
            } catch (err) {
                console.warn('Could not preserve canvas:', err);
            }
        }
    }
}

// Additional function for onclone callback
function preserveCanvasInClone(clonedDoc) {
    const canvases = clonedDoc.querySelectorAll('canvas');

    canvases.forEach(canvas => {
        try {
            // Try to get the original canvas by matching selectors
            const originalCanvas = document.querySelector(`canvas[class="${canvas.className}"]`) ||

                document.querySelector(`#${canvas.id}`) ||
                document.querySelector('canvas');

            if (originalCanvas) {
                const imageData = originalCanvas.toDataURL('image/png');
                const img = clonedDoc.createElement('img');
                img.src = imageData;
                img.style.cssText = canvas.style.cssText;
                img.className = canvas.className;
                if (canvas.id) img.id = canvas.id;

                canvas.parentNode.replaceChild(img, canvas);
            }
        } catch (err) {
            console.warn('Could not preserve canvas in clone:', err);
        }
    });
}