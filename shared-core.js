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
})();
