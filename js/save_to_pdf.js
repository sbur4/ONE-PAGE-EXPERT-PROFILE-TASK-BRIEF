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
        `;

        const styleElement = clone.createElement('style');
        styleElement.textContent = compactStyles;
        clone.head.appendChild(styleElement);

        const options = {
            margin: 0.1,
            filename: filename,
            image: {type: 'jpeg', quality: 1},
            html2canvas: {
                scale: 1.1,
                useCORS: true,
                backgroundColor: '#0D1117',
                allowTaint: true,
                onclone: function (clonedDoc) {
                    // Apply inline styles (most important!)
                    applyInlineStylesToClone(clonedDoc);

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
            pagebreak: {mode: 'avoid-all'}
        };

        return html2pdf().set(options).from(cloneBody).save();

    } catch (error) {
        console.error('PDF generation failed:', error);
        throw error;
    }
}

// THIS IS THE KEY FUNCTION - Apply inline styles directly to elements
function applyInlineStylesToClone(clonedDoc) {
    console.log('Applying inline styles...');

    // SKILL PILLS - Force white color
    // const skillPills = clonedDoc.querySelectorAll('.tech-badges .skills-pill-bar .skill-pill');
    // const skillPills = clonedDoc.querySelectorAll('.skill-pill');
    const skillPills = clonedDoc.querySelectorAll('.skills-pill-bar');
    console.log(`Found ${skillPills.length} skill pills`);
    skillPills.forEach(el => {
        el.style.setProperty('color', '#F0F6FF', 'important');
        el.style.setProperty('-webkit-text-fill-color', '#F0F6FF', 'important');
        // el.style.setProperty('border-color', '#00D4FF', 'important');
        // Also set as attribute for maximum compatibility
        el.setAttribute('style', el.getAttribute('style') + '; color: #F0F6FF !important;');
        el.setAttribute('style', el.getAttribute('style') + '; color: #F0F6FF !important;');
    });

    // YEARS CARD LIST ITEMS - Force white color
    const yearsListItems = clonedDoc.querySelectorAll('.years-card ul li, .years-card li');
    console.log(`Found ${yearsListItems.length} years list items`);
    yearsListItems.forEach(el => {
        el.style.setProperty('color', '#F0F6FF', 'important');
        el.style.setProperty('-webkit-text-fill-color', '#F0F6FF', 'important');
        el.setAttribute('style', el.getAttribute('style') + '; color: #F0F6FF !important;');
    });

    // TECH CHIPS - Force cyan color
    const techChips = clonedDoc.querySelectorAll('.project-stack .tech-chip');
    // const techChips = clonedDoc.querySelectorAll('.project-stack');
    console.log(`Found ${techChips.length} tech chips`);
    techChips.forEach(el => {
        el.style.setProperty('color', '#F0F6FF', 'important');
        el.style.setProperty('-webkit-text-fill-color', '#F0F6FF', 'important');
        // el.style.setProperty('border-color', '#F0F6FF', 'important');
        // el.setAttribute('style', el.getAttribute('style') + '; color: #F0F6FF !important; border-color: #00D4FF !important;');
        // el.setAttribute('style', el.getAttribute('style') + '; color: #F0F6FF !important; border-color: #00D4FF !important;');
    });

    // // PROJECT STACK - Force cyan color for all children
    // const projectStacks = clonedDoc.querySelectorAll('.project-stack, .project-stack *');
    // console.log(`Found ${projectStacks.length} project stack elements`);
    // projectStacks.forEach(el => {
    //     el.style.setProperty('color', '#F0F6FF', 'important');
    //     el.style.setProperty('-webkit-text-fill-color', '#F0F6FF', 'important');
    // });

    console.log('Inline styles applied successfully');
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