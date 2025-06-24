// Interacciones realistas
document.querySelectorAll('.instagram-post').forEach(post => {
  post.addEventListener('click', () => {
    window.open('https://www.instagram.com/paloma_nails_boutique/', '_blank');
  });
});

// Botón Seguir interactivo
const followBtn = document.getElementById('follow-button');
followBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  followBtn.classList.toggle('following');
  followBtn.textContent = followBtn.classList.contains('following') ? 'Siguiendo' : 'Seguir';
});