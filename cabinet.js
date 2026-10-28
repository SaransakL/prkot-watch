
async function loadCabinet() {
    const loading = document.getElementById('cabinetLoading');
    const error = document.getElementById('cabinetError');
    const content = document.getElementById('cabinetContent');

    try {
        const response = await fetch('/data/cabinet.json');

        if (!response.ok) {
            throw new Error('ไม่สามารถโหลดข้อมูลคณะรัฐมนตรีได้');
        }

        const data = await response.json();
        const cabinet = data.cabinet;

        if (!cabinet) {
            throw new Error('ไม่พบข้อมูล cabinet ใน JSON');
        }

        // สร้างการ์ดนายกรัฐมนตรี
        const primeMinister = document.getElementById('primeMinister');
        primeMinister.replaceChildren();

        if (cabinet.primeMinister) {
            primeMinister.appendChild(
                createCabinetCard(cabinet.primeMinister, 'prime')
            );
        }

        // สร้างการ์ดรองนายกรัฐมนตรี
        const deputies = document.getElementById('deputyPrimeMinisters');
        deputies.replaceChildren();

        (cabinet.deputyPrimeMinisters ?? []).forEach(person => {
            deputies.appendChild(createCabinetCard(person, 'deputy'));
        });

        // สร้างการ์ดรัฐมนตรีว่าการกระทรวง
        const ministers = document.getElementById('ministers');
        ministers.replaceChildren();

        (cabinet.ministers ?? []).forEach(person => {
            ministers.appendChild(createCabinetCard(person, 'minister'));
        });

        loading.hidden = true;
        error.hidden = true;
        content.hidden = false;
    } catch (err) {
        console.error('Cabinet loading error:', err);
        loading.hidden = true;
        error.hidden = false;
        content.hidden = true;
    }
}

function createCabinetCard(person, type) {
    const card = document.createElement('article');
    card.className = `cabinet-card cabinet-card-${type}`;

    // รูปภาพบุคคล
    const imageWrap = document.createElement('div');
    imageWrap.className = 'cabinet-image-wrap';

    const image = document.createElement('img');
    image.className = 'cabinet-image';
    image.alt = person.name || 'รูปบุคคล';
    image.loading = 'lazy';
    image.src = person.image || '/assets/favicon.png';

    image.onerror = () => {
        image.onerror = null;
        image.src = '/assets/favicon.png';
    };

    imageWrap.appendChild(image);

    // ข้อมูลบุคคล
    const info = document.createElement('div');
    info.className = 'cabinet-info';

    const position = document.createElement('span');
    position.className = 'cabinet-position';
    position.textContent = person.position || '';

    const name = document.createElement('h3');
    name.className = 'cabinet-name';
    name.textContent = person.name || 'ไม่ระบุชื่อ';

    info.append(position, name);

    if (person.ministry) {
        const ministry = document.createElement('p');
        ministry.className = 'cabinet-ministry';
        ministry.textContent = person.ministry;
        info.appendChild(ministry);
    }

    if (person.portfolio) {
        const portfolio = document.createElement('p');
        portfolio.className = 'cabinet-description';
        portfolio.textContent = person.portfolio;
        info.appendChild(portfolio);
    }

    if (person.party) {
        const party = document.createElement('span');
        party.className = 'cabinet-party';
        party.textContent = person.party;
        info.appendChild(party);
    }

    card.append(imageWrap, info);

    return card;
}

loadCabinet();
