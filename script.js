document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    const page = path.split("/").pop() || 'index.html';

    // Auth Check
    const currentUser = localStorage.getItem('currentUser');
    const publicPages = ['login.html', 'register.html', 'index.html'];
    
    if (!currentUser && !publicPages.includes(page)) {
        window.location.href = 'login.html';
        return;
    }

    if (currentUser && publicPages.includes(page) && page !== 'index.html') {
        window.location.href = 'dashboard.html';
        return;
    }

    // --- Motivational Quotes ---
    const quotes = [
        "The only bad workout is the one that didn't happen.",
        "Action is the foundational key to all success.",
        "Your body can stand almost anything. It’s your mind that you have to convince.",
        "Fitness is not about being better than someone else. It’s about being better than you were yesterday.",
        "Motivation is what gets you started. Habit is what keeps you going."
    ];

    const quoteElement = document.getElementById('motivationalQuote');
    if (quoteElement) {
        quoteElement.textContent = quotes[Math.floor(Math.random() * quotes.length)];
    }

    // --- Page Specific Logic ---

    // Register Page
    if (page === 'register.html') {
        const registerBtn = document.getElementById('registerBtn');
        if (registerBtn) {
            registerBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;

                if (!name || !email || !password) {
                    alert('Please fill in all fields');
                    return;
                }

                const users = JSON.parse(localStorage.getItem('users') || '[]');
                if (users.find(u => u.email === email)) {
                    alert('User already exists');
                    return;
                }

                users.push({ name, email, password });
                localStorage.setItem('users', JSON.stringify(users));
                alert('Registration successful!');
                window.location.href = 'login.html';
            });
        }
    }

    // Login Page
    if (page === 'login.html' || page === 'index.html') {
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;

                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const user = users.find(u => u.email === email && u.password === password);

                if (user) {
                    localStorage.setItem('currentUser', email);
                    window.location.href = 'dashboard.html';
                } else {
                    alert('Invalid email or password');
                }
            });
        }
    }

    // Dashboard Page
    if (page === 'dashboard.html') {
        const welcomeUser = document.getElementById('welcomeUser');
        if (welcomeUser) welcomeUser.textContent = currentUser;

        updateDashboardStats();

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('currentUser');
                window.location.href = 'login.html';
            });
        }

        // BMI Calculator
        const calculateBmiBtn = document.getElementById('calculateBmiBtn');
        if (calculateBmiBtn) {
            calculateBmiBtn.addEventListener('click', () => {
                const weight = parseFloat(document.getElementById('bmiWeight').value);
                const height = parseFloat(document.getElementById('bmiHeight').value) / 100;
                if (weight > 0 && height > 0) {
                    const bmi = (weight / (height * height)).toFixed(1);
                    document.getElementById('bmiResult').textContent = `Your BMI: ${bmi}`;
                }
            });
        }
    }

    // Workout Page
    if (page === 'workout.html') {
        const addWorkoutBtn = document.getElementById('addWorkoutBtn');
        const workoutList = document.getElementById('workoutList');
        const searchBox = document.getElementById('searchBox');

        const renderWorkouts = (filter = '') => {
            const workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
            const userWorkouts = workouts.filter(w => w.userEmail === currentUser);
            const filtered = userWorkouts.filter(w => w.name.toLowerCase().includes(filter.toLowerCase()));

            workoutList.innerHTML = filtered.map(w => `
                <div class="fitness-card flex justify-between items-center mb-4 animate-fade">
                    <div>
                        <h3 class="font-bold text-lg text-neon-green">${w.name}</h3>
                        <p class="text-slate-400 text-sm">${w.date}</p>
                    </div>
                    <div class="text-right">
                        <p class="font-semibold">${w.duration} mins</p>
                        <p class="text-neon-green font-bold">${w.calories} kcal</p>
                    </div>
                </div>
            `).join('');
        };

        if (addWorkoutBtn) {
            addWorkoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const name = document.getElementById('workoutName').value;
                const duration = document.getElementById('duration').value;
                const calories = document.getElementById('calories').value;

                if (!name || !duration || !calories) {
                    alert('Please fill all fields');
                    return;
                }

                const workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
                workouts.push({
                    userEmail: currentUser,
                    name,
                    duration,
                    calories,
                    date: new Date().toLocaleDateString()
                });
                localStorage.setItem('workouts', JSON.stringify(workouts));
                
                // Clear inputs
                document.getElementById('workoutName').value = '';
                document.getElementById('duration').value = '';
                document.getElementById('calories').value = '';
                
                renderWorkouts();
            });
        }

        if (searchBox) {
            searchBox.addEventListener('input', (e) => {
                renderWorkouts(e.target.value);
            });
        }

        renderWorkouts();
    }

    // Progress Page
    if (page === 'progress.html') {
        const clearProgressBtn = document.getElementById('clearProgressBtn');
        
        const renderProgress = () => {
            const workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
            const userWorkouts = workouts.filter(w => w.userEmail === currentUser);
            
            const totalCals = userWorkouts.reduce((sum, w) => sum + parseInt(w.calories), 0);
            const totalDuration = userWorkouts.reduce((sum, w) => sum + parseInt(w.duration), 0);
            const totalWorkouts = userWorkouts.length;

            document.getElementById('totalWorkouts').textContent = totalWorkouts;
            document.getElementById('totalCalories').textContent = totalCals;
            document.getElementById('totalDuration').textContent = totalDuration;

            const historyList = document.getElementById('historyList');
            historyList.innerHTML = userWorkouts.map(w => `
                <div class="fitness-card flex justify-between items-center mb-4 animate-fade">
                    <div>
                        <h3 class="font-bold text-lg text-neon-green">${w.name}</h3>
                        <p class="text-slate-400 text-sm">${w.date}</p>
                    </div>
                    <div class="text-right">
                        <p class="font-semibold">${w.duration} mins</p>
                        <p class="text-neon-green font-bold">${w.calories} kcal</p>
                    </div>
                </div>
            `).join('');
        };

        if (clearProgressBtn) {
            clearProgressBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to clear all progress?')) {
                    const workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
                    const otherUsersWorkouts = workouts.filter(w => w.userEmail !== currentUser);
                    localStorage.setItem('workouts', JSON.stringify(otherUsersWorkouts));
                    renderProgress();
                }
            });
        }

        renderProgress();
    }

    function updateDashboardStats() {
        const workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
        const userWorkouts = workouts.filter(w => w.userEmail === currentUser);
        
        const totalCals = userWorkouts.reduce((sum, w) => sum + parseInt(w.calories), 0);
        const totalDuration = userWorkouts.reduce((sum, w) => sum + parseInt(w.duration), 0);
        const totalWorkouts = userWorkouts.length;
        
        const caloriesBurned = document.getElementById('totalCaloriesBurned');
        const workoutsCount = document.getElementById('totalWorkoutsCount');
        const durationCount = document.getElementById('totalDurationCount');

        if (caloriesBurned) caloriesBurned.textContent = totalCals;
        if (workoutsCount) workoutsCount.textContent = totalWorkouts;
        if (durationCount) durationCount.textContent = totalDuration;
    }
});
