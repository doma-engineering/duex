defmodule Duex.MixProject do
  use Mix.Project

  def project do
    [
      app: :duex,
      version: "0.1.0-pre",
      elixir: "~> 1.12",
      start_permanent: Mix.env() == :prod,
      description: "Arclight authenticated file upload server demo.",
      aliases: [
        test: "test --no-start",
      ],
      deps: deps()
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      extra_applications: [:logger],
      mod: {Duex.Application, []}
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:jason, "~> 1.3"},
      {:plug_cowboy, "~> 2.0"},
      {:credo, "~> 1.5", only: [:dev, :test], runtime: false},
      {:cors_plug, "~> 2.0"},
      {:dialyxir, "~> 1.1.0", [runtime: false]},
      {:doma_recaptcha, "~> 3.1.1-doma"},
      {:arclight, "~> 0.2.8-pre"},
      # {:arclight, path: "../arclight"},
      {:doma, "~> 1.0.0"}
    ]
  end
end
