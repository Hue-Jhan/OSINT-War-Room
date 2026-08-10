
export function initLayout() {
    // LocalStorage Safety for Split.js
    function getSafeSplitSizes(key, defaultSizes) {
        const saved = localStorage.getItem(key);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length === defaultSizes.length) {
                    const sum = parsed.reduce((a, b) => a + b, 0);
                    if (sum > 98 && sum < 102) {
                        return parsed;
                    }
                }
            } catch (e) {
                console.warn("Corrupted split sizes found, reverting to default.");
            }
        }
        return defaultSizes;
    }

    // Initialize Vertical Split
    const verticalSplit = Split(['#pane-map', '#pane-data'], {
        sizes: getSafeSplitSizes('split-sizes-vertical', [50, 50]),
        minSize: [200, 200],
        gutterSize: 10,
        cursor: 'row-resize',
        direction: 'vertical',
        onDragEnd: function(sizes) {
            localStorage.setItem('split-sizes-vertical', JSON.stringify(sizes));
            // Trigger map resize if map exists globally or dispatch event
            window.dispatchEvent(new Event('resize')); 
        }
    });

    // Initialize Horizontal Split
    Split(['#col-comms', '#col-feeds', '#col-econ'], {
        sizes: getSafeSplitSizes('split-sizes-horizontal', [35, 38, 27]),
        minSize: [200, 200, 200],
        gutterSize: 10,
        cursor: 'col-resize',
        direction: 'horizontal',
        onDragEnd: function(sizes) {
            localStorage.setItem('split-sizes-horizontal', JSON.stringify(sizes));
        }
    });

    // Reset Layout Logic
    const resetBtn = document.getElementById('reset-layout-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            localStorage.removeItem('split-sizes-vertical');
            localStorage.removeItem('split-sizes-horizontal');
            localStorage.removeItem('osint_dashboard_state');
            localStorage.removeItem('market_settings');
            localStorage.removeItem('webcam_settings');
            location.reload();
        });
    }

    // Quick Snap Layout
    const snapUpBtn = document.getElementById('snap-up-btn');
    const snapDownBtn = document.getElementById('snap-down-btn');
    if (snapUpBtn && verticalSplit) {
        snapUpBtn.addEventListener('click', () => { window._sfx?.click(); verticalSplit.setSizes([20, 80]); });
    }
    if (snapDownBtn && verticalSplit) {
        snapDownBtn.addEventListener('click', () => { window._sfx?.click(); verticalSplit.setSizes([80, 20]); });
    }

    // Fullscreen Logic
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.body.requestFullscreen().catch(err => console.log(err));
            } else {
                document.exitFullscreen();
            }
        });
    }

    document.querySelectorAll('.region-btn').forEach(b => {
        b.addEventListener('pointerdown', () => window._sfx?.click());
    });
}

export function initModals() {
    // Map buttons to their respective modals
    const settingsMap = [
        { btnId: 'news-settings-btn', modalId: 'news-settings-modal' },
        { btnId: 'webcam-settings-btn', modalId: 'webcam-settings-modal' },
        { btnId: 'market-settings-btn', modalId: 'market-settings-modal' },
        { btnId: 'global-settings-btn', modalId: 'global-settings-modal' },
        { btnId: 'live-maps-btn', modalId: 'live-maps-modal' }
    ];
    // Attach isolated click listeners
    settingsMap.forEach(({ btnId, modalId }) => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('pointerdown', (e) => {
                // e.preventDefault(); 
                window._sfx?.click();
                e.stopPropagation(); // Stop FontAwesome/CSS from intercepting
                const modal = document.getElementById(modalId);
                if (modal) {
                    const isOpening = modal.classList.contains('hidden');
                    modal.classList.toggle('hidden');
                    // Highlight the button when its modal is open
                    btn.classList.toggle('active', isOpening);
                    
                    // Trigger specific render logic if needed
                    if (btnId === 'webcam-settings-btn' && window.renderWebcamSettingsList) {
                        window.renderWebcamSettingsList();
                    }
                    if (btnId === 'news-settings-btn') {
                        // Dispatch event for api.js to pick up if needed
                        window.dispatchEvent(new Event('openNewsSettings'));
                    }

                } else {
                    console.error(`Modal ${modalId} not found!`);
                }
            });
        }
    });

    // Close buttons
    document.querySelectorAll('.close-btn').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            window._sfx?.click();
            const modal = e.target.closest('.modal');
            if (modal) {
                modal.classList.add('hidden');
                // Find the button that owns this modal and deactivate it
                const modalId = modal.id;
                const ownerBtn = document.querySelector(`[id$="-btn"]`);
                settingsMap.forEach(({ btnId, modalId: mid }) => {
                    if (mid === modalId) {
                        document.getElementById(btnId)?.classList.remove('active');
                    }
                });
            }
        });
    });

    // Draggable Logic
    function makeDraggable(elmnt) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = elmnt.querySelector(".drag-handle");
        
        if (header) {
            header.onmousedown = dragMouseDown;
        } else {
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            elmnt.style.right = 'auto';
            elmnt.style.bottom = 'auto';
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    document.querySelectorAll('.draggable-modal').forEach(modal => {
        makeDraggable(modal);
    });

    const pizzaModal = document.getElementById('pizza-modal');
    const donateModal = document.getElementById('donate-modal');

    document.getElementById('pizza-btn')?.addEventListener('click', () => {
        window._sfx?.click();
        pizzaModal.classList.toggle('hidden');
    });

    document.getElementById('donate-btn')?.addEventListener('click', () => {
        window._sfx?.click();
        donateModal.classList.toggle('hidden');
    });

    window.copyToClipboard = (text, btn) => {
        navigator.clipboard.writeText(text).then(() => {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-check" style="color:#10b981;"></i>';
            setTimeout(() => btn.innerHTML = originalHTML, 2000);
        });
    };
}

