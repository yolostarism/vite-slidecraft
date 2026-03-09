import React, { useState, useEffect, useRef, useCallback } from 'react';
import imageCompression from 'browser-image-compression';
import './index.css';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const SERVER_URL = '/api'; 
        const gradients = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // 紫蓝
            'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)', // 深蓝
            'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)', // 橘红
            'linear-gradient(135deg, #0ba360 0%, #3cba92 100%)', // 翠绿
            'linear-gradient(135deg, #b224ef 0%, #7579ff 100%)'  // 粉紫
        ];

        const Icons = {
            Slideshow: () => <svg width="24" height="24" viewBox="0 0 256 256" fill="currentColor"><path d="M192,56H64A16,16,0,0,0,48,72V184a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V72A16,16,0,0,0,192,56Zm0,128H64V72H192V184ZM216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM168,88v48a8,8,0,0,1-8,8H136v16a8,8,0,0,1-16,0V88a8,8,0,0,1,8-8h32A8,8,0,0,1,168,88Zm-16,0H136v40h16V88ZM104,80H64a8,8,0,0,0-8,8v64a8,8,0,0,0,16,0V136h24a8,8,0,0,0,0-16H72V96h32a8,8,0,0,0,0-16Zm88,0H160a8,8,0,0,0-8,8v64a8,8,0,0,0,16,0V96h24a8,8,0,0,0,0-16Z"/></svg>,
            Play: () => <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M240,128a15.74,15.74,0,0,1-7.6,13.51L88.32,229.65a16,16,0,0,1-16.2.3A15.86,15.86,0,0,1,64,216.13V39.87a15.86,15.86,0,0,1,8.12-13.82,16,16,0,0,1,16.2.3L232.4,114.49A15.74,15.74,0,0,1,240,128Z"/></svg>,
            Plus: () => <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"/></svg>,
            Trash: () => <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"/></svg>,
            Code: () => <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor"><path d="M69.12,94.15l-45.6,48.36a8,8,0,0,0,0,11l45.6,48.36a8,8,0,0,0,11.62-11l-40.38-42.89,40.38-42.89a8,8,0,0,0-11.62-11Zm176,48.36L199.5,94.15a8,8,0,0,0-11.62,11l40.38,42.89-40.38,42.89a8,8,0,0,0,11.62,11l45.6-48.36A8,8,0,0,0,245.13,142.51Zm-87.39-86a8,8,0,0,0-10.42,4.7l-48,136a8,8,0,0,0,4.7,10.42,8.12,8.12,0,0,0,2.86.53,8,8,0,0,0,7.56-5.33l48-136A8,8,0,0,0,157.74,56.54Z"/></svg>,
            Image: () => <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM160,80a24,24,0,1,0,24,24A24,24,0,0,0,160,80Zm0,32a8,8,0,1,1,8-8A8,8,0,0,1,160,112ZM216,192H40v-6.9l52.69-52.68a16,16,0,0,1,22.62,0L144,161.1l28.69-28.68a16,16,0,0,1,22.62,0L216,152.94V192Z"/></svg>,
            X: () => <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/></svg>,
            SignOut: () => <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M124,216a12,12,0,0,1-12,12H48a12,12,0,0,1-12-12V40A12,12,0,0,1,48,28h64a12,12,0,0,1,0,24H60V204h52A12,12,0,0,1,124,216Zm108.49-96.49-40-40a12,12,0,0,0-17,17L195,116H112a12,12,0,0,0,0,24h83l-19.52,19.52a12,12,0,0,0,17,17l40-40A12,12,0,0,0,232.49,119.51Z"/></svg>,
            Back: () => <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H224A8,8,0,0,1,224,128Z"/></svg>,
            Presentation: () => <svg width="40" height="40" viewBox="0 0 256 256" fill="currentColor"><path d="M216,40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM216,176H40V56H216V176ZM208,208a8,8,0,0,1-8,8H56a8,8,0,0,1,0-16H200A8,8,0,0,1,208,208Z"/></svg>,
            Edit: () => <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152.05A15.89,15.89,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"/></svg>,
            FontUp: () => <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M224,128a8,8,0,0,1-8,8H176v40a8,8,0,0,1-16,0V136H112v40a8,8,0,0,1-16,0V56a8,8,0,0,1,16,0v64h48V56a8,8,0,0,1,16,0v64h40A8,8,0,0,1,224,128ZM64,104a8,8,0,0,0-8,8v16H40V112a8,8,0,0,0-16,0v48a8,8,0,0,0,16,0v-8H56v8a8,8,0,0,0,16,0V112A8,8,0,0,0,64,104Zm-8,40H40v-16h16Z"/></svg>,
            FontDown: () => <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M208,112H168V56a8,8,0,0,0-16,0v56H112a8,8,0,0,0-16,0v48a8,8,0,0,0,16,0v-8h40v8a8,8,0,0,0,16,0V128h40a8,8,0,0,0,0-16Zm-56,32H112V128h40ZM88,128a8,8,0,0,1-8,8H64v40a8,8,0,0,1-16,0V136H32a8,8,0,0,1,0-16H80A8,8,0,0,1,88,128Z"/></svg>,
            Bold: () => <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M156,128h-52v52h60a28,28,0,0,0,0-56H156Zm-52-32h52a28,28,0,0,0,0-56H80a8,8,0,0,0-8,8v40a8,8,0,0,0,8,8ZM232,160a60.07,60.07,0,0,1-60,60H72a16,16,0,0,1-16-16V56A16,16,0,0,1,72,40h84a60,60,0,0,1,0,120Zm-16-32a43.85,43.85,0,0,0-8.29-25.54,44,44,0,0,0,0-56.92A43.85,43.85,0,0,0,156,24H72V204h92a44,44,0,0,0,52-76Z" opacity="0.2"/><path d="M156,112h-44V56h44a28,28,0,0,1,0,56Zm8,16h-52v56h52a28,28,0,0,0,0-56Zm52,28a44,44,0,0,1-44,44H80a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h76a44,44,0,0,1,0,88,43.85,43.85,0,0,1,8.29,25.54A43.85,43.85,0,0,1,216,156ZM88,184h84a28,28,0,0,0,0-56H88Zm0-72h76a28,28,0,0,0,0-56H88Z"/></svg>,
            Italic: () => <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M200,56a8,8,0,0,1-8,8H167.2l-51.43,128H144a8,8,0,0,1,0,16H72a8,8,0,0,1,0-16H96.8l51.43-128H120a8,8,0,0,1,0-16h72A8,8,0,0,1,200,56Z"/></svg>,
            Underline: () => <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M80,40v88a48,48,0,0,0,96,0V40a8,8,0,0,0-16,0v88a32,32,0,0,1-64,0V40a8,8,0,0,0-16,0ZM56,200a8,8,0,0,0,0,16H200a8,8,0,0,0,0-16Z"/></svg>,
            Type: () => <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M208,56A8,8,0,0,1,200,64H136V192h24a8,8,0,0,1,0,16H96a8,8,0,0,1,0-16h24V64H56a8,8,0,0,1,0-16H200A8,8,0,0,1,208,56Z"/></svg>
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

        // 注入可视化编辑器逻辑
        

        const injectPreview = (html, includeVisualScript = false) => {
            const isFullHtml = html.trim().match(/^<!DOCTYPE/i) || html.trim().match(/^<html/i);
            const script = '';
            
            // 🔥 在生成的 iframe 样式中也强制亮色模式和禁用颜色调整 🔥
            if (isFullHtml) {
                // 给重置样式添加 ID 以便在保存时移除
            const resetStyle = `<style id="sc-preview-reset"> 
                :root { color-scheme: light; }
                
                /* 1. 基础重置，确保边界不被撑大 */
                * { 
                    box-sizing: border-box !important; 
                    forced-color-adjust: none !important; 
                    -webkit-print-color-adjust: exact !important; 
                    print-color-adjust: exact !important; 
                    /* 🌟 防溢出核心1：允许内容在极度拥挤时收缩 */
                    min-width: 0;
                    min-height: 0;
                } 
                
                /* 2. 严格锁定物理画布尺寸，杜绝外部滚动条 */
                body, html { 
                    margin: 0 !important; 
                    padding: 0 !important; 
                    width: 1344px !important; 
                    height: 816px !important; 
                    max-width: 1344px !important; 
                    max-height: 816px !important; 
                    overflow: hidden !important; /* 强制切掉画布外的内容 */
                    background: none !important; 
                    display: block !important; 
                } 
                
                /* 3. 根节点防护：确保背景、外层容器绝不越界 */
                body > div, .ppt-slide, .slide { 
                    width: 100% !important; 
                    height: 100% !important; 
                    max-width: 1344px !important; 
                    max-height: 816px !important; 
                    overflow: hidden !important; /* 🌟 防溢出核心2：防止内部长文本/大图把父元素撑破 */
                    border-radius: 0 !important; 
                    box-shadow: none !important; 
                    aspect-ratio: auto !important; 
                    margin: 0 !important; 
                    transform: none !important; 
                    left: auto !important; 
                    top: auto !important; 
                } 

                /* 4. 🌟 防溢出核心3：限制图片尺寸，防止巨型网图破坏布局 */
                img, svg, video {
                    max-width: 100% !important;
                    max-height: 100% !important;
                    /* 不加 object-fit: cover，尊重 AI 可能会写的 object-contain 等属性 */
                }

                /* 5. 🌟 防溢出核心4：防止超长英文/链接不换行导致横向溢出 */
                p, h1, h2, h3, h4, h5, h6, span, div {
                    word-wrap: break-word !important;
                    overflow-wrap: break-word !important;
                }
            </style>`;


                let content = html;
                if (html.includes('<' + '/head>')) content = content.replace('<' + '/head>', resetStyle + '<' + '/head>');
                else content = resetStyle + content;
                
                if (html.includes('<' + '/body>')) content = content.replace('<' + '/body>', script + '<' + '/body>');
                else content = content + script;
                return content;
            }
            return `<!DOCTYPE html><html><head><meta charset="utf-8"><link href="https://lib.baomitu.com/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet"><style> 
                :root { color-scheme: light; }
                * { box-sizing: border-box; forced-color-adjust: none !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } 
                body, html { margin: 0 !important; padding: 0 !important; width: 1344px; height: 816px; overflow: hidden; background: transparent; } 
                * { -webkit-user-select: none; user-select: none; cursor: default; } 
            </style></head><body>${html}${script}</body></html>`;
        };
        
        
        window.initVisualEditor = function(iframe, isEnabled, callbacks) {
            const win = iframe.contentWindow;
            const doc = iframe.contentDocument || win?.document;
            if (!win || !doc) return;

            // 如果禁用可视化编辑，清除所有相关的事件、样式和 UI 元素
            if (!isEnabled) {
                if (win.deselectVisual) win.deselectVisual();
                if (win._scHandleSelect) doc.removeEventListener('click', win._scHandleSelect, true);
                if (win._scHandleDragStart) doc.removeEventListener('mousedown', win._scHandleDragStart);
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

            // 【核心修复：销毁旧的工具栏，防止产生闭包陷阱】
            let oldToolbar = doc.getElementById('sc-page-toolbar');
            if (oldToolbar) {
                oldToolbar.remove();
            }

            // 注入可视化编辑状态的 CSS
            if (!doc.getElementById('sc-visual-style')) {
                const style = doc.createElement('style');
                style.id = 'sc-visual-style';
                style.textContent = `
                    .sc-selected { outline: 2px solid #6366f1 !important; outline-offset: 2px; z-index: 9999; cursor: move; }
                    .sc-dragging { opacity: 0.6; }
                    .sc-editing { cursor: text !important; outline: 2px dashed #10b981 !important; outline-offset: 4px; min-width: 10px; min-height: 1em; }
                    #sc-page-toolbar {
                        position: absolute; z-index: 10000; background: #4f46e5; color: white;
                        border: none; padding: 6px 16px; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                        font-family: system-ui, sans-serif; font-size: 14px; font-weight: bold;
                        cursor: pointer; display: none; align-items: center; gap: 6px; transition: background 0.2s;
                    }
                    #sc-page-toolbar:hover { background: #4338ca; }
                `;
                doc.head.appendChild(style);
            }

            // 每次都创建全新的编辑按钮，使其可以绑定到最新的 selectedEl 引用
            let toolbarEl = doc.createElement('button');
            toolbarEl.id = 'sc-page-toolbar';
            toolbarEl.innerHTML = '✏️ 点击编辑';
            toolbarEl.onmousedown = (e) => {
                e.preventDefault(); 
                e.stopPropagation();
                if (selectedEl) {
                    enterEditMode(selectedEl);
                }
            };
            doc.body.appendChild(toolbarEl);

            // 取消选中的逻辑
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
            
            // 暴露给外部调用
            win.deselectVisual = deselect;

            // 选中元素的逻辑
            function handleSelect(e) {
                if (isDragging || isEditing) return;
                const target = e.target;
                
                // 防止点到了工具栏或不需要选中的顶层容器
                if (target === toolbarEl || target.closest('#sc-page-toolbar')) return;
                e.stopPropagation();
                if (target.tagName === 'A') e.preventDefault();
                if (target === doc.body || target === doc.documentElement) {
                    deselect();
                    return;
                }
                
                if (selectedEl && selectedEl !== target) {
                    deselect();
                }
                
                selectedEl = target;
                selectedEl.classList.add('sc-selected');
                
                // 显示「点击编辑」按钮并定位在元素上方
                if (toolbarEl) {
                    const rect = selectedEl.getBoundingClientRect();
                    toolbarEl.style.display = 'flex';
                    toolbarEl.style.top = Math.max(0, win.scrollY + rect.top - 40) + 'px';
                    toolbarEl.style.left = (win.scrollX + rect.left) + 'px';
                }
                
                // 提取被选元素的样式传递给外部面板（工具栏）
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

            // 拖拽相关逻辑：开始
            function handleDragStart(e) {
                if (!selectedEl || e.target !== selectedEl || isEditing) return;
                e.preventDefault();
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                selectedEl.classList.add('sc-dragging');
                if (toolbarEl) toolbarEl.style.display = 'none';
                
                const style = win.getComputedStyle(selectedEl);
                if (style.position === 'static') {
                    selectedEl.style.position = 'relative';
                }
                startLeft = parseFloat(style.left) || 0;
                startTop = parseFloat(style.top) || 0;
                
                doc.addEventListener('mousemove', handleDragMove);
                doc.addEventListener('mouseup', handleDragEnd);
            }

            // 拖拽相关逻辑：移动中
            function handleDragMove(e) {
                if (!isDragging || !selectedEl) return;
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                selectedEl.style.left = (startLeft + dx) + 'px';
                selectedEl.style.top = (startTop + dy) + 'px';
            }

            // 拖拽相关逻辑：结束
            function handleDragEnd(e) {
                isDragging = false;
                if (selectedEl) {
                    selectedEl.classList.remove('sc-dragging');
                    // 移动完毕后重新定位工具栏
                    if (toolbarEl) {
                        const rect = selectedEl.getBoundingClientRect();
                        toolbarEl.style.display = 'flex';
                        toolbarEl.style.top = Math.max(0, win.scrollY + rect.top - 40) + 'px';
                        toolbarEl.style.left = (win.scrollX + rect.left) + 'px';
                    }
                }
                doc.removeEventListener('mousemove', handleDragMove);
                doc.removeEventListener('mouseup', handleDragEnd);
                syncCode();
            }

            // 进入文字编辑模式
            function enterEditMode(el) {
                if (!el) return;
                isEditing = true;
                el.classList.remove('sc-selected');
                el.classList.add('sc-editing');
                el.contentEditable = 'true';
                if (toolbarEl) toolbarEl.style.display = 'none';
                
                // 自动聚焦并全选文字
                setTimeout(() => {
                    win.focus();
                    el.focus();
                    try {
                        const selection = win.getSelection();
                        const range = doc.createRange();
                        range.selectNodeContents(el);
                        selection.removeAllRanges();
                        selection.addRange(range);
                    } catch(err) {}
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
                    // 回车键退出编辑，Shift+回车可以换行
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        el.blur();
                    }
                };
                
                el.addEventListener('blur', onBlur);
                el.addEventListener('keydown', onKeyDown);
            }

            // 同步可视化改动回代码（HTML）
            function syncCode() {
                const clone = doc.documentElement.cloneNode(true);
                // 移除所有编辑状态相关的注入标签
                const toRemove = ['sc-visual-style', 'sc-page-toolbar', 'sc-preview-reset'];
                toRemove.forEach(id => {
                    const el = clone.querySelector(`#${id}`);
                    if (el) el.remove();
                });
                
                // 清理由于操作留下的无用 class 和属性
                const selected = clone.querySelector('.sc-selected');
                if (selected) selected.classList.remove('sc-selected');
                
                const dragging = clone.querySelector('.sc-dragging');
                if (dragging) dragging.classList.remove('sc-dragging');
                
                const editables = clone.querySelectorAll('[contenteditable]');
                editables.forEach(el => el.removeAttribute('contenteditable'));
                
                const editing = clone.querySelector('.sc-editing');
                if (editing) editing.classList.remove('sc-editing');
                
                // 移除可能存在的 Tailwind 冲突 style
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

            // 处理顶部控制栏（例如字号、加粗、颜色）下发的样式修改
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
                    selectedEl.style.fontStyle = (win.getComputedStyle(selectedEl).fontStyle === 'italic') ? 'normal' : 'italic';
                } else if (key === 'underline') {
                    let td = win.getComputedStyle(selectedEl).textDecoration;
                    selectedEl.style.textDecoration = td.includes('underline') ? 'none' : 'underline';
                } else if (key === 'delete') {
                    selectedEl.remove();
                    deselect();
                } else if (key === 'editText') {
                    enterEditMode(selectedEl);
                    return; // 进入编辑模式，等待失焦时自动同步
                }
                syncCode();
            };

            // 清理旧事件，绑定新事件
            if (win._scHandleSelect) doc.removeEventListener('click', win._scHandleSelect, true);
            if (win._scHandleDragStart) doc.removeEventListener('mousedown', win._scHandleDragStart);
            win._scHandleSelect = handleSelect;
            win._scHandleDragStart = handleDragStart;
            
            doc.addEventListener('click', handleSelect, true);
            doc.addEventListener('mousedown', handleDragStart);
        };

        const injectThumb = (html) => `<!DOCTYPE html><html><head><link href="https://lib.baomitu.com/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet"><script>function fit(){const w=document.documentElement.clientWidth;const s=w/1344;document.body.style.transform='scale('+s+')';document.body.style.transformOrigin='top left';}window.onload=fit;window.onresize=fit;<\/script><style>
            :root { color-scheme: light; }
            * { forced-color-adjust: none !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            body{margin:0;width:1344px;height:816px;overflow:hidden;background:white}
            ::-webkit-scrollbar{display:none}
        </style></head><body>${html}</body></html>`;

        const SlideThumbnail = React.memo(({ slide, index, isActive, onClick, onDelete, onDragStart, onDragOver, onDrop, isDragging }) => {
            return (
                <div draggable="true" onDragStart={(e) => onDragStart(e, index)} onDragOver={(e) => onDragOver(e, index)} onDrop={(e) => onDrop(e, index)} onClick={() => onClick(index)} className={`relative thumbnail-wrapper bg-white rounded cursor-pointer border-2 overflow-hidden group ${isActive ? 'thumbnail-active' : 'border-gray-700 opacity-70 hover:opacity-100 hover:border-gray-500 hover:shadow-lg'} ${isDragging ? 'thumbnail-dragging' : ''}`} style={{ aspectRatio: '1.647', flexShrink: 0, transform: isActive ? 'scale(1.02)' : 'scale(1)' }}>
                    <div className="absolute inset-0 w-full h-full pointer-events-none z-0"><iframe srcDoc={injectThumb(slide.html)} className="w-full h-full border-none" loading="lazy"></iframe></div>
                    <div className="absolute inset-0 z-10" onClick={() => onClick(index)}></div>
                    <span className="absolute top-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded backdrop-blur-sm z-20 font-mono shadow pointer-events-none">{index + 1}</span>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(e, index); }} className="absolute top-1 right-1 bg-red-500/90 text-white p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-opacity z-30 cursor-pointer shadow-sm"><Icons.Trash /></button>
                </div>
            );
        }, (prev, next) => prev.slide.html === next.slide.html && prev.isActive === next.isActive && prev.index === next.index && prev.isDragging === next.isDragging);
        
        
        const setupSmartScroll = (iframe) => {
            try {
                const win = iframe.contentWindow;
                if (!win) return;

                const isScrollContainer = (el) => {
                    if (!el || el === win.document.body || el === win.document.documentElement) return false;
                    const style = win.getComputedStyle(el);
                    const isOverflow = (style.overflowY === 'auto' || style.overflowY === 'scroll');
                    const hasScrollableContent = el.scrollHeight > el.clientHeight;
                    if (isOverflow && hasScrollableContent) return true;
                    return isScrollContainer(el.parentElement);
                };

                // Clear previous listeners
                if (win._scWheelHandler) win.removeEventListener('wheel', win._scWheelHandler, { passive: false });
                if (win._scKeydownHandler) win.removeEventListener('keydown', win._scKeydownHandler);

                win._scWheelHandler = (event) => {
                    if (isScrollContainer(event.target)) {
                        event.stopPropagation();
                        return; 
                    }
                    event.preventDefault(); 
                    // Create a wheel event that bubbles in the PARENT window
                    const newEvent = new WheelEvent('wheel', {
                        deltaY: event.deltaY, bubbles: true, cancelable: true, view: window
                    });
                    window.dispatchEvent(newEvent);
                };

                win._scKeydownHandler = (event) => {
                    if (event.target.isContentEditable || event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return; 
                    const newEvent = new KeyboardEvent('keydown', {
                        key: event.key, code: event.code, keyCode: event.keyCode,
                        bubbles: true, cancelable: true, view: window
                    });
                    window.dispatchEvent(newEvent); 
                    if (['ArrowRight', 'ArrowDown', ' ', 'Enter', 'PageDown', 'ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace', 'Escape'].includes(event.key)) {
                         event.preventDefault();
                    }
                };

                win.addEventListener('wheel', win._scWheelHandler, { passive: false });
                win.addEventListener('keydown', win._scKeydownHandler);

            } catch (err) { console.warn("Iframe setup failed", err); }
        };

function SharedPresentation({ projectId }) {
    // 1. 同步读取缓存
    const initialCacheSlides = () => {
        try {
            const cached = localStorage.getItem(`offline_pres_${projectId}`);
            return cached ? JSON.parse(cached) : [];
        } catch(e) { return []; }
    };
    const initialCacheTw = () => {
        try {
            return localStorage.getItem('offline_tw_css') || '';
        } catch(e) { return ''; }
    };

    const _cachedSlides = initialCacheSlides();
    const hasCache = _cachedSlides.length > 0;

    // 状态初始化：如果有缓存，直接 ready！
    const [slides, setSlides] = React.useState(_cachedSlides);
    const [status, setStatus] = React.useState(hasCache ? 'ready' : 'loading');
    const [offlineTwCss, setOfflineTwCss] = React.useState(initialCacheTw());
    
    const [activeIdx, setActiveIdx] = React.useState(0);
    const [presScale, setPresScale] = React.useState(1);
    const lastWheelTime = React.useRef(0);

    // 【关键】：强制干掉原生的 Loading，防止它遮挡我们秒开的界面
    React.useLayoutEffect(() => {
        const l = document.getElementById('loading-text');
        if (l) l.style.display = 'none';
    }, []);

    // 2. 后台网络请求（完全不阻塞 UI）
    React.useEffect(() => {
        let isMounted = true;

        const backgroundFetch = async () => {
            // 断网且有缓存，直接结束，省去不必要的报错和延迟
            if (!navigator.onLine && hasCache) return;

            const fetchWithTimeout = (promise, ms = 5000) => {
                return new Promise((resolve, reject) => {
                    const timer = setTimeout(() => reject(new Error('Timeout')), ms);
                    promise.then(res => { clearTimeout(timer); resolve(res); })
                           .catch(err => { clearTimeout(timer); reject(err); });
                });
            };

            try {
                const [dataRes, twRes] = await Promise.allSettled([
                    fetchWithTimeout(api.getProjectDetails(projectId), 5000),
                    fetchWithTimeout(fetch('https://lib.baomitu.com/tailwindcss/2.2.19/tailwind.min.css').then(r => r.text()), 8000)
                ]);

                if (!isMounted) return;

                if (dataRes.status === 'fulfilled') {
                    const d = dataRes.value;
                    const finalSlides = (d.slides && d.slides.length) ? d.slides : DEFAULT_SLIDES;
                    setSlides(finalSlides);
                    localStorage.setItem(`offline_pres_${projectId}`, JSON.stringify(finalSlides));
                    setStatus('ready');
                } else if (!hasCache) {
                    setStatus('error');
                }

                if (twRes.status === 'fulfilled' && twRes.value) {
                    setOfflineTwCss(twRes.value);
                    localStorage.setItem('offline_tw_css', twRes.value);
                }
            } catch (e) {
                if (!isMounted) return;
                if (!hasCache) setStatus('error');
            }
        };

        backgroundFetch();
        return () => { isMounted = false; };
    }, [projectId, hasCache]);

    // 3. 事件监听
    React.useEffect(() => {
        if (status !== 'ready') return;
        
        const handleResize = () => {
            setPresScale(Math.min(window.innerWidth / 1344, window.innerHeight / 816));
        };
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
        if (typeof setupSmartScroll === 'function') {
            setupSmartScroll(e.target);
        }
    };

    const getOfflineReadyHtml = () => {
        if (!slides[activeIdx]) return '';
        let html = injectPreview(slides[activeIdx].html);
        if (offlineTwCss) {
            html = html.replace(
                /<link[^>]*tailwindcss[^>]*>/i, 
                `<style>${offlineTwCss}</style>`
            );
        }
        return html;
    };

    if (status === 'loading') {
        return <div className="flex h-screen items-center justify-center bg-gray-900 text-white font-sans text-xl">正在同步最新数据...</div>;
    }
    if (status === 'error') {
        return <div className="flex h-screen items-center justify-center bg-gray-900 text-red-500 font-sans text-xl">请检查网络。</div>;
    }

    return (
        <div className="presentation-overlay" style={{ background: '#000', margin: 0, padding: 0 }}>
            <div style={{ 
                width: '1344px', height: '816px', 
                transform: `scale(${presScale})`, transformOrigin: 'center', 
                background: 'white', position: 'relative', boxShadow: '0 0 50px rgba(0,0,0,0.5)' 
            }}>
                <iframe 
                    srcDoc={getOfflineReadyHtml()} 
                    onLoad={handleIframeLoad}
                    style={{ width: '100%', height: '100%', border: 'none', display: 'block' }} 
                />
            </div>
            <div style={{ 
                position: 'absolute', bottom: '16px', right: '24px', 
                background: 'rgba(0,0,0,0.2)', color: 'rgba(255,255,255,0.7)', 
                padding: '4px 12px', borderRadius: '6px', fontFamily: 'monospace', 
                fontSize: '12px', pointerEvents: 'none', backdropFilter: 'blur(2px)', zIndex: 50 
            }}>
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
                if(!u || !p) return alert('请输入完整');
                setLoading(true);
                try {
                    if (isReg) { 
                        await api.register(u, p); 
                        alert('注册成功'); 
                        setIsReg(false); 
                    } else {
                        const res = await api.login(u, p);
                        console.log("服务器返回的原始数据:", res); // 👉 这里打印出来
                        
                        if (!res || !res.id) { 
                            // 把 res.error 弹出来，看看是不是密码错误
                            throw new Error(res?.error || JSON.stringify(res) || "返回为空");
                        }
                        onLogin({ username: res.username, id: res.id });
                    }
                } catch (e) { 
                    alert("报错详情: " + e.message); 
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
                            <p className="text-gray-400 text-sm mt-1">{isReg ? '创建新账户' : '欢迎回来'}</p>
                        </div>
                        <input value={u} onChange={e=>setU(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 mb-3 text-white focus:border-indigo-500 outline-none" placeholder="用户名" />
                        <input type="password" value={p} onChange={e=>setP(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 mb-6 text-white focus:border-indigo-500 outline-none" placeholder="密码" />
                        <button onClick={sub} disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">{loading && <span className="animate-spin">⌛</span>}{isReg ? '注册' : '登录'}</button>
                        <div className="mt-6 text-center text-sm text-gray-400 cursor-pointer hover:text-indigo-400" onClick={()=>setIsReg(!isReg)}>{isReg ? '已有账号？登录' : '没有账号？注册'}</div>
                    </div>
                </div>
            );
        }
// ====== 只保留这一个 function App() 即可 ======
function App() {
    const urlParams = new URLSearchParams(window.location.search);
    const shareId = urlParams.get('share');

    // 清理原生 Loading
    React.useLayoutEffect(() => {
        const l = document.getElementById('loading-text');
        if (l) l.style.display = 'none';
    }, []);

    // 如果是分享链接，直接进入幻灯片播放页
    if (shareId) {
        return <SharedPresentation projectId={shareId} />;
    }

    // 后台登录状态管理
    const [user, setUser] = React.useState(() => {
        try {
            const val = localStorage.getItem('sc_user');
            if (!val) return null;
            const parsed = JSON.parse(val);
            if (parsed && typeof parsed === 'object' && parsed.id) return parsed;
            return null;
        } catch (e) {
            return null;
        }
    });

    const handleLogin = (uData) => {
        localStorage.setItem('sc_user', JSON.stringify(uData));
        setUser(uData);
    };

    const handleLogout = () => {
        localStorage.removeItem('sc_user');
        setUser(null);
    };

    // 没有登录则展示 AuthPage，登录了展示 Editor
    if (!user) {
        return <AuthPage onLogin={handleLogin} />;
    }
    return <Editor user={user} onLogout={handleLogout} />;
}


export default App;
