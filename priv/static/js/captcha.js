const recaptchaCallback = (sitekey, theme) => {
    if (typeof window.grecaptcha_widgets === 'undefined') {
        throw { captchaBackend: "grecaptcha", error: "grecaptcha_widgets global variable is undefined. Please define it like this: window.grecaptcha_widgets = { 'some_dom_id': undefined, 'some_other_dom_id': undefined }; and call this function only after you've configured your global state. Normally it's just going to be an object with a single DOM id of the element where you want to implant grecaptcha." };
    }
    for (var x in window.grecaptcha_widgets) {
        window.grecaptcha_widgets[x] = grecaptcha.render(x, { sitekey: sitekey, theme: (theme || 'light') });
    }
    return x + 1;
}
