ContactUs = {
    ToFocus: '',

    MemQuery: function (ctrl) {
        var form = ctrl.form;
        var formData = this.SerializeObject(form);

        if (this.Validate(formData, form)) {
            var data = {
                callerCatCode: 'MEM',
                message: this.FormatMsg(formData, form),
                internalID: formData.MemCardNum
            };

            ContactUs.SubmitData(data);
        }
        else {
            return false;
        }
    },

    EmpQuery: function (ctrl) {
        var form = ctrl.form;
        var formData = this.SerializeObject(form);

        if (this.Validate(formData, form)) {
            var data = {
                callerCatCode: 'CPY',
                message: this.FormatMsg(formData, form),
                internalID: ''
            };

            ContactUs.SubmitData(data);
        }
        else {
            return false;
        }
    },

    PracQuery: function (ctrl) {
        var form = ctrl.form;
        var formData = this.SerializeObject(form);

        if (this.Validate(formData, form)) {
            var data = {
                callerCatCode: 'PRAC',
                message: this.FormatMsg(formData, form),
                internalID: formData.PracNum
            };

            ContactUs.SubmitData(data);
        }
        else {
            return false;
        }
    },

    GenQuery: function (ctrl) {
        var form = ctrl.form;
        var formData = this.SerializeObject(form);

        if (this.Validate(formData, form)) {
            var data = {
                callerCatCode: 'MEM',   //Defualt to MEM
                message: this.FormatMsg(formData, form),
                internalID: ''
            };

            ContactUs.SubmitData(data);
        }
        else {
            return false;
        }
    },

    SignUp: function (ctrl) {
        var form = ctrl.form;
        var formData = this.SerializeObject(form);

        if (this.Validate(formData, form)) {
            var data = {
                callerCatCode: formData.CallerCatCode,
                message: this.FormatMsg(formData, form),
                internalID: ''
            };

            ContactUs.SubmitData(data);
        }
        else {
            return false;
        }
    },

    Validate: function (data, form) {
        //Check the required fields
        var labels = form.getElementsByTagName('LABEL');
        for (var i = 0; i < labels.length; i++) {
            var formElement = form.elements[labels[i].htmlFor];
            if (formElement.required && formElement.value === '') {
                this.DisplayMsg('error', labels[i].innerText + ' is required');
                this.ToFocus = formElement;
                return false;
            }
        }

        if (data.ContactNum === '' && data.Email === '') {
            this.DisplayMsg('error', 'Please provide either an email address or a contact number.');
            return false;
        }
        else {
            return true;
        }
    },

    SubmitData: function (data) {
        (function ($) {
            $.ajax({
                url: WebServiceUrl + "corres/contactus",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                type: "POST",
                crossDomain: true,
                data: JSON.stringify(data),
                dataType: "json",
                success: function (data) {
                    ContactUs.DisplayMsg('success', 'Success!\n\rWe will contact you as soon as possible. Please use Reference number: ' + data.rfsLogNum);
                },
                error: function () {
                    ContactUs.DisplayMsg('error', 'Something went wrong.\n\rAlternatively give us a call on 0211401536');
                }
            });
        })(jQuery);
    },

    SerializeObject: function (form) {
        var objectData = {};
        var i;

        for (i = 0; i < form.length; i++) {
            var value;
            var thisElement = form.elements[i];

            if (thisElement.nodeName !== 'BUTTON') {
                if (thisElement.value != null) {
                    value = thisElement.value;
                } else {
                    value = '';
                }

                if (objectData[thisElement.name] != null) {
                    if (!objectData[thisElement.name].push) {
                        objectData[thisElement.name] = [objectData[thisElement.name]];
                    }

                    objectData[thisElement.name].push(value);
                } else {
                    objectData[thisElement.name] = value;
                }
            }
        }

        return objectData;
    },

    FormatMsg: function (msgObj, form) {
        var msg = '';
        var labels = form.getElementsByTagName('LABEL');

        for (var i = 0; i < labels.length; i++) {
            var value;
            var thisElement = form.elements[labels[i].htmlFor];

            if (thisElement.nodeName === 'SELECT') {
                value = thisElement[thisElement.selectedIndex].innerHTML;
            }
            else {
                value = msgObj[labels[i].htmlFor];
            }

            if (value !== undefined && value !== '') {
                msg += labels[i].innerText + ': ' + value + '; ';
            }
        }

        return msg.trim();
    },

    DisplayMsg: function (type, text, element) {
        var dlg = document.getElementById('dlg');

        document.getElementById('txtMsg').innerText = text;

        if (type === 'error') {
            if (dlg.classList.contains('bteal')) {
                dlg.classList.remove('bteal');
            }
            dlg.classList.add('bpeach');
        }
        else if (type === 'success') {
            if (dlg.classList.contains('bpeach')) {
                dlg.classList.remove('bpeach');
            }
            dlg.classList.add('bteal');
        }

        document.getElementById('nhcDialog').style.visibility = 'visible';
    },

    DlgClose: function () {
        document.getElementById('nhcDialog').style.visibility = 'hidden';

        if (this.ToFocus !== undefined && this.ToFocus !== '') {
            this.ToFocus.focus();
            this.ToFocus = '';
        }
    }
};