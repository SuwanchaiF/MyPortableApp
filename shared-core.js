/**
 * shared-core.js
 * โมดูลกลางสำหรับ MyPortableApp (index.html, parliament_commute.html, bootcamp_master_learning_hub.html)
 * 1. Canonical Domain Redirect (รวมศูนย์จาก Netlify มาที่ GitHub Pages)
 * 2. Shared Firebase Configuration & Initialization
 * 3. Unified SystemLogger Engine + Protected Cloud Log Clear
 * 4. IndexedDB + Safe LocalStorage Quota Fallback & Backup/Restore JSON
 */

(function () {
    'use strict';

    // =========================================================
    // 1. CANONICAL SERVER REDIRECT (Netlify -> GitHub Pages)
    // =========================================================
    var CANONICAL_BASE = 'https://suwanchaif.github.io/MyPortableApp';
    if (typeof window !== 'undefined' && window.location && window.location.hostname === 'myportableapp.netlify.app') {
        var pathName = window.location.pathname || '/';
        if (pathName === '/') pathName = '/index.html';
        var targetUrl = CANONICAL_BASE + pathName + (window.location.search || '') + (window.location.hash || '');
        window.location.replace(targetUrl);
        return;
    }

    // =========================================================
    // 2. SHARED FIREBASE CONFIGURATION
    // =========================================================
    window.SHARED_FIREBASE_CONFIG = {
        apiKey: "AIzaSyCC5-cJOhKeDpDu0YSEkE73OxlyOJ3srUM",
        authDomain: "testprod-69c21.firebaseapp.com",
        databaseURL: "https://testprod-69c21-default-rtdb.firebaseio.com",
        projectId: "testprod-69c21",
        storageBucket: "testprod-69c21.firebasestorage.app",
        messagingSenderId: "674297674388",
        appId: "1:674297674388:web:832dd59730e6561aab5281",
        measurementId: "G-XLK9TQPTVX"
    };

    window.initSharedFirebase = function () {
        if (typeof firebase !== 'undefined') {
            if (!firebase.apps || !firebase.apps.length) {
                firebase.initializeApp(window.SHARED_FIREBASE_CONFIG);
            }
            if (typeof firebase.database === 'function') {
                window.db = firebase.database();
                return window.db;
            }
        }
        return null;
    };

    // Initialize immediately if Firebase SDK is already loaded
    window.initSharedFirebase();

    // =========================================================
    // 3. UNIFIED SYSTEM LOGGING ENGINE
    // =========================================================
    function escapeHtml(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function getActiveUsername() {
        try {
            if (typeof currentUser !== 'undefined' && currentUser && currentUser.username) return currentUser.username;
            if (typeof hubUser !== 'undefined' && hubUser && hubUser.username) return hubUser.username;
            var raw = localStorage.getItem('vault_auth_user');
            if (raw) {
                var parsed = JSON.parse(raw);
                if (parsed && parsed.username) return parsed.username;
            }
        } catch (e) {}
        return 'admin';
    }

    window.SystemLogger = {
        logs: [],
        _listening: false,

        init: function () {
            this.loadLocalLogs();
            this.listenFirebaseLogs();
        },

        loadLocalLogs: function () {
            try {
                var raw = localStorage.getItem('system_activity_logs');
                if (raw) this.logs = JSON.parse(raw);
            } catch (e) {
                this.logs = [];
            }
        },

        saveLocalLogs: function () {
            try {
                if (this.logs.length > 300) {
                    this.logs = this.logs.slice(0, 300);
                }
                localStorage.setItem('system_activity_logs', JSON.stringify(this.logs));
            } catch (e) {
                // Quota fallback: keep latest 80 logs
                try {
                    this.logs = this.logs.slice(0, 80);
                    localStorage.setItem('system_activity_logs', JSON.stringify(this.logs));
                } catch (err) {}
            }
        },

        getDb: function () {
            if (typeof db !== 'undefined' && db) return db;
            return window.initSharedFirebase();
        },

        listenFirebaseLogs: function () {
            if (this._listening) return;
            var database = this.getDb();
            if (database) {
                try {
                    this._listening = true;
                    var self = this;
                    var logsRef = database.ref('system_logs');
                    logsRef.limitToLast(100).on('value', function (snapshot) {
                        var val = snapshot.val();
                        if (val) {
                            var cloudLogs = Object.values(val);
                            var combined = cloudLogs.concat(self.logs);
                            var uniqueMap = new Map();
                            combined.forEach(function (item) {
                                if (item && item.id) uniqueMap.set(item.id, item);
                            });
                            self.logs = Array.from(uniqueMap.values());
                            self.logs.sort(function (a, b) {
                                return (b.timestamp || 0) - (a.timestamp || 0);
                            });
                            self.saveLocalLogs();
                            self.renderLogModalUI();
                        }
                    });
                } catch (err) {
                    this._listening = false;
                    console.warn("Firebase system_logs sync fallback:", err);
                }
            }
        },

        getDeviceType: function () {
            var ua = navigator.userAgent || '';
            var isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
            var isSmallScreen = window.innerWidth <= 768;
            if (isMobileUA || isSmallScreen) {
                if (/iPhone|iPad|iPod/i.test(ua)) return '📱 iPhone/iOS';
                if (/Android/i.test(ua)) return '📱 Android';
                return '📱 Mobile';
            }
            if (/Macintosh|Mac OS X/i.test(ua)) return '💻 Mac';
            if (/Windows/i.test(ua)) return '💻 Windows';
            return '💻 Desktop';
        },

        log: function (category, action, details, iconStr) {
            var now = new Date();
            var yearBE = now.getFullYear() + 543;
            var timeStr = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            var dateStr = String(now.getDate()).padStart(2, '0') + '/' + String(now.getMonth() + 1).padStart(2, '0') + '/' + yearBE;

            var logItem = {
                id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
                timestamp: Date.now(),
                dateTimeStr: dateStr + ' ' + timeStr + ' น.',
                page: (window.location.pathname.split('/').pop() || 'index.html'),
                category: category || 'SYSTEM',
                action: action || 'กิจกรรมในระบบ',
                details: details || '',
                icon: iconStr || 'fa-solid fa-circle-info text-indigo-400',
                device: this.getDeviceType(),
                user: getActiveUsername()
            };

            this.logs.unshift(logItem);
            this.saveLocalLogs();

            var database = this.getDb();
            if (database) {
                try {
                    database.ref('system_logs/' + logItem.id).set(logItem).catch(function () {});
                } catch (e) {}
            }

            this.renderLogModalUI();
        },

        clearAll: function () {
            var confirmText = prompt('เพื่อความปลอดภัยของข้อมูลบน Cloud กรุณาพิมพ์คำว่า CLEAR เพื่อยืนยันการล้างประวัติ Log ทั้งหมด:');
            if (confirmText !== 'CLEAR') {
                if (confirmText !== null) alert('ยกเลิกการล้าง Log (ข้อความยืนยันไม่ตรงกับคำว่า CLEAR)');
                return;
            }
            this.logs = [];
            localStorage.removeItem('system_activity_logs');
            var database = this.getDb();
            if (database) {
                try {
                    database.ref('system_logs').remove().catch(function () {});
                } catch (e) {}
            }
            this.renderLogModalUI();
            alert('ล้างประวัติ Log ทั้งหมดเรียบร้อยแล้ว!');
        },

        exportCSV: function () {
            if (!this.logs.length) {
                alert('ยังไม่มีประวัติ Log สำหรับส่งออก');
                return;
            }
            var csvContent = "\uFEFFลำดับ,วันเวลา,หมวดหมู่,กิจกรรม,รายละเอียด,หน้าเว็บ,อุปกรณ์,ผู้ใช้งาน\n";
            this.logs.forEach(function (item, idx) {
                csvContent += '"' + (idx + 1) + '","' +
                    (item.dateTimeStr || '') + '","' +
                    (item.category || '') + '","' +
                    (item.action || '').replace(/"/g, '""') + '","' +
                    (item.details || '').replace(/"/g, '""') + '","' +
                    (item.page || '') + '","' +
                    (item.device || 'Desktop') + '","' +
                    (item.user || 'admin') + '"\n';
            });
            var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'system_activity_logs_' + new Date().toISOString().split('T')[0] + '.csv';
            document.body.appendChild(a);
            a.click();
            setTimeout(function () {
                if (document.body.contains(a)) document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 1000);
        },

        renderLogModalUI: function () {
            var tbody = document.getElementById('system-log-table-body');
            var countBadge = document.getElementById('log-total-count');
            var todayCountBadge = document.getElementById('log-today-count');
            if (!tbody) return;

            if (countBadge) countBadge.innerText = this.logs.length + ' รายการ';

            var todayIso = new Date().toISOString().split('T')[0];
            var todayCount = this.logs.filter(function (l) {
                var d = new Date(l.timestamp || Date.now());
                return d.toISOString().split('T')[0] === todayIso;
            }).length;
            if (todayCountBadge) todayCountBadge.innerText = todayCount + ' รายการ';

            var catEl = document.getElementById('log-filter-category');
            var searchEl = document.getElementById('log-filter-search');
            var filterCategory = (catEl && catEl.value) ? catEl.value : 'ALL';
            var searchQuery = (searchEl && searchEl.value) ? searchEl.value.toLowerCase() : '';

            var filtered = this.logs.filter(function (item) {
                if (filterCategory !== 'ALL' && item.category !== filterCategory) return false;
                if (searchQuery) {
                    var text = ((item.action || '') + ' ' + (item.details || '') + ' ' + (item.dateTimeStr || '') + ' ' + (item.page || '') + ' ' + (item.device || '')).toLowerCase();
                    return text.indexOf(searchQuery) !== -1;
                }
                return true;
            });

            if (filtered.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:30px; color:#94a3b8;"><i class="fa-solid fa-folder-open text-2xl mb-2"></i><div>ไม่พบรายการ Log ตามเงื่อนไขที่เลือก</div></td></tr>';
                return;
            }

            var html = '';
            filtered.forEach(function (item) {
                var catBadge = '';
                switch (item.category) {
                    case 'CREATE': catBadge = '<span style="background:rgba(16,185,129,0.2); color:#6ee7b7; border:1px solid rgba(16,185,129,0.4); padding:2px 8px; border-radius:6px; font-size:0.7rem;">🟢 เพิ่มข้อมูล</span>'; break;
                    case 'UPDATE': catBadge = '<span style="background:rgba(59,130,246,0.2); color:#93c5fd; border:1px solid rgba(59,130,246,0.4); padding:2px 8px; border-radius:6px; font-size:0.7rem;">🔵 แก้ไข</span>'; break;
                    case 'DELETE': catBadge = '<span style="background:rgba(244,63,94,0.2); color:#fda4af; border:1px solid rgba(244,63,94,0.4); padding:2px 8px; border-radius:6px; font-size:0.7rem;">🔴 ลบข้อมูล</span>'; break;
                    case 'OCR':    catBadge = '<span style="background:rgba(168,85,247,0.2); color:#c084fc; border:1px solid rgba(168,85,247,0.4); padding:2px 8px; border-radius:6px; font-size:0.7rem;">🤖 AI/OCR</span>'; break;
                    case 'EXPORT': catBadge = '<span style="background:rgba(245,158,11,0.2); color:#fcd34d; border:1px solid rgba(245,158,11,0.4); padding:2px 8px; border-radius:6px; font-size:0.7rem;">📄 ออกรายงาน</span>'; break;
                    default:       catBadge = '<span style="background:rgba(99,102,241,0.2); color:#a5b4fc; border:1px solid rgba(99,102,241,0.4); padding:2px 8px; border-radius:6px; font-size:0.7rem;">⚙️ ระบบ</span>'; break;
                }

                var deviceTag = item.device ? '<span style="background:rgba(99,102,241,0.15); color:#a5b4fc; border:1px solid rgba(99,102,241,0.3); padding:1px 6px; border-radius:4px; font-size:0.65rem;">' + escapeHtml(item.device) + '</span>' : '';

                html += '<tr style="border-bottom: 1px solid rgba(255,255,255,0.06); font-size:0.8rem; transition: background 0.15s;" onmouseover="this.style.background=\'rgba(30,41,59,0.5)\'" onmouseout="this.style.background=\'transparent\'">' +
                    '<td style="padding:10px 8px; white-space:nowrap; color:#94a3b8; font-size:0.76rem;">' +
                        '<div><i class="fa-regular fa-clock text-slate-500 mr-1"></i>' + escapeHtml(item.dateTimeStr) + '</div>' +
                        '<div style="font-size:0.68rem; color:#64748b; margin-top:3px; display:flex; align-items:center; gap:6px;">' +
                            '<span>🌐 ' + escapeHtml(item.page) + '</span>' +
                            deviceTag +
                        '</div>' +
                    '</td>' +
                    '<td style="padding:10px 8px; text-align:center;">' + catBadge + '</td>' +
                    '<td style="padding:10px 8px; font-weight:600; color:#f8fafc; display:flex; align-items:center; gap:6px;">' +
                        '<i class="' + escapeHtml(item.icon) + '"></i> ' + escapeHtml(item.action) +
                    '</td>' +
                    '<td style="padding:10px 8px; color:#cbd5e1; font-size:0.78rem; word-break:break-word;">' +
                        escapeHtml(item.details) +
                    '</td>' +
                '</tr>';
            });
            tbody.innerHTML = html;
        }
    };

    window.openSystemLogModal = function () {
        var modal = document.getElementById('system-log-modal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('active');
            modal.style.display = 'flex';
            window.SystemLogger.renderLogModalUI();
        }
    };

    window.closeSystemLogModal = function () {
        var modal = document.getElementById('system-log-modal');
        if (modal) {
            modal.classList.remove('active');
            modal.classList.add('hidden');
            modal.style.display = 'none';
        }
    };

    // =========================================================
    // 4. INDEXEDDB + SAFE LOCALSTORAGE FALLBACK FOR COMMUTE MAPS
    // =========================================================
    var IDB_NAME = 'MyPortableAppDB';
    var IDB_VERSION = 1;
    var IDB_STORE = 'commute_records';

    window.CommuteStorage = {
        _dbPromise: null,

        openDB: function () {
            if (this._dbPromise) return this._dbPromise;
            if (typeof indexedDB === 'undefined') return Promise.resolve(null);

            this._dbPromise = new Promise(function (resolve) {
                try {
                    var req = indexedDB.open(IDB_NAME, IDB_VERSION);
                    req.onupgradeneeded = function (e) {
                        var idb = e.target.result;
                        if (!idb.objectStoreNames.contains(IDB_STORE)) {
                            idb.createObjectStore(IDB_STORE, { keyPath: 'id' });
                        }
                    };
                    req.onsuccess = function (e) {
                        resolve(e.target.result);
                    };
                    req.onerror = function () {
                        resolve(null);
                    };
                } catch (err) {
                    resolve(null);
                }
            });
            return this._dbPromise;
        },

        saveLocalSafe: function (records) {
            var arr = Array.isArray(records) ? records : [];
            // 1. Save full dataset into IndexedDB (supports hundreds of MBs)
            this.openDB().then(function (idb) {
                if (!idb) return;
                try {
                    var tx = idb.transaction(IDB_STORE, 'readwrite');
                    var store = tx.objectStore(IDB_STORE);
                    store.clear();
                    arr.forEach(function (rec) {
                        if (rec && (rec.id || rec.timestamp)) {
                            if (!rec.id) rec.id = 'local_' + rec.timestamp;
                            store.put(rec);
                        }
                    });
                } catch (e) {
                    console.warn('IndexedDB write warning:', e);
                }
            });

            // 2. Save to localStorage with QuotaExceededError protection
            try {
                localStorage.setItem('parliament_commute_local', JSON.stringify(arr));
            } catch (quotaErr) {
                console.warn('localStorage quota reached, trimming localStorage cache while keeping full data in IndexedDB:', quotaErr);
                var subset = arr.slice();
                while (subset.length > 0) {
                    subset.shift(); // remove oldest from localStorage cache
                    try {
                        localStorage.setItem('parliament_commute_local', JSON.stringify(subset));
                        break;
                    } catch (e2) {}
                }
            }
        },

        loadAllLocalAsync: function (callback) {
            var localArr = [];
            try {
                var raw = localStorage.getItem('parliament_commute_local');
                if (raw) localArr = JSON.parse(raw);
            } catch (e) {
                localArr = [];
            }

            this.openDB().then(function (idb) {
                if (!idb) {
                    if (callback) callback(localArr);
                    return;
                }
                try {
                    var tx = idb.transaction(IDB_STORE, 'readonly');
                    var store = tx.objectStore(IDB_STORE);
                    var req = store.getAll();
                    req.onsuccess = function () {
                        var idbArr = req.result || [];
                        var mergedMap = new Map();
                        localArr.concat(idbArr).forEach(function (item) {
                            if (item && (item.id || item.timestamp)) {
                                mergedMap.set(item.id || item.timestamp, item);
                            }
                        });
                        var merged = Array.from(mergedMap.values());
                        if (callback) callback(merged);
                    };
                    req.onerror = function () {
                        if (callback) callback(localArr);
                    };
                } catch (e) {
                    if (callback) callback(localArr);
                }
            });
        },

        exportBackupJSON: function (allRecordsArray) {
            var data = Array.isArray(allRecordsArray) ? allRecordsArray : [];
            if (!data.length) {
                alert('ยังไม่มีข้อมูลบันทึกการเดินทางสำหรับสำรองข้อมูล');
                return;
            }
            var payload = {
                app: 'MyPortableApp_ParliamentCommute',
                exportedAt: new Date().toISOString(),
                count: data.length,
                records: data
            };
            var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8;' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'parliament_commute_backup_' + new Date().toISOString().split('T')[0] + '.json';
            document.body.appendChild(a);
            a.click();
            setTimeout(function () {
                if (document.body.contains(a)) document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 1000);
            if (window.SystemLogger) {
                window.SystemLogger.log('EXPORT', 'สำรองข้อมูล JSON', 'ส่งออกไฟล์สำรองข้อมูล ' + data.length + ' รายการ', 'fa-solid fa-download text-emerald-400');
            }
        }
    };

    // =========================================================
    // 5. USER MANAGEMENT & PASSWORD RESET MODAL (bootcamp_users)
    // =========================================================
    async function sha256Hex(text) {
        var encoder = new TextEncoder();
        var data = encoder.encode(text);
        var hashBuffer = await crypto.subtle.digest('SHA-256', data);
        var hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
    }

    window.UserManager = {
        modalEl: null,
        usersList: [],

        ensureModal: function () {
            if (this.modalEl) return this.modalEl;
            var overlay = document.createElement('div');
            overlay.id = 'user-management-modal';
            overlay.style.cssText = 'display:none; position:fixed; inset:0; background:rgba(2,6,23,0.85); backdrop-filter:blur(12px); z-index:999999; align-items:center; justify-content:center; padding:16px;';
            overlay.onclick = function () { window.UserManager.closeModal(); };

            overlay.innerHTML =
                '<div style="position:relative; width:95vw; max-width:820px; max-height:90vh; background:rgba(15,23,42,0.98); border:1px solid rgba(99,102,241,0.35); border-radius:20px; padding:20px; color:#f8fafc; display:flex; flex-direction:column; box-shadow:0 25px 50px -12px rgba(0,0,0,0.85); box-sizing:border-box;" onclick="event.stopPropagation()">' +
                    '<div style="display:flex; justify-content:space-between; align-items:center; padding-bottom:12px; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.1);">' +
                        '<div>' +
                            '<h3 style="margin:0; font-size:1.12rem; color:#a5b4fc; display:flex; align-items:center; gap:8px;">' +
                                '<i class="fa-solid fa-users-gear text-indigo-400"></i> จัดการผู้ใช้งาน & รหัสผ่าน (Registered Users)' +
                            '</h3>' +
                            '<p style="margin:4px 0 0 0; font-size:0.76rem; color:#94a3b8;">ดูรายชื่อสมาชิกที่สมัครในระบบ ตั้งรหัสผ่านใหม่ (SHA-256) หรือเปิดดู Firebase Console</p>' +
                        '</div>' +
                        '<button type="button" onclick="window.UserManager.closeModal()" style="background:rgba(244,63,94,0.2); color:#fda4af; border:1px solid rgba(244,63,94,0.4); width:32px; height:32px; border-radius:50%; cursor:pointer; font-size:1rem; display:flex; align-items:center; justify-content:center;">' +
                            '<i class="fa-solid fa-xmark"></i>' +
                        '</button>' +
                    '</div>' +
                    '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; background:rgba(30,41,59,0.65); padding:10px 14px; border-radius:12px; margin-bottom:12px; border:1px solid rgba(255,255,255,0.06);">' +
                        '<div style="font-size:0.82rem; color:#cbd5e1;">ผู้ใช้งานทั้งหมด: <strong id="um-total-users" style="color:#34d399;">0 บัญชี</strong></div>' +
                        '<div style="display:flex; gap:8px; flex-wrap:wrap;">' +
                            '<a href="https://console.firebase.google.com/project/testprod-69c21/database/testprod-69c21-default-rtdb/data" target="_blank" rel="noopener" style="background:rgba(245,158,11,0.18); border:1px solid rgba(245,158,11,0.4); color:#fcd34d; font-size:0.75rem; font-weight:600; padding:5px 10px; border-radius:8px; text-decoration:none; display:inline-flex; align-items:center; gap:5px;">' +
                                '<i class="fa-solid fa-fire text-amber-400"></i> เปิด Firebase Console' +
                            '</a>' +
                            '<a href="https://testprod-69c21-default-rtdb.firebaseio.com/bootcamp_users.json" target="_blank" rel="noopener" style="background:rgba(56,189,248,0.15); border:1px solid rgba(56,189,248,0.35); color:#7dd3fc; font-size:0.75rem; font-weight:600; padding:5px 10px; border-radius:8px; text-decoration:none; display:inline-flex; align-items:center; gap:5px;">' +
                                '<i class="fa-solid fa-code text-sky-400"></i> ดู JSON (bootcamp_users)' +
                            '</a>' +
                        '</div>' +
                    '</div>' +
                    '<div style="overflow-y:auto; flex:1; border:1px solid rgba(255,255,255,0.08); border-radius:12px; background:rgba(15,23,42,0.45);">' +
                        '<table style="width:100%; border-collapse:collapse; text-align:left; font-size:0.8rem;">' +
                            '<thead style="position:sticky; top:0; background:rgba(30,41,59,0.96); color:#a5b4fc; font-size:0.76rem;">' +
                                '<tr style="border-bottom:1px solid rgba(255,255,255,0.12);">' +
                                    '<th style="padding:10px 8px;">ผู้ใช้งาน (Username)</th>' +
                                    '<th style="padding:10px 8px;">สิทธิ์</th>' +
                                    '<th style="padding:10px 8px;">วันที่สมัคร (พ.ศ.)</th>' +
                                    '<th style="padding:10px 8px;">รหัสผ่าน (SHA-256 Hash)</th>' +
                                    '<th style="padding:10px 8px; text-align:right;">จัดการ</th>' +
                                '</tr>' +
                            '</thead>' +
                            '<tbody id="um-users-tbody">' +
                                '<tr><td colspan="5" style="text-align:center; padding:24px; color:#94a3b8;">กำลังโหลดข้อมูลผู้ใช้งาน...</td></tr>' +
                            '</tbody>' +
                        '</table>' +
                    '</div>' +
                '</div>';

            document.body.appendChild(overlay);
            this.modalEl = overlay;
            return overlay;
        },

        formatThaiDateTime: function (isoStr) {
            if (!isoStr) return '-';
            var d = new Date(isoStr);
            if (isNaN(d.getTime())) return isoStr;
            var yBE = d.getFullYear() + 543;
            var datePart = String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + yBE;
            var timePart = d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
            return datePart + ' ' + timePart + ' น.';
        },

        openModal: function () {
            var modal = this.ensureModal();
            modal.style.display = 'flex';
            this.loadUsers();
        },

        closeModal: function () {
            if (this.modalEl) this.modalEl.style.display = 'none';
        },

        loadUsers: function () {
            var self = this;
            var database = window.SystemLogger.getDb();
            var tbody = document.getElementById('um-users-tbody');
            if (!database) {
                if (tbody) tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px; color:#f43f5e;">ไม่สามารถเชื่อมต่อ Firebase ได้</td></tr>';
                return;
            }
            database.ref('bootcamp_users').once('value').then(function (snap) {
                var val = snap.val() || {};
                var keys = Object.keys(val);
                var countEl = document.getElementById('um-total-users');
                if (countEl) countEl.innerText = keys.length + ' บัญชี';

                if (!keys.length) {
                    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px; color:#94a3b8;">ไม่พบบัญชีผู้ใช้งาน</td></tr>';
                    return;
                }

                var html = '';
                keys.forEach(function (k) {
                    var u = val[k] || {};
                    var cleanKey = u.cleanUsername || k;
                    var roleBadge = (u.role === 'admin' || cleanKey === 'admin')
                        ? '<span style="background:rgba(245,158,11,0.2); color:#fcd34d; border:1px solid rgba(245,158,11,0.4); padding:2px 8px; border-radius:6px; font-size:0.7rem;">👑 Admin</span>'
                        : '<span style="background:rgba(99,102,241,0.18); color:#a5b4fc; border:1px solid rgba(99,102,241,0.35); padding:2px 8px; border-radius:6px; font-size:0.7rem;">👤 User</span>';
                    var shortHash = (u.passHash || '').substring(0, 14) + '...';

                    html += '<tr style="border-bottom:1px solid rgba(255,255,255,0.06);">' +
                        '<td style="padding:10px 8px; font-weight:600; color:#ffffff;">' +
                            '<span style="margin-right:6px;">' + escapeHtml(u.avatar || '👨‍💻') + '</span>' +
                            escapeHtml(u.username || k) +
                            '<div style="font-size:0.68rem; color:#64748b;">ID: ' + escapeHtml(cleanKey) + '</div>' +
                        '</td>' +
                        '<td style="padding:10px 8px;">' + roleBadge + '</td>' +
                        '<td style="padding:10px 8px; color:#cbd5e1; font-size:0.75rem;">' + escapeHtml(self.formatThaiDateTime(u.createdAt)) + '</td>' +
                        '<td style="padding:10px 8px; font-family:monospace; color:#94a3b8; font-size:0.72rem;" title="' + escapeHtml(u.passHash || '') + '">' + escapeHtml(shortHash) + '</td>' +
                        '<td style="padding:10px 8px; text-align:right; white-space:nowrap;">' +
                            '<button type="button" onclick="window.UserManager.resetPassword(\'' + escapeHtml(cleanKey) + '\', \'' + escapeHtml(u.username || k) + '\')" style="background:rgba(16,185,129,0.18); color:#6ee7b7; border:1px solid rgba(16,185,129,0.4); padding:4px 9px; border-radius:6px; font-size:0.72rem; font-weight:600; cursor:pointer; margin-right:5px;">' +
                                '<i class="fa-solid fa-key"></i> ตั้งรหัสใหม่' +
                            '</button>' +
                            (cleanKey !== 'admin' ? '<button type="button" onclick="window.UserManager.deleteUser(\'' + escapeHtml(cleanKey) + '\')" style="background:rgba(244,63,94,0.18); color:#fda4af; border:1px solid rgba(244,63,94,0.4); padding:4px 8px; border-radius:6px; font-size:0.72rem; cursor:pointer;" title="ลบบัญชีนี้"><i class="fa-solid fa-trash-can"></i></button>' : '') +
                        '</td>' +
                    '</tr>';
                });
                tbody.innerHTML = html;
            });
        },

        resetPassword: async function (cleanKey, displayUser) {
            var newPass = prompt('ระบุรหัสผ่านใหม่สำหรับผู้ใช้ "' + displayUser + '" (อย่างน้อย 4 ตัวอักษร):');
            if (newPass === null) return;
            if (newPass.length < 4) {
                alert('รหัสผ่านต้องมีความยาวอย่างน้อย 4 ตัวอักษร');
                return;
            }
            var hash = await sha256Hex(newPass);
            var database = window.SystemLogger.getDb();
            if (!database) return;
            await database.ref('bootcamp_users/' + cleanKey).update({ passHash: hash });
            window.SystemLogger.log('UPDATE', 'รีเซ็ตรหัสผ่านผู้ใช้', 'ตั้งรหัสผ่านใหม่ให้บัญชี ' + displayUser, 'fa-solid fa-key text-emerald-400');
            alert('ตั้งรหัสผ่านใหม่ให้ "' + displayUser + '" เรียบร้อยแล้ว!');
            this.loadUsers();
        },

        deleteUser: async function (cleanKey) {
            if (!confirm('ยืนยันลบบัญชีผู้ใช้งาน "' + cleanKey + '" หรือไม่?')) return;
            var database = window.SystemLogger.getDb();
            if (!database) return;
            await database.ref('bootcamp_users/' + cleanKey).remove();
            window.SystemLogger.log('DELETE', 'ลบบัญชีผู้ใช้', 'ลบบัญชี ' + cleanKey, 'fa-solid fa-user-xmark text-rose-400');
            this.loadUsers();
        },

        injectSharedStyles: function () {
            if (document.getElementById('shared-core-icon-styles')) return;
            var style = document.createElement('style');
            style.id = 'shared-core-icon-styles';
            style.textContent = [
                '.text-indigo-400 { color: #818cf8 !important; }',
                '.text-purple-400 { color: #c084fc !important; }',
                '.text-emerald-400 { color: #34d399 !important; }',
                '.text-amber-400 { color: #fbbf24 !important; }',
                '.text-sky-400 { color: #38bdf8 !important; }',
                '.text-rose-400 { color: #fb7185 !important; }',
                '.text-blue-400 { color: #60a5fa !important; }',
                '.text-slate-400 { color: #94a3b8 !important; }',
                '.mr-1 { margin-right: 0.25rem !important; }',
                '.mr-2 { margin-right: 0.5rem !important; }',
                '.shared-dd-link { display: flex !important; align-items: center !important; gap: 10px !important; width: 100% !important; padding: 8px 12px !important; color: #cbd5e1 !important; font-size: 0.82rem !important; font-weight: 500 !important; border-radius: 8px !important; text-decoration: none !important; background: transparent !important; border: none !important; cursor: pointer !important; transition: background 0.15s ease, color 0.15s ease !important; box-sizing: border-box !important; text-align: left !important; }',
                '.shared-dd-link:hover { background: rgba(30, 41, 59, 0.85) !important; color: #ffffff !important; }',
                '.shared-dd-link i { width: 18px !important; text-align: center !important; font-size: 0.9rem !important; }',
                '.shared-dd-logout { color: #fb7185 !important; font-weight: 600 !important; }',
                '.shared-dd-logout:hover { background: rgba(244, 63, 94, 0.15) !important; color: #fda4af !important; }'
            ].join('\n');
            (document.head || document.documentElement).appendChild(style);
        },

        renderUnifiedDropdown: function () {
            this.injectSharedStyles();
            var menu = document.getElementById('userDropdownMenu');
            if (!menu) return;

            var userObj = null;
            try {
                var raw = localStorage.getItem('vault_auth_user');
                if (raw) userObj = JSON.parse(raw);
            } catch (e) {}

            var uname = (userObj && (userObj.displayName || userObj.username)) ? (userObj.displayName || userObj.username) : 'เมนูทางลัด';
            var uavatar = (userObj && userObj.avatar) ? userObj.avatar : '👨‍💻';
            var ustatus = (userObj && userObj.username)
                ? '🟢 ล็อกอินแล้ว (' + userObj.username + ')'
                : '⚪ โหมดทั่วไป (ยังไม่ได้ล็อกอิน)';

            var topAvatarEl = document.getElementById('user-avatar');
            if (topAvatarEl && userObj && userObj.avatar) {
                topAvatarEl.innerText = userObj.avatar;
            }
            var portalNameEl = document.getElementById('portal-user-name');
            var portalAvatarEl = document.getElementById('portal-user-avatar');
            if (portalNameEl && userObj) portalNameEl.innerText = userObj.displayName || userObj.username;
            if (portalAvatarEl && userObj && userObj.avatar) portalAvatarEl.innerText = userObj.avatar;

            var currentPage = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
            var closeJs = 'if(typeof toggleUserDropdown==="function") toggleUserDropdown(event); if(typeof closeUserDropdown==="function") closeUserDropdown();';

            menu.style.width = '230px';
            menu.style.background = 'rgba(15, 23, 42, 0.97)';
            menu.style.backdropFilter = 'blur(16px)';
            menu.style.border = '1px solid rgba(255, 255, 255, 0.12)';
            menu.style.borderRadius = '16px';
            menu.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.6)';
            menu.style.overflow = 'hidden';

            menu.innerHTML =
                '<div style="padding: 12px 14px; background: rgba(30, 41, 59, 0.65); border-bottom: 1px solid rgba(255, 255, 255, 0.08); display: flex; align-items: center; gap: 10px;">' +
                    '<div id="dropdown-avatar" style="width: 38px; height: 38px; flex-shrink: 0; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">' + escapeHtml(uavatar) + '</div>' +
                    '<div style="overflow: hidden;">' +
                        '<h4 id="dropdown-username" style="margin: 0; font-size: 0.88rem; font-weight: 700; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">' + escapeHtml(uname) + '</h4>' +
                        '<span id="dropdown-role" style="font-size: 0.7rem; color: #a5b4fc; display: block; margin-top: 2px;">' + escapeHtml(ustatus) + '</span>' +
                    '</div>' +
                '</div>' +
                '<div style="padding: 6px;">' +
                    '<a href="index.html" class="shared-dd-link">' +
                        '<i class="fa-solid fa-table-cells-large text-indigo-400"></i> <span>หน้าหลัก Portal</span>' +
                    '</a>' +
                    '<a href="parliament_commute.html" class="shared-dd-link" style="' + (currentPage === 'parliament_commute.html' ? 'background:rgba(99,102,241,0.15) !important; color:#ffffff !important;' : '') + '">' +
                        '<i class="fa-solid fa-map-location-dot text-rose-400"></i> <span>รายงานแผนที่สภา</span>' +
                    '</a>' +
                    '<a href="index.html?view=notes" class="shared-dd-link" style="' + (currentPage === 'index.html' && window.location.search.indexOf('view=notes') !== -1 ? 'background:rgba(99,102,241,0.15) !important; color:#ffffff !important;' : '') + '">' +
                        '<i class="fa-solid fa-code text-sky-400"></i> <span>คลังโน้ต & Code</span>' +
                    '</a>' +
                    '<a href="bootcamp_master_learning_hub.html" class="shared-dd-link" style="' + (currentPage === 'bootcamp_master_learning_hub.html' ? 'background:rgba(99,102,241,0.15) !important; color:#ffffff !important;' : '') + '">' +
                        '<i class="fa-solid fa-rocket text-purple-400"></i> <span>Roadmap 60 วัน</span>' +
                    '</a>' +
                    '<a href="javascript:void(0)" onclick="openSystemLogModal(); ' + closeJs + '" class="shared-dd-link">' +
                        '<i class="fa-solid fa-list-check text-emerald-400"></i> <span>ประวัติ Log ระบบ</span>' +
                    '</a>' +
                    '<a href="javascript:void(0)" onclick="openUserManagementModal(); ' + closeJs + '" class="shared-dd-link">' +
                        '<i class="fa-solid fa-users-gear text-amber-400"></i> <span>จัดการผู้ใช้งาน (Users)</span>' +
                    '</a>' +
                    '<a href="javascript:void(0)" onclick="openProfileSettingsModal(); ' + closeJs + '" class="shared-dd-link">' +
                        '<i class="fa-solid fa-user-pen text-indigo-400"></i> <span>ตั้งค่าโปรไฟล์</span>' +
                    '</a>' +
                    '<div style="border-top: 1px solid rgba(255,255,255,0.08); margin-top: 4px; padding-top: 4px;">' +
                        '<button type="button" onclick="handleLogout()" class="shared-dd-link shared-dd-logout">' +
                            '<i class="fa-solid fa-right-from-bracket text-rose-400"></i> <span>ออกจากระบบ (Logout)</span>' +
                        '</button>' +
                    '</div>' +
                '</div>';
        },

        profileModalEl: null,

        ensureProfileModal: function () {
            if (this.profileModalEl) return this.profileModalEl;
            var overlay = document.createElement('div');
            overlay.id = 'profile-settings-modal';
            overlay.style.cssText = 'display:none; position:fixed; inset:0; background:rgba(2,6,23,0.85); backdrop-filter:blur(12px); z-index:999999; align-items:center; justify-content:center; padding:16px;';
            overlay.onclick = function () { window.UserManager.closeProfileModal(); };

            overlay.innerHTML =
                '<div style="position:relative; width:94vw; max-width:440px; background:rgba(15,23,42,0.98); border:1px solid rgba(99,102,241,0.35); border-radius:20px; padding:22px; color:#f8fafc; display:flex; flex-direction:column; gap:14px; box-shadow:0 25px 50px -12px rgba(0,0,0,0.85); box-sizing:border-box;" onclick="event.stopPropagation()">' +
                    '<div style="display:flex; justify-content:space-between; align-items:center; padding-bottom:10px; border-bottom:1px solid rgba(255,255,255,0.1);">' +
                        '<h3 style="margin:0; font-size:1.08rem; color:#a5b4fc; display:flex; align-items:center; gap:8px;">' +
                            '<i class="fa-solid fa-user-pen text-indigo-400"></i> ตั้งค่าโปรไฟล์ส่วนตัว' +
                        '</h3>' +
                        '<button type="button" onclick="window.UserManager.closeProfileModal()" style="background:rgba(244,63,94,0.2); color:#fda4af; border:1px solid rgba(244,63,94,0.4); width:30px; height:30px; border-radius:50%; cursor:pointer; font-size:0.95rem; display:flex; align-items:center; justify-content:center;">' +
                            '<i class="fa-solid fa-xmark"></i>' +
                        '</button>' +
                    '</div>' +
                    '<div>' +
                        '<label style="font-size:0.78rem; color:#94a3b8; display:block; margin-bottom:5px;"><i class="fa-solid fa-id-badge text-indigo-400 mr-1"></i> ชื่อบัญชีผู้ใช้ (Username)</label>' +
                        '<input type="text" id="prof-username" disabled style="width:100%; padding:9px 12px; font-size:0.85rem; background:rgba(30,41,59,0.5); border:1px solid rgba(255,255,255,0.08); border-radius:10px; color:#94a3b8; box-sizing:border-box;">' +
                    '</div>' +
                    '<div>' +
                        '<label style="font-size:0.78rem; color:#cbd5e1; font-weight:600; display:block; margin-bottom:5px;"><i class="fa-solid fa-signature text-sky-400 mr-1"></i> ชื่อที่แสดงบนระบบ (Display Name)</label>' +
                        '<input type="text" id="prof-display-name" placeholder="ระบุชื่อที่ต้องการแสดง..." style="width:100%; padding:9px 12px; font-size:0.85rem; background:rgba(15,23,42,0.95); border:1px solid rgba(255,255,255,0.15); border-radius:10px; color:#ffffff; box-sizing:border-box;">' +
                    '</div>' +
                    '<div>' +
                        '<label style="font-size:0.78rem; color:#cbd5e1; font-weight:600; display:block; margin-bottom:5px;"><i class="fa-solid fa-face-smile text-amber-400 mr-1"></i> ไอคอนโปรไฟล์ (Avatar)</label>' +
                        '<select id="prof-avatar" style="width:100%; padding:9px 12px; font-size:0.88rem; background:rgba(15,23,42,0.95); border:1px solid rgba(255,255,255,0.15); border-radius:10px; color:#ffffff; box-sizing:border-box; cursor:pointer;">' +
                            '<option value="👨‍💻">👨‍💻 Developer</option>' +
                            '<option value="👑">👑 Admin / VIP</option>' +
                            '<option value="🚀">🚀 Tech Explorer</option>' +
                            '<option value="👩‍💻">👩‍💻 Coder</option>' +
                            '<option value="🦊">🦊 Cyber Fox</option>' +
                            '<option value="⚡">⚡ Power User</option>' +
                            '<option value="🎓">🎓 Student Learner</option>' +
                        '</select>' +
                    '</div>' +
                    '<div>' +
                        '<label style="font-size:0.78rem; color:#cbd5e1; font-weight:600; display:block; margin-bottom:5px;"><i class="fa-solid fa-key text-emerald-400 mr-1"></i> เปลี่ยนรหัสผ่านใหม่ (เว้นว่างไว้หากไม่ต้องการเปลี่ยน)</label>' +
                        '<input type="password" id="prof-new-pass" placeholder="รหัสผ่านใหม่อย่างน้อย 4 ตัวอักษร..." style="width:100%; padding:9px 12px; font-size:0.85rem; background:rgba(15,23,42,0.95); border:1px solid rgba(255,255,255,0.15); border-radius:10px; color:#ffffff; box-sizing:border-box;">' +
                    '</div>' +
                    '<div style="display:flex; justify-content:flex-end; gap:10px; padding-top:8px; border-top:1px solid rgba(255,255,255,0.1);">' +
                        '<button type="button" onclick="window.UserManager.closeProfileModal()" style="background:rgba(255,255,255,0.08); color:#cbd5e1; border:1px solid rgba(255,255,255,0.15); padding:8px 16px; border-radius:10px; font-size:0.82rem; font-weight:600; cursor:pointer;">ยกเลิก</button>' +
                        '<button type="button" onclick="window.UserManager.saveProfileSettings()" style="background:linear-gradient(135deg,#6366f1,#4f46e5); color:#ffffff; border:none; padding:8px 18px; border-radius:10px; font-size:0.82rem; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:6px; box-shadow:0 4px 12px rgba(99,102,241,0.35);">' +
                            '<i class="fa-solid fa-floppy-disk"></i> บันทึกโปรไฟล์' +
                        '</button>' +
                    '</div>' +
                '</div>';

            document.body.appendChild(overlay);
            this.profileModalEl = overlay;
            return overlay;
        },

        openProfileModal: function () {
            var userObj = null;
            try {
                var raw = localStorage.getItem('vault_auth_user');
                if (raw) userObj = JSON.parse(raw);
            } catch (e) {}

            if (!userObj || !userObj.username) {
                alert('กรุณาเข้าสู่ระบบก่อนตั้งค่าโปรไฟล์');
                window.location.href = 'index.html';
                return;
            }

            var modal = this.ensureProfileModal();
            document.getElementById('prof-username').value = userObj.username;
            document.getElementById('prof-display-name').value = userObj.displayName || userObj.username;
            document.getElementById('prof-avatar').value = userObj.avatar || '👨‍💻';
            document.getElementById('prof-new-pass').value = '';
            modal.style.display = 'flex';
        },

        closeProfileModal: function () {
            if (this.profileModalEl) this.profileModalEl.style.display = 'none';
        },

        saveProfileSettings: async function () {
            var userObj = null;
            try {
                var raw = localStorage.getItem('vault_auth_user');
                if (raw) userObj = JSON.parse(raw);
            } catch (e) {}
            if (!userObj || !userObj.username) return;

            var dispName = (document.getElementById('prof-display-name').value || '').trim() || userObj.username;
            var avatar = document.getElementById('prof-avatar').value || '👨‍💻';
            var newPass = document.getElementById('prof-new-pass').value || '';

            if (newPass && newPass.length < 4) {
                alert('รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 4 ตัวอักษร');
                return;
            }

            userObj.displayName = dispName;
            userObj.avatar = avatar;
            var updates = {
                displayName: dispName,
                avatar: avatar
            };

            if (newPass) {
                var newHash = await sha256Hex(newPass);
                userObj.passHash = newHash;
                updates.passHash = newHash;
            }

            localStorage.setItem('vault_auth_user', JSON.stringify(userObj));
            if (typeof currentUser !== 'undefined' && currentUser) {
                currentUser.displayName = dispName;
                currentUser.avatar = avatar;
            }

            var cleanKey = (userObj.cleanUsername || userObj.username || '').toLowerCase().replace(/[^a-z0-9_]/g, '');
            var database = window.SystemLogger.getDb();
            if (database && cleanKey) {
                try {
                    await database.ref('bootcamp_users/' + cleanKey).update(updates);
                } catch (e) {}
            }

            this.renderUnifiedDropdown();
            this.closeProfileModal();
            window.SystemLogger.log('UPDATE', 'อัปเดตโปรไฟล์ส่วนตัว', 'แก้ไขโปรไฟล์ของ ' + userObj.username + ' (' + dispName + ')', 'fa-solid fa-user-pen text-indigo-400');
            alert('บันทึกการตั้งค่าโปรไฟล์เรียบร้อยแล้ว!');
        }
    };

    window.openUserManagementModal = function () {
        window.UserManager.openModal();
    };

    window.openProfileSettingsModal = function () {
        window.UserManager.openProfileModal();
    };

    window.UserManager.injectSharedStyles();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { window.UserManager.renderUnifiedDropdown(); });
    } else {
        setTimeout(function () { window.UserManager.renderUnifiedDropdown(); }, 20);
    }
})();
