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
    }

    // Activity Page
    if (page === 'activity.html') {
        const addActivityBtn = document.getElementById('addActivityBtn');
        const activityList = document.getElementById('activityList');
        const searchBox = document.getElementById('searchBox');

        const renderActivities = (filter = '') => {
            const activities = JSON.parse(localStorage.getItem('activities') || '[]');
            const userActivities = activities.filter(a => a.userEmail === currentUser);
            const filtered = userActivities.filter(a => a.type.toLowerCase().includes(filter.toLowerCase()));

            activityList.innerHTML = filtered.map(a => `
                <div class="fitness-card flex justify-between items-center mb-4">
                    <div>
                        <h3 class="font-bold text-lg text-emerald-600">${a.type}</h3>
                        <p class="text-slate-500 text-sm">${a.date}</p>
                    </div>
                    <div class="text-right">
                        <p class="font-semibold">${a.duration} mins</p>
                        <p class="text-emerald-500 font-bold">${a.calories} kcal</p>
                    </div>
                </div>
            `).join('');
        };

        if (addActivityBtn) {
            addActivityBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const type = document.getElementById('activityType').value;
                const duration = document.getElementById('duration').value;
                const calories = document.getElementById('calories').value;

                if (!type || !duration || !calories) {
                    alert('Please fill all fields');
                    return;
                }

                const activities = JSON.parse(localStorage.getItem('activities') || '[]');
                activities.push({
                    userEmail: currentUser,
                    type,
                    duration,
                    calories,
                    date: new Date().toLocaleDateString()
                });
                localStorage.setItem('activities', JSON.stringify(activities));
                
                // Clear inputs
                document.getElementById('duration').value = '';
                document.getElementById('calories').value = '';
                
                renderActivities();
            });
        }

        if (searchBox) {
            searchBox.addEventListener('input', (e) => {
                renderActivities(e.target.value);
            });
        }

        renderActivities();
    }

    // Goals Page
    if (page === 'goals.html') {
        const saveGoalBtn = document.getElementById('saveGoalBtn');
        const goals = JSON.parse(localStorage.getItem('goals') || '{}');
        const userGoals = goals[currentUser] || { steps: 10000, calories: 2000 };

        document.getElementById('stepsGoal').value = userGoals.steps;
        document.getElementById('caloriesGoal').value = userGoals.calories;

        const updateProgress = () => {
            const activities = JSON.parse(localStorage.getItem('activities') || '[]');
            const userActivities = activities.filter(a => a.userEmail === currentUser);
            const totalCals = userActivities.reduce((sum, a) => sum + parseInt(a.calories), 0);
            
            const calProgress = Math.min((totalCals / userGoals.calories) * 100, 100);
            document.getElementById('calProgress').style.width = `${calProgress}%`;
            document.getElementById('calProgressText').textContent = `${totalCals} / ${userGoals.calories} kcal`;
        };

        if (saveGoalBtn) {
            saveGoalBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const steps = document.getElementById('stepsGoal').value;
                const calories = document.getElementById('caloriesGoal').value;

                goals[currentUser] = { steps, calories };
                localStorage.setItem('goals', JSON.stringify(goals));
                alert('Goals saved!');
                updateProgress();
            });
        }

        updateProgress();
    }

    function updateDashboardStats() {
        const activities = JSON.parse(localStorage.getItem('activities') || '[]');
        const userActivities = activities.filter(a => a.userEmail === currentUser);
        
        const totalCals = userActivities.reduce((sum, a) => sum + parseInt(a.calories), 0);
        const totalActs = userActivities.length;
        
        const stepsCount = document.getElementById('stepsCount');
        const caloriesBurned = document.getElementById('caloriesBurned');
        const totalActivities = document.getElementById('totalActivities');

        if (stepsCount) stepsCount.textContent = "8,432"; // Mock steps for demo
        if (caloriesBurned) caloriesBurned.textContent = totalCals;
        if (totalActivities) totalActivities.textContent = totalActs;
    }
});