export function initClock() {
    function updateClock() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = String(now.getFullYear()).slice(-2);
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const timeZone = now.toLocaleTimeString('en-us',{timeZoneName:'short'}).split(' ')[2] || 'UTC';

        const dateEl = document.getElementById('date-display');
        const clockEl = document.getElementById('clock-display');

        if (dateEl) dateEl.textContent = `${day} ${month} ${year}`;
        if (clockEl) clockEl.textContent = `${hours}:${minutes}:${seconds} ${timeZone}`;
    }
    updateClock();
    setInterval(updateClock, 1000);
}

export function initWebcams() {
    const cameraFeeds = {
        "Middle East": [
            {url: "https://www.youtube.com/watch?v=-zGuR1qVKrU", title: "Iran", enabled: true},
            {url: "https://www.youtube.com/watch?v=gmtlJ_m2r5A", title: "Israel & More", enabled: true},
            {url: "https://www.youtube.com/watch?v=4E-iFtUM2kk", title: "Middle East Cam", enabled: true}
        ],
        "Ukraine": [
            {url: "https://www.youtube.com/watch?v=R-qCsZ1obbc", title: "Kyiv Cam 1", enabled: true},
            {url: "https://www.youtube.com/watch?v=11mdFpvFvqU", title: "Ukraine City", enabled: true},
            {url: "https://www.youtube.com/watch?v=e2gC37ILQmk", title: "Odessa", enabled: true}
        ],
        "Space": [
            {url: "https://www.youtube.com/watch?v=GdFTOGOa9_M", title: "ISS Live 2", enabled: true},
            {url: "https://www.youtube.com/watch?v=fO9e9jnhYK8", title: "Space View", enabled: true},
            {url: "https://www.youtube.com/watch?v=0FBiyFpV__g", title: "Earth Feed", enabled: true},
            {url: "https://www.youtube.com/watch?v=vytmBNhc9ig", title: "Orbit", enabled: true},
            {url: "https://www.youtube.com/watch?v=3F0XlKxaqbk", title: "Satellite", enabled: true}
        ]
    };

    let webcamSettings = JSON.parse(localStorage.getItem('webcam_settings')) || {
        activeTab: "Global",
        feeds: cameraFeeds,
        layout: 'auto'
    };

    const gridLayoutSelect = document.getElementById('webcam-grid-layout');
    const openWebcamBtn = document.getElementById('webcam-settings-btn');
    const camTabs = document.querySelectorAll('.cam-tab-btn');
    const newWebcamCategorySelect = document.getElementById('new-webcam-category');
    const newCategoryInput = document.getElementById('new-category-input');

    function extractYouTubeID(url) {
        try {
            const parsedUrl = new URL(url);
            const host = parsedUrl.hostname.replace(/^www\./, '');
            let videoId = null;

            if (host === 'youtu.be') {
                videoId = parsedUrl.pathname.split('/')[1];
            } else if (host === 'youtube.com' || host === 'm.youtube.com') {
                if (parsedUrl.pathname === '/watch') {
                    videoId = parsedUrl.searchParams.get('v');
                } else {
                    const [type, id] = parsedUrl.pathname.split('/').filter(Boolean);
                    if (['embed', 'live', 'shorts', 'v'].includes(type)) {
                        videoId = id;
                    }
                }
            }

            return /^[A-Za-z0-9_-]{11}$/.test(videoId || '') ? videoId : null;
        } catch {
            return null;
        }
    }

    function renderWebcams() {
        const container = document.getElementById('webcam-grid');
        if (!container) return;
        container.innerHTML = '';

        if (webcamSettings.layout === '1') container.style.gridTemplateColumns = '1fr';
        else if (webcamSettings.layout === '2') container.style.gridTemplateColumns = 'repeat(2, 1fr)';
        else if (webcamSettings.layout === '3') container.style.gridTemplateColumns = 'repeat(3, 1fr)';
        else container.style.gridTemplateColumns = 'repeat(2, 1fr)';

        let activeFeeds = [];
        if (webcamSettings.activeTab === "Global") {
            Object.values(webcamSettings.feeds).forEach(feedArray => {
                activeFeeds = activeFeeds.concat(feedArray.filter(f => f.enabled));
            });
        } else {
            activeFeeds = webcamSettings.feeds[webcamSettings.activeTab].filter(f => f.enabled);
        }

        activeFeeds.forEach(feed => {
            const videoId = extractYouTubeID(feed.url);
            if (!videoId) return;
            const wrapper = document.createElement('div');
            wrapper.className = 'cam-wrapper';

            const actions = document.createElement('div');
            actions.className = 'cam-hover-overlay';

            const openLink = document.createElement('a');
            openLink.className = 'cam-btn';
            openLink.href = feed.url;
            openLink.target = '_blank';
            openLink.rel = 'noopener noreferrer';
            openLink.title = `Open ${feed.title} on YouTube`;
            openLink.setAttribute('aria-label', openLink.title);
            openLink.innerHTML = '<i class="fa-solid fa-arrow-up-right-from-square"></i>';

            const fullscreenButton = document.createElement('button');
            fullscreenButton.type = 'button';
            fullscreenButton.className = 'cam-btn';
            fullscreenButton.title = `Fullscreen ${feed.title}`;
            fullscreenButton.setAttribute('aria-label', fullscreenButton.title);
            fullscreenButton.innerHTML = '<i class="fa-solid fa-expand"></i>';
            fullscreenButton.addEventListener('click', () => wrapper.requestFullscreen());
            actions.append(openLink, fullscreenButton);

            const player = document.createElement('iframe');
            player.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=1&playsinline=1&rel=0&modestbranding=1`;
            player.title = `${feed.title} live feed`;
            player.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
            player.allowFullscreen = true;
            player.referrerPolicy = 'strict-origin-when-cross-origin';

            const label = document.createElement('div');
            label.className = 'cam-overlay';
            label.textContent = feed.title;
            wrapper.append(actions, player, label);
            container.appendChild(wrapper);
        });
    }

    function renderWebcamSettingsList() {
        const list = document.getElementById('webcam-list');
        if (!list) return;
        let currentFeeds = webcamSettings.activeTab === "Global" ? webcamSettings.feeds["Middle East"] : webcamSettings.feeds[webcamSettings.activeTab];
        list.innerHTML = currentFeeds.map((feed, index) => `
            <div class="setting-item">
                <div style="display:flex; align-items:center; gap:8px; overflow:hidden;">
                    <input type="checkbox" ${feed.enabled ? 'checked' : ''} onchange="window.toggleWebcam(${index})">
                    <span style="font-size:11px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${feed.title}</span>
                </div>
                <i class="fa-solid fa-trash" onclick="window.deleteWebcam(${index})" style="cursor:pointer; color:#ef4444;"></i>
            </div>
        `).join('');
    }

    window.toggleWebcam = (index) => {
        const tab = webcamSettings.activeTab === "Global" ? "Middle East" : webcamSettings.activeTab;
        webcamSettings.feeds[tab][index].enabled = !webcamSettings.feeds[tab][index].enabled;
        localStorage.setItem('webcam_settings', JSON.stringify(webcamSettings));
        renderWebcams();
    };

    window.deleteWebcam = (index) => {
        const tab = webcamSettings.activeTab === "Global" ? "Middle East" : webcamSettings.activeTab;
        webcamSettings.feeds[tab].splice(index, 1);
        localStorage.setItem('webcam_settings', JSON.stringify(webcamSettings));
        renderWebcamSettingsList();
        renderWebcams();
    };

    document.getElementById('add-webcam-btn')?.addEventListener('click', () => {
        const urlInput = document.getElementById('new-webcam-url');
        const labelInput = document.getElementById('new-webcam-label');
        const categorySelect = document.getElementById('new-webcam-category');
        let category = categorySelect.value;

        if (category === 'new') {
            category = document.getElementById('new-category-input').value;
            if (!category) return;
            if (!webcamSettings.feeds[category]) {
                webcamSettings.feeds[category] = [];
                location.reload(); 
            }
        }

        if (urlInput.value && labelInput.value) {
            const catToAdd = (webcamSettings.activeTab !== "Global") ? webcamSettings.activeTab : (category !== 'new' ? category : "Middle East");
            webcamSettings.feeds[catToAdd].push({ url: urlInput.value, title: labelInput.value, enabled: true });
            urlInput.value = '';
            labelInput.value = '';
            localStorage.setItem('webcam_settings', JSON.stringify(webcamSettings));
            renderWebcamSettingsList();
            renderWebcams();
        }
    });

    if (newWebcamCategorySelect) {
        newWebcamCategorySelect.addEventListener('change', (e) => {
            newCategoryInput.style.display = e.target.value === 'new' ? 'block' : 'none';
        });
    }

    if (gridLayoutSelect) {
        gridLayoutSelect.addEventListener('change', () => {
            webcamSettings.layout = gridLayoutSelect.value;
            localStorage.setItem('webcam_settings', JSON.stringify(webcamSettings));
            renderWebcams();
        });
    }

    camTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            camTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            webcamSettings.activeTab = tab.dataset.tab;
            renderWebcams();
            renderWebcamSettingsList();
        });
    });

    // Expose render function for settings modal open
    window.renderWebcamSettingsList = renderWebcamSettingsList;
    renderWebcams();

    // PART 4: MARKET SETTINGS LOGIC
    const marketModal = document.getElementById('market-settings-modal');
    const closeMarketBtn = document.getElementById('close-market-settings');
    
    // Toggles
    const toggleStocks = document.getElementById('toggle-stocks');
    const togglePizza = document.getElementById('toggle-pizza');
    const togglePoly = document.getElementById('toggle-poly');
    const displayFormatSelect = document.getElementById('market-display-format');

    // Load Market Settings
    const savedMarketSettings = JSON.parse(localStorage.getItem('market_settings')) || {
        stocks: true, pizza: true, poly: true, format: 'percentage'
    };

    function applyMarketSettings() {
        document.getElementById('module-stocks').style.display = savedMarketSettings.stocks ? 'block' : 'none';
        document.getElementById('module-pizza').style.display = savedMarketSettings.pizza ? 'block' : 'none';
        document.getElementById('module-poly').style.display = savedMarketSettings.poly ? 'block' : 'none';

        if (displayFormatSelect) displayFormatSelect.value = savedMarketSettings.format || 'percentage';
        
        // Update checkboxes
        if(toggleStocks) toggleStocks.checked = savedMarketSettings.stocks;
        if(togglePizza) togglePizza.checked = savedMarketSettings.pizza;
        if(togglePoly) togglePoly.checked = savedMarketSettings.poly;
    }

    function saveMarketSettings() {
        savedMarketSettings.stocks = toggleStocks.checked;
        savedMarketSettings.pizza = togglePizza.checked;
        savedMarketSettings.poly = togglePoly.checked;
        savedMarketSettings.format = displayFormatSelect ? displayFormatSelect.value : 'percentage';
        localStorage.setItem('market_settings', JSON.stringify(savedMarketSettings));
        applyMarketSettings();
    }

    if (closeMarketBtn) closeMarketBtn.addEventListener('click', () => marketModal.classList.add('hidden'));
    
    [toggleStocks, togglePizza, togglePoly].forEach(el => {
        if(el) el.addEventListener('change', saveMarketSettings);
    });

    if (displayFormatSelect) displayFormatSelect.addEventListener('change', () => {
        saveMarketSettings();
        // Note: renderMarketData is in api.js, so we can't call it directly here easily without exporting/importing.
        // However, since we are just saving settings, the next render cycle or refresh will pick it up.
        // Or we can dispatch a custom event.
        window.dispatchEvent(new CustomEvent('marketSettingsChanged'));
    });

    applyMarketSettings();
}
