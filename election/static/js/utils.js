$(function () {
        $(document).on('click', '.modal-button', function () {
            $('#id-modal-dialog').load($(this).attr("data-url").trim(), function () {
                $('#id-modal').modal({
                    backdrop: 'static',
                    keyboard: false
                });
                formAjaxSubmit('#id-modal')
            });
        });

        window.setTimeout(function () {
            $(".alert").slideUp(250, function () {
                $(this).remove();
            });
        }, 3000);


        var formAjaxSubmit = function (modal) {
            var XHR = new window.XMLHttpRequest();
            var form = $(modal).find("form");
            var loading = $(modal).find("#loading");
            $(form).submit(function (e) {
                formData = new FormData($(this)[0]);
                e.preventDefault();
                $(loading).css('visibility', 'visible');

                XHR = $.ajax({
                    url: $(this).attr('action'),
                    type: $(this).attr('method'),
                    success: function (xhr, ajaxOptions, thrownError) {
                        if ($(xhr).find('.has-error').length > 0) {
                            $(modal).find('.modal-dialog').html(xhr);
                            formAjaxSubmit(modal);
                        } else {
                            if (XHR.responseJSON !== undefined)
                                window.document.location = XHR.responseJSON['redirect'];
                            else
                                location.reload();
                        }
                    },
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false
                });
            });
        };
    }
);