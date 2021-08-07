class Pagination {
    curPage = 1;
    lastPage = 0;
    elementsRefreshFunc;

    constructor(func) {
        this.elementsRefreshFunc = func;
    }

    update() {
        const $paginationList = $('#pagination-list');
        $paginationList.children().remove();

        if (this.lastPage > 1) {
            let leftDotsNeeded = this.curPage > 4;
            let rightDotsNeeded = this.curPage < this.lastPage - 3;

            // Show only 1 page before and only 1 page after current
            let mostLeftPageBeforeCurrent = this.curPage - 1;
            let mostRightPageAfterCurrent = this.curPage + 1;

            // If there is only 1 page between the first page and the page before current,
            // then show it as a link instead of dots
            if (!leftDotsNeeded && this.curPage > 3) {
                mostLeftPageBeforeCurrent--;
            }
            // Same for the page after current
            if (!rightDotsNeeded && this.curPage < this.lastPage - 2) {
                mostRightPageAfterCurrent++;
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
                        this.elementsRefreshFunc();
                    }
                });
            }

            if (this.curPage > 2) {
                // Add link to the first page
                const templ = `
                    <li class="pagination-link" id="page-link-1">
                        <span>1</span>
                    </li>`;
                $paginationList.append(templ);
                $('#page-link-1').on('click', () => {
                    this.curPage = 1;
                    this.elementsRefreshFunc();
                });

                // Add dots on the left side if there are more than 4 pages before current
                if (leftDotsNeeded) {
                    const templ = `
                        <li class="pagination-link dots">
                            <span>...</span>
                        </li>`;
                    $paginationList.append(templ);
                }
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
                        this.elementsRefreshFunc();
                    });
                }
            }


            if (this.curPage < this.lastPage - 1) {
                // Add dots on the right side if there are more than 4 pages after current
                if (rightDotsNeeded) {
                    const templ = `
                        <li class="pagination-link dots">
                            <span>...</span>
                        </li>`;
                    $paginationList.append(templ);
                }

                // Add link to the last page
                const templ = `
                    <li class="pagination-link" id="page-link-${this.lastPage}">
                        <span>${this.lastPage}</span>
                    </li>`;
                $paginationList.append(templ);
                $(`#page-link-${this.lastPage}`).on('click', () => {
                    this.curPage = this.lastPage;
                    this.elementsRefreshFunc();
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
                        this.elementsRefreshFunc();
                    }
                });
            }

            $('#pagination').show();
        } else {
            $('#pagination').hide();
        }
    }
}
