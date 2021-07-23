let selectParts = []

function addHandlersForSelect(num, placeholderFocus, placeholderBlur) {
    let $input = selectParts[num].$input
    let $arrow = selectParts[num].$arrow
    let $list = selectParts[num].$list
    let $options = selectParts[num].$options
    let valueArray = selectParts[num].valueArray

    $input.on('input', () => {
        $list.addClass('open');
        let inputValue = $input.val().toLowerCase();
        if (inputValue.length > 0) {
            for (let j = 0; j < valueArray.length; j++) {
                if (!(inputValue.substring(0, inputValue.length) === valueArray[j].name.substring(0, inputValue.length).toLowerCase())) {
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
        $input.attr('placeholder', placeholderFocus);
        $input.addClass('open')
        $arrow.addClass('open')
        $list.addClass('open');
        $options.each((i, el) => {
            $(el).removeClass('closed');
        });
    });

    $input.on('blur', () => {
        $input.attr('placeholder', placeholderBlur);
        $input.removeClass('open')
        $arrow.removeClass('open')
        $list.removeClass('open');
        $input.val($($list).children('.chosen').text())
    });

    $options.each((i, el) => {
        $(el).on('click', () => {
            if (!$(el).hasClass('disabled')) {
                $input.val($(el).text())
                $options.each((i, el2) => {
                    $(el2).removeClass('chosen')
                })
                $(el).addClass('chosen')
                if (selectParts.length > 1) {
                    updateChosenList()
                    disableDuplicateOptions()
                }
            } else {
                $input.focus()
            }
        });
    })

    $arrow.on('click', () => {
        $($input).focus()
    })
}
