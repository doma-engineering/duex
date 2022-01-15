import Config

config :logger,
  handle_otp_reports: true,
  handle_sasl_reports: true

import_config "#{Mix.env()}.secret.exs"
