// Advanced Color Changer with Multiple Features
class AdvancedColorChanger {
    constructor() {
        this.initializeElements();
        this.initializeEventListeners();
        this.initializeState();
        this.loadColorHistory();
        this.generateRandomColor();
    }

    initializeElements() {
        // Color display elements
        this.colorPreview = document.getElementById('colorPreview');
        this.colorHex = document.getElementById('colorHex');
        this.colorRgb = document.getElementById('colorRgb');
        this.colorHsl = document.getElementById('colorHsl');
        
        // Control buttons
        this.randomColorBtn = document.getElementById('randomColorBtn');
        this.randomPaletteBtn = document.getElementById('randomPaletteBtn');
        this.gradientBtn = document.getElementById('gradientBtn');
        this.themeToggle = document.querySelector('.theme-toggle');
        
        // Color scheme buttons
        this.schemeButtons = document.querySelectorAll('.scheme-btn');
        
        // Manual color inputs
        this.hexInput = document.getElementById('hexInput');
        this.redInput = document.getElementById('redInput');
        this.greenInput = document.getElementById('greenInput');
        this.blueInput = document.getElementById('blueInput');
        this.redValue = document.getElementById('redValue');
        this.greenValue = document.getElementById('greenValue');
        this.blueValue = document.getElementById('blueValue');
        
        // History and palette
        this.historyGrid = document.getElementById('historyGrid');
        this.paletteGrid = document.getElementById('paletteGrid');
        this.clearHistoryBtn = document.getElementById('clearHistoryBtn');
        
        // Export buttons
        this.copyHexBtn = document.getElementById('copyHexBtn');
        this.copyRgbBtn = document.getElementById('copyRgbBtn');
        this.copyCssBtn = document.getElementById('copyCssBtn');
    }

