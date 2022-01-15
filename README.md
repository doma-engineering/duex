# Duex

If you want recaptcha endpoint to work, decrypt dev.exs config with `passveil` and dump the captcha keyword list into the config under key `recaptcha`.

So `captcha: [secret: "xxx", public: "yyy"]` decrypted from secret storage sould become `recaptcha: [secret: "xxx", public: "yyy"]` in the config.

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
