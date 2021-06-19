let selectParts = []

function addHandlersForSelect(stationNum) {
    let $input = selectParts[stationNum].$input
    let $arrow = selectParts[stationNum].$arrow
    let $list = selectParts[stationNum].$list
    let $options = selectParts[stationNum].$options

    $input.on('input', () => {
        $list.addClass('open');
        let inputValue = $input.val().toLowerCase();
        if (inputValue.length > 0) {
            for (let j = 0; j < stationList.length; j++) {
                if (!(inputValue.substring(0, inputValue.length) === stationList[j].name.substring(0, inputValue.length).toLowerCase())) {
                    $($options[j]).addClass('closed');
                } else {
                    $($options[j]).removeClass('closed');
                }
            }
        } else {
            for (let i = 0; i < $options.length; i++) {
                $($options[i]).removeClass('closed');
            }
        }
    });

    $input.on('focus', () => {
        $input.attr('placeholder', 'Фильтр по названию');
        $input.addClass('open')
        $arrow.addClass('open')
        $list.addClass('open');
        $options.each((i, el) => {
            $(el).removeClass('closed');
        });
    });

    $input.on('blur', () => {
        $input.attr('placeholder', 'Выберите станцию');
        $input.removeClass('open')
        $arrow.removeClass('open')
        $list.removeClass('open');
    });

    $options.each((i, el) => {
        $(el).on('click', () => {
            if (!$(el).hasClass('disabled')) {
                $input.val($(el).text())
                updateChosenList()
                disableDuplicateOptions()
            } else {
                $input.focus()
            }
        });
    })

    $arrow.on('click', () => {
        $($input).focus()
    })
}
