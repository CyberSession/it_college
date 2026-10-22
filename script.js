document.addEventListener("DOMContentLoaded", () => {
    // 1. Мобільне бургер-меню
    const burgerToggle = document.getElementById("burgerToggle");
    const navLinks = document.getElementById("navLinks");

    if (burgerToggle && navLinks) {
        burgerToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    // 2. Таймер сесії на головній
    const timerElement = document.getElementById("session-timer");
    if (timerElement) {
        setInterval(() => {
            const now = new Date();
            const endSession = new Date(now.getFullYear(), 5, 30, 23, 59, 59);
            const diff = endSession - now;
            
            if (diff > 0) {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                timerElement.innerText = `⏳ До кінця семестру: ${days} днів, ${hours} годин`;
            } else {
                timerElement.innerText = "🎉 Сесія завершена!";
            }
        }, 1000);
    }

    // 3. Генератор смішних відмазок для викладача
    const excuseBtn = document.getElementById("generateExcuseBtn");
    const excuseText = document.getElementById("excuseText");
    if (excuseBtn && excuseText) {
        const excuses = [
            "«Я Вам кажу, стрілило колесо в автобусі, і от через це запізнився.»",
            "«Руку на серце, просто проспав.»",
            "«GitHub заблокував коміт через сонячну радіацію та збій в архітектурі репозиторію.»",
            "«Віртуальна машина випадково виконала рекурсивний виклик і видалила лабораторну.»",
            "«Провайдер uTeam проводив планові кібер-навчання, через що пропав інтернет на районі.»",
            "«Кіт випадково натиснув Ctrl+Z і затер увесь код у середовищі VS Code.»",
            "«Я оптимізував код настільки глибоко, що він став невидимим для людського ока.»",
            "«Я Вам кажу, стрілило колесо в автобусі, і от через це запізнився.»"
        ];
        excuseBtn.addEventListener("click", () => {
            const randomExcuse = excuses[Math.floor(Math.random() * excuses.length)];
            excuseText.innerText = randomExcuse;
        });
    }

    // 4. Пошук по матриці знань
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const val = e.target.value.toLowerCase();
            const cards = document.querySelectorAll("#materialsGrid .cyber-card");
            cards.forEach(card => {
                const text = card.innerText.toLowerCase();
                card.style.display = text.includes(val) ? "block" : "none";
            });
        });
    }

    // 5. Інтерактивний чек-лист із LocalStorage
    const checkList = document.getElementById("checkList");
    if (checkList) {
        const items = checkList.querySelectorAll(".task-item");
        
        // Зчитування збереженого стану
        const savedState = JSON.parse(localStorage.getItem("labChecklist")) || {};
        items.forEach((item, index) => {
            const checkbox = item.querySelector("input[type='checkbox']");
            if (savedState[index]) {
                checkbox.checked = true;
                item.classList.add("completed");
            }

            checkbox.addEventListener("change", () => {
                if (checkbox.checked) {
                    item.classList.add("completed");
                    savedState[index] = true;
                } else {
                    item.classList.remove("completed");
                    savedState[index] = false;
                }
                localStorage.setItem("labChecklist", JSON.stringify(savedState));
            });
        });
    }

    // 6. Дошка оголошень з LocalStorage
    const adForm = document.getElementById("adForm");
    const adsContainer = document.getElementById("adsContainer");

    if (adForm && adsContainer) {
        const loadAds = () => {
            const ads = JSON.parse(localStorage.getItem("cyberAds")) || [];
            adsContainer.innerHTML = ads.map((ad, index) => `
                <div class="cyber-card">
                    <h3>👤 ${ad.title}</h3>
                    <p>${ad.text}</p>
                    <button onclick="deleteAd(${index})" style="background:none; border:1px solid var(--neon-blue); color:var(--neon-blue); padding:5px 10px; border-radius:4px; cursor:pointer; margin-top:10px;">Видалити</button>
                </div>
            `).join("");
        };

        adForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const title = document.getElementById("adTitle").value;
            const text = document.getElementById("adText").value;
            
            const ads = JSON.parse(localStorage.getItem("cyberAds")) || [];
            ads.unshift({ title, text });
            localStorage.setItem("cyberAds", JSON.stringify(ads));

            adForm.reset();
            loadAds();
        });

        loadAds();
    }

    // 7. Кліккер кави
    const coffeeBtn = document.getElementById("coffeeBtn");
    const coffeeCount = document.getElementById("coffeeCount");

    if (coffeeBtn && coffeeCount) {
        let count = parseInt(localStorage.getItem("coffeeClicks")) || 0;
        coffeeCount.innerText = count;

        coffeeBtn.addEventListener("click", () => {
            count++;
            localStorage.setItem("coffeeClicks", count);
            coffeeCount.innerText = count;
            
            coffeeBtn.style.transform = "scale(1.3)";
            setTimeout(() => {
                coffeeBtn.style.transform = "scale(1)";
            }, 100);
        });
    }
});

// Глобальна функція видалення оголошення
window.deleteAd = function(index) {
    const ads = JSON.parse(localStorage.getItem("cyberAds")) || [];
    ads.splice(index, 1);
    localStorage.setItem("cyberAds", JSON.stringify(ads));
    location.reload();
};

// Перемикач тем
window.setTheme = function(themeName) {
    if (themeName === 'default') {
        document.body.className = '';
        localStorage.setItem('cyberTheme', 'default');
    } else {
        document.body.className = themeName;
        localStorage.setItem('cyberTheme', themeName);
    }
};

// Відновлення теми при завантаженні
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem('cyberTheme');
    if (savedTheme) {
        document.body.className = savedTheme;
    }
});


