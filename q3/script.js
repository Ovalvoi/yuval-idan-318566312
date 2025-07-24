document.addEventListener("DOMContentLoaded", () => {
    const ideasContainer = document.getElementById('ideas-container');
    if (ideasContainer) {
        renderItems('הכל');
        const filter = document.getElementById('emotion-filter');
        filter.addEventListener('change', () => {
            renderItems(filter.value);
        });
    }
});

function handleFormSubmit() {
    const name = document.getElementById('attraction-name').value;
    const email = document.getElementById('creator-email').value;
    const intensity = document.getElementById('intensity').value;
    const ageLimit = document.getElementById('age-limit').value;
    const messagesDiv = document.getElementById('form-messages');
    const ideaForm = document.getElementById('idea-form');

    //  בדיקות לתקינות הטפסים
    if (name.trim() === '') {
        messagesDiv.innerHTML = 'שם האטרקציה הוא שדה חובה.';
        messagesDiv.style.color = 'red';
        return;
    }
    if (!email.includes('@')) {
        messagesDiv.innerHTML = 'יש להזין כתובת אימייל תקינה.';
        messagesDiv.style.color = 'red';
        return;
    }
    if (intensity < 1 || intensity > 5) {
        messagesDiv.innerHTML = 'דרגת האינטנסיביות חייבת להיות בין 1 ל-5.';
        messagesDiv.style.color = 'red';
        return;
    }
    if (ageLimit && (ageLimit < 0 || ageLimit > 150)) {
        messagesDiv.innerHTML = 'אנא הזן גיל הגיוני (בין 0 ל-150).';
        messagesDiv.style.color = 'red';
        return;
    }

    // יוצר אובייקט אם כל הבדיקות עברו
    const newIdea = {
        id: Math.random(),
        name: name,
        emotion: document.getElementById('main-emotion').value,
        type: document.querySelector('input[name="type"]:checked').value,
        intensity: intensity,
        ageLimit: ageLimit,
        email: email,
        status: 'חדשה'
    };

    const allIdeas = JSON.parse(localStorage.getItem('circusIdeas')) || [];
    allIdeas.push(newIdea);
    localStorage.setItem('circusIdeas', JSON.stringify(allIdeas));
    
    messagesDiv.innerHTML = 'ההצעה נשמרה בהצלחה!';
    messagesDiv.style.color = 'green';
    ideaForm.reset();
}



function loadItems() {
    const itemsJson = localStorage.getItem('circusIdeas');
    return itemsJson ? JSON.parse(itemsJson) : [];
}

function getStatusInfo(status) {
    if (status === 'אושרה') return { text: 'אושרה', color: 'green' };
    if (status === 'נדחתה') return { text: 'נדחתה', color: 'red' };
    return { text: 'חדשה', color: 'black' };
}

function renderItems(emotionFilter) {
    const container = document.getElementById('ideas-container');
    container.innerHTML = ''; 
    let items = loadItems();

    if (emotionFilter !== 'הכל') {
        items = items.filter(item => item.emotion === emotionFilter);
    }
    
    if (items.length === 0) {
        container.innerHTML = '<p>לא נמצאו הצעות התואמות לסינון.</p>';
        return;
    }

    items.forEach(item => {
        const statusInfo = getStatusInfo(item.status);
        const cardHTML = `
            <div class="idea-card">
                <h3>${item.name}</h3>
                <p><strong>רגש מרכזי:</strong> ${item.emotion}</p>
                <p><strong>סוג:</strong> ${item.type}</p>
                <p><strong>אינטנסיביות:</strong> ${item.intensity}</p>
                <p><strong>מגבלת גיל:</strong> ${item.ageLimit || 'אין'}</p>
                <div>
                    <strong>סטטוס:</strong> 
                    <select onchange="updateItemStatus(${item.id}, this.value)">
                        <option value="חדשה" ${item.status === 'חדשה' ? 'selected' : ''}>חדשה</option>
                        <option value="אושרה" ${item.status === 'אושרה' ? 'selected' : ''}>אושרה</option>
                        <option value="נדחתה" ${item.status === 'נדחתה' ? 'selected' : ''}>נדחתה</option>
                    </select>
                </div>
                <p id="status-text-${item.id}" style="color: ${statusInfo.color}; font-weight: bold;">
                    ${statusInfo.text}
                </p>
                <button class="delete-btn" onclick="deleteItem(${item.id})">מחק</button>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
}

function deleteItem(id) {
    let items = loadItems();
    items = items.filter(item => item.id != id);
    localStorage.setItem('circusIdeas', JSON.stringify(items));
    renderItems(document.getElementById('emotion-filter').value);
}

function updateItemStatus(id, newStatus) {
    let items = loadItems();
    for (let i = 0; i < items.length; i++) {
        if (items[i].id == id) {
            items[i].status = newStatus;
            break;
        }
    }
    localStorage.setItem('circusIdeas', JSON.stringify(items));

    const statusInfo = getStatusInfo(newStatus);
    const statusTextElement = document.getElementById('status-text-' + id);
    if (statusTextElement) {
        statusTextElement.textContent = statusInfo.text;
        statusTextElement.style.color = statusInfo.color;
    }
}