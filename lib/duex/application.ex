defmodule Duex.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  import DynHacks

  require Logger

  @port 7092

  @impl true
  def start(_type, _args) do
    children = [
      # Starts a worker by calling: Duex.Worker.start_link(arg)
      # {Duex.Worker, arg}
      {Plug.Cowboy, scheme: :http, plug: DuexRouter, port: @port}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Duex.Supervisor]

    imp(
      Supervisor.start_link(children, opts),
      fn x ->
        Logger.info("Starting Duex on port #{inspect(@port)}: #{inspect(x)}")
      end
    )
  end
end
