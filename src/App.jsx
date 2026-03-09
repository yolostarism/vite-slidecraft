import React, { useState, useEffect, useRef, useCallback } from 'react';
import imageCompression from 'browser-image-compression';
import './index.css';

const SERVER_URL = '/api'; 
const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
    'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)',
    'linear-gradient(135deg, #0ba360 0%, #3cba92 100%)',
    'linear-gradient(135deg, #b224ef 0%, #7579ff 100%)'
];

const Icons = {
    Slideshow: () => <svg width="24" height="24" viewBox="0 0 256 256" fill="currentColor"><path d="M192,56H64A16,16,0,0,0,48,72V184a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V72A16,16,0,0,0,192,56Zm0,128H64V72H192V184ZM216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM168,88v48a8,8,0,0,1-8,8H136v16a8,8,0,0,1-16,0V88a8,8,0,0,1,8-8h32A8,8,0,0,1,168,88Zm-16,0H136v40h16V88ZM104,80H64a8,8,0,0,0-8,8v64a8,8,0,0,0,16,0V136h24a8,8,0,0,0,0-16H72V96h32a8,8,0,0,0,0-16Zm88,0H160a8,8,0,0,0-8,8v64a8,8,0,0,0,16,0V96h24a8,8,0,0,0,0-16Z"></path></svg>,
    Play: () => <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M240,128a15.74,15.74,0,0,1-7.6,13.51L88.32,229.65a16,16,0,0,1-16.2.3A15.86,15.86,0,0,1,64,216.13V39.87a15.86,15.86,0,0,1,8.12-13.82,16,16,0,0,1,16.2.3L232.4,114.49A15.74,15.74,0,0,1,240,128Z"></path></svg>,
    Plus: () => <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path></svg>,
    Trash: () => <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path></svg>,
    Code: () => <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor"><path d="M69.12,94.15l-45.6,48.36a8,8,0,0,0,0,11l45.6,48.36a8,8,0,0,0,11.62-11l-40.38-42.89,40.38-42.89a8,8,0,0,0-11.62-11Zm176,48.36L199.5,94.15a8,8,0,0,0-11.62,11l40.38,42.89-40.38,42.89a8,8,0,0,0,11.62,11l45.6-48.36A8,8,0,0,0,245.13,142.51Zm-87.39-86a8,8,0,0,0-10.42,4.7l-48,136a8,8,0,0,0,4.7,10.42,8.12,8.12,0,0,0,2.86.53,8,8,0,0,0,7.56-5.33l48-136A8,8,0,0,0,157.74,56.54Z"></path></svg>,
    Image: () => <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM160,80a24,24,0,1,0,24,24A24,24,0,0,0,160,80Zm0,32a8,8,0,1,1,8-8A8,8,0,0,1,160,112ZM216,192H40v-6.9l52.69-52.68a16,16,0,0,1,22.62,0L144,161.1l28.69-28.68a16,16,0,0,1,22.62,0L216,152.94V192Z"></path></svg>,
    X: () => <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>,
    SignOut: () => <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M124,216a12,12,0,0,1-12,12H48a12,12,0,0,1-12-12V40A12,12,0,0,1,48,28h64a12,12,0,0,1,0,24H60V204h52A12,12,0,0,1,124,216Zm108.49-96.49-40-40a12,12,0,0,0-17,17L195,116H112a12,12,0,0,0,0,24h83l-19.52,19.52a12,12,0,0,0,17,17l40-40A12,12,0,0,0,232.49,119.51Z"></path></svg>,
    Back: () => <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H224A8,8,0,0,1,224,128Z"></path></svg>,
    Presentation: () => <svg width="40" height="40" viewBox="0 0 256 256" fill="currentColor"><path d="M216,40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM216,176H40V56H216V176ZM208,208a8,8,0,0,1-8,8H56a8,8,0,0,1,0-16H200A8,8,0,0,1,208,208Z"></path></svg>,
    Edit: () => <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152.05A15.89,15.89,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"></path></svg>,
    FontUp: () => <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M224,128a8,8,0,0,1-8,8H176v40a8,8,0,0,1-16,0V136H112v40a8,8,0,0,1-16,0V56a8,8,0,0,1,16,0v64h48V56a8,8,0,0,1,16,0v64h40A8,8,0,0,1,224,128ZM64,104a8,8,0,0,0-8,8v16H40V112a8,8,0,0,0-16,0v48a8,8,0,0,0,16,0v-8H56v8a8,8,0,0,0,16,0V112A8,8,0,0,0,64,104Zm-8,40H40v-16h16Z"></path></svg>,
    FontDown: () => <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M208,112H168V56a8,8,0,0,0-16,0v56H112a8,8,0,0,0-16,0v48a8,8,0,0,0,16,0v-8h40v8a8,8,0,0,0,16,0V128h40a8,8,0,0,0,0-16Zm-56,32H112V128h40ZM88,128a8,8,0,0,1-8,8H64v40a8,8,0,0,1-16,0V136H32a8,8,0,0,1,0-16H80A8,8,0,0,1,88,128Z"></path></svg>,
    Bold: () => <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M156,128h-52v52h60a28,28,0,0,0,0-56H156Zm-52-32h52a28,28,0,0,0,0-56H80a8,8,0,0,0-8,8v40a8,8,0,0,0,8,8ZM232,160a60.07,60.07,0,0,1-60,60H72a16,16,0,0,1-16-16V56A16,16,0,0,1,72,40h84a60,60,0,0,1,0,120Zm-16-32a43.85,43.85,0,0,0-8.29-25.54,44,44,0,0,0,0-56.92A43.85,43.85,0,0,0,156,24H72V204h92a44,44,0,0,0,52-76Z"></path><path opacity="0.2" d="M156,112h-44V56h44a28,28,0,0,1,0,56Zm8,16h-52v56h52a28,28,0,0,0,0-56Zm52,28a44,44,0,0,1-44,44H80a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h76a44,44,0,0,1,0,88,43.85,43.85,0,0,1,8.29,25.54A43.85,43.85,0,0,1,216,156ZM88,184h84a28,28,0,0,0,0-56H88Zm0-72h76a28,28,0,0,0,0-56H88Z"></path></svg>,
    Italic: () => <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M200,56a8,8,0,0,1-8,8H167.2l-51.43,128H144a8,8,0,0,1,0,16H72a8,8,0,0,1,0-16H96.8l51.43-128H120a8,8,0,0,1,0-16h72A8,8,0,0,1,200,56Z"></path></svg>,
    Underline: () => <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M80,40v88a48,48,0,0,0,96,0V40a8,8,0,0,0-16,0v88a32,32,0,0,1-64,0V40a8,8,0,0,0-16,0ZM56,200a8,8,0,0,0,0,16H200a8,8,0,0,0,0-16Z"></path></svg>,
    Type: () => <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M208,56A8,8,0,0,1,200,64H136V192h24a8,8,0,0,1,0,16H96a8,8,0,0,1,0-16h24V64H56a8,8,0,0,1,0-16H200A8,8,0,0,1,208,56Z"></path></svg>
};

const request = async (endpoint, options = {}) => {
    const timeout = 120000;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout); 
    try {
        const res = await fetch(`${SERVER_URL}${endpoint}`, { ...options, signal: controller.signal });
        clearTimeout(id);
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || '操作失败');
            return data;
        }
        if (res.ok) return null;
        throw new Error(`服务器响应异常 (${res.status})`);
    } catch (e) {
        clearTimeout(id);
        if (e.name === 'AbortError') throw new Error('请求超时');
        throw e;
    }
};

