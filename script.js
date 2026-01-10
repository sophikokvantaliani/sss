// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Form submission handler
document.getElementById('contact-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = this;
    const messageDiv = document.getElementById('form-message');
    
    // Mostrar estado de carga
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;
    
    // Obtener datos del formulario
    const formData = new FormData();
    formData.append('name', form.querySelector('[name="name"]').value);
    formData.append('email', form.querySelector('[name="email"]').value);
    formData.append('subject', form.querySelector('[name="subject"]').value);
    formData.append('message', form.querySelector('[name="message"]').value);
    
    // URL de Google Apps Script
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzbZZIQlGwaOjRWs0tYPSCazXIgdGrtnExTmVjvVqdpuTpxGk8DM8_uM8r2NU8K6lI/exec';
    
    try {
        await fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors',
            body: formData
        });
        
        // Éxito
        messageDiv.textContent = '¡Mensaje enviado con éxito! Te contactaremos pronto.';
        messageDiv.className = 'form-message success';
        form.reset();
        
    } catch (error) {
        // Error
        messageDiv.textContent = 'Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.';
        messageDiv.className = 'form-message error';
    } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Limpiar mensaje después de 6 segundos
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = 'form-message';
        }, 6000);
    }
});

// Header background on scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(5px)';
    } else {
        header.style.backgroundColor = 'white';
        header.style.backdropFilter = 'none';
    }
});

// Animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const elementsToAnimate = document.querySelectorAll('.hero-text, .book-details, .author-content, .podcast-content, .preorder-content, .contact-content');
    
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .hero-text, .book-details, .author-content, .podcast-content, .preorder-content, .contact-content {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);