// 8. Розширена логіка Помодоро таймера у чіл-зоні з вибором часу
const pomodoroTimer = document.getElementById("pomodoroTimer");
const startPomodoroBtn = document.getElementById("startPomodoro");
const timePresetButtons = document.querySelectorAll(".time-preset");

if (pomodoroTimer && startPomodoroBtn) {
    let timerInterval = null;
    let selectedMinutes = 25; // За замовчуванням 25 хвилин
    let totalSeconds = selectedMinutes * 60;
    let isRunning = false;

    function updateTimerDisplay() {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        pomodoroTimer.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Обробка кліків на кнопки вибору часу (15, 25, 45 хв)
    timePresetButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            if (isRunning) return; // Не даємо міняти час під час активного таймера
            
            timePresetButtons.forEach(b => {
                b.style.borderColor = "var(--neon-blue)";
                b.style.color = "var(--neon-blue)";
            });
            
            btn.style.borderColor = "var(--neon-green)";
            btn.style.color = "var(--neon-green)";

            selectedMinutes = parseInt(btn.getAttribute("data-time"));
            totalSeconds = selectedMinutes * 60;
            updateTimerDisplay();
        });
    });

    startPomodoroBtn.addEventListener("click", () => {
        if (!isRunning) {
            isRunning = true;
            startPomodoroBtn.innerText = "Пауза";
            startPomodoroBtn.style.borderColor = "var(--neon-green)";
            
            // Блокуємо кнопки зміни часу під час роботи таймера
            timePresetButtons.forEach(b => b.style.opacity = "0.5");

            timerInterval = setInterval(() => {
                if (totalSeconds > 0) {
                    totalSeconds--;
                    updateTimerDisplay();
                } else {
                    clearInterval(timerInterval);
                    alert("⏰ Час фокусування вийшов! Чудова робота.");
                    totalSeconds = selectedMinutes * 60;
                    isRunning = false;
                    startPomodoroBtn.innerText = "Запустити фокус";
                    timePresetButtons.forEach(b => b.style.opacity = "1");
                    updateTimerDisplay();
                }
            }, 1000);
        } else {
            // Пауза
            clearInterval(timerInterval);
            isRunning = false;
            startPomodoroBtn.innerText = "Продовжити";
            timePresetButtons.forEach(b => b.style.opacity = "1");
        }
    });

    updateTimerDisplay();
}

// 9. Інтерактивні голо-модалки для Матриці знань
const modalOverlay = document.getElementById("topicModal");
const closeModalBtn = document.getElementById("closeModal");
const modalBodyText = document.getElementById("modalBodyText");

// База даних уроків для кожної теми
const topicContent = {
    oop: `
        <h2>🐍 Python OOP: Архітектура та Магія Класів</h2>
        <p>Об'єктно-орієнтоване програмування — це основа чистого та масштабованого коду. Забудь про хаос із глобальними змінними!</p>
        <p><strong>Основні кити ООП:</strong></p>
        <p>1. <em>Інкапсуляція</em> — приховування внутрішньої кухні об'єкта.</p>
        <p>2. <em>Наслідування</em> — переіспользование готового коду без дублювання.</p>
        <p>3. <em>Поліморфізм</em> — різна поведінка однакових методів.</p>
        <div class="code-snippet">
class Student:<br>
&nbsp;&nbsp;&nbsp;&nbsp;def __init__(self, name, group):<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;self.name = name<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;self.group = group<br><br>
&nbsp;&nbsp;&nbsp;&nbsp;def chill(self):<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return f"{self.name} питиме каву в Чіл-Зоні!"
        </div>
        <p>Використовуй цей патерн у своїх проєктах, щоб код виглядав професійно перед викладачами!</p>
    `,
    css: `
        <h2>🎨 CSS Grid & Flexbox: Магія Верстки</h2>
        <p>Коли мова заходить про адаптив під мобільні телефони та ноутбуки, без сіток не обійтися. Flexbox ідеально контролює елементи в один рядок чи колонку, а Grid будує повноцінні двовимірні макети.</p>
        <div class="code-snippet">
.cyber-grid {<br>
&nbsp;&nbsp;&nbsp;&nbsp;display: grid;<br>
&nbsp;&nbsp;&nbsp;&nbsp;grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));<br>
&nbsp;&nbsp;&nbsp;&nbsp;gap: 20px;<br>
}
        </div>
        <p>Завжди перевіряй наявність мета-тегу viewport, щоб мобільні браузери не сперечалися з твоїми медіа-запитами!</p>
    `,
    sql: `
        <h2>🛡️ SQL Бази Даних та Запити</h2>
        <p>Управління реляційними базами даних вимагає розуміння зв'язків між таблицями. Запити типу JOIN дозволяють об'єднувати дані з різних таблиць на лету.</p>
        <div class="code-snippet">
SELECT students.name, groups.title <br>
FROM students <br>
JOIN groups ON students.group_id = groups.id;<br>
        </div>
        <p>Завжди використовуй параметризовані запити, щоб захистити свій додаток від SQL-ін'єкцій!</p>
    `
};

// Слухачі подій для відкриття карток
document.querySelectorAll("#materialsGrid .cyber-card").forEach(card => {
    card.addEventListener("click", () => {
        const topicKey = card.getAttribute("data-topic");
        if (topicContent[topicKey] && modalOverlay && modalBodyText) {
            modalBodyText.innerHTML = topicContent[topicKey];
            modalOverlay.classList.add("active");
        }
    });
});

// Закриття модалки по хрестику
if (closeModalBtn && modalOverlay) {
    closeModalBtn.addEventListener("click", () => {
        modalOverlay.classList.remove("active");
    });

    // Закриття при кліку поза вікном
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove("active");
        }
    });
}