const api = {
    login: (username, password) => request('/login', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({username, password}) }),
    register: (username, password) => request('/register', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({username, password}) }),
    getProjects: (userId) => request(`/projects?userId=${userId}`).catch(() => []), 
    createProject: (userId, title) => request('/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, title, slides: DEFAULT_SLIDES }) }),
    getProjectDetails: (id) => request(`/projects/${id}`),
    saveProject: (id, slides, title) => request(`/projects/${id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slides, title }) }),
    deleteProject: (id) => request(`/projects/${id}`, { method: 'DELETE' }),
    uploadImage: async (file) => {
        const formData = new FormData(); formData.append('image', file);
        return request('/upload', { method: 'POST', body: formData }).then(d => d.url);
    }
};

const DEFAULT_SLIDES = [{id: 1, html: `<div style="width:100%;height:100%;background:#0f172a;color:white;display:flex;flex-direction:column;align-items:center;justify-content:center"><h1 style="font-size:3.75rem;font-weight:700">SlideCraft</h1><p style="margin-top:1rem;font-size:1.25rem;opacity:0.8">Ready to create.</p></div>`}];

const injectPreview = (html, includeVisualScript = false) => {
    const isFullHtml = html.trim().match(/^<!DOCTYPE/i) || html.trim().match(/^<html/i);
    const script = '';
    
    if (isFullHtml) {
        const resetStyle = `<style id="sc-preview-reset"> 
            :root { color-scheme: light; }
            * { 
                box-sizing: border-box !important; 
                forced-color-adjust: none !important; 
                -webkit-print-color-adjust: exact !important; 
                print-color-adjust: exact !important; 
                min-width: 0;
                min-height: 0;
            } 
            body, html { 
                margin: 0 !important; 
                padding: 0 !important; 
                width: 1344px !important; 
                height: 816px !important; 
                max-width: 1344px !important; 
                max-height: 816px !important; 
                overflow: hidden !important; 
                background: none !important; 
                display: block !important; 
            } 
            body > div, .ppt-slide, .slide { 
                width: 100% !important; 
                height: 100% !important; 
                max-width: 1344px !important; 
                max-height: 816px !important; 
                overflow: hidden !important; 
                border-radius: 0 !important; 
                box-shadow: none !important; 
                aspect-ratio: auto !important; 
                margin: 0 !important; 
                transform: none !important; 
                left: auto !important; 
                top: auto !important; 
            } 
            img, svg, video {
                max-width: 100% !important;
                max-height: 100% !important;
            }
            p, h1, h2, h3, h4, h5, h6, span, div {
                word-wrap: break-word !important;
                overflow-wrap: break-word !important;
            }
        </style>`;

        let content = html;
        if (html.includes('</head>')) {
            content = content.replace('</head>', resetStyle + '</head>');
        } else {
            content = resetStyle + content;
        }
        
        if (html.includes('</body>')) {
            content = content.replace('</body>', script + '</body>');
        } else {
            content = content + script;
        }
        return content;
    }

    return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
        :root { color-scheme: light; }
        * { box-sizing: border-box; forced-color-adjust: none !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        body, html { margin: 0 !important; padding: 0 !important; width: 1344px; height: 816px; overflow: hidden; background: transparent; -webkit-user-select: none; user-select: none; cursor: default; }
    </style></head><body>${html}${script}</body></html>`;
};

// 注入的可视化编辑器脚本 (作为字符串)
window.initVisualEditor = function(iframe, isEnabled, callbacks) {
    const win = iframe.contentWindow;
    const doc = iframe.contentDocument || win?.document;
    if (!win || !doc) return;

    if (!isEnabled) {
        if (win.deselectVisual) win.deselectVisual();
        if (win.scHandleSelect) doc.removeEventListener('click', win.scHandleSelect, true);
        if (win.scHandleDragStart) doc.removeEventListener('mousedown', win.scHandleDragStart);
        const styleEl = doc.getElementById('sc-visual-style');
        if (styleEl) styleEl.remove();
        const tbEl = doc.getElementById('sc-page-toolbar');
        if (tbEl) tbEl.remove();
        return;
    }

    let selectedEl = null;
    let startX = 0, startY = 0, startLeft = 0, startTop = 0;
    let isDragging = false;
    let isEditing = false;
    
    let oldToolbar = doc.getElementById('sc-page-toolbar');
    if (oldToolbar) oldToolbar.remove();

    if (!doc.getElementById('sc-visual-style')) {
        const style = doc.createElement('style');
        style.id = 'sc-visual-style';
        style.textContent = `
            .sc-selected { outline: 2px solid #6366f1 !important; outline-offset: 2px; z-index: 9999; cursor: move; }
            .sc-dragging { opacity: 0.6; }
            .sc-editing { cursor: text !important; outline: 2px dashed #10b981 !important; outline-offset: 4px; min-width: 10px; min-height: 1em; }
            #sc-page-toolbar {
                position: absolute; z-index: 10000; background: #4f46e5; color: white; border: none; padding: 6px 16px; border-radius: 6px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-family: system-ui, sans-serif; font-size: 14px; font-weight: bold;
                cursor: pointer; display: none; align-items: center; gap: 6px; transition: background 0.2s;
            }
            #sc-page-toolbar:hover { background: #4338ca; }
        `;
        doc.head.appendChild(style);
    }

    let toolbarEl = doc.createElement('button');
    toolbarEl.id = 'sc-page-toolbar';
    toolbarEl.innerHTML = `✏️ 双击修改文本`;
    toolbarEl.onmousedown = (e) => {
        e.preventDefault(); e.stopPropagation();
        if (selectedEl) enterEditMode(selectedEl);
    };
    doc.body.appendChild(toolbarEl);

    function deselect() {
        if (selectedEl) {
            selectedEl.classList.remove('sc-selected');
            if (isEditing) {
                selectedEl.removeAttribute('contenteditable');
                selectedEl.classList.remove('sc-editing');
                isEditing = false;
            }
            selectedEl = null;
        }
        if (toolbarEl) toolbarEl.style.display = 'none';
        if (callbacks && callbacks.onSelectionCleared) callbacks.onSelectionCleared();
    }
    win.deselectVisual = deselect;

    function handleSelect(e) {
        if (isDragging || isEditing) return;
        const target = e.target;
        
        if (target === toolbarEl || target.closest('#sc-page-toolbar')) return;

        e.stopPropagation();
        if (target.tagName === 'A') e.preventDefault();
        
        if (target === doc.body || target === doc.documentElement) {
            deselect();
            return;
        }

        if (selectedEl && selectedEl !== target) deselect();
        
        selectedEl = target;
        selectedEl.classList.add('sc-selected');

        if (toolbarEl) {
            const rect = selectedEl.getBoundingClientRect();
            toolbarEl.style.display = 'flex';
            toolbarEl.style.top = Math.max(0, win.scrollY + rect.top - 40) + 'px';
            toolbarEl.style.left = (win.scrollX + rect.left) + 'px';
        }

        const style = win.getComputedStyle(selectedEl);
        if (callbacks && callbacks.onElementSelected) {
            callbacks.onElementSelected({
                tagName: selectedEl.tagName,
                fontSize: style.fontSize,
                color: style.color,
                src: selectedEl.src || null
            });
        }
    }

    function handleDragStart(e) {
        if (!selectedEl || e.target !== selectedEl || isEditing) return;
        e.preventDefault();
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        selectedEl.classList.add('sc-dragging');
        if (toolbarEl) toolbarEl.style.display = 'none';

        const style = win.getComputedStyle(selectedEl);
        if (style.position === 'static') selectedEl.style.position = 'relative';
        
        startLeft = parseFloat(style.left) || 0;
        startTop = parseFloat(style.top) || 0;

        doc.addEventListener('mousemove', handleDragMove);
        doc.addEventListener('mouseup', handleDragEnd);
    }

    function handleDragMove(e) {
        if (!isDragging || !selectedEl) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        selectedEl.style.left = (startLeft + dx) + 'px';
        selectedEl.style.top = (startTop + dy) + 'px';
    }

    function handleDragEnd(e) {
        isDragging = false;
        if (selectedEl) selectedEl.classList.remove('sc-dragging');
        
        if (toolbarEl && selectedEl) {
            const rect = selectedEl.getBoundingClientRect();
            toolbarEl.style.display = 'flex';
            toolbarEl.style.top = Math.max(0, win.scrollY + rect.top - 40) + 'px';
            toolbarEl.style.left = (win.scrollX + rect.left) + 'px';
        }

        doc.removeEventListener('mousemove', handleDragMove);
        doc.removeEventListener('mouseup', handleDragEnd);
        syncCode();
    }

    function enterEditMode(el) {
        if (!el) return;
        isEditing = true;
        el.classList.remove('sc-selected');
        el.classList.add('sc-editing');
        el.contentEditable = 'true';
        if (toolbarEl) toolbarEl.style.display = 'none';
        
        setTimeout(() => {
            win.focus();
            el.focus();
            try {
                const selection = win.getSelection();
                const range = doc.createRange();
                range.selectNodeContents(el);
                selection.removeAllRanges();
                selection.addRange(range);
            } catch(err){}
        }, 50);

        const onBlur = () => {
            el.contentEditable = 'false';
            el.classList.remove('sc-editing');
            isEditing = false;
            el.removeEventListener('blur', onBlur);
            el.removeEventListener('keydown', onKeyDown);
            syncCode();
        };

        const onKeyDown = (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                el.blur();
            }
        };

        el.addEventListener('blur', onBlur);
        el.addEventListener('keydown', onKeyDown);
    }

    function syncCode() {
        const clone = doc.documentElement.cloneNode(true);
        const toRemove = ['sc-visual-style', 'sc-page-toolbar', 'sc-preview-reset'];
        toRemove.forEach(id => {
            const el = clone.querySelector(`#${id}`);
            if (el) el.remove();
        });

        const selected = clone.querySelector('.sc-selected');
        if (selected) selected.classList.remove('sc-selected');
        const dragging = clone.querySelector('.sc-dragging');
        if (dragging) dragging.classList.remove('sc-dragging');
        const editables = clone.querySelectorAll('[contenteditable]');
        editables.forEach(el => el.removeAttribute('contenteditable'));
        const editing = clone.querySelector('.sc-editing');
        if (editing) editing.classList.remove('sc-editing');

        const styles = clone.querySelectorAll('style');
        styles.forEach(style => {
            if (style.textContent && (style.textContent.includes('--tw-border-spacing-x:0') || style.textContent.includes('--tw-rotate:0'))) {
                style.remove();
            }
        });

        const doctype = doc.doctype;
        const doctypeString = doctype ? `<!DOCTYPE ${doctype.name}${doctype.publicId ? ` PUBLIC "${doctype.publicId}"` : ''}${doctype.systemId ? ` "${doctype.systemId}"` : ''}>` : '<!DOCTYPE html>';
        
        const fullHtml = doctypeString + '\n' + clone.outerHTML;
        if (callbacks && callbacks.onCodeUpdate) {
            callbacks.onCodeUpdate(fullHtml);
        }
    }

    win.updateSelectedStyle = function(key, value) {
        if (!selectedEl) return;
        
        if (key === 'fontSize') {
            let current = parseFloat(win.getComputedStyle(selectedEl).fontSize);
            if (value === 'up') selectedEl.style.fontSize = (current + 2) + 'px';
            if (value === 'down') selectedEl.style.fontSize = Math.max(8, current - 2) + 'px';
        } else if (key === 'color') {
            selectedEl.style.color = value;
        } else if (key === 'bold') {
            let fw = win.getComputedStyle(selectedEl).fontWeight;
            selectedEl.style.fontWeight = (fw === 'bold' || parseInt(fw) >= 700) ? 'normal' : 'bold';
        } else if (key === 'italic') {
            selectedEl.style.fontStyle = win.getComputedStyle(selectedEl).fontStyle === 'italic' ? 'normal' : 'italic';
        } else if (key === 'underline') {
            let td = win.getComputedStyle(selectedEl).textDecoration;
            selectedEl.style.textDecoration = td.includes('underline') ? 'none' : 'underline';
        } else if (key === 'delete') {
            selectedEl.remove();
            deselect();
        } else if (key === 'editText') {
            enterEditMode(selectedEl);
            return;
        }
        syncCode();
    };

    if (win.scHandleSelect) doc.removeEventListener('click', win.scHandleSelect, true);
    if (win.scHandleDragStart) doc.removeEventListener('mousedown', win.scHandleDragStart);
    
    win.scHandleSelect = handleSelect;
    win.scHandleDragStart = handleDragStart;

    doc.addEventListener('click', handleSelect, true);
    doc.addEventListener('mousedown', handleDragStart);
};