    initializeEventListeners() {
        // Random color generation
        this.randomColorBtn.addEventListener('click', () => this.generateRandomColor());
        this.randomPaletteBtn.addEventListener('click', () => this.generateRandomPalette());
        this.gradientBtn.addEventListener('click', () => this.generateRandomGradient());
        
        // Theme toggle
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Color scheme buttons
        this.schemeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.generateColorScheme(e.target.dataset.scheme));
        });
        
        // Manual color inputs
        this.hexInput.addEventListener('input', (e) => this.updateColorFromHex(e.target.value));
        this.redInput.addEventListener('input', (e) => this.updateColorFromRGB());
        this.greenInput.addEventListener('input', (e) => this.updateColorFromRGB());
        this.blueInput.addEventListener('input', (e) => this.updateColorFromRGB());
        
        // Color preview click
        this.colorPreview.addEventListener('click', () => this.generateRandomColor());
        
        // History and palette
        this.clearHistoryBtn.addEventListener('click', () => this.clearColorHistory());
        
        // Export buttons
        this.copyHexBtn.addEventListener('click', () => this.copyToClipboard(this.currentColor.hex));
        this.copyRgbBtn.addEventListener('click', () => this.copyToClipboard(this.currentColor.rgb));
        this.copyCssBtn.addEventListener('click', () => this.copyToClipboard(this.currentColor.css));
    }

    initializeState() {
        this.currentColor = {
            hex: '#FFFFFF',
            rgb: { r: 255, g: 255, b: 255 },
            hsl: { h: 0, s: 0, l: 100 }
        };
        this.colorHistory = [];
        this.currentPalette = [];
        this.isDarkTheme = false;
    }

    // Color generation methods
    generateRandomColor() {
        const hex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        this.setCurrentColor(hex);
        this.addToHistory(hex);
        this.animateColorChange();
    }

    generateRandomPalette() {
        const baseHue = Math.random() * 360;
        this.currentPalette = [];
        
        for (let i = 0; i < 5; i++) {
            const hue = (baseHue + i * 72) % 360;
            const saturation = 50 + Math.random() * 30;
            const lightness = 30 + Math.random() * 40;
            const hex = this.hslToHex(hue, saturation, lightness);
            this.currentPalette.push(hex);
        }
        
        this.updatePaletteDisplay();
        this.animatePaletteGeneration();
    }

    generateRandomGradient() {
        const color1 = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        const color2 = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        const angle = Math.floor(Math.random() * 360);
        
        document.body.style.background = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
        
        // Reset after 3 seconds
        setTimeout(() => {
            document.body.style.background = 'var(--gradient)';
        }, 3000);
        
        this.showNotification('Random gradient applied!');
    }

    generateColorScheme(schemeType) {
        const baseColor = this.currentColor.hsl;
        let schemeColors = [];
        
        switch (schemeType) {
            case 'analogous':
                schemeColors = [
                    this.hslToHex((baseColor.h + 30) % 360, baseColor.s, baseColor.l),
                    this.hslToHex((baseColor.h + 60) % 360, baseColor.s, baseColor.l),
                    this.hslToHex((baseColor.h - 30 + 360) % 360, baseColor.s, baseColor.l),
                    this.hslToHex((baseColor.h - 60 + 360) % 360, baseColor.s, baseColor.l)
                ];
                break;
            case 'complementary':
                schemeColors = [
                    this.hslToHex((baseColor.h + 180) % 360, baseColor.s, baseColor.l),
                    this.hslToHex((baseColor.h + 180) % 360, baseColor.s, Math.max(0, baseColor.l - 20)),
                    this.hslToHex((baseColor.h + 180) % 360, baseColor.s, Math.min(100, baseColor.l + 20))
                ];
                break;
            case 'triadic':
                schemeColors = [
                    this.hslToHex((baseColor.h + 120) % 360, baseColor.s, baseColor.l),
                    this.hslToHex((baseColor.h + 240) % 360, baseColor.s, baseColor.l)
                ];
                break;
            case 'monochromatic':
                schemeColors = [
                    this.hslToHex(baseColor.h, baseColor.s, Math.max(0, baseColor.l - 30)),
                    this.hslToHex(baseColor.h, baseColor.s, Math.max(0, baseColor.l - 15)),
                    this.hslToHex(baseColor.h, baseColor.s, Math.min(100, baseColor.l + 15)),
                    this.hslToHex(baseColor.h, baseColor.s, Math.min(100, baseColor.l + 30))
                ];
                break;
        }
        
        this.currentPalette = [this.currentColor.hex, ...schemeColors];
        this.updatePaletteDisplay();
        this.animateSchemeGeneration();
        
        // Update active scheme button
        this.schemeButtons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
    }

    // Color conversion methods
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        
        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }

    hslToHex(h, s, l) {
        s /= 100;
        l /= 100;
        
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;
        let r = 0, g = 0, b = 0;
        
        if (0 <= h && h < 60) {
            r = c; g = x; b = 0;
        } else if (60 <= h && h < 120) {
            r = x; g = c; b = 0;
        } else if (120 <= h && h < 180) {
            r = 0; g = c; b = x;
        } else if (180 <= h && h < 240) {
            r = 0; g = x; b = c;
        } else if (240 <= h && h < 300) {
            r = x; g = 0; b = c;
        } else if (300 <= h && h < 360) {
            r = c; g = 0; b = x;
        }
        
        const rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0');
        const gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0');
        const bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0');
        
        return '#' + rHex + gHex + bHex;
    }

    // Color update methods
    setCurrentColor(hex) {
        this.currentColor.hex = hex;
        this.currentColor.rgb = this.hexToRgb(hex);
        this.currentColor.hsl = this.rgbToHsl(this.currentColor.rgb.r, this.currentColor.rgb.g, this.currentColor.rgb.b);
        
        this.updateColorDisplay();
        this.updateManualInputs();
    }

    updateColorDisplay() {
        this.colorPreview.style.backgroundColor = this.currentColor.hex;
        this.colorHex.textContent = this.currentColor.hex.toUpperCase();
        this.colorRgb.textContent = `RGB(${this.currentColor.rgb.r}, ${this.currentColor.rgb.g}, ${this.currentColor.rgb.b})`;
        this.colorHsl.textContent = `HSL(${this.currentColor.hsl.h}°, ${this.currentColor.hsl.s}%, ${this.currentColor.hsl.l}%)`;
    }

    updateManualInputs() {
        this.hexInput.value = this.currentColor.hex;
        this.redInput.value = this.currentColor.rgb.r;
        this.greenInput.value = this.currentColor.rgb.g;
        this.blueInput.value = this.currentColor.rgb.b;
        this.redValue.textContent = this.currentColor.rgb.r;
        this.greenValue.textContent = this.currentColor.rgb.g;
        this.blueValue.textContent = this.currentColor.rgb.b;
    }

    updateColorFromHex(hex) {
        if (hex.match(/^#[0-9A-F]{6}$/i)) {
            this.setCurrentColor(hex);
            this.addToHistory(hex);
        }
    }

    updateColorFromRGB() {
        const r = parseInt(this.redInput.value);
        const g = parseInt(this.greenInput.value);
        const b = parseInt(this.blueInput.value);
        
        if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
            const hex = this.rgbToHex(r, g, b);
            this.setCurrentColor(hex);
            this.addToHistory(hex);
        }
    }

    // History and palette methods
    addToHistory(hex) {
        if (!this.colorHistory.includes(hex)) {
            this.colorHistory.unshift(hex);
            if (this.colorHistory.length > 20) {
                this.colorHistory.pop();
            }
            this.updateHistoryDisplay();
            this.saveColorHistory();
        }
    }

    updateHistoryDisplay() {
        this.historyGrid.innerHTML = '';
        this.colorHistory.forEach(hex => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.style.backgroundColor = hex;
            historyItem.setAttribute('data-color', hex);
            historyItem.addEventListener('click', () => this.setCurrentColor(hex));
            this.historyGrid.appendChild(historyItem);
        });
    }

    updatePaletteDisplay() {
        this.paletteGrid.innerHTML = '';
        this.currentPalette.forEach(hex => {
            const paletteColor = document.createElement('div');
            paletteColor.className = 'palette-color';
            paletteColor.style.backgroundColor = hex;
            paletteColor.setAttribute('data-color', hex);
            paletteColor.addEventListener('click', () => this.setCurrentColor(hex));
            this.paletteGrid.appendChild(paletteColor);
        });
    }

    clearColorHistory() {
        this.colorHistory = [];
        this.updateHistoryDisplay();
        this.saveColorHistory();
        this.showNotification('Color history cleared!');
    }

    // Storage methods
    saveColorHistory() {
        localStorage.setItem('colorHistory', JSON.stringify(this.colorHistory));
    }

    loadColorHistory() {
        const saved = localStorage.getItem('colorHistory');
        if (saved) {
            this.colorHistory = JSON.parse(saved);
            this.updateHistoryDisplay();
        }
    }

    // Utility methods
    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        document.body.classList.toggle('dark-theme', this.isDarkTheme);
        
        const icon = this.themeToggle.querySelector('i');
        if (this.isDarkTheme) {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
        
        this.themeToggle.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            this.themeToggle.style.transform = 'rotate(0deg)';
        }, 300);
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification(`${text} copied to clipboard!`);
        }).catch(() => {
            this.showNotification('Failed to copy to clipboard');
        });
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-color);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    // Animation methods
    animateColorChange() {
        this.colorPreview.style.animation = 'colorChange 0.6s ease-out';
        setTimeout(() => {
            this.colorPreview.style.animation = '';
        }, 600);
    }

    animatePaletteGeneration() {
        this.paletteGrid.style.animation = 'fadeIn 0.5s ease-out';
        setTimeout(() => {
            this.paletteGrid.style.animation = '';
        }, 500);
    }

    animateSchemeGeneration() {
        this.paletteGrid.style.animation = 'pulse 0.5s ease-out';
        setTimeout(() => {
            this.paletteGrid.style.animation = '';
        }, 500);
    }
}

// Initialize the color changer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AdvancedColorChanger();
});

// Add additional animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .notification {
        font-weight: 600;
        font-size: 0.9rem;
    }
`;
document.head.appendChild(style);
