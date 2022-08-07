document.getElementById('sidebar-toggle').addEventListener('click', async () => {
	let sidebar = document.getElementById('sidebar');
	let icons = sidebar.children[0];
	if (!sidebar.classList.contains('closed')) {
		saveToLocalStorage('isSidebarClosed', true);
		let isAnySubmenuOpened = false;
		document.querySelectorAll("[data-toggle='submenu']").forEach(e => {
			let submenu = document.getElementById(e.getAttribute('data-target'));
			if (!submenu.classList.contains('closed')) {
				isAnySubmenuOpened = true;
				submenu.classList.add('closed');
				saveToLocalStorage('openedSubmenus', []);
			}
		});
		if (isAnySubmenuOpened) {
			// wait for submenus closing
			await new Promise(r => setTimeout(r, 400));
		}
		sidebar.querySelector('.content .links-list').scrollTop = 0;
		icons.classList.remove('hide');
	} else {
		saveToLocalStorage('isSidebarClosed', false);
		setTimeout(() => {
			icons.classList.add('hide');
		}, 500);
	}
	sidebar.classList.toggle('closed');
});

/* Process submenus */
document.querySelectorAll("[data-toggle='submenu']")
	.forEach(e => e.addEventListener('click', () => {
		let submenuId = e.getAttribute('data-target');
		let submenu = document.getElementById(submenuId);

		if (submenu.classList.contains('closed')) {
			submenu.classList.remove('closed');
			let openedSubmenus = new Set(loadFromLocalStorage('openedSubmenus'));
			openedSubmenus.add(submenuId);
			saveToLocalStorage('openedSubmenus', Array.from(openedSubmenus));
		} else {
			submenu.classList.add('closed');
			let openedSubmenus = new Set(loadFromLocalStorage('openedSubmenus'));
			openedSubmenus.delete(submenuId);
			saveToLocalStorage('openedSubmenus', Array.from(openedSubmenus));
		}
	}));