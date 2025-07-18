class AchievementManager {
    constructor() {
        this.achievements = {
            'pointer_master': {
                title: 'Maestro de Punteros',
                description: 'Completaste la simulación interactiva de punteros.',
                icon: 'fas fa-bullseye',
                unlocked: false
            },
            'streak_3': {
                title: '¡En racha!',
                description: 'Mantuviste una racha de 3 días.',
                icon: 'fas fa-fire',
                unlocked: false
            },
            'streak_7': {
                title: 'Semana de Sabiduría',
                description: 'Mantuviste una racha de 7 días.',
                icon: 'fas fa-meteor',
                unlocked: false
            }
        };

        this.currentStreak = 0;
        this.maxStreak = 0;
        this.lastLoginDate = null;

        this.loadState();
        this.updateStreak();
        this.initPanel();
    }

    loadState() {
        const savedAchievements = JSON.parse(localStorage.getItem('unlockedAchievements'));
        if (savedAchievements) {
            for (const id of savedAchievements) {
                if (this.achievements[id]) {
                    this.achievements[id].unlocked = true;
                }
            }
        }

        const savedStreak = JSON.parse(localStorage.getItem('streakData'));
        if (savedStreak) {
            this.currentStreak = savedStreak.currentStreak || 0;
            this.maxStreak = savedStreak.maxStreak || 0;
            this.lastLoginDate = savedStreak.lastLoginDate;
        }
    }

    saveState() {
        const unlockedIds = Object.keys(this.achievements).filter(id => this.achievements[id].unlocked);
        localStorage.setItem('unlockedAchievements', JSON.stringify(unlockedIds));

        const streakData = {
            currentStreak: this.currentStreak,
            maxStreak: this.maxStreak,
            lastLoginDate: this.lastLoginDate
        };
        localStorage.setItem('streakData', JSON.stringify(streakData));
    }

    updateStreak() {
        const today = new Date().toISOString().slice(0, 10);

        if (this.lastLoginDate) {
            const lastDate = new Date(this.lastLoginDate);
            const todayDate = new Date(today);
            const diffTime = todayDate - lastDate;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                this.currentStreak++;
            } else if (diffDays > 1) {
                this.currentStreak = 1;
            }
        } else {
            this.currentStreak = 1;
        }

        if (this.currentStreak > this.maxStreak) {
            this.maxStreak = this.currentStreak;
        }

        this.lastLoginDate = today;
        this.checkStreakAchievements();
        this.saveState();
    }

    checkStreakAchievements() {
        if (this.currentStreak >= 3) {
            this.unlock('streak_3');
        }
        if (this.currentStreak >= 7) {
            this.unlock('streak_7');
        }
    }

    unlock(id) {
        if (this.achievements[id] && !this.achievements[id].unlocked) {
            this.achievements[id].unlocked = true;
            this.saveState();
            this.showNotification(this.achievements[id]);
            this.updatePanel();
        }
    }

    showNotification(achievement) {
        const container = document.getElementById('achievement-notification-container');
        if (!container) return;
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="icon"><i class="${achievement.icon}"></i></div>
            <div class="details">
                <h4>Logro Desbloqueado</h4>
                <p>${achievement.title}</p>
            </div>
        `;
        container.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    initPanel() {
        const panel = document.getElementById('achievements-panel');
        const openBtn = document.getElementById('achievements-btn');
        const closeBtn = document.getElementById('close-achievements-btn');

        if (!panel || !openBtn || !closeBtn) return;

        openBtn.addEventListener('click', () => {
            this.updatePanel();
            panel.classList.add('visible');
        });

        closeBtn.addEventListener('click', () => {
            panel.classList.remove('visible');
        });
    }

    updatePanel() {
        const list = document.getElementById('achievements-list');
        const streakInfo = document.getElementById('streak-info');
        if (!list || !streakInfo) return;

        streakInfo.innerHTML = `
            <div class="streak-item">
                <i class="fas fa-fire"></i>
                <span>Racha Actual: ${this.currentStreak} días</span>
            </div>
            <div class="streak-item">
                <i class="fas fa-star"></i>
                <span>Racha Máxima: ${this.maxStreak} días</span>
            </div>
        `;

        list.innerHTML = '';
        for (const id in this.achievements) {
            const achievement = this.achievements[id];
            const item = document.createElement('div');
            item.className = `achievement-item ${achievement.unlocked ? 'unlocked' : ''}`;
            item.innerHTML = `
                <div class="icon"><i class="${achievement.icon}"></i></div>
                <div class="details">
                    <h4>${achievement.title}</h4>
                    <p>${achievement.description}</p>
                </div>
            `;
            list.appendChild(item);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.achievementManager = new AchievementManager();
});
