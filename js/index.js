// Ticket to Now - Main Application Logic
// 通往當下的票

class TicketToNow {
    constructor() {
        this.tickets = [];
        this.breathData = {};
        this.currentTicket = null;
        this.savedTickets = this.loadSavedTickets();
        this.breathTimer = null;
        this.breathTimeRemaining = 60;
        
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.checkTodayTicket();
    }

    async loadData() {
        try {
            // 載入票卡資料
            const ticketsResponse = await fetch('data/tickets.json');
            this.tickets = await ticketsResponse.json();

            // 載入呼吸引導資料
            const breathResponse = await fetch('data/breath.json');
            this.breathData = await breathResponse.json();

            console.log('資料載入成功');
        } catch (error) {
            console.error('資料載入失敗:', error);
            this.showNotification('資料載入失敗，請重新整理頁面');
        }
    }

    setupEventListeners() {
        // 主畫面
        const ticketInput = document.getElementById('ticketInput');
        const drawButton = document.getElementById('drawButton');

        ticketInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.drawTicket();
            }
        });

        drawButton.addEventListener('click', () => this.drawTicket());

        // 結果畫面
        document.getElementById('backButton').addEventListener('click', () => this.backToMain());
        document.getElementById('breathButton').addEventListener('click', () => this.startBreathPractice());
        document.getElementById('saveButton').addEventListener('click', () => this.saveTicket());
        document.getElementById('shareButton').addEventListener('click', () => this.shareTicket());

        // 呼吸練習畫面
        document.getElementById('stopBreathButton').addEventListener('click', () => this.stopBreathPractice());

        // 收藏列表
        document.getElementById('savedListButton').addEventListener('click', () => this.showSavedList());
        document.getElementById('closeModal').addEventListener('click', () => this.closeSavedList());

        // 點擊 modal 背景關閉
        document.getElementById('savedListModal').addEventListener('click', (e) => {
            if (e.target.id === 'savedListModal') {
                this.closeSavedList();
            }
        });
    }

    drawTicket() {
        const input = document.getElementById('ticketInput');
        const ticketNumber = parseInt(input.value);

        if (!ticketNumber || ticketNumber < 1 || ticketNumber > 500) {
            this.showNotification('也許答案不在數字裡，而在你此刻的呼吸中。');
            return;
        }

        const ticket = this.tickets.find(t => t.id === ticketNumber);
        
        if (ticket) {
            this.showTicket(ticket);
        } else {
            // 如果找不到對應票號，生成預設內容
            this.showTicket({
                id: ticketNumber,
                theme: '當下流域',
                title: '回到呼吸',
                content: '此刻就是最好的時刻。',
                question: '我現在需要什麼？',
                breath: 'focus',
                color: '#E8F0F8'
            });
        }
    }

    drawRandomTicket() {
        const randomIndex = Math.floor(Math.random() * this.tickets.length);
        const ticket = this.tickets[randomIndex];
        this.showTicket(ticket);
    }

    showTicket(ticket) {
        this.currentTicket = ticket;

        // 更新畫面內容
        document.getElementById('ticketNumber').textContent = `#${ticket.id}`;
        document.getElementById('ticketTheme').textContent = ticket.theme;
        document.getElementById('ticketTitle').textContent = ticket.title;
        document.getElementById('ticketContent').textContent = ticket.content;
        document.getElementById('ticketQuestion').textContent = ticket.question;

        // 更新顏色主題
        const breathCircle = document.getElementById('breathCircle');
        breathCircle.style.background = `linear-gradient(135deg, ${ticket.color} 0%, ${this.lightenColor(ticket.color, 20)} 100%)`;

        // 切換畫面
        this.switchScreen('resultScreen');

        // 儲存今日抽卡記錄
        localStorage.setItem('todayTicket', JSON.stringify({
            ticket: ticket,
            date: new Date().toDateString()
        }));
    }

    startBreathPractice() {
        const breathType = this.currentTicket?.breath || 'gentle';
        const breathGuide = this.breathData[breathType];

        if (!breathGuide) {
            this.showNotification('呼吸引導資料載入失敗');
            return;
        }

        this.switchScreen('breathScreen');
        this.breathTimeRemaining = 60;
        this.updateBreathTimer();

        // 開始呼吸動畫與指引
        this.runBreathCycle(breathGuide);

        // 開始計時器
        this.breathTimer = setInterval(() => {
            this.breathTimeRemaining--;
            this.updateBreathTimer();

            if (this.breathTimeRemaining <= 0) {
                this.stopBreathPractice();
            }
        }, 1000);
    }

    runBreathCycle(breathGuide) {
        const { inhale, hold, exhale } = breathGuide.pattern;
        const totalCycle = inhale + hold + exhale;
        let cycleTime = 0;

        const breathInstruction = document.getElementById('breathInstruction');
        const breathAnimation = document.getElementById('breathAnimation');

        const updateBreathState = () => {
            if (!document.getElementById('breathScreen').classList.contains('active')) {
                return;
            }

            const cyclePosition = cycleTime % totalCycle;

            if (cyclePosition < inhale) {
                breathInstruction.textContent = '吸氣';
                breathAnimation.style.transform = `scale(${0.8 + (cyclePosition / inhale) * 0.4})`;
                breathAnimation.style.opacity = `${0.4 + (cyclePosition / inhale) * 0.4}`;
            } else if (cyclePosition < inhale + hold) {
                breathInstruction.textContent = '停留';
                breathAnimation.style.transform = 'scale(1.2)';
                breathAnimation.style.opacity = '0.8';
            } else {
                breathInstruction.textContent = '吐氣';
                const exhaleProgress = (cyclePosition - inhale - hold) / exhale;
                breathAnimation.style.transform = `scale(${1.2 - exhaleProgress * 0.4})`;
                breathAnimation.style.opacity = `${0.8 - exhaleProgress * 0.4}`;
            }

            cycleTime++;
            requestAnimationFrame(updateBreathState);
        };

        updateBreathState();
    }

    updateBreathTimer() {
        const minutes = Math.floor(this.breathTimeRemaining / 60);
        const seconds = this.breathTimeRemaining % 60;
        document.getElementById('breathTimer').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    stopBreathPractice() {
        if (this.breathTimer) {
            clearInterval(this.breathTimer);
            this.breathTimer = null;
        }
        this.switchScreen('resultScreen');
        this.showNotification('練習完成，感受此刻的自己');
    }

    saveTicket() {
        if (!this.currentTicket) return;

        const savedTickets = this.loadSavedTickets();
        
        // 檢查是否已收藏
        const exists = savedTickets.some(t => t.id === this.currentTicket.id);
        
        if (exists) {
            this.showNotification('這張票已經在收藏中了');
            return;
        }

        savedTickets.push({
            ...this.currentTicket,
            savedAt: new Date().toISOString()
        });

        localStorage.setItem('savedTickets', JSON.stringify(savedTickets));
        this.savedTickets = savedTickets;
        this.showNotification('已收藏這句話');
    }

    shareTicket() {
        if (!this.currentTicket) return;

        const shareText = `${this.currentTicket.title}\n${this.currentTicket.content}\n\n— Ticket to Now #${this.currentTicket.id}`;

        if (navigator.share) {
            navigator.share({
                title: 'Ticket to Now',
                text: shareText,
                url: window.location.href
            }).catch(() => {
                this.copyToClipboard(shareText);
            });
        } else {
            this.copyToClipboard(shareText);
        }
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('已複製到剪貼簿');
        }).catch(() => {
            this.showNotification('複製失敗，請手動複製');
        });
    }

    showSavedList() {
        const savedList = document.getElementById('savedList');
        const savedTickets = this.loadSavedTickets();

        if (savedTickets.length === 0) {
            savedList.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary);">還沒有收藏任何票</p>';
        } else {
            savedList.innerHTML = savedTickets.reverse().map(ticket => `
                <div class="saved-item" onclick="app.loadSavedTicket(${ticket.id})">
                    <div class="saved-item-header">#${ticket.id} · ${ticket.theme}</div>
                    <div class="saved-item-content">${ticket.title}</div>
                </div>
            `).join('');
        }

        document.getElementById('savedListModal').classList.add('active');
    }

    loadSavedTicket(ticketId) {
        const ticket = this.tickets.find(t => t.id === ticketId) || 
                      this.savedTickets.find(t => t.id === ticketId);
        
        if (ticket) {
            this.closeSavedList();
            this.showTicket(ticket);
        }
    }

    closeSavedList() {
        document.getElementById('savedListModal').classList.remove('active');
    }

    loadSavedTickets() {
        const saved = localStorage.getItem('savedTickets');
        return saved ? JSON.parse(saved) : [];
    }

    checkTodayTicket() {
        const todayData = localStorage.getItem('todayTicket');
        
        if (todayData) {
            const { ticket, date } = JSON.parse(todayData);
            const today = new Date().toDateString();
            
            if (date === today) {
                const hint = document.querySelector('.hint');
                hint.innerHTML = `今天你已抽過 <strong>#${ticket.id}</strong><br>想再抽一張嗎？`;
            }
        }
    }

    switchScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    backToMain() {
        this.switchScreen('mainScreen');
        document.getElementById('ticketInput').value = '';
        document.getElementById('ticketInput').focus();
    }

    showNotification(message) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255))
            .toString(16).slice(1);
    }
}

// 初始化應用程式
const app = new TicketToNow();

// 全域函式供 HTML 內聯事件使用
window.app = app;
