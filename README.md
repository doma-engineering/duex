# Duex

## Setup for captcha

If you want recaptcha endpoint to work, decrypt dev.exs config with `passveil` and dump the captcha keyword list into the config under key `doma_recaptcha`.

So `captcha: [secret: "xxx", public: "yyy"]` decrypted from secret storage sould become `recaptcha: [secret: "xxx", public: "yyy"]` in the config. See `dev.secret.exs.example` for inspiration.

## Setup for doauth

If you want doauth to work, you will need at least `:crypto/:secret_key_base` variable set under `:doma` Application meta-environment.

This is a [common pattern]() to get DoAuth working in tests, by the way.

You can configure it in your `dev.secret.exs` using variable `:crypto/:text__secret_key_base`. See `dev.secret.exs.example` for inspiration.

## Running

### Without direnv

```
nix develop path:.
./run
```

### With direnv

```
./run
```

### Without nix

Figure it out yourself.
