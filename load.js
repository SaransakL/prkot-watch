const components = {
  "header": "/header.html",
  "footer": "/footer.html",
};

function loadHTML(divId, file) {
  fetch(file)
    .then(response => {
      if (!response.ok) throw new Error(`ไม่สามารถโหลด ${file} ได้`);
      return response.text();
    })
    .then(html => {
      document.getElementById(divId).innerHTML = html;
    })
    .catch(err => console.error(err));
}

for (const [divId, file] of Object.entries(components)) {
  loadHTML(divId, file);
}



const dropdowns = document.querySelectorAll('.dropdown');
const mobileToggle = document.querySelector('.mobile-toggle');
const navMenu = document.querySelector('.nav-menu');

// เปิด/ปิด Dropdown
dropdowns.forEach((dropdown) => {
  const trigger = dropdown.querySelector('.nav-trigger');

  trigger.addEventListener('click', (event) => {
    event.stopPropagation();

    dropdowns.forEach((item) => {
      if (item !== dropdown) {
        item.classList.remove('open');
      }
    });

    dropdown.classList.toggle('open');
  });
});

// ปิด Dropdown เมื่อคลิกด้านนอก
document.addEventListener('click', (event) => {
  if (!event.target.closest('.dropdown')) {
    dropdowns.forEach((dropdown) => {
      dropdown.classList.remove('open');
    });
  }
});

// เมนูสำหรับมือถือ
mobileToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');

  mobileToggle.setAttribute('aria-expanded', isOpen);
  mobileToggle.innerHTML = isOpen
    ? '<i class="bi bi-x-lg"></i>'
    : '<i class="bi bi-list"></i>';
});
