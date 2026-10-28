
async function loadParliamentStats() {
    try {
        const response = await fetch('/data/parties.json');

        if (!response.ok) {
            throw new Error('ไม่สามารถโหลดข้อมูลพรรคการเมืองได้');
        }

        const data = await response.json();
        const parties = data.parties;

        const groups = [
            {
                key: 'government',
                bar: 'government-bar',
                legend: 'government-legend',
                total: 'government-total'
            },
            {
                key: 'opposition',
                bar: 'opposition-bar',
                legend: 'opposition-legend',
                total: 'opposition-total'
            },
            {
                key: 'unknown',
                bar: 'unknown-bar',
                legend: 'unknown-legend',
                total: 'unknown-total'
            }
        ];

        groups.forEach(group => {
            const partiesInGroup = parties
                .filter(party => party.bloc === group.key)
                .sort((a, b) => b.mps - a.mps);

            const total = partiesInGroup.reduce(
                (sum, party) => sum + party.mps,
                0
            );

            const bar = document.getElementById(group.bar);
            const legend = document.getElementById(group.legend);
            const totalElement = document.getElementById(group.total);

            totalElement.textContent =
                `${total.toLocaleString('th-TH')} คน`;

            // สร้างแถบสัดส่วน
            bar.replaceChildren();

            partiesInGroup.forEach(party => {
                if (party.mps <= 0) return;

                const segment = document.createElement('div');

                segment.className = 'party-segment';
                segment.style.width =
                    `${(party.mps / total) * 100}%`;
                segment.style.backgroundColor = party.color;
                segment.title = `${party.name} ${party.mps} คน`;

                bar.appendChild(segment);
            });

            // สร้างรายการพรรค
            legend.replaceChildren();

            partiesInGroup.forEach(party => {
                const item = document.createElement('div');
                item.className = 'party-item';

                const name = document.createElement('span');
                name.className = 'party-name';

                const dot = document.createElement('span');
                dot.className = 'party-dot';
                dot.style.backgroundColor = party.color;

                const label = document.createElement('span');
                label.textContent = party.name;

                name.append(dot, label);

                const count = document.createElement('span');
                count.className = 'party-count';
                count.textContent =
                    party.mps.toLocaleString('th-TH');

                item.append(name, count);
                legend.appendChild(item);
            });
        });
    } catch (error) {
        console.error('Parliament stats error:', error);
    }
}

loadParliamentStats();

async function loadParliamentMembers() {
    try {
        const response = await fetch('/data/members.json');

        if (!response.ok) {
            throw new Error('ไม่สามารถโหลดข้อมูลสมาชิกสภาได้');
        }

        const data = await response.json();

        const groups = [
            {
                key: 'government',
                container: 'government-members'
            },
            {
                key: 'opposition',
                container: 'opposition-members'
            },
            {
                key: 'unknown',
                container: 'unknown-members'
            }
        ];

        groups.forEach(group => {
            const container = document.getElementById(group.container);

            if (!container) return;

            container.replaceChildren();

            const parties = data[group.key]?.parties ?? [];

            parties.forEach(party => {
                const partySection = document.createElement('div');
                partySection.className = 'members-party';

                // หัวข้อพรรค
                const heading = document.createElement('div');
                heading.className = 'members-party-heading';

                const partyLogo = document.createElement('img');
                partyLogo.src = party.logo;
                partyLogo.alt = '';
                partyLogo.className = 'party-logo';

                partyLogo.onerror = () => {
                    partyLogo.hidden = true;
                };

                const partyName = document.createElement('h3');
                partyName.textContent = party.name;

                const memberCount = document.createElement('span');
                memberCount.textContent =
                    `${(party.members ?? []).length.toLocaleString('th-TH')} คน`;

                heading.append(partyLogo, partyName, memberCount);

                // รายชื่อสมาชิก
                const grid = document.createElement('div');
                grid.className = 'members-grid';

                (party.members ?? []).forEach(member => {
                    const card = document.createElement('article');
                    card.className = 'member-card';

                    // รูปโปรไฟล์สมาชิก
                    const avatar = document.createElement('img');
                    avatar.className = 'member-avatar';
                    avatar.src = member.image || '/assets/favicon.png';
                    avatar.alt = member.name;
                    avatar.loading = 'lazy';

                    avatar.onerror = () => {
                        avatar.onerror = null;
                        avatar.src = '/assets/members/favicon.png';
                    };

                    // ข้อมูลสมาชิก
                    const info = document.createElement('div');
                    info.className = 'member-info';

                    const name = document.createElement('h4');
                    name.className = 'member-name';
                    name.textContent = member.name;

                    const partyLabel = document.createElement('span');
                    partyLabel.className = 'member-party-name';
                    partyLabel.textContent = `พรรค${party.name}`;

                    info.append(name, partyLabel);
                    card.append(avatar, info);
                    grid.appendChild(card);
                });

                partySection.append(heading, grid);
                container.appendChild(partySection);
            });
        });
    } catch (error) {
        console.error('Parliament members error:', error);
    }
}

loadParliamentMembers();