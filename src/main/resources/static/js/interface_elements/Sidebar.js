document.getElementById('sidebar-toggle').addEventListener('click', async () => {
	let sidebar = document.getElementById('sidebar');
	let icons = sidebar.children[0];
	if (!sidebar.classList.contains('closed')) {
		let isAnySubmenuOpened = false;
		document.querySelectorAll('.submenu-toggle').forEach(e => {
			if (!e.checked) {
				isAnySubmenuOpened = true;
			}
			e.checked = true;
		});
		if (isAnySubmenuOpened) {
			// wait for submenus closing
			await new Promise(r => setTimeout(r, 400));
		}
		sidebar.querySelector('.content .links-list').scrollTop = 0;
		icons.classList.remove('hide');
	} else {
		setTimeout(() => {
			icons.classList.add('hide');
		}, 500);
	}
	sidebar.classList.toggle('closed');
});