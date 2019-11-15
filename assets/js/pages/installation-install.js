import $ from 'jquery';
import Router from 'router';
import Translator  from 'translator';

const iconBusy = '<i class="fa fa-circle-o-notch fa-spin"></i>',
      iconSuccess = '<i class="fa fa-check text-success"></i>',
      iconFail = '<i class="fa-times text-danger"></i>';

function ajaxStep (action, callback) {
    var step = $('#step-' + action),
        container = $('<div />', { 'class': 'pull-right icon' });

    var clone = container.clone();

    step.append(clone.append(iconBusy));

    $.ajax({
        url: Router.generate('sylius_flow_display', { 'stepName': 'process', 'action': action })
    }).done(function(response) {
        if (true === response.success) {
            clone.remove();
            step.append(container.append(iconSuccess));

            if (undefined !== callback) {
                callback();
            }
        } else {
            clone.remove();
            step.append(container.append(iconFail));
            $('#error-message').append(response.message);
        }
    })
        .fail(function(jqXHR) {
            clone.remove();
            step.append(container.append(iconFail));
            $('#error-message').append(jqXHR.statusText);
        });
}

ajaxStep('createdb', function() {
    ajaxStep('migrations', function() {
        $('.progress').remove();
        $('#install-title').text(Translator.trans('installation.process.title.done'));
        $('#continue_step').removeClass('disabled');
    });
});
