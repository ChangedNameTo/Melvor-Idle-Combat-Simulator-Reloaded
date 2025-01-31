/*  Melvor Idle Combat Simulator

    Copyright (C) <2020>  <Coolrox95>
    Modified Copyright (C) <2020> <Visua0>
    Modified Copyright (C) <2020, 2021> <G. Miclotte>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

(() => {
    const reqs = [
        'util',
    ];

    const setup = () => {
        const MICSR = window.MICSR;

        /**
         * Class for the cards in the bottom of the ui
         */
        MICSR.Card = class {
            /**
             * Constructs an instance of McsCard
             * @param {HTMLElement} parentElement The parent element the card should be appended to
             * @param {string} height The height of the card
             * @param {string} inputWidth The width of inputs for the card's ui elements
             * @param {boolean} outer This card is an outside card
             */
            constructor(parentElement, height, inputWidth, outer = false) {
                this.outerContainer = document.createElement('div');
                this.outerContainer.className = `mcsCardContainer${outer ? ' mcsOuter block block-rounded border-top border-combat border-4x bg-combat-inner-dark' : ''}`;
                if (height !== '') {
                    this.outerContainer.style.height = height;
                }
                this.container = document.createElement('div');
                this.container.className = 'mcsCardContentContainer';
                this.outerContainer.appendChild(this.container);
                parentElement.appendChild(this.outerContainer);
                this.inputWidth = inputWidth;
                this.dropDowns = [];
                this.numOutputs = [];
            }

            clearContainer() {
                const container = this.container;
                if (!container) {
                    return;
                }
                while (container.firstChild) {
                    container.removeChild(container.lastChild);
                }
            }

            /**
             * Creates a new button and appends it to the container. Autoadds callbacks to change colour
             * @param {string} buttonText Text to display on button
             * @param {Function} onclickCallback Callback to excute when pressed
             * @param {string} idTag Optional ID Tag
             */
            addButton(buttonText, onclickCallback) {
                const newButton = document.createElement('button');
                newButton.type = 'button';
                newButton.id = `MCS ${buttonText} Button`;
                newButton.className = 'btn btn-primary m-1';
                newButton.style.width = `100%`;
                newButton.textContent = buttonText;
                newButton.onclick = onclickCallback;
                const buttonContainer = document.createElement('div');
                buttonContainer.className = 'd-flex';
                buttonContainer.appendChild(newButton);
                this.container.appendChild(buttonContainer);
                return newButton;
            }

            /**
             * Adds an image to the card
             * @param {string} imageSource Source of image file
             * @param {number} imageSize size of image in pixels
             * @param {string} imageID Element ID
             * @return {HTMLImageElement}
             */
            addImage(imageSource, imageSize, imageID = '') {
                const newImage = document.createElement('img');
                newImage.style.width = `${imageSize}px`;
                newImage.style.height = `${imageSize}px`;
                newImage.id = imageID;
                newImage.src = imageSource;
                const div = document.createElement('div');
                div.className = 'mb-1';
                div.style.textAlign = 'center';
                div.appendChild(newImage);
                this.container.appendChild(div);
                return newImage;
            }

            /**
             * Creates a button displaying an image with a tooltip
             * @param {string} imageSource Source of the image on the button
             * @param {string} idText Text to put in the id of the button
             * @param {Function} onclickCallback Callback when clicking the button
             * @param {string} size Image size
             * @param {string} tooltip The tooltip content
             * @return {HTMLButtonElement} The created button element
             */
            createImageButton(imageSource, idText, onclickCallback, size, tooltip) {
                const newButton = document.createElement('button');
                newButton.type = 'button';
                newButton.id = `MCS ${idText} Button`;
                newButton.className = 'btn btn-outline-dark';
                newButton.onclick = onclickCallback;
                if (tooltip) newButton.dataset.tippyContent = tooltip;
                const newImage = document.createElement('img');
                newImage.className = `mcsButtonImage mcsImage${size}`;
                newImage.id = `MCS ${idText} Button Image`;
                newImage.src = imageSource;
                newButton.appendChild(newImage);
                return newButton;
            }

            /**
             * Creates multiple image buttons in a single container
             * @param {string[]} sources The image source paths
             * @param {string[]} idtexts The ids for the buttons
             * @param {string} size The size of the buttons: Small, Medium
             * @param {Function[]} onclickCallbacks The callbacks for the buttons
             * @param {string[]} tooltips The tooltip contents
             * @param {string} containerWidth container width
             * @return {HTMLDivElement[]} The image buttons
             */
            addImageButtons(sources, idtexts, size, onclickCallbacks, tooltips = [], containerWidth) {
                const newCCContainer = document.createElement('div');
                newCCContainer.className = 'mcsMultiImageButtonContainer';
                for (let i = 0; i < sources.length; i++) {
                    const newButton = this.createImageButton(sources[i], idtexts[i], onclickCallbacks[i], size, tooltips[i]);
                    newCCContainer.appendChild(newButton);
                }
                if (containerWidth) {
                    newCCContainer.style.width = containerWidth;
                }
                this.container.appendChild(newCCContainer);
            }

            /**
             * Assigns the onclick event to a popupmenu
             * @param {HTMLElement} showElement Element that should show the popup when clicked
             * @param {HTMLElement} popupMenuElement Element that should be displayed when the showElement is clicked
             */
            registerPopupMenu(showElement, popupMenuElement) {
                showElement.addEventListener('click', () => {
                    let firstClick = true;
                    if (popupMenuElement.style.display === 'none') {
                        const outsideClickListener = (event) => {
                            if (firstClick) {
                                firstClick = false;
                                return;
                            }
                            if (popupMenuElement.style.display === '') {
                                popupMenuElement.style.display = 'none';
                                document.body.removeEventListener('click', outsideClickListener);
                            }
                        };
                        document.body.addEventListener('click', outsideClickListener);
                        popupMenuElement.style.display = '';
                    }
                });
            }

            /**
             * Creates a multiple button popup menu (Equip grid)
             * @param {string[]} sources
             * @param {string[]} elIds
             * @param {HTMLElement[]} popups
             * @param {string[]} tooltips The tooltip contents
             */
            addMultiPopupMenu(sources, elIds, popups, tooltips, newCCContainer = undefined) {
                if (!newCCContainer) {
                    newCCContainer = document.createElement('div');
                }
                newCCContainer.className = 'mcsEquipmentImageContainer';
                for (let i = 0; i < sources.length; i++) {
                    const containerDiv = document.createElement('div');
                    containerDiv.style.position = 'relative';
                    containerDiv.style.cursor = 'pointer';
                    const newImage = document.createElement('img');
                    newImage.id = elIds[i];
                    newImage.src = sources[i];
                    newImage.className = 'combat-equip-img border border-2x border-rounded-equip border-combat-outline p-1';
                    newImage.dataset.tippyContent = tooltips[i];
                    newImage.dataset.tippyHideonclick = 'true';
                    containerDiv.appendChild(newImage);
                    containerDiv.appendChild(popups[i]);
                    newCCContainer.appendChild(containerDiv);
                    popups[i].style.display = 'none';
                    this.registerPopupMenu(containerDiv, popups[i]);
                }
                this.container.appendChild(newCCContainer);
                return newCCContainer;
            }

            /**
             * Adds a dropdown to the card
             * @param {string} labelText The text to label the dropdown with
             * @param {string[]} optionText The text of the dropdown's options
             * @param {Array} optionValues The values of the dropdown's options
             * @param {Function} onChangeCallback The callback for when the option is changed
             */
            addDropdown(labelText, optionText, optionValues, onChangeCallback) {
                const dropDownID = `MCS ${labelText} Dropdown`;
                const newCCContainer = this.createCCContainer();
                newCCContainer.id = `${dropDownID} Container`;
                const label = this.createLabel(labelText, dropDownID);
                label.classList.add('mb-1');
                newCCContainer.appendChild(label);
                const newDropdown = this.createDropdown(optionText, optionValues, dropDownID, onChangeCallback);
                newCCContainer.appendChild(newDropdown);
                this.container.appendChild(newCCContainer);
                return newDropdown;
            }

            /**
             * Adds a dropdown to the card, but also returns a reference to it
             * @param {string[]} optionText The text of the dropdown's options
             * @param {Array} optionValues The values of the dropdown's options
             * @param {string} dropDownID The id of the dropdown
             * @param {Function} onChangeCallback The callback for when the option is changed
             * @return {HTMLSelectElement}
             */
            createDropdown(optionText, optionValues, dropDownID, onChangeCallback) {
                const newDropdown = document.createElement('select');
                newDropdown.className = 'form-control mb-1';
                newDropdown.id = dropDownID;
                for (let i = 0; i < optionText.length; i++) {
                    const newOption = document.createElement('option');
                    newOption.text = optionText[i];
                    newOption.value = optionValues[i];
                    newDropdown.add(newOption);
                }
                newDropdown.addEventListener('change', onChangeCallback);
                this.dropDowns.push(newDropdown);
                return newDropdown;
            }

            /**
             * Adds an input to the card for a number
             * @param {string} labelText The text for the input's label
             * @param {number} startValue The initial value
             * @param {number} min The minimum value of the input
             * @param {number} max The maximum value of the input
             * @param {Function} onChangeCallback The callback for when the input changes
             */
            addNumberInput(labelText, startValue, min, max, onChangeCallback) {
                const inputID = `MCS ${labelText} Input`;
                const newCCContainer = this.createCCContainer();
                const label = this.createLabel(labelText, inputID);
                label.classList.add('mb-1');
                newCCContainer.appendChild(label);
                const newInput = document.createElement('input');
                newInput.id = inputID;
                newInput.type = 'number';
                newInput.min = min;
                newInput.max = max;
                newInput.value = startValue;
                newInput.className = 'form-control mb-1';
                newInput.addEventListener('change', onChangeCallback);
                newCCContainer.appendChild(newInput);
                this.container.appendChild(newCCContainer);
            }

            /**
             * Adds an input to the card for text
             * @param {string} labelText The text for the input's label
             * @param {string} startValue The initial text in the input
             * @param {Function} onInputCallback The callback for when the input changes
             */
            addTextInput(labelText, startValue, onInputCallback, id = null) {
                id = id === null ? labelText : id;
                const inputID = `MCS ${id} TextInput`;
                const newCCContainer = this.createCCContainer();
                const label = this.createLabel(labelText, inputID);
                label.classList.add('mb-1');
                newCCContainer.appendChild(label);
                const newInput = document.createElement('input');
                newInput.id = inputID;
                newInput.type = 'text';
                newInput.value = startValue;
                newInput.className = 'form-control mb-1';
                newInput.style.width = this.inputWidth;
                newInput.addEventListener('input', onInputCallback);
                newCCContainer.appendChild(newInput);
                this.container.appendChild(newCCContainer);
            }

            numberArrayToInputString(array) {
                if (array === undefined || array === null) {
                    return '';
                }
                if (!isNaN(array)) {
                    array = [array];
                }
                return array.toString() + ' ';
            }

            /**
             * Adds and input for number arrays to the card
             * @param labelText
             * @param object
             * @param key
             * @param defaultValue
             */
            addNumberArrayInput(labelText, object, key, defaultValue = undefined) {
                let interval = undefined;
                const onInputCallback = (event) => {
                    let input = event.currentTarget.value;
                    let result;
                    try {
                        // split input into numbers
                        result = input.split(/\D/)
                            // get rid of empty entries
                            .filter(x => x.length)
                            // parse
                            .map(x => parseInt(x))
                            // sort numerically
                            .sort((a, b) => a - b)
                            // remove duplicates
                            .filter((e, i, a) => e !== a[i - 1]);
                    } catch {
                        result = defaultValue;
                    }
                    if (result.length === 0) {
                        result = defaultValue;
                    }
                    if (input === 'undefined' || input === 'null') {
                        input = '';
                    }
                    if (interval) {
                        clearInterval(interval);
                    }
                    if (input !== this.numberArrayToInputString(object[key])) {
                        interval = setTimeout(() => {
                            object[key] = result;
                            event.target.value = this.numberArrayToInputString(result);
                        }, 500);
                    }
                }
                this.addTextInput(labelText, this.numberArrayToInputString(object[key]), onInputCallback, labelText + key);
            }

            /**
             * Adds info text
             * @param {string} textToDisplay
             * @return {HTMLDivElement}
             */
            addInfoText(textToDisplay) {
                const textDiv = document.createElement('div');
                textDiv.textContent = textToDisplay;
                textDiv.className = 'mcsInfoText';
                this.container.appendChild(textDiv);
                return textDiv;
            }

            /**
             * Adds a number output to the card
             * @param {string} labelText The text for the output's label
             * @param {string} initialValue The intial text of the output
             * @param {number} height The height of the output in pixels
             * @param {string} imageSrc An optional source for an image, if left as '', an image will not be added
             * @param {string} outputID The id of the output field
             * @param {boolean} setLabelID Whether or not to assign an ID to the label
             */
            addNumberOutput(labelText, initialValue, height, imageSrc, outputID, setLabelID = false) {
                if (!outputID) {
                    outputID = `MCS ${labelText} Output`;
                }
                // container
                const newCCContainer = this.createCCContainer();
                if (imageSrc && imageSrc !== '') {
                    newCCContainer.appendChild(this.createImage(imageSrc, height));
                }
                // label
                const newLabel = this.createLabel(labelText, outputID, setLabelID);
                if (setLabelID) {
                    newLabel.id = `MCS ${labelText} Label`;
                }
                newCCContainer.appendChild(newLabel);
                // output field
                const newOutput = document.createElement('span');
                newOutput.className = 'mcsNumberOutput';
                newOutput.style.width = this.inputWidth;
                newOutput.textContent = initialValue;
                newOutput.id = outputID;
                newCCContainer.appendChild(newOutput);
                // append container
                this.container.appendChild(newCCContainer);
                this.numOutputs.push(newOutput);
            }

            /**
             * Adds a title to the card
             * @param {string} titleText The text for the title
             * @param {string} titleID An optional id for the title, if left as '' an ID will not be assigned
             */
            addSectionTitle(titleText, titleID = undefined) {
                const newSectionTitle = document.createElement('div');
                if (titleID) {
                    newSectionTitle.id = titleID;
                }
                newSectionTitle.textContent = titleText;
                newSectionTitle.className = 'mcsSectionTitle';
                const titleContainer = document.createElement('div');
                titleContainer.className = 'd-flex justify-content-center';
                titleContainer.appendChild(newSectionTitle);
                this.container.appendChild(titleContainer);
            }

            /**
             * Adds an array of buttons to the card
             * @param {string[]} buttonText The text to put on the buttons
             * @param {number} height The height of the buttons in pixels
             * @param {number} width The width of the buttons in pixels
             * @param {Function[]} buttonCallbacks The callback function for when the buttons are clicked
             */
            addMultiButton(buttonText, buttonCallbacks, container = this.container) {
                let newButton;
                const newCCContainer = document.createElement('div');
                newCCContainer.className = 'mcsMultiButtonContainer';
                for (let i = 0; i < buttonText.length; i++) {
                    newButton = document.createElement('button');
                    newButton.type = 'button';
                    newButton.id = `MCS ${buttonText[i]} Button`;
                    newButton.className = 'btn btn-primary m-1';
                    newButton.style.width = '100%';
                    newButton.textContent = buttonText[i];
                    newButton.onclick = buttonCallbacks[i];
                    newCCContainer.appendChild(newButton);
                }
                container.appendChild(newCCContainer);
            }

            addImageToggleWithInfo(imgSrc, id, callBack, text, size = 'Medium', tooltip = '') {
                const container = this.createCCContainer();
                // image
                const img = this.createImageButton(imgSrc, id, callBack, size, tooltip);
                container.appendChild(img);
                // filled to push icon to the left and text to the righ
                const filler = document.createElement('p');
                filler.style.flexGrow = '1';
                container.appendChild(filler);
                // text
                const span = document.createElement('span');
                span.textContent = text;
                span.className = 'mcsInfoText';
                if (id) {
                    span.id = `MCS ${id} Info`;
                }
                span.style.display = 'block';
                container.appendChild(span);
                // push container to parent
                this.container.appendChild(container);
            }

            addToggleRadio(labelText, radioName, object, flag, initialYes = false, height = 25, callBack = () => {
            }) {
                const yesToggle = () => {
                    object[flag] = true;
                    callBack();
                }
                const noToggle = () => {
                    object[flag] = false;
                    callBack();
                }
                const initialRadio = initialYes ? 0 : 1;
                this.addRadio(labelText, height, radioName, ['Yes', 'No'], [yesToggle, noToggle], initialRadio);
            }

            /**
             * Adds a radio option to the card
             * @param {string} labelText The text for the option's label
             * @param {number} height The height of the radios in pixels
             * @param {string} radioName The name of the radio
             * @param {string[]} radioLabels The labels for the individual radio buttons
             * @param {Function[]} radioCallbacks The callbacks for the individual radio buttons
             * @param {number} initialRadio The initial radio that is on
             * @param {string} imageSrc An optional string to specify the source of a label image, if '' an image is not added
             */
            addRadio(labelText, height, radioName, radioLabels, radioCallbacks, initialRadio, imageSrc = '') {
                const newCCContainer = this.createCCContainer();
                if (imageSrc && imageSrc !== '') {
                    newCCContainer.appendChild(this.createImage(imageSrc, height));
                }
                newCCContainer.appendChild(this.createLabel(labelText, ''));
                newCCContainer.id = `MCS ${labelText} Radio Container`;
                const radioContainer = document.createElement('div');
                radioContainer.className = 'mcsRadioContainer';
                newCCContainer.appendChild(radioContainer);
                // Create Radio elements with labels
                for (let i = 0; i < radioLabels.length; i++) {
                    radioContainer.appendChild(this.createRadio(radioName, radioLabels[i], `MCS ${labelText} Radio ${radioLabels[i]}`, initialRadio === i, radioCallbacks[i]));
                }
                this.container.appendChild(newCCContainer);
            }

            /**
             * Creates a radio input element
             * @param {string} radioName The name of the radio collection
             * @param {string} radioLabel The text of the radio
             * @param {string} radioID The id of the radio
             * @param {boolean} checked If the radio is checked or not
             * @param {Function} radioCallback Callback for when the radio is clicked
             * @return {HTMLDivElement}
             */
            createRadio(radioName, radioLabel, radioID, checked, radioCallback) {
                const newDiv = document.createElement('div');
                newDiv.className = 'custom-control custom-radio custom-control-inline';
                const newRadio = document.createElement('input');
                newRadio.type = 'radio';
                newRadio.id = radioID;
                newRadio.name = radioName;
                newRadio.className = 'custom-control-input';
                if (checked) {
                    newRadio.checked = true;
                }
                newRadio.addEventListener('change', radioCallback);
                newDiv.appendChild(newRadio);
                const label = this.createLabel(radioLabel, radioID);
                label.className = 'custom-control-label';
                label.setAttribute('for', radioID);
                newDiv.appendChild(label);
                return newDiv;
            }

            /**
             * Creates a Card Container Container div
             * @return {HTMLDivElement}
             */
            createCCContainer() {
                const newCCContainer = document.createElement('div');
                newCCContainer.className = 'mcsCCContainer';
                return newCCContainer;
            }

            /**
             * Creates a label element
             * @param {string} labelText The text of the label
             * @param {string} referenceID The element the label references
             * @return {HTMLLabelElement}
             */
            createLabel(labelText, referenceID) {
                const newLabel = document.createElement('label');
                newLabel.className = 'mcsLabel';
                newLabel.textContent = labelText;
                newLabel.for = referenceID;
                return newLabel;
            }

            /**
             * Creates an image element
             * @param {string} imageSrc source of image
             * @param {number} height in pixels
             * @return {HTMLImageElement} The newly created image element
             */
            createImage(imageSrc, height) {
                const newImage = document.createElement('img');
                newImage.style.height = `${height}px`;
                newImage.src = imageSrc;
                return newImage;
            }

            // Prebaked functions for tooltips
            /**
             * Toggles the display of a tooltip off
             * @param {MouseEvent} e The mouseleave event
             * @param {HTMLDivElement} tooltip The tooltip element
             */
            hideTooltip(e, tooltip) {
                tooltip.style.display = 'none';
            }

            /**
             * Toggles the display of a tooltip on
             * @param {MouseEvent} e The mouseenter event
             * @param {HTMLDivElement} tooltip The tooltip element
             */
            showTooltip(e, tooltip) {
                tooltip.style.display = '';
            }
        }
    }

    let loadCounter = 0;
    const waitLoadOrder = (reqs, setup, id) => {
        if (characterSelected && !characterLoading) {
            loadCounter++;
        }
        if (loadCounter > 100) {
            console.log('Failed to load ' + id);
            return;
        }
        // check requirements
        let reqMet = characterSelected && !characterLoading;
        if (window.MICSR === undefined) {
            reqMet = false;
            console.log(id + ' is waiting for the MICSR object');
        } else {
            for (const req of reqs) {
                if (window.MICSR.loadedFiles[req]) {
                    continue;
                }
                reqMet = false;
                // not defined yet: try again later
                if (loadCounter === 1) {
                    window.MICSR.log(id + ' is waiting for ' + req);
                }
            }
        }
        if (!reqMet) {
            setTimeout(() => waitLoadOrder(reqs, setup, id), 50);
            return;
        }
        // requirements met
        window.MICSR.log('setting up ' + id);
        setup();
        // mark as loaded
        window.MICSR.loadedFiles[id] = true;
    }
    waitLoadOrder(reqs, setup, 'Card');

})();