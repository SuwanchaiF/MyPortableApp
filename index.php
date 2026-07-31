<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portable Data App - 5 Elements Design UI System</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        /* 
          DESIGN SYSTEM BASED ON 5 CORE ELEMENTS:
          1. จุด & เส้น (Dot & Line): Pulse indicators, leading borders, crisp dividers
          2. รูปร่าง & รูปทรง (Shape & Form): Rounded-2xl cards, pill badges, geometric buttons
          3. พื้นที่ว่าง (Negative Space): Breathable layout, generous gaps, 1.6 line height
          4. สี & น้ำหนัก (Color & Value): Slate dark mesh gradient, Electric Indigo (#6366f1), High contrast
          5. พื้นผิว (Texture): Glassmorphism backdrop-blur, soft depth shadows, micro-interactions
        */
        :root {
            --primary: #6366f1;
            --primary-hover: #4f46e5;
            --primary-glow: rgba(99, 102, 241, 0.25);
            --emerald: #10b981;
            --rose: #f43f5e;
            --amber: #f59e0b;
            --bg-dark: #0f172a;
            --card-bg: rgba(30, 41, 59, 0.85);
            --card-border: rgba(255, 255, 255, 0.1);
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
            --input-bg: rgba(15, 23, 42, 0.6);
        }

        * { box-sizing: border-box; }
        
        body {
            font-family: 'Prompt', system-ui, -apple-system, sans-serif;
            background: radial-gradient(circle at 50% 0%, #1e1b4b 0%, #0f172a 70%);
            color: var(--text-main);
            padding: 40px 16px;
            margin: 0;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        /* 3. พื้นที่ว่าง (Negative Space) */
        .container {
            width: 100%;
            max-width: 640px;
            margin: 0 auto;
        }

        /* 5. พื้นผิว (Texture - Glassmorphism & Depth Shadows) */
        .card {
            background: var(--card-bg);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            padding: 32px;
            border-radius: 24px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px var(--card-border);
            position: relative;
            overflow: hidden;
        }

        .card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 3px;
            background: linear-gradient(90deg, #6366f1, #a855f7, #ec4899);
        }

        /* 1. จุด & เส้น (Dot & Line) */
        .header-title {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 24px;
            padding-bottom: 20px;
            border-bottom: 1px dashed rgba(255, 255, 255, 0.12);
        }

        .header-title h2 {
            margin: 0;
            font-size: 1.45rem;
            font-weight: 700;
            color: #ffffff;
            display: flex;
            align-items: center;
            gap: 10px;
            letter-spacing: -0.02em;
        }

        /* 2. รูปร่าง & รูปทรง (Shape & Form - Pill Badges) */
        .badge-pill {
            background: rgba(99, 102, 241, 0.15);
            color: #a5b4fc;
            border: 1px solid rgba(99, 102, 241, 0.3);
            font-size: 0.8rem;
            padding: 5px 14px;
            border-radius: 9999px;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }

        .btn-nav {
            text-decoration: none;
            background: rgba(255, 255, 255, 0.08);
            color: #e2e8f0;
            font-size: 0.8rem;
            padding: 6px 14px;
            border-radius: 12px;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
        }
        .btn-nav:hover {
            background: rgba(99, 102, 241, 0.3);
            border-color: rgba(99, 102, 241, 0.5);
            color: #ffffff;
            transform: translateY(-1px);
        }

        .form-group {
            display: flex;
            gap: 12px;
            margin-bottom: 24px;
        }

        /* 4. สี & น้ำหนัก (Color & Value - Input Contrast & Focus Rings) */
        input[type="text"] {
            flex: 1;
            padding: 14px 18px;
            background: var(--input-bg);
            border: 1.5px solid rgba(255, 255, 255, 0.12);
            border-radius: 14px;
            outline: none;
            font-family: inherit;
            font-size: 0.98rem;
            color: #ffffff;
            transition: all 0.2s ease;
        }

        input[type="text"]::placeholder {
            color: #64748b;
        }

        input[type="text"]:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 4px var(--primary-glow);
            background: rgba(15, 23, 42, 0.9);
        }

        button.btn-add {
            background: linear-gradient(135deg, #6366f1, #4f46e5);
            color: white;
            border: none;
            padding: 14px 24px;
            border-radius: 14px;
            cursor: pointer;
            font-family: inherit;
            font-weight: 600;
            font-size: 0.95rem;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
            white-space: nowrap;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        button.btn-add:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(99, 102, 241, 0.6);
        }
        button.btn-add:active { transform: translateY(0); }

        .search-box {
            margin-bottom: 20px;
            position: relative;
        }

        .search-box i {
            position: absolute;
            left: 16px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-muted);
            font-size: 0.9rem;
        }

        .search-box input {
            width: 100%;
            padding: 12px 16px 12px 44px;
            font-size: 0.9rem;
            border-radius: 12px;
            background: rgba(15, 23, 42, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.08);
            color: #ffffff;
        }

        .item-list {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            background: rgba(15, 23, 42, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 16px;
            transition: all 0.2s ease;
        }

        .item:hover {
            border-color: rgba(99, 102, 241, 0.4);
            background: rgba(30, 41, 59, 0.7);
            transform: translateX(3px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .item-content {
            flex: 1;
            min-width: 0;
            padding-right: 16px;
        }

        .item-text {
            display: block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 0.98rem;
            color: #f1f5f9;
            font-weight: 400;
        }

        .item-time {
            font-size: 0.8rem;
            color: var(--text-muted);
            display: flex;
            align-items: center;
            gap: 4px;
            margin-top: 4px;
        }

        .item-actions {
            display: flex;
            gap: 8px;
            align-items: center;
        }

        .btn-action {
            border: none;
            padding: 8px 14px;
            border-radius: 10px;
            cursor: pointer;
            font-size: 0.85rem;
            font-family: inherit;
            font-weight: 500;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }

        .btn-view {
            background: rgba(255, 255, 255, 0.08);
            color: #cbd5e1;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .btn-view:hover {
            background: rgba(255, 255, 255, 0.18);
            color: #ffffff;
        }

        .btn-del {
            background: rgba(244, 63, 94, 0.12);
            color: #fda4af;
            border: 1px solid rgba(244, 63, 94, 0.25);
        }
        .btn-del:hover {
            background: #f43f5e;
            color: white;
        }

        /* Modals */
        .modal-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(15, 23, 42, 0.75);
            backdrop-filter: blur(8px);
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.25s ease;
            z-index: 1000;
            padding: 20px;
        }

        .modal-overlay.active {
            opacity: 1;
            pointer-events: auto;
        }

        .modal-card {
            background: #1e293b;
            border: 1px solid rgba(255, 255, 255, 0.12);
            width: 100%;
            max-width: 540px;
            border-radius: 24px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            overflow: hidden;
            transform: scale(0.95);
            transition: transform 0.25s ease;
            color: #f8fafc;
        }

        .modal-overlay.active .modal-card {
            transform: scale(1);
        }

        .modal-header {
            padding: 20px 24px;
            background: rgba(15, 23, 42, 0.6);
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .modal-header h3 {
            margin: 0;
            font-size: 1.15rem;
            color: #ffffff;
            font-weight: 600;
        }

        .modal-close {
            background: none;
            border: none;
            font-size: 1.4rem;
            color: var(--text-muted);
            cursor: pointer;
            line-height: 1;
            padding: 0 4px;
            transition: color 0.2s;
        }
        .modal-close:hover { color: #ffffff; }

        .modal-body {
            padding: 24px;
        }

        .detail-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            margin-bottom: 16px;
            font-size: 0.85rem;
            color: var(--text-muted);
            background: rgba(15, 23, 42, 0.6);
            padding: 12px 16px;
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .detail-meta code {
            font-family: 'Fira Code', monospace;
            color: #a5b4fc;
        }

        .detail-text-box {
            background: rgba(15, 23, 42, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 14px;
            padding: 18px;
            font-size: 0.98rem;
            line-height: 1.65;
            white-space: pre-wrap;
            word-break: break-word;
            max-height: 320px;
            overflow-y: auto;
            color: #f1f5f9;
        }

        .modal-footer {
            padding: 16px 24px;
            background: rgba(15, 23, 42, 0.6);
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }

        .btn-copy {
            background: var(--primary);
            color: white;
        }
        .btn-copy:hover { background: var(--primary-hover); }

        .empty-state {
            text-align: center;
            padding: 44px 16px;
            color: var(--text-muted);
            font-size: 0.95rem;
        }

        @keyframes pulse-dot {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.4; transform: scale(0.85); }
        }

        .live-dot {
            width: 8px;
            height: 8px;
            background: var(--emerald);
            border-radius: 50%;
            box-shadow: 0 0 10px var(--emerald);
            animation: pulse-dot 1.8s infinite ease-in-out;
        }

        /* Mobile Responsiveness */
        @media (max-width: 640px) {
            body { padding: 16px 12px; }
            .card { padding: 20px 16px; border-radius: 20px; }
            .header-title { flex-direction: column; gap: 14px; }
            .header-title > div:last-child { width: 100%; justify-content: space-between; }
            .form-group { flex-direction: row; gap: 8px; }
            input[type="text"] { padding: 12px 14px; font-size: 0.92rem; }
            button.btn-add { padding: 12px 16px; font-size: 0.9rem; }
            .item { padding: 14px; }
            .item-text { font-size: 0.92rem; }
        }

        @media (max-width: 400px) {
            .item { flex-direction: column; align-items: flex-start; gap: 10px; }
            .item-content { width: 100%; padding-right: 0; }
            .item-actions { width: 100%; justify-content: flex-end; border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 10px; margin-top: 4px; }
        }
    </style>
</head>
<body>

<div class="container">
    <div class="card">
        <!-- Header Section -->
        <div class="header-title">
            <div>
                <h2><i class="fa-solid fa-layer-group text-indigo-400"></i> บันทึกข้อมูล</h2>
                <div style="font-size: 0.78rem; color: #34d399; font-weight: 500; margin-top: 4px; display: flex; align-items: center; gap: 6px;">
                    <span class="live-dot"></span>
                    <span>Firebase Real-Time Cloud (ซิงค์ตรงกันทุกเครื่อง)</span>
                </div>
            </div>
            <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                <button type="button" class="btn-nav" onclick="openQuotaModal()">
                    <i class="fa-solid fa-chart-pie text-emerald-400"></i> ลิมิตระบบ
                </button>
                <a href="bootcamp_master_learning_hub.html" class="btn-nav">
                    <i class="fa-solid fa-rocket text-indigo-400"></i> Bootcamp Hub
                </a>
                <span class="badge-pill" id="count-badge">ทั้งหมด 0 รายการ</span>
            </div>
        </div>

        <!-- Add Form -->
        <form class="form-group" id="add-form" onsubmit="handleAddSubmit(event)">
            <input type="text" name="text_input" id="text_input" placeholder="พิมพ์ข้อความที่ต้องการเก็บบันทึก..." required autocomplete="off">
            <button type="submit" class="btn-add"><i class="fa-solid fa-plus"></i> บันทึก</button>
        </form>

        <!-- Search Input -->
        <div class="search-box" id="search-box-container" style="display:none;">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" id="search-input" placeholder="ค้นหาข้อมูล..." oninput="filterItems()">
        </div>

        <!-- Data Items List -->
        <ul class="item-list" id="item-list">
            <div class="empty-state" id="empty-state">กำลังโหลดข้อมูลจาก Cloud...</div>
        </ul>
    </div>
</div>

<!-- Modal สำหรับดูรายละเอียดข้อมูล -->
<div class="modal-overlay" id="detailModal" onclick="closeDetailModalOnOverlay(event)">
    <div class="modal-card">
        <div class="modal-header">
            <h3><i class="fa-solid fa-circle-info text-indigo-400 mr-2"></i> รายละเอียดข้อมูล</h3>
            <button class="modal-close" onclick="closeDetailModal()">&times;</button>
        </div>
        <div class="modal-body">
            <div class="detail-meta">
                <span><strong>ID:</strong> <code id="modal-id"></code></span>
                <span><strong>วันที่-เวลา:</strong> <span id="modal-time"></span></span>
            </div>
            <div class="detail-text-box" id="modal-text"></div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn-action btn-copy" id="btn-copy-text" onclick="copyModalText()">
                <i class="fa-regular fa-copy"></i> คัดลอกข้อความ
            </button>
            <button type="button" class="btn-action btn-view" onclick="closeDetailModal()">ปิด</button>
        </div>
    </div>
</div>

<!-- Modal สำหรับดูโควตาและลิมิต -->
<div class="modal-overlay" id="quotaModal" onclick="closeQuotaModalOnOverlay(event)">
    <div class="modal-card">
        <div class="modal-header">
            <h3><i class="fa-solid fa-chart-pie text-emerald-400 mr-2"></i> ลิมิต & รายละเอียดการใช้งานระบบ</h3>
            <button class="modal-close" onclick="closeQuotaModal()">&times;</button>
        </div>
        <div class="modal-body" style="max-height: 75vh; overflow-y: auto;">
            <!-- 1. Firebase Section -->
            <div style="margin-bottom: 20px;">
                <h4 style="margin: 0 0 10px 0; font-size: 0.95rem; color: #f1f5f9; display: flex; align-items: center; justify-content: space-between;">
                    <span>🔥 Firebase Realtime Database</span>
                    <span style="font-size: 0.72rem; background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); padding: 2px 10px; border-radius: 12px; font-weight: 600;">Spark Free Plan</span>
                </h4>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <!-- Metric 1: Storage -->
                    <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 12px;">
                        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 4px;">
                            <span>📦 <strong>พื้นที่จัดเก็บ (Storage):</strong></span>
                            <span id="m-fb-storage-text" style="color: #818cf8; font-weight: 600;">0.00 MB / 1,024 MB (1GB)</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: #94a3b8; margin-bottom: 8px;">
                            <span>ใช้ไป: <strong id="m-fb-storage-pct" style="color: #34d399;">0.0001%</strong></span>
                            <span>คงเหลือ: <strong id="m-fb-storage-rem">1,023.99 MB</strong></span>
                        </div>
                        <div style="background: rgba(255, 255, 255, 0.1); border-radius: 6px; height: 6px; overflow: hidden;">
                            <div id="m-fb-storage-bar" style="width: 1%; height: 100%; background: #6366f1; transition: width 0.3s;"></div>
                        </div>
                    </div>

                    <!-- Metric 2: Bandwidth -->
                    <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 12px;">
                        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 4px;">
                            <span>🌐 <strong>รับส่งข้อมูล (Bandwidth/เดือน):</strong></span>
                            <strong style="color: #818cf8;">~0.05 MB / 10,240 MB (10GB)</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: #94a3b8; margin-bottom: 8px;">
                            <span>ใช้ไป: <strong style="color: #34d399;">~0.0005%</strong> (ใช้งานน้อยมาก)</span>
                            <span>คงเหลือ: <strong>~9.99 GB</strong></span>
                        </div>
                        <div style="background: rgba(255, 255, 255, 0.1); border-radius: 6px; height: 6px; overflow: hidden;">
                            <div style="width: 1%; height: 100%; background: #6366f1;"></div>
                        </div>
                    </div>

                    <!-- Metric 3: Connections -->
                    <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 12px;">
                        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 4px;">
                            <span>📱 <strong>เชื่อมต่อพร้อมกัน (Connections):</strong></span>
                            <strong style="color: #818cf8;">1 เครื่อง / 100 เครื่อง</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: #94a3b8; margin-bottom: 8px;">
                            <span>ใช้ไป: <strong style="color: #34d399;">1.0%</strong></span>
                            <span>คงเหลือ: <strong>99 เครื่อง</strong></span>
                        </div>
                        <div style="background: rgba(255, 255, 255, 0.1); border-radius: 6px; height: 6px; overflow: hidden;">
                            <div style="width: 1%; height: 100%; background: #34d399;"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 2. Netlify Section -->
            <div style="margin-bottom: 20px;">
                <h4 style="margin: 0 0 10px 0; font-size: 0.95rem; color: #f1f5f9; display: flex; align-items: center; justify-content: space-between;">
                    <span>🌐 Netlify Cloud Hosting</span>
                    <span style="font-size: 0.72rem; background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); padding: 2px 10px; border-radius: 12px; font-weight: 600;">Free Tier</span>
                </h4>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <!-- Netlify Bandwidth -->
                    <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 12px;">
                        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 4px;">
                            <span>🚀 <strong>รับส่งเข้าชมเว็บ (Bandwidth/เดือน):</strong></span>
                            <strong style="color: #818cf8;">~0.25 MB / 102,400 MB (100GB)</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: #94a3b8; margin-bottom: 8px;">
                            <span>ใช้ไป: <strong style="color: #34d399;">~0.0002%</strong> (ยังใช้ไม่ถึง 1%)</span>
                            <span>คงเหลือ: <strong>99.999 GB</strong></span>
                        </div>
                        <div style="background: rgba(255, 255, 255, 0.1); border-radius: 6px; height: 6px; overflow: hidden;">
                            <div style="width: 1%; height: 100%; background: #6366f1;"></div>
                        </div>
                    </div>

                    <!-- Netlify Build Minutes -->
                    <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 12px;">
                        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 4px;">
                            <span>⏱️ <strong>เวลาประมวลผล Build (Build Mins):</strong></span>
                            <strong style="color: #94a3b8;">0 นาที / 300 นาที</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: #94a3b8; margin-bottom: 8px;">
                            <span>ใช้ไป: <strong style="color: #94a3b8;">0.00% (ยังไม่ได้ใช้)</strong></span>
                            <span>คงเหลือ: <strong>300 นาทีเต็ม</strong></span>
                        </div>
                        <div style="background: rgba(255, 255, 255, 0.1); border-radius: 6px; height: 6px; overflow: hidden;">
                            <div style="width: 0%; height: 100%; background: #64748b;"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Summary -->
            <div style="background: rgba(99, 102, 241, 0.15); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 12px; padding: 14px; font-size: 0.88rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>📊 <strong>สรุปสถานะระบบโดยรวม:</strong></span>
                    <strong style="color: #34d399;">🟢 ปกติสมบูรณ์ (โควตาเหลือ >99.99%)</strong>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn-action btn-view" onclick="closeQuotaModal()">ปิด</button>
        </div>
    </div>
</div>

<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-database-compat.js"></script>

<script>
    const firebaseConfig = {
        apiKey: "AIzaSyCC5-cJOhKeDpDu0YSEkE73OxlyOJ3srUM",
        authDomain: "testprod-69c21.firebaseapp.com",
        databaseURL: "https://testprod-69c21-default-rtdb.firebaseio.com",
        projectId: "testprod-69c21",
        storageBucket: "testprod-69c21.firebasestorage.app",
        messagingSenderId: "674297674388",
        appId: "1:674297674388:web:832dd59730e6561aab5281",
        measurementId: "G-XLK9TQPTVX"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.database();
    const itemsRef = db.ref('items');

    let currentModalText = '';

    function escapeHtml(text) {
        return (text || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    function openDetailModal(item) {
        document.getElementById('modal-id').innerText = item.id;
        document.getElementById('modal-time').innerText = item.timestamp;
        document.getElementById('modal-text').innerText = item.text;
        currentModalText = item.text;
        
        const copyBtn = document.getElementById('btn-copy-text');
        copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> คัดลอกข้อความ';
        
        document.getElementById('detailModal').classList.add('active');
    }

    function closeDetailModal() {
        document.getElementById('detailModal').classList.remove('active');
    }

    function closeDetailModalOnOverlay(e) {
        if (e.target.classList.contains('modal-overlay')) {
            closeDetailModal();
        }
    }

    function copyModalText() {
        if (!currentModalText) return;
        navigator.clipboard.writeText(currentModalText).then(() => {
            const copyBtn = document.getElementById('btn-copy-text');
            copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> คัดลอกแล้ว!';
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> คัดลอกข้อความ';
            }, 2000);
        }).catch(err => {
            alert('ไม่สามารถคัดลอกได้: ' + err);
        });
    }

    function renderItemList(data) {
        const listEl = document.getElementById('item-list');
        const searchBox = document.getElementById('search-box-container');
        
        if (!data || data.length === 0) {
            listEl.innerHTML = '<div class="empty-state" id="empty-state">ยังไม่มีข้อมูลในระบบ เพิ่มข้อมูลใหม่ได้จากช่องด้านบน</div>';
            if (searchBox) searchBox.style.display = 'none';
            const badge = document.getElementById('count-badge');
            if (badge) badge.innerText = 'ทั้งหมด 0 รายการ';
            return;
        }

        if (searchBox) searchBox.style.display = 'block';

        let html = '';
        data.forEach(item => {
            const safeText = escapeHtml(item.text);
            const safeTime = escapeHtml(item.timestamp);
            const safeId = escapeHtml(item.id);
            const itemJson = JSON.stringify(item).replace(/'/g, "&apos;").replace(/"/g, "&quot;");

            html += `
                <li class="item" data-id="${safeId}" data-text="${safeText}">
                    <div class="item-content">
                        <span class="item-text">${safeText}</span>
                        <span class="item-time"><i class="fa-regular fa-clock"></i> ${safeTime}</span>
                    </div>
                    <div class="item-actions">
                        <button type="button" class="btn-action btn-view" onclick='openDetailModal(${itemJson})'>
                            <i class="fa-regular fa-eye"></i> ดูข้อมูล
                        </button>
                        <button type="button" class="btn-action btn-del" onclick="handleDelete('${safeId}')">
                            <i class="fa-regular fa-trash-can"></i> ลบ
                        </button>
                    </div>
                </li>
            `;
        });

        listEl.innerHTML = html;
        filterItems();
    }

    // Firebase Realtime Listener
    itemsRef.on('value', (snapshot) => {
        const val = snapshot.val();
        const dataList = [];
        if (val) {
            Object.keys(val).forEach(key => {
                dataList.push({
                    id: key,
                    text: val[key].text,
                    timestamp: val[key].timestamp
                });
            });
        }
        dataList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        renderItemList(dataList);
    }, (error) => {
        console.error("Firebase Read Error:", error);
    });

    function handleAddSubmit(e) {
        e.preventDefault();
        const input = document.getElementById('text_input');
        const text = input.value.trim();
        if (!text) return;

        const now = new Date();
        const timestamp = now.getFullYear() + '-' +
            String(now.getMonth() + 1).padStart(2, '0') + '-' +
            String(now.getDate()).padStart(2, '0') + ' ' +
            String(now.getHours()).padStart(2, '0') + ':' +
            String(now.getMinutes()).padStart(2, '0') + ':' +
            String(now.getSeconds()).padStart(2, '0');

        const newItemRef = itemsRef.push();
        newItemRef.set({
            text: text,
            timestamp: timestamp
        }).then(() => {
            input.value = '';
        }).catch(err => {
            alert('⚠️ Firebase Error: ' + err.message + '\n\nหากขึ้น Permission Denied กรุณาเปิด Realtime Database เป็น Test Mode ใน Firebase Console');
        });
    }

    function handleDelete(id) {
        if (!confirm('ยืนยันการลบรายการนี้?')) return;
        itemsRef.child(id).remove().catch(err => {
            alert('ลบไม่สำเร็จ: ' + err.message);
        });
    }

    function filterItems() {
        const query = document.getElementById('search-input') ? document.getElementById('search-input').value.toLowerCase().trim() : '';
        const items = document.querySelectorAll('#item-list .item');
        let visibleCount = 0;

        items.forEach(item => {
            const text = (item.getAttribute('data-text') || '').toLowerCase();
            if (text.includes(query)) {
                item.style.display = 'flex';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        const badge = document.getElementById('count-badge');
        if (badge) {
            if (query) {
                badge.innerText = `พบ ${visibleCount} จาก ${items.length} รายการ`;
            } else {
                badge.innerText = `ทั้งหมด ${items.length} รายการ`;
            }
        }
    }

    function openQuotaModal() {
        const items = document.querySelectorAll('#item-list .item');
        const count = items.length;
        
        const estBytes = count * 250;
        const estMB = (estBytes / (1024 * 1024)).toFixed(4);
        const totalStorageMB = 1024;
        const estPercent = Math.max(0.0001, (estBytes / (1024 * 1024 * 1024) * 100)).toFixed(4);
        const remMB = (totalStorageMB - (estBytes / (1024 * 1024))).toFixed(2);
        
        const storageTextEl = document.getElementById('m-fb-storage-text');
        if (storageTextEl) storageTextEl.innerText = `${estMB} MB / 1,024 MB (1GB)`;
        
        const storagePctEl = document.getElementById('m-fb-storage-pct');
        if (storagePctEl) storagePctEl.innerText = `${estPercent}%`;

        const storageRemEl = document.getElementById('m-fb-storage-rem');
        if (storageRemEl) storageRemEl.innerText = `${remMB} MB`;

        const storageBarEl = document.getElementById('m-fb-storage-bar');
        if (storageBarEl) storageBarEl.style.width = Math.max(1, Math.min(100, parseFloat(estPercent) * 100)) + '%';
        
        const modal = document.getElementById('quotaModal');
        if (modal) modal.classList.add('active');
    }

    function closeQuotaModal() {
        const modal = document.getElementById('quotaModal');
        if (modal) modal.classList.remove('active');
    }

    function closeQuotaModalOnOverlay(e) {
        if (e.target.classList.contains('modal-overlay')) {
            closeQuotaModal();
        }
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeDetailModal();
            closeQuotaModal();
        }
    });
</script>
</body>
</html>