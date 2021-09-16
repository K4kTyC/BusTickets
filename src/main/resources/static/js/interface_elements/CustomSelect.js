class CustomSelect {
    static counter = 0;
    id;

    isSelectChainedToOthers = false;
    // chosenValues is a map that is created outside of the class
    // and provided as a reference to the constructor.
    // It contains id of select as the key and text representation of chosen value as the value
    chosenValues;
    // key = chosenValues map, value = array of selects that are chained to the same chosenValues map
    static chainedSelectsContainer = new Map();

    $input;
    $arrow;
    $list;
    $options;
    values;

    placeholderFocus;
    placeholderBlur;

    constructor($select, placeholders, values, isChained = false, chosenValuesMap) {
        this.id = CustomSelect.counter++;
        this.$input = $select.find('input');
        this.$arrow = $select.find('.select-arrow');
        this.$list = $select.find('ul');
        this.$options = $select.find('li');
        this.placeholderFocus = placeholders.focused;
        this.placeholderBlur = placeholders.blurred;
        this.values = values;

        if (isChained) {
            this.isSelectChainedToOthers = true;
            this.chosenValues = chosenValuesMap;
            let list = CustomSelect.chainedSelectsContainer.get(chosenValuesMap);
            if (list === undefined) {
                list = [];
            }
            list.push(this);
            CustomSelect.chainedSelectsContainer.set(chosenValuesMap, list);
            CustomSelect.updateChosenValuesList(chosenValuesMap);
        }

        this.addHandlers();
    }

    addHandlers() {
        this.$input.on('input', () => {
            this.$list.addClass('open');

            // Filter shown options
            let inputValue = this.$input.val().toLowerCase();
            if (inputValue.length > 0) {
                for (let j = 0; j < this.values.length; j++) {
                    if (!(inputValue.substring(0, inputValue.length) === this.values[j].name.substring(0, inputValue.length).toLowerCase())) {
                        $(this.$options[j]).addClass('closed');
                    } else {
                        $(this.$options[j]).removeClass('closed');
                    }
                }
            } else {
                this.$options.removeClass('closed');
            }
        });

        this.$input.on('focus', () => {
            this.$input.attr('placeholder', this.placeholderFocus);
            this.$input.addClass('open');
            this.$arrow.addClass('open');
            this.$list.addClass('open');
            this.$options.removeClass('closed');
        });

        this.$input.on('blur', () => {
            this.$input.attr('placeholder', this.placeholderBlur);
            this.$input.removeClass('open');
            this.$arrow.removeClass('open');
            this.$list.removeClass('open');

            if (this.$input.val().length === 0) {
                this.$options.removeClass('chosen');
                if (this.isSelectChainedToOthers) {
                    CustomSelect.updateChosenValuesList(this.chosenValues);
                }
            } else {
                this.$input.val(this.$list.children('.chosen').text());
            }
        });

        this.$options.each((i, el) => {
            $(el).on('click', {select: this, option: el}, this.optionClickHandler);
        });

        this.$arrow.on('click', () => {
            this.$input.focus();
        });
    }

    static updateChosenValuesList(chosenValuesMap) {
        const chainedSelects = CustomSelect.chainedSelectsContainer.get(chosenValuesMap);
        for (const select of chainedSelects) {
            const chosenValue = select.$input.val();
            chosenValuesMap.set(select.id, chosenValue);
        }
        for (const select of chainedSelects) {
            select.$options.each(function () {
                if (mapContainsSameValueWithDifferentKey(chosenValuesMap, $(this).text(), select.id)) {
                    $(this).addClass('disabled');
                } else {
                    $(this).removeClass('disabled');
                }
            });
        }
    }

    updateOptions() {
        this.$options = this.$list.find('li');
        this.$options.each((i, el) => {
            $(el).off('click');
            $(el).on('click', {select: this, option: el}, this.optionClickHandler);
        });
    }

    optionClickHandler(event) {
        const select = event.data.select;
        const el = event.data.option;

        if (!$(el).hasClass('disabled')) {
            select.$input.val($(el).text());
            select.$options.removeClass('chosen');
            $(el).addClass('chosen');
            if (select.isSelectChainedToOthers) {
                CustomSelect.updateChosenValuesList(select.chosenValues);
            }
        } else {
            select.$input.focus();
        }
    }
}
