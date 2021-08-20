class NotificationPopup {
    static counter = 0;

    text;
    duration;
    id;

    openingAnimationTime = 1000;
    closingAnimationTime = 1000;

    $notification;
    $progressBar;

    constructor(text, duration) {
        this.id = NotificationPopup.counter++;
        this.text = text;

        if (duration === undefined) {
            this.duration = 6500;
        } else {
            this.duration = duration;
        }

        this.create();
    }

    create() {
        const templ = `
            <div class="notification-progress-bar" id="notification-bar-${this.id}">
                <div></div>
            </div>
            <div class="notification-popup" id="notification-${this.id}">
                <div class="content">${this.text}</div>
            </div>`;
        $('#notification-wrapper').append(templ);
        this.$notification = $(`#notification-${this.id}`);
        this.$progressBar = $(`#notification-bar-${this.id}`);

        this.$notification.on('click', () => {
            this.$progressBar.children().finish();
            this.remove();
        });

        this.openingAnimation();

        if (this.duration > 0) {
            setTimeout(() => {
                this.$progressBar.children().animate({width: '100%'}, this.duration, 'linear');
                setTimeout(() => {
                    this.remove();
                }, this.duration);
            }, this.openingAnimationTime);
        } else {
            this.$progressBar.children().css('width', '100%');
        }
    }

    remove() {
        this.closingAnimation();

        setTimeout(() => {
            this.$notification.remove();
            this.$progressBar.remove();
        }, this.closingAnimationTime);
    }

    openingAnimation() {
        this.$progressBar.addClass('opening');
        this.$notification.addClass('opening');
        setTimeout(() => {
            this.$progressBar.removeClass('opening');
            this.$notification.removeClass('opening');
        }, this.openingAnimationTime);
    }

    closingAnimation() {
        this.$progressBar.addClass('closing');
        this.$notification.addClass('closing');
        setTimeout(() => {
            this.$progressBar.removeClass('closing');
            this.$notification.removeClass('closing');
        }, this.closingAnimationTime);
    }
}