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

