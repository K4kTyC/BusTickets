class Pagination {
	curPage = 1;
	lastPage = 0;
	elementsRefreshFunc;
	isRefreshing = false;

	constructor(func) {
		this.elementsRefreshFunc = func;
		this.addChoosePageTemplate();
	}

	async refresh() {
		if (!pagination.isRefreshing) {
			pagination.isRefreshing = true;
			await this.elementsRefreshFunc();
			pagination.isRefreshing = false;
		}
	}

	addChoosePageTemplate() {
		const $paginationList = $('#pagination-list');
		const templ = `
            <div class="pagination-link choose" id="page-choose">
                <span><i class="far fa-edit"></i></span>
            </div>
            
            <div class="modal pagination" id="modal-choose-page">
                <div class="content">
                    <span class="title">Быстрый переход</span>
                    <span class="modal-close" id="modal-choose-page-close"><i class="fas fa-times"></i></span>
                    <div class="choose-page input-wrap">
                        <input class="input-field" id="page-number" type="text" placeholder="Номер страницы">
                    </div>
                    <div class="choose-page-submit">
                        <a class="form-button" id="page-number-submit"><span>Перейти</span></a>
                    </div>
                </div>
            </div>
        `;
		$paginationList.after(templ);
		$('#page-choose').on('click', () => {
			$('#modal-choose-page').css('display', 'flex');
		});
		$('#modal-choose-page-close').on('click', () => {
			$('#modal-choose-page').css('display', 'none');
		});
		$('#page-number-submit').on('click', () => {
			const pageNum = parseInt($('#page-number').val());
			if (pageNum > 0 && pageNum <= this.lastPage) {
				this.curPage = pageNum;
				this.refresh();
				$('#modal-choose-page').css('display', 'none');
				$('#page-number').val('');
			}
		});
		window.onclick = function (e) {
			if (e.target === $('#modal-choose-page')[0]) {
				$('#modal-choose-page').css('display', 'none');
			}
		};
	}

	update() {
		if (this.lastPage > 1) {

			if (window.matchMedia("(min-width: 768px)").matches) {
				this.normalPagination();
			} else {
				this.mobilePagination();
			}

			$('#pagination').show();
		} else {
			$('#pagination').hide();
		}
	}

	normalPagination() {
		const $paginationList = $('#pagination-list');
		$paginationList.children().remove();

		let isLeftDotsNeeded = false;
		let isRightDotsNeeded = false;

		let mostLeftPageBeforeCurrent = 1;
		let mostRightPageAfterCurrent = 7;

		// If there are less than 8 pages then show links to all pages,
		// otherwise display pagination in compact style.
		// default style example:  < 1 2 3 4 5 6 7 >
		// compact style example:  < 1 ... 4 5 6 ... 11 > (page 5 is current)
		let isCompactStyle = this.lastPage > 7;

		if (isCompactStyle) {
			isLeftDotsNeeded = this.curPage > 4;
			isRightDotsNeeded = this.curPage < this.lastPage - 3;

			if (this.curPage < 5) {
				mostLeftPageBeforeCurrent = 1;
				mostRightPageAfterCurrent = 5;
			} else if (this.curPage > this.lastPage - 4) {
				mostLeftPageBeforeCurrent = this.lastPage - 4;
				mostRightPageAfterCurrent = this.lastPage;
			} else {
				mostLeftPageBeforeCurrent = this.curPage - 1;
				mostRightPageAfterCurrent = this.curPage + 1;
			}
		}

		// Add link to the previous page
		if (this.curPage > 1) {
			const templ = `
                <li class="pagination-link" id="page-prev">
                    <span><i class="fas fa-chevron-left"></i></span>
                </li>`;
			$paginationList.append(templ);
			$('#page-prev').on('click', () => {
				if (this.curPage > 1) {
					this.curPage--;
					this.refresh();
				}
			});
		}

		// Add link to the first page and dots on the left side
		if (isCompactStyle && isLeftDotsNeeded) {
			const templ = `
                <li class="pagination-link" id="page-link-1">
                   <span>1</span>
                </li>
                <li class="pagination-link dots">
                    <span>...</span>
                </li>`;
			$paginationList.append(templ);
			$('#page-link-1').on('click', () => {
				this.curPage = 1;
				this.refresh();
			});
		}

		// Add link to the current page and to the pages that are before and after current
		for (let pageNum = mostLeftPageBeforeCurrent; pageNum <= mostRightPageAfterCurrent; pageNum++) {
			if (pageNum < 1 || pageNum > this.lastPage) {
				continue;
			}
			const templ = `
                <li class="pagination-link ${this.curPage === pageNum ? "current" : ""}" id="page-link-${pageNum}">
                    <span>${pageNum}</span>
                </li>`;
			$paginationList.append(templ);

			if (this.curPage !== pageNum) {
				$(`#page-link-${pageNum}`).on('click', () => {
					this.curPage = pageNum;
					this.refresh();
				});
			}
		}

		// Add link to the last page and dots on the right side
		if (isCompactStyle && isRightDotsNeeded) {
			const templ = `
                <li class="pagination-link dots">
                    <span>...</span>
                </li>
                <li class="pagination-link" id="page-link-${this.lastPage}">
                        <span>${this.lastPage}</span>
                </li>`;
			$paginationList.append(templ);
			$(`#page-link-${this.lastPage}`).on('click', () => {
				this.curPage = this.lastPage;
				this.refresh();
			});
		}

		// Add link to the next page
		if (this.curPage < this.lastPage) {
			const templ = `
                <li class="pagination-link" id="page-next">
                    <span><i class="fas fa-chevron-right"></i></span>
                </li>`;
			$paginationList.append(templ);
			$('#page-next').on('click', () => {
				if (this.curPage < this.lastPage) {
					this.curPage++;
					this.refresh();
				}
			});
		}
	}

	mobilePagination() {
		const $paginationList = $('#pagination-list');
		$paginationList.children().remove();

		// Add link to the previous page
		let templ = `
            <li class="pagination-link-mobile" id="page-prev">
                <span><i class="fas fa-chevron-left"></i></span>
            </li>`;
		$paginationList.append(templ);
		$('#page-prev').on('click', () => {
			if (this.curPage > 1) {
				this.curPage--;
				this.refresh();
			}
		});

		// Add link to the current page
		templ = `
            <li class="pagination-link-mobile current" id="page-link">
                <span>${this.curPage} / ${this.lastPage}</span>
            </li>
        `;
		$paginationList.append(templ);
		$('#page-link').on('click', () => {
			$('#modal-choose-page').css('display', 'flex');
		});

		// Add link to the next page
		templ = `
            <li class="pagination-link-mobile" id="page-next">
                <span><i class="fas fa-chevron-right"></i></span>
            </li>`;
		$paginationList.append(templ);
		$('#page-next').on('click', () => {
			if (this.curPage < this.lastPage) {
				this.curPage++;
				this.refresh();
			}
		});
	}
}