// 极简离线内联渲染缩略图（删除了 Baomitu 的外部链接依赖）
const injectThumb = (html) => `<!DOCTYPE html><html><head><script>function fit(){const w=document.documentElement.clientWidth;const s=w/1344;document.body.style.transform=\`scale(\${s})\`;document.body.style.transformOrigin='top left';}window.onload=fit;window.onresize=fit;</script><style>
:root { color-scheme: light; forced-color-adjust: none !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
body{margin:0;width:1344px;height:816px;overflow:hidden;background:white;} ::-webkit-scrollbar{display:none;}
</style></head><body>${html}</body></html>`;

const SlideThumbnail = React.memo(({ slide, index, isActive, onClick, onDelete, onDragStart, onDragOver, onDrop, isDragging }) => {
    return (
        <div 
            draggable="true"
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={(e) => onDragOver(e, index)}
            onDrop={(e) => onDrop(e, index)}
            onClick={() => onClick(index)}
            className={`relative thumbnail-wrapper bg-white rounded cursor-pointer border-2 overflow-hidden group 
                ${isActive ? 'thumbnail-active border-gray-700 opacity-70 hover:opacity-100 hover:border-gray-500 hover:shadow-lg' : ''}
                ${isDragging ? 'thumbnail-dragging' : ''}`}
            style={{ aspectRatio: '1.647', flexShrink: 0, transform: isActive ? 'scale(1.02)' : 'scale(1)' }}
        >
            <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <iframe srcDoc={injectThumb(slide.html)} className="w-full h-full border-none" loading="lazy"></iframe>
            </div>
            <div className="absolute inset-0 z-10" onClick={() => onClick(index)}></div>
            <span className="absolute top-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded backdrop-blur-sm z-20 font-mono shadow pointer-events-none">{index + 1}</span>
            <button onClick={(e) => { e.stopPropagation(); onDelete(e, index); }}
                className="absolute top-1 right-1 bg-red-500/90 text-white p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-opacity z-30 cursor-pointer shadow-sm">
                <Icons.Trash />
            </button>
        </div>
    );
}, (prev, next) => {
    return prev.slide.html === next.slide.html && prev.isActive === next.isActive && prev.index === next.index && prev.isDragging === next.isDragging;
});

const setupSmartScroll = (iframe) => {
    try {
        const win = iframe.contentWindow;
        if (!win) return;

        const isScrollContainer = (el) => {
            if (!el || el === win.document.body || el === win.document.documentElement) return false;
            const style = win.getComputedStyle(el);
            const isOverflow = style.overflowY === 'auto' || style.overflowY === 'scroll';
            const hasScrollableContent = el.scrollHeight > el.clientHeight;
            if (isOverflow && hasScrollableContent) return true;
            return isScrollContainer(el.parentElement);
        };

        if (win.scWheelHandler) win.removeEventListener('wheel', win.scWheelHandler, { passive: false });
        if (win.scKeydownHandler) win.removeEventListener('keydown', win.scKeydownHandler);

        win.scWheelHandler = (event) => {
            if (isScrollContainer(event.target)) {
                event.stopPropagation();
                return;
            }
            event.preventDefault();
            const newEvent = new WheelEvent('wheel', { ...event, deltaY: event.deltaY, bubbles: true, cancelable: true, view: window });
            window.dispatchEvent(newEvent);
        };

        win.scKeydownHandler = (event) => {
            if (event.target.isContentEditable || event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;
            const newEvent = new KeyboardEvent('keydown', { key: event.key, code: event.code, keyCode: event.keyCode, bubbles: true, cancelable: true, view: window });
            window.dispatchEvent(newEvent);
            if (['ArrowRight', 'ArrowDown', ' ', 'Enter', 'PageDown', 'ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace', 'Escape'].includes(event.key)) {
                event.preventDefault();
            }
        };

        win.addEventListener('wheel', win.scWheelHandler, { passive: false });
        win.addEventListener('keydown', win.scKeydownHandler);
    } catch (err) {
        console.warn('Iframe setup failed', err);
    }
};

// 🔥 离线分享预览组件 (完全剥离了对外部 Tailwind 的网络请求)
function SharedPresentation({ projectId }) {
    const [slides, setSlides] = React.useState([]);
    const [status, setStatus] = React.useState('loading');
    const [activeIdx, setActiveIdx] = React.useState(0);
    const [presScale, setPresScale] = React.useState(1);
    const lastWheelTime = React.useRef(0);

    React.useLayoutEffect(() => {
        const l = document.getElementById('loading-text');
        if (l) l.style.display = 'none';
    }, []);

    React.useEffect(() => {
        let isMounted = true;
        const fetchProject = async () => {
            try {
                // 直接只拉取项目数据，不再阻塞加载外部 CSS
                const d = await api.getProjectDetails(projectId);
                if (!isMounted) return;
                
                const finalSlides = (d.slides && d.slides.length) ? d.slides : DEFAULT_SLIDES;
                setSlides(finalSlides);
                setStatus('ready');
            } catch (e) {
                if (!isMounted) return;
                setStatus('error');
            }
        };
        fetchProject();
        return () => { isMounted = false; };
    }, [projectId]);

    React.useEffect(() => {
        if (status !== 'ready') return;
        const handleResize = () => { setPresScale(Math.min(window.innerWidth / 1344, window.innerHeight / 816)); };
        handleResize();

        const handleKey = (e) => {
            if (e.target && (e.target.isContentEditable || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
            if (['ArrowRight', 'ArrowDown', ' ', 'Enter', 'PageDown'].includes(e.key)) {
                setActiveIdx(prev => Math.min(slides.length - 1, prev + 1));
            } else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(e.key)) {
                setActiveIdx(prev => Math.max(0, prev - 1));
            }
        };

        const handleWheel = (e) => {
            const now = Date.now();
            if (now - lastWheelTime.current < 250) return;
            if (Math.abs(e.deltaY) > 20) {
                if (e.deltaY > 0) setActiveIdx(prev => Math.min(slides.length - 1, prev + 1));
                else setActiveIdx(prev => Math.max(0, prev - 1));
                lastWheelTime.current = now;
            }
        };

        window.addEventListener('keydown', handleKey);
        window.addEventListener('resize', handleResize);
        window.addEventListener('wheel', handleWheel, { passive: false });
        return () => {
            window.removeEventListener('keydown', handleKey);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('wheel', handleWheel);
        };
    }, [status, slides.length]);

    const handleIframeLoad = (e) => {
        if (typeof setupSmartScroll === 'function') setupSmartScroll(e.target);
    };

    const getOfflineReadyHtml = () => {
        if (!slides[activeIdx]) return '';
        // 不再强制插入外部链接
        return injectPreview(slides[activeIdx].html);
    };

    if (status === 'loading') return <div className="flex h-screen items-center justify-center bg-gray-900 text-white font-sans text-xl">加载中...</div>;
    if (status === 'error') return <div className="flex h-screen items-center justify-center bg-gray-900 text-red-500 font-sans text-xl">加载失败或项目不存在</div>;

    return (
        <div className="presentation-overlay" style={{ background: '#000', margin: 0, padding: 0 }}>
            <div style={{ width: '1344px', height: '816px', transform: `scale(${presScale})`, transformOrigin: 'center', background: 'white', position: 'relative', boxShadow: '0 0 50px rgba(0,0,0,0.5)' }}>
                <iframe srcDoc={getOfflineReadyHtml()} onLoad={handleIframeLoad} style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}></iframe>
            </div>
            <div style={{ position: 'absolute', bottom: '16px', right: '24px', background: 'rgba(0,0,0,0.2)', color: 'rgba(255,255,255,0.7)', padding: '4px 12px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '12px', pointerEvents: 'none', backdropFilter: 'blur(2px)', zIndex: 50 }}>
                {activeIdx + 1} / {slides.length}
            </div>
        </div>
    );
}

function AuthPage({ onLogin }) {
    const [isReg, setIsReg] = React.useState(false);
    const [u, setU] = React.useState('');
    const [p, setP] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const sub = async () => {
        if(!u || !p) return alert("请填写完整");
        setLoading(true);
        try {
            if (isReg) {
                await api.register(u, p);
                alert("注册成功，请登录");
                setIsReg(false);
            } else {
                const res = await api.login(u, p);
                if (!res || !res.id) throw new Error(res?.error || "登录失败: 返回数据异常");
                onLogin({ username: res.username, id: res.id });
            }
        } catch (e) {
            alert("错误: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-900 text-white w-full">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-700">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-4"><Icons.Slideshow /></div>
                    <h2 className="text-2xl font-bold">SlideCraft Pro</h2>
                    <p className="text-gray-400 text-sm mt-1">{isReg ? '创建新账户' : '登录您的账户'}</p>
                </div>
                <input value={u} onChange={e=>setU(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 mb-3 text-white focus:border-indigo-500 outline-none" placeholder="用户名" />
                <input type="password" value={p} onChange={e=>setP(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 mb-6 text-white focus:border-indigo-500 outline-none" placeholder="密码" />
                <button onClick={sub} disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading && <span className="animate-spin">⏳</span>}
                    {isReg ? '注 册' : '登 录'}
                </button>
                <div className="mt-6 text-center text-sm text-gray-400 cursor-pointer hover:text-indigo-400" onClick={()=>setIsReg(!isReg)}>
                    {isReg ? '已有账户？点击登录' : '没有账户？点击注册'}
                </div>
            </div>
        </div>
    );
}

function Editor({ user, onLogout }) {
    const [view, setView] = React.useState('dashboard');
    const [currId, setCurrId] = React.useState(null);
    const [projects, setProjects] = React.useState([]);
    const [slides, setSlides] = React.useState([]);
    const [title, setTitle] = React.useState('');
    const [activeIdx, setActiveIdx] = React.useState(0);
    const [code, setCode] = React.useState('');
    const [previewHtml, setPreviewHtml] = React.useState('');
    const [showCode, setShowCode] = React.useState(false);
    const [status, setStatus] = React.useState('idle');
    const [savedSlides, setSavedSlides] = React.useState([]);
    const [savedTitle, setSavedTitle] = React.useState('');
    const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
    const [editorH, setEditorH] = React.useState(300);
    const [isDragging, setIsDragging] = React.useState(false);
    const [scale, setScale] = React.useState(0.5);
    const [pos, setPos] = React.useState({ left: '50%', top: '50%' });
    const [draggedItem, setDraggedItem] = React.useState(null);
    const replaceFileRef = React.useRef(null);
    const [oldImgUrl, setOldImgUrl] = React.useState('');
    
    const [isPresenting, setIsPresenting] = React.useState(false);
    const [presScale, setPresScale] = React.useState(1);
    
    const [isVisualMode, setIsVisualMode] = React.useState(false);
    const [selectedElement, setSelectedElement] = React.useState(null);

    const [showPwdModal, setShowPwdModal] = React.useState(false);
    const [pwdCallback, setPwdCallback] = React.useState(null);
    const [inputPwd, setInputPwd] = React.useState('');
    const [cursorPos, setCursorPos] = React.useState(null);

    const [aiPrompt, setAiPrompt] = React.useState('');
    const [isAiGenerating, setIsAiGenerating] = React.useState(false);

    const stageRef = React.useRef(null);
    const fileRef = React.useRef(null);
    const iframeRef = React.useRef(null);
    const timerRef = React.useRef(null);
    const lastWheelTime = React.useRef(0);
    const textareaRef = React.useRef(null);

    const handleManualSave = React.useCallback(() => {
        if (!hasUnsavedChanges || status === 'saved') return;
        setStatus('saving');
        api.saveProject(currId, slides, title)
            .then(() => {
                setStatus('saved');
                setSavedSlides(slides);
                setSavedTitle(title);
                setHasUnsavedChanges(false);
            })
            .catch(e => { setStatus('error'); });
    }, [currId, slides, title, hasUnsavedChanges, status]);

    const handleDiscard = React.useCallback(() => {
        if (!window.confirm("确定要放弃所有未保存的修改吗？将恢复到上一次保存的状态。")) return;
        setSlides(savedSlides);
        setTitle(savedTitle);
        setHasUnsavedChanges(false);
        setCode(savedSlides[activeIdx]?.html || '');
        setPreviewHtml(savedSlides[activeIdx]?.html || '');
        setStatus('saved');
    }, [savedSlides, savedTitle, activeIdx]);

    React.useEffect(() => {
        if (!hasUnsavedChanges) return;
        const timer = setInterval(() => { handleManualSave(); }, 5 * 60 * 1000); 
        return () => clearInterval(timer);
    }, [hasUnsavedChanges, handleManualSave]);

    const loadProjs = React.useCallback(() => {
        if (!user || !user.id) { setStatus('idle'); return; }
        setStatus('loading');
        api.getProjects(user.id).then(setProjects).catch(e => console.error(e)).finally(() => setStatus('idle'));
    }, [user]);

    const createProj = async () => {
        if (!user || !user.id) { alert('请先登录'); onLogout(); return; }
        const t = prompt('请输入PPT标题:');
        if (!t) return;
        try {
            const res = await api.createProject(user.id, t);
            openProj(res.id);
        } catch(e) { alert(e.message); }
    };

    const openProj = (id) => {
        setCurrId(id);
        api.getProjectDetails(id).then(d => {
            const s = (d.slides && d.slides.length) ? d.slides : DEFAULT_SLIDES;
            setSlides(s); setTitle(d.title); setCode(s[0].html); setPreviewHtml(s[0].html); setActiveIdx(0);
            setStatus('saved'); setView('editor'); setSavedSlides(s); setSavedTitle(d.title); setHasUnsavedChanges(false);
        }).catch(e => { alert("打开失败: " + e.message); setView('dashboard'); });
    };

    const requestPassword = (actionCallback) => {
        setPwdCallback(() => actionCallback);
        setInputPwd('');
        setShowPwdModal(true);
    };

    const confirmPassword = () => {
        if (inputPwd === '526') {
            if (pwdCallback) pwdCallback();
            setShowPwdModal(false);
        } else {
            alert('密码错误！');
            setInputPwd('');
        }
    };

    const delProj = (e, id) => {
        e.stopPropagation();
        requestPassword(async () => {
            await api.deleteProject(id);
            loadProjs();
        });
    };

    React.useEffect(() => { if (view === 'dashboard') loadProjs(); }, [view, loadProjs]);

    const onCodeChange = (e) => {
        const val = e.target.value;
        setCode(val);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setPreviewHtml(val);
            setSlides(prev => {
                const n = [...prev]; n[activeIdx] = { ...n[activeIdx], html: val };
                setHasUnsavedChanges(true); setStatus('idle'); return n;
            });
        }, 500);
    };

    const handleAiSubmit = async (e) => {
        if(e) e.preventDefault();
        if (!aiPrompt.trim()) return;
        setIsAiGenerating(true);
        try {
            const context = {
                currentHtml: slides[activeIdx].html,
                selectedTagName: selectedElement ? selectedElement.tagName : null,
                userMessage: aiPrompt
            };
            const response = await fetch(`${SERVER_URL}/generate-slide`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(context)
            });
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'AI 生成失败');
            }
            const data = await response.json();
            updateSlideFromVisual(data.newHtml);
            setAiPrompt('');
        } catch (error) {
            alert('AI 请求失败: ' + error.message);
        } finally {
            setIsAiGenerating(false);
        }
    };

    const updateSlideFromVisual = (newHtml) => {
        setCode(newHtml);
        setPreviewHtml(newHtml); 
        
        setSlides(prev => {
            const n = [...prev];
            n[activeIdx] = { ...n[activeIdx], html: newHtml };
            return n;
        });
        setHasUnsavedChanges(true);
        setStatus('idle');
    };

    const switchSlide = (i) => {
        if (i < 0 || i >= slides.length) return;
        setActiveIdx(i); setCode(slides[i].html); setPreviewHtml(slides[i].html);
    };

    const handleWheel = (e) => {
        const now = Date.now();
        if (now - lastWheelTime.current < 250) return;
        if (Math.abs(e.deltaY) > 20) {
            setActiveIdx(prev => {
                const next = e.deltaY > 0 ? Math.min(slides.length - 1, prev + 1) : Math.max(0, prev - 1);
                if (next !== prev) {
                    lastWheelTime.current = now;
                    setTimeout(() => switchSlide(next), 0);
                }
                return prev;
            });
        }
    };

    // 🔥 导出完全离线版，抛弃外部依赖 🔥
    const handleExportOfflineHTML = async () => {
        setStatus('loading');
        try {
            const urlToBase64 = async (url) => {
                try {
                    if (url.startsWith('data:image')) return url;
                    const response = await fetch(url);
                    const blob = await response.blob();
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                    });
                } catch (err) {
                    console.warn('图片转Base64失败，保留原URL', url, err);
                    return url;
                }
            };

            const processedSlides = await Promise.all(slides.map(async (slide) => {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = slide.html;
                const imgs = tempDiv.querySelectorAll('img');
                for (let i = 0; i < imgs.length; i++) {
                    const img = imgs[i];
                    if (img.src) {
                        img.src = await urlToBase64(img.src);
                    }
                }
                return tempDiv.innerHTML;
            }));

            // 不再引入外部 tailwind.min.css
            const standaloneHTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - SlideCraft 离线演示</title>
    <style>
        :root { color-scheme: light; }
        body, html { 
            margin: 0 !important; 
            padding: 0 !important; 
            width: 100vw; 
            height: 100vh; 
            overflow: hidden; 
            background-color: #000; 
            font-family: system-ui, -apple-system, sans-serif;
            box-sizing: border-box !important;
        }
        .sc-slide-wrapper { 
            display: none; 
            width: 100vw; 
            height: 100vh; 
            align-items: center; 
            justify-content: center; 
            position: absolute; 
            top: 0; 
            left: 0; 
        }
        .sc-slide-wrapper.active { 
            display: flex; 
        }
        .sc-slide-content { 
            width: 1344px !important; 
            height: 816px !important; 
            min-width: 1344px !important;
            min-height: 816px !important;
            max-width: 1344px !important;
            max-height: 816px !important;
            background: white; 
            position: relative; 
            transform-origin: center center; 
            overflow: hidden !important; 
            box-shadow: 0 0 50px rgba(0,0,0,0.5);
        }
        .sc-slide-content > div {
            width: 100% !important; 
            height: 100% !important; 
            max-width: 1344px !important; 
            max-height: 816px !important; 
            overflow: hidden !important; 
            margin: 0 !important;
        }
        .sc-slide-content * {
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
        }
        .sc-slide-content img, .sc-slide-content svg, .sc-slide-content video {
            max-width: 100% !important;
            max-height: 100% !important;
        }
        .page-indicator {
            position: absolute; bottom: 20px; left: 20px; color: rgba(255,255,255,0.7); font-family: monospace; font-size: 14px; z-index: 100; background: rgba(0,0,0,0.4); padding: 4px 12px; border-radius: 6px;
        }
    </style>
</head>
<body>
    ${processedSlides.map((html, i) => `
        <div class="sc-slide-wrapper ${i === 0 ? 'active' : ''}">
            <div class="sc-slide-content">
                ${html}
            </div>
        </div>
    `).join('')}
    <div class="page-indicator" id="page-indicator">1 / ${processedSlides.length}</div>
    <script>
        let currentIndex = 0;
        const slides = document.querySelectorAll('.sc-slide-wrapper');
        const indicator = document.getElementById('page-indicator');
        const total = slides.length;

        function updateScale() {
            const scale = Math.min(window.innerWidth / 1344, window.innerHeight / 816);
            document.querySelectorAll('.sc-slide-content').forEach(el => {
                el.style.transform = \`scale(\${scale})\`;
            });
        }
        window.addEventListener('resize', updateScale);
        updateScale();

        function switchSlide(index) {
            if(index < 0 || index >= total) return;
            slides[currentIndex].classList.remove('active');
            currentIndex = index;
            slides[currentIndex].classList.add('active');
            indicator.innerText = (currentIndex + 1) + ' / ' + total;
        }

        window.addEventListener('keydown', (e) => {
            if (['ArrowRight', 'ArrowDown', ' ', 'Enter', 'PageDown'].includes(e.key)) switchSlide(currentIndex + 1);
            else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(e.key)) switchSlide(currentIndex - 1);
        });

        let lastWheelTime = 0;
        window.addEventListener('wheel', (e) => {
            const now = Date.now();
            if (now - lastWheelTime < 250) return;
            if (Math.abs(e.deltaY) > 20) {
                if (e.deltaY > 0) switchSlide(currentIndex + 1);
                else switchSlide(currentIndex - 1);
                lastWheelTime = now;
            }
        }, { passive: true });
    </script>
</body>
</html>`;

            const blob = new Blob([standaloneHTML], { type: 'text/html;charset=utf-8' });
            const downloadUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `${title || 'SlideCraft'}_Presentation.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(downloadUrl);
            setStatus('idle');
        } catch (error) {
            console.error('导出失败:', error);
            alert('导出离线文件失败: ' + error.message);
            setStatus('error');
        }
    };

    const handleDragStart = (e, index) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', index);
        setDraggedItem(index);
    };

    const handleDragOver = (e, index) => { e.preventDefault(); };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
        if (dragIndex === dropIndex) { setDraggedItem(null); return; }
        
        setSlides(prev => {
            const newSlides = [...prev];
            const [removed] = newSlides.splice(dragIndex, 1);
            newSlides.splice(dropIndex, 0, removed);
            setHasUnsavedChanges(true);
            
            let newActiveIdx = activeIdx;
            if (activeIdx === dragIndex) {
                newActiveIdx = dropIndex;
            } else if (activeIdx > dragIndex && activeIdx <= dropIndex) {
                newActiveIdx = activeIdx - 1;
            } else if (activeIdx < dragIndex && activeIdx >= dropIndex) {
                newActiveIdx = activeIdx + 1;
            }
            setActiveIdx(newActiveIdx);
            
            return newSlides;
        });
        setDraggedItem(null);
    };

    const calcFit = React.useCallback(() => {
        if (!stageRef.current) return;
        const { clientWidth: cw, clientHeight: ch } = stageRef.current;
        const p = 40;
        const s = Math.min((cw - p) / 1344, (ch - p) / 816);
        setScale(Math.max(0.1, s));
    }, []);

    React.useEffect(() => {
        if (view === 'editor') {
            calcFit();
            window.addEventListener('resize', calcFit);
            return () => window.removeEventListener('resize', calcFit);
        }
    }, [calcFit, view, editorH]);

    const startDrag = (e) => { setIsDragging(true); e.preventDefault(); };

    React.useEffect(() => {
        const mv = (e) => {
            if (isDragging) {
                const h = window.innerHeight - e.clientY;
                if(h>100 && h<window.innerHeight-100) setEditorH(h);
            }
        };
        const up = () => setIsDragging(false);
        if(isDragging) {
            window.addEventListener('mousemove', mv);
            window.addEventListener('mouseup', up);
        }
        return () => { window.removeEventListener('mousemove', mv); window.removeEventListener('mouseup', up); };
    }, [isDragging]);

    const addSlide = () => {
        setSlides(prev => {
            const n = [...prev, { id: Date.now(), html: DEFAULT_SLIDES[0].html }];
            setHasUnsavedChanges(true);
            setTimeout(() => switchSlide(n.length - 1), 50);
            return n;
        });
    };

    const delSlide = (e, i) => {
        e.stopPropagation();
        requestPassword(() => {
            setSlides(prev => {
                if(prev.length <= 1) { alert("最后一张啦"); return prev; }
                const n = prev.filter((_, x) => x !== i);
                setHasUnsavedChanges(true);
                if (i === activeIdx) { switchSlide(Math.max(0, i - 1)); }
                else if (i < activeIdx) { setActiveIdx(activeIdx - 1); }
                return n;
            });
        });
    };

    const uploadImg = async (e) => {
        const f = e.target.files[0];
        if (!f) return;
        try {
            setStatus('loading');
            const options = { maxSizeMB: 0.4, maxWidthOrHeight: 1920, useWebWorker: true };
            const compressedFile = typeof imageCompression !== 'undefined' ? await imageCompression(f, options) : f;
            const url = await api.uploadImage(compressedFile);
            const tag = `<img src="${url}" style="max-width:100%; object-fit:cover;" />`;
            
            let newCode;
            const textarea = textareaRef.current;
            if (textarea) {
                const currentScrollTop = textarea.scrollTop;
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                newCode = code.substring(0, start) + tag + code.substring(end);
                const newPos = start + tag.length;
                
                setTimeout(() => {
                    if (textareaRef.current) {
                        textareaRef.current.focus();
                        textareaRef.current.setSelectionRange(newPos, newPos);
                        textareaRef.current.scrollTop = currentScrollTop;
                    }
                }, 50);
                setCursorPos(newPos);
            } else {
                newCode = code + tag;
            }

            setCode(newCode);
            setPreviewHtml(newCode);
            setSlides(prev => {
                const ns = [...prev];
                ns[activeIdx] = { ...ns[activeIdx], html: newCode };
                setHasUnsavedChanges(true);
                return ns;
            });
        } catch (err) { alert(err.message); } finally { setStatus('idle'); e.target.value = null; }
    };

    const handleReplaceImg = async (e) => {
        const f = e.target.files[0];
        if (!f || !oldImgUrl) return;
        try {
            setStatus('loading');
            const options = { maxSizeMB: 0.4, maxWidthOrHeight: 1920, useWebWorker: true };
            const compressedFile = typeof imageCompression !== 'undefined' ? await imageCompression(f, options) : f;
            const newUrl = await api.uploadImage(compressedFile);
            
            const newCode = code.split(oldImgUrl).join(newUrl);
            setCode(newCode);
            setPreviewHtml(newCode);
            setSlides(prev => {
                const ns = [...prev];
                ns[activeIdx] = { ...ns[activeIdx], html: newCode };
                setHasUnsavedChanges(true);
                return ns;
            });
        } catch (err) { alert(err.message); } finally { setStatus('idle'); e.target.value = null; }
    };

    const enterPresentation = () => {
        if(isVisualMode) toggleVisualMode();
        setIsPresenting(true);
        const s = Math.min(window.innerWidth / 1344, window.innerHeight / 816);
        setPresScale(s);
        const elem = document.documentElement;
        if (elem.requestFullscreen) elem.requestFullscreen().catch(()=>{});
    };

    const exitPresentation = React.useCallback(() => {
        setIsPresenting(false);
        if (document.exitFullscreen && document.fullscreenElement) document.exitFullscreen().catch(()=>{});
    }, []);

    const handlePresIframeLoad = (e) => { setupSmartScroll(e.target); };

    React.useEffect(() => {
        if (!isPresenting) return;
        const handleKey = (e) => {
            if (['ArrowRight', 'ArrowDown', ' ', 'Enter', 'PageDown'].includes(e.key)) { switchSlide(Math.min(slides.length - 1, activeIdx + 1)); } 
            else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(e.key)) { switchSlide(Math.max(0, activeIdx - 1)); } 
            else if (e.key === 'Escape') { exitPresentation(); }
        };
        const handlePresWheel = (e) => {
            const now = Date.now();
            if (now - lastWheelTime.current < 250) return;
            if (Math.abs(e.deltaY) > 20) {
                if (e.deltaY > 0) { if (activeIdx < slides.length - 1) { switchSlide(activeIdx + 1); lastWheelTime.current = now; } } 
                else { if (activeIdx > 0) { switchSlide(activeIdx - 1); lastWheelTime.current = now; } }
            }
        };
        window.addEventListener('keydown', handleKey);
        window.addEventListener('wheel', handlePresWheel);
        const handleResize = () => { setPresScale(Math.min(window.innerWidth / 1344, window.innerHeight / 816)); };
        window.addEventListener('resize', handleResize);
        return () => { window.removeEventListener('keydown', handleKey); window.removeEventListener('wheel', handlePresWheel); window.removeEventListener('resize', handleResize); };
    }, [isPresenting, activeIdx, slides.length, exitPresentation]);

    const toggleVisualMode = () => {
        const newState = !isVisualMode;
        setIsVisualMode(newState);
        setSelectedElement(null);
        
        const win = iframeRef.current?.contentWindow;
        if (win) {
            if (newState) {
                if (win.enableVisual) win.enableVisual();
            } else {
                if (win.disableVisual) win.disableVisual();
            }
        }
    };

    React.useEffect(() => {
        const handler = (e) => {
            if (e.data.type === 'ELEMENT_SELECTED') {
                setSelectedElement(e.data.payload);
            } else if (e.data.type === 'SELECTION_CLEARED') {
                setSelectedElement(null);
            } else if (e.data.type === 'CODE_UPDATE') {
                updateSlideFromVisual(e.data.payload);
            }
        };
        window.addEventListener('message', handler);
        return () => window.removeEventListener('message', handler);
    }, [activeIdx, slides, currId]);
    
    React.useEffect(() => {
        if (iframeRef.current && status !== 'loading') {
            window.initVisualEditor(iframeRef.current, isVisualMode, {
                onElementSelected: (payload) => setSelectedElement(payload),
                onSelectionCleared: () => setSelectedElement(null),
                onCodeUpdate: (fullHtml) => updateSlideFromVisual(fullHtml)
            });
        }
    }, [isVisualMode, status]);

    const handleEditorLoad = () => {
        if (iframeRef.current) {
            setupSmartScroll(iframeRef.current);
            window.initVisualEditor(iframeRef.current, isVisualMode, {
                onElementSelected: (payload) => setSelectedElement(payload),
                onSelectionCleared: () => setSelectedElement(null),
                onCodeUpdate: (fullHtml) => updateSlideFromVisual(fullHtml)
            });
        }
    };

    const execVisualCmd = (key, val) => {
        const win = iframeRef.current?.contentWindow;
        if (win && win.updateSelectedStyle) {
            win.updateSelectedStyle(key, val);
        }
    };

    const StatusTag = () => { const st = { exporting: {bg:'rgba(59,130,246,0.2)', c:'#60a5fa', t: '导出中'}, saving: {bg:'rgba(234,179,8,0.2)', c:'#facc15', t:'保存中'}, error: {bg:'rgba(239,68,68,0.2)', c:'#f87171', t:'未保存'}, saved: {bg:'rgba(34,197,94,0.2)', c:'#4ade80', t:'已保存'} }[status] || {bg:'transparent', c:'transparent', t:''}; return <span style={{padding:'2px 8px', borderRadius:'4px', background:st.bg, color:st.c, fontSize:'0.75rem', whiteSpace:'nowrap'}}>{st.t}</span>; };

    if (view === 'dashboard') {
        return (
            <div style={{ height: '100%', width: '100%', overflowY: 'auto', padding: '40px', background: '#111827' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ color: '#6366f1' }}><Icons.Slideshow /></span> SlideCraft Pro
                        </h1>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <button onClick={onLogout} style={{ color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#1f2937', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><Icons.SignOut /> 退出登录</button>
                            <button onClick={createProj} style={{ background: '#4f46e5', color: 'white', padding: '8px 24px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', cursor: 'pointer' }}><Icons.Plus /> 新建PPT</button>
                        </div>
                    </div>
                    {showPwdModal && (
                        <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', zIndex:99999, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(4px)'}}>
                            <div style={{background:'#1f2937', padding:'24px', borderRadius:'12px', boxShadow:'0 25px 50px -12px rgba(0, 0, 0, 0.5)', border:'1px solid #374151', width:'320px'}}>
                                <h3 style={{fontSize:'1.25rem', fontWeight:'bold', marginBottom:'16px', color:'white'}}>请输入操作密码</h3>
                                <p style={{color:'#9ca3af', fontSize:'0.875rem', marginBottom:'16px'}}>删除项目是敏感操作，请输入密码确认。</p>
                                <input type="password" autoFocus value={inputPwd} onChange={e => setInputPwd(e.target.value)} style={{width:'100%', background:'#111827', border:'1px solid #374151', borderRadius:'6px', padding:'8px 12px', color:'white', marginBottom:'16px', outline:'none'}} placeholder="密码" onKeyDown={e => {if (e.key === 'Enter') confirmPassword();}} />
                                <div style={{display:'flex', justifyContent:'flex-end', gap:'12px'}}>
                                    <button onClick={() => setShowPwdModal(false)} style={{padding:'6px 16px', borderRadius:'6px', background:'none', color:'#d1d5db', cursor:'pointer', border:'none'}}>取消</button>
                                    <button onClick={confirmPassword} style={{padding:'6px 16px', borderRadius:'6px', background:'#4f46e5', color:'white', fontWeight:'bold', cursor:'pointer', border:'none'}}>确认</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {status === 'loading' ? (
                        <div style={{ textAlign: 'center', color: '#6b7280', padding: '80px' }}>加载中...</div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
                            {projects.map((p, index) => (
                                <div key={p.id} onClick={() => openProj(p.id)} style={{ background: '#1f2937', borderRadius: '12px', border: '1px solid #374151', cursor: 'pointer', overflow: 'hidden', aspectRatio: '4/3', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.2)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'; }}>
                                    <button onClick={(e) => delProj(e, p.id)} style={{ position: 'absolute', top: '8px', right: '8px', padding: '8px', background: 'rgba(0,0,0,0.5)', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', backdropFilter: 'blur(4px)' }}><Icons.Trash /></button>
                                    <div style={{ flex: 1, background: gradients[index % gradients.length], display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                                        <span style={{ fontSize: '4.5rem', fontWeight: 900, color: 'rgba(255,255,255,0.25)', textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>{p.title ? p.title.charAt(0).toUpperCase() : 'P'}</span>
                                    </div>
                                    <div style={{ padding: '16px', borderTop: '1px solid #374151', background: '#111827' }}>
                                        <h3 style={{ fontWeight: 'bold', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</h3>
                                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '4px 0 0' }}>{new Date(p.updated_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                            {projects.length === 0 && (
                                <div onClick={createProj} style={{ border: '2px dashed #374151', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#6b7280', cursor: 'pointer', aspectRatio: '4/3' }}>
                                    <Icons.Plus /> <span style={{ marginTop: '8px' }}>新建幻灯片</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="app-layout">
            {isPresenting && (
                <div className="presentation-overlay">
                    <div style={{ width: '1344px', height: '816px', transform: `scale(${presScale})`, transformOrigin: 'center', background: 'white', position: 'relative', boxShadow: '0 0 50px rgba(0,0,0,0.5)' }}>
                        <iframe srcDoc={injectPreview(slides[activeIdx].html)} style={{ width: '100%', height: '100%', border: 'none', display: 'block' }} onLoad={handlePresIframeLoad}></iframe>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); exitPresentation(); }} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10000 }} title="退出放映 (ESC)"><Icons.X /></button>
                    <div style={{ position: 'absolute', bottom: '20px', left: '20px', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', fontSize: '14px', pointerEvents: 'none' }}>{activeIdx + 1} / {slides.length}</div>
                </div>
            )}
            
            {showPwdModal && (
                <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', zIndex:99999, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(4px)'}}>
                    <div style={{background:'#1f2937', padding:'24px', borderRadius:'12px', boxShadow:'0 25px 50px -12px rgba(0, 0, 0, 0.5)', border:'1px solid #374151', width:'320px'}}>
                        <h3 style={{fontSize:'1.25rem', fontWeight:'bold', marginBottom:'16px', color:'white'}}>请输入操作密码</h3>
                        <p style={{color:'#9ca3af', fontSize:'0.875rem', marginBottom:'16px'}}>删除幻灯片是敏感操作，请输入密码确认。</p>
                        <input type="password" autoFocus value={inputPwd} onChange={e => setInputPwd(e.target.value)} style={{width:'100%', background:'#111827', border:'1px solid #374151', borderRadius:'6px', padding:'8px 12px', color:'white', marginBottom:'16px', outline:'none'}} placeholder="密码" onKeyDown={e => {if (e.key === 'Enter') confirmPassword();}} />
                        <div style={{display:'flex', justifyContent:'flex-end', gap:'12px'}}>
                            <button onClick={() => setShowPwdModal(false)} style={{padding:'6px 16px', borderRadius:'6px', background:'none', color:'#d1d5db', cursor:'pointer', border:'none'}}>取消</button>
                            <button onClick={confirmPassword} style={{padding:'6px 16px', borderRadius:'6px', background:'#4f46e5', color:'white', fontWeight:'bold', cursor:'pointer', border:'none'}}>确认</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="sidebar-left">
                <div style={{ padding: '16px', borderBottom: '1px solid #374151', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button onClick={() => setView('dashboard')} style={{ color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}><Icons.Back /> 返回</button>
                    <div style={{display:'flex', gap:'8px'}}>
                        <button onClick={enterPresentation} style={{ color: '#ffffff', background: '#4f46e5', padding:'6px 12px', borderRadius:'6px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', fontSize: '0.9rem' }} title="开始放映"><Icons.Play /> 演示</button>
                    </div>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {slides.map((s, i) => (
                        <SlideThumbnail key={s.id} slide={s} index={i} isActive={activeIdx === i} onClick={switchSlide} onDelete={delSlide} onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop} isDragging={draggedItem === i} />
                    ))}
                    <button onClick={addSlide} style={{ width: '100%', padding: '12px', border: '2px dashed #374151', borderRadius: '8px', color: '#6b7280', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Icons.Plus /> 添加幻灯片</button>
                </div>
            </div>

            <div className="main-workspace">
                <div style={{ height: '48px', background: '#1f2937', borderBottom: '1px solid #374151', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <input value={title} onChange={e => { setTitle(e.target.value); setHasUnsavedChanges(true); }} style={{ background: 'transparent', border: 'none', color: 'white', fontWeight: 'bold', width: '200px', fontSize: '1rem', outline: 'none' }} />
                        <button onClick={() => { const shareUrl = `${window.location.origin}?share=${currId}`; navigator.clipboard.writeText(shareUrl); alert('分享链接已复制到剪贴板！\n' + shareUrl); }} style={{ padding: '6px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>分享演示</button>
                        <button onClick={handleExportOfflineHTML} disabled={status === 'loading'} style={{ padding: '6px 12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: status === 'loading' ? 'not-allowed' : 'pointer', fontSize: '0.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>{status === 'loading' ? '处理中...' : '⬇ 导出离线版'}</button>
                        
                        <button onClick={() => setIsVisualMode(!isVisualMode)} style={{ padding: '6px 12px', background: isVisualMode ? '#6366f1' : '#374151', color: 'white', border: isVisualMode ? '1px solid #4f46e5' : '1px solid #4b5563', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 'bold', transition: 'all 0.2s' }}>{isVisualMode ? '🖱 退出交互模式' : '🖱 交互模式 (点击编辑)'}</button>

                        {hasUnsavedChanges && <button onClick={handleDiscard} style={{ padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 'bold' }}>放弃修改</button>}
                        {hasUnsavedChanges && <button onClick={handleManualSave} style={{ padding: '6px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 'bold' }}>保存代码</button>}
                        <StatusTag />
                    </div>
                    <button onClick={() => setShowCode(!showCode)} style={{ padding: '6px 12px', background: '#374151', color: '#d1d5db', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Code /> {showCode?'隐藏代码':'显示代码'}</button>
                </div>
                
                <div className="stage-container" ref={stageRef} onWheel={handleWheel} onMouseDown={() => iframeRef.current?.contentWindow?.deselectVisual?.()}>
                    <div className="stage-content" style={{ transform: `translate(-50%, -50%) scale(${scale})`, left: pos.left, top: pos.top }}>
                        <iframe ref={iframeRef} srcDoc={injectPreview(previewHtml, true)} style={{ width: '100%', height: '100%', border: 'none', display: 'block' }} onLoad={handleEditorLoad}></iframe>
                    </div>
                </div>
                
                {showCode && (
                    <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0, height: editorH, borderTop: '1px solid #374151' }}>
                        <div className={`resizer ${isDragging ? 'active' : ''}`} onMouseDown={startDrag}></div>
                        <div style={{ flex: 1, background: '#0d1117', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <div style={{ padding: '8px 16px', background: '#161b22', borderBottom: '1px solid #374151', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#9ca3af' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <span style={{ fontWeight: 'bold' }}>HTML Editor</span>
                                    <button onClick={() => { if(fileRef.current) fileRef.current.click(); }} style={{ color: '#818cf8', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Image /> 插入本地图片</button>
                                    <input type="file" ref={fileRef} onChange={uploadImg} style={{ display: 'none' }} accept="image/*" />
                                </div>
                                <button onClick={() => setShowCode(false)} style={{ color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}><Icons.X /></button>
                            </div>
                            <textarea id="code-editor" className="sc-code-textarea" ref={textareaRef} value={code} onChange={onCodeChange} style={{ flex: 1, background: '#0d1117', color: '#d1d5db', padding: '16px', border: 'none', fontFamily: 'monospace', fontSize: '0.875rem', lineHeight: 1.5, resize: 'none', outline: 'none' }} spellCheck="false"></textarea>
                        </div>
                    </div>
                )}
            </div>

            {isVisualMode && (
                <div style={{ backgroundColor: '#111827', borderLeft: '1px solid #374151', display: 'flex', flexDirection: 'column', zIndex: 100 }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid #374151', display: 'flex', alignItems: 'center' }}>
                        <h3 style={{ fontWeight: 'bold', fontSize: '1rem', margin: 0, color: 'white' }}>属性与AI助手</h3>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                        <input type="file" accept="image/*" ref={replaceFileRef} style={{ display: 'none' }} onChange={handleReplaceImg} />
                        
                        {selectedElement ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ fontSize: '0.875rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    已选中: <span style={{ padding: '4px 8px', background: '#374151', borderRadius: '4px', color: 'white', fontWeight: 'bold' }}>{selectedElement.tagName.toUpperCase()}</span>
                                </div>
                                
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', padding: '16px', background: '#1f2937', borderRadius: '8px', border: '1px solid #374151' }}>
                                    <button className="tool-btn" onClick={() => execVisualCmd('editText')} title="修改文本"><Icons.Type /></button>
                                    <div className="tool-divider"></div>
                                    <button className="tool-btn" onClick={() => execVisualCmd('fontSize', 'up')} title="增大字号"><Icons.FontUp /></button>
                                    <button className="tool-btn" onClick={() => execVisualCmd('fontSize', 'down')} title="减小字号"><Icons.FontDown /></button>
                                    <div className="tool-divider"></div>
                                    <button className="tool-btn" onClick={() => execVisualCmd('bold')} title="加粗"><Icons.Bold /></button>
                                    <button className="tool-btn" onClick={() => execVisualCmd('italic')} title="斜体"><Icons.Italic /></button>
                                    <button className="tool-btn" onClick={() => execVisualCmd('underline')} title="下划线"><Icons.Underline /></button>
                                    <div className="tool-divider"></div>
                                    <input type="color" value={selectedElement.color || '#000000'} onChange={(e) => execVisualCmd('color', e.target.value)} style={{ width: '32px', height: '32px', padding: 0, border: 'none', background: 'none', cursor: 'pointer', borderRadius: '4px' }} title="字体颜色" />
                                </div>

                                {selectedElement.tagName.toLowerCase() === 'img' && (
                                    <div style={{ padding: '16px', background: '#1f2937', borderRadius: '8px', border: '1px solid #374151' }}>
                                        <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '12px', fontWeight: 'bold' }}>图片属性</p>
                                        <button onClick={() => { setOldImgUrl(selectedElement.src); if (replaceFileRef.current) replaceFileRef.current.click(); }} style={{ width: '100%', padding: '10px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold', transition: 'background 0.2s' }} onMouseOver={e => e.target.style.background='#4338ca'} onMouseOut={e => e.target.style.background='#4f46e5'}>
                                            <Icons.Image /> 替换图片
                                        </button>
                                    </div>
                                )}

                                <div style={{ marginTop: '12px' }}>
                                    <button onClick={() => execVisualCmd('delete', null)} style={{ width: '100%', padding: '10px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold', transition: 'all 0.2s' }} onMouseOver={e => { e.target.style.background='#ef4444'; e.target.style.color='white'; }} onMouseOut={e => { e.target.style.background='rgba(239,68,68,0.1)'; e.target.style.color='#ef4444'; }}>
                                        <Icons.Trash /> 删除该元素
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#6b7280', textAlign: 'center', gap: '16px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563' }}><Icons.Edit /></div>
                                <p style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>在左侧画布中<br/>点击任意元素以编辑属性</p>
                            </div>
                        )}

                        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', flex: 1, minHeight: '300px' }}>
                            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '16px' }}>
                                <div style={{ padding: '12px', background: '#374151', borderRadius: '8px', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '1.2rem' }}>🤖</span>
                                    <span style={{ marginLeft: '8px', fontSize: '0.875rem', color: '#e5e7eb' }}>你好！我是 DeepSeek 助手。<br/><br/>选中上方元素，我可以帮你修改它的内容或样式。<br/>如果不选中元素，我可以帮你重写整张幻灯片。</span>
                                </div>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <textarea value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="让 AI 帮你修改当前选中的元素，或重写整页PPT..." style={{ width: '100%', height: '100px', background: '#111827', border: '1px solid #374151', borderRadius: '8px', padding: '12px', color: 'white', outline: 'none', resize: 'none', fontSize: '0.875rem' }} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAiSubmit(); } }} />
                                <button onClick={handleAiSubmit} disabled={isAiGenerating} style={{ position: 'absolute', right: '12px', bottom: '12px', background: isAiGenerating ? '#4b5563' : '#6366f1', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: isAiGenerating ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                                    {isAiGenerating ? '生成中...' : '发送 (Enter)'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function App() {
    const urlParams = new URLSearchParams(window.location.search);
    const shareId = urlParams.get('share');
    
    React.useLayoutEffect(() => {
        const l = document.getElementById('loading-text');
        if (l) l.style.display = 'none';
    }, []);

    if (shareId) return <SharedPresentation projectId={shareId} />;

    const [user, setUser] = React.useState(() => {
        try {
            const val = localStorage.getItem('sc_user');
            if (!val) return null;
            const parsed = JSON.parse(val);
            if (parsed && typeof parsed === 'object' && parsed.id) return parsed;
            return null;
        } catch (e) { return null; }
    });

    const handleLogin = (uData) => { localStorage.setItem('sc_user', JSON.stringify(uData)); setUser(uData); };
    const handleLogout = () => { localStorage.removeItem('sc_user'); setUser(null); };

    if (!user) return <AuthPage onLogin={handleLogin} />;
    return <Editor user={user} onLogout={handleLogout} />;
}

export default App;
